---
phase: 04-core-marketing-pages
plan: "05"
subsystem: content
tags: [astro, content-collections, use-cases, i18n, sensor-data-viz, preact]

requires:
  - phase: 04-core-marketing-pages/04-01
    provides: i18n translations with usecase.* keys, routeMap.ts with locked slugs
  - phase: 04-core-marketing-pages/04-04
    provides: SensorDataViz island with scenarioId/locale props, sensor fixture JSON files

provides:
  - 14 use-case markdown entries (7 DE + 7 EN) with cost anchors, problem statements, KONVOI approaches, relatedIndustries cross-links
  - DE dynamic route src/pages/anwendungen/[slug].astro generating 7 pages from useCase collection
  - EN dynamic route src/pages/en/use-cases/[slug].astro generating 7 pages
  - 14 HTML pages built at locked slugs: /anwendungen/{slug} and /en/use-cases/{slug}

affects:
  - 04-06 (industry pages — cross-linked via relatedIndustries slugs)
  - 04-07 (validation script — verifies relatedIndustries slugs resolve to real pages)
  - Phase 07 (sitemap, SEO — 14 new pages need canonical URLs)

tech-stack:
  added: []
  patterns:
    - "useCase collection entries are frontmatter-only (no markdown body) — all data schema-driven"
    - "Dynamic route templates use getCollection with locale filter for getStaticPaths"
    - "SensorDataViz embedded with client:visible and canonicalKey as scenarioId"
    - "relatedIndustries cross-links use canonical DE slugs in both DE and EN templates"

key-files:
  created:
    - src/content/useCase/de/ladungsdiebstahl.md
    - src/content/useCase/de/dieseldiebstahl.md
    - src/content/useCase/de/equipmentdiebstahl.md
    - src/content/useCase/de/transparenz-der-operationen.md
    - src/content/useCase/de/trailerschaeden.md
    - src/content/useCase/de/fahrerangriffe.md
    - src/content/useCase/de/standzeit-optimierung.md
    - src/content/useCase/en/cargo-theft.md
    - src/content/useCase/en/diesel-theft.md
    - src/content/useCase/en/equipment-theft.md
    - src/content/useCase/en/operations-transparency.md
    - src/content/useCase/en/trailer-damage.md
    - src/content/useCase/en/driver-assaults.md
    - src/content/useCase/en/stationary-time.md
    - src/pages/anwendungen/[slug].astro
    - src/pages/en/use-cases/[slug].astro
  modified: []

key-decisions:
  - "Frontmatter-only markdown (no body) — all content is schema-driven fields rendered by the page template"
  - "relatedIndustries uses canonical DE slugs in both locales — EN template maps to /en/industries/{slug}"
  - "SensorDataViz embedded with client:visible (hydrates on scroll-into-view) for performance"
  - "set:html used for problemStatement/konvoiApproach — safe because content is committed markdown, not user input"

patterns-established:
  - "Content-collection dynamic routes: getCollection with locale filter → getStaticPaths → CollectionEntry<'useCase'> prop"
  - "Island hydration pattern: client:visible on SensorDataViz for above-the-fold performance"

requirements-completed: [UC-01, UC-02, UC-03, UC-04, UC-05]

duration: 15min
completed: 2026-04-23
---

# Phase 04 Plan 05: Use-Case Pages Summary

**14 use-case markdown entries (7 DE + 7 EN) with cost anchors and dynamic Astro routes embedding SensorDataViz at locked slugs under /anwendungen/ and /en/use-cases/**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-23T12:50:00Z
- **Completed:** 2026-04-23T13:05:00Z
- **Tasks:** 2
- **Files modified:** 16 created, 2 deleted (.gitkeep)

## Accomplishments

- Wrote 7 DE use-case content files covering: Ladungsdiebstahl (€8B anchor), Dieseldiebstahl (€2K anchor), Equipmentdiebstahl (€600/tyre anchor), Transparenz der Operationen, Trailerschäden, Fahrerangriffe, Standzeit-Optimierung
- Wrote 7 EN mirror files with British English, matching canonicalKeys and slugs per routeMap.ts
- Built DE dynamic route (`src/pages/anwendungen/[slug].astro`) and EN dynamic route (`src/pages/en/use-cases/[slug].astro`) — both with Hero, problem Content, SensorDataViz island, KONVOI approach Content, relatedIndustries cross-links, and CallToAction
- All 14 pages verified built at locked slugs; pnpm build exits 0

## Task Commits

1. **Task 1: Write 14 use-case markdown content files** - `51662d3` (feat)
2. **Task 2: Build dynamic use-case page templates** - `e9bcc15` (feat)

## Files Created/Modified

- `src/content/useCase/de/ladungsdiebstahl.md` — DE cargo theft use-case (canonicalKey: cargo-theft)
- `src/content/useCase/de/dieseldiebstahl.md` — DE diesel theft use-case
- `src/content/useCase/de/equipmentdiebstahl.md` — DE equipment theft use-case
- `src/content/useCase/de/transparenz-der-operationen.md` — DE operations transparency use-case
- `src/content/useCase/de/trailerschaeden.md` — DE trailer damage use-case
- `src/content/useCase/de/fahrerangriffe.md` — DE driver assaults use-case
- `src/content/useCase/de/standzeit-optimierung.md` — DE stationary time use-case
- `src/content/useCase/en/cargo-theft.md` — EN cargo theft use-case
- `src/content/useCase/en/diesel-theft.md` — EN diesel theft use-case
- `src/content/useCase/en/equipment-theft.md` — EN equipment theft use-case
- `src/content/useCase/en/operations-transparency.md` — EN operations transparency use-case
- `src/content/useCase/en/trailer-damage.md` — EN trailer damage use-case
- `src/content/useCase/en/driver-assaults.md` — EN driver assaults use-case
- `src/content/useCase/en/stationary-time.md` — EN stationary time use-case (slug: stationary-time-optimization)
- `src/pages/anwendungen/[slug].astro` — DE dynamic route: 7 use-case pages with SensorDataViz
- `src/pages/en/use-cases/[slug].astro` — EN dynamic route: 7 use-case pages with SensorDataViz

## Decisions Made

- Frontmatter-only markdown (no body text) — all content is schema-driven fields rendered by the template, keeping content authoring simple and consistent
- relatedIndustries cross-links use canonical DE slugs in both locales — the EN template maps them to `/en/industries/{slug}` so URLs are correct per language
- SensorDataViz embedded with `client:visible` — hydrates on scroll-into-view, not on page load, for performance on above-the-fold content
- `set:html` on problemStatement/konvoiApproach is safe — content comes from committed markdown frontmatter (multi-line YAML), not user input; Astro builds statically at compile time

## Deviations from Plan

None — plan executed exactly as written. The `.gitkeep` removal and file creation proceeded as specified. Pre-existing `pnpm check:astro` errors (SensorDataViz.tsx JSX types, canonical.yaml missing in main project) were confirmed as pre-existing in the main project tree, not introduced by this plan.

## Issues Encountered

- `pnpm check:astro` runs against the main project directory, not the worktree — the glob loader reported "No files found" for useCase collection when run from the main project. Verified file counts and field values directly in the worktree instead.
- Worktree has no `node_modules` — ran build using `astro --root` flag pointing to worktree with main project's binary. Build succeeded.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All 14 use-case pages built and ready for cross-linking from industry pages (Plan 06)
- relatedIndustries slugs populated in all 14 entries — Plan 07 validation script can verify slug resolution
- SensorDataViz island embedded on all use-case pages — requires sensor fixture JSON files at `/data/sensor-scenarios/{canonicalKey}.json` (built in Plan 04)

---
*Phase: 04-core-marketing-pages*
*Completed: 2026-04-23*
