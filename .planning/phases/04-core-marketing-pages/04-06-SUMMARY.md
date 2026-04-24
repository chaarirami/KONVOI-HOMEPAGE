---
phase: 04-core-marketing-pages
plan: "06"
subsystem: pages/industry
tags: [industry-verticals, dynamic-routes, i18n, content-collection, vert-01, vert-02, vert-03, vert-04]

dependency_graph:
  requires:
    - 04-01  # Layout, Hero, CallToAction components
    - 04-07  # Industry content collection entries (4 DE + 4 EN)
  provides:
    - DE dynamic route /branchen/[slug] → 4 industry pages
    - EN dynamic route /en/industries/[slug] → 4 industry pages
  affects:
    - Navigation (industry vertical links now resolve)
    - Sitemap (8 new pages added)

tech_stack:
  added: []
  patterns:
    - Astro content collection getCollection with locale filter
    - render(entry) from astro:content for glob loader collections
    - Hardcoded lookup map pattern for safe href resolution (T-04-06-02)
    - DE-slug-keyed map used by both DE and EN templates

key_files:
  created:
    - src/pages/branchen/[slug].astro
    - src/pages/en/industries/[slug].astro
  modified: []

decisions:
  - render(entry) imported from astro:content — required for glob loader collections in Astro 6 (entry.render() unavailable)
  - riskProfile rendered both in hero subtitle and dedicated callout — hero introduces visually, callout re-states for scroll-past visitors
  - relatedUseCases DE-slug keys reused in EN template — EN entries store DE slugs; EN template resolves to EN hrefs via separate hardcoded map

metrics:
  duration: "2 min"
  completed_date: "2026-04-24"
  tasks_completed: 2
  files_created: 2
  files_modified: 0
  pages_generated: 8
---

# Phase 04 Plan 06: Industry Vertical Pages Summary

DE and EN dynamic route templates generating all 8 industry vertical pages from the industry content collection, each with risk-profile hero, markdown body, use-case cross-links, and #consult CTA.

## What Was Built

### Task 1 — `src/pages/branchen/[slug].astro`

DE dynamic route generating 4 pages at `/branchen/{slug}`:
- `hochwertige-gueter`, `kuehlgut`, `intermodal`, `sonstige`
- `getStaticPaths` filters industry collection to `locale === 'de'`
- Hero `subtitle` = `data.riskProfile` (D-16, VERT-02) — visible above the fold
- Dedicated risk-profile callout section below hero (border-l-4 primary accent)
- Markdown body via `render(entry)` inside `prose` wrapper
- Related use-case cross-links grid (1-3 col responsive) resolving DE slugs to `/anwendungen/` hrefs via hardcoded map (T-04-06-02)
- `<CallToAction id="consult">` at page end with mailto CTA (VERT-04)

### Task 2 — `src/pages/en/industries/[slug].astro`

EN dynamic route generating 4 pages at `/en/industries/{slug}`:
- `high-value`, `cooling`, `intermodal`, `other`
- `getStaticPaths` filters industry collection to `locale === 'en'`
- All EN copy applied: "Industries" tagline, "The Risk Profile" heading, "Relevant Use Cases", "Learn more →", "Book a consult", "Protect your fleet"
- relatedUseCases DE slugs resolved to EN hrefs (`/en/use-cases/`) via separate hardcoded map
- CTA links to `mailto:info@konvoi.eu?subject=Consultation+Request` and `/en/case-studies/`

## Verification Results

| Check | Result |
|-------|--------|
| `pnpm build` exits 0 | PASS — 86 pages built |
| `dist/branchen/` has 4 directories | PASS — hochwertige-gueter, intermodal, kuehlgut, sonstige |
| `dist/en/industries/` has 4 directories | PASS — cooling, high-value, intermodal, other |
| DE page has "Risikoprofil" heading | PASS |
| DE page has /anwendungen/ links | PASS |
| DE page has #consult anchor | PASS |
| EN page has /en/use-cases/ links | PASS |
| EN page has #consult anchor | PASS |

## Requirements Satisfied

| Requirement | Description | Status |
|-------------|-------------|--------|
| VERT-01 | 4 DE pages at /branchen/{slug} + 4 EN pages at /en/industries/{slug} | DONE |
| VERT-02 | Risk profile framed in hero subtitle + dedicated callout section | DONE |
| VERT-03 | 2-3 use-case cross-links per vertical (from relatedUseCases field) | DONE |
| VERT-04 | Each vertical ends with CallToAction id="consult" | DONE |

## Deviations from Plan

None — plan executed exactly as written.

The plan already specified `render(entry)` (not `entry.render()`) consistent with the Astro 6 glob loader API documented in STATE.md decision `[Phase 04]`.

## Known Stubs

None — all data is wired from the industry content collection. The `relatedUseCases` lookup maps are fully populated for all 7 DE use-case slugs. riskProfile and relatedUseCases fields are present in all 8 collection entries (4 DE + 4 EN, built in Plan 07).

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced. All output is static HTML at build time.

## Commits

| Task | Commit | Files |
|------|--------|-------|
| Task 1: DE dynamic route | 3edc651 | src/pages/branchen/[slug].astro |
| Task 2: EN dynamic route | 56b6167 | src/pages/en/industries/[slug].astro |

## Self-Check: PASSED
