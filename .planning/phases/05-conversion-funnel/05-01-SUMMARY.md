---
phase: 05-conversion-funnel
plan: 01
subsystem: data-layer
tags: [pricing, roi, i18n, thank-you-pages, foundation]
dependency_graph:
  requires:
    - 03-i18n-content-collections (translations.ts pattern, routeMap.ts stubs)
    - 02-brand-design-system (canonical.yaml, Tailwind primary token)
  provides:
    - src/data/pricing.ts (pricingTiers, roiFormulas, computeRoi, DE_MINIMIS_PERCENT)
    - Phase 5 i18n keys (pricing.*, roi.*, funding.*, form.*, thanks.*)
    - /danke and /en/thanks/ thank-you pages
  affects:
    - 05-02 (RoiCalculator imports roiFormulas from pricing.ts)
    - 05-03 (ConsultForm redirects to /danke or /en/thanks/)
    - 05-04 (FundingQualifierForm redirects to /danke or /en/thanks/)
tech_stack:
  added: []
  patterns:
    - YAML import via ambient *.yaml module declaration in env.d.ts
    - pricingTiers typed array re-exported from canonical.yaml (single source of truth)
    - computeRoi() as pure function — no side effects, safe for island rendering
key_files:
  created:
    - src/data/pricing.ts
    - src/pages/danke.astro
    - src/pages/en/thanks.astro
  modified:
    - src/i18n/translations.ts
    - src/env.d.ts
decisions:
  - "pricing.ts re-exports canonical.yaml tiers verbatim — no duplication of tier data"
  - "ROI multipliers are estimates; USER REVIEW REQUIRED comment added, sales sign-off deferred to pre-launch"
  - "YAML ambient module declaration added to env.d.ts (pre-existing TS error in produkt.astro also fixed)"
  - "routeMap.ts required no changes — Phase 3 stubs already had all Phase 5 route entries"
metrics:
  duration: ~8min
  completed: 2026-04-23
  tasks_completed: 2
  files_created: 3
  files_modified: 2
---

# Phase 05 Plan 01: Conversion Funnel Foundation Layer Summary

**One-liner:** Pricing tier data + ROI formula assumptions module sourced from canonical.yaml, all Phase 5 i18n strings (pricing/ROI/funding/forms/thanks) for DE and EN, and noindex thank-you pages at /danke and /en/thanks/ for Formspree redirect targets.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create src/data/pricing.ts | 9dc17c3 | src/data/pricing.ts, src/env.d.ts |
| 2 | Add Phase 5 i18n strings + thank-you pages | a8be853 | src/i18n/translations.ts, src/pages/danke.astro, src/pages/en/thanks.astro |

## What Was Built

### src/data/pricing.ts
Single source of truth for all Phase 5 data:
- `pricingTiers: PricingTier[]` — re-exports all three tiers from canonical.yaml (standard, camera-module, logbook) with typed interface
- `roiFormulas: Record<Vertical, VerticalAssumptions>` — per-vertical theft cost multipliers (high-value: €2000/yr 70%, cooling: €1200/yr 60%, intermodal: €800/yr 55%, other: €600/yr 50%)
- `computeRoi()` — pure function computing annualTheftCost, konvoiSavings, deMinimisReimbursement, paybackPeriodMonths from fleetSize + vertical + parkingFrequency
- `DE_MINIMIS_PERCENT: 80` — sourced from canonical.yaml funding.de_minimis_max_percent

### translations.ts (Phase 5 additions)
Added 60 new i18n keys across both locales:
- `pricing.*` (6 keys) — hero tagline/title/subtitle, tier CTA, price prefix/period
- `roi.*` (16 keys) — hero copy, all input/output labels, vertical names, CTA
- `funding.*` (9 keys) — hero copy, all section content, qualifier CTA, catalog ref
- `form.*` (20 keys) — all field labels, company size options, DSGVO consent, error messages, submit state
- `thanks.*` (4 keys) — title, subtitle, body, back-home link

### /danke and /en/thanks/ pages
Static confirmation pages for Formspree redirect targets:
- Both use PageLayout.astro with noindex/nofollow robots meta
- Display 24-hour SLA commitment message
- Link back to homepage (/ for DE, /en for EN)
- Use i18n t() function consistently with existing page pattern

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking Issue] Added *.yaml ambient module declaration to env.d.ts**
- **Found during:** Task 1 verification (`pnpm check:astro`)
- **Issue:** TypeScript error `ts(2307): Cannot find module '~/data/brand/canonical.yaml'` — pre-existing in produkt.astro and en/product.astro as well (21 errors before fix, 18 after for unrelated SensorDataViz.tsx JSX issues)
- **Fix:** Added `declare module '*.yaml' { const value: any; export default value; }` to src/env.d.ts
- **Files modified:** src/env.d.ts
- **Commit:** 9dc17c3

**Note on SensorDataViz.tsx:** 18 pre-existing TypeScript errors remain in src/components/islands/SensorDataViz.tsx (JSX IntrinsicElements — missing Preact/React JSX types). These are out of scope for this plan and logged to deferred items. The build succeeds (`pnpm build` exits 0) because astro-check is separate from the build pipeline.

## Known Stubs

| Stub | File | Line | Reason |
|------|------|------|--------|
| ROI multipliers (annualTheftCostPerTrailer, savingsFactor) | src/data/pricing.ts | 38-63 | Estimates from industry cost anchors — require sales team sign-off before launch. Comment added: "USER REVIEW REQUIRED". |
| monthlyKonvoiCostPerTrailer: 49 | src/data/pricing.ts | 40,47,54,61 | Placeholder €49/trailer/month — actual pricing is "auf Anfrage". Used only for payback period calculation display. |

These stubs do not prevent the plan's goal — the foundation layer is complete and all downstream plans (ROI calculator, forms, pages) can build against it. The stubs are intentional estimates, clearly commented, deferred for sales validation pre-launch.

## Threat Flags

None. Both trust boundaries in the threat model are addressed:
- T-05-01-02 (noindex on thank-you pages): `robots: { index: false, follow: false }` set on both danke.astro and en/thanks.astro.
- T-05-01-01 and T-05-01-03 are accepted per threat register.

## Self-Check: PASSED

- src/data/pricing.ts: FOUND
- src/pages/danke.astro: FOUND
- src/pages/en/thanks.astro: FOUND
- dist/danke/index.html: FOUND
- dist/en/thanks/index.html: FOUND
- Commit 9dc17c3: FOUND
- Commit a8be853: FOUND
