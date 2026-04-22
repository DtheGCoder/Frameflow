#!/usr/bin/env bash
# =============================================================
# Frameflow — add HTTPS via Let's Encrypt (certbot + nginx)
# Idempotent. Safe: only touches the frameflow vhost.
#
# Usage:
#   sudo DOMAIN=frame.example.com EMAIL=you@example.com \
#        bash enable-https.sh
#
# Optional:
#   KEEP_PORT=675          # also keep the plain :675 vhost reachable
# =============================================================
set -euo pipefail

APP_NAME="frameflow"
APP_PORT="${APP_PORT:-3675}"
SITE_AVAIL="/etc/nginx/sites-available/${APP_NAME}"
SITE_ENABLED="/etc/nginx/sites-enabled/${APP_NAME}"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
say()  { echo -e "${GREEN}[frameflow-https]${NC} $*"; }
warn() { echo -e "${YELLOW}[frameflow-https]${NC} $*"; }
die()  { echo -e "${RED}[frameflow-https]${NC} $*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || die "Run as root:  sudo DOMAIN=… EMAIL=… bash $0"
[[ -n "${DOMAIN:-}" ]] || die "Set DOMAIN=yourdomain.tld"
[[ -n "${EMAIL:-}"  ]] || die "Set EMAIL=you@yourdomain.tld (for Let's Encrypt notices)"

say "Installing certbot…"
apt-get update -y
apt-get install -y certbot python3-certbot-nginx

# --- Rewrite the frameflow vhost so nginx listens on :80 for the domain ------
say "Writing ${SITE_AVAIL} for domain ${DOMAIN}…"
cat > "${SITE_AVAIL}" <<EOF
# Frameflow — HTTPS-enabled vhost. Managed by scripts/enable-https.sh.
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    client_max_body_size 200m;

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

# Optional: keep the plain :675 vhost alongside
if [[ -n "${KEEP_PORT:-}" ]]; then
  say "Also keeping plain :${KEEP_PORT} access (no TLS)…"
  cat >> "${SITE_AVAIL}" <<EOF

server {
    listen ${KEEP_PORT};
    listen [::]:${KEEP_PORT};
    server_name _;

    client_max_body_size 200m;

    location /socket.io/ {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_read_timeout 1d;
    }
    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }
}
EOF
fi

ln -sf "${SITE_AVAIL}" "${SITE_ENABLED}"

say "Validating nginx config…"
nginx -t || die "nginx -t failed — not reloading."
systemctl reload nginx

# --- Firewall ------------------------------------------------------------------
if command -v ufw >/dev/null 2>&1 && ufw status | grep -qi "Status: active"; then
  say "Opening UFW 80/tcp and 443/tcp…"
  ufw allow 80/tcp  || true
  ufw allow 443/tcp || true
fi

# --- Certbot -------------------------------------------------------------------
say "Requesting Let's Encrypt certificate for ${DOMAIN}…"
certbot --nginx \
  --non-interactive --agree-tos \
  --redirect \
  --email "${EMAIL}" \
  -d "${DOMAIN}"

systemctl reload nginx

say "✅ HTTPS ready:  https://${DOMAIN}/"
echo "   Auto-renewal is handled by the certbot.timer systemd unit."
echo "   Test renewal:  sudo certbot renew --dry-run"
