(() => {
  // Icon-Katalog mit deutschen Labels und Suchbegriffen.
  const ICONS = [
    { key: 'sparkles', label: 'Highlight', keywords: ['highlight', 'stern', 'funkeln', 'besonders'] },
    { key: 'heart', label: 'Liebe', keywords: ['liebe', 'herz', 'date', 'romantik', 'partner'] },
    { key: 'star', label: 'Favorit', keywords: ['stern', 'favorit', 'wichtig', 'merken'] },
    { key: 'bell', label: 'Erinnerung', keywords: ['erinnerung', 'glocke', 'wecker', 'alarm', 'reminder'] },
    { key: 'clock', label: 'Uhrzeit', keywords: ['uhr', 'zeit', 'timer', 'stunde'] },
    { key: 'alarm', label: 'Wecker', keywords: ['wecker', 'alarm', 'aufstehen'] },
    { key: 'calendar', label: 'Termin', keywords: ['termin', 'kalender', 'datum', 'tag'] },
    { key: 'note', label: 'Notiz', keywords: ['notiz', 'zettel', 'memo', 'info'] },
    { key: 'checklist', label: 'Aufgabe', keywords: ['aufgabe', 'todo', 'liste', 'checklist', 'haken'] },
    { key: 'idea', label: 'Idee', keywords: ['idee', 'gluehbirne', 'kreativ', 'einfall'] },

    { key: 'stethoscope', label: 'Arzt', keywords: ['arzt', 'doktor', 'praxis', 'stethoskop', 'gesundheit', 'untersuchung'] },
    { key: 'doctor', label: 'Arzttermin', keywords: ['arzt', 'termin', 'medizin', 'klinik'] },
    { key: 'hospital', label: 'Krankenhaus', keywords: ['krankenhaus', 'klinik', 'notaufnahme'] },
    { key: 'pill', label: 'Medikament', keywords: ['medikament', 'tablette', 'pille', 'apotheke'] },
    { key: 'tooth', label: 'Zahnarzt', keywords: ['zahnarzt', 'zahn', 'kieferorthopaede'] },
    { key: 'dentist', label: 'Kieferarzt', keywords: ['kiefer', 'orthopaede', 'zahnspange'] },
    { key: 'fitness', label: 'Fitness', keywords: ['fitness', 'training', 'studio', 'gym'] },
    { key: 'dumbbell', label: 'Workout', keywords: ['workout', 'kraft', 'training', 'hantel'] },
    { key: 'run', label: 'Laufen', keywords: ['laufen', 'joggen', 'running', 'sport'] },
    { key: 'yoga', label: 'Yoga', keywords: ['yoga', 'meditation', 'entspannung', 'achtsamkeit'] },
    { key: 'meditation', label: 'Meditation', keywords: ['meditation', 'ruhe', 'achtsamkeit', 'mindful'] },
    { key: 'swim', label: 'Schwimmen', keywords: ['schwimmen', 'bad', 'pool', 'welle'] },
    { key: 'bicycle', label: 'Radfahren', keywords: ['rad', 'fahrrad', 'bike', 'radtour'] },
    { key: 'walk', label: 'Spaziergang', keywords: ['spaziergang', 'gehen', 'laufen', 'wandern'] },

    { key: 'shopping-bag', label: 'Shopping', keywords: ['shopping', 'einkaufen', 'bummeln', 'tasche'] },
    { key: 'shopping-cart', label: 'Einkaufswagen', keywords: ['wagen', 'einkaufen', 'markt', 'grocery'] },
    { key: 'basket', label: 'Lebensmittel', keywords: ['lebensmittel', 'einkauf', 'korb', 'supermarkt'] },
    { key: 'market', label: 'Markt', keywords: ['markt', 'wochenmarkt', 'laden'] },
    { key: 'wallet', label: 'Finanzen', keywords: ['finanzen', 'geld', 'wallet', 'portemonnaie'] },
    { key: 'bank', label: 'Bank', keywords: ['bank', 'finanzamt', 'termin'] },
    { key: 'gift', label: 'Geschenk', keywords: ['geschenk', 'praesent', 'ueberraschung'] },

    { key: 'briefcase', label: 'Arbeit', keywords: ['arbeit', 'job', 'buero', 'aktenkoffer'] },
    { key: 'meeting', label: 'Meeting', keywords: ['meeting', 'besprechung', 'konferenz'] },
    { key: 'document', label: 'Dokument', keywords: ['dokument', 'papier', 'unterlagen'] },

    { key: 'home', label: 'Zuhause', keywords: ['zuhause', 'haus', 'daheim', 'wohnung'] },
    { key: 'clean', label: 'Haushalt', keywords: ['haushalt', 'putzen', 'sauber'] },
    { key: 'laundry', label: 'Waesche', keywords: ['waesche', 'waschen', 'waschmaschine'] },
    { key: 'garden', label: 'Garten', keywords: ['garten', 'pflanzen', 'gaertnern'] },
    { key: 'cook', label: 'Kochen', keywords: ['kochen', 'essen', 'kueche'] },

    { key: 'school', label: 'Schule', keywords: ['schule', 'unterricht', 'klasse'] },
    { key: 'book', label: 'Lesen', keywords: ['lesen', 'buch', 'roman'] },
    { key: 'graduation', label: 'Abschluss', keywords: ['abschluss', 'pruefung', 'diplom', 'uni'] },
    { key: 'study', label: 'Lernen', keywords: ['lernen', 'studium', 'schule'] },
    { key: 'exam', label: 'Pruefung', keywords: ['pruefung', 'klausur', 'exam', 'test'] },
    { key: 'reading', label: 'Lesezeit', keywords: ['lesen', 'lesezeit', 'buch'] },
    { key: 'coding', label: 'Coding', keywords: ['coding', 'programmieren', 'laptop'] },
    { key: 'gaming', label: 'Gaming', keywords: ['gaming', 'spielen', 'zocken', 'konsole'] },

    { key: 'camera', label: 'Foto', keywords: ['foto', 'kamera', 'bild', 'shoot'] },
    { key: 'music', label: 'Musik', keywords: ['musik', 'song', 'konzert'] },
    { key: 'concert', label: 'Konzert', keywords: ['konzert', 'live', 'band', 'festival'] },
    { key: 'festival', label: 'Festival', keywords: ['festival', 'sommerfest', 'veranstaltung'] },
    { key: 'movie', label: 'Kino', keywords: ['kino', 'film', 'movie'] },
    { key: 'tv', label: 'Fernsehen', keywords: ['tv', 'fernsehen', 'serie'] },
    { key: 'theater', label: 'Theater', keywords: ['theater', 'oper', 'buehne'] },
    { key: 'museum', label: 'Museum', keywords: ['museum', 'ausstellung', 'kunst'] },
    { key: 'art', label: 'Kunst', keywords: ['kunst', 'malen', 'galerie'] },
    { key: 'paint', label: 'Malen', keywords: ['malen', 'farbe', 'pinsel'] },
    { key: 'palette', label: 'Palette', keywords: ['palette', 'farben', 'kreativ'] },
    { key: 'dance', label: 'Tanzen', keywords: ['tanzen', 'dance', 'party'] },
    { key: 'party', label: 'Party', keywords: ['party', 'feier', 'fest'] },
    { key: 'celebrate', label: 'Feier', keywords: ['feier', 'celebrate', 'fest', 'geburtstag'] },
    { key: 'birthday', label: 'Geburtstag', keywords: ['geburtstag', 'torte', 'feier'] },
    { key: 'cake', label: 'Torte', keywords: ['torte', 'kuchen', 'geburtstag'] },
    { key: 'pizza', label: 'Pizza', keywords: ['pizza', 'essen', 'italiener'] },
    { key: 'coffee', label: 'Kaffee', keywords: ['kaffee', 'cafe', 'treffen'] },
    { key: 'breakfast', label: 'Fruehstueck', keywords: ['fruehstueck', 'morgen', 'essen'] },
    { key: 'lunch', label: 'Mittagessen', keywords: ['mittag', 'mittagessen', 'pause'] },
    { key: 'dinner', label: 'Abendessen', keywords: ['abendessen', 'dinner', 'ausgehen'] },
    { key: 'snack', label: 'Snack', keywords: ['snack', 'zwischenmahlzeit'] },
    { key: 'water', label: 'Wasser', keywords: ['wasser', 'trinken', 'flasche'] },

    { key: 'car', label: 'Auto', keywords: ['auto', 'fahren', 'wagen'] },
    { key: 'bus', label: 'Bus', keywords: ['bus', 'oeffentlich', 'verkehr'] },
    { key: 'train', label: 'Zug', keywords: ['zug', 'bahn', 'ice', 'db'] },
    { key: 'airplane', label: 'Flug', keywords: ['flug', 'reise', 'flughafen', 'airline'] },
    { key: 'palm', label: 'Urlaub', keywords: ['urlaub', 'ferien', 'strand', 'palme'] },
    { key: 'beach', label: 'Strand', keywords: ['strand', 'meer', 'urlaub'] },
    { key: 'travel', label: 'Reise', keywords: ['reise', 'urlaub', 'trip'] },
    { key: 'holiday', label: 'Ferien', keywords: ['ferien', 'urlaub', 'free'] },

    { key: 'sun', label: 'Sonnig', keywords: ['sonne', 'sonnig', 'wetter'] },
    { key: 'moon', label: 'Nacht', keywords: ['nacht', 'mond', 'schlafen'] },
    { key: 'rain', label: 'Regen', keywords: ['regen', 'wetter', 'schauer'] },
    { key: 'snow', label: 'Schnee', keywords: ['schnee', 'winter', 'kalt'] },
    { key: 'storm', label: 'Sturm', keywords: ['sturm', 'gewitter', 'blitz'] },
    { key: 'leaf', label: 'Natur', keywords: ['natur', 'blatt', 'wald'] },
    { key: 'tree', label: 'Wald', keywords: ['wald', 'baum', 'natur'] },
    { key: 'flower', label: 'Blume', keywords: ['blume', 'garten', 'fruehling'] },
    { key: 'park', label: 'Park', keywords: ['park', 'natur', 'spaziergang'] },
    { key: 'playground', label: 'Spielplatz', keywords: ['spielplatz', 'kinder', 'park'] },

    { key: 'dog', label: 'Hund', keywords: ['hund', 'dog', 'gassi', 'tier'] },
    { key: 'cat', label: 'Katze', keywords: ['katze', 'cat', 'tier'] },
    { key: 'pets', label: 'Haustier', keywords: ['haustier', 'tier', 'pets'] },

    { key: 'friends', label: 'Freunde', keywords: ['freunde', 'friends', 'treffen'] },
    { key: 'family', label: 'Familie', keywords: ['familie', 'eltern', 'geschwister'] },
    { key: 'date', label: 'Date', keywords: ['date', 'verabredung', 'romantik'] },
    { key: 'phone', label: 'Telefonat', keywords: ['telefon', 'anruf', 'call'] },

    { key: 'beauty', label: 'Beauty', keywords: ['beauty', 'kosmetik', 'pflege'] },
    { key: 'nails', label: 'Naegel', keywords: ['naegel', 'maniküre', 'nagelstudio'] },
    { key: 'hair', label: 'Friseur', keywords: ['friseur', 'hair', 'haare', 'frisoer'] },
    { key: 'spa', label: 'Spa', keywords: ['spa', 'wellness', 'sauna'] },
    { key: 'selfcare', label: 'Selfcare', keywords: ['selfcare', 'pflege', 'me-time'] },
    { key: 'mindfulness', label: 'Achtsamkeit', keywords: ['achtsamkeit', 'ruhe', 'selfcare'] },
    { key: 'focus', label: 'Fokus', keywords: ['fokus', 'konzentration', 'deep-work'] },
    { key: 'relax', label: 'Entspannen', keywords: ['entspannen', 'chillen', 'ruhe'] },
    { key: 'sleep', label: 'Schlaf', keywords: ['schlafen', 'bett', 'nacht'] },

    { key: 'library', label: 'Bibliothek', keywords: ['bibliothek', 'buecherei', 'lesen'] },
    { key: 'clinic', label: 'Klinik', keywords: ['klinik', 'aerzte', 'termin'] },
    { key: 'volunteer', label: 'Ehrenamt', keywords: ['ehrenamt', 'volunteer', 'helfen'] },
    { key: 'charity', label: 'Spende', keywords: ['spende', 'charity', 'gutes-tun'] },
  ];

  const ICON_MAP = new Map(ICONS.map((icon) => [icon.key, icon]));

  const ICON_SVG = {
    sparkles: '<path d="M12 2.5l1.9 5.2a3 3 0 0 0 1.9 1.9l5.2 1.9-5.2 1.9a3 3 0 0 0-1.9 1.9L12 18.5l-1.9-5.2a3 3 0 0 0-1.9-1.9L3 9.5l5.2-1.9a3 3 0 0 0 1.9-1.9L12 2.5z" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" fill="currentColor"/><path d="M4.5 18l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3L2.7 19.8l1.3-.5z" fill="currentColor"/>',
    heart: '<path d="M12 20.5s-7.5-4.6-7.5-10.5a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 5.9-7.5 10.5-7.5 10.5h-1z" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 10.5a2.2 2.2 0 0 1 2-2" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.3" stroke-linecap="round"/>',
    star: '<path d="M12 3.2l2.7 5.6 6.1 0.9-4.4 4.3 1.05 6.1L12 17.2l-5.45 2.9 1.05-6.1L3.2 9.7l6.1-0.9L12 3.2z" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
    bell: '<path d="M8 17h8l-1-2v-4a3 3 0 1 0-6 0v4l-1 2z"/><path d="M10 19a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    clock: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v5l3 2" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    alarm: '<circle cx="12" cy="13" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 9v4l3 2M5 6l2-2M19 6l-2-2" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 3v4M16 3v4M4 10h16" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    note: '<path d="M6 4h10l4 4v12H6z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 4v4h4" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    checklist: '<path d="M9 7h10M9 12h10M9 17h10" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 7l1.2 1.2L7 6.3M4 12l1.2 1.2L7 11.3M4 17l1.2 1.2L7 16.3" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    idea: '<path d="M12 3a6 6 0 0 1 4 10.5c-.7.7-1 1.5-1 2.5h-6c0-1-.3-1.8-1-2.5A6 6 0 0 1 12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 17h6M10 20h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 7v5M10 10l2 2 2-2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',

    stethoscope: '<path d="M7 4v5a4 4 0 0 0 8 0V4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M11 13a5 5 0 0 0 10 0" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="21" cy="12" r="1.7" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    doctor: '<circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 20c0-4 3-6 7-6s7 2 7 6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 14v5M10 17h4" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    hospital: '<path d="M5 20V7h14v13" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 9v7M9 12h6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    pill: '<rect x="5" y="9" width="14" height="6" rx="3" transform="rotate(-30 12 12)" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 8l6 4" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    tooth: '<path d="M8 4c2 0 2 2 4 2s2-2 4-2c2 0 3 2 3 5 0 4-2 5-2 9 0 1-1 2-2 2s-1-4-3-4-2 4-3 4-2-1-2-2c0-4-2-5-2-9 0-3 1-5 3-5z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    dentist: '<path d="M8 4c2 0 2 2 4 2s2-2 4-2c2 0 3 2 3 5 0 4-2 5-2 9 0 1-1 2-2 2s-1-4-3-4-2 4-3 4-2-1-2-2c0-4-2-5-2-9 0-3 1-5 3-5z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 10l4 0" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    fitness: '<path d="M6 9v6M10 7v10M14 7v10M18 9v6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 11v2M20 11v2" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    dumbbell: '<rect x="8" y="10" width="8" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="4" y="9" width="2" height="6" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="18" y="9" width="2" height="6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    run: '<circle cx="14" cy="5" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 10l4-2 3 1-2 3 2 3M8 14l3-1M12 14l-1 6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    yoga: '<circle cx="12" cy="5" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5M8 16h8M6 12h12" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    meditation: '<circle cx="12" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 18c1-3 3-4 5-4s4 1 5 4M5 19h14" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    swim: '<path d="M4 16c2-2 4-2 6 0s4 2 6 0 4-2 4 0M4 19c2-2 4-2 6 0s4 2 6 0 4-2 4 0" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="10" cy="8" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M11 9l5 3" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    bicycle: '<circle cx="6" cy="16" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="16" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 16l4-8h5l3 8M10 8h-2" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    walk: '<circle cx="13" cy="5" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 20l2-6-3-2 2-4 4 1 2 4M12 14l-2 6" fill="none" stroke="currentColor" stroke-width="1.8"/>',

    'shopping-bag': '<path d="M6 8h12l-1 12H7L6 8z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 8a3 3 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    'shopping-cart': '<path d="M4 5h2l2 11h10l2-8H8" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="10" cy="19" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="19" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    basket: '<path d="M4 9h16l-2 10H6L4 9z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 9l4-5 4 5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    market: '<path d="M4 10h16l-1-4H5L4 10zM5 10v10h14V10" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    wallet: '<rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="12" r="1.5"/>',
    bank: '<path d="M4 10l8-5 8 5M5 10v8h14v-8M7 11v6M11 11v6M15 11v6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    gift: '<rect x="4" y="10" width="16" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 7h18v3H3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 7v13M9 7c-2.2 0-2.8-3.5-0.5-3.5 1.4 0 2.4 1.5 3.5 3.5 1.1-2 2.1-3.5 3.5-3.5 2.3 0 1.7 3.5-0.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',

    briefcase: '<rect x="4" y="8" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 8V6h6v2M4 13h16" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    meeting: '<circle cx="8" cy="9" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="9" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 18c0-3 2-5 4-5M20 18c0-3-2-5-4-5M10 18c0-2 1-3 2-3s2 1 2 3" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    document: '<path d="M6 4h9l4 4v12H6z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15 4v4h4M9 13h6M9 16h6" fill="none" stroke="currentColor" stroke-width="1.8"/>',

    home: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    clean: '<path d="M6 20l3-12 6-2 3 12z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 8l6-2" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    laundry: '<rect x="5" y="4" width="14" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="13" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="8" cy="7" r="0.8"/>',
    garden: '<path d="M12 20V10M8 14c0-3 2-5 4-5s4 2 4 5M6 10c2-1 4-1 6 0M12 10c2-1 4-1 6 0" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    cook: '<path d="M5 10a7 4 0 0 1 14 0v1H5v-1zM6 11v7h12v-7" fill="none" stroke="currentColor" stroke-width="1.8"/>',

    school: '<path d="M4 9l8-4 8 4-8 4zM6 11v4c0 2 3 3 6 3s6-1 6-3v-4" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    book: '<path d="M5 5h7a3 3 0 0 1 3 3v11H8a3 3 0 0 0-3 3V5z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15 8h4v14h-4" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    graduation: '<path d="M2 10l10-5 10 5-10 5z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 12v4c0 2 3 3 6 3s6-1 6-3v-4M20 10v5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    study: '<path d="M4 6h13v13H4z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 10h7M7 13h7M7 16h5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    exam: '<path d="M6 4h10l3 3v13H6z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    reading: '<path d="M4 7l8 2 8-2v11l-8 2-8-2z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 9v11" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    coding: '<rect x="3" y="5" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 10l-2 2 2 2M16 10l2 2-2 2M13 9l-2 6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    gaming: '<rect x="3" y="8" width="18" height="10" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 13h-2M7 12v2M15 12h2M17 14h-2" fill="none" stroke="currentColor" stroke-width="1.8"/>',

    camera: '<rect x="4" y="7" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="13" r="3.4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 7l1.5-2h5L16 7" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    music: '<path d="M10 17.5a2.3 2.3 0 1 1-4.6 0 2.3 2.3 0 0 1 4.6 0zM19.2 15a2.3 2.3 0 1 1-4.6 0 2.3 2.3 0 0 1 4.6 0z" fill="currentColor"/><path d="M10 17.5V5.5l9.2-2.5V15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 8.5l9.2-2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    concert: '<path d="M6 20v-4l6-8 6 8v4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 20v-5M14 20v-5M4 14l2-1M20 14l-2-1" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    festival: '<path d="M4 20l8-14 8 14M6 20l6-10 6 10" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    movie: '<rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18M3 14h18M8 6v12M16 6v12" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    tv: '<rect x="3" y="5" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 20h6M12 17v3" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    theater: '<path d="M4 6v7c0 3 4 5 8 5s8-2 8-5V6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/><path d="M9 14s1 2 3 2 3-2 3-2" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    museum: '<path d="M3 10l9-5 9 5M5 10v8h14v-8M8 12v4M12 12v4M16 12v4M3 20h18" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    art: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="8" cy="10" r="1.2"/><circle cx="16" cy="10" r="1.2"/><circle cx="10" cy="15" r="1.2"/><circle cx="15" cy="14" r="1.2"/>',
    paint: '<path d="M4 16l10-10 4 4L8 20z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M14 6l4 4" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    palette: '<path d="M12 4a8 8 0 1 0 0 16c-1 0-1-2 0-3s3-1 4-2 0-3-2-3 1-3 0-4-1-4-2-4z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="10" r="1"/><circle cx="13" cy="8" r="1"/><circle cx="16" cy="12" r="1"/>',
    dance: '<circle cx="12" cy="5" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7l-3 6 4-1 3 5M12 13v7" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    party: '<path d="M4 20l6-14 3 2-9 12z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="7" r="1"/><circle cx="20" cy="12" r="1"/><circle cx="14" cy="5" r="1"/>',
    celebrate: '<path d="M6 20l6-12 3 3-9 9z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M18 6l1-3M21 9l3-1M17 11l3 0" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    birthday: '<path d="M4 13.5c2-1.2 4-1.2 8 0s6 1.2 8 0V20H4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><rect x="5" y="10" width="14" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 10V7M12 10V5.5M16 10V7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 7c-0.6-0.7-0.6-1.5 0-2 0.6 0.5 0.6 1.3 0 2zM12 5.5c-0.8-1-0.8-2 0-2.8 0.8 0.8 0.8 1.8 0 2.8zM16 7c-0.6-0.7-0.6-1.5 0-2 0.6 0.5 0.6 1.3 0 2z" fill="currentColor"/>',
    cake: '<path d="M4 13.5c2-1.2 4-1.2 8 0s6 1.2 8 0V20H4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><rect x="5" y="10" width="14" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 10V7M12 10V6M16 10V7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 7c-0.6-0.7-0.6-1.5 0-2 0.6 0.5 0.6 1.3 0 2zM12 6c-0.8-1-0.8-2 0-2.6 0.8 0.6 0.8 1.6 0 2.6zM16 7c-0.6-0.7-0.6-1.5 0-2 0.6 0.5 0.6 1.3 0 2z" fill="currentColor"/>',
    pizza: '<path d="M12 3.5L20.5 20c-5.5 2-11.5 2-17 0z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M5.8 17c4 1.3 8.4 1.3 12.4 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="10" cy="11" r="1.1" fill="currentColor"/><circle cx="14" cy="13" r="1.1" fill="currentColor"/><circle cx="11.5" cy="15.5" r="1" fill="currentColor"/>',
    coffee: '<path d="M4 10h12v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 12h2.5a2.5 2.5 0 0 1 0 5H16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 6c0.5-1 -0.5-1.5 0-2.5M10 6c0.5-1 -0.5-1.5 0-2.5M13 6c0.5-1 -0.5-1.5 0-2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    breakfast: '<path d="M4 10h12v3a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-3z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 11h3a2 2 0 0 1 0 4h-3M18 6l-2 4M14 6l-1 4" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    lunch: '<circle cx="12" cy="13" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="13" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    dinner: '<path d="M6 20V10M6 10s0-4 3-4M18 20v-6M16 4v5a2 2 0 0 0 4 0V4" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    snack: '<path d="M5 11l14-3-1 11H6z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    water: '<path d="M12 3c3 5 6 8 6 12a6 6 0 1 1-12 0c0-4 3-7 6-12z" fill="none" stroke="currentColor" stroke-width="1.8"/>',

    car: '<path d="M4 15h16l-2-5a3 3 0 0 0-3-2H9a3 3 0 0 0-3 2l-2 5z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="8" cy="16" r="1.8" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="16" r="1.8" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    bus: '<rect x="5" y="5" width="14" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 11h14M9 17v2M15 17v2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/>',
    train: '<rect x="5" y="4" width="14" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 12h14M8 18l-2 3M16 18l2 3" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="15" r="1"/><circle cx="15" cy="15" r="1"/>',
    airplane: '<path d="M10.5 21l1.5-6 7-4.5V8l-7 2-2-5h-1.5l-1 4-3 1.5V12l2.5-0.5 2 3.5-1 1.5v1l2-1 1 4z" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>',
    palm: '<path d="M12 21v-8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 13c0-4 3-7 7-9M12 13c0-4-3-7-7-9M12 13c3-2 7-2 10 0M12 13c-3-2-7-2-10 0" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    beach: '<path d="M12 14v6M12 14l-7-3 5-2 2 5 2-5 5 2z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 20h18" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    travel: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    holiday: '<path d="M5 19c5-6 9-6 14 0M8 15l3-7 3 7" fill="none" stroke="currentColor" stroke-width="1.8"/>',

    sun: '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    moon: '<path d="M17 4a8 8 0 1 0 3 10 7 7 0 0 1-3-10z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    rain: '<path d="M6 11a4 4 0 0 1 8-2 4 4 0 0 1 4 7H8a4 4 0 0 1-2-5z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 17l-1 3M13 17l-1 3M17 17l-1 3" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    snow: '<path d="M6 11a4 4 0 0 1 8-2 4 4 0 0 1 4 7H8a4 4 0 0 1-2-5z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="19" r="0.8"/><circle cx="13" cy="19" r="0.8"/><circle cx="17" cy="19" r="0.8"/>',
    storm: '<path d="M6 11a4 4 0 0 1 8-2 4 4 0 0 1 4 7H8a4 4 0 0 1-2-5z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M11 15l-2 4h3l-1 3" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    leaf: '<path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 19L17 7" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    tree: '<path d="M12 4l5 7h-3l4 5h-4v4H10v-4H6l4-5H7z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    flower: '<circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="7" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="17" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="7" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    park: '<path d="M12 4l5 7h-3l4 5h-4v4h-4v-4H6l4-5H7z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 20h18" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    playground: '<path d="M4 20l8-14 8 14M4 20h16M10 20v-6M14 20v-6" fill="none" stroke="currentColor" stroke-width="1.8"/>',

    dog: '<path d="M5 10l2-4 3 3 4 0 3-3 2 4v7a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="10" cy="13" r="0.9"/><circle cx="14" cy="13" r="0.9"/>',
    cat: '<path d="M5 10l2-5 3 4h4l3-4 2 5v7a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 13l0 1M14 13l0 1M11 16s1 1 2 0" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    pets: '<circle cx="7" cy="9" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="6" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="9" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 18c0-3 2-5 4-5s4 2 4 5" fill="none" stroke="currentColor" stroke-width="1.8"/>',

    friends: '<circle cx="8" cy="9" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="9" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 19c0-3 2-5 5-5s5 2 5 5M11 19c0-3 2-5 5-5s5 2 5 5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    family: '<circle cx="7" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="14" r="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 20c0-3 2-4 3-4M20 20c0-3-2-4-3-4M10 20c0-2 1-3 2-3s2 1 2 3" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    date: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.3A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 11l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    phone: '<path d="M5 5l3-1 2 4-2 1a10 10 0 0 0 5 5l1-2 4 2-1 3c-8 1-14-5-12-12z" fill="none" stroke="currentColor" stroke-width="1.8"/>',

    beauty: '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    nails: '<path d="M9 4h6v13a3 3 0 0 1-6 0z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 8h4" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    hair: '<path d="M6 16a6 6 0 0 1 12 0M7 12a5 5 0 0 1 10 0M12 4v6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    spa: '<path d="M12 4c-2 3-5 4-5 8s2 6 5 6 5-2 5-6-3-5-5-8z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 20c2-2 4-2 8-2s6 0 8 2" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    selfcare: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.3A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    mindfulness: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="1"/>',
    focus: '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    relax: '<path d="M4 16c0-4 3-6 8-6s8 2 8 6M8 16v4M16 16v4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="7" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    sleep: '<path d="M4 16c4-2 6-2 10 0s6 2 6 2v-2c-2 0-4 0-6-2s-6-2-10 0z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M14 6h4l-4 5h4" fill="none" stroke="currentColor" stroke-width="1.8"/>',

    library: '<path d="M5 4h3v16H5zM10 4h3v16h-3zM15 6l3-1 2 15-3 1z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    clinic: '<path d="M5 20V7h14v13" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 10v6M9 13h6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    volunteer: '<circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 20c0-4 3-6 7-6s7 2 7 6M9 11l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    charity: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.3A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 11l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  };

  function fallbackSvg() {
    return '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v4l2.5 1.5" fill="none" stroke="currentColor" stroke-width="1.8"/>';
  }

  function renderIconSvg(iconKey, className = 'ff-icon') {
    const key = typeof iconKey === 'string' && iconKey ? iconKey : 'sparkles';
    const body = ICON_SVG[key] || fallbackSvg();
    return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
  }

  function iconLabel(iconKey) {
    const entry = ICON_MAP.get(iconKey);
    return entry ? entry.label : iconKey || 'Symbol';
  }

  function normalizeSearch(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .trim();
  }

  function searchIcons(query) {
    const term = normalizeSearch(query);
    if (!term) {
      return ICONS.slice();
    }
    return ICONS.filter((icon) => {
      if (icon.key.includes(term)) return true;
      if (normalizeSearch(icon.label).includes(term)) return true;
      return icon.keywords.some((keyword) => normalizeSearch(keyword).includes(term));
    });
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function toLocalDateKey(dateValue) {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatTime(dateValue, allDay = false) {
    if (allDay) {
      return 'Ganztägig';
    }
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return '--:--';
    }
    return new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  function formatDayLabel(dateKey) {
    const date = new Date(`${dateKey}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return dateKey;
    }
    return new Intl.DateTimeFormat('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    }).format(date);
  }

  function startOfDay(dateValue) {
    const date = new Date(dateValue);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function addDays(dateValue, amount) {
    const date = startOfDay(dateValue);
    date.setDate(date.getDate() + amount);
    return date;
  }

  function startOfWeek(dateValue) {
    const date = startOfDay(dateValue);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    return addDays(date, diff);
  }

  function endOfWeek(dateValue) {
    return addDays(startOfWeek(dateValue), 6);
  }

  function startOfMonth(dateValue) {
    const date = startOfDay(dateValue);
    date.setDate(1);
    return date;
  }

  function endOfMonth(dateValue) {
    const date = startOfMonth(dateValue);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return date;
  }

  function addMonths(dateValue, amount) {
    const date = startOfMonth(dateValue);
    date.setMonth(date.getMonth() + amount);
    return date;
  }

  function isSameDay(a, b) {
    return toLocalDateKey(a) === toLocalDateKey(b);
  }

  function formatRange(startDate, endDate, mode) {
    if (mode === 'month') {
      return new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(startDate);
    }
    if (mode === 'week') {
      const left = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short' }).format(startDate);
      const right = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }).format(endDate);
      return `${left} – ${right}`;
    }
    return new Intl.DateTimeFormat('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(startDate);
  }

  function eventMinutes(event) {
    const start = new Date(event.startAt);
    const end = new Date(event.endAt);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = Math.max(startMinutes + 15, end.getHours() * 60 + end.getMinutes());
    return { startMinutes, endMinutes };
  }

  function eventsOnDay(events, dateValue) {
    const key = toLocalDateKey(dateValue);
    return events
      .filter((event) => toLocalDateKey(event.startAt) === key)
      .sort((left, right) => new Date(left.startAt).getTime() - new Date(right.startAt).getTime());
  }

  function eventsBetween(events, startDate, endDate) {
    const startTs = startOfDay(startDate).getTime();
    const endTs = startOfDay(endDate).getTime() + 24 * 60 * 60 * 1000 - 1;
    return events
      .filter((event) => {
        const ts = new Date(event.startAt).getTime();
        return ts >= startTs && ts <= endTs;
      })
      .sort((left, right) => new Date(left.startAt).getTime() - new Date(right.startAt).getTime());
  }

  window.FrameflowCalendar = {
    ICONS,
    ICON_KEYS: ICONS.map((icon) => icon.key),
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
    eventsBetween,
  };
})();
