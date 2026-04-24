---
phase: 05-conversion-funnel
plan: 02
subsystem: roi-calculator
tags: [preact, island, roi, calculator, i18n, conversion]
dependency_graph:
  requires:
    - 05-01 (pricing.ts with roiFormulas)
  provides:
    - src/components/islands/RoiCalculator.tsx
    - src/pages/roi.astro (/roi/)
    - src/pages/en/roi.astro (/en/roi/)
  affects:
    - src/i18n/translations.ts (ROI + pricing translation keys)
    - 05-03 (ConsultForm pre-fill — RoiCalculator navigates to /preise?fleet_size=X&vertical=Y&estimated_savings=Z)
tech_stack:
  added:
    - Preact island pattern (first TSX file in project — @astrojs/preact integration, automatic JSX runtime)
  patterns:
    - Input clamping for client-side user data (T-05-02-01 threat mitigation)
    - URLSearchParams pre-fill navigation to pricing page ConsultForm
    - roiFormulas imported from pricing.ts — no hardcoded formula values
key_files:
  created:
    - src/components/islands/RoiCalculator.tsx
    - src/pages/roi.astro
    - src/pages/en/roi.astro
  modified:
    - src/i18n/translations.ts (added roi.page_tagline/title/subtitle, roi.cta_calculate, roi.input_fleet_unit/placeholder, roi.input_vertical_placeholder, roi.disclaimer, pricing.deminimis_teaser for DE+EN)
decisions:
  - Preact island uses automatic JSX runtime via @astrojs/preact (no explicit h import needed)
  - frequency input captured in state but not yet wired into formula (plan spec: formula uses fleetSize + vertical only); frequency displayed as input for future formula extension
  - De-minimis cap: min(rawSubsidy, fleetSize*deMinimisMaxPerVehicle, deMinimisMaxPerCompany) per plan formula
  - client:load directive (not client:visible) per UI-SPEC § 7.2 — ROI calculator is primary page content
metrics:
  duration: 4min
  completed: 2026-04-24
  tasks_completed: 2
  files_created: 3
  files_modified: 1
---

# Phase 5 Plan 02: RoiCalculator Island + ROI Pages Summary

**One-liner:** Preact ROI calculator island reading roiFormulas from pricing.ts, computing 4 outputs (savings primary D-07, subsidy secondary D-07), with URLSearchParams pre-fill CTA to pricing ConsultForm; served on DE /roi/ and EN /en/roi/ standalone pages.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Add ROI translation keys + create RoiCalculator island | 3616c55 | src/i18n/translations.ts, src/components/islands/RoiCalculator.tsx |
| 2 | Create DE + EN ROI standalone pages | 524d59e | src/pages/roi.astro, src/pages/en/roi.astro |

## What Was Built

**RoiCalculator.tsx** — Preact island with:
- Inputs: fleet size (1–1000, clamped), vertical (4-option select), parking frequency (1–52, clamped)
- Formula sourced from `roiFormulas` in `src/data/pricing.ts` (no hardcoded values)
- Outputs: annual theft cost (neutral), Konvoi savings (green, primary D-07), de-minimis reimbursement (blue, secondary D-07), payback months
- De-minimis cap: `min(rawSubsidy, fleetSize * €2,000, €33,000)` — correctly implements BALM 2026 rules
- Pre-fill CTA: `URLSearchParams` → `/preise?fleet_size=X&vertical=Y&estimated_savings=Z` (DE) or `/en/pricing?...` (EN)
- Changing any input clears result, forcing recalculation
- Input clamping applied before formula use (T-05-02-01 mitigation)

**ROI pages** — both use Hero + WidgetWrapper + CallToAction pattern with `client:load` directive.

## Verification Results

All 7 plan verification checks pass:
1. `pnpm build` exits 0 — 90 pages built
2. `export default function RoiCalculator` — present in island
3. `roiFormulas` imported from pricing.ts — present
4. `estimated_savings` URL param — present (correct pre-fill param name per UI-SPEC § 7.4)
5. `roi.cta_calculate` — 2 matches in translations.ts (DE + EN)
6. `client:load` in src/pages/roi.astro — present
7. `client:load` in src/pages/en/roi.astro — present

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all four calculator outputs are computed from roiFormulas; no hardcoded placeholder values flow to the UI.

## Threat Flags

No new threat surface beyond what the plan's threat model covered. The RoiCalculator island introduces client-side URLSearchParams navigation (T-05-02-02, accepted), client-visible formula constants (T-05-02-03, accepted), and user input → formula computation (T-05-02-01, mitigated via clamping). No new endpoints or auth paths introduced.

## Self-Check: PASSED

- `src/components/islands/RoiCalculator.tsx` — FOUND
- `src/pages/roi.astro` — FOUND
- `src/pages/en/roi.astro` — FOUND
- Commit 3616c55 — FOUND
- Commit 524d59e — FOUND
