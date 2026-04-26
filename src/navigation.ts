import { getAsset } from './utils/permalinks';

// DE navigation (default locale — paths without /en/ prefix)
export const headerDataDe = {
  links: [
    {
      text: 'Produkt',
      href: '/produkt',
    },
    {
      text: 'Anwendungen',
      href: '#',
      links: [
        { text: 'Ladungsdiebstahl',           href: '/anwendungen/ladungsdiebstahl' },
        { text: 'Dieseldiebstahl',             href: '/anwendungen/dieseldiebstahl' },
        { text: 'Equipmentdiebstahl',          href: '/anwendungen/equipmentdiebstahl' },
        { text: 'Transparenz der Operationen', href: '/anwendungen/transparenz-der-operationen' },
        { text: 'Trailerschäden',              href: '/anwendungen/trailerschaeden' },
        { text: 'Fahrerangriffe',              href: '/anwendungen/fahrerangriffe' },
        { text: 'Standzeit-Optimierung',       href: '/anwendungen/standzeit-optimierung' },
        { text: '—— Branchen ——',              href: '#', class: 'nav-separator pointer-events-none opacity-50 text-xs uppercase tracking-wider' },
        { text: 'Hochwertige Güter',           href: '/branchen/hochwertige-gueter' },
        { text: 'Kühlgut',                     href: '/branchen/kuehlgut' },
        { text: 'Intermodal',                  href: '/branchen/intermodal' },
        { text: 'Sonstige Transporte',         href: '/branchen/sonstige' },
      ],
    },
    { text: 'Preise',      href: '/preise' },
    { text: 'Förderung',   href: '/foerderung' },
    { text: 'Fallstudien', href: '/fallstudien/' },
    {
      text: 'Über uns',
      href: '#',
      links: [
        { text: 'Team',     href: '/team/' },
        { text: 'Karriere', href: '/karriere/' },
        { text: 'Kontakt',  href: '/kontakt/' },
      ],
    },
  ],
  actions: [
    { text: 'Beratung anfragen', href: '#consult' },
  ],
};

// EN navigation (prefixed with /en/)
export const headerDataEn = {
  links: [
    {
      text: 'Product',
      href: '/en/product',
    },
    {
      text: 'Use Cases',
      href: '#',
      links: [
        { text: 'Cargo Theft',              href: '/en/use-cases/cargo-theft' },
        { text: 'Diesel Theft',             href: '/en/use-cases/diesel-theft' },
        { text: 'Equipment Theft',          href: '/en/use-cases/equipment-theft' },
        { text: 'Operations Transparency',  href: '/en/use-cases/operations-transparency' },
        { text: 'Trailer Damage',           href: '/en/use-cases/trailer-damage' },
        { text: 'Driver Assaults',          href: '/en/use-cases/driver-assaults' },
        { text: 'Stationary Time',          href: '/en/use-cases/stationary-time-optimization' },
        { text: '—— Industries ——',         href: '#', class: 'nav-separator pointer-events-none opacity-50 text-xs uppercase tracking-wider' },
        { text: 'High-Value Cargo',         href: '/en/industries/high-value' },
        { text: 'Cooling Transports',       href: '/en/industries/cooling' },
        { text: 'Intermodal',               href: '/en/industries/intermodal' },
        { text: 'Other Transports',         href: '/en/industries/other' },
      ],
    },
    { text: 'Pricing',      href: '/en/pricing' },
    { text: 'Funding',      href: '/en/funding' },
    { text: 'Case Studies', href: '/en/case-studies/' },
    {
      text: 'About',
      href: '#',
      links: [
        { text: 'Team',    href: '/en/team/' },
        { text: 'Careers', href: '/en/careers/' },
        { text: 'Contact', href: '/en/contact/' },
      ],
    },
  ],
  actions: [
    { text: 'Book a consult', href: '#consult' },
  ],
};

// Legacy export kept for backward compat — Header.astro uses headerDataDe/En based on locale.
export const headerData = headerDataDe;

export const footerData = {
  links: [],
  secondaryLinks: [
    { text: 'Impressum',  href: '#' },
    { text: 'Datenschutz', href: '#' },
    { text: 'Aktuelles',  href: '/aktuelles/' },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/konvoi-gmbh' },
    { ariaLabel: 'RSS',      icon: 'tabler:rss',            href: getAsset('/aktuelles/rss.xml') },
  ],
  footNote: `© KONVOI GmbH · Alle Rechte vorbehalten.`,
};
