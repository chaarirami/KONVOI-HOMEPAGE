---
phase: 05-conversion-funnel
plan: "02"
subsystem: interactive-components
tags: [preact, roi-calculator, consult-form, formspree, turnstile, zod, pricing-pages]
dependency_graph:
  requires:
    - 05-01  # pricing.ts, computeRoi, pricingTiers, translations, thank-you pages
  provides:
    - RoiCalculator Preact island (src/components/islands/RoiCalculator.tsx)
    - ConsultForm Preact island (src/components/islands/ConsultForm.tsx)
    - DE pricing page (src/pages/preise.astro)
    - EN pricing page (src/pages/en/pricing.astro)
    - DE ROI standalone page (src/pages/roi.astro)
    - EN ROI standalone page (src/pages/en/roi.astro)
  affects:
    - 05-03  # funding page may embed ConsultForm
    - 05-04  # FundingForm may share patterns with ConsultForm
tech_stack:
  added:
    - zod@4.3.6 (Zod schema validation for ConsultForm)
    - Cloudflare Turnstile explicit render API (via CDN script in Astro page head)
    - Formspree client-side POST with Accept: application/json
  patterns:
    - Preact island with client:visible hydration
    - Single formData state object preserving values on validation error
    - ROI outputs derived on every render (no button click, no separate state)
    - URL query params pre-fill form via URLSearchParams
    - Locale prop drives redirect/link targets (not pathname detection)
key_files:
  created:
    - src/components/islands/RoiCalculator.tsx
    - src/components/islands/ConsultForm.tsx
    - src/pages/preise.astro
    - src/pages/en/pricing.astro
    - src/pages/roi.astro
    - src/pages/en/roi.astro
  modified:
    - src/i18n/translations.ts  # added pricing.roi_section_title + pricing.roi_section_subtitle (DE + EN)
    - package.json              # added zod dependency
    - pnpm-lock.yaml
decisions:
  - "Zod imported from 'zod' not 'astro/zod' in .tsx islands — astro/zod re-export not available in client context"
  - "Turnstile script tag placed in Astro page <head> via is:inline, not inside Preact island — island may not have DOM ready when script loads"
  - "pnpm build is authoritative gate — astro check shows pre-existing ts(7026) JSX errors in all .tsx files due to missing jsxImportSource in tsconfig; deferred as out-of-scope pre-existing issue"
  - "Commits made to worktree branch worktree-agent-adf38940 (not main) as required by parallel worktree execution"
metrics:
  duration: "~15 min"
  completed: "2026-04-23"
  tasks_completed: 2
  files_created: 6
  files_modified: 3
---

# Phase 05 Plan 02: ROI Calculator + Consult Form + Pricing Pages Summary

**One-liner:** Preact RoiCalculator island with live-derived outputs and ConsultForm island with Zod validation, Turnstile, DSGVO consent, and Formspree POST, wired into four pricing/ROI pages.

## What Was Built

### Task 1: RoiCalculator Preact Island

`src/components/islands/RoiCalculator.tsx` — reactive ROI calculator with:

- Fleet size input with explicit +/- buttons (min=1, no max) and number input
- Primary vertical dropdown (high-value, cooling, intermodal, other)
- Parking frequency range slider (1–30 stops/week), displays live value
- Output card with 4 metrics: annual theft cost (red), KONVOI savings (green), de-minimis reimbursement 80% (blue), payback period
- All outputs derived from `computeRoi()` on every render — no calculate button, no output state (RESEARCH.md Pitfall 4)
- Locale-aware currency formatting: `de-DE` → "1.234 €", `en-GB` → "€1,234"
- CTA "Book a consult with these numbers" links to `/preise#consult` or `/en/pricing#consult` with `?fleet=N&vertical=slug&savings=N` query params

**i18n addition:** Added `pricing.roi_section_title` and `pricing.roi_section_subtitle` keys (DE + EN) to `src/i18n/translations.ts` — these were referenced in the pricing page template but missing from the translations file.

### Task 2: ConsultForm Preact Island + Four Astro Pages

`src/components/islands/ConsultForm.tsx` — lead-capture form with:

- 6 fields: name, email, company, fleetSize, vertical (dropdown), message (optional)
- Zod schema validation on submit — inline field-level errors (FORMS-03)
- Single `formData` state object: values preserved on validation failure (FORMS-07 / Pitfall 3)
- `_gotcha` honeypot hidden via `display:none;position:absolute;left:-9999px` with `tabIndex={-1}` and `autoComplete="off"` (FORMS-04 / Pitfall 6)
- Cloudflare Turnstile explicit render in `useEffect` with `window.turnstile` guard (Pitfall 2), cleanup on unmount
- DSGVO consent checkbox (unchecked by default), links to `/datenschutz` or `/en/privacy/` based on locale prop (FORMS-05)
- URL param pre-fill on mount via `URLSearchParams` — `?fleet=N` → fleetSize, `?vertical=slug` → validated against allowlist before setting (Pitfall 5)
- Formspree POST with `Accept: application/json` header (Pitfall 1 — LOAD-BEARING)
- Redirect to `/danke` (DE) or `/en/thanks/` (EN) using `locale` prop, not pathname detection (Pitfall 7)

**Four Astro pages created:**

| Page | Route | Content |
|------|-------|---------|
| `src/pages/preise.astro` | `/preise` | DE pricing: hero, 3 tier cards (de_name/de_price/de_description), RoiCalculator, ConsultForm |
| `src/pages/en/pricing.astro` | `/en/pricing` | EN pricing: same structure with en_* fields |
| `src/pages/roi.astro` | `/roi` | DE standalone ROI calculator page |
| `src/pages/en/roi.astro` | `/en/roi` | EN standalone ROI calculator page |

Turnstile `<script is:inline ...>` tag with `?render=explicit` in each pricing page head.

## Verification Results

All plan verification checks passed:

| Check | Result |
|-------|--------|
| `computeRoi` imported in RoiCalculator | 3 matches |
| `Accept: application/json` in ConsultForm | 2 matches (header + comment) |
| `_gotcha` in ConsultForm | 8 matches |
| `dsgvoConsent` in ConsultForm | 9 matches |
| `URLSearchParams` in ConsultForm | 2 matches |
| `turnstile.render` in ConsultForm | 1 match |
| `client:visible` count in preise.astro | 2 (RoiCalculator + ConsultForm) |
| `pnpm build` exit code | 0 (50 pages built) |
| `dist/preise/index.html` | FOUND |
| `dist/en/pricing/index.html` | FOUND |
| `dist/roi/index.html` | FOUND |
| `dist/en/roi/index.html` | FOUND |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Functionality] Added missing i18n keys for pricing ROI section**
- **Found during:** Task 2 (pricing page uses `t('pricing.roi_section_title', locale)` and `t('pricing.roi_section_subtitle', locale)`)
- **Issue:** These two keys were referenced in the plan's page template but absent from `src/i18n/translations.ts`
- **Fix:** Added both keys to DE and EN translation objects
- **Files modified:** `src/i18n/translations.ts`
- **Commit:** `20c1333`

**2. [Rule 3 - Blocking Issue] Installed missing `zod` dependency**
- **Found during:** Task 2 (ConsultForm imports `z` from `'zod'`)
- **Issue:** `zod` was not in `package.json`; ConsultForm would fail to build without it
- **Fix:** `pnpm add zod` — added `zod@4.3.6`
- **Files modified:** `package.json`, `pnpm-lock.yaml`
- **Commit:** `20c1333`

**3. [Rule 3 - Blocking Issue] Worktree branch mis-target for initial commits**
- **Found during:** Post-Task 2 commit verification
- **Issue:** Initial commits (6530008, 6443fcc) went to `main` branch in main repo instead of `worktree-agent-adf38940` branch; the worktree uses a dedicated branch
- **Fix:** Re-committed all changes directly to the worktree branch (20c1333, a6d1063) with identical content
- **Files modified:** All task files re-committed to correct branch

## Deferred Items

**Pre-existing TypeScript JSX errors in `astro check`:** All `.tsx` files in the project show `ts(7026) JSX element implicitly has type 'any'` errors because the tsconfig does not set `"jsx": "react-jsx"` + `"jsxImportSource": "preact"`. This affects `SensorDataViz.tsx` and all new islands equally. The Vite/Astro build handles the JSX transform correctly — `pnpm build` passes. This is an existing project-wide configuration gap, not caused by this plan. Logged to deferred items.

## Known Stubs

- `PUBLIC_FORMSPREE_CONSULT_ID` env var defaults to `'REPLACE_WITH_FORMSPREE_ID'` — Formspree form must be created and ID set before the form goes live
- `PUBLIC_TURNSTILE_SITE_KEY` env var defaults to `'1x00000000000000000000AA'` (Cloudflare always-pass test key) — real site key required before launch
- Tier prices in cards show `"auf Anfrage"` / `"on request"` per `canonical.yaml` — intentional per PRICE-02 decision; actual prices to be filled before launch

## Threat Flags

No new threat surface beyond what was already modelled in the plan's `<threat_model>`. All STRIDE entries (T-05-02-01 through T-05-02-07) were implemented as planned.

## Self-Check: PASSED

- `src/components/islands/RoiCalculator.tsx`: FOUND
- `src/components/islands/ConsultForm.tsx`: FOUND
- `src/pages/preise.astro`: FOUND
- `src/pages/en/pricing.astro`: FOUND
- `src/pages/roi.astro`: FOUND
- `src/pages/en/roi.astro`: FOUND
- Commit `20c1333`: FOUND (worktree branch)
- Commit `a6d1063`: FOUND (worktree branch)
- `dist/preise/index.html`: FOUND (verified post-build)
- `dist/en/pricing/index.html`: FOUND (verified post-build)
- `dist/roi/index.html`: FOUND (verified post-build)
- `dist/en/roi/index.html`: FOUND (verified post-build)
