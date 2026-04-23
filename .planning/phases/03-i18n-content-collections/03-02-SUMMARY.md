---
phase: 03-i18n-content-collections
plan: "02"
subsystem: content-collections
tags: [i18n, content-collections, zod, astro, scaffold]
dependency_graph:
  requires: []
  provides:
    - src/content.config.ts with 7 locale-aware collection definitions
    - src/content/ directory tree for all long-form and short-form collections
  affects:
    - Phase 4 use-case and industry content pages (consume useCase/industry collections)
    - Phase 6 blog/team/job/event/caseStudy pages (consume those collections)
    - scripts/check-translation-parity.ts (uses src/content/ directory structure)
tech_stack:
  added: []
  patterns:
    - Long-form bilingual collections via de/en subdirectories + locale enum field
    - Short-form bilingual collections via {de, en} sibling Zod object fields
    - Shared metadataDefinition() Zod helper reused across all 5 long-form schemas
key_files:
  created:
    - src/content/post/de/.gitkeep
    - src/content/post/en/.gitkeep
    - src/content/caseStudy/de/.gitkeep
    - src/content/caseStudy/en/.gitkeep
    - src/content/useCase/de/.gitkeep
    - src/content/useCase/en/.gitkeep
    - src/content/industry/de/.gitkeep
    - src/content/industry/en/.gitkeep
    - src/content/job/de/.gitkeep
    - src/content/job/en/.gitkeep
    - src/content/event/.gitkeep
    - src/content/team/.gitkeep
    - src/content/README.md
  modified:
    - src/content.config.ts
decisions:
  - "Long-form collections use glob '**/*.{md,mdx}' to match de/ and en/ subdirectories (D-09)"
  - "Short-form collections use {de, en} sibling Zod objects — no subdirectories needed (D-10)"
  - "Glob base paths moved from src/data/post to src/content/{collection} (D-11)"
  - "metadataDefinition() preserved and reused across all 5 long-form schemas (D-12)"
metrics:
  duration: "~2 min"
  completed: "2026-04-23"
  tasks_completed: 2
  files_created: 13
  files_modified: 1
---

# Phase 3 Plan 2: Content Collections — Schema + Directory Scaffold Summary

**One-liner:** 7 locale-aware Astro content collections registered with Zod schemas (long-form with locale/translationKey/canonicalKey, short-form with {de,en} sibling fields) and `src/content/` directory tree scaffolded with `.gitkeep` markers for all 12 collection directories.

## What Was Built

### Task 1: Rewrite src/content.config.ts with all 7 collections (commit: 59eba9d)

Replaced the single legacy `post` collection (pointing at `src/data/post`) with all 7 locale-aware collections:

**Long-form collections** (5) — each entry lives in `de/` or `en/` subdirectory:
- `post` — blog posts, glob base `src/content/post`
- `caseStudy` — customer case studies with customer/vertical/problem/approach/outcome fields
- `useCase` — product use-case pages with problemStatement/costAnchor/konvoiApproach fields
- `industry` — industry vertical landings with riskProfile/relatedUseCases fields
- `job` — job listings with department/type enum (fulltime/internship/initiative)/active fields

All long-form collections require: `locale: z.enum(['de', 'en'])`, `translationKey: z.string()`, `canonicalKey: z.string()`, and include `metadata: metadataDefinition()` for SEO.

**Short-form collections** (2) — single file with `{de, en}` sibling fields:
- `event` — upcoming events with `name: {de, en}`, `description: {de, en}` and shared singular date/location fields
- `team` — team members with `name: {de, en}`, `title: {de, en}`, `bio: {de, en}` and shared singular photo/contact fields

### Task 2: Scaffold src/content/ directory tree (commit: 110d096)

Created 12 directories with `.gitkeep` markers (Git does not track empty directories):
- 10 locale subdirectories for 5 long-form collections (de/ + en/ each)
- 2 flat directories for short-form collections (event/, team/)

Created `src/content/README.md` documenting:
- Long-form vs short-form authoring patterns
- Required frontmatter fields with examples
- CI parity check reference

## Verification

- `grep -c "defineCollection" src/content.config.ts` = 8 (7 calls + 1 import — all 7 collections defined)
- `z.enum(['de', 'en'])` appears exactly 5 times (one per long-form collection)
- `metadata: metadataDefinition()` appears exactly 5 times (one per long-form collection)
- All 12 `.gitkeep` files confirmed present
- `src/content/README.md` contains `translationKey` documentation
- pnpm build: node_modules not installed in worktree environment; structural correctness verified by file inspection. Orchestrator runs build gate after all agents complete.

## Deviations from Plan

None — plan executed exactly as written. The `grep -c "defineCollection"` count of 8 vs expected 7 in the plan is because the grep matches the import statement too; the actual collection definitions are exactly 7.

## Known Stubs

None. No content files exist yet — directories are intentionally empty pending content phases 4-6. The `.gitkeep` markers are intentional scaffolding, not stubs.

## Threat Flags

No new threat surface introduced. The threat model items from the plan are fully addressed:
- T-03-02-01: Zod schema enforces `locale: z.enum(['de', 'en'])` — typos fail at build time
- T-03-02-02: `email`/`phone` on team collection are `z.string().optional()` — no PII auto-collected
- T-03-02-03: Empty dirs with `.gitkeep` are benign for glob loaders (return 0 entries, no error)

## Self-Check: PASSED

Files created:
- src/content.config.ts — FOUND (modified)
- src/content/post/de/.gitkeep — FOUND
- src/content/post/en/.gitkeep — FOUND
- src/content/caseStudy/de/.gitkeep — FOUND
- src/content/team/.gitkeep — FOUND
- src/content/README.md — FOUND

Commits:
- 59eba9d — feat(03-02): expand content.config.ts to 7 locale-aware collections
- 110d096 — chore(03-02): scaffold src/content/ directory tree with .gitkeep markers
