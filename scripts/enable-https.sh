#!/usr/bin/env bash
# =============================================================
# Frameflow — HTTPS on a custom port (default 675)
# Uses Let's Encrypt via webroot HTTP-01. A minimal :80 vhost
# is added that ONLY matches the given DOMAIN and ONLY serves
# /.well-known/acme-challenge/ — other :80 sites are unaffected
# because they have different server_name values.
#
# Usage:
#   sudo DOMAIN=anonymchat.digital EMAIL=you@example.com \
#        bash enable-https.sh
#
# Optional overrides:
#   HTTPS_PORT=675   APP_PORT=3675
# =============================================================
set -euo pipefail

APP_NAME="frameflow"
APP_PORT="${APP_PORT:-3675}"
HTTPS_PORT="${HTTPS_PORT:-675}"
ACME_WEBROOT="/var/www/${APP_NAME}-acme"
SITE_AVAIL="/etc/nginx/sites-available/${APP_NAME}"
SITE_ENABLED="/etc/nginx/sites-enabled/${APP_NAME}"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
say()  { echo -e "${GREEN}[frameflow-https]${NC} $*"; }
warn() { echo -e "${YELLOW}[frameflow-https]${NC} $*"; }
die()  { echo -e "${RED}[frameflow-https]${NC} $*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || die "Run as root:  sudo DOMAIN=… EMAIL=… bash $0"
[[ -n "${DOMAIN:-}" ]] || die "Set DOMAIN=yourdomain.tld"
[[ -n "${EMAIL:-}"  ]] || die "Set EMAIL=you@yourdomain.tld"

say "Domain=${DOMAIN}  HTTPS=${HTTPS_PORT}  Node=127.0.0.1:${APP_PORT}"

apt-get update -y
apt-get install -y certbot

mkdir -p "${ACME_WEBROOT}/.well-known/acme-challenge"
chown -R www-data:www-data "${ACME_WEBROOT}"

# --- Step 1: :80 vhost scoped to this domain, only for ACME + redirect --------
say "Writing temporary ACME :80 vhost for ${DOMAIN}…"
cat > "${SITE_AVAIL}" <<EOF
# Frameflow — managed by scripts/enable-https.sh. Do not edit by hand.

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location /.well-known/acme-challenge/ {
        root ${ACME_WEBROOT};
        default_type "text/plain";
    }

    location / {
        return 301 https://\$host:${HTTPS_PORT}\$request_uri;
    }
}
EOF

ln -sf "${SITE_AVAIL}" "${SITE_ENABLED}"
nginx -t || die "nginx -t failed while adding ACME vhost."
systemctl reload nginx

# --- Step 2: Obtain certificate via webroot -----------------------------------
say "Requesting Let's Encrypt certificate…"
certbot certonly --webroot \
  -w "${ACME_WEBROOT}" \
  -d "${DOMAIN}" \
  --email "${EMAIL}" --agree-tos --non-interactive \
  --keep-until-expiring

CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"
[[ -f "${CERT_DIR}/fullchain.pem" ]] || die "Cert not found at ${CERT_DIR}"

# --- Step 3: Full vhost with TLS on HTTPS_PORT --------------------------------
say "Writing final vhost (TLS on :${HTTPS_PORT})…"
cat > "${SITE_AVAIL}" <<EOF
# Frameflow — managed by scripts/enable-https.sh. Do not edit by hand.

# :80 stays only for ACME renewals and redirects browsers to HTTPS.
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location /.well-known/acme-challenge/ {
        root ${ACME_WEBROOT};
        default_type "text/plain";
    }

    location / {
        return 301 https://\$host:${HTTPS_PORT}\$request_uri;
    }
}

# Main HTTPS vhost on custom port.
server {
    listen ${HTTPS_PORT} ssl;
    listen [::]:${HTTPS_PORT} ssl;
    server_name ${DOMAIN};

    ssl_certificate     ${CERT_DIR}/fullchain.pem;
    ssl_certificate_key ${CERT_DIR}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

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

nginx -t || die "nginx -t failed after writing final vhost."
systemctl reload nginx

# --- Step 4: Firewall ---------------------------------------------------------
if command -v ufw >/dev/null 2>&1 && ufw status | grep -qi "Status: active"; then
  say "Opening UFW ports 80 and ${HTTPS_PORT}/tcp…"
  ufw allow 80/tcp || true
  ufw allow "${HTTPS_PORT}/tcp" || true
fi

# --- Step 5: Ensure auto-renewal reloads nginx --------------------------------
RENEW_HOOK="/etc/letsencrypt/renewal-hooks/deploy/${APP_NAME}-reload.sh"
mkdir -p "$(dirname "${RENEW_HOOK}")"
cat > "${RENEW_HOOK}" <<'EOF'
#!/bin/sh
systemctl reload nginx
EOF
chmod +x "${RENEW_HOOK}"

say "✅ HTTPS ready:  https://${DOMAIN}:${HTTPS_PORT}/"
echo "   Test renewal:  sudo certbot renew --dry-run"
echo "   Auto-renew handled by certbot.timer; nginx is reloaded via deploy hook."
