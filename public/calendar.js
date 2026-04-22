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
  eventsBetween,
} = Core;

const DAY_HOUR_START = 0;
const DAY_HOUR_END = 24;
const HOUR_HEIGHT = 56; // px pro Stunde im Tag/Woche-Raster
const WEEKDAYS_SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const elements = {
  calendarTitle: document.getElementById('calendarTitle'),
  mainTabs: document.getElementById('mainTabs'),
  panels: {
    calendar: document.getElementById('calendarTab'),
    categories: document.getElementById('categoriesTab'),
    settings: document.getElementById('settingsTab'),
  },
  viewTabs: document.getElementById('calendarViewTabs'),
  prev: document.getElementById('calendarPrev'),
  next: document.getElementById('calendarNext'),
  today: document.getElementById('calendarToday'),
  openNewEvent: document.getElementById('openNewEvent'),
  openNewCategory: document.getElementById('openNewCategory'),
  viewContent: document.getElementById('calendarViewContent'),
  surface: document.getElementById('calendarSurface'),
  categoryList: document.getElementById('categoryList'),
  settingsForm: document.getElementById('calendarSettingsForm'),

  eventDialog: document.getElementById('eventDialog'),
  eventDialogTitle: document.getElementById('eventDialogTitle'),
  eventForm: document.getElementById('eventForm'),
  eventDeleteButton: document.getElementById('eventDeleteButton'),
  eventCategoryChips: document.getElementById('eventCategoryChips'),
  eventIconTrigger: document.getElementById('eventIconTrigger'),
  eventIconPreview: document.getElementById('eventIconPreview'),
  eventIconLabel: document.getElementById('eventIconLabel'),

  categoryDialog: document.getElementById('categoryDialog'),
  categoryDialogTitle: document.getElementById('categoryDialogTitle'),
  categoryForm: document.getElementById('categoryForm'),
  categoryDeleteButton: document.getElementById('categoryDeleteButton'),
  categoryIconTrigger: document.getElementById('categoryIconTrigger'),
  categoryIconPreview: document.getElementById('categoryIconPreview'),
  categoryIconLabel: document.getElementById('categoryIconLabel'),

  iconPickerDialog: document.getElementById('iconPickerDialog'),
  iconSearchInput: document.getElementById('iconSearchInput'),
  iconGrid: document.getElementById('iconGrid'),
};

let state = {
  calendar: {
    settings: { photoWidgetMax: 3, showPhotoWidget: true, swipeEnabled: true },
    categories: [],
    events: [],
  },
};

let viewState = {
  mode: 'day',
  anchor: startOfDay(new Date()),
  transitionDirection: 'next',
};

let iconPickerTarget = null; // 'event' | 'category'
let selectedEventCategoryId = null;

function requestJson(url, options = {}) {
  return fetch(url, options).then(async (response) => {
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || 'Anfrage fehlgeschlagen');
    }
    return payload;
  });
}

function toDatetimeInput(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (value) => `${value}`.padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function setMainTab(tab) {
  Object.entries(elements.panels).forEach(([key, panel]) => {
    panel.classList.toggle('is-active', key === tab);
  });
  elements.mainTabs.querySelectorAll('button[data-tab]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.tab === tab);
  });
}

function categoryLookup() {
  return new Map(state.calendar.categories.map((category) => [category.id, category]));
}

function hydrate(calendar) {
  state.calendar = calendar;
  if (elements.settingsForm.photoWidgetMax) {
    elements.settingsForm.photoWidgetMax.value = calendar.settings.photoWidgetMax;
    elements.settingsForm.showPhotoWidget.checked = Boolean(calendar.settings.showPhotoWidget);
    elements.settingsForm.swipeEnabled.checked = Boolean(calendar.settings.swipeEnabled);
  }
  renderCategories();
  renderCalendarView();
}

function renderCategories() {
  if (!state.calendar.categories.length) {
    elements.categoryList.innerHTML = '<p class="cal-helper">Noch keine Kategorien angelegt.</p>';
    return;
  }
  elements.categoryList.innerHTML = state.calendar.categories
    .map(
      (category) => `
        <button type="button" class="cal-category-card" data-category-id="${category.id}" style="--cat-color:${category.color}">
          <span class="cal-category-icon">${renderIconSvg(category.icon)}</span>
          <div>
            <strong>${escapeHtml(category.name)}</strong>
            <small>${escapeHtml(iconLabel(category.icon))}</small>
          </div>
        </button>
      `,
    )
    .join('');
}

function updateRangeTitle() {
  const { mode, anchor } = viewState;
  let start = anchor;
  let end = anchor;
  if (mode === 'week') {
    start = startOfWeek(anchor);
    end = endOfWeek(anchor);
  } else if (mode === 'month') {
    start = startOfMonth(anchor);
    end = endOfMonth(anchor);
  }
  elements.calendarTitle.textContent = formatRange(start, end, mode);
}

function shiftAnchor(direction) {
  viewState.transitionDirection = direction < 0 ? 'prev' : 'next';
  if (viewState.mode === 'month') {
    viewState.anchor = addMonths(viewState.anchor, direction);
  } else if (viewState.mode === 'week') {
    viewState.anchor = addDays(viewState.anchor, 7 * direction);
  } else {
    viewState.anchor = addDays(viewState.anchor, direction);
  }
  renderCalendarView();
}

function goToToday() {
  viewState.transitionDirection = 'next';
  viewState.anchor = startOfDay(new Date());
  renderCalendarView();
}

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

function dayViewMarkup() {
  const anchor = startOfDay(viewState.anchor);
  const dayEvents = eventsOnDay(state.calendar.events, anchor);
  const categoryMap = categoryLookup();
  const allDay = dayEvents.filter((event) => event.allDay);
  const timed = dayEvents.filter((event) => !event.allDay);

  return `
    <div class="cal-day-shell">
      ${
        allDay.length
          ? `<div class="cal-allday-row">
              <span class="cal-allday-label">Ganztägig</span>
              <div class="cal-allday-events">${allDay
                .map((event) => {
                  const category = categoryMap.get(event.categoryId);
                  return `<button type="button" class="cal-chip-event" data-event-id="${event.id}" style="--cat-color:${category?.color || '#f59e0b'}">${renderIconSvg(event.icon || category?.icon || 'sparkles')}<span>${escapeHtml(event.title)}</span></button>`;
                })
                .join('')}
              </div>
            </div>`
          : ''
      }
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

function weekViewMarkup() {
  const weekStart = startOfWeek(viewState.anchor);
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const categoryMap = categoryLookup();
  const todayKey = toLocalDateKey(new Date());

  const header = days
    .map((dayDate) => {
      const key = toLocalDateKey(dayDate);
      const isToday = key === todayKey;
      const weekday = new Intl.DateTimeFormat('de-DE', { weekday: 'short' }).format(dayDate);
      return `<div class="cal-week-head-cell ${isToday ? 'is-today' : ''}">
        <small>${escapeHtml(weekday)}</small>
        <strong>${dayDate.getDate()}</strong>
      </div>`;
    })
    .join('');

  const columns = days
    .map((dayDate) => {
      const dayEvents = eventsOnDay(state.calendar.events, dayDate).filter((event) => !event.allDay);
      return `
        <div class="cal-week-day-track" data-date="${toLocalDateKey(dayDate)}">
          ${Array.from({ length: DAY_HOUR_END - DAY_HOUR_START }, (_, i) => `<div class="cal-hour-slot" data-hour="${DAY_HOUR_START + i}"></div>`).join('')}
          ${nowLineMarkup(dayDate)}
          ${dayEvents.map((event) => eventBlockMarkup(event, categoryMap, 'week')).join('')}
        </div>
      `;
    })
    .join('');

  return `
    <div class="cal-week-shell" style="--hour-height:${HOUR_HEIGHT}px;">
      <div class="cal-week-head">
        <div></div>
        ${header}
      </div>
      <div class="cal-week-body">
        <div class="cal-hour-labels">${hourLabels()}</div>
        <div class="cal-week-grid">${columns}</div>
      </div>
    </div>
  `;
}

function monthViewMarkup() {
  const monthStart = startOfMonth(viewState.anchor);
  const monthKey = `${monthStart.getFullYear()}-${`${monthStart.getMonth() + 1}`.padStart(2, '0')}`;
  const gridStart = startOfWeek(monthStart);
  const categoryMap = categoryLookup();
  const todayKey = toLocalDateKey(new Date());

  const head = WEEKDAYS_SHORT.map((day) => `<span>${day}</span>`).join('');
  const cells = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
    .map((dayDate) => {
      const key = toLocalDateKey(dayDate);
      const dayEvents = eventsOnDay(state.calendar.events, dayDate).slice(0, 4);
      const isCurrent = key.startsWith(monthKey);
      const isToday = key === todayKey;

      return `
        <article class="cal-month-cell ${isCurrent ? '' : 'is-muted'} ${isToday ? 'is-today' : ''}" data-date="${key}">
          <header>
            <span class="cal-month-day-number">${dayDate.getDate()}</span>
          </header>
          <div class="cal-month-events">
            ${dayEvents
              .map((event) => {
                const category = categoryMap.get(event.categoryId);
                return `<button type="button" class="cal-month-event" data-event-id="${event.id}" style="--cat-color:${category?.color || '#f59e0b'}">${renderIconSvg(event.icon || category?.icon || 'sparkles')}<span>${escapeHtml(event.title)}</span></button>`;
              })
              .join('')}
          </div>
        </article>
      `;
    })
    .join('');

  return `
    <div class="cal-month-shell">
      <div class="cal-month-head">${head}</div>
      <div class="cal-month-grid">${cells}</div>
    </div>
  `;
}

function renderCalendarView() {
  elements.viewTabs.querySelectorAll('button[data-view]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.view === viewState.mode);
  });
  updateRangeTitle();

  const markup =
    viewState.mode === 'month'
      ? monthViewMarkup()
      : viewState.mode === 'week'
      ? weekViewMarkup()
      : dayViewMarkup();

  const direction = viewState.transitionDirection === 'prev' ? 'from-left' : 'from-right';
  elements.viewContent.classList.remove('from-left', 'from-right');
  elements.viewContent.innerHTML = markup;
  // Force reflow to restart animation
  void elements.viewContent.offsetWidth;
  elements.viewContent.classList.add(direction);

  // Scroll on first render to current hour on day/week
  if (viewState.mode !== 'month') {
    const scroll = elements.surface;
    const minutesNow = new Date().getHours() * 60 + new Date().getMinutes();
    const target = Math.max(0, ((minutesNow / 60) - 1.5) * HOUR_HEIGHT);
    requestAnimationFrame(() => {
      scroll.scrollTop = target;
    });
  }
}

// ---------- Icon Picker ----------

function openIconPicker(target) {
  iconPickerTarget = target;
  elements.iconSearchInput.value = '';
  renderIconGrid('');
  elements.iconPickerDialog.showModal();
  requestAnimationFrame(() => elements.iconSearchInput.focus());
}

function renderIconGrid(query) {
  const icons = searchIcons(query);
  if (!icons.length) {
    elements.iconGrid.innerHTML = '<p class="cal-helper">Keine Symbole gefunden.</p>';
    return;
  }
  elements.iconGrid.innerHTML = icons
    .map((icon) => `
      <button type="button" class="cal-icon-tile" data-icon="${icon.key}" title="${escapeHtml(icon.label)}" aria-label="${escapeHtml(icon.label)}">
        ${renderIconSvg(icon.key, 'ff-icon cal-icon-tile-svg')}
      </button>
    `)
    .join('');
}

function setIconSelection(iconKey, category = null) {
  if (iconPickerTarget === 'event') {
    elements.eventForm.icon.value = iconKey;
    elements.eventIconPreview.innerHTML = renderIconSvg(iconKey);
    elements.eventIconLabel.textContent = iconLabel(iconKey);
  } else if (iconPickerTarget === 'category') {
    elements.categoryForm.icon.value = iconKey;
    elements.categoryIconPreview.innerHTML = renderIconSvg(iconKey);
    elements.categoryIconLabel.textContent = iconLabel(iconKey);
  }
}

// ---------- Event Dialog ----------

function renderCategoryChips(selectedId) {
  selectedEventCategoryId = selectedId;
  elements.eventCategoryChips.innerHTML = state.calendar.categories
    .map(
      (category) => `
        <button type="button" class="cal-category-chip ${category.id === selectedId ? 'is-active' : ''}" data-category-id="${category.id}" style="--cat-color:${category.color}">
          <span>${renderIconSvg(category.icon)}</span>
          ${escapeHtml(category.name)}
        </button>
      `,
    )
    .join('');
}

function openEventDialog({ eventId = '', defaultDate = null } = {}) {
  const form = elements.eventForm;
  form.reset();
  form.eventId.value = '';
  elements.eventDeleteButton.classList.add('hidden');

  if (eventId) {
    const event = state.calendar.events.find((entry) => entry.id === eventId);
    if (!event) return;
    elements.eventDialogTitle.textContent = 'Termin bearbeiten';
    form.eventId.value = event.id;
    form.title.value = event.title;
    form.notes.value = event.notes || '';
    form.startAt.value = toDatetimeInput(event.startAt);
    form.endAt.value = toDatetimeInput(event.endAt);
    form.allDay.checked = Boolean(event.allDay);
    const iconKey = event.icon || state.calendar.categories.find((c) => c.id === event.categoryId)?.icon || 'sparkles';
    form.icon.value = iconKey;
    elements.eventIconPreview.innerHTML = renderIconSvg(iconKey);
    elements.eventIconLabel.textContent = iconLabel(iconKey);
    renderCategoryChips(event.categoryId);
    elements.eventDeleteButton.classList.remove('hidden');
  } else {
    elements.eventDialogTitle.textContent = 'Neuer Termin';
    const base = defaultDate ? new Date(defaultDate) : new Date();
    const start = new Date(base);
    if (!defaultDate) {
      start.setMinutes(0, 0, 0);
      start.setHours(start.getHours() + 1);
    }
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    form.startAt.value = toDatetimeInput(start.toISOString());
    form.endAt.value = toDatetimeInput(end.toISOString());
    const firstCategory = state.calendar.categories[0];
    if (firstCategory) {
      const iconKey = firstCategory.icon;
      form.icon.value = iconKey;
      elements.eventIconPreview.innerHTML = renderIconSvg(iconKey);
      elements.eventIconLabel.textContent = iconLabel(iconKey);
      renderCategoryChips(firstCategory.id);
    }
  }

  elements.eventDialog.showModal();
}

async function submitEventForm(event) {
  event.preventDefault();
  const form = elements.eventForm;
  const payload = {
    title: form.title.value,
    notes: form.notes.value,
    categoryId: selectedEventCategoryId,
    startAt: new Date(form.startAt.value).toISOString(),
    endAt: new Date(form.endAt.value).toISOString(),
    allDay: form.allDay.checked,
    icon: form.icon.value,
  };

  const eventId = form.eventId.value;
  const url = eventId ? `/api/calendar/events/${eventId}` : '/api/calendar/events';
  await requestJson(url, {
    method: eventId ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const next = await requestJson('/api/calendar');
  hydrate(next);
  elements.eventDialog.close();
}

async function deleteEvent() {
  const eventId = elements.eventForm.eventId.value;
  if (!eventId) return;
  if (!window.confirm('Diesen Termin wirklich löschen?')) return;
  await fetch(`/api/calendar/events/${eventId}`, { method: 'DELETE' });
  const next = await requestJson('/api/calendar');
  hydrate(next);
  elements.eventDialog.close();
}

// ---------- Category Dialog ----------

function openCategoryDialog({ categoryId = '' } = {}) {
  const form = elements.categoryForm;
  form.reset();
  form.categoryId.value = '';
  elements.categoryDeleteButton.classList.add('hidden');

  if (categoryId) {
    const category = state.calendar.categories.find((entry) => entry.id === categoryId);
    if (!category) return;
    elements.categoryDialogTitle.textContent = 'Kategorie bearbeiten';
    form.categoryId.value = category.id;
    form.name.value = category.name;
    form.color.value = category.color;
    form.icon.value = category.icon;
    elements.categoryIconPreview.innerHTML = renderIconSvg(category.icon);
    elements.categoryIconLabel.textContent = iconLabel(category.icon);
    if (state.calendar.categories.length > 1) {
      elements.categoryDeleteButton.classList.remove('hidden');
    }
  } else {
    elements.categoryDialogTitle.textContent = 'Neue Kategorie';
    form.color.value = '#f59e0b';
    form.icon.value = 'sparkles';
    elements.categoryIconPreview.innerHTML = renderIconSvg('sparkles');
    elements.categoryIconLabel.textContent = iconLabel('sparkles');
  }

  elements.categoryDialog.showModal();
}

async function submitCategoryForm(event) {
  event.preventDefault();
  const form = elements.categoryForm;
  const payload = {
    name: form.name.value,
    color: form.color.value,
    icon: form.icon.value,
  };
  const categoryId = form.categoryId.value;
  const url = categoryId ? `/api/calendar/categories/${categoryId}` : '/api/calendar/categories';
  await requestJson(url, {
    method: categoryId ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const next = await requestJson('/api/calendar');
  hydrate(next);
  elements.categoryDialog.close();
}

async function deleteCategory() {
  const categoryId = elements.categoryForm.categoryId.value;
  if (!categoryId) return;
  if (!window.confirm('Kategorie löschen? Termine werden einer anderen Kategorie zugeordnet.')) return;
  await fetch(`/api/calendar/categories/${categoryId}`, { method: 'DELETE' });
  const next = await requestJson('/api/calendar');
  hydrate(next);
  elements.categoryDialog.close();
}

// ---------- Events wiring ----------

elements.mainTabs.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-tab]');
  if (!button) return;
  setMainTab(button.dataset.tab);
});

elements.viewTabs.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-view]');
  if (!button || button.dataset.view === viewState.mode) return;
  viewState.transitionDirection = 'next';
  viewState.mode = button.dataset.view;
  renderCalendarView();
});

elements.prev.addEventListener('click', () => shiftAnchor(-1));
elements.next.addEventListener('click', () => shiftAnchor(1));
elements.today.addEventListener('click', goToToday);
elements.openNewEvent.addEventListener('click', () => openEventDialog());
elements.openNewCategory.addEventListener('click', () => openCategoryDialog());

elements.viewContent.addEventListener('click', (event) => {
  const eventButton = event.target.closest('[data-event-id]');
  if (eventButton) {
    openEventDialog({ eventId: eventButton.dataset.eventId });
    return;
  }
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
    viewState.mode = 'day';
    viewState.transitionDirection = 'next';
    viewState.anchor = startOfDay(new Date(`${monthCell.dataset.date}T00:00:00`));
    renderCalendarView();
  }
});

elements.categoryList.addEventListener('click', (event) => {
  const card = event.target.closest('[data-category-id]');
  if (!card) return;
  openCategoryDialog({ categoryId: card.dataset.categoryId });
});

elements.eventForm.addEventListener('submit', submitEventForm);
elements.eventDeleteButton.addEventListener('click', deleteEvent);
elements.eventCategoryChips.addEventListener('click', (event) => {
  const chip = event.target.closest('[data-category-id]');
  if (!chip) return;
  renderCategoryChips(chip.dataset.categoryId);
});

elements.categoryForm.addEventListener('submit', submitCategoryForm);
elements.categoryDeleteButton.addEventListener('click', deleteCategory);

elements.eventIconTrigger.addEventListener('click', () => openIconPicker('event'));
elements.categoryIconTrigger.addEventListener('click', () => openIconPicker('category'));

elements.iconSearchInput.addEventListener('input', (event) => renderIconGrid(event.target.value));
elements.iconGrid.addEventListener('click', (event) => {
  const tile = event.target.closest('[data-icon]');
  if (!tile) return;
  setIconSelection(tile.dataset.icon);
  elements.iconPickerDialog.close();
});

document.querySelectorAll('dialog [data-close]').forEach((button) => {
  button.addEventListener('click', (event) => {
    const dialog = event.currentTarget.closest('dialog');
    if (dialog) dialog.close();
  });
});

elements.settingsForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = elements.settingsForm;
  await requestJson('/api/calendar/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      photoWidgetMax: Number(form.photoWidgetMax.value),
      showPhotoWidget: form.showPhotoWidget.checked,
      swipeEnabled: form.swipeEnabled.checked,
      weekStartsOnMonday: true,
    }),
  });
  const next = await requestJson('/api/calendar');
  hydrate(next);
});

// Swipe-Navigation auf dem Kalender-Surface
let swipeStart = null;
elements.surface.addEventListener('touchstart', (event) => {
  swipeStart = event.touches[0];
}, { passive: true });
elements.surface.addEventListener('touchend', (event) => {
  if (!swipeStart) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - swipeStart.clientX;
  const dy = touch.clientY - swipeStart.clientY;
  swipeStart = null;
  if (Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
  shiftAnchor(dx < 0 ? 1 : -1);
}, { passive: true });

// Keyboard-Shortcuts
document.addEventListener('keydown', (event) => {
  if (event.target.matches('input, textarea, select')) return;
  if (event.key === 'ArrowLeft') shiftAnchor(-1);
  else if (event.key === 'ArrowRight') shiftAnchor(1);
  else if (event.key.toLowerCase() === 't') goToToday();
  else if (event.key.toLowerCase() === 'n') openEventDialog();
});

socket.on('state:update', (nextState) => {
  if (nextState.calendar) hydrate(nextState.calendar);
});

requestJson('/api/state').then((nextState) => {
  state = nextState;
  hydrate(nextState.calendar);
});
