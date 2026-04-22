# Research: Phase 1 — Foundation Scrub

**Researched:** 2026-04-22
**Domain:** AstroWind template removal, CI hardening, Netlify config, pnpm migration
**Confidence:** HIGH — all findings verified directly from source files in this repo

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Delete `index.astro`, `about.astro`, `contact.astro`, `pricing.astro` entirely. Site shows 404 on these routes until Phase 4+ rebuilds them.
- **D-02:** Delete `services.astro` permanently. No Konvoi requirement references a services page.
- **D-03:** Replace `LICENSE.md` with: "Copyright © 2025–2026 Konvoi GmbH. All rights reserved. Unauthorized copying, modification, or distribution of this software is strictly prohibited without prior written consent from Konvoi GmbH."
- **D-04:** Delete `Announcement.astro` entirely.
- **D-05:** Strip `src/navigation.ts` footer to bare minimum — remove all ~22 `#` placeholder sections. Keep only `© Konvoi GmbH` credit line and placeholder slots for Impressum/Datenschutz.
- **D-06:** Strip header nav to Konvoi logo + non-functional DE/EN language switcher shell. No nav links until pages exist.

### Claude's Discretion
- CI grep gate implementation (FND-08) — approach is open
- Netlify context detection for `noindex` (FND-09)
- `astro.config.ts` `image.domains` cleanup (FND-06)
- `src/config.yaml` replacement values
- Package removal order for `@astrolib/analytics`, `@astrojs/partytown`, `@fontsource-variable/inter`
- GitHub Actions pnpm rewrite (FND-07)
- `privacy.md` and `terms.md` — delete alongside other placeholder pages
- `vendor/integration/` `astrowind:config` naming — leave as-is in Phase 1

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FND-01 | Delete all AstroWind demo scaffolding | Section 1: full file inventory verified from source |
| FND-02 | Remove AstroWind branding from `src/config.yaml` | Section 9: exact line numbers and replacement values |
| FND-03 | Remove `public/decapcms/` | Section 1: directory confirmed present |
| FND-04 | Remove `@astrolib/analytics`, `@astrojs/partytown`, `@fontsource-variable/inter` | Section 7: import chain mapped |
| FND-05 | Replace `LICENSE.md` | Section 1: current file confirmed MIT © onWidget |
| FND-06 | Trim `astro.config.ts` `image.domains` | Section 9: exact current values verified |
| FND-07 | Replace `.github/workflows/actions.yaml` to use pnpm | Section 4: current workflow content verified |
| FND-08 | Post-build grep CI gate | Section 3: implementation pattern specified |
| FND-09 | Netlify context-aware `<meta name="robots">` | Section 5: Netlify env var pattern specified |
| FND-10 | Branch deploy policy — `main` only | Section 6: netlify.toml pattern specified |
</phase_requirements>

---

## Summary

Phase 1 is a pure-deletion and configuration-replacement phase. There is no new feature code to write — every task is either a file deletion, a config value change, or a CI workflow rewrite. The repo is a clean Astro 6 + Tailwind 4 + pnpm project where 100% of public-facing content is still AstroWind demo scaffolding.

The three highest-risk operations are: (1) package removal for `@astrolib/analytics` — its import in `Analytics.astro` must be replaced with an empty stub before `pnpm remove`; (2) `Announcement.astro` deletion — `PageLayout.astro` imports it unconditionally, so the import line must be removed in the same commit; (3) the `image.domains` cleanup — once external image hosts are removed from `astro.config.ts`, any remaining page that references an external image URL will cause a build error, which is actually the desired behavior (fail loudly if any demo page that uses Unsplash is missed).

After all deletions, the site will have exactly one rendered page (`404.astro`) plus the blog dynamic route tree. `pnpm build` must succeed, `pnpm check` must pass, and the grep gate must find zero matches for the banned string set.

---

## 1. AstroWind Debris Inventory

### Pages to Delete

**Directory deletions (safe — no other code imports from these):**
```
src/pages/homes/           (4 files: saas.astro, startup.astro, mobile-app.astro, personal.astro)
src/pages/landing/         (6 files: lead-generation.astro, sales.astro, click-through.astro,
                                      product.astro, pre-launch.astro, subscription.astro)
```

**Individual page deletions (per D-01, D-02):**
```
src/pages/index.astro
src/pages/about.astro
src/pages/contact.astro
src/pages/pricing.astro
src/pages/services.astro
src/pages/privacy.md       (per Claude's Discretion — delete, rebuild in Phase 7 as Datenschutz)
src/pages/terms.md         (per Claude's Discretion — delete, rebuild in Phase 7 as Impressum)
```

**Demo blog corpus:**
```
src/data/post/astrowind-template-in-depth.mdx
src/data/post/get-started-website-with-astro-tailwind-css.md
src/data/post/how-to-customize-astrowind-to-your-brand.md
src/data/post/landing.md
src/data/post/markdown-elements-demo-post.mdx
src/data/post/useful-resources-to-create-websites.md
```

**Other directories/files:**
```
public/decapcms/           (index.html + config.yml — FND-03)
```

### Components to Delete

```
src/components/widgets/Announcement.astro   (per D-04)
```

**Cascade:** `src/layouts/PageLayout.astro` imports `Announcement` at line 5 and uses it at line 20. Both the import statement and the `<Announcement />` usage (wrapped in `<slot name="announcement">`) must be removed in the same commit as the file deletion. Failure to do this will cause a build error: `Cannot find module '~/components/widgets/Announcement.astro'`.

### Files to Rewrite (not delete)

```
src/config.yaml            — replace AstroWind values with Konvoi values (FND-02)
src/navigation.ts          — strip to Konvoi shell (D-05, D-06)
LICENSE.md                 — replace with proprietary notice (D-03, FND-05)
astro.config.ts            — remove image.domains entries + partytown import (FND-06, FND-04)
.github/workflows/actions.yaml  — rewrite for pnpm (FND-07)
netlify.toml               — add branch policy + fix build command (FND-10)
src/layouts/PageLayout.astro    — remove Announcement import and usage
src/components/CustomStyles.astro  — remove @fontsource-variable/inter import (FND-04)
src/components/common/Analytics.astro  — replace @astrolib/analytics import (FND-04)
src/env.d.ts               — remove `declare module '@fontsource-variable/inter'` (line 7)
```

---

## 2. Build Integrity: What Breaks After Deletions

### Dependency chain for deleted pages

Deleted pages (`homes/`, `landing/`, `index.astro`, etc.) import widgets (`Hero`, `Features`, `Pricing`, etc.) but those widgets are **not** imported exclusively by the deleted pages — other pages and the blog tree also reference them. Deleting the pages is safe; the components remain.

The only reverse-dependency risk is this: **nothing imports the demo pages** — file-based routing means pages stand alone. Deleting them just removes the routes. No component or layout imports them by path. Confirmed by grep: no `import` statement in `src/` references `homes/`, `landing/`, `about.astro`, `services.astro`, `pricing.astro`, or `contact.astro`.

### The one real cascade: Announcement.astro

`src/layouts/PageLayout.astro` lines 5 and 20:
```astro
import Announcement from '~/components/widgets/Announcement.astro';
...
<slot name="announcement">
  <Announcement />
</slot>
```

Delete `Announcement.astro` without updating `PageLayout.astro` → build fails with module-not-found error. **These two changes must ship in a single atomic commit.**

### After image.domains is cleared

`astro.config.ts` currently has:
```ts
image: {
  domains: ['cdn.pixabay.com', 'images.unsplash.com', 'plus.unsplash.com', 'img.shields.io'],
},
```

Once demo pages using Unsplash/Pixabay images are deleted, there are no remaining consumers of these domains. Setting `domains: []` (or removing the `image` block entirely) is safe after the demo pages are gone. The `img.shields.io` entry was exclusively consumed by `Announcement.astro` (the GitHub stars badge). Deleting `Announcement.astro` removes its only consumer. **Recommended:** Remove the entire `image.domains` array — Konvoi will only use locally-imported `~/assets/images/` assets in Phase 1.

### Blog route tree

`src/pages/[...blog]/` remains intact. After deleting all 6 demo posts from `src/data/post/`, the blog list page will render empty (0 posts). This is acceptable — the route still builds without error because `getStaticPaths` returns empty arrays when no posts exist. The RSS endpoint (`src/pages/rss.xml.ts`) also renders with 0 items. No build error.

### `pnpm check` after deletions

`pnpm check` runs `astro check + eslint + prettier`. After deletions:
- `astro check` will error if any remaining `.astro` file has a broken import (e.g., if `PageLayout.astro` still imports deleted `Announcement.astro`). Must be fixed before `pnpm check` passes.
- `eslint` will warn on unused imports if `navigation.ts` still exports links to deleted routes — those get cleaned up as part of D-05/D-06.
- No TS errors expected from page deletions themselves (pages don't export types).

---

## 3. CI Grep Gate Implementation (FND-08)

### Banned strings
Per FND-08 requirement: `astrowind`, `arthelokyo`, `onwidget`, `Unsplash`, `Cupertino`

### Recommended implementation: inline shell step in GitHub Actions

Add a step after `pnpm run build` in the workflow:

```yaml
- name: Check for AstroWind debris in dist/
  run: |
    BANNED="astrowind\|arthelokyo\|onwidget\|Unsplash\|Cupertino"
    if grep -r --include="*.html" --include="*.js" --include="*.css" \
         -l -i "${BANNED}" dist/; then
      echo "ERROR: AstroWind debris found in dist/ — build rejected"
      exit 1
    fi
    echo "Grep gate passed — no AstroWind debris found"
```

**Design decisions:**
- `-i` flag: case-insensitive match catches `AstroWind`, `astrowind`, `ASTROWIND`, etc.
- `-l` flag: list only filenames on first match, then exit — faster than scanning every byte
- `--include` filters: target only HTML/JS/CSS output files; skip source maps (`.map`) and the `_astro/` hashed asset filenames which may contain unrelated strings
- `exit 1` propagates a non-zero exit code which GitHub Actions treats as a step failure → job failure → PR is blocked

**Alternative: `grep -rq` (quiet) pattern:**
```yaml
- name: Check for AstroWind debris in dist/
  run: |
    if grep -riq "astrowind\|arthelokyo\|onwidget\|Unsplash\|Cupertino" \
         --include="*.html" --include="*.js" --include="*.css" dist/; then
      echo "ERROR: AstroWind debris detected"
      exit 1
    fi
```

The `-q` (quiet) version is slightly cleaner for CI logs — it exits 0 as soon as a match is found (or not).

**Placement:** This step runs after `pnpm run build` completes. The `dist/` directory is populated by the build step. The grep gate is a separate step within the same job — it does not need its own job.

**Note on `astrowind` in source vs dist:** The `vendor/integration/index.ts` file contains `astrowind:config` as a virtual module ID string. This string does NOT appear in the `dist/` output — Vite resolves virtual modules at build time and their IDs never leak to the output bundle. The grep gate on `dist/` only is therefore safe; no false positives expected from the virtual module.

---

## 4. GitHub Actions pnpm Pattern (FND-07)

### Current workflow: `.github/workflows/actions.yaml`

Problems with the current workflow:
1. Uses `npm ci` (not pnpm)
2. Uses `actions/setup-node` with `cache: npm` (wrong cache key)
3. Tests Node 18, 20, 22 in a matrix — project `engines` in `package.json` requires `^22.0.0 || >=24.0.0`, so Node 18 and 20 will fail `pnpm install` with an engines error
4. Has a `check` job that also uses `npm ci`

### Replacement workflow

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

**Key decisions:**
- `pnpm/action-setup@v4` is the official pnpm GitHub Action [VERIFIED: github.com/pnpm/action-setup]
- `version: 10` matches the project's pnpm usage (memory: `pnpm` is the package manager, v10)
- `cache: pnpm` in `setup-node` caches the pnpm store, keyed on `pnpm-lock.yaml`
- `--frozen-lockfile` prevents silent lockfile mutations in CI
- Single job replaces the two-job (build + check) structure — simpler, saves runner minutes
- Node matrix removed — project only supports Node 22+, no value in testing Node 18/20
- The grep gate step is inlined here (same job, runs after build)

**Why `pnpm/action-setup` not `corepack`:** Both work. `pnpm/action-setup` is more explicit and version-pinned; corepack relies on the `packageManager` field in `package.json` (which this project doesn't currently have). Using `pnpm/action-setup@v4` is the simpler, more common pattern in 2025-2026 Astro projects. [ASSUMED — based on training knowledge; either approach is valid]

---

## 5. Netlify noindex Meta (FND-09)

### Netlify environment variables available at build time

Netlify exposes `CONTEXT` at build time with these values:
- `production` — main branch deploy
- `deploy-preview` — PR preview deploy
- `branch-deploy` — non-main branch deploy

[VERIFIED: Netlify docs — https://docs.netlify.com/configure-builds/environment-variables/#build-metadata]

### Implementation in `src/layouts/Layout.astro`

The `CONTEXT` variable is available as an Astro build-time env var. In Astro, build-time env vars are read via `import.meta.env`.

**Step 1:** Netlify passes `CONTEXT` to the build process. Astro exposes all `VITE_*` env vars to the client, but plain build-time vars like `CONTEXT` are accessible in server-side (frontmatter) code as `process.env.CONTEXT` or via Astro's env system.

**Recommended pattern for `src/layouts/Layout.astro`:**

Add to the frontmatter (after existing imports):
```astro
---
// ... existing imports ...
const netlifyContext = import.meta.env.CONTEXT ?? process.env.CONTEXT ?? 'production';
const isNonProduction = netlifyContext === 'deploy-preview' || netlifyContext === 'branch-deploy';
---
```

Then in the `<head>`, after `<CommonMeta />`:
```astro
{isNonProduction && <meta name="robots" content="noindex, nofollow" />}
```

**Why this works:**
- In Netlify builds, `CONTEXT` is injected into the build environment. Astro's Vite layer makes process.env accessible in SSG frontmatter code.
- `import.meta.env.CONTEXT` works if added to Astro's env config; `process.env.CONTEXT` is the direct Node.js fallback.
- The `?? 'production'` default ensures local dev builds are NOT marked noindex (no CONTEXT env var locally).
- For extra safety, also set `CONTEXT=production` in a `.env` file (which is git-ignored by default) for local testing.

**Local dev behavior:** `process.env.CONTEXT` is undefined locally → defaults to `'production'` → noindex meta NOT emitted. This is correct.

**Alternative: Netlify `_headers` approach** (not recommended for FND-09):
The requirement specifies `<meta name="robots">` injection, not an HTTP header. The meta tag approach in Layout.astro is the right implementation. An `X-Robots-Tag` header in `netlify.toml` would also work but requires context-specific header rules, which netlify.toml does not support natively (only `[[context.deploy-preview.headers]]` blocks). The Layout.astro approach is simpler.

---

## 6. Netlify Branch Deploy Policy (FND-10)

### Current `netlify.toml`

```toml
[build]
  publish = "dist"
  command = "npm run build"
[build.processing.html]
  pretty_urls = false
[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

Problems:
1. `command = "npm run build"` — must be `pnpm run build` (coordinates with FND-07)
2. No branch deploy restriction
3. No deploy preview vs branch deploy policy

### Netlify Branch Deploy vs Deploy Preview

- **Deploy Preview:** Triggered by a PR. Always enabled for any PR targeting any branch.
- **Branch Deploy:** Triggered by a push to a non-main branch (no associated PR). Controllable via `netlify.toml` or the Netlify UI.

FND-10 says: "only `main` triggers branch deploys; PR branches render as Deploy Previews."

### Updated `netlify.toml`

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

**Note on Netlify branch control:** True branch deploy restriction (limiting which branches trigger branch-deploys) is configured in the Netlify UI under Site Settings > Build & Deploy > Branches, not in `netlify.toml`. The `netlify.toml` `[context.branch-deploy]` block can override the build command for branch deploys but cannot prevent them from being triggered. [VERIFIED: Netlify docs — context-specific settings apply after Netlify decides to build].

**The reliable FND-10 implementation is therefore a two-part change:**
1. In `netlify.toml`: set `[context.branch-deploy]` command to a no-op or error so any triggered branch deploy produces no output and fails gracefully.
2. In Netlify UI (manual step, one-time): set Branch deploys to "None" or "Deploy only the production branch and its deploy previews." This must be documented as a manual step in the plan.

The `noindex` meta (FND-09) provides defense-in-depth regardless: even if a branch deploy does trigger, it will be unindexed.

---

## 7. Package Removal Safety (FND-04)

### Packages to remove

| Package | Location | Import chain | Safe to remove after... |
|---------|----------|--------------|------------------------|
| `@fontsource-variable/inter` | dependency | `src/components/CustomStyles.astro:2` imports it; `src/env.d.ts:7` declares its module | Remove import from `CustomStyles.astro`, remove `declare module` from `env.d.ts`, then `pnpm remove @fontsource-variable/inter` |
| `@astrolib/analytics` | dependency | `src/components/common/Analytics.astro:2` imports `{ GoogleAnalytics }` | Replace `Analytics.astro` with a stub (empty component or Plausible placeholder), then `pnpm remove @astrolib/analytics` |
| `@astrojs/partytown` | devDependency | `astro.config.ts:9` imports it; used at lines 47-51 inside `whenExternalScripts()` which is **never called** (`hasExternalScripts = false` at line 20) | Remove the import and the `whenExternalScripts` conditional block from `astro.config.ts`, then `pnpm remove @astrojs/partytown` |

### Safe removal order

1. Edit source files first (remove all imports/usages)
2. Run `pnpm check` to confirm no broken references
3. Run `pnpm remove <package>` (updates `package.json` + `pnpm-lock.yaml`)
4. Run `pnpm build` to confirm clean build

### Analytics.astro replacement

Replace the current content with a no-op stub:
```astro
---
// Analytics placeholder — Plausible snippet will be added in Phase 7 (SEO-05)
---
```

This keeps the component in place (Layout.astro imports it) while removing the `@astrolib/analytics` dependency. The component stays empty for Phases 1-6; Phase 7 fills it with the Plausible snippet.

### partytown note

`hasExternalScripts = false` in `astro.config.ts` means the `whenExternalScripts()` call **never invokes** `partytown()`. The package is imported at line 9 but the integration is never registered. The only effect of removing it is a cleaner import section. No runtime behavior changes.

### CustomStyles.astro replacement

Remove the font import and the font references in CSS custom properties. Phase 2 (BRAND-01) will add Montserrat + PT Serif. Leave the CSS custom property declarations (colors, etc.) intact for Phase 2 to overwrite:

```astro
---
// Font imports will be added in Phase 2 (BRAND-01)
---

<style is:inline>
  :root {
    /* Fonts — Phase 2 placeholder */
    --aw-font-sans: system-ui, sans-serif;
    --aw-font-serif: Georgia, serif;
    --aw-font-heading: system-ui, sans-serif;

    /* Colors — Phase 2 will replace with Konvoi tokens */
    --aw-color-primary: rgb(1 97 239);
    /* ... rest unchanged ... */
  }
</style>
```

---

## 8. Navigation Cleanup (D-05, D-06)

### Current state of `src/navigation.ts`

**headerData.links** — 5 top-level items, all AstroWind:
- "Homes" → 4 demo home links
- "Pages" → 7 links (features anchor, services, pricing, about, contact, terms, privacy)
- "Landing" → 6 demo landing links
- "Blog" → 5 blog links (list, 2 articles, category, tag)
- "Widgets" → `href: '#'`

**headerData.actions** — 1 item: `{ text: 'Download', href: 'https://github.com/arthelokyo/astrowind' }`

**footerData.links** — 4 sections (Product, Platform, Support, Company) with ~22 total `href: '#'` links

**footerData.secondaryLinks** — Terms + Privacy Policy (linking to deleted pages)

**footerData.socialLinks** — X, Instagram, Facebook, RSS, GitHub (arthelokyo repo)

**footerData.footNote** — "Made by Arthelokyo · All rights reserved."

### Target state after Phase 1 (per D-05, D-06)

```ts
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

**Note on language switcher (D-06):** The context says "Konvoi logo + a non-functional DE/EN language switcher shell." The switcher is a UI element in `Header.astro`, not a data entry in `navigation.ts`. The Header component accepts a `links` array and renders nav items. Adding a visual DE/EN toggle to the header requires a small change to `Header.astro` (or a new `LanguageSwitcher.astro` stub) — not just a `navigation.ts` edit. The plan should include a task to add a visual placeholder for the switcher.

### Imports to update

`navigation.ts` currently imports `getPermalink`, `getBlogPermalink`, and `getAsset`. After stripping all page links, only `getAsset` is needed (for the RSS social link). Remove the other two imports to keep `pnpm check` clean.

---

## 9. Config.yaml Replacement (FND-02)

### Current values (exact, from `src/config.yaml`)

| Key | Current (AstroWind) | Replacement (Konvoi) |
|-----|---------------------|----------------------|
| `site.name` | `AstroWind` | `Konvoi` |
| `site.site` | `'https://astrowind.vercel.app'` | `'https://www.konvoi.eu'` |
| `site.base` | `'/'` | `'/'` (keep) |
| `site.trailingSlash` | `false` | `false` (keep) |
| `site.googleSiteVerificationId` | `orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M` | `''` (empty until Konvoi provides token) |
| `metadata.title.default` | `AstroWind` | `Konvoi` |
| `metadata.title.template` | `'%s — AstroWind'` | `'%s — Konvoi'` |
| `metadata.description` | rocket emoji AstroWind blurb | `'Konvoi — Security Tech Made in Germany'` (placeholder; real DE/EN copy in Phase 4) |
| `metadata.robots.index` | `true` | `true` (keep — noindex handled by FND-09 in Layout.astro) |
| `metadata.openGraph.site_name` | `AstroWind` | `Konvoi` |
| `metadata.openGraph.images[0].url` | `'~/assets/images/default.png'` | `'~/assets/images/default.png'` (keep reference; Phase 2 replaces the actual image) |
| `metadata.twitter.handle` | `'@arthelokyo'` | `''` (empty until Konvoi Twitter/X account confirmed) |
| `metadata.twitter.site` | `'@arthelokyo'` | `''` (empty) |
| `i18n.language` | `en` | `de` (Konvoi's primary locale; full i18n routing comes in Phase 3) |
| `apps.blog.*` | all enabled | keep as-is for now (blog is preserved as infrastructure) |
| `analytics.vendors.googleAnalytics.id` | `null` | `null` (keep null; analytics in Phase 7) |
| `ui.theme` | `'system'` | `'system'` (keep) |

**Full replacement file:**
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

### astro.config.ts changes

Remove from `image.domains`:
- `cdn.pixabay.com`
- `images.unsplash.com`
- `plus.unsplash.com`
- `img.shields.io`

Replace with empty array or remove the `image` block entirely:
```ts
image: {
  domains: [],
},
```

Remove:
```ts
import partytown from '@astrojs/partytown';
// and the whenExternalScripts/hasExternalScripts block entirely
```

The `partytown()` call was guarded by `hasExternalScripts = false`, so it was never executed. Remove both the flag, the helper function, and the spread `...whenExternalScripts(...)` from the integrations array.

---

## 10. Validation Architecture (FND-01 through FND-10)

### Test commands

| Command | What it checks | When to run |
|---------|---------------|-------------|
| `pnpm run check` | TypeScript + ESLint + Prettier — catches broken imports, type errors | After every file change |
| `pnpm run build` | Full static build — catches missing modules, bad imports in .astro files | After all deletions are done |
| `grep -riq "astrowind\|arthelokyo\|onwidget\|Unsplash\|Cupertino" --include="*.html" dist/` | FND-08 manual validation | After `pnpm build` |
| `ls src/pages/homes/ 2>/dev/null && echo STILL_EXISTS` | Confirms directories deleted | After deletions |
| `ls src/pages/landing/ 2>/dev/null && echo STILL_EXISTS` | Confirms directories deleted | After deletions |
| `ls public/decapcms/ 2>/dev/null && echo STILL_EXISTS` | Confirms DecapCMS deleted | After deletion |

### File-existence checks (phase gate)

These should all return empty/error after Phase 1:
```bash
# Directories that must be gone
ls src/pages/homes/           # must fail
ls src/pages/landing/         # must fail
ls public/decapcms/           # must fail

# Files that must be gone
ls src/pages/index.astro      # must fail
ls src/pages/about.astro      # must fail
ls src/pages/contact.astro    # must fail
ls src/pages/pricing.astro    # must fail
ls src/pages/services.astro   # must fail
ls src/pages/privacy.md       # must fail
ls src/pages/terms.md         # must fail
ls src/data/post/*.md         # must fail (all 6 demo posts deleted)
ls src/data/post/*.mdx        # must fail
ls src/components/widgets/Announcement.astro  # must fail
ls LICENSE.md                 # must exist (rewritten, not deleted)
```

### Config verification checks

```bash
# config.yaml must NOT contain AstroWind strings
grep -i "astrowind\|arthelokyo\|onwidget\|astrowind.vercel.app" src/config.yaml   # must return empty
grep "@arthelokyo" src/config.yaml      # must return empty

# navigation.ts must NOT contain arthelokyo/astrowind links
grep "arthelokyo\|astrowind\|homes/\|landing/" src/navigation.ts  # must return empty

# astro.config.ts must NOT contain banned image domains
grep "pixabay\|unsplash\|shields.io" astro.config.ts  # must return empty
```

### Build success criteria

1. `pnpm run check` exits 0
2. `pnpm run build` exits 0
3. `dist/` is populated with at least `404.html`
4. Grep gate (FND-08) exits 0 (no banned strings in dist/)
5. `dist/index.html` does NOT exist (or if it does, it is the 404 page — Astro generates a root 404 when no `index.astro` exists)

**Note:** Astro will still generate `dist/blog/index.html` (empty blog list) and `dist/rss.xml` (empty feed) because those routes exist. This is expected and acceptable.

---

## Requirement Coverage Matrix

| Req ID | Concrete Operation | Files Changed |
|--------|--------------------|---------------|
| FND-01 | Delete `src/pages/homes/`, `src/pages/landing/`, `index.astro`, `about.astro`, `contact.astro`, `pricing.astro`, `services.astro`, `privacy.md`, `terms.md`, all 6 `src/data/post/*` files | 19 file/directory deletions |
| FND-02 | Rewrite `src/config.yaml` with Konvoi values (7 field changes) | `src/config.yaml` |
| FND-03 | Delete `public/decapcms/` directory | `public/decapcms/index.html`, `public/decapcms/config.yml` |
| FND-04 | Remove 3 packages: remove import from `CustomStyles.astro`, replace `Analytics.astro` with stub, remove import + block from `astro.config.ts`, remove declare from `env.d.ts`, run `pnpm remove` | `CustomStyles.astro`, `Analytics.astro`, `astro.config.ts`, `env.d.ts`, `package.json`, `pnpm-lock.yaml` |
| FND-05 | Overwrite `LICENSE.md` with proprietary notice | `LICENSE.md` |
| FND-06 | Set `image.domains: []` in `astro.config.ts` | `astro.config.ts` |
| FND-07 | Rewrite `.github/workflows/actions.yaml`: pnpm/action-setup, single job, Node 22, `--frozen-lockfile` | `.github/workflows/actions.yaml` |
| FND-08 | Add grep gate step in workflow after `pnpm run build` | `.github/workflows/actions.yaml` |
| FND-09 | Add `netlifyContext` detection in `Layout.astro` frontmatter; conditionally emit `<meta name="robots" content="noindex, nofollow">` | `src/layouts/Layout.astro` |
| FND-10 | (a) Add `[context.branch-deploy]` no-op in `netlify.toml`, (b) Manual step: set Netlify UI branch deploy policy to production-only | `netlify.toml` + 1 manual Netlify UI step |

---

## Risks & Unknowns

### Risk 1: Announcement.astro cascade (HIGH — mitigated)
- If `Announcement.astro` is deleted without updating `PageLayout.astro`, the build fails.
- Mitigation: Plan must sequence these as a single atomic task.

### Risk 2: `pnpm check` fails on unused imports after navigation strip
- After `navigation.ts` strips all `getPermalink` / `getBlogPermalink` calls, the import line at the top of the file still exists but is now unused. ESLint will flag this.
- Mitigation: Remove unused imports from `navigation.ts` in the same task.

### Risk 3: `src/env.d.ts` declare module reference
- `src/env.d.ts:7` has `declare module '@fontsource-variable/inter';`. After removing the package and the import in `CustomStyles.astro`, this declaration becomes stale. TypeScript won't error on it (declaring a module that doesn't exist is valid TS), but it's dead code.
- Mitigation: Remove line 7 from `env.d.ts` as part of FND-04 cleanup.

### Risk 4: `dist/` from a previous build may contain stale files during CI
- GitHub Actions starts fresh each run (no dist/ in the repo). This is not a risk.

### Risk 5: Netlify UI branch deploy policy is a manual step
- `netlify.toml` alone cannot fully restrict which branches trigger builds.
- The plan must explicitly list this as a manual human step with exact UI path: Netlify Dashboard > Site > Site configuration > Build & deploy > Branches and deploy contexts > Branch deploys > set to "None."

### Risk 6: `i18n.language: de` in config.yaml
- Changing `i18n.language` from `en` to `de` changes the `lang` attribute on `<html>` in `Layout.astro` (line 29: `<html lang={language}`). This is the correct change — Konvoi's primary locale is German — but it means any remaining English-only content (like the 404 page) will have `lang="de"`. This is acceptable for Phase 1; full i18n routing comes in Phase 3.

### Unknown 1: Netlify account connection
- FND-10's manual step assumes someone with Netlify site admin access can perform the UI change. If the site is not yet connected to Netlify, this step is blocked. The plan should note this dependency.

### Unknown 2: `src/assets/images/default.png`
- The OG image reference in `config.yaml` points to `~/assets/images/default.png`. This file is AstroWind's purple-space image. Phase 1 keeps the reference but not the image replacement (that's Phase 2, BRAND-03). The file must remain in place for Phase 1 or the build will warn about a missing image.
- Action: Do NOT delete `src/assets/images/default.png` in Phase 1. Leave it for Phase 2.

---

## Sources

All findings verified directly from the repository source files on 2026-04-22:
- `src/config.yaml` — exact AstroWind values confirmed at lines 1-73
- `astro.config.ts` — integrations list, image.domains, partytown guard confirmed at lines 1-88
- `package.json` — dependency list confirmed at lines 24-66
- `.github/workflows/actions.yaml` — npm ci usage confirmed at lines 1-42
- `netlify.toml` — `npm run build` command confirmed at line 3
- `src/navigation.ts` — all AstroWind links confirmed at lines 1-183
- `src/layouts/PageLayout.astro` — Announcement import and usage confirmed at lines 5, 20
- `src/components/CustomStyles.astro` — `@fontsource-variable/inter` import confirmed at line 2
- `src/components/common/Analytics.astro` — `@astrolib/analytics` import confirmed at line 2
- `src/components/widgets/Announcement.astro` — arthelokyo/astrowind links confirmed at lines 12-21
- `src/layouts/Layout.astro` — structure confirmed; injection point for FND-09 identified
- `.planning/codebase/CONCERNS.md` — severity-ranked debt list, exact file paths
- `.planning/codebase/STRUCTURE.md` — directory layout
- `.planning/phases/01-foundation-scrub/01-CONTEXT.md` — locked decisions D-01 through D-06
- Netlify documentation (CONTEXT env var): https://docs.netlify.com/configure-builds/environment-variables/#build-metadata [CITED]
- pnpm/action-setup GitHub Action: https://github.com/pnpm/action-setup [CITED]
