// src/i18n/translations.ts
// Static UI string translations for nav labels, CTAs, footer, and form text.
// Per D-13: exported as Record<locale, Record<dot.notation.key, string>>.
// Per D-14: flat dot-notation keys (no nesting). Helper t() exported below.

type Locale = 'de' | 'en';

export const translations: Record<Locale, Record<string, string>> = {
  de: {
    // Navigation
    'nav.home':        'Startseite',
    'nav.product':     'Produkt',
    'nav.use_cases':   'Anwendungen',
    'nav.industries':  'Branchen',
    'nav.case_studies':'Fallstudien',
    'nav.news':        'Aktuelles',
    'nav.pricing':     'Preise',
    'nav.careers':     'Karriere',
    'nav.contact':     'Kontakt',
    'nav.about':       'Über uns',
    // CTAs
    'cta.book_consult':      'Beratung anfragen',
    'cta.learn_more':        'Mehr erfahren',
    'cta.view_case_studies': 'Fallstudien ansehen',
    'cta.calculate_roi':     'ROI berechnen',
    // Footer
    'footer.copyright':   '© Konvoi GmbH',
    'footer.legal':       'Impressum',
    'footer.privacy':     'Datenschutz',
    // Language switcher
    'lang.de': 'DE',
    'lang.en': 'EN',
    'lang.switch_to_de': 'Auf Deutsch wechseln',
    'lang.switch_to_en': 'Switch to English',
    // Forms
    'form.required':     'Pflichtfeld',
    'form.submit':       'Absenden',
    'form.dsgvo_consent':'Ich stimme der Datenschutzerklärung zu',
    // Misc
    'misc.loading':  'Laden...',
    'misc.back':     'Zurück',
    // Homepage sections
    'homepage.hero_tagline':        'Security Tech Made in Germany',
    'homepage.hero_title':          'Die erste präventive Lösung für Ihre Flotte',
    'homepage.hero_subtitle':       'KONVOI schützt gegen Ladungsdiebstahl, Dieselklau, Sabotage und Fahrerangriffe — bevor sie passieren.',
    'homepage.logos_title':         'Bereits im Einsatz bei führenden Logistikanbietern',
    'homepage.testimonials_title':  'Das sagen unsere Kunden',
    'homepage.values_title':        'KONVOI ist einzigartig in drei Bereichen',
    'homepage.values_preventive_title':    'Präventiv',
    'homepage.values_preventive_desc':     'Erkennt und klassifiziert Bedrohungsmuster, bevor Schaden entsteht.',
    'homepage.values_learning_title':      'Lernend',
    'homepage.values_learning_desc':       'KI verbessert die Klassifizierung mit jedem Ereignis in Ihrer Flotte.',
    'homepage.values_independent_title':   'Unabhängig',
    'homepage.values_independent_desc':    '7-Tage-Akku. Funktioniert offline. Keine externe Infrastruktur nötig.',
    'homepage.explainer_tagline':   'Prävention statt Reaktion',
    'homepage.explainer_title':     'Warum präventiv besser ist',
    'homepage.explainer_body':      'Klassische GPS-Tracker zeigen Ihnen nur, wo der Trailer gestohlen wurde — nach dem Vorfall. KONVOI klassifiziert Bewegungs-, Schock- und GPS-Muster in Echtzeit und löst eine Abschreckungskette aus, bevor die Ladung den Trailer verlässt.',
    'homepage.press_title':         'Bekannt aus',
    'homepage.partners_title':      'Unterstützt von',
    'homepage.cta_title':           'Sicherheit für Ihre Flotte',
    'homepage.cta_subtitle':        'Erfahren Sie in 20 Minuten, wie KONVOI für Ihr Unternehmen funktioniert.',
    // Product page sections
    'product.hero_tagline':         'Das KONVOI System',
    'product.hero_title':           'Prävention für Ihren Trailer — in unter 120 Minuten installiert',
    'product.hero_subtitle':        'Sensor-basiertes Security-as-a-Service mit KI-Klassifizierung und sofortiger Abschreckungskette.',
    'product.hardware_tagline':     'Hardware',
    'product.hardware_title':       'Kompakt. Versteckt. Zuverlässig.',
    'product.hardware_subtitle':    'GPS + LTE, Schock- und Bewegungssensoren, 7-Tage-Akku — alles in einem verdeckten Gehäuse.',
    'product.steps_tagline':        'So funktioniert es',
    'product.steps_title':          'Erkennung — Klassifizierung — Maßnahmen',
    'product.addons_tagline':       'Erweiterungen',
    'product.addons_title':         'Mehr Transparenz auf Wunsch',
    'product.install_tagline':      'Installation',
    'product.install_title':        'Installation in unter 120 Minuten',
    'product.install_body':         'Unser eigenes Team installiert das KONVOI System an Ihrem Trailer — in unter 120 Minuten, ohne Betriebsunterbrechung.',
    // Use-case page common strings
    'usecase.problem_heading':      'Das Problem',
    'usecase.approach_heading':     'Der KONVOI Ansatz',
    'usecase.viz_heading':          'Sensor-Daten in Echtzeit',
    'usecase.viz_subheading':       'So erkennt KONVOI das Bedrohungsmuster',
    // Industry vertical common strings
    'industry.risk_heading':        'Das Risikoprofil',
    'industry.usecases_heading':    'Relevante Anwendungsfälle',
  },
  en: {
    // Navigation
    'nav.home':        'Home',
    'nav.product':     'Product',
    'nav.use_cases':   'Use Cases',
    'nav.industries':  'Industries',
    'nav.case_studies':'Case Studies',
    'nav.news':        'News',
    'nav.pricing':     'Pricing',
    'nav.careers':     'Careers',
    'nav.contact':     'Contact',
    'nav.about':       'About Us',
    // CTAs
    'cta.book_consult':      'Book a consult',
    'cta.learn_more':        'Learn more',
    'cta.view_case_studies': 'View case studies',
    'cta.calculate_roi':     'Calculate ROI',
    // Footer
    'footer.copyright':   '© Konvoi GmbH',
    'footer.legal':       'Legal Notice',
    'footer.privacy':     'Privacy Policy',
    // Language switcher
    'lang.de': 'DE',
    'lang.en': 'EN',
    'lang.switch_to_de': 'Auf Deutsch wechseln',
    'lang.switch_to_en': 'Switch to English',
    // Forms
    'form.required':     'Required field',
    'form.submit':       'Submit',
    'form.dsgvo_consent':'I agree to the privacy policy',
    // Misc
    'misc.loading':  'Loading...',
    'misc.back':     'Back',
    // Homepage sections
    'homepage.hero_tagline':        'Security Tech Made in Germany',
    'homepage.hero_title':          'The first preventive solution for your fleet',
    'homepage.hero_subtitle':       'KONVOI protects against cargo theft, diesel theft, sabotage, and driver assaults — before they happen.',
    'homepage.logos_title':         'Already in use at leading logistics providers',
    'homepage.testimonials_title':  'What our customers say',
    'homepage.values_title':        'KONVOI is unique in three areas',
    'homepage.values_preventive_title':    'Preventive',
    'homepage.values_preventive_desc':     'Detects and classifies threat patterns before damage occurs.',
    'homepage.values_learning_title':      'Learning',
    'homepage.values_learning_desc':       'AI improves classification with every event across your fleet.',
    'homepage.values_independent_title':   'Independent',
    'homepage.values_independent_desc':    '7-day battery. Works offline. No external infrastructure required.',
    'homepage.explainer_tagline':   'Prevention over reaction',
    'homepage.explainer_title':     'Why prevention beats reaction',
    'homepage.explainer_body':      'Traditional GPS trackers only tell you where your trailer was stolen — after the fact. KONVOI classifies motion, shock, and GPS patterns in real time and triggers a deterrence chain before cargo leaves the trailer.',
    'homepage.press_title':         'Known from',
    'homepage.partners_title':      'Supported by',
    'homepage.cta_title':           'Security for your fleet',
    'homepage.cta_subtitle':        'Find out in 20 minutes how KONVOI works for your business.',
    // Product page sections
    'product.hero_tagline':         'The KONVOI System',
    'product.hero_title':           'Prevention for your trailer — installed in under 120 minutes',
    'product.hero_subtitle':        'Sensor-based Security-as-a-Service with AI classification and an immediate deterrence chain.',
    'product.hardware_tagline':     'Hardware',
    'product.hardware_title':       'Compact. Hidden. Reliable.',
    'product.hardware_subtitle':    'GPS + LTE, shock and motion sensors, 7-day battery — all in a concealed housing.',
    'product.steps_tagline':        'How it works',
    'product.steps_title':          'Detection — Classification — Measures',
    'product.addons_tagline':       'Add-ons',
    'product.addons_title':         'More transparency on demand',
    'product.install_tagline':      'Installation',
    'product.install_title':        'Installation in under 120 minutes',
    'product.install_body':         'Our own team installs the KONVOI system on your trailer — in under 120 minutes, without operational disruption.',
    // Use-case page common strings
    'usecase.problem_heading':      'The Problem',
    'usecase.approach_heading':     'The KONVOI Approach',
    'usecase.viz_heading':          'Sensor Data in Real Time',
    'usecase.viz_subheading':       'How KONVOI detects the threat pattern',
    // Industry vertical common strings
    'industry.risk_heading':        'The Risk Profile',
    'industry.usecases_heading':    'Relevant Use Cases',
  },
};

/**
 * Look up a translation key for a given locale.
 * Falls back to the key itself if not found (never throws).
 * Per D-14: use dot-notation keys, e.g. t('nav.home', 'de') → 'Startseite'
 */
export function t(key: string, locale: string): string {
  const loc = (locale === 'en' ? 'en' : 'de') as Locale;
  return translations[loc]?.[key] ?? key;
}
