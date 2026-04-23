---
phase: 04-core-marketing-pages
plan: 02
subsystem: homepage
tags: [homepage, hero, video-background, bilingual, conversion]
dependency_graph:
  requires: [04-01]
  provides: [DE homepage at /, EN homepage at /en/, video-background Hero]
  affects: [src/pages/index.astro, src/pages/en/index.astro, src/components/widgets/Hero.astro]
tech_stack:
  added: []
  patterns:
    - Video-background Hero with conditional src (D-02 pattern — slot wired, real MP4 added before launch)
    - Plain img tags for public-path SVG assets to bypass Astro image optimizer
    - t() helper for all section headings and CTA text (locale-aware)
key_files:
  created:
    - src/pages/en/index.astro
    - public/images/logos/schumacher.svg
    - public/images/logos/jjx.svg
    - public/images/logos/greilmeier.svg
    - public/images/logos/press-placeholder-1.svg
    - public/images/logos/press-placeholder-2.svg
    - public/images/logos/press-placeholder-3.svg
    - public/images/logos/startup-port.svg
    - public/images/logos/1750-ventures.svg
    - public/images/logos/vgh.svg
    - public/images/preventive-vs-reactive.svg
    - public/images/hero-poster.jpg
  modified:
    - src/pages/index.astro
    - src/components/widgets/Hero.astro
    - src/types.d.ts
    - src/components/widgets/Brands.astro
    - src/components/widgets/Content.astro
decisions:
  - "Placeholder SVGs for logos — real assets added before launch via PR; build never fails on missing files"
  - "Plain img tag in Brands.astro and Content.astro for public-path images — Astro getImage() treats /public/ paths as remote and requires inferSize; plain img avoids the pipeline entirely for SVG logos"
  - "hero-poster.jpg is a copy of hero-image.png (placeholder) — real MP4 poster added before launch per D-02"
metrics:
  duration: 25m
  completed: 2026-04-23
  tasks_completed: 2
  tasks_total: 2
  files_created: 12
  files_modified: 5
---

# Phase 4 Plan 02: Homepage (DE + EN) Summary

**One-liner:** Full bilingual homepage with 8 D-03 conversion sections — video-background Hero, logo wall, Schumacher/JJX/Greilmeier testimonials, 3-column value props, preventive-vs-reactive explainer, press strip, partners strip, and consult CTA.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Extend Hero.astro with video background (D-01, D-02) | e4d77d9 | Hero.astro, types.d.ts |
| 2 | Build DE and EN homepages with 8 D-03 sections | dc46e78 | index.astro, en/index.astro, public/images/logos/* |

## What Was Built

### Task 1 — Hero.astro Video Extension

Extended `Hero.astro` to accept `videoSrc` and `videoPoster` optional props. Per D-02, the `<video>` element is always rendered in markup when `videoPoster` is provided — the `src` attribute is set conditionally only when `videoSrc` is also provided. This keeps the video slot wired from day one; the real MP4 asset can be added before launch without any template changes.

- `videoSrc?: string` and `videoPoster?: string` added to Hero interface in `src/types.d.ts`
- `<video>` element with `poster`, `autoplay`, `muted`, `loop`, `playsinline` added to Hero template
- Dark overlay `bg-black/60` added when video background is active
- Title and subtitle use `text-white` when video background is active for readability

### Task 2 — DE + EN Homepages

Both `src/pages/index.astro` (DE) and `src/pages/en/index.astro` (EN) built with all 8 sections in D-03 conversion order:

1. Hero — video poster fallback, "SECURITY TECH MADE IN GERMANY" tagline, "Beratung anfragen" / "Book a consult" CTA
2. Customer logo wall — Schumacher, JJX, Greilmeier (placeholder SVGs)
3. Testimonials — real quotes from Schumacher Group, JJX Logistics, Greilmeier Spedition
4. 3-column value props — Präventiv / Lernend / Unabhängig (from translations.ts)
5. Preventive-vs-reactive explainer — GPS-Tracker vs KONVOI comparison with explainer body
6. Press mentions strip — placeholders
7. Partners/investors strip — Startup Port, 1750 Ventures, VGH (placeholder SVGs)
8. End-of-page consult CTA — mailto:info@konvoi.eu

All section headings and CTA text pull from `t()` helper with per-locale keys added in Plan 01.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed MissingImageDimension error in Brands.astro**
- **Found during:** Task 2 — first pnpm build attempt
- **Issue:** Astro's image optimization pipeline (`getImage()`) treats `/public/`-path strings as remote images and raises `MissingImageDimension` even when `width`/`height` props are provided, because `inferSize: true` only works for external CDN URLs
- **Fix:** Replaced `<Image>` component with plain `<img>` tag in `Brands.astro` for logo images; removed unused Image import
- **Files modified:** `src/components/widgets/Brands.astro`
- **Commit:** dc46e78

**2. [Rule 1 - Bug] Fixed same issue in Content.astro for SVG diagram**
- **Found during:** Task 2 — proactive fix anticipating same failure for preventive-vs-reactive.svg
- **Fix:** Added a conditional branch in `Content.astro` — when image.src starts with `/`, use a plain `<img>` tag; otherwise fall through to the existing `<Image>` optimizer
- **Files modified:** `src/components/widgets/Content.astro`
- **Commit:** dc46e78

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| `/images/logos/schumacher.svg` | public/images/logos/schumacher.svg | Text-only placeholder SVG — real brand logo added before launch |
| `/images/logos/jjx.svg` | public/images/logos/jjx.svg | Text-only placeholder SVG — real brand logo added before launch |
| `/images/logos/greilmeier.svg` | public/images/logos/greilmeier.svg | Text-only placeholder SVG — real brand logo added before launch |
| `/images/logos/press-placeholder-*.svg` | public/images/logos/press-placeholder-*.svg | No press logos yet — real logos added when press coverage is available |
| `/images/logos/startup-port.svg` | public/images/logos/startup-port.svg | Text-only placeholder — real partner logo added before launch |
| `/images/logos/1750-ventures.svg` | public/images/logos/1750-ventures.svg | Text-only placeholder — real investor logo added before launch |
| `/images/logos/vgh.svg` | public/images/logos/vgh.svg | Text-only placeholder — real partner logo added before launch |
| `/images/preventive-vs-reactive.svg` | public/images/preventive-vs-reactive.svg | Diagram placeholder — real illustration needed before launch |
| `/images/hero-poster.jpg` | public/images/hero-poster.jpg | Copy of hero-image.png — real video poster JPEG needed before launch per D-02 |
| `videoSrc` not provided | src/pages/index.astro, src/pages/en/index.astro | No MP4 video file yet — `<video>` slot is wired, real MP4 added before launch per D-02 |

These stubs are intentional per the plan. The homepage is fully functional and representative; real assets replace placeholders before launch via PR.

## Verification Results

All plan verification criteria passed:

| Check | Result |
|-------|--------|
| `pnpm build` exits 0 | PASS |
| `dist/index.html` exists | PASS |
| `dist/en/index.html` exists | PASS |
| "security tech made in germany" in dist/index.html | PASS (1 match) |
| "security tech made in germany" in dist/en/index.html | PASS (1 match) |
| "Beratung anfragen" in dist/index.html | PASS (1 match) |
| "Book a consult" in dist/en/index.html | PASS (1 match) |
| `<video>` in Hero.astro | PASS |
| `videoPoster` in Hero.astro | PASS |
| `videoSrc` in Hero.astro | PASS |
| `videoSrc\|videoPoster` in types.d.ts (2 matches) | PASS |

## Self-Check: PASSED

All files exist and commits are verified:
- `e4d77d9` — feat(04-02): extend Hero.astro with video background support
- `dc46e78` — feat(04-02): build DE and EN homepages with 8 D-03 sections
