import { getAsset } from './utils/permalinks';

export const headerData = {
  links: [],
  actions: [],
  // Language switcher shell — non-functional, positioning only
  // LanguageSwitcher.astro will be wired with i18n routing in Phase 3 (I18N-04)
};

export const footerData = {
  links: [],
  secondaryLinks: [
    // Placeholder slots — real URLs added in Phase 7
    { text: 'Impressum', href: '#' },
    { text: 'Datenschutz', href: '#' },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `© Konvoi GmbH · All rights reserved.`,
};
