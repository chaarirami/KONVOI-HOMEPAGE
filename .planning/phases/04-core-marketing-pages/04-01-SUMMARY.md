---
phase: 04-core-marketing-pages
plan: 01
subsystem: navigation, i18n, build-integration
tags: [preact, uplot, navigation, translations, i18n]
dependency_graph:
  requires: [03-i18n-content-collections]
  provides: [preact-integration, full-nav-structure, phase4-translations]
  affects: [src/navigation.ts, src/i18n/translations.ts, astro.config.ts]
tech_stack:
  added: ["@astrojs/preact@5.1.2", "preact@10.29.1", "uplot@1.6.32"]
  patterns: ["Preact islands via @astrojs/preact", "locale-split nav exports (headerDataDe/En)", "flat dot-notation translation keys"]
key_files:
  created: []
  modified:
    - package.json
    - astro.config.ts
    - src/navigation.ts
    - src/i18n/translations.ts
decisions:
  - "@types/uplot does not exist in npm registry — uPlot ships its own types; skipped devDep install"
  - "compat: false used for Preact integration — SensorDataViz uses preact/hooks directly, no React compat needed"
  - "headerData legacy export retained for backward compat with Header.astro until Plan 02 wires locale switching"
metrics:
  duration: ~10min
  completed: 2026-04-23
  tasks_completed: 3
  files_modified: 4
---

# Phase 4 Plan 01: Foundations — Preact Integration, Navigation, Translations Summary

**One-liner:** Preact + uPlot installed with compat:false, full bilingual nav (7 use cases + 4 verticals per locale), and all Phase 4 section heading strings added to translations.ts.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Install Preact + uPlot and wire integration | 4095790 | package.json, pnpm-lock.yaml, astro.config.ts |
| 2 | Populate full bilingual nav structure | fb90df4 | src/navigation.ts |
| 3 | Add Phase 4 UI strings to translations.ts | de589b0 | src/i18n/translations.ts |

## Verification Results

- `pnpm build` — passes (exit 0, 20 pages built)
- `pnpm check:astro` — passes (0 errors, 0 warnings, 0 hints, 102 files)
- `grep "@astrojs/preact" package.json` — matches
- `grep "preact()" astro.config.ts` — matches
- `grep -c "homepage.hero_title" src/i18n/translations.ts` — returns 2 (DE + EN)
- `grep -c "ladungsdiebstahl|...|standzeit-optimierung" src/navigation.ts` — returns 7
- `grep -c "hochwertige-gueter|kuehlgut|intermodal|sonstige" src/navigation.ts` — returns 5 (intermodal appears in both locales)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] @types/uplot does not exist in npm registry**
- **Found during:** Task 1
- **Issue:** Plan instruction `pnpm add -D @types/uplot` fails with 404 — the package does not exist on npm registry. uPlot ships bundled TypeScript declarations.
- **Fix:** Skipped the `@types/uplot` install; uPlot types available directly from the `uplot` package itself.
- **Files modified:** none (no change needed)
- **Commit:** n/a (not committed — install step simply omitted)

**2. [Rule 2 - Pre-existing] ESLint check:eslint fails with tsconfigRootDir error**
- **Found during:** Final verification
- **Issue:** ESLint finds multiple tsconfig roots from worktree directories (`.claude/worktrees/agent-*`), causing 298 parse errors. This failure exists identically on the base commit (bf6225a) — confirmed by stashing all changes and re-running ESLint.
- **Fix:** Out of scope — pre-existing environment issue, not caused by this plan's changes. Logged as deferred.
- **Impact:** `pnpm check` (full) fails; `pnpm check:astro` and `pnpm build` pass cleanly.

## Known Stubs

- `src/navigation.ts`: Top-level items Preise, Fallstudien, Über uns, Kontakt use `href: '#'` — placeholder until Phase 5/6/7 build those pages (per D-11, intentional)
- `src/navigation.ts`: actions use `href: '#consult'` — placeholder until consult booking form is built in Phase 5

## Threat Flags

None — no new network endpoints, auth paths, or trust boundary changes introduced.

## Self-Check

**Files exist:**
- package.json — FOUND (modified)
- astro.config.ts — FOUND (modified)
- src/navigation.ts — FOUND (modified)
- src/i18n/translations.ts — FOUND (modified)

**Commits exist:**
- 4095790 — FOUND
- fb90df4 — FOUND
- de589b0 — FOUND

## Self-Check: PASSED
