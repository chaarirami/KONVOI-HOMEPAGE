// src/i18n/routeMap.ts
// Static bidirectional route map for language switcher navigation.
// Phase 3 stubs all known routes from REQUIREMENTS.md.
// Content phases (4-7) update entries as pages are created.
// Per D-04: keyed by canonical route key, values are locale-specific paths.

export const routeMap: Record<string, { de: string; en: string }> = {
  // Top-level pages
  home:       { de: '/',          en: '/en' },
  about:      { de: '/about',     en: '/en/about' },
  contact:    { de: '/kontakt',   en: '/en/contact' },
  product:    { de: '/produkt',   en: '/en/product' },
  pricing:    { de: '/preise',    en: '/en/pricing' },
  roi:        { de: '/roi',       en: '/en/roi' },
  funding:    { de: '/foerderung', en: '/en/funding' },
  careers:    { de: '/karriere',  en: '/en/careers' },
  news:       { de: '/aktuelles', en: '/en/news' },
  'case-studies': { de: '/fallstudien', en: '/en/case-studies' },
  thanks:     { de: '/danke',     en: '/en/thanks' },

  // Use-case pages (UC-01)
  'use-cases/cargo-theft':             { de: '/anwendungen/ladungsdiebstahl',       en: '/en/use-cases/cargo-theft' },
  'use-cases/diesel-theft':            { de: '/anwendungen/dieseldiebstahl',        en: '/en/use-cases/diesel-theft' },
  'use-cases/equipment-theft':         { de: '/anwendungen/equipmentdiebstahl',     en: '/en/use-cases/equipment-theft' },
  'use-cases/operations-transparency': { de: '/anwendungen/transparenz-der-operationen', en: '/en/use-cases/operations-transparency' },
  'use-cases/trailer-damage':          { de: '/anwendungen/trailerschaeden',        en: '/en/use-cases/trailer-damage' },
  'use-cases/driver-assaults':         { de: '/anwendungen/fahrerangriffe',         en: '/en/use-cases/driver-assaults' },
  'use-cases/stationary-time':         { de: '/anwendungen/standzeit-optimierung',  en: '/en/use-cases/stationary-time-optimization' },

  // Industry verticals (VERT-01)
  'industries/high-value':   { de: '/branchen/hochwertige-gueter', en: '/en/industries/high-value' },
  'industries/cooling':      { de: '/branchen/kuehlgut',           en: '/en/industries/cooling' },
  'industries/intermodal':   { de: '/branchen/intermodal',         en: '/en/industries/intermodal' },
  'industries/other':        { de: '/branchen/sonstige',           en: '/en/industries/other' },
};

/**
 * Given the current URL pathname and a target locale, return the equivalent
 * path in that locale. Returns null if the current path is not in the map.
 *
 * Per D-04: used by LanguageSwitcher.astro to compute navigation targets.
 * Per D-07: never auto-redirects — caller decides what to do with the result.
 */
export function getLocalePath(
  currentPath: string,
  targetLocale: 'de' | 'en'
): string | null {
  const normalised = currentPath === '/' ? '/' : currentPath.replace(/\/+$/, '');
  for (const paths of Object.values(routeMap)) {
    if (paths.de === normalised || paths.en === normalised) {
      return paths[targetLocale];
    }
  }
  return null;
}
