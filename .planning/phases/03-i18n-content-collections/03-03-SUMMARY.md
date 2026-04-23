---
phase: 03-i18n-content-collections
plan: "03"
subsystem: build-pipeline
tags: [i18n, build, parity-check, ci, tsx]
dependency_graph:
  requires: []
  provides: [translation-parity-gate]
  affects: [package.json, ci-build]
tech_stack:
  added: [tsx@^4.19.2]
  patterns: [build-time-script, process-exit-gate]
key_files:
  created:
    - scripts/check-translation-parity.ts
  modified:
    - package.json
decisions:
  - "Used regex-based frontmatter parsing instead of js-yaml to keep zero new runtime dependencies beyond tsx"
  - "tsx chosen as zero-config TypeScript executor — no tsconfig compilation step needed for build scripts"
  - "Filename stem fallback for translationKey prevents build failures during gradual content migration"
metrics:
  duration: "~5 min"
  completed: "2026-04-23T08:36:42Z"
  tasks_completed: 2
  files_modified: 2
requirements_satisfied: [I18N-08]
---

# Phase 03 Plan 03: Translation Parity Check Summary

**One-liner:** Build-time regex-based DE/EN parity enforcer using tsx, wired before astro build in pnpm pipeline.

## What Was Built

A TypeScript script (`scripts/check-translation-parity.ts`) that runs as the first step of `pnpm build`. It scans 5 long-form content collection directories (`post`, `caseStudy`, `useCase`, `industry`, `job`) for matching `translationKey` pairs between `de/` and `en/` subdirectories. If any DE entry lacks an EN sibling (or vice versa), it emits a human-readable error and calls `process.exit(1)`, blocking `astro build` from running. Empty or missing directories are silently skipped — valid during Phase 3 when no content entries exist yet.

`tsx ^4.19.2` was added to `devDependencies` as the zero-config TypeScript executor that allows running `.ts` scripts without a separate compile step.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create scripts/check-translation-parity.ts | bd71603 | scripts/check-translation-parity.ts |
| 2 | Add tsx devDep and wire build script | 10a046b | package.json |

## Verification Results

1. `scripts/check-translation-parity.ts` — exists, contains `process.exit(1)`, `LONG_FORM_COLLECTIONS`, `extractTranslationKey`, `collectKeys`, `checkTranslationParity`
2. `package.json` build script — `"tsx scripts/check-translation-parity.ts && astro build"`
3. `package.json` devDependencies — `"tsx": "^4.19.2"`
4. `pnpm install` — exits 0 (tsx fetched)
5. `pnpm build` in Phase 3 empty state — exits 0, prints `[parity] No content entries found — skipping parity check (Phase 3 empty state).`

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Regex frontmatter parsing over js-yaml | Keeps zero new deps beyond tsx; YAML frontmatter structure is simple enough for regex extraction |
| Filename stem fallback for translationKey | Allows gradual migration — content files without explicit translationKey still pair correctly by filename convention |
| tsx as script runner | Zero-config, no tsconfig needed for scripts; compatible with TypeScript 6.0.3 and Node ^22/24 |
| `&&` chaining in build script | Standard POSIX short-circuit — parity failure prevents astro build from running; clean failure semantics |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — this plan delivers a complete, functional build gate. No placeholder data flows to UI.

## Threat Flags

None — script reads only from version-controlled `src/content/` using a fixed path derived from `process.cwd()`. No user-supplied paths. No new network endpoints introduced.

## Self-Check: PASSED

- `scripts/check-translation-parity.ts` — FOUND
- `package.json` build script contains `tsx scripts/check-translation-parity.ts` — FOUND
- `package.json` devDependencies contains `"tsx"` — FOUND
- Commit bd71603 — FOUND
- Commit 10a046b — FOUND
- `pnpm build` exits 0 in Phase 3 empty state — VERIFIED (output: `[parity] No content entries found`)
