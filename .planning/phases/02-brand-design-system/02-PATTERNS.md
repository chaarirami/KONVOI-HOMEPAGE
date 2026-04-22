# Phase 2: Brand & Design System - Pattern Map

**Mapped:** 2026-04-22
**Files analyzed:** 7 (1 create, 6 modify)
**Analogs found:** 6 / 7 (1 no analog)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/components/CustomStyles.astro` | component | static-config | `src/components/Favicons.astro` | role-match |
| `src/assets/styles/tailwind.css` | config | static-config | `src/assets/styles/tailwind.css` (self) | self-reference |
| `src/assets/favicons/` | asset | static-file | `src/components/Favicons.astro` | role-match |
| `src/assets/images/logo` | asset | static-file | `src/components/Logo.astro` | role-match |
| `src/data/brand/canonical.yaml` | data | static-config | `src/config.yaml` | exact |
| `src/data/brand/voice.md` | data | static-config | `src/data/post/*.mdx` | partial |
| `package.json` | config | dependency | `package.json` (self) | self-reference |

## Pattern Assignments

### `src/components/CustomStyles.astro` (component, static-config)

**Analog:** `src/components/Favicons.astro` (shows import pattern for assets) + current `src/components/CustomStyles.astro` (shows CSS custom property structure)

**Current imports pattern** (lines 1-3):
```astro
---
// Font imports will be added in Phase 2 (BRAND-01)
---
```

**Current CSS structure** (lines 5-48):
```astro
<style is:inline>
  :root {
    /* Fonts -- Phase 2 will replace with Montserrat + PT Serif (BRAND-01) */
    --aw-font-sans: system-ui, sans-serif;
    --aw-font-serif: Georgia, serif;
    --aw-font-heading: system-ui, sans-serif;

    --aw-color-primary: rgb(1 97 239);
    --aw-color-secondary: rgb(1 84 207);
    --aw-color-accent: rgb(109 40 217);

    --aw-color-text-heading: rgb(0 0 0);
    --aw-color-text-default: rgb(16 16 16);
    --aw-color-text-muted: rgb(16 16 16 / 66%);
    --aw-color-bg-page: rgb(255 255 255);

    --aw-color-bg-page-dark: rgb(3 6 32);

    ::selection {
      background-color: lavender;
    }
  }

  .dark {
    /* Fonts -- Phase 2 will replace with Montserrat + PT Serif (BRAND-01) */
    --aw-font-sans: system-ui, sans-serif;
    --aw-font-serif: Georgia, serif;
    --aw-font-heading: system-ui, sans-serif;

    --aw-color-primary: rgb(1 97 239);
    --aw-color-secondary: rgb(1 84 207);
    --aw-color-accent: rgb(109 40 217);

    --aw-color-text-heading: rgb(247, 248, 248);
    --aw-color-text-default: rgb(229 236 246);
    --aw-color-text-muted: rgb(229 236 246 / 66%);
    --aw-color-bg-page: rgb(3 6 32);

    ::selection {
      background-color: black;
      color: snow;
    }
  }
</style>
```

**Pattern:** Replace RGB values with HSL values from CONTEXT.md D-02 (light mode) and D-03 (dark mode). Update font family variables to reference `'Montserrat'` and `'PT Serif'` from `@fontsource` packages. Maintain `:root` and `.dark` structure with matching keys for both light and dark modes.

---

### `src/assets/styles/tailwind.css` (config, static-config)

**Analog:** Current file (self-reference, already established pattern)

**Current imports and structure** (lines 1-35):
```css
@import 'tailwindcss';

@plugin '@tailwindcss/typography';

@custom-variant dark (&:where(.dark, .dark *));
@custom-variant intersect (&:not([no-intersect]));

@theme {
  --color-primary: var(--aw-color-primary);
  --color-secondary: var(--aw-color-secondary);
  --color-accent: var(--aw-color-accent);
  --color-default: var(--aw-color-text-default);
  --color-muted: var(--aw-color-text-muted);

  --font-sans:
    var(--aw-font-sans, ui-sans-serif), ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji';
  --font-serif: var(--aw-font-serif, ui-serif), ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
  --font-heading:
    var(--aw-font-heading, ui-sans-serif), ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji';

  --animate-fade: fadeInUp 1s both;

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(2rem);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

**Pattern for font imports** (to add at top before `@import 'tailwindcss'`):
```css
@import '@fontsource/montserrat/400.css';
@import '@fontsource/montserrat/500.css';
@import '@fontsource/montserrat/600.css';
@import '@fontsource/montserrat/700.css';

@import '@fontsource/pt-serif/400.css';
@import '@fontsource/pt-serif/700.css';
```

**Critical pattern to preserve** (line 5):
```css
@custom-variant dark (&:where(.dark, .dark *));
```
This line is **load-bearing for dark mode** (PR #646). Keep with comment per CONTEXT.md BRAND-04. Do NOT remove or modify.

**Pattern:** Add @fontsource imports at the very top, before `@import 'tailwindcss'`. Preserve all existing `@theme` token mappings and `@custom-variant dark` line with its comment intact.

---

### `src/assets/favicons/` (asset, static-file)

**Analog:** `src/components/Favicons.astro` (shows how favicons are imported and referenced)

**Import pattern** (lines 1-5):
```astro
---
import favIcon from '~/assets/favicons/favicon.ico';
import favIconSvg from '~/assets/favicons/favicon.svg';
import appleTouchIcon from '~/assets/favicons/apple-touch-icon.png';
---
```

**Reference pattern** (lines 7-10):
```astro
<link rel="shortcut icon" href={favIcon} />
<link rel="icon" type="image/svg+xml" href={favIconSvg.src} />
<link rel="mask-icon" href={favIconSvg.src} color="#8D46E7" />
<link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon.src} />
```

**Pattern:** Replace three favicon files in `src/assets/favicons/`:
- `favicon.svg` (SVG format, optimized)
- `favicon.ico` (ICO format for legacy browsers)
- `apple-touch-icon.png` (180x180 PNG for iOS home screen)

All files are imported and referenced in the existing `src/components/Favicons.astro` component. No changes to that component needed — only replace the binary asset files themselves.

---

### `src/assets/images/logo` (asset, static-file)

**Analog:** `src/components/Logo.astro` (shows how logo is referenced)

**Current logo pattern** (lines 5-9):
```astro
<span
  class="self-center ml-2 rtl:ml-0 rtl:mr-2 text-2xl md:text-xl font-bold text-gray-900 whitespace-nowrap dark:text-white"
>
  🚀 {SITE?.name}
</span>
```

**Pattern:** The `Logo.astro` component currently renders the site name as text. Phase 2 should replace the emoji with an actual Konvoi logo image. The asset pattern follows Astro's standard image import convention:

```astro
---
import logo from '~/assets/images/logo.svg';
---

<img src={logo.src} alt="Konvoi Logo" />
```

Replace or create logo image file in `src/assets/images/` (e.g., `logo.svg` or `logo.png`). The filename should be referenced in `Logo.astro` component (separate from Phase 2 scope if Logo.astro modifications deferred).

---

### `src/data/brand/canonical.yaml` (data, static-config)

**Analog:** `src/config.yaml` (shows YAML structure and Astro data loading pattern)

**Current config pattern** (src/config.yaml, lines 1-10):
```yaml
site:
  name: Konvoi
  site: 'https://www.konvoi.eu'
  base: '/'
  trailingSlash: false

  googleSiteVerificationId: ''

metadata:
  title:
    default: Konvoi
```

**Astro config loading pattern** (shows how config is exposed to components via `astrowind:config` virtual module):

From `src/components/widgets/Footer.astro` (lines 1-4):
```astro
---
import { Icon } from 'astro-icon/components';
import { SITE } from 'astrowind:config';
import { getHomePermalink } from '~/utils/permalinks';
```

**Pattern for canonical.yaml:** Create new YAML file in `src/data/brand/` following flat, import-friendly structure. Based on RESEARCH.md Code Example 4, structure should be:

```yaml
legal:
  entity: KONVOI GmbH
  address: Harburger Schlossstraße 6-12, 21079 Hamburg, Germany
  phone: +49 40 766293660
  emails:
    customer: justus@konvoi.eu
    marketing: heinz@konvoi.eu
    general: info@konvoi.eu
    applications: applications@konvoi.eu

pricing:
  tiers:
    - slug: standard
      de_name: Standard
      en_name: Standard
      de_price_display: "ab X EUR / Monat"
      en_price_display: "from X EUR / month"
    - slug: camera-module
      de_name: "+ KONVOI Camera Module"
      en_name: "+ KONVOI Camera Module"
    - slug: logbook
      de_name: "+ KONVOI Logbook"
      en_name: "+ KONVOI Logbook"
```

**Usage pattern:** Once created, load into components via standard Astro data import (not yet integrated into `astrowind:config` — may require vendor/integration changes or direct import from `~/data/brand/canonical.yaml`).

---

### `src/data/brand/voice.md` (data, static-config)

**Analog:** `src/data/post/*.mdx` (shows Markdown content structure in data directory)

**Data post pattern** (structure from RESEARCH.md example):

```markdown
# src/data/brand/voice.md

## Konvoi Brand Voice

### Preventive vs. Reactive Positioning

KONVOI is "the first **preventive** solution for your fleet." This means:

**Approved verbs:**
- prevent, anticipate, secure, detect, classify, deter, enable
- "We prevent cargo theft" (not "We alert you to theft")

**Banned verbs:**
- respond, react, alert (implies reactive, not preventive)
- avoid, react-after, "respond to alerts"

### Tone
- Professional, confident in German engineering (Hamburg-based)
- B2B direct language (no hype, no marketing fluff)
- Data-driven when possible (€8B/yr theft market, 80% de-minimis subsidy)

### Example copy transformations

**Instead of:** "Our system alerts you when theft is detected"
**Say:** "Our system **detects and prevents** cargo theft with AI classification"

**Instead of:** "Respond quickly to security threats"
**Say:** "Anticipate threats and secure your fleet proactively"
```

**Pattern:** Markdown file with H2 section headers (Voice principles, Tone, Examples). No frontmatter required unless components will parse it. Can be imported as raw markdown text into components for copy reference.

---

### `package.json` (config, dependency)

**Analog:** Current `package.json` structure

**Current dependency pattern** (lines 24-34):
```json
"dependencies": {
  "@astrojs/rss": "^4.0.18",
  "@astrojs/sitemap": "^3.7.2",
  "@astrolib/seo": "^1.0.0-beta.8",
  "astro": "^6.1.8",
  "astro-embed": "^0.13.0",
  "astro-icon": "^1.1.5",
  "limax": "^4.2.3",
  "lodash.merge": "^4.6.2",
  "unpic": "^4.2.2"
}
```

**Pattern for adding @fontsource packages:**

Add two new entries to `dependencies` section (maintain alphabetical order within section):

```json
"dependencies": {
  "@astrojs/rss": "^4.0.18",
  "@astrojs/sitemap": "^3.7.2",
  "@astrolib/seo": "^1.0.0-beta.8",
  "@fontsource/montserrat": "^5.2.8",
  "@fontsource/pt-serif": "^5.2.8",
  "astro": "^6.1.8",
  ...
}
```

**Versions verified** (2026-04-22 from npm registry):
- `@fontsource/montserrat@5.2.8` (published 2025-12-10)
- `@fontsource/pt-serif@5.2.8` (published 2025-12-10)

**Installation command:** `pnpm add @fontsource/montserrat@^5.2.8 @fontsource/pt-serif@^5.2.8`

---

## Shared Patterns

### CSS Custom Property Structure

**Source:** `src/components/CustomStyles.astro`
**Apply to:** All components using colour tokens
**Pattern:**
```astro
<style is:inline>
  :root {
    /* Define all tokens for light mode */
    --aw-color-primary: hsl(...);
    --aw-color-secondary: hsl(...);
  }

  .dark {
    /* Define matching tokens for dark mode */
    --aw-color-primary: hsl(...);
    --aw-color-secondary: hsl(...);
  }
</style>
```

**Key rule:** Always define tokens in both `:root` and `.dark` blocks with matching keys. Light mode uses lighter/brighter HSL values; dark mode uses darker/dimmer values.

### Tailwind @theme Token Mapping

**Source:** `src/assets/styles/tailwind.css` (lines 8-21)
**Apply to:** All colour and font tokens
**Pattern:**
```css
@theme {
  --color-primary: var(--aw-color-primary);
  --color-secondary: var(--aw-color-secondary);

  --font-sans: var(--aw-font-sans, fallback), fallback;
  --font-serif: var(--aw-font-serif, fallback), fallback;
  --font-heading: var(--aw-font-heading, fallback), fallback;
}
```

**Key rule:** Reference CSS custom properties from `CustomStyles.astro` using `var(--aw-*)` syntax. Include sensible fallbacks for fonts (emoji fallbacks, system fonts). This generates Tailwind utilities automatically (`bg-primary`, `text-secondary`, `font-sans`, etc.).

### Dark Mode Preservation

**Source:** `src/assets/styles/tailwind.css` (line 5)
**Apply to:** All CSS files that define dark mode
**Pattern (CRITICAL — do NOT modify):**
```css
@custom-variant dark (&:where(.dark, .dark *));
```

**Reason:** This line was fragile before Phase 1 (PR #646 flicker prevention). It must remain exactly as written with comment pinning it for dark mode stability.

### Font Import Order

**Source:** RESEARCH.md Code Example 1 + CONTEXT.md D-05, D-06, D-07
**Apply to:** `src/assets/styles/tailwind.css`
**Pattern:**
```css
/* BEFORE @import 'tailwindcss' */
@import '@fontsource/montserrat/400.css';
@import '@fontsource/montserrat/500.css';
@import '@fontsource/montserrat/600.css';
@import '@fontsource/montserrat/700.css';

@import '@fontsource/pt-serif/400.css';
@import '@fontsource/pt-serif/700.css';

@import 'tailwindcss';
```

**Key rule:** Font imports MUST come before `@import 'tailwindcss'`. This ensures fonts are available in the cascade before utilities are generated. Import only weights specified (400/500/600/700 for Montserrat; 400/700 for PT Serif).

### Asset Import Pattern

**Source:** `src/components/Favicons.astro` (lines 1-5)
**Apply to:** All static assets (favicons, logo, images)
**Pattern:**
```astro
---
import assetName from '~/assets/path/to/file.ext';
---

<link rel="type" href={assetName.src} />
<!-- or for images: -->
<img src={assetName.src} alt="description" />
```

**Key rule:** Import assets in Astro component frontmatter using `~/` alias. Reference via `.src` property for proper build-time optimization.

---

## No Analog Found

No files in Phase 2 lack analogs. All work follows established patterns:

- CustomStyles.astro: existing component with CSS var structure
- tailwind.css: existing config file with proven @theme pattern
- Favicons: existing import/reference pattern in Favicons.astro
- Logo asset: existing Logo.astro component structure
- Data files (YAML, MD): follow Astro data directory conventions (src/config.yaml, src/data/post/)
- package.json: standard npm dependency structure

---

## Metadata

**Analog search scope:** 
- `src/components/**/*.astro` (52 files scanned)
- `src/assets/**/*` (tailwind.css, favicons directory)
- `src/data/**/*` (post directory for reference)
- Project configuration files (package.json, astro.config.ts, src/config.yaml)

**Files scanned:** 60+

**Pattern extraction date:** 2026-04-22

**Confidence:** HIGH — Phase 2 uses existing Astro component patterns, established Tailwind v4 CSS-first conventions, and standard asset handling. No novel patterns required.

