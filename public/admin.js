/* eslint-disable */
const socket = io();

const elements = {
  uploadForm: document.getElementById('uploadForm'),
  settingsForm: document.getElementById('settingsForm'),
  uploadMessage: document.getElementById('uploadMessage'),
  settingsMessage: document.getElementById('settingsMessage'),
  slidesList: document.getElementById('slidesList'),
  connectionBadge: document.getElementById('connectionBadge'),
  imageInput: document.getElementById('imageInput'),
  dropzoneTitle: document.getElementById('dropzoneTitle'),
  dropzoneHint: document.getElementById('dropzoneHint'),
  uploadPreviewImage: document.getElementById('uploadPreviewImage'),
  uploadPreviewTitle: document.getElementById('uploadPreviewTitle'),
  uploadPreviewSubtitle: document.getElementById('uploadPreviewSubtitle'),
  uploadPreviewMeta: document.getElementById('uploadPreviewMeta'),
  uploadPreviewInfo: document.getElementById('uploadPreviewInfo'),
  uploadPreviewStage: document.getElementById('uploadPreviewStage'),
  clearPreviewButton: document.getElementById('clearPreviewButton'),
  statSlides: document.getElementById('statSlides'),
  statDuration: document.getElementById('statDuration'),
  statTheme: document.getElementById('statTheme'),
  tabs: Array.from(document.querySelectorAll('.admin-tab')),
  panels: Array.from(document.querySelectorAll('.admin-panel')),
  editDialog: document.getElementById('editDialog'),
  editDialogTitle: document.getElementById('editDialogTitle'),
  editForm: document.getElementById('editForm'),
  editPreviewStage: document.getElementById('editPreviewStage'),
  editPreviewImage: document.getElementById('editPreviewImage'),
  editPreviewTitle: document.getElementById('editPreviewTitle'),
  editPreviewSubtitle: document.getElementById('editPreviewSubtitle'),
  editPreviewMeta: document.getElementById('editPreviewMeta'),
  editDeleteButton: document.getElementById('editDeleteButton'),
  editMessage: document.getElementById('editMessage'),
};

let currentState = { slides: [], settings: {} };
let previewUrl = '';
let editingSlideId = null;

// ---------- helpers ----------
function formatRangeValue(input) {
  switch (input.name) {
    case 'zoom': return `${Number(input.value).toFixed(2)}×`;
    case 'focusX':
    case 'focusY': return `${Math.round(Number(input.value))} %`;
    case 'dimOverlay': return `${Math.round(Number(input.value) * 100)} %`;
    default: return input.value;
  }
}

function syncRangeInputs(scope) {
  scope.querySelectorAll('input[type="range"]').forEach((input) => {
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const value = Number(input.value || min);
    const percent = max === min ? 0 : ((value - min) / (max - min)) * 100;
    input.style.setProperty('--range-percent', `${percent}%`);
    const output = input.closest('label')?.querySelector(`[data-range-output="${input.name}"]`);
    if (output) output.textContent = formatRangeValue(input);
  });
}

function setConnectionState(live) {
  elements.connectionBadge.textContent = live ? 'Live verbunden' : 'Offline';
  elements.connectionBadge.classList.toggle('is-live', live);
}

function flashMessage(el, message, isError = false) {
  if (!el) return;
  el.textContent = message;
  el.classList.toggle('is-error', isError);
  window.clearTimeout(el._timer);
  el._timer = window.setTimeout(() => {
    el.textContent = '';
    el.classList.remove('is-error');
  }, 2800);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Anfrage fehlgeschlagen.');
  return payload;
}

// ---------- tabs ----------
function activateTab(tabId) {
  elements.tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.tab === tabId));
  elements.panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === tabId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

elements.tabs.forEach((btn) => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

// ---------- live preview ----------
// Applies a slide-like value object to any preview stage (shared with edit dialog)
function applyPreview(stage, values) {
  const image = stage.querySelector('.frame-image');
  const overlay = stage.querySelector('.frame-overlay');
  const copy = stage.querySelector('.frame-copy');
  const title = stage.querySelector('.frame-title');
  const subtitle = stage.querySelector('.frame-subtitle');
  const meta = stage.querySelector('.frame-slide-meta');

  if (values.imageUrl) {
    image.src = values.imageUrl;
    image.classList.remove('is-empty');
  }
  image.style.objectPosition = `${values.focusX ?? 50}% ${values.focusY ?? 50}%`;
  image.style.setProperty('--slide-zoom', String(values.zoom ?? 1));
  image.dataset.filter = values.filterStyle || 'natural';

  overlay.style.setProperty('--overlay-opacity', String(values.dimOverlay ?? 0.3));
  copy.dataset.align = values.captionAlign || 'left';
  copy.dataset.size = values.textSize || 'md';
  copy.dataset.card = values.frameStyle || 'floating';

  title.textContent = (values.title && values.title.trim()) || 'Titel-Vorschau';
  subtitle.textContent = (values.subtitle && values.subtitle.trim()) || 'Untertitel-Vorschau';

  const chips = [values.infoTag, values.dateLabel, values.locationLabel].filter((v) => v && v.trim());
  meta.innerHTML = chips.map((v) => `<span>${escapeHtml(v)}</span>`).join('');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function collectForm(form) {
  const fd = new FormData(form);
  return {
    title: fd.get('title') || '',
    subtitle: fd.get('subtitle') || '',
    infoTag: fd.get('infoTag') || '',
    dateLabel: fd.get('dateLabel') || '',
    locationLabel: fd.get('locationLabel') || '',
    captionAlign: fd.get('captionAlign') || 'left',
    textSize: fd.get('textSize') || 'md',
    filterStyle: fd.get('filterStyle') || 'natural',
    frameStyle: fd.get('frameStyle') || 'floating',
    zoom: Number(fd.get('zoom') ?? 1),
    focusX: Number(fd.get('focusX') ?? 50),
    focusY: Number(fd.get('focusY') ?? 50),
    dimOverlay: Number(fd.get('dimOverlay') ?? 0.3),
  };
}

function refreshUploadPreview() {
  const values = collectForm(elements.uploadForm);
  values.imageUrl = previewUrl || undefined;
  applyPreview(elements.uploadPreviewStage, values);
}

function refreshEditPreview() {
  const values = collectForm(elements.editForm);
  const slide = currentState.slides.find((s) => s.id === editingSlideId);
  values.imageUrl = slide?.imageUrl;
  applyPreview(elements.editPreviewStage, values);
}

function resetUploadPreview() {
  if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = ''; }
  elements.uploadPreviewImage.removeAttribute('src');
  elements.uploadPreviewImage.classList.add('is-empty');
  elements.uploadPreviewInfo.textContent = 'Noch kein Bild ausgewählt.';
  elements.dropzoneTitle.textContent = 'Bild vom Handy wählen';
  elements.dropzoneHint.textContent = 'Mehrere möglich — bis zu 12 auf einmal';
  refreshUploadPreview();
}

function onImagePicked(files) {
  const list = Array.from(files || []);
  if (!list.length) { resetUploadPreview(); return; }
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = URL.createObjectURL(list[0]);
  elements.uploadPreviewInfo.textContent = `${list.length} Bild${list.length > 1 ? 'er' : ''} · erstes: ${list[0].name}`;
  elements.dropzoneTitle.textContent = `${list.length} Bild${list.length > 1 ? 'er' : ''} bereit`;
  elements.dropzoneHint.textContent = 'Gemeinsame Styles werden auf alle neuen Bilder angewendet';
  refreshUploadPreview();
}

// ---------- stats + settings ----------
function populateSettings(settings) {
  const f = elements.settingsForm;
  f.frameName.value = settings.frameName || '';
  f.durationMs.value = settings.durationMs || 8000;
  f.transitionMs.value = settings.transitionMs || 1400;
  f.fitMode.value = settings.fitMode || 'cover';
  f.overlayTheme.value = settings.overlayTheme || 'glass';
  f.accent.value = settings.accent || '#f97316';
  f.backgroundStyle.value = settings.backgroundStyle || 'aurora';
  f.shuffle.checked = !!settings.shuffle;
  f.motion.checked = !!settings.motion;
  f.showClock.checked = !!settings.showClock;
  f.showSlideInfo.checked = settings.showSlideInfo !== false;
  f.showCounter.checked = settings.showCounter !== false;
  if (f.weatherLocation) f.weatherLocation.value = settings.weatherLocation || '';
  if (f.showWeather) f.showWeather.checked = settings.showWeather !== false;
}

function updateStats(state) {
  elements.statSlides.textContent = String(state.slides.length);
  elements.statDuration.textContent = `${((state.settings.durationMs || 8000) / 1000).toFixed(1).replace('.', ',')} s`;
  elements.statTheme.textContent = state.settings.overlayTheme || 'glass';
}

// ---------- gallery ----------
function renderSlides(slides) {
  if (!slides.length) {
    elements.slidesList.className = 'admin-gallery-empty';
    elements.slidesList.textContent = 'Noch keine Bilder vorhanden. Tippe auf Upload, um das erste Bild hinzuzufügen.';
    return;
  }
  elements.slidesList.className = 'admin-gallery-grid';
  elements.slidesList.innerHTML = slides.map((s, i) => galleryCardTemplate(s, i, slides.length)).join('');
}

function galleryCardTemplate(slide, index, total) {
  const title = slide.title ? escapeHtml(slide.title) : 'Ohne Titel';
  const sub = slide.subtitle ? escapeHtml(slide.subtitle) : '';
  return `
    <button type="button" class="admin-gallery-card" data-slide-id="${slide.id}" data-action="edit">
      <img class="admin-gallery-card-img" src="${escapeHtml(slide.imageUrl)}" alt="${title}" loading="lazy"
           style="object-position:${slide.focusX ?? 50}% ${slide.focusY ?? 50}%" />
      <span class="admin-gallery-card-badge">${index + 1}/${total}</span>
      <span class="admin-gallery-card-order" onclick="event.stopPropagation()">
        <span class="admin-gallery-mini-btn" role="button" data-action="up" data-slide-id="${slide.id}" ${index === 0 ? 'aria-disabled="true"' : ''}>
          <svg><use href="#i-up"/></svg>
        </span>
        <span class="admin-gallery-mini-btn" role="button" data-action="down" data-slide-id="${slide.id}" ${index === total - 1 ? 'aria-disabled="true"' : ''}>
          <svg><use href="#i-down"/></svg>
        </span>
      </span>
      <span class="admin-gallery-card-overlay">
        <span class="admin-gallery-card-title">${title}</span>
        ${sub ? `<span class="admin-gallery-card-sub">${sub}</span>` : ''}
      </span>
    </button>
  `;
}

// Gallery click handling
elements.slidesList.addEventListener('click', async (event) => {
  const orderBtn = event.target.closest('.admin-gallery-mini-btn');
  if (orderBtn) {
    event.stopPropagation();
    event.preventDefault();
    if (orderBtn.getAttribute('aria-disabled') === 'true') return;
    const slideId = orderBtn.dataset.slideId;
    const action = orderBtn.dataset.action;
    try {
      await moveSlide(slideId, action);
      await loadState();
    } catch (e) { flashMessage(elements.settingsMessage, e.message, true); }
    return;
  }
  const card = event.target.closest('.admin-gallery-card');
  if (card) openEditDialog(card.dataset.slideId);
});

function moveSlide(slideId, direction) {
  const slides = currentState.slides.slice();
  const index = slides.findIndex((s) => s.id === slideId);
  const nextIndex = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || nextIndex < 0 || nextIndex >= slides.length) return Promise.resolve();
  [slides[index], slides[nextIndex]] = [slides[nextIndex], slides[index]];
  return requestJson('/api/slides/reorder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slideIds: slides.map((s) => s.id) }),
  });
}

// ---------- edit dialog ----------
function openEditDialog(slideId) {
  const slide = currentState.slides.find((s) => s.id === slideId);
  if (!slide) return;
  editingSlideId = slideId;
  const f = elements.editForm;
  f.slideId.value = slide.id;
  f.title.value = slide.title || '';
  f.subtitle.value = slide.subtitle || '';
  f.infoTag.value = slide.infoTag || '';
  f.dateLabel.value = slide.dateLabel || '';
  f.locationLabel.value = slide.locationLabel || '';
  f.captionAlign.value = slide.captionAlign || 'left';
  f.textSize.value = slide.textSize || 'md';
  f.filterStyle.value = slide.filterStyle || 'natural';
  f.frameStyle.value = slide.frameStyle || 'floating';
  f.zoom.value = slide.zoom ?? 1;
  f.focusX.value = slide.focusX ?? 50;
  f.focusY.value = slide.focusY ?? 50;
  f.dimOverlay.value = slide.dimOverlay ?? 0.3;
  syncRangeInputs(f);
  elements.editDialogTitle.textContent = slide.title || 'Bild bearbeiten';
  refreshEditPreview();
  elements.editDialog.showModal();
}

function closeEditDialog() {
  editingSlideId = null;
  if (elements.editDialog.open) elements.editDialog.close();
}

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-dialog-close]')) closeEditDialog();
});
elements.editDialog.addEventListener('cancel', (e) => { e.preventDefault(); closeEditDialog(); });

elements.editForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!editingSlideId) return;
  const payload = collectForm(elements.editForm);
  try {
    await requestJson(`/api/slides/${editingSlideId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    flashMessage(elements.editMessage, 'Gespeichert.');
    await loadState();
    closeEditDialog();
  } catch (e) { flashMessage(elements.editMessage, e.message, true); }
});

elements.editDeleteButton.addEventListener('click', async () => {
  if (!editingSlideId) return;
  if (!window.confirm('Dieses Bild wirklich löschen?')) return;
  try {
    const response = await fetch(`/api/slides/${editingSlideId}`, { method: 'DELETE' });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || 'Löschen fehlgeschlagen.');
    }
    flashMessage(elements.editMessage, 'Gelöscht.');
    closeEditDialog();
    await loadState();
  } catch (e) { flashMessage(elements.editMessage, e.message, true); }
});

// ---------- upload + settings submit ----------
async function handleUploadSubmit(event) {
  event.preventDefault();
  const formData = new FormData(elements.uploadForm);
  try {
    const response = await fetch('/api/slides', { method: 'POST', body: formData });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'Upload fehlgeschlagen.');

    elements.uploadForm.reset();
    elements.uploadForm.dimOverlay.value = '0.3';
    elements.uploadForm.zoom.value = '1';
    elements.uploadForm.focusX.value = '50';
    elements.uploadForm.focusY.value = '50';
    resetUploadPreview();
    syncRangeInputs(elements.uploadForm);
    const count = payload.addedCount || 1;
    flashMessage(elements.uploadMessage, `${count} Bild${count > 1 ? 'er' : ''} hinzugefügt.`);
    await loadState();
    activateTab('galleryPanel');
  } catch (e) { flashMessage(elements.uploadMessage, e.message, true); }
}

async function handleSettingsSubmit(event) {
  event.preventDefault();
  if (typeof window.__flushFrameUiScales === 'function') window.__flushFrameUiScales();
  const f = elements.settingsForm;
  const payload = {
    frameName: f.frameName.value,
    durationMs: Number(f.durationMs.value),
    transitionMs: Number(f.transitionMs.value),
    fitMode: f.fitMode.value,
    overlayTheme: f.overlayTheme.value,
    accent: f.accent.value,
    backgroundStyle: f.backgroundStyle.value,
    shuffle: f.shuffle.checked,
    motion: f.motion.checked,
    showClock: f.showClock.checked,
    showSlideInfo: f.showSlideInfo.checked,
    showCounter: f.showCounter.checked,
    weatherLocation: f.weatherLocation ? f.weatherLocation.value : '',
    showWeather: f.showWeather ? f.showWeather.checked : true,
  };
  try {
    await requestJson('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    flashMessage(elements.settingsMessage, 'Einstellungen gespeichert.');
    await loadState();
  } catch (e) { flashMessage(elements.settingsMessage, e.message, true); }
}

// ---------- state ----------
function hydrate(state) {
  currentState = state;
  populateSettings(state.settings);
  if (typeof window.__populateFrameUiScales === 'function') {
    window.__populateFrameUiScales(state.calendar && state.calendar.settings);
  }
  updateStats(state);
  renderSlides(state.slides);
  syncRangeInputs(elements.uploadForm);
  refreshUploadPreview();
  if (editingSlideId && elements.editDialog.open) {
    const stillExists = state.slides.some((s) => s.id === editingSlideId);
    if (!stillExists) closeEditDialog();
  }
}

async function loadState() {
  const state = await requestJson('/api/state');
  hydrate(state);
}

// ---------- events ----------
socket.on('connect', () => setConnectionState(true));
socket.on('disconnect', () => setConnectionState(false));
socket.on('state:update', (state) => hydrate(state));

elements.imageInput.addEventListener('change', () => onImagePicked(elements.imageInput.files));
elements.clearPreviewButton.addEventListener('click', () => {
  elements.imageInput.value = '';
  resetUploadPreview();
});

// Live preview updates on ANY form input
elements.uploadForm.addEventListener('input', (event) => {
  if (event.target.matches('input[type="range"]')) syncRangeInputs(elements.uploadForm);
  refreshUploadPreview();
});
elements.uploadForm.addEventListener('change', refreshUploadPreview);

elements.editForm.addEventListener('input', (event) => {
  if (event.target.matches('input[type="range"]')) syncRangeInputs(elements.editForm);
  refreshEditPreview();
});
elements.editForm.addEventListener('change', refreshEditPreview);

elements.uploadForm.addEventListener('submit', handleUploadSubmit);
elements.settingsForm.addEventListener('submit', handleSettingsSubmit);

// ---------- Live Frame UI-Scales ----------
(function initFrameUiScales() {
  const sliders = document.querySelectorAll('[data-scale]');
  if (!sliders.length) return;
  const labels = {};
  document.querySelectorAll('[data-scale-label]').forEach((el) => { labels[el.dataset.scaleLabel] = el; });
  let debounceTimer = null;
  const latestValues = {};
  const lastInteract = {}; // key -> timestamp

  function updateLabel(key, val) {
    if (labels[key]) labels[key].textContent = Math.round(val * 100) + '%';
  }

  function sendLive() {
    const cal = (currentState && currentState.calendar && currentState.calendar.settings) || {};
    const payload = {
      photoWidgetMax: cal.photoWidgetMax ?? 3,
      showPhotoWidget: cal.showPhotoWidget !== false,
      swipeEnabled: cal.swipeEnabled !== false,
      weekStartsOnMonday: cal.weekStartsOnMonday !== false,
      photoUiScale: cal.photoUiScale ?? 1,
      photoUiScaleWeather: cal.photoUiScaleWeather ?? 1,
      photoUiScaleClock: cal.photoUiScaleClock ?? 1,
      photoUiScaleSensors: cal.photoUiScaleSensors ?? 1,
      photoUiScaleEvents: cal.photoUiScaleEvents ?? 1,
      ...latestValues,
    };
    fetch('/api/calendar/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  function markInteract(key) {
    lastInteract[key] = Date.now();
  }

  sliders.forEach((slider) => {
    const key = slider.dataset.scale;
    const onChange = () => {
      const val = Number(slider.value);
      updateLabel(key, val);
      latestValues[key] = val;
      markInteract(key);
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(sendLive, 120);
    };
    const flushNow = () => {
      const val = Number(slider.value);
      latestValues[key] = val;
      clearTimeout(debounceTimer);
      sendLive();
    };
    slider.addEventListener('input', onChange);
    slider.addEventListener('change', flushNow);
    ['pointerup','touchend','mouseup','blur'].forEach((ev) => {
      slider.addEventListener(ev, flushNow, { passive: true });
    });
    ['pointerdown','touchstart','mousedown'].forEach((ev) => {
      slider.addEventListener(ev, () => markInteract(key), { passive: true });
    });
  });

  // Flush pending debounce synchronously (e.g. before Einstellungen speichern)
  window.__flushFrameUiScales = function () {
    if (Object.keys(latestValues).length) {
      clearTimeout(debounceTimer);
      sendLive();
    }
  };

  // Populate from state (but NEVER overwrite a slider the user touched in the last 1500ms)
  window.__populateFrameUiScales = function (calSettings) {
    const now = Date.now();
    sliders.forEach((slider) => {
      const key = slider.dataset.scale;
      if (lastInteract[key] && now - lastInteract[key] < 1500) return; // still interacting
      const serverVal = Number(calSettings?.[key]);
      const val = Number.isFinite(serverVal) && serverVal > 0 ? serverVal : 1;
      latestValues[key] = val;
      slider.value = val;
      updateLabel(key, val);
    });
  };
})();

// init
syncRangeInputs(elements.uploadForm);
refreshUploadPreview();
loadState().catch((e) => flashMessage(elements.settingsMessage, e.message, true));
