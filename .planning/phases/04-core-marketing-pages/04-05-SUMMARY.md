---
phase: 04-core-marketing-pages
plan: 05
subsystem: use-case-pages
tags: [astro, content-collections, dynamic-routes, i18n, use-cases]
dependency_graph:
  requires: [04-01, 04-04, 04-07]
  provides: [DE use-case pages at /anwendungen/[slug], EN use-case pages at /en/use-cases/[slug]]
  affects: [sitemap, language-switcher, homepage cross-links]
tech_stack:
  added: []
  patterns: [getStaticPaths with useCase collection, render(entry) from astro:content glob loader API, hardcoded industryNames map for safe href resolution]
key_files:
  created:
    - src/pages/anwendungen/[slug].astro
    - src/pages/en/use-cases/[slug].astro
  modified: []
decisions:
  - render(entry) imported from astro:content — entry.render() unavailable in Astro 6 glob loader API
  - industryNames map hardcoded in template — prevents open redirect from collection data (T-04-05-02)
  - metadata falls back to collection data.metadata fields when present, then constructs from title/problemStatement
metrics:
  duration_minutes: 5
  completed_date: "2026-04-24"
  tasks_completed: 2
  files_created: 2
  files_modified: 0
---

# Phase 04 Plan 05: Use-Case Dynamic Routes Summary

**One-liner:** Two Astro dynamic route templates generating 14 use-case pages (7 DE + 7 EN) from the useCase content collection — each with problem framing, cost anchor, KONVOI approach, markdown body, IncidentVideo placeholder, industry cross-links, and #consult CTA.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create DE dynamic route /anwendungen/[slug].astro | ef526ab | src/pages/anwendungen/[slug].astro |
| 2 | Create EN dynamic route /en/use-cases/[slug].astro | 40e40a5 | src/pages/en/use-cases/[slug].astro |

## What Was Built

### DE Dynamic Route (`src/pages/anwendungen/[slug].astro`)
- `getStaticPaths` filters `useCase` collection by `locale === 'de'`
- Generates 7 pages: `ladungsdiebstahl`, `dieseldiebstahl`, `equipmentdiebstahl`, `trailerschaeden`, `fahrerangriffe`, `standzeit-optimierung`, `transparenz-der-operationen`
- Each page renders: Hero (tagline "Anwendungen") → problem framing → cost anchor callout → KONVOI approach → full markdown body (`<Content />`) → IncidentVideo → industry cross-links → CallToAction #consult

### EN Dynamic Route (`src/pages/en/use-cases/[slug].astro`)
- `getStaticPaths` filters `useCase` collection by `locale === 'en'`
- Generates 7 pages: `cargo-theft`, `diesel-theft`, `equipment-theft`, `trailer-damage`, `driver-assaults`, `operations-transparency`, `stationary-time-optimization`
- Mirrors DE structure with EN copy, `/en/industries/` hrefs, `/en/case-studies/` CTA link

### IncidentVideo Integration (UC-03, UC-04, D-13)
- Every page renders `<IncidentVideo videoSrc="/videos/incident-{slug}.mp4" />` 
- Poster image at `/images/placeholders/incident-{slug}.jpg`
- Per-scenario video paths — when user records real incidents from dashboard (D-02), files dropped at these exact paths are picked up automatically

### Industry Cross-Links (UC-05, D-14)
- `relatedIndustries` array from collection frontmatter mapped through hardcoded `industryNames` lookup
- Invalid slugs return `null` and are filtered — no open redirect possible (T-04-05-02)
- DE: links to `/branchen/` routes; EN: links to `/en/industries/` routes

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed `entry.render()` not available in Astro 6 glob loader**
- **Found during:** Task 1 (first pnpm build)
- **Issue:** Plan specified `const { Content } = await entry.render()` — this method does not exist on entries from collections using the Astro 6 `glob` loader. Build threw `TypeError: entry.render is not a function`.
- **Fix:** Changed import to `import { getCollection, render } from 'astro:content'` and call to `const { Content } = await render(entry)` — matching the pattern used in existing dynamic routes (e.g. `src/pages/fallstudien/[slug].astro`).
- **Files modified:** `src/pages/anwendungen/[slug].astro` (same fix pre-applied to EN template)
- **Commit:** ef526ab (fix included in task commit)

## Verification Results

- `ls dist/anwendungen/ | wc -l` → **7** ✓
- `ls dist/en/use-cases/ | wc -l` → **7** ✓
- `grep "incident-ladungsdiebstahl" dist/anwendungen/ladungsdiebstahl/index.html` → video src present ✓
- `grep "branchen" dist/anwendungen/ladungsdiebstahl/index.html` → industry cross-links present ✓
- `grep "consult" dist/anwendungen/ladungsdiebstahl/index.html` → #consult CTA present ✓
- `grep "incident-cargo-theft" dist/en/use-cases/cargo-theft/index.html` → video src present ✓
- `pnpm build` exits 0, 78 total pages ✓

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| `/videos/incident-{slug}.mp4` | Both templates | Placeholder video paths — user records real incidents from dashboard (D-02). Files dropped at these paths are picked up automatically at build time. |
| `/images/placeholders/incident-{slug}.jpg` | Both templates | Placeholder poster images — user replaces with real thumbnails. |

These stubs are intentional per D-02/D-13 and do not prevent page rendering — the IncidentVideo component shows the poster image fallback when video file is absent.

## Threat Flags

No new threat surface introduced. All trust boundaries covered by the plan's threat model:
- Content rendered via Astro `<Content />` (sanitized parser, no raw `set:html`)
- Industry hrefs resolved through hardcoded map (no collection data interpolation)
- Video src from Zod-validated slug (no path traversal)
- CTA links use exact Phase 6 route strings

## Self-Check: PASSED

- `src/pages/anwendungen/[slug].astro` → FOUND
- `src/pages/en/use-cases/[slug].astro` → FOUND
- Commit `ef526ab` → FOUND
- Commit `40e40a5` → FOUND
- `dist/anwendungen/` → 7 directories ✓
- `dist/en/use-cases/` → 7 directories ✓
