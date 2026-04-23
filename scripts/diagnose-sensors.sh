#!/usr/bin/env bash
# Diagnose the Pi → server sensor push pipeline.
# Run with:
#   bash scripts/diagnose-sensors.sh
# No arguments needed.

SERVER="https://anonymchat.digital:675"
TOKEN="3cf3b3582429bb6223e8d9b94351587f030ebc6f80c8a8dd05e6aad50da3af2b"

line() { printf '\n\e[1;36m─── %s ───\e[0m\n' "$1"; }

line "1. local sensor daemon on this Pi"
systemctl is-active frameflow-sensors || true
systemctl show frameflow-sensors \
  | grep -E "FRAMEFLOW_(PUSH_URL|PUSH_TOKEN|SENSOR_HTTP_PORT)" \
  || echo "  (no FRAMEFLOW_* environment variables set!)"

line "2. local sensor values (must show numbers)"
curl -s --max-time 4 http://localhost:8787/sensors \
  || echo "  (cannot reach local sensor daemon on :8787)"
echo ""

line "3. direct POST to the Frameflow server"
resp=$(curl -s -o /tmp/ingest.body -w "HTTP %{http_code}" \
  -X POST "${SERVER}/api/sensors/ingest" \
  -H "X-Sensor-Token: ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"temperature":22.5,"humidity":44,"eco2":620,"updatedAt":'"$(date +%s%3N)"'}')
echo "  → ${resp}"
echo "  body: $(cat /tmp/ingest.body)"

line "4. read the value back from the server"
curl -s --max-time 4 "${SERVER}/api/sensors"
echo ""

line "5. last 20 lines of the daemon log"
sudo journalctl -u frameflow-sensors -n 20 --no-pager

line "done — copy this whole output to Copilot"
