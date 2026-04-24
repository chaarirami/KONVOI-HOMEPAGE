---
phase: 04-core-marketing-pages
plan: "03"
subsystem: product-pages
tags:
  - product-page
  - sensor-diagram
  - scroll-steps
  - bilingual
  - DE
  - EN
dependency_graph:
  requires:
    - 04-01  # ScrollSteps, SensorDiagram, IncidentVideo components
  provides:
    - /produkt (DE product page)
    - /en/product (EN product page)
  affects:
    - navigation (product link targets now live)
    - sitemap (2 new URLs)
tech_stack:
  added: []
  patterns:
    - SensorDiagram with scroll-driven CSS animation-timeline callouts
    - ScrollSteps with scroll-triggered CSS animation-timeline reveal
    - IncidentVideo as install video placeholder
    - Content.astro with set:html for authored HTML string (no user input)
    - Static placeholder PNGs (1x1 transparent) for trailer-diagram and installation-poster
key_files:
  created:
    - src/pages/produkt.astro
    - src/pages/en/product.astro
    - public/images/placeholders/trailer-diagram.png
    - public/images/placeholders/installation-poster.jpg
  modified: []
decisions:
  - Used Hero.astro (not HeroVideo) — product page hero is text-first; no background video needed for this page
  - Placeholder PNGs created as 1x1 transparent PNG to prevent broken layout (T-04-03-02 mitigation)
  - Content.astro set:html content prop hardcoded author HTML — no user input, safe per T-04-03-01
metrics:
  duration_minutes: 3
  completed_date: "2026-04-24"
  tasks_completed: 2
  files_created: 4
  files_modified: 0
---

# Phase 04 Plan 03: Product Pages (DE + EN) Summary

**One-liner:** DE/EN product pages with SensorDiagram scroll callouts, ScrollSteps 3-step animated flow, Camera/Logbook add-on cards, and 120-minute install promise using IncidentVideo placeholder.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build DE product page | 82c17da | src/pages/produkt.astro, public/images/placeholders/trailer-diagram.png, public/images/placeholders/installation-poster.jpg |
| 2 | Build EN product page | 451171e | src/pages/en/product.astro |

## What Was Built

### DE Product Page (`/produkt`)

7 sections in order:
1. **Hero** — "Prävention für Ihren Trailer — in unter 120 Minuten installiert" + consult CTA
2. **Hardware Features (3-col)** — GPS+LTE, Schock & Bewegungssensor, 7-Tage-Akku
3. **SensorDiagram** — 4 scroll-animated callouts (GPS+LTE Modul, Schock-Sensor Achse, Bewegungssensor Ladeklappe, Ankopplungssensor) on trailer placeholder image
4. **ScrollSteps** — 3-step animated flow: Erkennung / Klassifizierung / Maßnahmen
5. **Add-on Features (2-col)** — KONVOI Camera Module + KONVOI Logbook
6. **Content + IncidentVideo** — Installation in unter 120 Minuten with HTML list + install video placeholder
7. **CallToAction (id=consult)** — mailto CTA for consult request

### EN Product Page (`/en/product`)

Mirror of DE structure with full EN copy:
- Detection / Classification / Measures (3-step flow)
- GPS+LTE Module / Shock Sensor (Axle) / Motion Sensor (Loading Door) / Coupling Sensor callouts
- KONVOI Camera Module + KONVOI Logbook (EN descriptions)
- "Installation in under 120 minutes" with EN bullet list
- "Book a consult" CTA

## Verification

- `pnpm build` exits 0, 64 pages built
- `dist/produkt/index.html` exists
- `dist/en/product/index.html` exists
- `grep "120" dist/produkt/index.html` → 1 match
- `grep "Camera Module" dist/produkt/index.html` → 1 match
- `grep "Detection\|Classification\|Measures" dist/en/product/index.html` → 1 match

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Functionality] Created placeholder image files**
- **Found during:** Task 1 (threat model T-04-03-02)
- **Issue:** SensorDiagram defaults to `/images/placeholders/trailer-diagram.png` and IncidentVideo uses `/images/placeholders/installation-poster.jpg` — both paths would 404 without actual files
- **Fix:** Created 1x1 transparent PNG files at both paths so the layout renders without broken images
- **Files modified:** `public/images/placeholders/trailer-diagram.png`, `public/images/placeholders/installation-poster.jpg`
- **Commit:** 82c17da

## Known Stubs

| Stub | File | Line | Reason |
|------|------|------|--------|
| `/images/placeholders/trailer-diagram.png` | src/pages/produkt.astro | 63 | 1x1 transparent PNG — user will replace with 3D trailer render (D-07) |
| `/images/placeholders/installation-poster.jpg` | src/pages/produkt.astro | 168 | 1x1 transparent PNG — user will replace with real installation photo |
| `/videos/installation-process.mp4` | src/pages/produkt.astro | 167 | Video placeholder — user will record real install video (D-10) |
| `/images/placeholders/trailer-diagram.png` | src/pages/en/product.astro | 63 | Same 3D render placeholder (EN mirrors DE) |
| `/videos/installation-process.mp4` | src/pages/en/product.astro | 167 | Same video placeholder (EN mirrors DE) |

These stubs are intentional and documented per D-07, D-10. The pages are fully functional and render correct layout. Real assets are planned for user-supplied replacement.

## Threat Surface Scan

No new security-relevant surface introduced beyond what was already in the threat model. All content is author-hardcoded in .astro files (no user input). Placeholder images are static binary files.

## Self-Check: PASSED

- `src/pages/produkt.astro` — FOUND
- `src/pages/en/product.astro` — FOUND
- `public/images/placeholders/trailer-diagram.png` — FOUND
- `public/images/placeholders/installation-poster.jpg` — FOUND
- Commit `82c17da` — FOUND (feat(04-03): build DE product page /produkt)
- Commit `451171e` — FOUND (feat(04-03): build EN product page /en/product)
- `dist/produkt/index.html` — FOUND (verified post-build)
- `dist/en/product/index.html` — FOUND (verified post-build)
