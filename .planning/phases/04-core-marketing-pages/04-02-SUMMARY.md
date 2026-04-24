---
phase: 04-core-marketing-pages
plan: 02
subsystem: homepage
tags: [homepage, hero, testimonials, use-cases, i18n, de, en]
dependency_graph:
  requires: [04-01]
  provides: [DE homepage at /, EN homepage at /en]
  affects: [navigation, caseStudy collection, HeroVideo component]
tech_stack:
  added: []
  patterns:
    - Plain img tags for public-path SVG logos (avoids Astro 6 MissingImageDimension)
    - getCollection('caseStudy') for dynamic testimonial data
    - WidgetWrapper for logo wall sections without Image optimization pipeline
key_files:
  created:
    - src/pages/en/index.astro
  modified:
    - src/pages/index.astro
key_decisions:
  - Use plain img tags for logo/press/partner SVGs — Astro 6 Image component throws MissingImageDimension for public-path SVGs even with width/height props
  - Omit logo image from testimonials mapping — caseStudy logo paths are public SVGs; name+job attribution is sufficient social proof
  - tabler:battery-eco replaces tabler:battery-auto (non-existent icon)
metrics:
  duration_min: 4
  completed_date: "2026-04-24"
  tasks_completed: 2
  files_changed: 2
---

# Phase 04 Plan 02: Homepage Rebuild Summary

**One-liner:** DE and EN homepages rebuilt with 8-section KONVOI layout — HeroVideo, preventive explainer, 7 use-case icon cards, caseStudy-sourced testimonials, logo walls, and #consult CTA anchor.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build DE homepage (src/pages/index.astro) | 3f15eb8 | src/pages/index.astro |
| 2 | Build EN homepage (src/pages/en/index.astro) | 019d88a | src/pages/en/index.astro |

## What Was Built

### DE Homepage (`src/pages/index.astro`)

8-section layout per D-05:

1. **HeroVideo** — "Security Tech Made in Germany" tagline, "Die erste präventive Lösung für Ihre Flotte" title, background video, primary "Beratung anfragen" CTA → `#consult`
2. **Preventive explainer** — 3-col Features: Präventiv / Lernend / Unabhängig
3. **7 use-case teaser cards** — 4-col Features, all linking to `/anwendungen/*` slugs
4. **Testimonials** — sourced from `getCollection('caseStudy', locale === 'de')` for schumacher, jjx, greilmeier
5. **Customer logo wall** — plain `<img>` tags (Schumacher, JJX, Greilmeier)
6. **Press strip** — placeholder SVGs with "Bekannt aus" tagline
7. **Partners strip** — Startup Port, 1750 Ventures, VGH with "Unterstützt von" tagline
8. **CallToAction** — `id="consult"` scroll anchor, mailto CTA, Fallstudien secondary link

### EN Homepage (`src/pages/en/index.astro`)

Mirror of DE with:
- EN copy throughout (British English, formal register)
- `data.locale === 'en'` caseStudy query
- All 7 use-case cards linking to `/en/use-cases/*` routes
- "Book a consult" primary CTA → `#consult`
- Case studies link → `/en/case-studies/`

## Verification Results

- `pnpm build` exits 0 — 62 pages built
- `dist/index.html` exists ✓
- `dist/en/index.html` exists ✓
- `grep "Security Tech Made in Germany" dist/index.html` → 1 match ✓
- `grep 'id="consult"' dist/index.html` → 1 match ✓
- `grep 'id="consult"' dist/en/index.html` → 1 match ✓
- 7 `/anwendungen/` links in DE homepage ✓
- 7 `/en/use-cases/` links in EN homepage ✓

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] tabler:battery-auto icon does not exist**
- **Found during:** Task 1 — first build attempt
- **Issue:** `tabler:battery-auto` is not in the @iconify-json/tabler set; build failed with "Unable to locate icon"
- **Fix:** Replaced with `tabler:battery-eco` (conveys self-sufficiency / 7-day battery concept)
- **Files modified:** src/pages/index.astro, src/pages/en/index.astro
- **Commit:** 3f15eb8 (fixed inline before commit)

**2. [Rule 1 - Bug] Astro 6 MissingImageDimension for public-path SVGs in Brands widget**
- **Found during:** Task 1 — second build attempt after icon fix
- **Issue:** Brands.astro passes images through AstroWind's custom Image component → `astroAssetsOptimizer` → `getImage()`. Astro 6 throws `MissingImageDimension` for `/images/*.svg` public paths even when `width` and `height` are provided in the widget. This is a known Astro 6 regression with SVG optimization.
- **Fix:** Replaced three `<Brands>` sections with inline `WidgetWrapper` + plain `<img>` tags (same pattern used in `/src/pages/fallstudien/[slug].astro` and `/src/pages/en/case-studies/[slug].astro`). Plain `<img>` with explicit `width` and `height` attributes is the correct pattern for public-path SVG logos.
- **Files modified:** src/pages/index.astro, src/pages/en/index.astro
- **Commit:** 3f15eb8 (fixed before commit)

**3. [Rule 1 - Bug] caseStudy logo images cause MissingImageDimension in Testimonials**
- **Found during:** Task 1 — second build attempt
- **Issue:** The plan specified `image: cs.data.logo ? { src: cs.data.logo, alt: ... }` in the testimonials mapping. The Testimonials widget renders these via Image component, hitting the same SVG dimension error.
- **Fix:** Removed `image` field from testimonials mapping. Name + job attribution (e.g., "Katrin Sophie Schumacher, Geschäftsführerin" + "Hochwertige Güter") provides sufficient social proof without logos.
- **Files modified:** src/pages/index.astro, src/pages/en/index.astro
- **Commit:** 3f15eb8 (fixed before commit)

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| `/images/logos/schumacher.svg` | src/pages/index.astro, src/pages/en/index.astro | Logo SVG placeholder — customer logos not yet in public/images/logos/ |
| `/images/logos/jjx.svg` | src/pages/index.astro, src/pages/en/index.astro | Same — placeholder path |
| `/images/logos/greilmeier.svg` | src/pages/index.astro, src/pages/en/index.astro | Same — placeholder path |
| `/images/press/placeholder-press-*.svg` | src/pages/index.astro, src/pages/en/index.astro | Press logos not yet available — accepted per T-04-02-04 (broken image = invisible, cosmetic only) |
| `/images/partners/startup-port.svg` | src/pages/index.astro, src/pages/en/index.astro | Partner logos not yet in public/ — accepted per T-04-02-04 |
| `/videos/hero-bg.mp4` | src/pages/index.astro, src/pages/en/index.astro | User has video ready per D-04; HeroVideo shows poster fallback if video missing |

All stubs are cosmetic — pages render and convert without them. Logo/video assets to be added by user before launch.

## Threat Surface Scan

No new security surface introduced. All cross-links verified:
- `/fallstudien/` — exists (Phase 6, built)
- `/en/case-studies/` — exists (Phase 6, built)
- `mailto:info@konvoi.eu` — public contact address per canonical.yaml

T-04-02-03 mitigation verified: all route hrefs use exact slugs from routeMap.ts.

## Self-Check: PASSED

- `src/pages/index.astro` exists ✓ (128 insertions)
- `src/pages/en/index.astro` exists ✓ (190 insertions)
- Commit 3f15eb8 exists ✓
- Commit 019d88a exists ✓
- `dist/index.html` exists ✓
- `dist/en/index.html` exists ✓
