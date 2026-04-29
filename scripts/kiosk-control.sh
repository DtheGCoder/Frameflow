#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-status}"
AUTOSTART_DIR="${AUTOSTART_DIR:-$HOME/.config/autostart}"
DESKTOP_FILE="$AUTOSTART_DIR/frameflow-kiosk.desktop"
DISABLED_FILE="$AUTOSTART_DIR/frameflow-kiosk.desktop.disabled"
KIOSK_SCRIPT="${KIOSK_SCRIPT:-$HOME/.local/bin/frameflow-kiosk.sh}"

stop_now() {
  pkill -f "$KIOSK_SCRIPT" 2>/dev/null || true
  pkill -f 'chromium.*--kiosk' 2>/dev/null || true
  pkill -f 'chromium-browser.*--kiosk' 2>/dev/null || true
}

start_now() {
  if [[ ! -x "$KIOSK_SCRIPT" ]]; then
    echo "Kiosk script fehlt: $KIOSK_SCRIPT" >&2
    exit 1
  fi
  nohup "$KIOSK_SCRIPT" >/tmp/frameflow-kiosk.out 2>/tmp/frameflow-kiosk.err &
}

case "$ACTION" in
  stop)
    stop_now
    echo "Kiosk gestoppt"
    ;;
  start)
    start_now
    echo "Kiosk gestartet"
    ;;
  restart)
    stop_now
    sleep 1
    start_now
    echo "Kiosk neugestartet"
    ;;
  pause)
    mkdir -p "$AUTOSTART_DIR"
    if [[ -f "$DESKTOP_FILE" ]]; then
      mv "$DESKTOP_FILE" "$DISABLED_FILE"
    fi
    stop_now
    echo "Kiosk pausiert (Autostart deaktiviert)"
    ;;
  resume)
    mkdir -p "$AUTOSTART_DIR"
    if [[ -f "$DISABLED_FILE" ]]; then
      mv "$DISABLED_FILE" "$DESKTOP_FILE"
    fi
    start_now
    echo "Kiosk fortgesetzt (Autostart aktiv)"
    ;;
  status)
    if pgrep -f "$KIOSK_SCRIPT" >/dev/null 2>&1; then
      echo "running"
    else
      echo "stopped"
    fi
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|pause|resume|status}" >&2
    exit 2
    ;;
esac
