const socket = io();

const Core = window.FrameflowCalendar;
const {
  ICONS,
  renderIconSvg,
  iconLabel,
  searchIcons,
  escapeHtml,
  toLocalDateKey,
  formatTime,
  formatDayLabel,
  startOfDay,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addMonths,
  isSameDay,
  formatRange,
  eventMinutes,
  eventsOnDay,
} = Core;

const DAY_HOUR_START = 0;
const DAY_HOUR_END = 24;
const HOUR_HEIGHT = 96;
const WEEKDAYS_SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const el = (id) => document.getElementById(id);

const primaryLayer = el('slidePrimary');
const secondaryLayer = el('slideSecondary');
const frameStage = document.querySelector('.frame-stage');
const framePhotoView = el('framePhotoView');
const frameCalendarView = el('frameCalendarView');
const frameCounter = el('frameCounter');
const frameClock = el('frameClock');
const frameWeather = el('frameWeather');
const frameWeatherIcon = el('frameWeatherIcon');
const frameWeatherTemp = el('frameWeatherTemp');
const frameWeatherLoc = el('frameWeatherLoc');
const frameEmpty = el('frameEmpty');
const frameBackground = el('frameBackground');
const photoEventWidget = el('photoEventWidget');
const photoEventDate = el('photoEventDate');
const photoEventList = el('photoEventList');
const photoEventHide = el('photoEventHide');
const photoEventShow = el('photoEventShow');
const frameCalendarContent = el('frameCalendarContent');
const frameCalendarTitle = el('frameCalendarTitle');
const frameCalendarSurface = el('frameCalendarSurface');
const frameCalendarTabs = el('frameCalendarTabs');
const frameCalendarPrev = el('frameCalendarPrev');
const frameCalendarNext = el('frameCalendarNext');
const frameCalendarToday = el('frameCalendarToday');
const frameCalendarNew = el('frameCalendarNew');
const frameCalendarMenu = el('frameCalendarMenu');
const dotPhoto = el('dotPhoto');
const dotCalendar = el('dotCalendar');

const eventDialog = el('eventDialog');
const eventForm = el('eventForm');
const eventDialogTitle = el('eventDialogTitle');
const eventDeleteButton = el('eventDeleteButton');
const eventCategoryChips = el('eventCategoryChips');
const eventIconTrigger = el('eventIconTrigger');
const eventIconPreview = el('eventIconPreview');
const eventIconLabel = el('eventIconLabel');

const categoryDialog = el('categoryDialog');
const categoryForm = el('categoryForm');
const categoryDialogTitle = el('categoryDialogTitle');
const categoryDeleteButton = el('categoryDeleteButton');
const categoryIconTrigger = el('categoryIconTrigger');
const categoryIconPreview = el('categoryIconPreview');
const categoryIconLabel = el('categoryIconLabel');

const iconPickerDialog = el('iconPickerDialog');
const iconSearchInput = el('iconSearchInput');
const iconGrid = el('iconGrid');

const menuDialog = el('menuDialog');
const menuTabs = el('menuTabs');
const menuNewCategory = el('menuNewCategory');
const categoryList = el('categoryList');
const settingsForm = el('calendarSettingsForm');

let currentState = {
  slides: [],
  settings: {
    durationMs: 8000,
    transitionMs: 1400,
    shuffle: false,
    motion: true,
    showClock: false,
    fitMode: 'cover',
    accent: '#f97316',
    overlayTheme: 'glass',
    backgroundStyle: 'aurora',
    showSlideInfo: true,
    showCounter: true,
    frameName: 'Frame',
  },
  calendar: {
    settings: { photoWidgetMax: 3, showPhotoWidget: true, swipeEnabled: true },
    categories: [],
    events: [],
  },
};
let appBuildId = null;

let activeLayer = primaryLayer;
let passiveLayer = secondaryLayer;
let currentIndex = 0;
let slideshowTimer = null;
let clockTimer = null;
let activeView = 'photo';
let touchStart = null;
let dragScrollState = null;
let suppressCalendarClickUntil = 0;
let lastCalendarActivity = 0;
let calendarReturnTimer = null;
const CALENDAR_IDLE_SCROLL_MS = 8000;
const CALENDAR_RETURN_TO_PHOTO_MS = 120000;

let calendarView = {
  mode: 'day',
  anchor: startOfDay(new Date()),
  transitionDirection: 'next',
};

let iconPickerTarget = null;
let selectedEventCategoryId = null;

// ---------- helpers ----------

function categoryLookup() {
  return new Map(currentState.calendar.categories.map((category) => [category.id, category]));
}

function requestJson(url, options = {}) {
  return fetch(url, options).then(async (response) => {
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'Anfrage fehlgeschlagen');
    return payload;
  });
}

function toDatetimeInput(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (value) => `${value}`.padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function upcomingEvents(limit = 3) {
  const now = Date.now();
  const todayKey = toLocalDateKey(new Date());
  return currentState.calendar.events
    .filter((event) => {
      // Only today's events
      const startKey = toLocalDateKey(new Date(event.startAt));
      if (startKey !== todayKey) return false;
      // Hide events that are already over
      const end = new Date(event.endAt || event.startAt).getTime();
      return end >= now;
    })
    .sort((left, right) => new Date(left.startAt).getTime() - new Date(right.startAt).getTime())
    .slice(0, limit);
}

// ---------- photo widget ----------

let photoEventHidden = (() => {
  try { return localStorage.getItem('photoEventHidden') === '1'; }
  catch { return false; }
})();

function applyPhotoWidgetVisibility(itemsCount) {
  const settings = currentState.calendar.settings;
  const shouldShowAtAll = settings.showPhotoWidget && itemsCount > 0 && activeView === 'photo';
  const hiddenByUser = photoEventHidden;
  photoEventWidget.classList.toggle('hidden', !shouldShowAtAll || hiddenByUser);
  photoEventShow.classList.toggle('hidden', !shouldShowAtAll || !hiddenByUser);
}

function renderPhotoWidget() {
  const settings = currentState.calendar.settings;
  const items = upcomingEvents(settings.photoWidgetMax || 3);
  applyPhotoWidgetVisibility(items.length);
  if (!items.length) { photoEventList.innerHTML = ''; return; }
  photoEventDate.textContent = formatDayLabel(toLocalDateKey(new Date()));
  const categories = categoryLookup();
  photoEventList.innerHTML = items.map((event) => {
    const category = categories.get(event.categoryId);
    const icon = event.icon || category?.icon || 'sparkles';
    const color = category?.color || '#f59e0b';
    const timeLabel = event.allDay
      ? 'Ganztägig'
      : `${formatTime(event.startAt)} – ${formatTime(event.endAt || event.startAt)}`;
    return `
      <article class="photo-event-item" style="--cat-color:${color}">
        <span class="photo-event-icon">${renderIconSvg(icon)}</span>
        <div class="photo-event-body">
          <strong>${escapeHtml(event.title)}</strong>
          <small>${timeLabel}</small>
        </div>
      </article>
    `;
  }).join('');
}

photoEventHide?.addEventListener('click', () => {
  photoEventHidden = true;
  try { localStorage.setItem('photoEventHidden', '1'); } catch {}
  renderPhotoWidget();
});
photoEventShow?.addEventListener('click', () => {
  photoEventHidden = false;
  try { localStorage.setItem('photoEventHidden', '0'); } catch {}
  renderPhotoWidget();
});

// ---------- calendar renderers ----------

function hourLabels() {
  return Array.from({ length: DAY_HOUR_END - DAY_HOUR_START }, (_, index) => {
    const hour = DAY_HOUR_START + index;
    return `<span>${String(hour).padStart(2, '0')}:00</span>`;
  }).join('');
}

function eventBlockMarkup(event, categoryMap, variant = 'day') {
  const category = categoryMap.get(event.categoryId);
  const color = category?.color || '#f59e0b';
  const icon = event.icon || category?.icon || 'sparkles';
  const { startMinutes, endMinutes } = eventMinutes(event);
  const baseMinutes = DAY_HOUR_START * 60;
  const top = ((Math.max(startMinutes, baseMinutes) - baseMinutes) / 60) * HOUR_HEIGHT;
  const height = Math.max(26, ((endMinutes - Math.max(startMinutes, baseMinutes)) / 60) * HOUR_HEIGHT - 2);
  const time = event.allDay ? 'Ganztägig' : `${formatTime(event.startAt)} – ${formatTime(event.endAt)}`;
  return `
    <button type="button" class="cal-event-block cal-event-block-${variant}" data-event-id="${event.id}" style="--cat-color:${color}; top:${top}px; height:${height}px;">
      <span class="cal-event-block-icon">${renderIconSvg(icon)}</span>
      <span class="cal-event-block-body">
        <strong>${escapeHtml(event.title)}</strong>
        <small>${time}</small>
      </span>
    </button>
  `;
}

function nowLineMarkup(dateValue) {
  if (!isSameDay(dateValue, new Date())) return '';
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const baseMinutes = DAY_HOUR_START * 60;
  const top = ((minutes - baseMinutes) / 60) * HOUR_HEIGHT;
  if (top < 0 || top > (DAY_HOUR_END - DAY_HOUR_START) * HOUR_HEIGHT) return '';
  return `<div class="cal-now-line" style="top:${top}px;"><span></span></div>`;
}

function renderCalendarDay() {
  const anchor = startOfDay(calendarView.anchor);
  const categoryMap = categoryLookup();
  const dayEvents = eventsOnDay(currentState.calendar.events, anchor);
  const allDay = dayEvents.filter((event) => event.allDay);
  const timed = dayEvents.filter((event) => !event.allDay);
  return `
    <div class="cal-day-shell">
      ${allDay.length ? `<div class="cal-allday-row">
        <span class="cal-allday-label">Ganztägig</span>
        <div class="cal-allday-events">${allDay.map((event) => {
          const category = categoryMap.get(event.categoryId);
          return `<button type="button" class="cal-chip-event" data-event-id="${event.id}" style="--cat-color:${category?.color || '#f59e0b'}">${renderIconSvg(event.icon || category?.icon || 'sparkles')}<span>${escapeHtml(event.title)}</span></button>`;
        }).join('')}</div>
      </div>` : ''}
      <div class="cal-day-grid" style="--hour-height:${HOUR_HEIGHT}px;">
        <div class="cal-hour-labels">${hourLabels()}</div>
        <div class="cal-day-track" data-date="${toLocalDateKey(anchor)}">
          ${Array.from({ length: DAY_HOUR_END - DAY_HOUR_START }, (_, i) => `<div class="cal-hour-slot" data-hour="${DAY_HOUR_START + i}"></div>`).join('')}
          ${nowLineMarkup(anchor)}
          ${timed.map((event) => eventBlockMarkup(event, categoryMap, 'day')).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderCalendarWeek() {
  const weekStart = startOfWeek(calendarView.anchor);
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const categoryMap = categoryLookup();
  const todayKey = toLocalDateKey(new Date());
  const header = days.map((dayDate) => {
    const key = toLocalDateKey(dayDate);
    const weekday = new Intl.DateTimeFormat('de-DE', { weekday: 'short' }).format(dayDate);
    return `<div class="cal-week-head-cell ${key === todayKey ? 'is-today' : ''}"><small>${escapeHtml(weekday)}</small><strong>${dayDate.getDate()}</strong></div>`;
  }).join('');
  const allDayByDay = days.map((dayDate) =>
    eventsOnDay(currentState.calendar.events, dayDate).filter((event) => event.allDay)
  );
  const hasAnyAllDay = allDayByDay.some((list) => list.length > 0);
  const allDayRow = hasAnyAllDay ? `
    <div class="cal-week-allday-row">
      <span class="cal-allday-label">Ganztägig</span>
      <div class="cal-week-allday-grid">
        ${allDayByDay.map((list) => `
          <div class="cal-week-allday-cell">
            ${list.map((event) => {
              const category = categoryMap.get(event.categoryId);
              return `<button type="button" class="cal-chip-event" data-event-id="${event.id}" style="--cat-color:${category?.color || '#f59e0b'}">${renderIconSvg(event.icon || category?.icon || 'sparkles')}<span>${escapeHtml(event.title)}</span></button>`;
            }).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';
  const columns = days.map((dayDate) => {
    const dayEvents = eventsOnDay(currentState.calendar.events, dayDate).filter((event) => !event.allDay);
    return `
      <div class="cal-week-day-track" data-date="${toLocalDateKey(dayDate)}">
        ${Array.from({ length: DAY_HOUR_END - DAY_HOUR_START }, (_, i) => `<div class="cal-hour-slot" data-hour="${DAY_HOUR_START + i}"></div>`).join('')}
        ${nowLineMarkup(dayDate)}
        ${dayEvents.map((event) => eventBlockMarkup(event, categoryMap, 'week')).join('')}
      </div>
    `;
  }).join('');
  return `
    <div class="cal-week-shell" style="--hour-height:${HOUR_HEIGHT}px;">
      <div class="cal-week-sticky-head">
        <div class="cal-week-head"><div></div>${header}</div>
        ${allDayRow}
      </div>
      <div class="cal-week-body">
        <div class="cal-hour-labels">${hourLabels()}</div>
        <div class="cal-week-grid">${columns}</div>
      </div>
    </div>
  `;
}

function renderCalendarMonth() {
  const monthStart = startOfMonth(calendarView.anchor);
  const gridStart = startOfWeek(monthStart);
  const monthKey = `${monthStart.getFullYear()}-${`${monthStart.getMonth() + 1}`.padStart(2, '0')}`;
  const categoryMap = categoryLookup();
  const todayKey = toLocalDateKey(new Date());
  const head = WEEKDAYS_SHORT.map((day) => `<span>${day}</span>`).join('');
  const cells = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index)).map((dayDate) => {
    const key = toLocalDateKey(dayDate);
    const allDayEvents = eventsOnDay(currentState.calendar.events, dayDate);
    const visibleEvents = allDayEvents.slice(0, 3);
    const extraCount = allDayEvents.length - visibleEvents.length;
    const isCurrent = key.startsWith(monthKey);
    const isToday = key === todayKey;
    return `
      <article class="cal-month-cell ${isCurrent ? '' : 'is-muted'} ${isToday ? 'is-today' : ''}" data-date="${key}">
        <header><span class="cal-month-day-number">${dayDate.getDate()}</span></header>
        <div class="cal-month-events">${visibleEvents.map((event) => {
          const category = categoryMap.get(event.categoryId);
          return `<button type="button" class="cal-month-event" data-event-id="${event.id}" style="--cat-color:${category?.color || '#f59e0b'}">${renderIconSvg(event.icon || category?.icon || 'sparkles')}<span>${escapeHtml(event.title)}</span></button>`;
        }).join('')}${extraCount > 0 ? `<button type="button" class="cal-month-more" data-date="${key}">+${extraCount} weitere</button>` : ''}</div>
      </article>
    `;
  }).join('');
  return `<div class="cal-month-shell"><div class="cal-month-head">${head}</div><div class="cal-month-grid">${cells}</div></div>`;
}

function updateFrameCalendarTitle() {
  const { mode, anchor } = calendarView;
  let start = anchor;
  let end = anchor;
  if (mode === 'week') { start = startOfWeek(anchor); end = endOfWeek(anchor); }
  else if (mode === 'month') { start = startOfMonth(anchor); end = endOfMonth(anchor); }
  frameCalendarTitle.textContent = formatRange(start, end, mode);
}

function renderFrameCalendar() {
  frameCalendarTabs.querySelectorAll('button[data-view]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.view === calendarView.mode);
  });
  updateFrameCalendarTitle();
  const markup = calendarView.mode === 'month' ? renderCalendarMonth()
    : calendarView.mode === 'week' ? renderCalendarWeek()
    : renderCalendarDay();
  const direction = calendarView.transitionDirection === 'prev' ? 'from-left' : 'from-right';
  frameCalendarContent.classList.remove('from-left', 'from-right');
  frameCalendarContent.innerHTML = markup;
  void frameCalendarContent.offsetWidth;
  frameCalendarContent.classList.add(direction);
  if (calendarView.mode !== 'month' && frameCalendarSurface) scrollCalendarToNow(false);
}

function scrollCalendarToNow(smooth = true) {
  if (!frameCalendarSurface || calendarView.mode === 'month') return;
  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const target = Math.max(0, ((minutesNow / 60) - 1.5) * HOUR_HEIGHT);
  if (!smooth) { frameCalendarSurface.scrollTop = target; return; }
  animateScrollTo(frameCalendarSurface, target, 2400);
}

let scrollAnimFrame = null;
function animateScrollTo(element, target, duration) {
  if (scrollAnimFrame) cancelAnimationFrame(scrollAnimFrame);
  const start = element.scrollTop;
  const delta = target - start;
  if (Math.abs(delta) < 1) return;
  const startTime = performance.now();
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const step = (now) => {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    element.scrollTop = start + delta * easeInOutCubic(t);
    if (t < 1) scrollAnimFrame = requestAnimationFrame(step);
    else scrollAnimFrame = null;
  };
  scrollAnimFrame = requestAnimationFrame(step);
}

function updateNowLinePositions() {
  if (activeView !== 'calendar' || calendarView.mode === 'month') return;
  const minutes = new Date().getHours() * 60 + new Date().getMinutes();
  const top = (minutes / 60) * HOUR_HEIGHT;
  frameCalendarContent.querySelectorAll('.cal-now-line').forEach((line) => { line.style.top = `${top}px`; });
}

function shiftFrameCalendar(direction) {
  calendarView.transitionDirection = direction < 0 ? 'prev' : 'next';
  if (calendarView.mode === 'month') calendarView.anchor = addMonths(calendarView.anchor, direction);
  else if (calendarView.mode === 'week') calendarView.anchor = addDays(calendarView.anchor, 7 * direction);
  else calendarView.anchor = addDays(calendarView.anchor, direction);
  renderFrameCalendar();
}

// ---------- view switching ----------

function setActiveView(view, direction = 'right') {
  activeView = view;
  const isPhoto = view === 'photo';
  frameStage.dataset.view = view;
  frameStage.dataset.direction = direction;
  framePhotoView.classList.toggle('is-active', isPhoto);
  frameCalendarView.classList.toggle('is-active', !isPhoto);
  dotPhoto.classList.toggle('is-active', isPhoto);
  dotCalendar.classList.toggle('is-active', !isPhoto);
  renderPhotoWidget();
  if (!isPhoto) {
    renderFrameCalendar();
    lastCalendarActivity = Date.now();
    if (calendarReturnTimer) window.clearTimeout(calendarReturnTimer);
    calendarReturnTimer = window.setTimeout(() => {
      if (activeView === 'calendar') setActiveView('photo', 'right');
    }, CALENDAR_RETURN_TO_PHOTO_MS);
  } else if (calendarReturnTimer) {
    window.clearTimeout(calendarReturnTimer);
    calendarReturnTimer = null;
  }
}

function markCalendarActivity() {
  lastCalendarActivity = Date.now();
  if (calendarReturnTimer) window.clearTimeout(calendarReturnTimer);
  if (activeView !== 'calendar') return;
  calendarReturnTimer = window.setTimeout(() => {
    if (activeView === 'calendar') setActiveView('photo', 'right');
  }, CALENDAR_RETURN_TO_PHOTO_MS);
}

// ---------- slideshow ----------

function applyLayerContent(layer, slide, settings) {
  const image = layer.querySelector('.frame-image');
  const title = layer.querySelector('.frame-title');
  const subtitle = layer.querySelector('.frame-subtitle');
  const overlay = layer.querySelector('.frame-overlay');
  const copy = layer.querySelector('.frame-copy');
  const meta = layer.querySelector('.frame-slide-meta');
  image.src = slide.imageUrl;
  image.style.objectFit = settings.fitMode;
  image.style.objectPosition = `${slide.focusX ?? 50}% ${slide.focusY ?? 50}%`;
  image.style.setProperty('--slide-zoom', String(slide.zoom ?? 1));
  image.dataset.filter = slide.filterStyle || 'natural';
  title.textContent = slide.title || '';
  subtitle.textContent = slide.subtitle || '';
  overlay.style.setProperty('--overlay-opacity', String(slide.dimOverlay ?? 0.3));
  copy.dataset.align = slide.captionAlign || 'left';
  copy.dataset.size = slide.textSize || 'md';
  copy.dataset.card = slide.frameStyle || 'floating';
  meta.innerHTML = settings.showSlideInfo
    ? [slide.infoTag, slide.dateLabel, slide.locationLabel].filter(Boolean).map((v) => `<span>${v}</span>`).join('')
    : '';
  meta.classList.toggle('hidden', !settings.showSlideInfo || !meta.innerHTML);
}

function swapLayers() {
  activeLayer.classList.remove('is-visible');
  passiveLayer.classList.add('is-visible');
  [activeLayer, passiveLayer] = [passiveLayer, activeLayer];
}

function orderedSlides(slides, shuffle) {
  if (!shuffle) return slides.slice();
  const cloned = slides.slice();
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function scheduleNextTick() {
  window.clearTimeout(slideshowTimer);
  if (currentState.slides.length < 2) return;
  slideshowTimer = window.setTimeout(showNextSlide, currentState.settings.durationMs);
}

function showEmptyState() {
  frameEmpty.classList.add('is-visible');
  primaryLayer.classList.remove('is-visible');
  secondaryLayer.classList.remove('is-visible');
  window.clearTimeout(slideshowTimer);
}

function renderCurrentSlide(immediate = false) {
  const slides = currentState.slides;
  if (!slides.length) { showEmptyState(); return; }
  frameEmpty.classList.remove('is-visible');
  const slide = slides[currentIndex % slides.length];
  applyLayerContent(passiveLayer, slide, currentState.settings);
  if (immediate && !activeLayer.querySelector('.frame-image').src) {
    applyLayerContent(activeLayer, slide, currentState.settings);
    activeLayer.classList.add('is-visible');
  } else {
    swapLayers();
  }
  document.documentElement.style.setProperty('--accent-color', currentState.settings.accent);
  document.documentElement.style.setProperty('--transition-ms', `${currentState.settings.transitionMs}ms`);
  document.documentElement.style.setProperty('--motion-state', currentState.settings.motion ? 'running' : 'paused');
  document.body.dataset.overlayTheme = currentState.settings.overlayTheme;
  frameBackground.className = `frame-background ${currentState.settings.backgroundStyle}`;
  frameCounter.textContent = `${currentIndex + 1} / ${slides.length}`;
  frameCounter.classList.toggle('hidden', !currentState.settings.showCounter || slides.length <= 1);
  frameClock.classList.toggle('hidden', !currentState.settings.showClock);
  renderPhotoWidget();
  scheduleNextTick();
}

function showNextSlide() {
  if (!currentState.slides.length) return;
  currentIndex = (currentIndex + 1) % currentState.slides.length;
  renderCurrentSlide();
}

function updateClock() {
  if (currentState.settings.showClock) {
    frameClock.textContent = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(new Date());
  }
  // Refresh upcoming-events widget every minute so past events drop off
  if (activeView === 'photo' && currentState.calendar && currentState.calendar.events) {
    const seconds = new Date().getSeconds();
    if (seconds === 0 || !renderPhotoWidget._lastMinute || renderPhotoWidget._lastMinute !== new Date().getMinutes()) {
      renderPhotoWidget._lastMinute = new Date().getMinutes();
      renderPhotoWidget();
    }
  }
}

// ---------- state ----------

function applyState(state) {
  if (state.appBuild && appBuildId && state.appBuild !== appBuildId) {
    window.location.replace(`${window.location.pathname}?v=${Date.now()}`);
    return;
  }
  if (state.appBuild) appBuildId = state.appBuild;
  const prevIds = currentState.slides.map((s) => s && s.id).filter(Boolean).sort().join('|');
  const incomingSlides = state.slides || [];
  const nextIds = incomingSlides.map((s) => s && s.id).filter(Boolean).sort().join('|');
  const slidesChanged = prevIds !== nextIds;
  const nextSlides = slidesChanged
    ? orderedSlides(incomingSlides, state.settings?.shuffle)
    : currentState.slides;
  currentState = {
    slides: nextSlides,
    settings: { ...currentState.settings, ...(state.settings || {}) },
    calendar: { ...currentState.calendar, ...(state.calendar || {}) },
  };
  if (currentIndex >= currentState.slides.length) currentIndex = 0;
  if (slidesChanged) renderCurrentSlide(true);
  updateClock();
  renderCategoryList();
  hydrateSettingsForm();
  if (activeView === 'calendar') renderFrameCalendar();
  scheduleWeather();
}

function hydrateSettingsForm() {
  const calSettings = currentState.calendar.settings;
  if (settingsForm.photoWidgetMax) settingsForm.photoWidgetMax.value = calSettings.photoWidgetMax ?? 3;
  if (settingsForm.showPhotoWidget) settingsForm.showPhotoWidget.checked = Boolean(calSettings.showPhotoWidget);
  if (settingsForm.swipeEnabled) settingsForm.swipeEnabled.checked = Boolean(calSettings.swipeEnabled);
  const scale = Number(calSettings.photoUiScale) || 1;
  document.documentElement.style.setProperty('--photo-ui-scale', String(scale));
  const scaleW = Number(calSettings.photoUiScaleWeather) || 1;
  const scaleC = Number(calSettings.photoUiScaleClock) || 1;
  const scaleS = Number(calSettings.photoUiScaleSensors) || 1;
  const scaleE = Number(calSettings.photoUiScaleEvents) || 1;
  document.documentElement.style.setProperty('--photo-ui-scale-weather', String(scaleW));
  document.documentElement.style.setProperty('--photo-ui-scale-clock', String(scaleC));
  document.documentElement.style.setProperty('--photo-ui-scale-sensors', String(scaleS));
  document.documentElement.style.setProperty('--photo-ui-scale-events', String(scaleE));
  // Direkt als inline transform setzen, damit es auch ohne <style>-Block im HTML wirkt
  const applyTransform = (selector, factor, origin) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.transform = `scale(${factor})`;
      el.style.transformOrigin = origin;
      el.style.transition = 'transform 220ms ease';
    });
  };
  applyTransform('.frame-weather, #weatherWidget, .weather-widget', scale * scaleW, 'top left');
  applyTransform('.frame-clock', scale * scaleC, 'top right');
  applyTransform('.frame-sensors', scale * scaleS, 'top center');
  applyTransform('.photo-event-widget', scale * scaleE, 'bottom right');
  applyTransform('.frame-copy', scale, 'bottom left');
}

// ---------- icon picker ----------

function openIconPicker(target) {
  iconPickerTarget = target;
  iconSearchInput.value = '';
  renderIconGrid('');
  iconPickerDialog.showModal();
  requestAnimationFrame(() => iconSearchInput.focus());
}

function renderIconGrid(query) {
  const icons = searchIcons(query);
  if (!icons.length) { iconGrid.innerHTML = '<p class="cal-helper">Keine Symbole gefunden.</p>'; return; }
  iconGrid.innerHTML = icons.map((icon) => `
    <button type="button" class="cal-icon-tile" data-icon="${icon.key}">
      <span>${renderIconSvg(icon.key)}</span>
      <strong>${escapeHtml(icon.label)}</strong>
    </button>
  `).join('');
}

function setIconSelection(iconKey) {
  if (iconPickerTarget === 'event') {
    eventForm.icon.value = iconKey;
    eventIconPreview.innerHTML = renderIconSvg(iconKey);
    eventIconLabel.textContent = iconLabel(iconKey);
  } else if (iconPickerTarget === 'category') {
    categoryForm.icon.value = iconKey;
    categoryIconPreview.innerHTML = renderIconSvg(iconKey);
    categoryIconLabel.textContent = iconLabel(iconKey);
  }
}

// ---------- event dialog ----------

function renderCategoryChips(selectedId) {
  selectedEventCategoryId = selectedId;
  eventCategoryChips.innerHTML = currentState.calendar.categories.map((category) => `
    <button type="button" class="cal-category-chip ${category.id === selectedId ? 'is-active' : ''}" data-category-id="${category.id}" style="--cat-color:${category.color}">
      <span>${renderIconSvg(category.icon)}</span>
      ${escapeHtml(category.name)}
    </button>
  `).join('');
}

function openEventDialog({ eventId = '', defaultDate = null } = {}) {
  eventForm.reset();
  eventForm.eventId.value = '';
  eventDeleteButton.classList.add('hidden');
  if (eventId) {
    const event = currentState.calendar.events.find((entry) => entry.id === eventId);
    if (!event) return;
    eventDialogTitle.textContent = 'Termin bearbeiten';
    eventForm.eventId.value = event.id;
    eventForm.title.value = event.title;
    eventForm.notes.value = event.notes || '';
    eventForm.startAt.value = toDatetimeInput(event.startAt);
    eventForm.endAt.value = toDatetimeInput(event.endAt);
    eventForm.allDay.checked = Boolean(event.allDay);
    const iconKey = event.icon || currentState.calendar.categories.find((c) => c.id === event.categoryId)?.icon || 'sparkles';
    eventForm.icon.value = iconKey;
    eventIconPreview.innerHTML = renderIconSvg(iconKey);
    eventIconLabel.textContent = iconLabel(iconKey);
    renderCategoryChips(event.categoryId);
    eventDeleteButton.classList.remove('hidden');
  } else {
    eventDialogTitle.textContent = 'Neuer Termin';
    const base = defaultDate ? new Date(defaultDate) : new Date();
    const start = new Date(base);
    if (!defaultDate) { start.setMinutes(0, 0, 0); start.setHours(start.getHours() + 1); }
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    eventForm.startAt.value = toDatetimeInput(start.toISOString());
    eventForm.endAt.value = toDatetimeInput(end.toISOString());
    const firstCategory = currentState.calendar.categories[0];
    if (firstCategory) {
      eventForm.icon.value = firstCategory.icon;
      eventIconPreview.innerHTML = renderIconSvg(firstCategory.icon);
      eventIconLabel.textContent = iconLabel(firstCategory.icon);
      renderCategoryChips(firstCategory.id);
    }
  }
  eventDialog.showModal();
}

async function submitEventForm(submitEvent) {
  submitEvent.preventDefault();
  const payload = {
    title: eventForm.title.value,
    notes: eventForm.notes.value,
    categoryId: selectedEventCategoryId,
    startAt: new Date(eventForm.startAt.value).toISOString(),
    endAt: new Date(eventForm.endAt.value).toISOString(),
    allDay: eventForm.allDay.checked,
    icon: eventForm.icon.value,
  };
  const eventId = eventForm.eventId.value;
  const url = eventId ? `/api/calendar/events/${eventId}` : '/api/calendar/events';
  await requestJson(url, {
    method: eventId ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const nextCal = await requestJson('/api/calendar');
  currentState.calendar = nextCal;
  renderFrameCalendar();
  renderCategoryList();
  eventDialog.close();
}

async function deleteEvent() {
  const eventId = eventForm.eventId.value;
  if (!eventId) return;
  if (!window.confirm('Diesen Termin wirklich löschen?')) return;
  await fetch(`/api/calendar/events/${eventId}`, { method: 'DELETE' });
  const nextCal = await requestJson('/api/calendar');
  currentState.calendar = nextCal;
  renderFrameCalendar();
  eventDialog.close();
}

// ---------- category dialog ----------

function renderCategoryList() {
  if (!categoryList) return;
  if (!currentState.calendar.categories.length) {
    categoryList.innerHTML = '<p class="cal-helper">Noch keine Kategorien angelegt.</p>';
    return;
  }
  categoryList.innerHTML = currentState.calendar.categories.map((category) => `
    <button type="button" class="cal-category-card" data-category-id="${category.id}" style="--cat-color:${category.color}">
      <span class="cal-category-icon">${renderIconSvg(category.icon)}</span>
      <div>
        <strong>${escapeHtml(category.name)}</strong>
        <small>${escapeHtml(iconLabel(category.icon))}</small>
      </div>
    </button>
  `).join('');
}

function openCategoryDialog({ categoryId = '' } = {}) {
  categoryForm.reset();
  categoryForm.categoryId.value = '';
  categoryDeleteButton.classList.add('hidden');
  if (categoryId) {
    const category = currentState.calendar.categories.find((entry) => entry.id === categoryId);
    if (!category) return;
    categoryDialogTitle.textContent = 'Kategorie bearbeiten';
    categoryForm.categoryId.value = category.id;
    categoryForm.name.value = category.name;
    categoryForm.color.value = category.color;
    categoryForm.icon.value = category.icon;
    categoryIconPreview.innerHTML = renderIconSvg(category.icon);
    categoryIconLabel.textContent = iconLabel(category.icon);
    if (currentState.calendar.categories.length > 1) categoryDeleteButton.classList.remove('hidden');
  } else {
    categoryDialogTitle.textContent = 'Neue Kategorie';
    categoryForm.color.value = '#f59e0b';
    categoryForm.icon.value = 'sparkles';
    categoryIconPreview.innerHTML = renderIconSvg('sparkles');
    categoryIconLabel.textContent = iconLabel('sparkles');
  }
  categoryDialog.showModal();
}

async function submitCategoryForm(submitEvent) {
  submitEvent.preventDefault();
  const payload = { name: categoryForm.name.value, color: categoryForm.color.value, icon: categoryForm.icon.value };
  const categoryId = categoryForm.categoryId.value;
  const url = categoryId ? `/api/calendar/categories/${categoryId}` : '/api/calendar/categories';
  await requestJson(url, {
    method: categoryId ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const nextCal = await requestJson('/api/calendar');
  currentState.calendar = nextCal;
  renderFrameCalendar();
  renderCategoryList();
  categoryDialog.close();
}

async function deleteCategoryAction() {
  const categoryId = categoryForm.categoryId.value;
  if (!categoryId) return;
  if (!window.confirm('Kategorie löschen? Termine werden einer anderen Kategorie zugeordnet.')) return;
  await fetch(`/api/calendar/categories/${categoryId}`, { method: 'DELETE' });
  const nextCal = await requestJson('/api/calendar');
  currentState.calendar = nextCal;
  renderFrameCalendar();
  renderCategoryList();
  categoryDialog.close();
}

// ---------- wiring ----------

socket.on('state:update', applyState);

fetch('/api/state').then((r) => r.json()).then(applyState).catch(() => showEmptyState());

frameCalendarTabs.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-view]');
  if (!button || button.dataset.view === calendarView.mode) return;
  calendarView.transitionDirection = 'next';
  calendarView.mode = button.dataset.view;
  renderFrameCalendar();
  markCalendarActivity();
});

frameCalendarPrev.addEventListener('click', () => { shiftFrameCalendar(-1); markCalendarActivity(); });
frameCalendarNext.addEventListener('click', () => { shiftFrameCalendar(1); markCalendarActivity(); });
frameCalendarToday.addEventListener('click', () => {
  calendarView.transitionDirection = 'next';
  calendarView.anchor = startOfDay(new Date());
  renderFrameCalendar();
  markCalendarActivity();
});
frameCalendarNew.addEventListener('click', () => { openEventDialog(); markCalendarActivity(); });
frameCalendarMenu.addEventListener('click', () => { menuDialog.showModal(); markCalendarActivity(); });

// Click on calendar content: event edit / hour-slot create / month-cell drill
frameCalendarContent.addEventListener('click', (event) => {
  if (Date.now() < suppressCalendarClickUntil) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  const eventButton = event.target.closest('[data-event-id]');
  if (eventButton) { openEventDialog({ eventId: eventButton.dataset.eventId }); return; }
  const slot = event.target.closest('.cal-hour-slot');
  if (slot) {
    const track = slot.closest('[data-date]');
    if (track) {
      const hour = Number(slot.dataset.hour);
      const base = new Date(`${track.dataset.date}T00:00:00`);
      base.setHours(hour, 0, 0, 0);
      openEventDialog({ defaultDate: base });
    }
    return;
  }
  const monthCell = event.target.closest('.cal-month-cell[data-date]');
  if (monthCell) {
    calendarView.mode = 'day';
    calendarView.transitionDirection = 'next';
    calendarView.anchor = startOfDay(new Date(`${monthCell.dataset.date}T00:00:00`));
    renderFrameCalendar();
  }
});

// Event dialog
eventForm.addEventListener('submit', submitEventForm);
eventDeleteButton.addEventListener('click', deleteEvent);
eventCategoryChips.addEventListener('click', (event) => {
  const chip = event.target.closest('[data-category-id]');
  if (!chip) return;
  renderCategoryChips(chip.dataset.categoryId);
});
eventIconTrigger.addEventListener('click', () => openIconPicker('event'));

// Category dialog
categoryForm.addEventListener('submit', submitCategoryForm);
categoryDeleteButton.addEventListener('click', deleteCategoryAction);
categoryIconTrigger.addEventListener('click', () => openIconPicker('category'));

// Icon picker
iconSearchInput.addEventListener('input', (event) => renderIconGrid(event.target.value));
iconGrid.addEventListener('click', (event) => {
  const tile = event.target.closest('[data-icon]');
  if (!tile) return;
  setIconSelection(tile.dataset.icon);
  iconPickerDialog.close();
});

// Menu dialog
menuTabs.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-menu-tab]');
  if (!button) return;
  menuTabs.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b === button));
  menuDialog.querySelectorAll('[data-menu-panel]').forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.menuPanel === button.dataset.menuTab);
  });
});
menuNewCategory.addEventListener('click', () => openCategoryDialog());
categoryList.addEventListener('click', (event) => {
  const card = event.target.closest('[data-category-id]');
  if (!card) return;
  openCategoryDialog({ categoryId: card.dataset.categoryId });
});

settingsForm.addEventListener('submit', async (submitEvent) => {
  submitEvent.preventDefault();
  await requestJson('/api/calendar/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      photoWidgetMax: Number(settingsForm.photoWidgetMax.value),
      showPhotoWidget: settingsForm.showPhotoWidget.checked,
      swipeEnabled: settingsForm.swipeEnabled.checked,
      weekStartsOnMonday: true,
    }),
  });
  const nextCal = await requestJson('/api/calendar');
  currentState.calendar = nextCal;
  hydrateSettingsForm();
  renderFrameCalendar();
});

document.querySelectorAll('dialog [data-close]').forEach((button) => {
  button.addEventListener('click', (event) => {
    const dialog = event.currentTarget.closest('dialog');
    if (dialog) dialog.close();
  });
});

// Swipe between photo & calendar (only when a dialog is NOT open and not inside calendar scrolling)
function handleSwipeStart(event) {
  if (!currentState.calendar.settings.swipeEnabled) return;
  if (document.querySelector('dialog[open]')) return;
  const point = event.touches ? event.touches[0] : event;
  touchStart = { x: point.clientX, y: point.clientY, view: activeView };
}
function handleSwipeEnd(event) {
  if (!touchStart || !currentState.calendar.settings.swipeEnabled) { touchStart = null; return; }
  const point = event.changedTouches ? event.changedTouches[0] : event;
  const deltaX = point.clientX - touchStart.x;
  const deltaY = point.clientY - touchStart.y;
  const startedView = touchStart.view;
  touchStart = null;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  // In calendar mode we require a clearer horizontal gesture so vertical scrolling is not disturbed.
  const minX = startedView === 'calendar' ? 110 : 80;
  const dominance = startedView === 'calendar' ? 1.35 : 1.0;
  if (absX < minX || absX < absY * dominance) return;
  if (deltaX < 0) setActiveView('calendar', 'left');
  else setActiveView('photo', 'right');
}

function isInteractiveCalendarTarget(target) {
  return Boolean(target.closest('button, a, input, textarea, select, dialog, [contenteditable="true"]'));
}

function handleCalendarMouseDragStart(event) {
  if (activeView !== 'calendar') return;
  if (event.button !== 0) return;
  if (isInteractiveCalendarTarget(event.target)) return;
  dragScrollState = {
    startY: event.clientY,
    startScrollTop: frameCalendarSurface.scrollTop,
    moved: false,
  };
}

function handleCalendarMouseDragMove(event) {
  if (!dragScrollState || activeView !== 'calendar') return;
  const deltaY = event.clientY - dragScrollState.startY;
  if (Math.abs(deltaY) > 4) dragScrollState.moved = true;
  frameCalendarSurface.scrollTop = dragScrollState.startScrollTop - deltaY;
  markCalendarActivity();
}

function handleCalendarMouseDragEnd() {
  if (!dragScrollState) return;
  if (dragScrollState.moved) suppressCalendarClickUntil = Date.now() + 220;
  dragScrollState = null;
}

function handleSwipePointerStart(event) {
  if (!event.isPrimary) return;
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  handleSwipeStart(event);
}

function handleSwipePointerEnd(event) {
  if (!event.isPrimary) return;
  handleSwipeEnd(event);
}

function handleCalendarPointerDragStart(event) {
  if (!event.isPrimary) return;
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  handleCalendarMouseDragStart(event);
}

function handleCalendarPointerDragMove(event) {
  if (!event.isPrimary) return;
  handleCalendarMouseDragMove(event);
}

function handleCalendarPointerDragEnd(event) {
  if (!event.isPrimary) return;
  handleCalendarMouseDragEnd();
}

setActiveView('photo');

if (window.PointerEvent) {
  window.addEventListener('pointerdown', handleSwipePointerStart, { passive: true });
  window.addEventListener('pointerup', handleSwipePointerEnd, { passive: true });

  // Fallback drag-scroll for pointer devices that do not perform native touch scrolling in kiosk mode.
  frameCalendarSurface.addEventListener('pointerdown', handleCalendarPointerDragStart, { passive: true });
  window.addEventListener('pointermove', handleCalendarPointerDragMove, { passive: true });
  window.addEventListener('pointerup', handleCalendarPointerDragEnd, { passive: true });
  window.addEventListener('pointercancel', handleCalendarPointerDragEnd, { passive: true });
} else {
  window.addEventListener('touchstart', handleSwipeStart, { passive: true });
  window.addEventListener('touchend', handleSwipeEnd, { passive: true });
  window.addEventListener('mousedown', handleSwipeStart);
  window.addEventListener('mouseup', handleSwipeEnd);

  frameCalendarSurface.addEventListener('mousedown', handleCalendarMouseDragStart);
  window.addEventListener('mousemove', handleCalendarMouseDragMove);
  window.addEventListener('mouseup', handleCalendarMouseDragEnd);
  window.addEventListener('mouseleave', handleCalendarMouseDragEnd);
}

// Activity listeners inside calendar
['wheel', 'touchstart', 'touchmove', 'pointerdown', 'pointermove', 'mousedown', 'keydown', 'scroll'].forEach((eventName) => {
  frameCalendarSurface.addEventListener(eventName, markCalendarActivity, { passive: true });
});
frameCalendarView.addEventListener('click', markCalendarActivity);

clockTimer = window.setInterval(updateClock, 1000);
window.setInterval(() => {
  if (activeView !== 'calendar') return;
  if (document.querySelector('dialog[open]')) return;
  if (Date.now() - lastCalendarActivity < CALENDAR_IDLE_SCROLL_MS) return;
  scrollCalendarToNow(true);
}, 2000);
window.setInterval(updateNowLinePositions, 60000);

// ---------- weather ----------
let weatherCache = { loc: '', geo: null, at: 0 };
let weatherTimer = null;

const WEATHER_ICONS = {
  // Sun / Clear (WMO 0,1): rotating rays + pulsing core
  sun: '<svg class="wx-svg wx-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g class="wx-rays"><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></g><circle class="wx-sun-core" cx="12" cy="12" r="4.2"/></svg>',
  // Partly cloudy (2): sun rays rotate, cloud drifts
  partly: '<svg class="wx-svg wx-partly" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g class="wx-partly-sun"><circle cx="8" cy="9" r="3.2"/><g class="wx-rays wx-rays-small"><path d="M8 3v1.6M3.4 9H2M4.5 5.5l-1 -1M12.5 5.5l1 -1"/></g></g><path class="wx-cloud-drift" d="M10 17a4 4 0 0 1 0.8 -7.9 5 5 0 0 1 9.7 1.4A3.5 3.5 0 0 1 19 17H10z"/></svg>',
  // Cloud (3): gentle float
  cloud: '<svg class="wx-svg wx-cloud" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="wx-cloud-drift" d="M7 18a5 5 0 0 1 0.9 -9.9 6 6 0 0 1 11.5 1.8A4 4 0 0 1 18 18H7z"/></svg>',
  // Rain: floating cloud + falling drops
  rain: '<svg class="wx-svg wx-rain" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="wx-cloud-drift" d="M7 14a5 5 0 0 1 0.9 -9.9 6 6 0 0 1 11.5 1.8A4 4 0 0 1 18 14H7z"/><g class="wx-drops"><path class="wx-drop wx-drop-1" d="M9 16l-1 3"/><path class="wx-drop wx-drop-2" d="M13 16l-1 3"/><path class="wx-drop wx-drop-3" d="M17 16l-1 3"/></g></svg>',
  // Snow: drifting flakes
  snow: '<svg class="wx-svg wx-snow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="wx-cloud-drift" d="M7 12a5 5 0 0 1 0.9 -9.9 6 6 0 0 1 11.5 1.8A4 4 0 0 1 18 12H7z"/><g class="wx-flakes"><g class="wx-flake wx-flake-1"><path d="M8 15v4M6 17h4M6.6 15.6l2.8 2.8M6.6 18.4l2.8-2.8"/></g><g class="wx-flake wx-flake-2"><path d="M12 15v4M10 17h4M10.6 15.6l2.8 2.8M10.6 18.4l2.8-2.8"/></g><g class="wx-flake wx-flake-3"><path d="M16 15v4M14 17h4M14.6 15.6l2.8 2.8M14.6 18.4l2.8-2.8"/></g></g></svg>',
  // Storm: cloud shakes, lightning flashes
  storm: '<svg class="wx-svg wx-storm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="wx-storm-cloud" d="M7 13a5 5 0 0 1 0.9 -9.9 6 6 0 0 1 11.5 1.8A4 4 0 0 1 18 13H7z"/><path class="wx-bolt" d="M13 13l-3 5h3l-2 4" fill="currentColor" stroke-width="1.2"/></svg>',
  // Fog: bars drift L-R out of phase
  fog: '<svg class="wx-svg wx-fog" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="wx-fog-bar wx-fog-1" d="M6 6h12"/><path class="wx-fog-bar wx-fog-2" d="M4 10h16"/><path class="wx-fog-bar wx-fog-3" d="M3 14h18"/><path class="wx-fog-bar wx-fog-4" d="M5 18h14"/></svg>',
};

function weatherCodeToIcon(code) {
  if (code === 0 || code === 1) return WEATHER_ICONS.sun;
  if (code === 2) return WEATHER_ICONS.partly;
  if (code === 3) return WEATHER_ICONS.cloud;
  if (code === 45 || code === 48) return WEATHER_ICONS.fog;
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return WEATHER_ICONS.rain;
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return WEATHER_ICONS.snow;
  if (code >= 95) return WEATHER_ICONS.storm;
  return WEATHER_ICONS.cloud;
}

async function geocode(loc) {
  if (!loc) return null;
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(loc)}&count=1&language=de&format=json`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('geo');
  const data = await r.json();
  const hit = data?.results?.[0];
  if (!hit) return null;
  return { lat: hit.latitude, lon: hit.longitude, name: hit.name };
}

async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('wx');
  const data = await r.json();
  return data?.current;
}

async function refreshWeather() {
  const s = currentState.settings;
  const loc = (s.weatherLocation || '').trim();
  const enabled = s.showWeather !== false;
  if (!enabled || !loc) {
    frameWeather.classList.add('hidden');
    return;
  }
  try {
    const r = await fetch(`/api/weather?loc=${encodeURIComponent(loc)}`);
    if (!r.ok) {
      console.warn('[weather] HTTP', r.status);
      return;
    }
    const data = await r.json();
    if (!data || typeof data.temperature !== 'number') {
      console.warn('[weather] bad payload', data);
      return;
    }
    frameWeatherIcon.innerHTML = weatherCodeToIcon(data.code);
    frameWeatherTemp.textContent = `${Math.round(data.temperature)}°`;
    frameWeatherLoc.textContent = data.name || loc;
    frameWeather.classList.remove('hidden');
  } catch (err) {
    console.warn('[weather]', err?.message || err);
  }
}

function scheduleWeather() {
  if (!weatherTimer) {
    weatherTimer = window.setInterval(refreshWeather, 15 * 60 * 1000);
  }
  refreshWeather();
}

// ---------- local sensors (DHT22 + CCS811) ----------
const frameSensors = el('frameSensors');
const frameSensorTemp = el('frameSensorTemp');
const frameSensorHum = el('frameSensorHum');
const frameSensorAqiLabel = el('frameSensorAqiLabel');
let sensorsTimer = null;

function aqiState(eco2) {
  if (eco2 == null) return 'unknown';
  if (eco2 < 800) return 'fresh';
  if (eco2 < 1500) return 'stale';
  return 'toxic';
}

async function refreshSensors() {
  if (!frameSensors) return;
  try {
    const r = await fetch('/api/sensors', { cache: 'no-store' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    const hasAny = d.available && (d.temperature != null || d.humidity != null || d.eco2 != null);
    if (!hasAny) {
      frameSensors.classList.add('hidden');
      return;
    }
    frameSensors.classList.remove('hidden');
    frameSensors.classList.toggle('is-stale', !!d.stale);
    if (frameSensorTemp) frameSensorTemp.textContent = d.temperature != null ? `${d.temperature.toFixed(1)}°` : '--°';
    if (frameSensorHum) frameSensorHum.textContent = d.humidity != null ? `${Math.round(d.humidity)}%` : '--%';
    frameSensors.dataset.aqi = aqiState(d.eco2);
    // Prefer the German label from the Pi; fall back to a short one locally.
    const label = (d.aqi && d.aqi !== '—' && d.aqi !== '-')
      ? d.aqi
      : (d.eco2 == null ? '—' : (d.eco2 < 800 ? 'frisch' : d.eco2 < 1500 ? 'müffelig' : 'giftig'));
    if (frameSensorAqiLabel) frameSensorAqiLabel.textContent = label;
  } catch (err) {
    frameSensors.classList.add('hidden');
  }
}

function scheduleSensors() {
  if (!sensorsTimer) {
    sensorsTimer = window.setInterval(refreshSensors, 15 * 1000);
  }
  refreshSensors();
}
scheduleSensors();


window.addEventListener('beforeunload', () => {
  window.clearTimeout(slideshowTimer);
  window.clearInterval(clockTimer);
});
