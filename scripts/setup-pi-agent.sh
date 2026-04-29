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

if [[ -z "$PI_AGENT_TOKEN" ]]; then
  echo "Missing PI_AGENT_TOKEN. Example:" >&2
  echo "  sudo PI_AGENT_TOKEN=<long-random-token> bash scripts/setup-pi-agent.sh" >&2
  exit 1
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
echo "- app dir: $APP_DIR"
