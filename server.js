const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const http = require('http');
const multer = require('multer');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
const STATE_FILE = path.join(DATA_DIR, 'state.json');
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_UPLOAD_COUNT = 12;

for (const directory of [DATA_DIR, UPLOADS_DIR]) {
  fs.mkdirSync(directory, { recursive: true });
}

const DEFAULT_CATEGORIES = [
  { id: 'cat-health', name: 'Arzt', color: '#eab308', icon: 'stethoscope' },
  { id: 'cat-shopping', name: 'Shopping', color: '#f59e0b', icon: 'shopping-bag' },
  { id: 'cat-grocery', name: 'Einkaufen', color: '#84cc16', icon: 'basket' },
  { id: 'cat-travel', name: 'Urlaub', color: '#0ea5e9', icon: 'palm' },
  { id: 'cat-school', name: 'Schule', color: '#8b5cf6', icon: 'book' },
  { id: 'cat-work', name: 'Alltag', color: '#f97316', icon: 'sparkles' },
  { id: 'cat-friends', name: 'Freunde', color: '#ec4899', icon: 'heart' },
  { id: 'cat-sport', name: 'Sport', color: '#22c55e', icon: 'dumbbell' },
];

const defaultState = {
  slides: [],
  settings: {
    frameName: 'DtheG Frame',
    durationMs: 8000,
    transitionMs: 1400,
    shuffle: false,
    motion: true,
    showClock: false,
    fitMode: 'cover',
    accent: '#f59e0b',
    overlayTheme: 'cinema',
    backgroundStyle: 'midnight',
    showSlideInfo: true,
    showCounter: true,
    showWeather: true,
    weatherLocation: 'Berlin',
  },
  calendar: {
    settings: {
      photoWidgetMax: 3,
      showPhotoWidget: true,
      swipeEnabled: true,
      weekStartsOnMonday: true,
      photoUiScale: 1,
    },
    categories: DEFAULT_CATEGORIES,
    events: [],
  },
  updatedAt: new Date().toISOString(),
};

function sanitizeText(value, fallback = '') {
  if (typeof value !== 'string') {
    return fallback;
  }
  return value.trim().slice(0, 220);
}

function sanitizeShortText(value, fallback = '') {
  return sanitizeText(value, fallback).slice(0, 80);
}

function sanitizeNumber(value, fallback, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, numeric));
}

function sanitizeIsoDate(value, fallback = '') {
  if (typeof value !== 'string') {
    return fallback;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }
  return date.toISOString();
}

function buildFallbackTitle(fileName) {
  return path
    .basename(fileName, path.extname(fileName))
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'Neue Erinnerung';
}

function normalizeSlide(slide, index) {
  return {
    id: typeof slide.id === 'string' ? slide.id : crypto.randomUUID(),
    fileName: typeof slide.fileName === 'string' ? slide.fileName : '',
    title: sanitizeText(slide.title, buildFallbackTitle(slide.fileName || 'slide')),
    subtitle: sanitizeText(slide.subtitle),
    infoTag: sanitizeShortText(slide.infoTag),
    dateLabel: sanitizeShortText(slide.dateLabel),
    locationLabel: sanitizeShortText(slide.locationLabel),
    captionAlign: ['left', 'center', 'right'].includes(slide.captionAlign) ? slide.captionAlign : 'left',
    textSize: ['sm', 'md', 'lg'].includes(slide.textSize) ? slide.textSize : 'md',
    dimOverlay: sanitizeNumber(slide.dimOverlay, 0.3, 0, 0.75),
    zoom: sanitizeNumber(slide.zoom, 1, 1, 1.35),
    focusX: sanitizeNumber(slide.focusX, 50, 0, 100),
    focusY: sanitizeNumber(slide.focusY, 50, 0, 100),
    filterStyle: ['natural', 'cinematic', 'vivid', 'mono', 'dream'].includes(slide.filterStyle)
      ? slide.filterStyle
      : 'natural',
    frameStyle: ['floating', 'solid', 'minimal'].includes(slide.frameStyle) ? slide.frameStyle : 'floating',
    order: sanitizeNumber(slide.order, index, 0, 10000),
    createdAt: slide.createdAt || new Date().toISOString(),
  };
}

function normalizeCategory(category, index) {
  const fallback = DEFAULT_CATEGORIES[index % DEFAULT_CATEGORIES.length];
  return {
    id: typeof category.id === 'string' ? category.id : crypto.randomUUID(),
    name: sanitizeShortText(category.name, fallback.name || 'Kategorie'),
    color: /^#[0-9a-fA-F]{6}$/.test(category.color) ? category.color : fallback.color,
    icon: sanitizeShortText(category.icon, fallback.icon || 'sparkles') || 'sparkles',
  };
}

function normalizeEvent(event) {
  const startAt = sanitizeIsoDate(event.startAt, new Date().toISOString());
  const endAt = sanitizeIsoDate(event.endAt, startAt);
  return {
    id: typeof event.id === 'string' ? event.id : crypto.randomUUID(),
    title: sanitizeText(event.title, 'Termin').slice(0, 120),
    notes: sanitizeText(event.notes, ''),
    categoryId: sanitizeShortText(event.categoryId),
    startAt,
    endAt,
    allDay: Boolean(event.allDay),
    icon: sanitizeShortText(event.icon, ''),
    createdAt: event.createdAt || new Date().toISOString(),
  };
}

function normalizeCalendar(calendar) {
  const value = calendar && typeof calendar === 'object' ? calendar : {};
  const categoriesInput = Array.isArray(value.categories) && value.categories.length
    ? value.categories
    : DEFAULT_CATEGORIES;
  const categories = categoriesInput.map((category, index) => normalizeCategory(category, index));
  const validCategoryIds = new Set(categories.map((category) => category.id));
  const fallbackCategoryId = categories[0].id;
  const events = (Array.isArray(value.events) ? value.events : [])
    .map((event) => normalizeEvent(event))
    .map((event) => ({
      ...event,
      categoryId: validCategoryIds.has(event.categoryId) ? event.categoryId : fallbackCategoryId,
      icon: event.icon || categories.find((category) => category.id === event.categoryId)?.icon || 'sparkles',
    }))
    .sort((left, right) => new Date(left.startAt).getTime() - new Date(right.startAt).getTime());

  return {
    settings: {
      photoWidgetMax: sanitizeNumber(value.settings?.photoWidgetMax, 3, 1, 6),
      showPhotoWidget: value.settings?.showPhotoWidget !== false,
      swipeEnabled: value.settings?.swipeEnabled !== false,
      weekStartsOnMonday: value.settings?.weekStartsOnMonday !== false,
    },
    categories,
    events,
  };
}

function normalizeState(value) {
  const state = value && typeof value === 'object' ? value : {};
  return {
    slides: Array.isArray(state.slides) ? state.slides.map((slide, index) => normalizeSlide(slide, index)) : [],
    settings: {
      ...defaultState.settings,
      ...(state.settings || {}),
    },
    calendar: normalizeCalendar(state.calendar),
    updatedAt: state.updatedAt || new Date().toISOString(),
  };
}

function readState() {
  if (!fs.existsSync(STATE_FILE)) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(defaultState, null, 2));
    return structuredClone(defaultState);
  }

  try {
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    return normalizeState(JSON.parse(raw));
  } catch (error) {
    console.error('Failed to read state:', error);
    fs.writeFileSync(STATE_FILE, JSON.stringify(defaultState, null, 2));
    return structuredClone(defaultState);
  }
}

let appState = readState();

function createPublicSlide(slide) {
  return {
    id: slide.id,
    imageUrl: `/uploads/${slide.fileName}`,
    title: slide.title,
    subtitle: slide.subtitle,
    infoTag: slide.infoTag,
    dateLabel: slide.dateLabel,
    locationLabel: slide.locationLabel,
    captionAlign: slide.captionAlign,
    textSize: slide.textSize,
    dimOverlay: slide.dimOverlay,
    zoom: slide.zoom,
    focusX: slide.focusX,
    focusY: slide.focusY,
    filterStyle: slide.filterStyle,
    frameStyle: slide.frameStyle,
    order: slide.order,
    createdAt: slide.createdAt,
  };
}

function serializeCalendar(calendar) {
  return {
    settings: calendar.settings,
    categories: calendar.categories,
    events: calendar.events,
  };
}

function serializeState(state) {
  return {
    slides: state.slides
      .slice()
      .sort((left, right) => left.order - right.order)
      .map(createPublicSlide),
    settings: state.settings,
    calendar: serializeCalendar(state.calendar),
    updatedAt: state.updatedAt,
  };
}

function writeState(nextState) {
  appState = normalizeState({
    ...nextState,
    updatedAt: new Date().toISOString(),
  });
  fs.writeFileSync(STATE_FILE, JSON.stringify(appState, null, 2));
  io.emit('state:update', serializeState(appState));
  return appState;
}

function sanitizeFilename(originalName) {
  const extension = path.extname(originalName).toLowerCase();
  const safeExtension = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(extension)
    ? extension
    : '.jpg';
  return `${Date.now()}-${crypto.randomUUID()}${safeExtension}`;
}

function hasSupportedImageExtension(fileName) {
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(path.extname(fileName).toLowerCase());
}

function removeFileIfPresent(fileName) {
  const filePath = path.join(UPLOADS_DIR, fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, UPLOADS_DIR);
  },
  filename: (_req, file, callback) => {
    callback(null, sanitizeFilename(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_UPLOAD_BYTES,
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith('image/') || hasSupportedImageExtension(file.originalname)) {
      callback(null, true);
      return;
    }
    callback(new Error('Only image uploads are allowed.'));
  },
});

function createSlideFromUpload(file, body, order) {
  return normalizeSlide(
    {
      id: crypto.randomUUID(),
      fileName: file.filename,
      title: sanitizeText(body.title, buildFallbackTitle(file.originalname)),
      subtitle: sanitizeText(body.subtitle),
      infoTag: sanitizeShortText(body.infoTag),
      dateLabel: sanitizeShortText(body.dateLabel),
      locationLabel: sanitizeShortText(body.locationLabel),
      captionAlign: body.captionAlign,
      textSize: body.textSize,
      dimOverlay: body.dimOverlay,
      zoom: body.zoom,
      focusX: body.focusX,
      focusY: body.focusY,
      filterStyle: body.filterStyle,
      frameStyle: body.frameStyle,
      order,
      createdAt: new Date().toISOString(),
    },
    order,
  );
}

app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));
app.use('/static', express.static(path.join(ROOT_DIR, 'public'), { maxAge: '1h' }));

app.get('/', (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'public', 'admin.html'));
});

app.get('/calendar', (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'public', 'calendar.html'));
});

// Mobile-optimized calendar view for phones. Shares all logic (calendar.js)
// with /calendar but uses its own mobile-first HTML template + CSS.
app.get('/kalender', (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'public', 'kalender.html'));
});

app.get('/frame', (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'public', 'frame.html'));
});

app.get('/api/state', (_req, res) => {
  res.json(serializeState(appState));
});

app.get('/api/calendar', (_req, res) => {
  res.json(serializeCalendar(appState.calendar));
});

// Local sensors (DHT22 + CCS811) — see scripts/sensors.py.
// Two ways data can reach us:
//   (1) Push: the Pi POSTs readings to /api/sensors/ingest (recommended when
//       the Pi has no fixed IP; set FRAMEFLOW_SENSOR_TOKEN to a shared secret).
//   (2) Pull: we fetch http://pi:8787/sensors (set FRAMEFLOW_SENSOR_URL).
//   (3) Local file fallback /run/frameflow/sensors.json (single-host setup).
const SENSOR_URL = process.env.FRAMEFLOW_SENSOR_URL || '';
const SENSOR_FILE = process.env.FRAMEFLOW_SENSOR_FILE || '/run/frameflow/sensors.json';
const SENSOR_TOKEN = process.env.FRAMEFLOW_SENSOR_TOKEN || '';
const SENSOR_STALE_MS = 2 * 60 * 1000; // 2 minutes
const SENSOR_CACHE_MS = 5 * 1000;       // avoid hammering upstream
let sensorCache = { at: 0, payload: null };
let sensorPushed = null;                 // last payload received via POST
let sensorPushedAt = 0;

async function fetchSensorsFromUrl(url) {
  if (typeof fetch !== 'function') throw new Error('fetch unavailable (Node < 18)');
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 4000);
  try {
    const r = await fetch(url, { signal: ctrl.signal, cache: 'no-store' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(to);
  }
}

function readSensorsFromFile(cb) {
  fs.readFile(SENSOR_FILE, 'utf8', (err, raw) => {
    if (err) return cb(null);
    try { cb(JSON.parse(raw)); } catch { cb(null); }
  });
}

// POST /api/sensors/ingest  — the Pi pushes here.
// Body: { temperature, humidity, eco2, tvoc, aqi, updatedAt, error? }
// Auth: header "X-Sensor-Token" must match FRAMEFLOW_SENSOR_TOKEN.
app.post('/api/sensors/ingest', express.json({ limit: '8kb' }), (req, res) => {
  if (!SENSOR_TOKEN) {
    return res.status(503).json({ error: 'ingest disabled (set FRAMEFLOW_SENSOR_TOKEN)' });
  }
  const tok = req.get('X-Sensor-Token') || req.query.token || '';
  if (tok !== SENSOR_TOKEN) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const b = req.body || {};
  sensorPushed = {
    updatedAt: Number(b.updatedAt) || Date.now(),
    temperature: b.temperature ?? null,
    humidity: b.humidity ?? null,
    eco2: b.eco2 ?? null,
    tvoc: b.tvoc ?? null,
    aqi: b.aqi || '—',
    error: b.error || null,
  };
  sensorPushedAt = Date.now();
  sensorCache = { at: 0, payload: null }; // invalidate GET cache
  res.json({ ok: true });
});

app.get('/api/sensors', async (_req, res) => {
  const now = Date.now();
  if (sensorCache.payload && now - sensorCache.at < SENSOR_CACHE_MS) {
    return res.json(sensorCache.payload);
  }

  const respond = (data) => {
    if (!data) {
      const out = { available: false, reason: 'no-sensor-source' };
      sensorCache = { at: now, payload: out };
      return res.json(out);
    }
    const age = now - (Number(data.updatedAt) || 0);
    const out = {
      available: true,
      stale: age > SENSOR_STALE_MS,
      ageMs: age,
      ...data,
    };
    sensorCache = { at: now, payload: out };
    res.json(out);
  };

  // 1) Prefer the most recently pushed payload.
  if (sensorPushed && now - sensorPushedAt < SENSOR_STALE_MS) {
    return respond(sensorPushed);
  }

  // 2) Fall back to pulling from a remote URL.
  if (SENSOR_URL) {
    try {
      const data = await fetchSensorsFromUrl(SENSOR_URL);
      return respond(data);
    } catch (err) {
      console.warn('[sensors] remote fetch failed:', err?.message || err);
    }
  }

  // 3) Last resort: local file on the same host.
  readSensorsFromFile(respond);
});

// Weather proxy — avoids any CORS/DNS quirks on kiosk/Pi.
// Uses Open-Meteo (free, no API key required).
const weatherCache = new Map(); // key=location -> { at, payload }
const WEATHER_TTL = 10 * 60 * 1000; // 10 min
app.get('/api/weather', async (req, res) => {
  try {
    const loc = String(req.query.loc || '').trim();
    if (!loc) return res.status(400).json({ error: 'missing loc' });
    const cached = weatherCache.get(loc.toLowerCase());
    if (cached && Date.now() - cached.at < WEATHER_TTL) {
      return res.json(cached.payload);
    }
    if (typeof fetch !== 'function') {
      return res.status(500).json({ error: 'fetch unavailable (Node < 18)' });
    }
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(loc)}&count=1&language=de&format=json`;
    const geoR = await fetch(geoUrl);
    if (!geoR.ok) throw new Error(`geo HTTP ${geoR.status}`);
    const geoData = await geoR.json();
    const hit = geoData?.results?.[0];
    if (!hit) return res.status(404).json({ error: 'location not found' });
    const { latitude: lat, longitude: lon, name } = hit;
    const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    const wxR = await fetch(wxUrl);
    if (!wxR.ok) throw new Error(`wx HTTP ${wxR.status}`);
    const wxData = await wxR.json();
    const current = wxData?.current;
    if (!current) throw new Error('no current weather');
    const payload = {
      name,
      lat,
      lon,
      temperature: current.temperature_2m,
      code: current.weather_code,
    };
    weatherCache.set(loc.toLowerCase(), { at: Date.now(), payload });
    res.json(payload);
  } catch (err) {
    console.error('[weather]', err?.message || err);
    res.status(502).json({ error: 'weather upstream failed', detail: String(err?.message || err) });
  }
});

app.post('/api/slides', upload.fields([
  { name: 'images', maxCount: MAX_UPLOAD_COUNT },
  { name: 'image', maxCount: 1 },
]), (req, res) => {
  const files = [
    ...((req.files && req.files.images) || []),
    ...((req.files && req.files.image) || []),
  ];

  if (!files.length) {
    res.status(400).json({ error: 'An image file is required.' });
    return;
  }

  const nextSlides = files.map((file, index) => createSlideFromUpload(file, req.body, appState.slides.length + index));

  writeState({
    ...appState,
    slides: [...appState.slides, ...nextSlides],
  });

  res.status(201).json({
    slide: createPublicSlide(nextSlides[0]),
    slides: nextSlides.map(createPublicSlide),
    addedCount: nextSlides.length,
  });
});

app.put('/api/slides/:id', (req, res) => {
  const slideIndex = appState.slides.findIndex((slide) => slide.id === req.params.id);
  if (slideIndex === -1) {
    res.status(404).json({ error: 'Slide not found.' });
    return;
  }

  const current = appState.slides[slideIndex];
  const updated = {
    ...current,
    title: sanitizeText(req.body.title, current.title),
    subtitle: sanitizeText(req.body.subtitle, current.subtitle),
    infoTag: sanitizeShortText(req.body.infoTag, current.infoTag),
    dateLabel: sanitizeShortText(req.body.dateLabel, current.dateLabel),
    locationLabel: sanitizeShortText(req.body.locationLabel, current.locationLabel),
    captionAlign: ['left', 'center', 'right'].includes(req.body.captionAlign)
      ? req.body.captionAlign
      : current.captionAlign,
    textSize: ['sm', 'md', 'lg'].includes(req.body.textSize) ? req.body.textSize : current.textSize,
    dimOverlay: sanitizeNumber(req.body.dimOverlay, current.dimOverlay, 0, 0.75),
    zoom: sanitizeNumber(req.body.zoom, current.zoom, 1, 1.35),
    focusX: sanitizeNumber(req.body.focusX, current.focusX, 0, 100),
    focusY: sanitizeNumber(req.body.focusY, current.focusY, 0, 100),
    filterStyle: ['natural', 'cinematic', 'vivid', 'mono', 'dream'].includes(req.body.filterStyle)
      ? req.body.filterStyle
      : current.filterStyle,
    frameStyle: ['floating', 'solid', 'minimal'].includes(req.body.frameStyle)
      ? req.body.frameStyle
      : current.frameStyle,
  };

  const slides = appState.slides.slice();
  slides[slideIndex] = updated;
  writeState({ ...appState, slides });
  res.json({ slide: createPublicSlide(updated) });
});

app.post('/api/slides/reorder', (req, res) => {
  if (!Array.isArray(req.body.slideIds)) {
    res.status(400).json({ error: 'slideIds must be an array.' });
    return;
  }

  const idSet = new Set(req.body.slideIds);
  if (idSet.size !== appState.slides.length) {
    res.status(400).json({ error: 'slideIds length does not match slide count.' });
    return;
  }

  const lookup = new Map(appState.slides.map((slide) => [slide.id, slide]));
  const reordered = req.body.slideIds.map((slideId, index) => {
    const slide = lookup.get(slideId);
    if (!slide) {
      throw new Error(`Unknown slide ${slideId}`);
    }
    return { ...slide, order: index };
  });

  writeState({ ...appState, slides: reordered });
  res.json({ ok: true });
});

app.delete('/api/slides/:id', (req, res) => {
  const slide = appState.slides.find((entry) => entry.id === req.params.id);
  if (!slide) {
    res.status(404).json({ error: 'Slide not found.' });
    return;
  }

  removeFileIfPresent(slide.fileName);
  const slides = appState.slides
    .filter((entry) => entry.id !== req.params.id)
    .map((entry, index) => ({ ...entry, order: index }));

  writeState({ ...appState, slides });
  res.status(204).send();
});

app.put('/api/settings', (req, res) => {
  const nextSettings = {
    ...appState.settings,
    frameName: sanitizeText(req.body.frameName, appState.settings.frameName) || appState.settings.frameName,
    durationMs: sanitizeNumber(req.body.durationMs, appState.settings.durationMs, 3000, 60000),
    transitionMs: sanitizeNumber(req.body.transitionMs, appState.settings.transitionMs, 300, 8000),
    shuffle: Boolean(req.body.shuffle),
    motion: Boolean(req.body.motion),
    showClock: Boolean(req.body.showClock),
    fitMode: ['cover', 'contain'].includes(req.body.fitMode) ? req.body.fitMode : appState.settings.fitMode,
    accent: /^#[0-9a-fA-F]{6}$/.test(req.body.accent) ? req.body.accent : appState.settings.accent,
    overlayTheme: ['glass', 'cinema', 'soft'].includes(req.body.overlayTheme)
      ? req.body.overlayTheme
      : appState.settings.overlayTheme,
    backgroundStyle: ['aurora', 'paper', 'midnight'].includes(req.body.backgroundStyle)
      ? req.body.backgroundStyle
      : appState.settings.backgroundStyle,
    showSlideInfo: Boolean(req.body.showSlideInfo),
    showCounter: Boolean(req.body.showCounter),
    showWeather: req.body.showWeather === undefined ? appState.settings.showWeather !== false : Boolean(req.body.showWeather),
    weatherLocation: sanitizeText(req.body.weatherLocation, appState.settings.weatherLocation || '') || '',
  };

  writeState({ ...appState, settings: nextSettings });
  res.json({ settings: nextSettings });
});

app.put('/api/calendar/settings', (req, res) => {
  const nextCalendar = {
    ...appState.calendar,
    settings: {
      ...appState.calendar.settings,
      photoWidgetMax: sanitizeNumber(req.body.photoWidgetMax, appState.calendar.settings.photoWidgetMax, 1, 6),
      showPhotoWidget: Boolean(req.body.showPhotoWidget),
      swipeEnabled: Boolean(req.body.swipeEnabled),
      weekStartsOnMonday: Boolean(req.body.weekStartsOnMonday),
      photoUiScale: sanitizeNumber(req.body.photoUiScale, appState.calendar.settings.photoUiScale ?? 1, 0.5, 2),
    },
  };

  writeState({ ...appState, calendar: nextCalendar });
  res.json({ settings: nextCalendar.settings });
});

app.post('/api/calendar/categories', (req, res) => {
  const category = normalizeCategory({
    id: crypto.randomUUID(),
    name: req.body.name,
    color: req.body.color,
    icon: req.body.icon,
  }, appState.calendar.categories.length);

  const categories = [...appState.calendar.categories, category];
  writeState({
    ...appState,
    calendar: {
      ...appState.calendar,
      categories,
    },
  });

  res.status(201).json({ category });
});

app.put('/api/calendar/categories/:id', (req, res) => {
  const index = appState.calendar.categories.findIndex((category) => category.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Category not found.' });
    return;
  }

  const current = appState.calendar.categories[index];
  const updated = normalizeCategory({
    ...current,
    name: req.body.name,
    color: req.body.color,
    icon: req.body.icon,
  }, index);
  const categories = appState.calendar.categories.slice();
  categories[index] = updated;

  const events = appState.calendar.events.map((event) =>
    event.categoryId === updated.id
      ? { ...event, icon: updated.icon || event.icon }
      : event,
  );

  writeState({
    ...appState,
    calendar: {
      ...appState.calendar,
      categories,
      events,
    },
  });

  res.json({ category: updated });
});

app.delete('/api/calendar/categories/:id', (req, res) => {
  if (appState.calendar.categories.length <= 1) {
    res.status(400).json({ error: 'At least one category is required.' });
    return;
  }

  const category = appState.calendar.categories.find((entry) => entry.id === req.params.id);
  if (!category) {
    res.status(404).json({ error: 'Category not found.' });
    return;
  }

  const fallbackCategory = appState.calendar.categories.find((entry) => entry.id !== req.params.id);
  const categories = appState.calendar.categories.filter((entry) => entry.id !== req.params.id);
  const events = appState.calendar.events.map((event) =>
    event.categoryId === req.params.id
      ? { ...event, categoryId: fallbackCategory.id, icon: fallbackCategory.icon }
      : event,
  );

  writeState({
    ...appState,
    calendar: {
      ...appState.calendar,
      categories,
      events,
    },
  });

  res.status(204).send();
});

app.post('/api/calendar/events', (req, res) => {
  const fallbackCategoryId = appState.calendar.categories[0]?.id;
  const categoryId = sanitizeShortText(req.body.categoryId, fallbackCategoryId);
  const category = appState.calendar.categories.find((entry) => entry.id === categoryId) || appState.calendar.categories[0];

  const event = normalizeEvent({
    id: crypto.randomUUID(),
    title: req.body.title,
    notes: req.body.notes,
    categoryId: category.id,
    startAt: req.body.startAt,
    endAt: req.body.endAt,
    allDay: req.body.allDay,
    icon: sanitizeShortText(req.body.icon, category.icon),
    createdAt: new Date().toISOString(),
  });

  const events = [...appState.calendar.events, event]
    .sort((left, right) => new Date(left.startAt).getTime() - new Date(right.startAt).getTime());

  writeState({
    ...appState,
    calendar: {
      ...appState.calendar,
      events,
    },
  });

  res.status(201).json({ event });
});

app.put('/api/calendar/events/:id', (req, res) => {
  const index = appState.calendar.events.findIndex((event) => event.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Event not found.' });
    return;
  }

  const current = appState.calendar.events[index];
  const category = appState.calendar.categories.find((entry) => entry.id === req.body.categoryId)
    || appState.calendar.categories.find((entry) => entry.id === current.categoryId)
    || appState.calendar.categories[0];

  const updated = normalizeEvent({
    ...current,
    title: req.body.title,
    notes: req.body.notes,
    categoryId: category.id,
    startAt: req.body.startAt,
    endAt: req.body.endAt,
    allDay: req.body.allDay,
    icon: sanitizeShortText(req.body.icon, category.icon),
  });

  const events = appState.calendar.events.slice();
  events[index] = updated;
  events.sort((left, right) => new Date(left.startAt).getTime() - new Date(right.startAt).getTime());

  writeState({
    ...appState,
    calendar: {
      ...appState.calendar,
      events,
    },
  });

  res.json({ event: updated });
});

app.delete('/api/calendar/events/:id', (req, res) => {
  const exists = appState.calendar.events.some((event) => event.id === req.params.id);
  if (!exists) {
    res.status(404).json({ error: 'Event not found.' });
    return;
  }

  const events = appState.calendar.events.filter((event) => event.id !== req.params.id);
  writeState({
    ...appState,
    calendar: {
      ...appState.calendar,
      events,
    },
  });

  res.status(204).send();
});

app.use((error, _req, res, _next) => {
  console.error(error);
  const message = error.message || 'Unexpected server error.';
  res.status(400).json({ error: message });
});

io.on('connection', (socket) => {
  socket.emit('state:update', serializeState(appState));
});

server.listen(PORT, HOST, () => {
  console.log(`Frameflow running on http://${HOST}:${PORT}`);
});