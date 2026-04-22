# Frameflow Kiosk

Leichtgewichtige Foto-Frame-Webapp mit zwei Modi:

- Admin-Ansicht auf dem Handy zum Hochladen, Beschriften und Einstellen.
- Frame-Ansicht auf dem Raspberry Pi im Chromium-Kiosk-Modus.

## Start

```bash
npm install
npm start
```

Dann:

- Admin: `http://<pi-ip>:3000/`
- Bilderrahmen: `http://<pi-ip>:3000/frame`

## Raspberry Pi Kiosk

Chromium-Kiosk-Beispiel:

```bash
chromium-browser --kiosk --disable-infobars --autoplay-policy=no-user-gesture-required http://localhost:3000/frame
```

## Merkmale

- Direkte Bilduploads vom Handy
- Titel und Untertitel je Bild
- Einstellbare Diashow-Geschwindigkeit und Übergänge
- Live-Synchronisierung ohne Reload
- Für lokale Netzwerke und Raspberry Pi optimiert

## Deploy auf Ubuntu (nginx, Port 675)

Idempotentes Setup-Script. Legt nur eine eigene nginx-Site (`sites-available/frameflow`) an
und rührt bestehende Configs nicht an.

```bash
curl -fsSL https://raw.githubusercontent.com/DtheGCoder/Frameflow/main/scripts/setup-ubuntu.sh -o setup-ubuntu.sh
sudo bash setup-ubuntu.sh
```

Danach erreichbar unter `http://<server-ip>:675/`.

Optional alle Defaults überschreiben:

```bash
sudo APP_DIR=/opt/frameflow PUBLIC_PORT=675 APP_PORT=3675 NODE_MAJOR=20 \
  REPO_URL=https://github.com/DtheGCoder/Frameflow.git \
  bash setup-ubuntu.sh
```

Update:

```bash
cd /opt/frameflow && sudo git pull && sudo systemctl restart frameflow
```