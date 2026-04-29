#!/usr/bin/env bash
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "Run as root: sudo bash scripts/setup-remote-maintenance.sh" >&2
  exit 1
fi

APP_DIR="${APP_DIR:-/opt/frameflow}"
SERVICE_NAME="${SERVICE_NAME:-frameflow}"
SERVICE_USER="$(systemctl show -p User --value "$SERVICE_NAME" 2>/dev/null || true)"
if [[ -z "$SERVICE_USER" ]]; then
  SERVICE_USER="frameflow"
fi

SUDOERS_FILE="/etc/sudoers.d/frameflow-remote-maintenance"

if [[ ! -d "$APP_DIR" ]]; then
  echo "App directory not found: $APP_DIR" >&2
  exit 1
fi

chmod +x "$APP_DIR/scripts/kiosk-control.sh" || true
chmod +x "$APP_DIR/scripts/setup-kiosk.sh" || true

cat > "$SUDOERS_FILE" <<EOF
# Frameflow remote maintenance permissions (generated)
Defaults:${SERVICE_USER} !requiretty
${SERVICE_USER} ALL=(root) NOPASSWD: /usr/bin/systemctl start frameflow
${SERVICE_USER} ALL=(root) NOPASSWD: /usr/bin/systemctl stop frameflow
${SERVICE_USER} ALL=(root) NOPASSWD: /usr/bin/systemctl restart frameflow
${SERVICE_USER} ALL=(root) NOPASSWD: /usr/bin/git -C /opt/frameflow pull --ff-only
${SERVICE_USER} ALL=(root) NOPASSWD: /usr/bin/npm --prefix /opt/frameflow install --omit=dev
${SERVICE_USER} ALL=(root) NOPASSWD: /usr/sbin/reboot
EOF

chmod 440 "$SUDOERS_FILE"
visudo -cf "$SUDOERS_FILE"

echo "OK"
echo "- service user: $SERVICE_USER"
echo "- sudoers: $SUDOERS_FILE"
echo "- kiosk control: $APP_DIR/scripts/kiosk-control.sh"
