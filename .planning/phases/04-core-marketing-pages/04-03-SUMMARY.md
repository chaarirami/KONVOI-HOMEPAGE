---
phase: 04-core-marketing-pages
plan: "03"
subsystem: product-pages
tags: [product-page, i18n, astro, yaml, sensor-diagram, placeholder]
dependency_graph:
  requires: [04-01]
  provides: [product-page-de, product-page-en, sensor-diagram-placeholder, install-placeholder]
  affects: [nav-product-link, sitemap]
tech_stack:
  added: [vite-plugin-yaml-inline]
  patterns: [yaml-import-via-inline-vite-plugin, assets-images-for-astro-optimisation]
key_files:
  created:
    - src/pages/produkt.astro
    - src/pages/en/product.astro
    - src/assets/images/sensor-positions-placeholder.svg
    - src/assets/images/installation-placeholder.svg
    - public/images/sensor-positions-placeholder.svg
    - public/images/installation-placeholder.svg
  modified:
    - astro.config.ts
decisions:
  - SVG placeholders placed in src/assets/images/ (not public/images/) so Astro asset optimizer can handle them without needing explicit remote-image dimensions
  - Inline vite-plugin-yaml added to astro.config.ts using js-yaml (already a project dependency) — no new package needed
  - canonical.yaml tier array indexing used directly (tiers[1] = camera-module, tiers[2] = logbook) consistent with plan spec
metrics:
  duration: "~15 min"
  completed: "2026-04-23T10:38:20Z"
  tasks_completed: 2
  files_created: 6
  files_modified: 1
---

# Phase 04 Plan 03: Product Pages Summary

**One-liner:** DE and EN product pages with 5 PROD sections (hardware spec, sensor diagram, Detection/Classification/Measures, Camera Module + Logbook add-ons, 120-min install promise) wired to canonical.yaml and translations.ts.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build DE product page (PROD-01 to PROD-05) | 4ca3b21 | src/pages/produkt.astro, public/images/sensor-positions-placeholder.svg, public/images/installation-placeholder.svg |
| 2 | Build EN product page + wire YAML import | 635589b | src/pages/en/product.astro, src/assets/images/*.svg, astro.config.ts |

## Verification Results

- `pnpm build` exits 0 — 22 pages built
- `dist/produkt/index.html` exists — DE product page built
- `dist/en/product/index.html` exists — EN product page built
- `grep "120 Minuten" dist/produkt/index.html` — PASS
- `grep "120 minutes" dist/en/product/index.html` — PASS
- `grep -i "erkennung" dist/produkt/index.html` — PASS (PROD-03 step 1)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] YAML imports not supported without a Vite plugin**
- **Found during:** Task 1 verification (pnpm build)
- **Issue:** `import brand from '~/data/brand/canonical.yaml'` caused a Rollup parse error — no YAML transform plugin was configured in astro.config.ts. The plan assumed YAML imports work out of the box but the project had no such plugin.
- **Fix:** Added an inline `vite-plugin-yaml` to `astro.config.ts` using `js-yaml` (already a project dependency — `"js-yaml": "^4.1.1"` in package.json). No new dependency needed.
- **Files modified:** `astro.config.ts`
- **Commit:** 635589b

**2. [Rule 3 - Blocking] SVG images in public/ treated as remote images requiring explicit dimensions**
- **Found during:** Task 1 verification (pnpm build)
- **Issue:** Images referenced as `/images/sensor-positions-placeholder.svg` were treated as remote URLs by Astro's image optimizer, requiring explicit width/height. Although Content.astro passes `width={500} height={500}`, the `getImagesOptimized` function still threw `MissingImageDimension` for string paths starting with `/`.
- **Fix:** Moved SVG assets to `src/assets/images/` and updated page references to `~/assets/images/...`. The `findImage` util processes `~/assets/` paths as local `ImageMetadata`, bypassing the remote-image dimension requirement. Public copies retained for direct access.
- **Files modified:** `src/pages/produkt.astro`, `src/pages/en/product.astro`
- **Commit:** 635589b

### Pre-existing Issues (Out of Scope)

- `pnpm check:astro` reports 18 TypeScript errors in `src/components/islands/SensorDataViz.tsx` (Plan 04-02 scope). These existed before this plan's work and are not caused by changes here. Logged to deferred-items tracking.

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| `/images/sensor-positions-placeholder.svg` | `src/assets/images/sensor-positions-placeholder.svg` | Placeholder diagram — real trailer sensor illustration to replace before launch (PROD-02) |
| `/images/installation-placeholder.svg` | `src/assets/images/installation-placeholder.svg` | Video slot placeholder — real installation video to wire before launch (PROD-05) |
| `videoPoster="/images/hero-poster.jpg"` | `src/pages/produkt.astro`, `src/pages/en/product.astro` | Hero video poster — real asset to supply before launch (D-02) |

## Threat Flags

None — all surfaces reviewed against threat model. YAML is a static committed file, SVGs contain no scripts, mailto hrefs use public email. No new trust boundaries introduced.

## Self-Check: PASSED

- `src/pages/produkt.astro` — FOUND
- `src/pages/en/product.astro` — FOUND
- `src/assets/images/sensor-positions-placeholder.svg` — FOUND
- `src/assets/images/installation-placeholder.svg` — FOUND
- `dist/produkt/index.html` — FOUND (build verified)
- `dist/en/product/index.html` — FOUND (build verified)
- Commit `4ca3b21` — FOUND
- Commit `635589b` — FOUND
