#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-status}"
TARGET_USER="${FRAMEFLOW_KIOSK_USER:-}"
if [[ -z "$TARGET_USER" ]]; then
  if [[ -n "${SUDO_USER:-}" && "${SUDO_USER}" != "root" ]]; then
    TARGET_USER="$SUDO_USER"
  elif getent passwd 1000 >/dev/null 2>&1; then
    TARGET_USER="$(getent passwd 1000 | cut -d: -f1)"
  else
    TARGET_USER="$(id -un)"
  fi
fi

TARGET_HOME="$(getent passwd "$TARGET_USER" | cut -d: -f6)"
if [[ -z "$TARGET_HOME" ]]; then
  TARGET_HOME="$HOME"
fi

AUTOSTART_DIR="${AUTOSTART_DIR:-$TARGET_HOME/.config/autostart}"
DESKTOP_FILE="$AUTOSTART_DIR/frameflow-kiosk.desktop"
DISABLED_FILE="$AUTOSTART_DIR/frameflow-kiosk.desktop.disabled"
KIOSK_SCRIPT="${KIOSK_SCRIPT:-$TARGET_HOME/.local/bin/frameflow-kiosk.sh}"
DISPLAY_VAL="${FRAMEFLOW_KIOSK_DISPLAY:-:0}"
XAUTH_FILE="${FRAMEFLOW_KIOSK_XAUTHORITY:-$TARGET_HOME/.Xauthority}"

stop_now() {
  pkill -u "$TARGET_USER" -f "$KIOSK_SCRIPT" 2>/dev/null || true
  pkill -u "$TARGET_USER" -f 'chromium.*--kiosk' 2>/dev/null || true
  pkill -u "$TARGET_USER" -f 'chromium-browser.*--kiosk' 2>/dev/null || true
}

start_now() {
  if [[ ! -x "$KIOSK_SCRIPT" ]]; then
    echo "Kiosk script fehlt: $KIOSK_SCRIPT" >&2
    exit 1
  fi
  stop_now
  sleep 1
  if [[ "$(id -un)" == "$TARGET_USER" ]]; then
    DISPLAY="$DISPLAY_VAL" XAUTHORITY="$XAUTH_FILE" nohup "$KIOSK_SCRIPT" >/tmp/frameflow-kiosk.out 2>/tmp/frameflow-kiosk.err &
  else
    runuser -u "$TARGET_USER" -- bash -lc "DISPLAY='$DISPLAY_VAL' XAUTHORITY='$XAUTH_FILE' nohup '$KIOSK_SCRIPT' >/tmp/frameflow-kiosk.out 2>/tmp/frameflow-kiosk.err &"
  fi
  sleep 1
  if ! pgrep -u "$TARGET_USER" -f "$KIOSK_SCRIPT" >/dev/null 2>&1; then
    echo "Kiosk Start fehlgeschlagen. Prüfe /tmp/frameflow-kiosk.err" >&2
    exit 1
  fi
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
    if pgrep -u "$TARGET_USER" -f "$KIOSK_SCRIPT" >/dev/null 2>&1; then
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
