---
phase: 07-seo-consent-launch
plan: "03"
subsystem: seo
tags: [seo, hreflang, canonical, schema-org, og-images, sitemap, i18n]
dependency_graph:
  requires: []
  provides: [canonical-tags, hreflang-alternates, sitemap-i18n, schema-org-json-ld, og-images]
  affects: [all-pages, sitemap-0.xml]
tech_stack:
  added: [SchemaOrg.astro]
  patterns: [hreflang-from-pathname, json-ld-global, og-image-per-locale]
key_files:
  created:
    - src/components/common/SchemaOrg.astro
    - public/og/home-de.png
    - public/og/home-en.png
    - public/og/default-de.png
    - public/og/default-en.png
  modified:
    - src/components/common/Metadata.astro
    - astro.config.ts
    - src/layouts/Layout.astro
decisions:
  - "Removed AstroSeo component entirely — replaced with raw <link>/<meta> tag emission for full control over canonical and hreflang output"
  - "Hreflang derivation uses pathname prefix strategy: /en/* → EN, everything else → DE; x-default always points to DE URL"
  - "OG images generated as brand-colored 1200x630 PNG placeholders via sharp — user replaces before DNS cutover"
  - "SchemaOrg emits Organization + LocalBusiness globally; page-specific schemas passed via schema prop for future extension"
metrics:
  duration: 4min
  completed: "2026-04-26"
  tasks: 2
  files: 7
---

# Phase 07 Plan 03: SEO Infrastructure (Canonical + Hreflang + Schema.org + OG Images) Summary

**One-liner:** Full SEO infrastructure: canonical/hreflang/OG meta rewrite, sitemap i18n with xhtml:link alternates, Organization+LocalBusiness JSON-LD globally, 4 brand-colored placeholder OG images.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Rewrite Metadata.astro + configure sitemap i18n | 798faf0 | Metadata.astro, astro.config.ts |
| 2 | Create SchemaOrg.astro + generate OG images | e1e9c18 | SchemaOrg.astro, Layout.astro, 4x public/og/*.png |

## What Was Built

### Metadata.astro Rewrite
- Replaced `@astrolib/seo` `AstroSeo` component with direct `<link>`/`<meta>` tag emission
- Emits exactly one `<link rel="canonical">` per page using `Astro.site` + pathname
- Emits three `<link rel="alternate" hreflang>` tags: `de`, `en`, `x-default` (pointing to DE URL)
- Full OG meta block: `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:locale`, `og:site_name`
- Full Twitter Card block: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Locale-specific default OG image: `/og/default-de.png` or `/og/default-en.png`
- Props interface unchanged — all existing callers remain compatible

### astro.config.ts
- Added `site: 'https://www.konvoi.eu'` — enables `Astro.site` and absolute sitemap URLs
- Updated `sitemap()` with `i18n` block: `defaultLocale: 'de'`, locales `de → de-DE`, `en → en-US`
- Result: `dist/sitemap-0.xml` contains 28 `xhtml:link` alternate entries

### SchemaOrg.astro
- New component emitting Organization + LocalBusiness JSON-LD on every page
- Uses `set:html={JSON.stringify(...)}` — values are server-side props, not user input (T-07-03-02 mitigated)
- Accepts optional `schema` prop for page-specific JSON-LD (Product, FAQPage) in future
- Wired into `Layout.astro` `<head>` between `<Metadata>` and `<SiteVerification>`

### OG Images
- Four 1200×630 PNG images generated via sharp SVG-to-PNG pipeline
- Brand blue (`rgb(88,133,178)`) background with white text overlay
- `home-de.png` / `home-en.png`: "KONVOI — Security Tech Made in Germany"
- `default-de.png` / `default-en.png`: "KONVOI GmbH — konvoi.eu"

## Verification Results

| Check | Result |
|-------|--------|
| `dist/index.html` hreflang tags (de, en, x-default) | PASS |
| `dist/index.html` canonical = `https://www.konvoi.eu/` | PASS |
| `dist/en/index.html` hreflang="de" → `https://www.konvoi.eu/` | PASS |
| `dist/sitemap-0.xml` xhtml:link count > 10 | PASS (28) |
| `dist/og/*.png` — 4 files exist | PASS |
| `dist/index.html` JSON-LD blocks ≥ 2 | PASS (2: Organization + LocalBusiness) |
| `dist/index.html` og:image → `/og/default-de.png` | PASS |
| Sitemap URLs use `https://www.konvoi.eu` (not localhost) | PASS |
| pnpm build succeeds (97 pages) | PASS |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Cleanup] Removed unused imports from Metadata.astro**
- **Found during:** Task 2 (pnpm check output)
- **Issue:** `SITE`, `I18N`, `twitter` imported/destructured but never used — TypeScript warnings
- **Fix:** Removed unused `SITE` and `I18N` from import, removed `twitter` from destructuring
- **Files modified:** `src/components/common/Metadata.astro`
- **Commit:** e1e9c18

## Known Stubs

- `public/og/home-de.png`, `public/og/home-en.png`, `public/og/default-de.png`, `public/og/default-en.png` — Brand-colored placeholder images. Functional (non-broken URLs, correct dimensions 1200×630), but not final production-quality designs. Must be replaced with properly designed images before DNS cutover.

## Threat Flags

No new security-relevant surface introduced beyond what is in the plan's threat model.

- T-07-03-01 (accepted): Organization JSON-LD discloses address/phone/email — required by DSGVO Art. 13 + §5 TMG
- T-07-03-02 (mitigated): JSON-LD schema prop is server-side Astro component prop, not user input; `JSON.stringify` escapes all values
- T-07-03-03 (accepted): Sitemap exposes all page URLs — marketing site, all pages intentionally public

## Self-Check: PASSED

Files verified:
- `src/components/common/Metadata.astro` — exists
- `src/components/common/SchemaOrg.astro` — exists
- `astro.config.ts` — contains `site: 'https://www.konvoi.eu'` and sitemap i18n block
- `src/layouts/Layout.astro` — contains SchemaOrg import and render
- `public/og/home-de.png` — exists (30709 bytes)
- `public/og/home-en.png` — exists (30709 bytes)
- `public/og/default-de.png` — exists (28601 bytes)
- `public/og/default-en.png` — exists (28601 bytes)

Commits verified:
- `798faf0` — Task 1
- `e1e9c18` — Task 2
