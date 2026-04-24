---
phase: 04-core-marketing-pages
plan: "07"
subsystem: content-collections
tags:
  - industry-verticals
  - content
  - i18n
  - zod-validation
dependency_graph:
  requires:
    - 04-06-PLAN (industry dynamic route pages that consume these entries)
    - 03-xx-PLAN (industryCollection schema defined in content.config.ts)
  provides:
    - src/content/industry/de/* (4 DE industry entries)
    - src/content/industry/en/* (4 EN industry entries)
  affects:
    - src/pages/branchen/[slug].astro (DE dynamic route — reads industryCollection)
    - src/pages/en/industries/[slug].astro (EN dynamic route — reads industryCollection)
tech_stack:
  added: []
  patterns:
    - locale+slug generateId prevents collection ID collision for shared slug values (intermodal)
    - relatedUseCases stores DE slugs in both locales; EN template resolves to EN hrefs via hardcoded map
    - riskProfile as optional YAML block scalar (|) for multi-line frontmatter strings
key_files:
  created:
    - src/content/industry/de/hochwertige-gueter.md
    - src/content/industry/de/kuehlgut.md
    - src/content/industry/de/intermodal.md
    - src/content/industry/de/sonstige.md
    - src/content/industry/en/high-value.md
    - src/content/industry/en/cooling.md
    - src/content/industry/en/intermodal.md
    - src/content/industry/en/other.md
  modified: []
decisions:
  - "relatedUseCases stores DE slugs in both locales (EN page template resolves via hardcoded map — no change needed in content files)"
  - "check:translations script does not exist in this repo — DE/EN parity verified manually via grep (all 4 translationKeys have exact DE+EN matches)"
  - "ESLint failures in pnpm check are pre-existing worktree tsconfig issue, not caused by these files — astro check exits 0 with no Zod errors"
metrics:
  duration_minutes: 6
  completed_date: "2026-04-24"
  tasks_completed: 1
  tasks_total: 1
  files_created: 8
  files_modified: 0
---

# Phase 04 Plan 07: Industry Vertical Content Files Summary

**One-liner:** 8 Zod-validated industry content collection entries (4 DE + 4 EN) with unique risk profiles, preventive-positioning body copy, and relatedUseCases cross-links for all 4 verticals.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create 8 industry markdown files (4 DE + 4 EN) | 24014aa | 8 files created |

## What Was Built

### 4 DE Industry Entries (`src/content/industry/de/`)

| File | slug | translationKey | relatedUseCases |
|------|------|---------------|-----------------|
| hochwertige-gueter.md | hochwertige-gueter | high-value | ladungsdiebstahl, fahrerangriffe, transparenz-der-operationen |
| kuehlgut.md | kuehlgut | cooling | dieseldiebstahl, trailerschaeden, fahrerangriffe |
| intermodal.md | intermodal | intermodal | transparenz-der-operationen, trailerschaeden, equipmentdiebstahl |
| sonstige.md | sonstige | other | ladungsdiebstahl, dieseldiebstahl, standzeit-optimierung |

### 4 EN Industry Entries (`src/content/industry/en/`)

| File | slug | translationKey | locale |
|------|------|---------------|--------|
| high-value.md | high-value | high-value | en |
| cooling.md | cooling | cooling | en |
| intermodal.md | intermodal | intermodal | en |
| other.md | other | other | en |

### Content Structure (per entry)

Each file follows the plan-specified body structure:
1. **Vertical overview** — segment definition and market context (TAPA 2024 figures where relevant)
2. **Unique risk profile** — specific threats that make KONVOI relevant for this vertical
3. **KONVOI's fit** — preventive approach mapped to the vertical's specific vulnerabilities
4. **Relevant use cases** — linked cross-references to 2-3 use-case pages (per D-17)

All copy uses preventive framing per voice.md (prevent/detect/classify/deter — no alert/track/respond). No exclamation marks. KONVOI always ALL CAPS. DE uses formal "Sie". EN uses British English.

## Verification Results

| Check | Result |
|-------|--------|
| `ls src/content/industry/de/` | 4 files |
| `ls src/content/industry/en/` | 4 files |
| `grep translationKey: high-value` | 2 matches (DE + EN) |
| `grep translationKey: intermodal` | 2 matches (DE + EN) |
| `grep riskProfile` in DE | 4 matches |
| `grep relatedUseCases` in DE | 4 matches |
| `grep slug: hochwertige-gueter` | 1 match |
| `grep slug: high-value` in EN | 1 match |
| `pnpm exec astro check` | 0 errors, 0 warnings |
| DE/EN translationKey parity | All 4 keys matched |

## Deviations from Plan

### Pre-existing Issue (Out of Scope)

**[Rule 3 - Blocked] `pnpm check` exits non-zero due to ESLint worktree tsconfig conflict**
- **Found during:** Task 1 verification
- **Issue:** ESLint reports 1082 errors on `vendor/integration/utils/loadConfig.ts` because multiple worktree tsconfig candidates exist in `.claude/worktrees/`. This is a pre-existing issue unrelated to this plan's files.
- **Fix:** Ran `pnpm exec astro check` instead — this isolates Zod content collection validation from the ESLint issue. Result: 0 errors, all 8 industry entries pass.
- **Logged to:** deferred-items — ESLint worktree tsconfig conflict needs resolution before Phase 7 CI gates.

### Script Not Found

**[Rule 1 - Info] `check:translations` script does not exist**
- **Found during:** Task 1 verification
- **Issue:** Plan references `pnpm run check:translations` but the script is not in `package.json`.
- **Fix:** DE/EN parity verified manually via `grep translationKey` — all 4 translationKeys have exact DE+EN pair matches. Parity confirmed.

## Known Stubs

None. All 8 files contain complete, production-quality copy. No placeholder text, hardcoded empty values, or TODO markers.

## Threat Flags

None. No new network endpoints, auth paths, file access patterns, or schema changes beyond the industryCollection already declared in content.config.ts.

## Self-Check: PASSED

- src/content/industry/de/hochwertige-gueter.md — FOUND
- src/content/industry/de/kuehlgut.md — FOUND
- src/content/industry/de/intermodal.md — FOUND
- src/content/industry/de/sonstige.md — FOUND
- src/content/industry/en/high-value.md — FOUND
- src/content/industry/en/cooling.md — FOUND
- src/content/industry/en/intermodal.md — FOUND
- src/content/industry/en/other.md — FOUND
- Commit 24014aa — FOUND
