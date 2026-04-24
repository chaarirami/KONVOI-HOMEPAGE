---
phase: 05-conversion-funnel
plan: 01
subsystem: pricing-pages
tags: [pricing, data, astro, i18n, de, en]
dependency_graph:
  requires: []
  provides:
    - src/data/pricing.ts (pricingTiers, roiFormulas)
    - src/pages/preise.astro (/preise/)
    - src/pages/en/pricing.astro (/en/pricing/)
  affects:
    - src/pages/preise.astro
    - src/pages/en/pricing.astro
    - Plan 02 (RoiCalculator imports roiFormulas from pricing.ts)
    - Plan 03 (ConsultForm placeholder anchors)
tech_stack:
  added:
    - src/data/pricing.ts (TypeScript data module, new pattern for structured page data)
  patterns:
    - Single-source-of-truth data file (pricing.ts) consumed by both DE and EN pages
    - pricingTiers.map() for rendering dynamic card grids in static Astro pages
    - Placeholder WidgetWrapper sections with comments for future island hydration
key_files:
  created:
    - src/data/pricing.ts
    - src/pages/preise.astro
    - src/pages/en/pricing.astro
  modified: []
decisions:
  - Badge text (Empfohlen/Recommended) lives in pricing.ts data file, not hardcoded in page templates — consistent with single-source-of-truth principle
  - CallToAction uses subtitle prop (not tagline) for the secondary line — aligned with produkt.astro pattern
  - Placeholder WidgetWrapper sections for RoiCalculator and ConsultForm use HTML comments to signal Plan 02/03 wiring points
metrics:
  duration: 3 min
  completed_date: 2026-04-24
  tasks_completed: 2
  files_created: 3
  files_modified: 0
requirements:
  - PRICE-01
  - PRICE-02
  - PRICE-03
  - PRICE-04
---

# Phase 05 Plan 01: Pricing Data + Pages Summary

**One-liner:** Three-tier pricing pages (DE /preise/ + EN /en/pricing/) driven from a TypeScript single-source-of-truth with BALM 2026 ROI formula stubs.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create src/data/pricing.ts — tier data + ROI formula assumptions | f37f1b8 | src/data/pricing.ts |
| 2 | Create DE + EN pricing pages (/preise/ and /en/pricing/) | 37ab3be | src/pages/preise.astro, src/pages/en/pricing.astro |

## What Was Built

### src/data/pricing.ts
Single source of truth for all pricing and ROI calculator data. Exports:
- `pricingTiers` — array of 3 `PricingTier` objects (standard, camera-module, logbook) with full DE/EN copy, feature lists (included/excluded), and badge for camera-module ("Empfohlen" / "Recommended")
- `roiFormulas` — BALM 2026 de-minimis figures (80% rate, €2,000/vehicle, €33,000/company) + TAPA-based vertical formula assumptions (placeholder values; sales team to update before launch)

### src/pages/preise.astro (DE /preise/)
- Hero section with de-minimis funding hook in title
- Three-column pricing grid from `pricingTiers.map()` — camera-module highlighted with `border-2 border-primary` and "Empfohlen" badge
- De-minimis teaser paragraph linking to `/foerderung/`
- Placeholder WidgetWrapper sections for RoiCalculator (Plan 02) and ConsultForm (Plan 03) with `id` anchors
- Schumacher Logistik GmbH testimonial trust section
- CallToAction end block

### src/pages/en/pricing.astro (EN /en/pricing/)
- Mirror structure of DE page with English copy throughout
- De-minimis teaser links to `/en/funding/`
- "Recommended" badge on camera-module tier
- Same placeholder structure for Plans 02 and 03

## Verification Results

All 8 plan verification checks passed:
1. `pnpm build` exits 0 — 88 pages built (up from 86)
2. `pricingTiers` import confirmed in preise.astro
3. `pricingTiers` import confirmed in en/pricing.astro
4. `export const pricingTiers` in pricing.ts
5. `export const roiFormulas` in pricing.ts
6. "Empfohlen" renders in dist/preise/index.html (verified in built output)
7. `/foerderung/` link in preise.astro
8. `/en/funding/` link in en/pricing.astro

## Deviations from Plan

None — plan executed exactly as written.

The acceptance criteria noted "grep Empfohlen in preise.astro" but the badge text is in pricing.ts (the data file) and rendered via `{tier.de.badge}`. This is correct by design — the plan spec itself defines badge text in pricing.ts. Verified in built HTML output instead.

## Known Stubs

| Stub | File | Line | Reason |
|------|------|------|--------|
| `priceDisplay: 'auf Anfrage'` | src/data/pricing.ts | 35, 59, 81 | Prices are quote-based; sales team updates before launch (per PRICE-02) |
| `priceDisplay: 'on request'` | src/data/pricing.ts | 49, 71, 92 | Same as above — EN copy |
| `monthlyPriceEur: 150` | src/data/pricing.ts | 129 | Placeholder for ROI calculator; update before launch |
| RoiCalculator placeholder comment | src/pages/preise.astro | 75 | Wired in Plan 02 |
| RoiCalculator placeholder comment | src/pages/en/pricing.astro | 75 | Wired in Plan 02 |
| ConsultForm placeholder comment | src/pages/preise.astro | 82 | Wired in Plan 03 |
| ConsultForm placeholder comment | src/pages/en/pricing.astro | 82 | Wired in Plan 03 |

Note: The stubs above are **intentional** — the plan explicitly calls for placeholder sections for Plans 02 and 03. Pricing values are quote-based by product design. These stubs do not prevent the plan goal (three visible tiers, de-minimis teaser, trust section, CTA) from being achieved.

## Threat Flags

None — all content is compile-time static, no user input, no new network endpoints. Threat model for this plan (T-05-01-01 through T-05-01-03) all accepted.

## Self-Check: PASSED

- [x] src/data/pricing.ts exists
- [x] src/pages/preise.astro exists
- [x] src/pages/en/pricing.astro exists
- [x] Commit f37f1b8 exists
- [x] Commit 37ab3be exists
- [x] pnpm build exits 0 (88 pages)
