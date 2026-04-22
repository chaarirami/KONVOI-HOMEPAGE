# Phase 1: Foundation Scrub - Pattern Map

**Mapped:** 2026-04-22
**Files analyzed:** 10 files to modify + 19+ files to delete
**Analogs found:** 10 / 10 (all are self-referential — this phase modifies existing files, not creates new ones)

---

## Overview

Phase 1 is a pure scrub phase. Every "new" file is a rewrite of an existing file in-place. There are no
greenfield files to create. The pattern for each file IS the current file — stripped and replaced with
Konvoi-owned content. The table below records the before-state (the analog) and the exact lines each
rewrite must preserve vs. replace.

---

## File Classification

| File to Modify | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/config.yaml` | config | transform | itself (rewrite) | exact |
| `src/navigation.ts` | config | request-response | itself (rewrite) | exact |
| `src/layouts/Layout.astro` | layout | request-response | itself (patch) | exact |
| `src/layouts/PageLayout.astro` | layout | request-response | itself (patch) | exact |
| `astro.config.ts` | config | transform | itself (patch) | exact |
| `.github/workflows/actions.yaml` | config/CI | batch | itself (rewrite) | exact |
| `netlify.toml` | config | batch | itself (patch) | exact |
| `src/components/CustomStyles.astro` | component | transform | itself (patch) | exact |
| `src/components/common/Analytics.astro` | component | transform | itself (rewrite) | exact |
| `src/env.d.ts` | config | transform | itself (patch) | exact |
| `LICENSE.md` | docs | — | itself (overwrite) | exact |

---

## Pattern Assignments

### `src/config.yaml` (config, transform)

**Operation:** Full rewrite — replace all AstroWind values with Konvoi values.

**Current file** (`src/config.yaml`, lines 1-73) — full content read above.

**Preserve structure, replace values. Do NOT change YAML keys or nesting.**

Key replacements (line references from current file):

- Line 2: `name: AstroWind` → `name: Konvoi`
- Line 3: `site: 'https://astrowind.vercel.app'` → `site: 'https://www.konvoi.eu'`
- Line 7: `googleSiteVerificationId: orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M` → `googleSiteVerificationId: ''`
- Line 12: `default: AstroWind` → `default: Konvoi`
- Line 13: `template: '%s — AstroWind'` → `template: '%s — Konvoi'`
- Line 14: long emoji description → `'Konvoi — Security Tech Made in Germany'`
- Line 19: `site_name: AstroWind` → `site_name: Konvoi`
- Lines 26-27: `handle: '@arthelokyo'` / `site: '@arthelokyo'` → both `''`
- Line 31: `language: en` → `language: de`

**Lines to keep unchanged:** 4-6, 15-25, 28-30, 32-73 (blog config, analytics null, ui theme).

**Full replacement content** (from RESEARCH.md Section 9):
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
    template: '%s — Konvoi'
  description: 'Konvoi — Security Tech Made in Germany'
  robots:
    index: true
    follow: true
  openGraph:
    site_name: Konvoi
    images:
      - url: '~/assets/images/default.png'
        width: 1200
        height: 628
    type: website
  twitter:
    handle: ''
    site: ''
    cardType: summary_large_image

i18n:
  language: de
  textDirection: ltr

apps:
  blog:
    isEnabled: true
    postsPerPage: 6

    post:
      isEnabled: true
      permalink: '/%slug%'
      robots:
        index: true

    list:
      isEnabled: true
      pathname: 'blog'
      robots:
        index: true

    category:
      isEnabled: true
      pathname: 'category'
      robots:
        index: true

    tag:
      isEnabled: true
      pathname: 'tag'
      robots:
        index: false

    isRelatedPostsEnabled: true
    relatedPostsCount: 4

analytics:
  vendors:
    googleAnalytics:
      id: null

ui:
  theme: 'system'
```

---

### `src/navigation.ts` (config, request-response)

**Operation:** Full rewrite — strip all AstroWind links, replace with Konvoi shell.

**Current file** (`src/navigation.ts`, lines 1-183) — full content read above.

**Preserve:** TypeScript export pattern, `getAsset` import, `headerData`/`footerData` export names.

**Remove:** `getPermalink`, `getBlogPermalink` imports (will become unused after strip). All 5 `headerData.links` entries, all `headerData.actions`. All 4 `footerData.links` sections. `footerData.secondaryLinks` pointing to deleted pages. All social links except LinkedIn + RSS. `footerData.footNote` Arthelokyo credit.

**Current import line 1** (keep `getAsset`, remove others):
```typescript
import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';
```
Becomes:
```typescript
import { getAsset } from './utils/permalinks';
```

**Target state** (from RESEARCH.md Section 8):
```typescript
import { getAsset } from './utils/permalinks';

export const headerData = {
  links: [],
  actions: [],
  // Language switcher shell — non-functional, positioning only
  // LanguageSwitcher.astro will be built in Phase 3 (I18N-04)
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
```

**Risk:** After removing `getPermalink` and `getBlogPermalink` from the import, ESLint will pass because the stripped file no longer references them. Confirm with `pnpm run check`.

---

### `src/layouts/Layout.astro` (layout, request-response)

**Operation:** Patch — add Netlify context detection in frontmatter + conditional noindex meta in `<head>`.

**Current file** (`src/layouts/Layout.astro`, lines 1-48) — full content read above.

**Preserve:** All existing imports (lines 2-18), Props interface (lines 20-22), destructuring (lines 24-25), entire HTML structure (lines 28-48). Do NOT remove any existing component.

**Inject after line 25** (after `const { language, textDirection } = I18N;`):
```astro
const netlifyContext = import.meta.env.CONTEXT ?? process.env.CONTEXT ?? 'production';
const isNonProduction = netlifyContext === 'deploy-preview' || netlifyContext === 'branch-deploy';
```

**Inject after `<Analytics />` (line 37)** in the `<head>`:
```astro
{isNonProduction && <meta name="robots" content="noindex, nofollow" />}
```

**Result: `<head>` block becomes** (lines 30-41, patched):
```astro
<head>
  <CommonMeta />
  <Favicons />
  <CustomStyles />
  <ApplyColorMode />
  <Metadata {...metadata} />
  <SiteVerification />
  <Analytics />
  {isNonProduction && <meta name="robots" content="noindex, nofollow" />}

  <!-- Comment the line below to disable View Transitions -->
  <ClientRouter fallback="swap" />
</head>
```

**Do NOT touch:** `ApplyColorMode.astro` import/usage (fragile PR #646 fix — per CONTEXT.md).

---

### `src/layouts/PageLayout.astro` (layout, request-response)

**Operation:** Patch — remove `Announcement.astro` import and its usage. **Must be atomic with deletion of `Announcement.astro`.**

**Current file** (`src/layouts/PageLayout.astro`, lines 1-31) — full content read above.

**Remove line 5:**
```astro
import Announcement from '~/components/widgets/Announcement.astro';
```

**Remove lines 19-21** (the slot wrapper with `<Announcement />`):
```astro
  <slot name="announcement">
    <Announcement />
  </slot>
```

**Result after patch** (lines 1-28 compressed):
```astro
---
import Layout from '~/layouts/Layout.astro';
import Header from '~/components/widgets/Header.astro';
import Footer from '~/components/widgets/Footer.astro';

import { headerData, footerData } from '~/navigation';

import type { MetaData } from '~/types';

export interface Props {
  metadata?: MetaData;
}

const { metadata } = Astro.props;
---

<Layout metadata={metadata}>
  <slot name="header">
    <Header {...headerData} isSticky showRssFeed showToggleTheme />
  </slot>
  <main>
    <slot />
  </main>
  <slot name="footer">
    <Footer {...footerData} />
  </slot>
</Layout>
```

**Critical:** This file change and `src/components/widgets/Announcement.astro` deletion must be in the same commit. If split, `pnpm build` will fail with module-not-found error.

---

### `astro.config.ts` (config, transform)

**Operation:** Patch — remove `partytown` import + `hasExternalScripts`/`whenExternalScripts` block + `...whenExternalScripts(...)` spread. Replace `image.domains` array with empty array.

**Current file** (`astro.config.ts`, lines 1-88) — full content read above.

**Remove line 9:**
```typescript
import partytown from '@astrojs/partytown';
```

**Remove lines 20-22** (the `hasExternalScripts` flag and `whenExternalScripts` helper):
```typescript
const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];
```

**Remove lines 47-51** (the spread call inside `integrations`):
```typescript
    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),
```

**Replace line 72** (`image.domains` array):
```typescript
  image: {
    domains: ['cdn.pixabay.com', 'images.unsplash.com', 'plus.unsplash.com', 'img.shields.io'],
  },
```
Becomes:
```typescript
  image: {
    domains: [],
  },
```

**Also remove line 12** (now unused type import after `whenExternalScripts` removal):
```typescript
import type { AstroIntegration } from 'astro';
```

**Preserve:** All other imports (lines 1-8, 10-11, 13-16), all other integrations (sitemap, mdx, icon, compress, astrowind), markdown config, vite config, `output: 'static'`.

---

### `.github/workflows/actions.yaml` (CI config, batch)

**Operation:** Full rewrite — replace npm-based two-job workflow with pnpm single-job workflow + grep gate.

**Current file** (`.github/workflows/actions.yaml`, lines 1-42) — full content read above.

**Problems in current file:** `npm ci` (line 27, 40), `cache: npm` (lines 25, 38), Node matrix 18/20/22 (lines 16-19) — project requires Node 22+, two separate jobs.

**Full replacement** (from RESEARCH.md Section 4):
```yaml
name: CI

on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main

jobs:
  build-and-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Use Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type-check
        run: pnpm run check

      - name: Build
        run: pnpm run build

      - name: Check for AstroWind debris in dist/
        run: |
          if grep -riq "astrowind\|arthelokyo\|onwidget\|Unsplash\|Cupertino" \
               --include="*.html" --include="*.js" --include="*.css" dist/; then
            echo "ERROR: AstroWind debris detected in dist/"
            exit 1
          fi
          echo "Grep gate passed"
```

**Key decisions baked in:** `pnpm/action-setup@v4` (official), `version: 10` (matches project), `--frozen-lockfile` (prevents lockfile mutation in CI), single job (replaces two-job structure), Node 22 only (matches `engines` in `package.json`).

---

### `netlify.toml` (config, batch)

**Operation:** Patch — fix build command (`npm` → `pnpm`), add `[context.branch-deploy]` no-op block.

**Current file** (`netlify.toml`, lines 1-9) — full content read above.

**Replace line 3** (`command = "npm run build"` → `command = "pnpm run build"`).

**Add after `[build.processing.html]` block**, before `[[headers]]`:
```toml
# Only deploy main branch as a branch deploy.
# All other branches only get a Deploy Preview when a PR is opened.
[context.branch-deploy]
  command = "echo 'Branch deploy disabled — open a PR for a Deploy Preview'"
```

**Full replacement file** (from RESEARCH.md Section 6):
```toml
[build]
  publish = "dist"
  command = "pnpm run build"

[build.processing.html]
  pretty_urls = false

# Only deploy main branch as a branch deploy.
# All other branches only get a Deploy Preview when a PR is opened.
[context.branch-deploy]
  command = "echo 'Branch deploy disabled — open a PR for a Deploy Preview'"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**Note:** True branch restriction also requires a manual Netlify UI step (Site > Site configuration > Build & deploy > Branches > Branch deploys > "None"). The `netlify.toml` change alone is not sufficient.

---

### `src/components/CustomStyles.astro` (component, transform)

**Operation:** Patch — remove `@fontsource-variable/inter` import (line 2), replace font CSS custom properties with system-font fallbacks. Preserve all color custom properties.

**Current file** (`src/components/CustomStyles.astro`, lines 1-63) — full content read above.

**Remove line 2:**
```astro
import '@fontsource-variable/inter';
```

**Remove lines 4-18** (commented-out alternative font list — dead code, clean up).

**Replace font variables** in `:root` block (lines 24-26):
```css
    --aw-font-sans: 'Inter Variable';
    --aw-font-serif: 'Inter Variable';
    --aw-font-heading: 'Inter Variable';
```
Becomes:
```css
    /* Fonts — Phase 2 will replace with Montserrat + PT Serif (BRAND-01) */
    --aw-font-sans: system-ui, sans-serif;
    --aw-font-serif: Georgia, serif;
    --aw-font-heading: system-ui, sans-serif;
```

**Same replacement in `.dark` block** (lines 45-47):
```css
    --aw-font-sans: 'Inter Variable';
    --aw-font-serif: 'Inter Variable';
    --aw-font-heading: 'Inter Variable';
```
Becomes:
```css
    /* Fonts — Phase 2 will replace with Montserrat + PT Serif (BRAND-01) */
    --aw-font-sans: system-ui, sans-serif;
    --aw-font-serif: Georgia, serif;
    --aw-font-heading: system-ui, sans-serif;
```

**Preserve:** All `--aw-color-*` properties unchanged (Phase 2 overwrites them; Phase 1 must not break the build).

**Result: frontmatter becomes empty:**
```astro
---
// Font imports will be added in Phase 2 (BRAND-01)
---
```

---

### `src/components/common/Analytics.astro` (component, transform)

**Operation:** Full rewrite — replace `@astrolib/analytics` GoogleAnalytics component with empty stub.

**Current file** (`src/components/common/Analytics.astro`, lines 1-13) — full content read above.

**Full replacement** (from RESEARCH.md Section 7):
```astro
---
// Analytics placeholder — Plausible snippet will be added in Phase 7 (SEO-05)
---
```

**Why stub not delete:** `src/layouts/Layout.astro` line 12 imports `Analytics` unconditionally. Deleting the file without keeping the stub would break the build. The stub satisfies the import while removing the `@astrolib/analytics` dependency.

---

### `src/env.d.ts` (config, transform)

**Operation:** Patch — remove line 7 (`declare module '@fontsource-variable/inter'`).

**Current file** (`src/env.d.ts`, lines 1-7) — full content read above.

**Remove line 7:**
```typescript
declare module '@fontsource-variable/inter';
```

**Preserve lines 1-5** (triple-slash references — load-bearing for Astro/Vite/vendor type resolution):
```typescript
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="../vendor/integration/types.d.ts" />
```

**Note:** TypeScript does not error if you `declare module` for a package that doesn't exist, but it is dead code after `@fontsource-variable/inter` is removed. Remove it for correctness.

---

### `LICENSE.md` (docs, —)

**Operation:** Full overwrite — replace MIT license with proprietary notice.

**Current file** (`LICENSE.md`, lines 1-22) — MIT License, Copyright onWidget.

**Full replacement** (per D-03):
```
Copyright © 2025–2026 Konvoi GmbH. All rights reserved. Unauthorized copying, modification, or distribution of this software is strictly prohibited without prior written consent from Konvoi GmbH.
```

---

## Deletion Inventory (no pattern needed — delete only)

These files/directories are deleted outright. No replacement content. No import cascade beyond `Announcement.astro` (handled above).

| Path | Reason |
|---|---|
| `src/pages/index.astro` | D-01 |
| `src/pages/about.astro` | D-01 |
| `src/pages/contact.astro` | D-01 |
| `src/pages/pricing.astro` | D-01 |
| `src/pages/services.astro` | D-02 |
| `src/pages/privacy.md` | Claude's Discretion |
| `src/pages/terms.md` | Claude's Discretion |
| `src/pages/homes/` (4 files) | FND-01 |
| `src/pages/landing/` (6 files) | FND-01 |
| `src/data/post/*.md` (4 files) | FND-01 |
| `src/data/post/*.mdx` (2 files) | FND-01 |
| `public/decapcms/` (2 files) | FND-03 |
| `src/components/widgets/Announcement.astro` | D-04 — **atomic with PageLayout.astro patch** |

---

## Shared Patterns

### pnpm-only rule
**Source:** `package.json` (project memory + CLAUDE.md)
**Apply to:** All workflow files, all README/doc references, `netlify.toml`
- Use `pnpm install --frozen-lockfile` (not `npm ci`)
- Use `pnpm run build` / `pnpm run check` (not `npm run`)
- Never add `package-lock.json`; always `pnpm-lock.yaml`

### `~/` path alias
**Source:** `astro.config.ts` lines 83-85
**Apply to:** All `.astro` and `.ts` file imports in `src/`
```typescript
resolve: {
  alias: {
    '~': path.resolve(__dirname, './src'),
  },
},
```
All internal imports use `~/` prefix (e.g., `~/components/`, `~/layouts/`, `~/utils/`).

### Astro frontmatter convention
**Source:** `src/layouts/Layout.astro` lines 1-26, `src/layouts/PageLayout.astro` lines 1-16
All `.astro` files: imports in frontmatter fence (`---`), TypeScript, Props interface exported, destructure from `Astro.props`.

### `astrowind:config` virtual module
**Source:** `vendor/integration/` (load-bearing — do not rename)
**Apply to:** Any file reading config (currently `Layout.astro` via `I18N`, `Analytics.astro` via `ANALYTICS`)
Pattern: `import { I18N } from 'astrowind:config';` — virtual module resolved by Vite at build time; string never appears in `dist/`.

### Tailwind v4 CSS-first
**Source:** `src/assets/styles/tailwind.css`
No `tailwind.config.js` — all theme customization via `@theme`, `@utility`, `@custom-variant` in CSS. CSS custom properties (`--aw-*`) in `CustomStyles.astro` feed into Tailwind tokens.

---

## Package Removal Order (FND-04)

The safe sequence to avoid broken-import build failures:

1. Edit source files to remove all usages (steps above for `CustomStyles.astro`, `Analytics.astro`, `astro.config.ts`, `env.d.ts`)
2. Run `pnpm run check` — confirm 0 errors
3. Run `pnpm remove @fontsource-variable/inter @astrolib/analytics @astrojs/partytown`
4. Run `pnpm run build` — confirm clean build
5. Run grep gate manually: `grep -riq "astrowind|arthelokyo|onwidget|Unsplash|Cupertino" --include="*.html" --include="*.js" --include="*.css" dist/`

---

## No Analog Found

Not applicable — Phase 1 has no greenfield files. All operations are in-place rewrites or deletions of existing files. The planner does not need to consult RESEARCH.md for external pattern references; all patterns are derived directly from the existing files documented above.

---

## Metadata

**Analog search scope:** `src/layouts/`, `src/components/`, `src/`, `.github/workflows/`, root config files
**Files read:** 11 source files (Layout.astro, PageLayout.astro, navigation.ts, astro.config.ts, config.yaml, netlify.toml, actions.yaml, CustomStyles.astro, Analytics.astro, env.d.ts, LICENSE.md)
**Pattern extraction date:** 2026-04-22
