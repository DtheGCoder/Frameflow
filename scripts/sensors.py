#!/usr/bin/env python3
"""
Frameflow sensor poller.

Reads a DHT22 (temperature + humidity) and a CCS811 (eCO2 + TVOC / air-quality)
every 10 seconds and writes the latest readings to /run/frameflow/sensors.json.

The Node.js server exposes this file at /api/sensors so the kiosk view can
render a live widget next to the clock/weather.

Wiring (Raspberry Pi 40-pin header):

    DHT22 (3 active pins)
        VCC  -> pin  1  (3.3 V)
        DATA -> pin  7  (GPIO 4)        + 10 kΩ pull-up between DATA and VCC
        GND  -> pin  9  (GND)

    CCS811 (I²C)
        VCC  -> pin 17  (3.3 V)
        GND  -> pin 25  (GND)
        SDA  -> pin  3  (GPIO 2 / I2C1 SDA)
        SCL  -> pin  5  (GPIO 3 / I2C1 SCL)
        WAK  -> pin  9  (GND)   # tie to ground to keep the sensor awake
        RST, INT, ADD -> leave floating

Enable I²C first:  sudo raspi-config  → Interface Options → I2C → Yes, reboot.
"""

from __future__ import annotations

import json
import os
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

OUTPUT = Path(os.environ.get("FRAMEFLOW_SENSOR_FILE", "/run/frameflow/sensors.json"))
DHT_PIN_NAME = os.environ.get("FRAMEFLOW_DHT_PIN", "D4")   # GPIO 4 (physical pin 7)
POLL_INTERVAL = float(os.environ.get("FRAMEFLOW_SENSOR_INTERVAL", "10"))

# Optional HTTP publisher so a remote Frameflow server can read the values.
# Set FRAMEFLOW_SENSOR_HTTP_PORT=0 to disable.
HTTP_PORT = int(os.environ.get("FRAMEFLOW_SENSOR_HTTP_PORT", "8787"))
HTTP_BIND = os.environ.get("FRAMEFLOW_SENSOR_HTTP_BIND", "0.0.0.0")

# ---------------------------------------------------------------------------
# Lazy imports so the script still starts with a clear error if a library is
# missing, instead of crashing on import at the very top.
# ---------------------------------------------------------------------------
def _import_libs():
    import board  # noqa: F401
    import busio
    import adafruit_dht
    import adafruit_ccs811
    return board, busio, adafruit_dht, adafruit_ccs811


def _aqi_label(eco2: int | None) -> str:
    if eco2 is None:
        return "—"
    if eco2 < 600:
        return "sehr gut"
    if eco2 < 800:
        return "gut"
    if eco2 < 1000:
        return "ok"
    if eco2 < 1500:
        return "mäßig"
    if eco2 < 2000:
        return "schlecht"
    return "kritisch"


def write_json(payload: dict) -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    tmp = OUTPUT.with_suffix(".tmp")
    tmp.write_text(json.dumps(payload), encoding="utf-8")
    tmp.replace(OUTPUT)


# ---------------------------------------------------------------------------
# Tiny HTTP publisher.  The remote Frameflow server polls  GET /sensors.
# ---------------------------------------------------------------------------
_state_lock = threading.Lock()
_state: dict = {
    "updatedAt": None,
    "temperature": None,
    "humidity": None,
    "eco2": None,
    "tvoc": None,
    "aqi": "—",
    "error": None,
}


class _Handler(BaseHTTPRequestHandler):
    def do_GET(self):  # noqa: N802 (stdlib API)
        if self.path.rstrip("/") not in ("", "/sensors", "/api/sensors"):
            self.send_response(404)
            self.end_headers()
            return
        with _state_lock:
            payload = json.dumps(dict(_state)).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, fmt, *args):  # silence access log
        return


def start_http_server():
    if HTTP_PORT <= 0:
        return None
    try:
        srv = ThreadingHTTPServer((HTTP_BIND, HTTP_PORT), _Handler)
    except OSError as exc:
        sys.stderr.write(f"[frameflow-sensors] http server failed: {exc}\n")
        return None
    t = threading.Thread(target=srv.serve_forever, daemon=True, name="sensor-http")
    t.start()
    sys.stderr.write(
        f"[frameflow-sensors] serving http://{HTTP_BIND}:{HTTP_PORT}/sensors\n"
    )
    return srv


def main() -> int:
    try:
        board, busio, adafruit_dht, adafruit_ccs811 = _import_libs()
    except Exception as exc:  # pragma: no cover
        sys.stderr.write(
            f"[frameflow-sensors] missing python libs: {exc}\n"
            "Install with:\n"
            "  sudo pip3 install --break-system-packages "
            "adafruit-circuitpython-dht adafruit-circuitpython-ccs811\n"
        )
        return 2

    # DHT22 on the pin named via FRAMEFLOW_DHT_PIN (default D4 / GPIO 4).
    dht_pin = getattr(board, DHT_PIN_NAME)
    dht = adafruit_dht.DHT22(dht_pin, use_pulseio=False)

    # CCS811 on the default I²C bus.
    i2c = busio.I2C(board.SCL, board.SDA)
    ccs = None
    try:
        ccs = adafruit_ccs811.CCS811(i2c)
        # Wait for the sensor to come up the first time it is powered.
        t0 = time.time()
        while not ccs.data_ready and time.time() - t0 < 30:
            time.sleep(0.5)
    except Exception as exc:
        sys.stderr.write(f"[frameflow-sensors] CCS811 init failed: {exc}\n")
        ccs = None

    last = {
        "updatedAt": None,
        "temperature": None,
        "humidity": None,
        "eco2": None,
        "tvoc": None,
        "aqi": "—",
        "error": None,
    }

    start_http_server()

    while True:
        entry = dict(last)
        entry["error"] = None

        # --- DHT22 ---
        try:
            t = dht.temperature
            h = dht.humidity
            if t is not None:
                entry["temperature"] = round(float(t), 1)
            if h is not None:
                entry["humidity"] = round(float(h), 1)
        except Exception as exc:
            # DHT22 frequently times out, that's fine — keep last good value.
            entry["error"] = f"dht: {exc}"

        # --- CCS811 ---
        if ccs is not None:
            try:
                if ccs.data_ready:
                    entry["eco2"] = int(ccs.eco2)
                    entry["tvoc"] = int(ccs.tvoc)
                    entry["aqi"] = _aqi_label(entry["eco2"])
                    # Feed environmental data back to the CCS811 so it
                    # compensates for the room temperature / humidity.
                    if entry["temperature"] is not None and entry["humidity"] is not None:
                        try:
                            ccs.set_environmental_data(
                                int(entry["humidity"]),
                                float(entry["temperature"]),
                            )
                        except Exception:
                            pass
            except Exception as exc:
                prev = entry.get("error")
                entry["error"] = f"{prev + '; ' if prev else ''}ccs: {exc}"

        entry["updatedAt"] = int(time.time() * 1000)
        last = entry
        with _state_lock:
            _state.clear()
            _state.update(entry)
        try:
            write_json(entry)
        except Exception as exc:
            sys.stderr.write(f"[frameflow-sensors] write failed: {exc}\n")

        time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        sys.exit(0)
