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
    'nav.team':        'Team',
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

    // Pricing page
    'pricing.hero_tagline':           'Transparente Preisgestaltung',
    'pricing.hero_title':             'Das richtige Paket für Ihre Flotte',
    'pricing.hero_subtitle':          'Drei Pakete — skalierbar nach Ihren Anforderungen. Alle Preise auf Anfrage.',
    'pricing.tier_cta':               'Angebot anfragen',
    'pricing.tier_price_prefix':      'ab',
    'pricing.tier_price_period':      '/ Monat',
    'pricing.roi_section_title':      'Berechnen Sie Ihren ROI',
    'pricing.roi_section_subtitle':   'Ermitteln Sie Ihre jährlichen Ersparnisse und die Amortisationszeit für Ihre Flotte.',

    // ROI calculator
    'roi.hero_tagline':               'Ihr ROI-Rechner',
    'roi.hero_title':                 'Was kostet Ihre Flotte ohne KONVOI?',
    'roi.hero_subtitle':              'Berechnen Sie Ihren jährlichen Verlust durch Diebstahl — und was KONVOI dagegen tut.',
    'roi.input_fleet_label':          'Flottengröße (Trailer)',
    'roi.input_vertical_label':       'Hauptbranche',
    'roi.input_frequency_label':      'Durchschnittliche Parkhäufigkeit',
    'roi.input_frequency_unit':       'Stopps / Woche',
    'roi.vertical_high_value':        'Hochwertige Güter',
    'roi.vertical_cooling':           'Kühltransport',
    'roi.vertical_intermodal':        'Intermodal',
    'roi.vertical_other':             'Sonstiges',
    'roi.output_theft_cost':          'Jährl. Diebstahlkosten (geschätzt)',
    'roi.output_savings':             'KONVOI-Einsparungen (geschätzt)',
    'roi.output_deminimis':           'De-minimis-Förderung (80 %)',
    'roi.output_payback':             'Amortisationszeit',
    'roi.output_payback_unit':        'Monate',
    'roi.cta_book':                   'Beratung mit diesen Zahlen anfragen',

    // Funding page
    'funding.hero_tagline':           'Förderung & Finanzierung',
    'funding.hero_title':             'Bis zu 80 % gefördert durch die Berufsgenossenschaft',
    'funding.hero_subtitle':          'Das KONVOI System qualifiziert sich für die De-minimis-Förderung nach Abschnitt 1.10 des BG-Katalogs.',
    'funding.section_what_title':     'Was ist De-minimis-Förderung?',
    'funding.section_what_body':      'Die Berufsgenossenschaft fördert Maßnahmen zur Diebstahlprävention mit bis zu 80 % der Investitionskosten — auf Basis des BG-Katalogs, Abschnitt 1.10 „Aufwendungen für Maßnahmen zur Vermeidung von Diebstählen".',
    'funding.section_eligibility_title': 'Wer ist förderberechtigt?',
    'funding.section_eligibility_body':  'Unternehmen mit gewerblich genutzten Aufliegern im deutschen Güterverkehr, die Mitglied einer zuständigen BG sind.',
    'funding.section_konvoi_title':   'Warum qualifiziert sich KONVOI?',
    'funding.section_konvoi_body':    'Das KONVOI Sensorsystem ist eine zertifizierte Maßnahme zur aktiven Diebstahlprävention — es erkennt und verhindert Vorfälle, bevor sie eintreten.',
    'funding.section_roi_link':       'Kombinierte Einsparung berechnen',
    'funding.qualifier_title':        'Vorqualifizierung beantragen',
    'funding.qualifier_subtitle':     'Wir prüfen Ihre Förderberechtigung kostenlos — innerhalb von 24 Stunden.',
    'funding.catalog_ref':            'BG-Katalog Abschnitt 1.10',

    // Forms
    'form.name_label':                'Name',
    'form.email_label':               'E-Mail',
    'form.company_label':             'Unternehmen',
    'form.fleet_size_label':          'Flottengröße (Trailer)',
    'form.vertical_label':            'Hauptbranche',
    'form.message_label':             'Nachricht (optional)',
    'form.company_size_label':        'Unternehmensgröße',
    'form.phone_label':               'Telefon (optional)',
    'form.contact_name_label':        'Ansprechpartner',
    'form.company_size_1_10':         '1–10 Mitarbeiter',
    'form.company_size_11_50':        '11–50 Mitarbeiter',
    'form.company_size_51_200':       '51–200 Mitarbeiter',
    'form.company_size_201_plus':     '201+ Mitarbeiter',
    'form.dsgvo_label':               'Ich habe die Datenschutzerklärung gelesen und stimme zu.',
    'form.dsgvo_link_text':           'Datenschutzerklärung',
    'form.error_required':            'Dieses Feld ist erforderlich.',
    'form.error_email':               'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    'form.error_fleet_min':           'Mindestgröße: 1 Trailer.',
    'form.error_dsgvo':               'Bitte stimmen Sie der Datenschutzerklärung zu.',
    'form.error_captcha':             'Bitte schließen Sie die Sicherheitsüberprüfung ab.',
    'form.error_submit':              'Übermittlung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    'form.submitting':                'Wird gesendet…',
    'form.consult_title':             'Beratungsgespräch anfragen',
    'form.consult_subtitle':          'Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
    'form.funding_title':             'Förder-Vorqualifizierung',
    'form.funding_subtitle':          'Kostenlose Prüfung Ihrer BG-Förderberechtigung.',

    // Thank-you pages
    'thanks.title':                   'Vielen Dank!',
    'thanks.subtitle':                'Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
    'thanks.body':                    'Ihr Beratungsgesuch ist bei uns eingegangen. Unser Team wird sich so schnell wie möglich mit Ihnen in Verbindung setzen.',
    'thanks.back_home':               'Zurück zur Startseite',

    // Phase 6: Case studies
    'case_studies.index_title':   'Fallstudien',
    'case_studies.index_subtitle': 'Reale Ergebnisse von Unternehmen, die auf präventive Sicherheit setzen.',
    'case_studies.problem_heading':  'Das Problem',
    'case_studies.approach_heading': 'Unser Ansatz',
    'case_studies.outcome_heading':  'Das Ergebnis',
    'case_studies.read_cta':         'Fallstudie lesen',

    // Phase 6: Blog
    'blog.index_title': 'Aktuelles',
    'blog.rss_label':   'RSS Feed',
    'blog.empty':       'Keine Artikel gefunden.',
    'blog.back_to_all': 'Alle Beiträge',

    // Phase 6: Team
    'team.page_title':    'Unser Team',
    'team.section_label': 'Das Team',

    // Phase 6: Careers
    'careers.page_title':        'Karriere',
    'careers.apply_btn':         'Bewerben',
    'careers.no_roles':          'Derzeit keine offenen Stellen.',
    'careers.en_shell_message':  '',
    'careers.en_shell_link':     '',

    // Phase 6: Contact
    'contact.page_title':      'Kontakt',
    'contact.office_label':    'Büro',
    'contact.load_map':        'Karte laden',
    'contact.hide_map':        'Karte ausblenden',
    'contact.events_heading':  'Kommende Veranstaltungen',
    'contact.no_events':       'Keine anstehenden Veranstaltungen.',
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
    'nav.team':        'Team',
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
    'homepage.values_title':        'KONVOI is unique in three ways',
    'homepage.values_preventive_title':    'Preventive',
    'homepage.values_preventive_desc':     'Detects and classifies threat patterns before damage occurs.',
    'homepage.values_learning_title':      'Learning',
    'homepage.values_learning_desc':       'AI improves classification with every event in your fleet.',
    'homepage.values_independent_title':   'Independent',
    'homepage.values_independent_desc':    '7-day battery. Works offline. No external infrastructure needed.',
    'homepage.explainer_tagline':   'Prevention over reaction',
    'homepage.explainer_title':     'Why prevention is better',
    'homepage.explainer_body':      'Classic GPS trackers only show you where the trailer was stolen — after the incident. KONVOI classifies motion, shock, and GPS patterns in real time and triggers a deterrence chain before the cargo leaves the trailer.',
    'homepage.press_title':         'Featured in',
    'homepage.partners_title':      'Backed by',
    'homepage.cta_title':           'Security for your fleet',
    'homepage.cta_subtitle':        'Learn in 20 minutes how KONVOI works for your company.',
    // Product page sections
    'product.hero_tagline':         'The KONVOI System',
    'product.hero_title':           'Prevention for your trailer — installed in under 120 minutes',
    'product.hero_subtitle':        'Sensor-based Security-as-a-Service with AI classification and immediate deterrence chain.',
    'product.hardware_tagline':     'Hardware',
    'product.hardware_title':       'Compact. Hidden. Reliable.',
    'product.hardware_subtitle':    'GPS + LTE, shock and motion sensors, 7-day battery — all in a concealed housing.',
    'product.steps_tagline':        'How it works',
    'product.steps_title':          'Detection — Classification — Response',
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

    // Pricing page
    'pricing.hero_tagline':           'Transparent Pricing',
    'pricing.hero_title':             'The right package for your fleet',
    'pricing.hero_subtitle':          'Three packages — scalable to your requirements. All prices on request.',
    'pricing.tier_cta':               'Request a quote',
    'pricing.tier_price_prefix':      'from',
    'pricing.tier_price_period':      '/ month',
    'pricing.roi_section_title':      'Calculate Your ROI',
    'pricing.roi_section_subtitle':   'Find out your annual savings and payback period for your fleet.',

    // ROI calculator
    'roi.hero_tagline':               'Your ROI Calculator',
    'roi.hero_title':                 'What is your fleet costing you without KONVOI?',
    'roi.hero_subtitle':              'Calculate your annual theft exposure — and what KONVOI does about it.',
    'roi.input_fleet_label':          'Fleet Size (Trailers)',
    'roi.input_vertical_label':       'Primary Vertical',
    'roi.input_frequency_label':      'Average Parking Frequency',
    'roi.input_frequency_unit':       'stops / week',
    'roi.vertical_high_value':        'High-Value Cargo',
    'roi.vertical_cooling':           'Refrigerated Transport',
    'roi.vertical_intermodal':        'Intermodal',
    'roi.vertical_other':             'Other',
    'roi.output_theft_cost':          'Annual Theft Cost (estimated)',
    'roi.output_savings':             'KONVOI Savings (estimated)',
    'roi.output_deminimis':           'De-Minimis Subsidy (80%)',
    'roi.output_payback':             'Payback Period',
    'roi.output_payback_unit':        'months',
    'roi.cta_book':                   'Book a consult with these numbers',

    // Funding page
    'funding.hero_tagline':           'Funding & Financing',
    'funding.hero_title':             'Up to 80% subsidised through the employers\' liability association',
    'funding.hero_subtitle':          'The KONVOI system qualifies for the de-minimis subsidy under Section 1.10 of the BG catalogue.',
    'funding.section_what_title':     'What is the de-minimis subsidy?',
    'funding.section_what_body':      'The employers\' liability association (Berufsgenossenschaft) subsidises theft-prevention measures by up to 80% of investment costs — based on BG catalogue Section 1.10 "Expenditure on measures to prevent theft".',
    'funding.section_eligibility_title': 'Who is eligible?',
    'funding.section_eligibility_body':  'Companies with commercially used semi-trailers in German freight transport that are members of an applicable BG.',
    'funding.section_konvoi_title':   'Why does KONVOI qualify?',
    'funding.section_konvoi_body':    'The KONVOI sensor system is a certified active theft-prevention measure — it detects and prevents incidents before they occur.',
    'funding.section_roi_link':       'Calculate combined savings',
    'funding.qualifier_title':        'Apply for pre-qualification',
    'funding.qualifier_subtitle':     'We check your subsidy eligibility for free — within 24 hours.',
    'funding.catalog_ref':            'BG Catalogue Section 1.10',

    // Forms
    'form.name_label':                'Name',
    'form.email_label':               'Email',
    'form.company_label':             'Company',
    'form.fleet_size_label':          'Fleet Size (Trailers)',
    'form.vertical_label':            'Primary Vertical',
    'form.message_label':             'Message (optional)',
    'form.company_size_label':        'Company Size',
    'form.phone_label':               'Phone (optional)',
    'form.contact_name_label':        'Contact Person',
    'form.company_size_1_10':         '1–10 employees',
    'form.company_size_11_50':        '11–50 employees',
    'form.company_size_51_200':       '51–200 employees',
    'form.company_size_201_plus':     '201+ employees',
    'form.dsgvo_label':               'I have read and agree to the privacy policy.',
    'form.dsgvo_link_text':           'Privacy Policy',
    'form.error_required':            'This field is required.',
    'form.error_email':               'Please enter a valid email address.',
    'form.error_fleet_min':           'Minimum size: 1 trailer.',
    'form.error_dsgvo':               'Please agree to the privacy policy.',
    'form.error_captcha':             'Please complete the security check.',
    'form.error_submit':              'Submission failed. Please try again.',
    'form.submitting':                'Sending…',
    'form.consult_title':             'Request a Consultation',
    'form.consult_subtitle':          'We will contact you within 24 hours.',
    'form.funding_title':             'Funding Pre-Qualification',
    'form.funding_subtitle':          'Free check of your BG subsidy eligibility.',

    // Thank-you pages
    'thanks.title':                   'Thank You!',
    'thanks.subtitle':                'We will contact you within 24 hours.',
    'thanks.body':                    'Your consultation request has been received. Our team will get in touch with you as soon as possible.',
    'thanks.back_home':               'Back to Home',

    // Phase 6: Case studies
    'case_studies.index_title':    'Case Studies',
    'case_studies.index_subtitle': 'Real outcomes from companies that chose preventive fleet security.',
    'case_studies.problem_heading':  'The Problem',
    'case_studies.approach_heading': 'Our Approach',
    'case_studies.outcome_heading':  'The Outcome',
    'case_studies.read_cta':         'Read case study',

    // Phase 6: Blog
    'blog.index_title': 'News',
    'blog.rss_label':   'RSS Feed',
    'blog.empty':       'No articles found.',
    'blog.back_to_all': 'All posts',

    // Phase 6: Team
    'team.page_title':    'Our Team',
    'team.section_label': 'Our People',

    // Phase 6: Careers
    'careers.page_title':        'Careers',
    'careers.apply_btn':         'Apply',
    'careers.no_roles':          'No open positions.',
    'careers.en_shell_message':  'Our job listings are currently available in German only.',
    'careers.en_shell_link':     'Go to German careers page',

    // Phase 6: Contact
    'contact.page_title':      'Contact',
    'contact.office_label':    'Office',
    'contact.load_map':        'Load map',
    'contact.hide_map':        'Hide map',
    'contact.events_heading':  'Upcoming Events',
    'contact.no_events':       'No upcoming events.',
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
