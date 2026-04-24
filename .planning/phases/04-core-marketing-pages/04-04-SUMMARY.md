---
phase: 04-core-marketing-pages
plan: 04
subsystem: content-collections
tags: [content, use-cases, i18n, copy, markdown]
dependency_graph:
  requires:
    - 03-i18n-content-collections  # useCase collection schema defined in Phase 3
  provides:
    - src/content/useCase/de/*      # 7 DE use-case entries
    - src/content/useCase/en/*      # 7 EN use-case entries
  affects:
    - 04-05-PLAN.md                 # Dynamic route pages consume these entries
    - 04-07-PLAN.md                 # Industry vertical pages cross-link via relatedIndustries
tech_stack:
  added: []
  patterns:
    - Astro content collection glob loader (existing, Phase 3)
    - YAML frontmatter with Zod schema validation
    - Bilingual long-form collection (locale: de/en per file)
    - translationKey shared across DE/EN pairs for language switcher
key_files:
  created:
    - src/content/useCase/de/ladungsdiebstahl.md
    - src/content/useCase/de/dieseldiebstahl.md
    - src/content/useCase/de/equipmentdiebstahl.md
    - src/content/useCase/de/transparenz.md
    - src/content/useCase/de/trailerschaeden.md
    - src/content/useCase/de/fahrerangriffe.md
    - src/content/useCase/de/standzeit.md
    - src/content/useCase/en/cargo-theft.md
    - src/content/useCase/en/diesel-theft.md
    - src/content/useCase/en/equipment-theft.md
    - src/content/useCase/en/operations-transparency.md
    - src/content/useCase/en/trailer-damage.md
    - src/content/useCase/en/driver-assaults.md
    - src/content/useCase/en/stationary-time.md
  modified: []
decisions:
  - "EN slug for stationary time is stationary-time-optimization (per routeMap.ts) — plan listed stationary-time but routeMap uses the longer form"
  - "ESLint pnpm check fails due to pre-existing worktree tsconfigRootDir issue — astro check (Zod schema validation) passes 0 errors; this is a known pre-existing environment issue unrelated to content files"
metrics:
  duration: 15
  completed_date: 2026-04-24
  tasks_completed: 1
  files_created: 14
  files_modified: 0
---

# Phase 4 Plan 04: UseCase Content Collection Files Summary

## One-liner

14 markdown useCase entries (7 DE + 7 EN) with Zod-validated frontmatter, preventive-positioning copy (400-600 words each), correct slugs matching routeMap.ts, and relatedIndustries cross-links to industry verticals.

## What Was Built

### 7 DE UseCase Entries

| File | Slug | translationKey | relatedIndustries |
|------|------|---------------|-------------------|
| ladungsdiebstahl.md | ladungsdiebstahl | cargo-theft | high-value, intermodal |
| dieseldiebstahl.md | dieseldiebstahl | diesel-theft | cooling, other |
| equipmentdiebstahl.md | equipmentdiebstahl | equipment-theft | high-value, intermodal, other |
| transparenz.md | transparenz-der-operationen | operations-transparency | intermodal, high-value, other |
| trailerschaeden.md | trailerschaeden | trailer-damage | cooling, intermodal, other |
| fahrerangriffe.md | fahrerangriffe | driver-assaults | high-value, cooling, other |
| standzeit.md | standzeit-optimierung | stationary-time | intermodal, other, cooling |

### 7 EN UseCase Entries

| File | Slug | translationKey | relatedIndustries |
|------|------|---------------|-------------------|
| cargo-theft.md | cargo-theft | cargo-theft | high-value, intermodal |
| diesel-theft.md | diesel-theft | diesel-theft | cooling, other |
| equipment-theft.md | equipment-theft | equipment-theft | high-value, intermodal, other |
| operations-transparency.md | operations-transparency | operations-transparency | intermodal, high-value, other |
| trailer-damage.md | trailer-damage | trailer-damage | cooling, intermodal, other |
| driver-assaults.md | driver-assaults | driver-assaults | high-value, cooling, other |
| stationary-time.md | stationary-time-optimization | stationary-time | intermodal, other, cooling |

### Frontmatter Fields Per Entry

All 14 files include:
- `locale` — de or en
- `translationKey` — shared across DE/EN pair (enables language switcher)
- `canonicalKey` — unique per entry ({translationKey}-{locale})
- `title` — localised page title
- `slug` — exact match to routeMap.ts path segment
- `problemStatement` — 1-2 sentence problem framing with cost anchor
- `costAnchor` — single striking number or stat
- `konvoiApproach` — 2-3 sentence KONVOI solution using approved verbs
- `relatedIndustries` — array of industry slugs for cross-linking
- `publishDate` — 2026-04-24
- `metadata.title` and `metadata.description` — SEO fields

### Copy Quality

Each file contains a 400-600 word markdown body structured per voice.md:
1. Scope/scale of the problem (with cost anchor)
2. How attackers exploit the vulnerability
3. Why reactive GPS-tracking fails
4. KONVOI's preventive approach
5. Outcomes for fleet operators

Approved verbs used throughout: "verhindert"/"prevents", "schützt"/"protects", "klassifiziert"/"classifies", "erkennt"/"detects", "schreckt ab"/"deters". No banned reactive verbs ("alertiert", "benachrichtigt", "reagiert") used as primary feature claims. B2B formal "Sie" tone in DE. British English in EN. KONVOI in ALL CAPS throughout.

## Verification Results

```
astro check: 0 errors, 0 warnings, 0 hints (115 files checked)
ls src/content/useCase/de/ | wc -l: 7
ls src/content/useCase/en/ | wc -l: 7
grep -r "translationKey: cargo-theft": 2 matches (DE + EN)
grep -r "translationKey: stationary-time": 2 matches (DE + EN)
grep -r "relatedIndustries" src/content/useCase/de/ | wc -l: 7
grep -rL "problemStatement" src/content/useCase/de/: (empty — all files have it)
```

Note: `pnpm check` (which includes ESLint) fails due to a pre-existing worktree `tsconfigRootDir` issue in the environment — 1082 ESLint errors all caused by multiple `.claude/worktrees/` directories confusing the TypeScript parser. This is unrelated to the content files created in this plan. The `astro check` command (which runs Zod schema validation on content collections) passes cleanly.

## Deviations from Plan

### Auto-fixed Issues

None — plan executed as written with one minor clarification:

**[Clarification] EN stationary-time slug uses full routeMap.ts value**
- **Found during:** Task 1 execution
- **Issue:** Plan frontmatter listed `slug: stationary-time` for the EN file, but routeMap.ts line 26 defines the EN path as `/en/use-cases/stationary-time-optimization`
- **Fix:** Used `slug: stationary-time-optimization` in `en/stationary-time.md` to match routeMap.ts exactly
- **Files modified:** src/content/useCase/en/stationary-time.md
- **Impact:** Correct — Plan 05 dynamic route `[slug].astro` will generate the correct URL `/en/use-cases/stationary-time-optimization`

## Known Stubs

None. All 14 files contain full production-quality copy. No placeholder text, no TODO comments, no hardcoded empty values. The `relatedIndustries` values reference industry slugs that will be populated by Plan 07 (industry vertical entries) — the slugs themselves are correct and will resolve when industry content is created.

## Threat Flags

No new threat surface introduced. All content is author-written markdown with no user input. Zod schema validation at build time enforces field types. relatedIndustries values are validated as string arrays — invalid slugs produce dead links but do not crash the build (T-04-04-01: accepted per plan threat model).

## Self-Check: PASSED

All 14 files exist on disk. Commit f9b1736 verified in git log.
