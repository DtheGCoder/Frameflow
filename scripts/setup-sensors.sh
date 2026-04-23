#!/usr/bin/env bash
# One-shot installer for the Frameflow DHT22 + CCS811 sensor poller.
# Run on the Pi after enabling I²C (sudo raspi-config → Interface → I2C).
#
#   sudo bash scripts/setup-sensors.sh
#
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "Please run as root: sudo bash $0" >&2
  exit 1
fi

REPO_DIR="${REPO_DIR:-/opt/frameflow}"
SERVICE_USER="${SERVICE_USER:-frameflow}"

echo "[1/4] Installing OS packages…"
apt-get update -y
apt-get install -y --no-install-recommends \
  python3 python3-pip python3-venv i2c-tools libgpiod2 python3-libgpiod

echo "[2/4] Installing Python sensor libraries…"
pip3 install --break-system-packages --upgrade \
  adafruit-blinka \
  adafruit-circuitpython-dht \
  adafruit-circuitpython-ccs811 || true

echo "[3/4] Creating runtime directory /run/frameflow…"
install -d -o "${SERVICE_USER}" -g "${SERVICE_USER}" -m 0755 /run/frameflow || true
# /run is tmpfs, so the dir vanishes on reboot — recreate via tmpfiles.d:
cat >/etc/tmpfiles.d/frameflow.conf <<EOF
d /run/frameflow 0755 ${SERVICE_USER} ${SERVICE_USER} -
EOF
systemd-tmpfiles --create /etc/tmpfiles.d/frameflow.conf

echo "[4/4] Installing systemd unit frameflow-sensors.service…"
cat >/etc/systemd/system/frameflow-sensors.service <<EOF
[Unit]
Description=Frameflow DHT22 + CCS811 sensor poller
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
# DHT22 + CCS811 need direct access to GPIO/I²C — root is simplest on Pi.
WorkingDirectory=${REPO_DIR}
ExecStart=/usr/bin/python3 ${REPO_DIR}/scripts/sensors.py
Restart=on-failure
RestartSec=5
Environment=FRAMEFLOW_SENSOR_FILE=/run/frameflow/sensors.json
Environment=FRAMEFLOW_DHT_PIN=D4
Environment=FRAMEFLOW_SENSOR_INTERVAL=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now frameflow-sensors.service

echo ""
echo "✅ Sensor daemon running."
echo "    Live data file:  /run/frameflow/sensors.json"
echo "    Status:          systemctl status frameflow-sensors"
echo "    Logs:            journalctl -u frameflow-sensors -f"
