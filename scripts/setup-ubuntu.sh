#!/usr/bin/env bash
# =============================================================
# Frameflow Ubuntu setup — nginx reverse proxy on port 675
# Idempotent: safe to run multiple times. Does NOT modify any
# existing nginx site config; only adds /etc/nginx/sites-available/frameflow.
# =============================================================
set -euo pipefail

# --- Configurable -------------------------------------------------------------
APP_NAME="frameflow"
APP_USER="${SUDO_USER:-$USER}"
APP_DIR="${APP_DIR:-/opt/${APP_NAME}}"
REPO_URL="${REPO_URL:-https://github.com/DtheGCoder/Frameflow.git}"
PUBLIC_PORT="${PUBLIC_PORT:-675}"      # external (nginx)
APP_PORT="${APP_PORT:-3675}"           # internal (Node, bound to 127.0.0.1)
NODE_MAJOR="${NODE_MAJOR:-20}"
# ------------------------------------------------------------------------------

# Colors
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
say()  { echo -e "${GREEN}[frameflow]${NC} $*"; }
warn() { echo -e "${YELLOW}[frameflow]${NC} $*"; }
die()  { echo -e "${RED}[frameflow]${NC} $*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || die "Run as root:  sudo bash $0"

say "Target: ${APP_DIR}  |  nginx :${PUBLIC_PORT}  →  node 127.0.0.1:${APP_PORT}  |  user: ${APP_USER}"

# --- 1. System packages -------------------------------------------------------
say "Installing system packages (nginx, git, curl, build tools)…"
apt-get update -y
apt-get install -y ca-certificates curl gnupg git nginx ufw

# --- 2. Node.js (NodeSource) --------------------------------------------------
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | sed 's/v\([0-9]*\).*/\1/')" -lt "${NODE_MAJOR}" ]]; then
  say "Installing Node.js ${NODE_MAJOR}.x from NodeSource…"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
else
  say "Node $(node -v) already installed — skipping."
fi

# --- 3. Clone / update the repository -----------------------------------------
if [[ -d "${APP_DIR}/.git" ]]; then
  say "Repo exists — pulling latest…"
  git -C "${APP_DIR}" fetch --all --prune
  git -C "${APP_DIR}" reset --hard origin/main 2>/dev/null || git -C "${APP_DIR}" pull --ff-only
else
  say "Cloning ${REPO_URL} → ${APP_DIR}…"
  mkdir -p "$(dirname "${APP_DIR}")"
  git clone "${REPO_URL}" "${APP_DIR}"
fi

chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}"

# --- 4. Install npm deps ------------------------------------------------------
say "Installing npm dependencies…"
sudo -u "${APP_USER}" -H bash -c "cd '${APP_DIR}' && npm install --omit=dev"

# --- 5. Persistent data dirs --------------------------------------------------
sudo -u "${APP_USER}" mkdir -p "${APP_DIR}/data" "${APP_DIR}/uploads"

# --- 6. systemd service -------------------------------------------------------
SERVICE_FILE="/etc/systemd/system/${APP_NAME}.service"
say "Writing ${SERVICE_FILE}…"
cat > "${SERVICE_FILE}" <<EOF
[Unit]
Description=Frameflow kiosk server
After=network.target

[Service]
Type=simple
User=${APP_USER}
WorkingDirectory=${APP_DIR}
Environment=NODE_ENV=production
Environment=PORT=${APP_PORT}
Environment=HOST=127.0.0.1
ExecStart=/usr/bin/node ${APP_DIR}/server.js
Restart=on-failure
RestartSec=3
StandardOutput=append:/var/log/${APP_NAME}.log
StandardError=append:/var/log/${APP_NAME}.err.log

[Install]
WantedBy=multi-user.target
EOF

touch /var/log/${APP_NAME}.log /var/log/${APP_NAME}.err.log
chown "${APP_USER}:${APP_USER}" /var/log/${APP_NAME}.log /var/log/${APP_NAME}.err.log

systemctl daemon-reload
systemctl enable "${APP_NAME}.service"
systemctl restart "${APP_NAME}.service"
sleep 1
systemctl --no-pager --full status "${APP_NAME}.service" | head -n 12 || true

# --- 7. nginx site (isolated, port ${PUBLIC_PORT}) ----------------------------
SITE_AVAIL="/etc/nginx/sites-available/${APP_NAME}"
SITE_ENABLED="/etc/nginx/sites-enabled/${APP_NAME}"

say "Writing ${SITE_AVAIL} (listen :${PUBLIC_PORT})…"
cat > "${SITE_AVAIL}" <<EOF
# Frameflow — isolated vhost on port ${PUBLIC_PORT}
# Managed by scripts/setup-ubuntu.sh. Do not edit by hand.
server {
    listen ${PUBLIC_PORT};
    listen [::]:${PUBLIC_PORT};
    server_name _;

    client_max_body_size 200m;

    # Long-lived WebSocket for Socket.IO
    location /socket.io/ {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 1d;
        proxy_send_timeout 1d;
    }

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300s;
    }

    access_log /var/log/nginx/${APP_NAME}.access.log;
    error_log  /var/log/nginx/${APP_NAME}.error.log;
}
EOF

ln -sf "${SITE_AVAIL}" "${SITE_ENABLED}"

say "Validating nginx config…"
if ! nginx -t; then
  die "nginx -t failed — refusing to reload. Leaving existing sites untouched."
fi

systemctl reload nginx

# --- 8. Firewall (optional but safe) ------------------------------------------
if command -v ufw >/dev/null 2>&1 && ufw status | grep -qi "Status: active"; then
  say "Opening UFW port ${PUBLIC_PORT}/tcp…"
  ufw allow "${PUBLIC_PORT}/tcp" || true
else
  warn "UFW inactive or missing — skipping firewall rule. Open ${PUBLIC_PORT}/tcp on your cloud firewall."
fi

# --- Done ---------------------------------------------------------------------
IP=$(hostname -I | awk '{print $1}')
say "✅ Done."
echo
echo "   Service:   systemctl status ${APP_NAME}"
echo "   Logs:      journalctl -u ${APP_NAME} -f   (also /var/log/${APP_NAME}.log)"
echo "   Nginx:     /etc/nginx/sites-available/${APP_NAME}"
echo "   URL:       http://${IP}:${PUBLIC_PORT}/"
echo "   Update:    cd ${APP_DIR} && sudo git pull && sudo systemctl restart ${APP_NAME}"
