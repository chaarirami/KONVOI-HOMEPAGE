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
