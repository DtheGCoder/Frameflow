#!/usr/bin/env python3
import json
import os
import shlex
import subprocess
import threading
import time
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

BIND = os.environ.get('FRAMEFLOW_PI_AGENT_BIND', '0.0.0.0')
PORT = int(os.environ.get('FRAMEFLOW_PI_AGENT_PORT', '8788'))
TOKEN = os.environ.get('FRAMEFLOW_PI_AGENT_TOKEN', '')
APP_DIR = os.environ.get('FRAMEFLOW_APP_DIR', '/opt/Frameflow')
STATE_FILE = os.environ.get('FRAMEFLOW_PI_AGENT_STATE', '/opt/Frameflow/data/pi-agent.json')
RELAY_SERVER = os.environ.get('FRAMEFLOW_PI_RELAY_SERVER_URL', '').rstrip('/')
RELAY_TOKEN = os.environ.get('FRAMEFLOW_PI_RELAY_TOKEN', '')
DEVICE_ID = os.environ.get('FRAMEFLOW_PI_DEVICE_ID', os.uname().nodename)


def load_state():
    fallback = {'autoUpdateEnabled': False, 'autoUpdateIntervalMin': 30}
    try:
        with open(STATE_FILE, 'r', encoding='utf-8') as fh:
            raw = json.load(fh)
        return {
            'autoUpdateEnabled': bool(raw.get('autoUpdateEnabled', False)),
            'autoUpdateIntervalMin': max(5, min(720, int(raw.get('autoUpdateIntervalMin', 30)))),
        }
    except Exception:
        return fallback


def save_state(state):
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, 'w', encoding='utf-8') as fh:
        json.dump(state, fh, ensure_ascii=True, indent=2)


def run_shell(command, timeout=30):
    proc = subprocess.run(
        ['bash', '-lc', command],
        capture_output=True,
        text=True,
        timeout=timeout,
        check=False,
    )
    out = (proc.stdout or '').strip()
    err = (proc.stderr or '').strip()
    return proc.returncode, out, err


def run_nmcli(args):
    proc = subprocess.run(['nmcli', *args], capture_output=True, text=True, timeout=10, check=False)
    if proc.returncode != 0:
        raise RuntimeError((proc.stderr or proc.stdout or 'nmcli failed').strip())
    return (proc.stdout or '').strip()


def split_nmcli_fields(line):
    fields = []
    current = ''
    escaped = False
    for ch in str(line or ''):
        if escaped:
            current += ch
            escaped = False
            continue
        if ch == '\\':
            escaped = True
            continue
        if ch == ':':
            fields.append(current)
            current = ''
            continue
        current += ch
    fields.append(current)
    return fields


def get_wifi_interface():
    raw = run_nmcli(['-t', '-f', 'DEVICE,TYPE,STATE', 'device', 'status'])
    for line in [x for x in raw.splitlines() if x.strip()]:
        parts = split_nmcli_fields(line)
        if len(parts) >= 3 and parts[1] == 'wifi':
            return {'device': parts[0], 'state': parts[2] or 'unknown'}
    return None


def get_saved_connections():
    raw = run_nmcli(['-t', '-f', 'NAME,TYPE,AUTOCONNECT,ACTIVE,DEVICE', 'connection', 'show'])
    out = []
    for line in [x for x in raw.splitlines() if x.strip()]:
        parts = split_nmcli_fields(line)
        if len(parts) < 5 or parts[1] != 'wifi' or not parts[0]:
            continue
        out.append({
            'name': parts[0],
            'ssid': parts[0],
            'autoconnect': parts[2] == 'yes',
            'active': parts[3] == 'yes',
            'device': parts[4] or '',
        })
    return out


def wifi_status():
    wifi = get_wifi_interface()
    if not wifi:
        return 404, {'supported': False, 'error': 'Kein WLAN-Interface gefunden.'}
    detail = run_nmcli(['-t', '-f', 'GENERAL.CONNECTION,IP4.ADDRESS', 'device', 'show', wifi['device']])
    ssid = ''
    ip = ''
    for line in detail.splitlines():
        if line.startswith('GENERAL.CONNECTION:'):
            ssid = ':'.join(line.split(':')[1:]).strip()
        if line.startswith('IP4.ADDRESS[') or line.startswith('IP4.ADDRESS:'):
            val = ':'.join(line.split(':')[1:]).strip()
            if val and not ip:
                ip = val.split('/')[0]
    return 200, {
        'supported': True,
        'device': wifi['device'],
        'state': wifi['state'],
        'ssid': '' if ssid == '--' else ssid,
        'ip': ip,
    }


def wifi_scan():
    raw = run_nmcli(['-t', '-f', 'ACTIVE,SSID,SIGNAL,SECURITY', 'device', 'wifi', 'list', '--rescan', 'yes'])
    dedup = {}
    for line in [x for x in raw.splitlines() if x.strip()]:
        active, ssid, signal, security = (split_nmcli_fields(line) + ['', '', '', ''])[:4]
        clean = str(ssid or '').strip()
        if not clean:
            continue
        item = {
            'ssid': clean,
            'signal': int(signal) if str(signal).isdigit() else 0,
            'security': security or 'open',
            'active': active == 'yes',
        }
        prev = dedup.get(clean)
        if prev is None or item['signal'] > prev['signal'] or item['active']:
            dedup[clean] = item
    networks = sorted(dedup.values(), key=lambda n: (not n['active'], -n['signal']))
    return 200, {'networks': networks}


def wifi_connect(payload):
    ssid = str((payload or {}).get('ssid', '')).strip()[:80]
    password = str((payload or {}).get('password', ''))
    if not ssid:
        return 400, {'error': 'SSID fehlt.'}
    wifi = get_wifi_interface()
    if not wifi:
        return 404, {'error': 'Kein WLAN-Interface gefunden.'}
    saved = get_saved_connections()
    known = next((x for x in saved if x['ssid'].lower() == ssid.lower()), None)
    if known and not password:
        out = run_nmcli(['connection', 'up', 'id', known['name'], 'ifname', wifi['device']])
    else:
        args = ['device', 'wifi', 'connect', ssid, 'ifname', wifi['device']]
        if password:
            args += ['password', password]
        out = run_nmcli(args)
    return 200, {'ok': True, 'message': out or f'Verbunden mit {ssid}.'}


def wifi_auto_connect():
    wifi = get_wifi_interface()
    if not wifi:
        return 404, {'error': 'Kein WLAN-Interface gefunden.'}
    saved = get_saved_connections()
    by_ssid = {x['ssid'].lower(): x for x in saved}
    status, scan_payload = wifi_scan()
    if status != 200:
        return status, scan_payload
    visible = [x for x in scan_payload['networks'] if x['ssid'].lower() in by_ssid]
    if not visible:
        return 200, {'ok': False, 'message': 'Kein bekanntes WLAN in Reichweite.'}
    visible.sort(key=lambda n: (not n['active'], -n['signal']))
    target = visible[0]
    profile = by_ssid[target['ssid'].lower()]
    run_nmcli(['connection', 'up', 'id', profile['name'], 'ifname', wifi['device']])
    return 200, {'ok': True, 'ssid': target['ssid'], 'message': f"Automatisch verbunden: {target['ssid']}"}


def maint_status(state):
    _, service_state, _ = run_shell('systemctl is-active frameflow || true')
    code, kiosk_state, _ = run_shell(f'{shlex.quote(APP_DIR)}/scripts/kiosk-control.sh status || true')
    if code != 0 or not kiosk_state:
        _, kiosk_state, _ = run_shell('pgrep -f "chromium.*--kiosk" >/dev/null && echo running || echo stopped')
    _, git_head, _ = run_shell(f'git -C {shlex.quote(APP_DIR)} rev-parse --short HEAD || true')
    return 200, {
        'serviceState': service_state or 'unknown',
        'kioskState': kiosk_state or 'unknown',
        'gitHead': git_head or '-',
        'autoUpdate': state,
        'host': os.uname().nodename,
    }


def maint_set_auto_update(payload):
    state = {
        'autoUpdateEnabled': bool((payload or {}).get('autoUpdateEnabled', False)),
        'autoUpdateIntervalMin': max(5, min(720, int((payload or {}).get('autoUpdateIntervalMin', 30))))
    }
    save_state(state)
    return 200, {'ok': True, 'autoUpdate': state}


def maint_action(payload):
    action = str((payload or {}).get('action', '')).strip()
    actions = {
        'frameflowRestart': ("/usr/bin/systemctl restart frameflow", 30),
        'frameflowStop': ("/usr/bin/systemctl stop frameflow", 30),
        'frameflowStart': ("/usr/bin/systemctl start frameflow", 30),
        'kioskStart': (f"{shlex.quote(APP_DIR)}/scripts/kiosk-control.sh start", 30),
        'kioskStop': (f"{shlex.quote(APP_DIR)}/scripts/kiosk-control.sh stop", 30),
        'kioskRestart': (f"{shlex.quote(APP_DIR)}/scripts/kiosk-control.sh restart", 30),
        'kioskPause': (f"{shlex.quote(APP_DIR)}/scripts/kiosk-control.sh pause", 30),
        'kioskResume': (f"{shlex.quote(APP_DIR)}/scripts/kiosk-control.sh resume", 30),
        'pullUpdate': (f"/usr/bin/git -C {shlex.quote(APP_DIR)} pull --ff-only", 120),
        'fullUpdate': (f"/usr/bin/git -C {shlex.quote(APP_DIR)} pull --ff-only && /usr/bin/npm --prefix {shlex.quote(APP_DIR)} install --omit=dev", 240),
        'setupKiosk': (f"cd {shlex.quote(APP_DIR)} && bash scripts/setup-kiosk.sh", 180),
        'rebootHost': ("/usr/sbin/reboot", 10),
    }
    if action not in actions:
        return 400, {'error': 'Unbekannte Aktion.'}
    cmd, timeout = actions[action]
    code, out, err = run_shell(cmd, timeout=timeout)
    if code != 0:
        return 500, {'error': err or out or 'Aktion fehlgeschlagen.'}
    text = '\n'.join([x for x in [out, err] if x]).strip() or 'OK'
    return 200, {'ok': True, 'action': action, 'output': text}


def _relay_request(path, body, timeout=12):
    if not RELAY_SERVER:
        raise RuntimeError('relay server missing')
    url = f"{RELAY_SERVER}{path}"
    data = json.dumps(body or {}, ensure_ascii=True).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Content-Type', 'application/json')
    if RELAY_TOKEN:
        req.add_header('X-Frameflow-Token', RELAY_TOKEN)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        raw = resp.read().decode('utf-8')
    return json.loads(raw) if raw else {}


def execute_relay_command(command):
    ctype = str((command or {}).get('type', '')).strip()
    payload = (command or {}).get('payload', {}) or {}
    if ctype == 'wifi.status':
        status, body = wifi_status()
    elif ctype == 'wifi.scan':
        status, body = wifi_scan()
    elif ctype == 'wifi.saved':
        status, body = 200, {'connections': get_saved_connections()}
    elif ctype == 'wifi.connect':
        status, body = wifi_connect(payload)
    elif ctype == 'wifi.autoConnect':
        status, body = wifi_auto_connect()
    elif ctype == 'maintenance.status':
        status, body = maint_status(load_state())
    elif ctype == 'maintenance.autoUpdate.set':
        status, body = maint_set_auto_update(payload)
    elif ctype == 'maintenance.action':
        status, body = maint_action(payload)
    else:
        status, body = 400, {'error': f'unknown command type: {ctype}'}
    return {'status': status, 'body': body}


def relay_loop():
    if not RELAY_SERVER:
        return
    while True:
        try:
            poll = _relay_request('/api/pi/relay/poll', {
                'deviceId': DEVICE_ID,
                'host': os.uname().nodename,
            }, timeout=15)
            cmd = poll.get('command') if isinstance(poll, dict) else None
            if cmd and cmd.get('id'):
                try:
                    result = execute_relay_command(cmd)
                    _relay_request('/api/pi/relay/result', {
                        'deviceId': DEVICE_ID,
                        'commandId': cmd.get('id'),
                        'ok': True,
                        'body': result,
                    }, timeout=20)
                except Exception as exc:
                    _relay_request('/api/pi/relay/result', {
                        'deviceId': DEVICE_ID,
                        'commandId': cmd.get('id'),
                        'ok': False,
                        'error': str(exc),
                    }, timeout=20)
            time.sleep(1.5)
        except Exception:
            time.sleep(3)


class Handler(BaseHTTPRequestHandler):
    def _send(self, status, payload):
        body = json.dumps(payload, ensure_ascii=True).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _json(self):
        size = int(self.headers.get('Content-Length', '0') or '0')
        if size <= 0:
            return {}
        data = self.rfile.read(size)
        try:
            return json.loads(data.decode('utf-8'))
        except Exception:
            return {}

    def _auth(self):
        if not TOKEN:
            return True
        return self.headers.get('X-Frameflow-Token', '') == TOKEN

    def do_GET(self):
        if self.path == '/health':
            self._send(200, {'ok': True})
            return
        if not self._auth():
            self._send(401, {'error': 'unauthorized'})
            return
        try:
            state = load_state()
            if self.path == '/api/pi/wifi/status':
                status, payload = wifi_status()
            elif self.path == '/api/pi/wifi/scan':
                status, payload = wifi_scan()
            elif self.path == '/api/pi/wifi/saved':
                status, payload = 200, {'connections': get_saved_connections()}
            elif self.path == '/api/pi/maintenance/status':
                status, payload = maint_status(state)
            else:
                status, payload = 404, {'error': 'not found'}
            self._send(status, payload)
        except Exception as exc:
            self._send(500, {'error': str(exc)})

    def do_POST(self):
        if not self._auth():
            self._send(401, {'error': 'unauthorized'})
            return
        try:
            payload = self._json()
            if self.path == '/api/pi/wifi/connect':
                status, out = wifi_connect(payload)
            elif self.path == '/api/pi/wifi/auto-connect':
                status, out = wifi_auto_connect()
            elif self.path == '/api/pi/maintenance/action':
                status, out = maint_action(payload)
            else:
                status, out = 404, {'error': 'not found'}
            self._send(status, out)
        except Exception as exc:
            self._send(500, {'error': str(exc)})

    def do_PUT(self):
        if not self._auth():
            self._send(401, {'error': 'unauthorized'})
            return
        try:
            payload = self._json()
            if self.path == '/api/pi/maintenance/auto-update':
                status, out = maint_set_auto_update(payload)
            else:
                status, out = 404, {'error': 'not found'}
            self._send(status, out)
        except Exception as exc:
            self._send(500, {'error': str(exc)})

    def log_message(self, fmt, *args):
        return


if __name__ == '__main__':
    if RELAY_SERVER:
        threading.Thread(target=relay_loop, daemon=True).start()
    httpd = ThreadingHTTPServer((BIND, PORT), Handler)
    print(f'frameflow-pi-agent listening on http://{BIND}:{PORT}')
    httpd.serve_forever()
