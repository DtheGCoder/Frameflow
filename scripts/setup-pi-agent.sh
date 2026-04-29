#!/usr/bin/env bash
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "Run as root: sudo bash scripts/setup-pi-agent.sh" >&2
  exit 1
fi

APP_DIR="${APP_DIR:-/opt/Frameflow}"
PI_AGENT_PORT="${PI_AGENT_PORT:-8788}"
PI_AGENT_BIND="${PI_AGENT_BIND:-0.0.0.0}"
PI_AGENT_TOKEN="${PI_AGENT_TOKEN:-}"
PI_RELAY_SERVER_URL="${PI_RELAY_SERVER_URL:-}"
PI_RELAY_TOKEN="${PI_RELAY_TOKEN:-}"
PI_DEVICE_ID="${PI_DEVICE_ID:-$(hostname)}"

if [[ -z "$PI_AGENT_TOKEN" ]]; then
  echo "WARN: PI_AGENT_TOKEN is empty. Agent will accept unauthenticated LAN requests." >&2
fi

if [[ -z "$PI_RELAY_SERVER_URL" ]]; then
  echo "WARN: PI_RELAY_SERVER_URL not set. Relay mode (Pi -> Server) disabled." >&2
fi

if [[ ! -f "$APP_DIR/scripts/pi-agent.py" ]]; then
  echo "pi-agent.py not found under $APP_DIR/scripts" >&2
  exit 1
fi

chmod +x "$APP_DIR/scripts/pi-agent.py"
chmod +x "$APP_DIR/scripts/kiosk-control.sh" || true

SERVICE_FILE="/etc/systemd/system/frameflow-pi-agent.service"
cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=Frameflow Pi Control Agent
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
Environment=FRAMEFLOW_APP_DIR=$APP_DIR
Environment=FRAMEFLOW_PI_AGENT_BIND=$PI_AGENT_BIND
Environment=FRAMEFLOW_PI_AGENT_PORT=$PI_AGENT_PORT
Environment=FRAMEFLOW_PI_AGENT_TOKEN=$PI_AGENT_TOKEN
Environment=FRAMEFLOW_PI_AGENT_STATE=$APP_DIR/data/pi-agent.json
Environment=FRAMEFLOW_PI_RELAY_SERVER_URL=$PI_RELAY_SERVER_URL
Environment=FRAMEFLOW_PI_RELAY_TOKEN=$PI_RELAY_TOKEN
Environment=FRAMEFLOW_PI_DEVICE_ID=$PI_DEVICE_ID
ExecStart=/usr/bin/python3 $APP_DIR/scripts/pi-agent.py
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now frameflow-pi-agent.service

echo "OK"
echo "- service: frameflow-pi-agent"
echo "- bind: $PI_AGENT_BIND:$PI_AGENT_PORT"
echo "- relay server: ${PI_RELAY_SERVER_URL:-disabled}"
echo "- device id: $PI_DEVICE_ID"
echo "- app dir: $APP_DIR"
