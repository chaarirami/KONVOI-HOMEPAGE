---
phase: 06-depth-credibility-pages
plan: "03"
subsystem: team
tags: [team, content-collection, i18n, components]
dependency_graph:
  requires:
    - "src/content.config.ts (team collection schema — pre-defined in b80f801)"
    - "src/layouts/PageLayout.astro (page wrapper)"
    - "src/components/widgets/CallToAction.astro (CTA reuse)"
  provides:
    - "src/content/team/*.md — 9 bilingual team member entries"
    - "src/components/widgets/TeamGrid.astro — responsive team photo grid"
    - "src/pages/team.astro — DE team page at /team/"
    - "src/pages/en/team.astro — EN team page at /en/team/"
  affects:
    - "Navigation (team pages now routable)"
    - "Phase 7 SEO (team page meta titles/descriptions present)"
tech_stack:
  added: []
  patterns:
    - "Short-form I18N-07 pattern: single markdown file with {de, en} sibling fields"
    - "initials fallback via onerror inline handler (no user-controlled data in handler)"
    - "getCollection('team') sorted by data.order ascending"
key_files:
  created:
    - src/content/team/alexander.md
    - src/content/team/heinz.md
    - src/content/team/rami.md
    - src/content/team/trinh.md
    - src/content/team/harsha.md
    - src/content/team/jonas.md
    - src/content/team/sushmita.md
    - src/content/team/eric.md
    - src/content/team/justus.md
    - src/components/widgets/TeamGrid.astro
    - src/pages/team.astro
    - src/pages/en/team.astro
  modified: []
decisions:
  - "Photo paths use ~/assets/images/team/{name}.jpg tilde alias — actual photos to be placed by human later"
  - "initials fallback uses onerror handler toggling display; handler is static string (no user data injection)"
  - "Members sorted client-side in component (not DB-level) via .sort() on order field"
metrics:
  duration: "~4 min"
  completed: "2026-04-23"
  tasks: 2
  files: 12
---

# Phase 6 Plan 03: Team Section Summary

9 bilingual team member content entries + responsive TeamGrid widget + DE and EN team pages using the I18N-07 short-form pattern.

## What Was Built

**Task 1 — 9 team content entries** (`src/content/team/`)

Each markdown file uses the short-form I18N-07 pattern: single YAML frontmatter with `{de, en}` sibling objects for `name`, `title`, and `bio`. Photo paths reference `~/assets/images/team/{name}.jpg` — actual photos to be placed by the human later. Members ordered 1–9 (Alexander=1 CEO/CTO first, Justus=9 last). Heinz and Justus include public `email` and `phone` fields matching the live site canonical data.

**Task 2 — TeamGrid component + DE/EN team pages**

`TeamGrid.astro` implements a responsive 2/3/4-col grid (grid-cols-2 / md:grid-cols-3 / lg:grid-cols-4) with:
- Photo `<img>` tag + `onerror` handler that hides the image and shows an initials `<div>` on load failure
- Initials generated from first two words of the name (e.g. "AJ" for Alexander Jagielo)
- Sort by `data.order` ascending; unordered entries go last (order ?? 999)

`src/pages/team.astro` (DE) and `src/pages/en/team.astro` (EN) each:
- Load team collection via `getCollection('team')`
- Pass `locale="de"` / `locale="en"` prop to TeamGrid
- End with a `CallToAction` pointing to `/kontakt` / `/en/contact`

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Worktree Setup Deviation

**[Rule 3 - Blocking] Base commit mismatch required src checkout + restoration**

- **Found during:** Worktree verification step
- **Issue:** Worktree was at 488ce48 (phase 3 end) instead of b80f801 (phase 6 planned base). Required `git reset --soft b80f801` and `git checkout b80f801 -- src/` to bring the worktree to the correct state. The initial task 1 commit accidentally included staged deletions from the checkout operation.
- **Fix:** Created a restoration commit (`938f368`) that re-adds all accidentally deleted files from b80f801.
- **Files modified:** .planning docs, astro.config.ts, package.json, pnpm-lock.yaml, public/ assets, scripts/
- **Commits:** `04f735e` (task 1), `938f368` (fix), `fc4e077` (task 2)

## Known Stubs

**Photo paths are stubs**: All 9 team entries reference `~/assets/images/team/{name}.jpg` files that do not yet exist. The `onerror` handler will display initials instead. Functional for display, but actual photos must be added before launch.

| Member | Path | Status |
|--------|------|--------|
| Alexander Jagielo | ~/assets/images/team/alexander.jpg | placeholder (initials fallback) |
| Heinz Luckhardt | ~/assets/images/team/heinz.jpg | placeholder (initials fallback) |
| Rami Chaari | ~/assets/images/team/rami.jpg | placeholder (initials fallback) |
| Trinh Nguyen | ~/assets/images/team/trinh.jpg | placeholder (initials fallback) |
| Harsha Vardhan | ~/assets/images/team/harsha.jpg | placeholder (initials fallback) |
| Jonas Weber | ~/assets/images/team/jonas.jpg | placeholder (initials fallback) |
| Sushmita Patel | ~/assets/images/team/sushmita.jpg | placeholder (initials fallback) |
| Eric Hoffmann | ~/assets/images/team/eric.jpg | placeholder (initials fallback) |
| Justus Männinghoff | ~/assets/images/team/justus.jpg | placeholder (initials fallback) |

The initials fallback is intentional and complete — the plan explicitly specifies this pattern. Photo upload is a content task for humans, not a code task.

## Pre-existing Build Issues (Out of Scope)

- `pnpm check:astro` returns 297 TypeScript errors, all in `src/components/islands/SensorDataViz.tsx` — pre-existing in b80f801 base commit, not caused by this plan.
- `pnpm build` fails on missing EN sibling posts (`src/content/post/de/` in main project) — from another parallel worktree agent's blog posts, not in scope for plan 06-03.
- Neither issue is caused by team section code. Zero errors in team-related files.

## Threat Flags

None — the onerror handler uses only static strings; no user-controlled data flows into it. Team member emails and phones for Heinz/Justus are already public on the live Jimdo site.

## Self-Check: PASSED

- [x] `src/content/team/alexander.md` — FOUND (order: 1)
- [x] `src/content/team/justus.md` — FOUND (order: 9)
- [x] `src/components/widgets/TeamGrid.astro` — FOUND
- [x] `src/pages/team.astro` — FOUND
- [x] `src/pages/en/team.astro` — FOUND
- [x] 9 team entries confirmed via `find src/content/team -name "*.md" | wc -l`
- [x] Commits `04f735e`, `938f368`, `fc4e077` exist in git log
