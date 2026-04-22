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
    sparkles: '<path d="M12 2.5l1.9 5.2a3 3 0 0 0 1.9 1.9l5.2 1.9-5.2 1.9a3 3 0 0 0-1.9 1.9L12 18.5l-1.9-5.2a3 3 0 0 0-1.9-1.9L3 9.5l5.2-1.9a3 3 0 0 0 1.9-1.9L12 2.5z" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M18.5 15l.75 1.9 1.9.75-1.9.75L18.5 20.3l-.75-1.9-1.9-.75 1.9-.75z" fill="currentColor"/><path d="M5 17.8l.55 1.4 1.4.55-1.4.55L5 21.7l-.55-1.4L3 19.75l1.45-.55z" fill="currentColor"/>',
    heart: '<path d="M12 20.5s-7.5-4.6-7.5-10.5a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 5.9-7.5 10.5-7.5 10.5h-1z" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 10.5a2.2 2.2 0 0 1 2-2" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.3" stroke-linecap="round"/>',
    star: '<path d="M12 3.2l2.7 5.6 6.1 0.9-4.4 4.3 1.05 6.1L12 17.2l-5.45 2.9 1.05-6.1L3.2 9.7l6.1-0.9L12 3.2z" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
    bell: '<path d="M5.5 17h13l-1.2-1.4a2 2 0 0 1-0.5-1.3V10a5 5 0 0 0-10 0v4.3a2 2 0 0 1-0.5 1.3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 20a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M11 4.5a1 1 0 0 1 2 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    clock: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 3.5v1M12 19.5v1M3.5 12h1M19.5 12h1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    alarm: '<circle cx="12" cy="13" r="7.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 9v4.2l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M4.5 7.5l3-3M19.5 7.5l-3-3M8 20.5l-1.5 2M16 20.5l1.5 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    calendar: '<rect x="3.5" y="5.5" width="17" height="15" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 10h17" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 3v4M16 3v4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="7" y="12.5" width="3" height="2.5" rx="0.5" fill="currentColor"/><path d="M12 13.5h5M12 16.5h5M7 16.5h3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    note: '<path d="M6 3.5h9l4.5 4.5V20a0.5 0.5 0 0 1-0.5 0.5H6a0.5 0.5 0 0 1-0.5-0.5V4a0.5 0.5 0 0 1 0.5-0.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M15 3.5V8h4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.5 12h7M8.5 15h7M8.5 18h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    checklist: '<rect x="3.5" y="4" width="17" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 8.3l1.4 1.4L10 7M6 13.3l1.4 1.4L10 12M6 18.3l1.4 1.4L10 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 9h6M12 14h6M12 19h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    idea: '<path d="M12 3a6 6 0 0 1 4 10.5c-.7.7-1 1.5-1 2.5h-6c0-1-.3-1.8-1-2.5A6 6 0 0 1 12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 17h6M10 20h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10 9c0-1 1-1.5 2-1.5s2 .5 2 1.5M12 9v4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',

    stethoscope: '<path d="M6 3.5V10a4 4 0 0 0 8 0V3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6 3.5h1.5M12.5 3.5H14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10 14v2.5a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4V14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="18" cy="12" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="12" r="0.6" fill="currentColor"/>',
    doctor: '<circle cx="12" cy="7" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 20.5v-1.5a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="10.3" y="15.3" width="3.4" height="3.4" rx="0.4" fill="currentColor"/><path d="M12 15.8v2.4M10.8 17h2.4" fill="none" stroke="#fff" stroke-width="0.9" stroke-linecap="round" opacity="0.9"/>',
    hospital: '<path d="M4 20.5V9L12 4.5 20 9v11.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M4 20.5h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="10.5" y="10.5" width="3" height="7" rx="0.3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 11.5v3M10.8 13h2.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><rect x="6" y="13" width="2.5" height="2.5" rx="0.3" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="15.5" y="13" width="2.5" height="2.5" rx="0.3" fill="none" stroke="currentColor" stroke-width="1.3"/>',
    pill: '<rect x="3" y="9.5" width="18" height="5" rx="2.5" transform="rotate(-35 12 12)" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.6 7.1l4.1 5.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="7.5" cy="16" r="0.4" fill="currentColor"/><circle cx="16.5" cy="8" r="0.4" fill="currentColor"/>',
    tooth: '<path d="M7.5 3.5c1.7 0 2.2 1.5 4.5 1.5s2.8-1.5 4.5-1.5c2 0 3 2 3 5 0 3.5-1.5 4.5-1.9 8-0.1 0.9-.4 3.5-1.6 3.5-1.4 0-.9-4-3-4s-1.6 4-3 4c-1.2 0-1.5-2.6-1.6-3.5C7.9 13 6.5 12 6.5 8.5c0-3 1-5 3-5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 7.5c1-0.5 2-0.5 3 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    dentist: '<path d="M7.5 3.5c1.7 0 2.2 1.5 4.5 1.5s2.8-1.5 4.5-1.5c2 0 3 2 3 5 0 3.5-1.5 4.5-1.9 8-0.1 0.9-.4 3.5-1.6 3.5-1.4 0-.9-4-3-4s-1.6 4-3 4c-1.2 0-1.5-2.6-1.6-3.5C7.9 13 6.5 12 6.5 8.5c0-3 1-5 3-5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 9.5l4 0M12 8v3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    fitness: '<rect x="2.5" y="10" width="2.2" height="4" rx="0.6" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="19.3" y="10" width="2.2" height="4" rx="0.6" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="5" y="8" width="2.4" height="8" rx="0.6" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="16.6" y="8" width="2.4" height="8" rx="0.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7.4 12h9.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    dumbbell: '<rect x="2.5" y="10" width="2.2" height="4" rx="0.6" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="19.3" y="10" width="2.2" height="4" rx="0.6" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="5" y="8" width="2.4" height="8" rx="0.6" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="16.6" y="8" width="2.4" height="8" rx="0.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7.4 12h9.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    run: '<circle cx="15" cy="5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 11l3.5-2.5 2.5 0.5 1.5 3.5 3 1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 12l-2 4 3 1.5 1 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 16l3-1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    yoga: '<circle cx="12" cy="4.5" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 6.5v6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M5 10c3 0 4.5 2 7 2s4-2 7-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7 18.5c1.5-1 3-1.5 5-1.5s3.5 0.5 5 1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7 18.5l-2 2M17 18.5l2 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    meditation: '<circle cx="12" cy="5.5" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5v4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 19h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 14l-2 1M16 14l2 1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    swim: '<circle cx="8" cy="7" r="1.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.5 8l4 2-2 3 5 1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 16c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 19.5c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    bicycle: '<circle cx="5.5" cy="16" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18.5" cy="16" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="5.5" cy="16" r="0.6" fill="currentColor"/><circle cx="18.5" cy="16" r="0.6" fill="currentColor"/><path d="M5.5 16l4.5-8h4l4.5 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 8h-1.5M14 8l1.5-2.5h2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="13" cy="9.5" r="0.8" fill="currentColor"/>',
    walk: '<circle cx="13" cy="4.5" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M13 6.5l-2 4.5 3 1.5V17l-2 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 13.5l3-1-2-4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 11l-3 1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',

    'shopping-bag': '<path d="M5.5 8h13l-1 12.3a0.5 0.5 0 0 1-.5 0.4H7a0.5 0.5 0 0 1-.5-0.4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M9 12v1M15 12v1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    'shopping-cart': '<path d="M3 4.5h2.5l2.8 11h10l1.8-7H7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="19.5" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="19.5" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 11h6M11 13.5h4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    basket: '<path d="M4 9h16l-1.6 10.3a0.5 0.5 0 0 1-.5 0.4H6.1a0.5 0.5 0 0 1-.5-0.4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 9l5-5.5L17 9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 13v3M12 13v3M15 13v3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    market: '<path d="M3 10.5l1.3-4.5a0.5 0.5 0 0 1 .48-0.35h14.44a0.5 0.5 0 0 1 .48 0.35L21 10.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 10.5c0 1.5 1.3 2.5 2.5 2.5s2.5-1 2.5-2.5c0 1.5 1.3 2.5 2.5 2.5s2.5-1 2.5-2.5c0 1.5 1.3 2.5 2.5 2.5S18 12 18 10.5c0 1.5 1.3 2.5 2.5 2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M5 13v7.5h14V13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="10" y="15" width="4" height="5.5" rx="0.3" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    wallet: '<path d="M4 7.5a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="3.5" y="7.5" width="17" height="11.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="11.5" width="7" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="13.5" r="0.9" fill="currentColor"/>',
    bank: '<path d="M3 10L12 4l9 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 10h18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M5.5 11v7M9 11v7M15 11v7M18.5 11v7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 20.5h18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 18h18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    gift: '<rect x="3.5" y="10.5" width="17" height="9.5" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="2.5" y="6.8" width="19" height="3.7" rx="0.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 6.8v13.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 6.8c-2.2 0-2.8-3.5-0.5-3.5 1.4 0 2.4 1.5 3.5 3.5 1.1-2 2.1-3.5 3.5-3.5 2.3 0 1.7 3.5-0.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',

    briefcase: '<rect x="3.5" y="7.5" width="17" height="12.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3.5 13h17" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="10.5" y="11.5" width="3" height="3" rx="0.4" fill="currentColor"/>',
    meeting: '<circle cx="7.5" cy="8.5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16.5" cy="8.5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="11.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 19c0-3 2-4.5 4.5-4.5S12 16 12 19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 19c0-3 2-4.5 4.5-4.5S21 16 21 19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M9 20c0-2.2 1.4-3 3-3s3 0.8 3 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    document: '<path d="M6 3.5h8.5L19 8v12.5a0.5 0.5 0 0 1-0.5 0.5h-12a0.5 0.5 0 0 1-.5-0.5V4a0.5 0.5 0 0 1 0.5-0.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14.5 3.5V8H19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.5 12h7M8.5 15h7M8.5 18h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',

    home: '<path d="M3 11L12 3l9 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 10.5V20.5h14V10.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 20.5v-5.5a2 2 0 0 1 4 0v5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="6.5" y="12" width="2.5" height="2.5" rx="0.3" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="15" y="12" width="2.5" height="2.5" rx="0.3" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    clean: '<path d="M15 3l-1 6 2 1 1-6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M15.5 10l-2 1.5 1.5 2.5 2-1.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 12l-8 5.5 2 3 8.5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 17.5l-2 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    laundry: '<rect x="4.5" y="3.5" width="15" height="17" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="13.5" r="4.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="13.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="7.5" cy="6.5" r="0.9" fill="currentColor"/><circle cx="10.5" cy="6.5" r="0.9" fill="currentColor"/>',
    garden: '<path d="M12 21V11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 11c-3-0.5-5 1-5 3.5M12 11c3-0.5 5 1 5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="9.5" cy="7" rx="3" ry="2" transform="rotate(-30 9.5 7)" fill="none" stroke="currentColor" stroke-width="1.7"/><ellipse cx="14.5" cy="7" rx="3" ry="2" transform="rotate(30 14.5 7)" fill="none" stroke="currentColor" stroke-width="1.7"/><ellipse cx="12" cy="4.5" rx="2" ry="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M4 21h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    cook: '<path d="M4 11a8 4 0 0 1 16 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M4.5 11h15v1a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M5.5 13l1 6.5a1 1 0 0 0 1 .8h9a1 1 0 0 0 1-0.8l1-6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 6c0.5-1 -0.5-1.5 0-2.5M12 6c0.5-1 -0.5-1.5 0-2.5M16 6c0.5-1 -0.5-1.5 0-2.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',

    school: '<path d="M2.5 9L12 4.5 21.5 9 12 13.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 11V15c0 1.8 2.7 3 6 3s6-1.2 6-3V11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.5 9v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M20.8 14.5a0.7 0.7 0 0 0 1.4 0l-0.3-1.5h-0.8z" fill="currentColor"/>',
    book: '<path d="M4.5 4.5h7a2.5 2.5 0 0 1 2.5 2.5V19H7a2.5 2.5 0 0 0-2.5 2.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 7a2.5 2.5 0 0 1 2.5-2.5h3V19h-3a2.5 2.5 0 0 0-2.5 2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 9h4M7 12h3.5M16 9h1.5M16 12h1.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    graduation: '<path d="M2 9l10-4.5L22 9l-10 4.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 11v3.5c0 1.7 2.7 2.8 6 2.8s6-1.1 6-2.8V11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M22 9v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M22 14v3a1 1 0 0 1-2 0v-3z" fill="currentColor"/>',
    study: '<path d="M4 5.5h13a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 9.5h7M7 12.5h7M7 15.5h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M18 5.5a2 2 0 0 1 2 2V19a1.5 1.5 0 0 1-3 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    exam: '<path d="M6 3.5h9l4 4v13a0.5 0.5 0 0 1-0.5 0.5h-12a0.5 0.5 0 0 1-0.5-0.5V4a0.5 0.5 0 0 1 0.5-0.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M15 3.5v4h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.5 13l2 2L15 10.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 17.5h7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    reading: '<path d="M3.5 6.5l8.5 2.2 8.5-2.2v12l-8.5 2.2-8.5-2.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 8.7v12" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 10.5v5M9 11v5M15 11v5M18 10.5v5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
    coding: '<rect x="2.5" y="4.5" width="19" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M2.5 8h19" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="5" cy="6.2" r="0.5" fill="currentColor"/><circle cx="6.8" cy="6.2" r="0.5" fill="currentColor"/><circle cx="8.6" cy="6.2" r="0.5" fill="currentColor"/><path d="M8 11l-2 2 2 2M16 11l2 2-2 2M13.5 10.5l-3 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 20.5h8M12 17.5v3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    gaming: '<path d="M6.5 7h11a4 4 0 0 1 4 4v3a3.5 3.5 0 0 1-6 2.3l-1.3-1.3h-4.4l-1.3 1.3a3.5 3.5 0 0 1-6-2.3v-3a4 4 0 0 1 4-4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 11v2.5M5.75 12.25h2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="15.5" cy="11.5" r="0.9" fill="currentColor"/><circle cx="17.5" cy="13.5" r="0.9" fill="currentColor"/>',

    camera: '<path d="M3.5 7.5h4L9 5.5h6l1.5 2h4A0.5 0.5 0 0 1 21 8v11a0.5 0.5 0 0 1-.5.5h-17A0.5 0.5 0 0 1 3 19V8A0.5 0.5 0 0 1 3.5 7.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="13.5" r="3.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="13.5" r="1.6" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="17.5" cy="10" r="0.7" fill="currentColor"/>',
    music: '<path d="M10 17.5a2.3 2.3 0 1 1-4.6 0 2.3 2.3 0 0 1 4.6 0zM19.2 15a2.3 2.3 0 1 1-4.6 0 2.3 2.3 0 0 1 4.6 0z" fill="currentColor"/><path d="M10 17.5V5.5l9.2-2.5V15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 8.5l9.2-2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    concert: '<path d="M12 3.5v8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 11.5l-5.5 4 1 5h9l1-5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 3.5c-0.8 1 -0.8 1.8 0 2.5 0.8-0.7 0.8-1.5 0-2.5z" fill="currentColor"/><path d="M7.5 20.5v-4M12 20.5v-4M16.5 20.5v-4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 16l2-1M21 16l-2-1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    festival: '<path d="M12 3.5V7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="2.5" r="0.8" fill="currentColor"/><path d="M4 20.5l8-14 8 14z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 20.5l5-9 5 9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M10 20.5c0-1.5 0.8-2.5 2-2.5s2 1 2 2.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    movie: '<rect x="2.5" y="5.5" width="19" height="13" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M2.5 9h19M2.5 15h19" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4.5 5.5v13M7.5 5.5v13M19.5 5.5v13M16.5 5.5v13" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10.5 10.5l3.5 2-3.5 2z" fill="currentColor"/>',
    tv: '<rect x="2.5" y="4.5" width="19" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 21h8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 17.5v3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 8l4 3-4 3z" fill="currentColor"/>',
    theater: '<path d="M3.5 5.5h6a0.5 0.5 0 0 1 0.5 0.5V10c0 3-2 5-3.5 5s-3.5-2-3.5-5V6a0.5 0.5 0 0 1 0.5-0.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 9h6a0.5 0.5 0 0 1 0.5 0.5V14c0 3-2 5-3.5 5s-3.5-2-3.5-5V9.5a0.5 0.5 0 0 1 0.5-0.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="5" cy="8.5" r="0.6" fill="currentColor"/><circle cx="8" cy="8.5" r="0.6" fill="currentColor"/><path d="M5 11.5c0.5 0.5 2 0.5 3 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="16" cy="12" r="0.6" fill="currentColor"/><circle cx="19" cy="12" r="0.6" fill="currentColor"/><path d="M16 15c0.5-0.5 2-0.5 3 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    museum: '<path d="M2.5 9L12 4l9.5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M2.5 9h19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M5 9v9M9 9v9M15 9v9M19 9v9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 10.5v7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M2.5 20.5h19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M2.5 18h19" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    art: '<path d="M4 19.5v-12a2 2 0 0 1 2-2h9l4 4v2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M15 5.5v4h4" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="7" y="13" width="11" height="7.5" rx="0.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 18l3-3 2 2 3-3.5 3 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="9.5" cy="15" r="0.7" fill="currentColor"/>',
    paint: '<path d="M3 20.5l3-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M5 18.5a2 2 0 1 0 3 0l8-8-3-3-8 8a2 2 0 0 0 0 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M13 7.5l3 3 2-2-3-3z" fill="currentColor"/><path d="M15.5 4.5l2-2 3 3-2 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    palette: '<path d="M12 3.5c-4.5 0-8.5 3.5-8.5 8 0 3 2 5.5 5 5.5 1.5 0 2-1 2-2s-1-1.5-1-2.5 1-2 2.5-2h2.5c3 0 5-2 5-4s-3-3-7.5-3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="7.5" cy="10" r="1.1" fill="currentColor"/><circle cx="11" cy="7" r="1.1" fill="currentColor"/><circle cx="15" cy="7.5" r="1.1" fill="currentColor"/><circle cx="16.5" cy="11" r="1.1" fill="currentColor"/><circle cx="10" cy="19" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    dance: '<circle cx="10" cy="4.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 6.3l-2 5 4 1 -0.5 4 3.5 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12.3l4-1.5 2 1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.5 16.3l-3 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    party: '<path d="M3.5 20.5l5-13 5 5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 14l3 3M6 17l3 2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M15 6l2-2M18 9l3-1M14 3l1-0.5M19 14l2 0M13 9l-1 1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="16.5" cy="6.5" r="0.7" fill="currentColor"/><circle cx="20" cy="11" r="0.7" fill="currentColor"/><circle cx="15" cy="11" r="0.6" fill="currentColor"/>',
    celebrate: '<path d="M4 20.5l5-13 5 5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7.5 14l3 3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M17 4.5l1-2.5M19.5 8l2.5-1M17 10l2.5 0.5M14 4l0.5-2M20 13l-2 1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M15.5 7.5l1.5 1.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    birthday: '<path d="M4 13.5c2-1.2 4-1.2 8 0s6 1.2 8 0V20H4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><rect x="5" y="10" width="14" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 10V7M12 10V5.5M16 10V7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 7c-0.6-0.7-0.6-1.5 0-2 0.6 0.5 0.6 1.3 0 2zM12 5.5c-0.8-1-0.8-2 0-2.8 0.8 0.8 0.8 1.8 0 2.8zM16 7c-0.6-0.7-0.6-1.5 0-2 0.6 0.5 0.6 1.3 0 2z" fill="currentColor"/>',
    cake: '<path d="M4 13.5c2-1.2 4-1.2 8 0s6 1.2 8 0V20H4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><rect x="5" y="10" width="14" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 10V7M12 10V6M16 10V7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 7c-0.6-0.7-0.6-1.5 0-2 0.6 0.5 0.6 1.3 0 2zM12 6c-0.8-1-0.8-2 0-2.6 0.8 0.6 0.8 1.6 0 2.6zM16 7c-0.6-0.7-0.6-1.5 0-2 0.6 0.5 0.6 1.3 0 2z" fill="currentColor"/>',
    pizza: '<path d="M12 3.5L20.5 20c-5.5 2-11.5 2-17 0z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M5.8 17c4 1.3 8.4 1.3 12.4 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="10" cy="11" r="1.1" fill="currentColor"/><circle cx="14" cy="13" r="1.1" fill="currentColor"/><circle cx="11.5" cy="15.5" r="1" fill="currentColor"/>',
    coffee: '<path d="M4 10h12v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 12h2.5a2.5 2.5 0 0 1 0 5H16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 6c0.5-1 -0.5-1.5 0-2.5M10 6c0.5-1 -0.5-1.5 0-2.5M13 6c0.5-1 -0.5-1.5 0-2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    breakfast: '<ellipse cx="9.5" cy="12.5" rx="6" ry="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 12.5v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="9.5" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="9.5" cy="12" r="0.8" fill="currentColor"/><path d="M17 12.5h2.5a2 2 0 0 1 0 4H16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 9.5c0.4-0.8 -0.4-1.3 0-2M11.5 9.5c0.4-0.8 -0.4-1.3 0-2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    lunch: '<circle cx="12" cy="13" r="7.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="13" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 5l1 3M18 5l-1 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M12 9v8M8 13h8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>',
    dinner: '<path d="M6 3.5c-1.5 0-1.5 3 0 5v12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 3.5v4a2 2 0 0 0 2 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 3.5v6.5a2 2 0 0 0 4 0V3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M18 10v10.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    snack: '<path d="M5 10.5l14-3L17.5 20.5H6.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 10.5l14-3" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="14" r="0.7" fill="currentColor"/><circle cx="12" cy="16" r="0.7" fill="currentColor"/><circle cx="14.5" cy="13.5" r="0.7" fill="currentColor"/><circle cx="11" cy="18" r="0.6" fill="currentColor"/>',
    water: '<path d="M12 3c3.5 5.5 6.5 8.5 6.5 12a6.5 6.5 0 1 1-13 0c0-3.5 3-6.5 6.5-12z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 14a3 3 0 0 0 2 3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>',

    car: '<path d="M4 15.5l1.5-4.5a2 2 0 0 1 2-1.5h9a2 2 0 0 1 2 1.5l1.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M3.5 15.5h17v3a0.5 0.5 0 0 1-.5 0.5H17a0.5 0.5 0 0 1-.5-0.5V18h-9v0.5a0.5 0.5 0 0 1-.5 0.5H4a0.5 0.5 0 0 1-.5-0.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 9.5l1.5-2a1 1 0 0 1 0.8-0.5h5.4a1 1 0 0 1 0.8 0.5L17 9.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="7" cy="17" r="1.2" fill="currentColor"/><circle cx="17" cy="17" r="1.2" fill="currentColor"/>',
    bus: '<rect x="4.5" y="4.5" width="15" height="13.5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 11h15" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="6" y="6.5" width="5" height="3" rx="0.4" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="13" y="6.5" width="5" height="3" rx="0.4" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="14.5" r="1.2" fill="currentColor"/><circle cx="16" cy="14.5" r="1.2" fill="currentColor"/><path d="M8 18l-1.5 2.5M16 18l1.5 2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    train: '<rect x="4.5" y="3.5" width="15" height="15" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 11h15" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="6.5" y="5.5" width="4.5" height="3.5" rx="0.4" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="13" y="5.5" width="4.5" height="3.5" rx="0.4" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="15" r="1.2" fill="currentColor"/><circle cx="16" cy="15" r="1.2" fill="currentColor"/><path d="M8 18.5l-2 2.5M16 18.5l2 2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M3 21l2-1M21 21l-2-1" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    airplane: '<path d="M10.5 21l1.5-6 7-4.5V8l-7 2-2-5h-1.5l-1 4-3 1.5V12l2.5-0.5 2 3.5-1 1.5v1l2-1 1 4z" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>',
    palm: '<path d="M12 21v-9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 13s0-1 0.5-2M11.5 16s0.5-1 1-1.5M12.5 19s-0.5-1-0.5-2" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M12 12c-1-3 0.5-6 4.5-7-1 3-2.5 5.5-4.5 7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 12c1-3-.5-6-4.5-7 1 3 2.5 5.5 4.5 7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 12c-3-1-6 0.5-7 4.5 3-1 5.5-2.5 7-4.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 12c3-1 6 0.5 7 4.5-3-1-5.5-2.5-7-4.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    beach: '<circle cx="8" cy="7.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 12c0.8-2 3-3.5 6.5-4.5s5.5 0 6.5 1l-8.5 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.5 11l8.5-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 11.5V20.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 20.5c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    travel: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 12h17" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3.5c3 3 3 13 0 17M12 3.5c-3 3-3 13 0 17" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 7.5c2 1 12 1 14 0M5 16.5c2-1 12-1 14 0" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    holiday: '<path d="M4 19.5c2-1.5 4-2 6-2 1 0 1 1 2 1s1-1 2-1c2 0 4 0.5 6 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7 15l5-10 5 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 15.5l3-6 3 6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="4" r="0.8" fill="currentColor"/>',

    sun: '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    moon: '<path d="M17 4a8 8 0 1 0 3 10 7 7 0 0 1-3-10z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    rain: '<path d="M6 11a4 4 0 0 1 8-2 4 4 0 0 1 4 7H8a4 4 0 0 1-2-5z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 17l-1 3M13 17l-1 3M17 17l-1 3" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    snow: '<path d="M6 11a4 4 0 0 1 8-2 4 4 0 0 1 4 7H8a4 4 0 0 1-2-5z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="19" r="0.8" fill="currentColor"/><circle cx="13" cy="19" r="0.8" fill="currentColor"/><circle cx="17" cy="19" r="0.8" fill="currentColor"/>',
    storm: '<path d="M6 11a4 4 0 0 1 8-2 4 4 0 0 1 4 7H8a4 4 0 0 1-2-5z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 14l-1.5 3.5h2.5L11.5 21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    leaf: '<path d="M4 20c0-9 6-16 16-16 0 9-7 16-16 16z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M4 20L18 6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M8 14l4-2M10 17l5-2" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>',
    tree: '<path d="M12 3.5l5 6.5h-2.5l4.5 5.5H16v5.5H8v-5.5H4.5L9 10H6.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 21v-3M14 21v-3" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    flower: '<circle cx="12" cy="12" r="2.2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="6.5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17.5" cy="12" r="2.2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="17.5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="6.5" cy="12" r="2.2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    park: '<path d="M8 13l4-6 4 6h-2l3 4h-3v4h-4v-4H7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 17v4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 20.5h18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M5 20.5c0-1 .5-2 1.5-2s1.5 1 1.5 2M17 20.5c0-1 .5-2 1.5-2s1.5 1 1.5 2" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    playground: '<path d="M4 20V9l8-5 8 5v11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M4 20h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M4 14h16" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 14v6M16 14v6M12 14v6" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="9" r="1" fill="currentColor"/>',

    dog: '<path d="M4.5 11L6 6l3 2.5 1-0.5 4 0 1 0.5 3-2.5 1.5 5v6.5a3 3 0 0 1-3 3H7.5a3 3 0 0 1-3-3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 6l0.5 4M18 6l-0.5 4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="9.5" cy="13" r="0.9" fill="currentColor"/><circle cx="14.5" cy="13" r="0.9" fill="currentColor"/><path d="M11 16h2l-1 1.5z" fill="currentColor"/><path d="M11 19c0.5 0.5 1.5 0.5 2 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    cat: '<path d="M5 11l1.5-6 4 3h3l4-3 1.5 6v6.5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6.5 5l2 4M17.5 5l-2 4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="9.5" cy="13" r="0.9" fill="currentColor"/><circle cx="14.5" cy="13" r="0.9" fill="currentColor"/><path d="M11.5 16h1l-0.5 1z" fill="currentColor"/><path d="M10.5 18c0.5 0.7 2 0.7 3 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5 15l-2 0M19 15l2 0M6 13l-2-1M18 13l2-1" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
    pets: '<circle cx="7" cy="9" r="1.8" fill="currentColor"/><circle cx="12" cy="6" r="1.8" fill="currentColor"/><circle cx="17" cy="9" r="1.8" fill="currentColor"/><circle cx="4" cy="13.5" r="1.4" fill="currentColor"/><circle cx="20" cy="13.5" r="1.4" fill="currentColor"/><path d="M8 19c0-3 1.8-4.5 4-4.5s4 1.5 4 4.5c0 1.5-1 2.5-2 2.5h-4c-1 0-2-1-2-2.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',

    friends: '<circle cx="8" cy="8" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="8" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M2.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    family: '<circle cx="7" cy="7.5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="7.5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="13.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 20c0-3 1.8-4.5 4-4.5s1.5 0.5 2 1.5M21 20c0-3-1.8-4.5-4-4.5s-1.5 0.5-2 1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8.5 20.5c0-2 1.5-3 3.5-3s3.5 1 3.5 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    date: '<path d="M12 20.5s-7.5-4.6-7.5-10.5a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 5.9-7.5 10.5-7.5 10.5h-1z" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    phone: '<path d="M5.5 3.5h4a0.5 0.5 0 0 1 0.48 0.36L11.3 8.1a0.5 0.5 0 0 1-0.23 0.56l-2.2 1.3a12 12 0 0 0 4.97 4.97l1.3-2.2a0.5 0.5 0 0 1 0.56-0.23l4.24 1.32a0.5 0.5 0 0 1 0.36 0.48v4a2 2 0 0 1-2 2C10.84 20.3 3.7 13.16 3.5 5.5a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',

    beauty: '<path d="M12 3.5L14 8.5l5 0.8-3.8 3.5 1 5.2L12 15.5l-4.2 2.5 1-5.2L5 9.3 10 8.5z" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M18 19l0.6 1.3 1.3 0.6-1.3 0.6L18 22.8l-0.6-1.3-1.3-0.6 1.3-0.6z" fill="currentColor"/><path d="M5 18l0.4 0.9 0.9 0.4-0.9 0.4L5 20.6l-0.4-0.9L3.7 19.3l0.9-0.4z" fill="currentColor"/>',
    nails: '<path d="M8.5 4.5h7a1 1 0 0 1 1 1v11a4.5 4.5 0 0 1-9 0v-11a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><ellipse cx="12" cy="8" rx="2.8" ry="2" fill="currentColor"/><path d="M9 13h6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    hair: '<circle cx="12" cy="10" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 10c0-5 5-7 10-5M7 14c0-3 2-4 5-3M17.5 10c0-5-2-6-4-6M17 14c0-3-2-4-5-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M10 15.5v2a2 2 0 0 0 4 0v-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    spa: '<path d="M12 3c-2.5 3.5-5.5 5-5.5 9.5A5.5 5.5 0 0 0 12 18a5.5 5.5 0 0 0 5.5-5.5C17.5 8 14.5 6.5 12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 12.5c0-1.5 1-2.5 2-3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/><path d="M3 20.5c2.5-1 4.5-1 9-1s6.5 0 9 1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    selfcare: '<path d="M12 20.5s-7.5-4.6-7.5-10.5a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 5.9-7.5 10.5-7.5 10.5h-1z" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M9 10.5a2.5 2.5 0 0 1 2.2-2.3" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.4" stroke-linecap="round"/>',
    mindfulness: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    focus: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><path d="M12 2v3.5M12 18.5v3.5M2 12h3.5M18.5 12h3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    relax: '<path d="M3 15a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3H3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 12v-3a2 2 0 0 1 2-2h4v5M13 12V7h4a2 2 0 0 1 2 2v3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M5 18v2M19 18v2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    sleep: '<path d="M3 16a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v3H3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 12V9a2 2 0 0 1 2-2h2v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 19v2M21 19v2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M13 3h4l-4 5h4M17 9h2.5l-2.5 3h2.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>',

    library: '<rect x="3.5" y="3.5" width="3.5" height="17" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="8" y="3.5" width="3.5" height="17" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="14.2" y="4.5" width="3.5" height="16" rx="0.5" transform="rotate(-8 16 12.5)" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 7.5h1.5M9 7.5h1.5M4.5 16h1.5M9 16h1.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
    clinic: '<path d="M4 20.5V9L12 4.5 20 9v11.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M4 20.5h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 11v6M9 14h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="14" r="3" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    volunteer: '<circle cx="12" cy="7" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 20.5v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M9 17.5l2 2 4.5-4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    charity: '<path d="M12 20.5s-7.5-4.6-7.5-10.5a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 5.9-7.5 10.5-7.5 10.5h-1z" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M8 11l2.5 2.5L15.5 8.5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
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
