---
phase: 05-conversion-funnel
verified: 2026-04-26T12:30:00Z
status: human_needed
score: 5/5
overrides_applied: 0
human_verification:
  - test: "Visual check: /preise/ shows 3 tier cards with Camera Module highlighted and 'Empfohlen' badge; /en/pricing/ shows 'Recommended' badge"
    expected: "Three cards in a row, Camera Module has accent border and badge, prices say 'auf Anfrage' / 'on request'"
    why_human: "Visual layout, badge positioning, and card alignment cannot be verified programmatically"
  - test: "ROI calculator end-to-end: Visit /roi/, enter 50 trailers + Hochwerttransporte + click Berechnen, then click 'Jetzt Beratung buchen'"
    expected: "4 result rows appear (theft cost, savings in green, subsidy in blue, payback months); clicking CTA navigates to /preise/?fleet_size=50&vertical=high_value&estimated_savings=210000; ConsultForm fleet_size pre-filled with 50, message contains 'Geschaetztes Einsparpotenzial'"
    why_human: "Client-side Preact hydration, state management, URL navigation, and pre-fill reading require a running browser"
  - test: "Form validation: On /preise/ ConsultForm, click submit with empty fields; then fill all but leave DSGVO unchecked"
    expected: "Inline red error messages below each required field; DSGVO error 'Bitte stimmen Sie der Datenschutzerklaerung zu.' shown"
    why_human: "Client-side Zod validation and inline error rendering require browser execution"
  - test: "End-to-end lead capture gate: Fill ConsultForm or FundingQualifierForm completely with test data, check DSGVO, submit"
    expected: "Browser redirects to /danke (DE) or /en/thanks (EN); submission appears in Formspree dashboard"
    why_human: "Requires Formspree account configured with PUBLIC_FORMSPREE_CONSULT_ID and PUBLIC_FORMSPREE_FUNDING_ID env vars; external service integration"
  - test: "Funding page content: Visit /foerderung/ and /en/funding/"
    expected: "BALM program details visible: euro 2,000/vehicle, euro 33,000/company, April 14 - Aug 31 2026 deadline; ROI cross-link to /roi/ works; FundingQualifierForm renders with vertical and company size dropdowns"
    why_human: "Visual layout and form rendering require browser"
---

# Phase 5: Conversion Funnel Verification Report

**Phase Goal:** A visitor can understand pricing, calculate their fleet's ROI including the 80% de-minimis subsidy, and submit a consult request or funding pre-qualification -- with a live lead landing in Formspree end-to-end
**Verified:** 2026-04-26T12:30:00Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | DE /preise/ + EN /en/pricing/ display three tiers (Standard, + Camera Module, + Logbook) with prices sourced from src/data/pricing.ts, ending with the consult CTA | VERIFIED | preise.astro imports pricingTiers from ~/data/pricing (line 6), iterates via pricingTiers.map() (line 30), renders tier.de.name/priceDisplay/features; en/pricing.astro mirrors with tier.en.*; pricing.ts exports 3 tiers with slugs standard, camera-module, logbook; camera-module has highlighted:true and badge:'Empfohlen'/'Recommended'; each card links to #consult-form with t('cta.book_consult'); CallToAction at bottom links to #consult-form |
| 2 | RoiCalculator Preact island on /roi/ + /en/roi/ (and embedded on pricing pages) accepts fleet size + vertical + parking frequency and outputs estimated annual theft cost, Konvoi savings, de-minimis reimbursement, and payback period | VERIFIED | RoiCalculator.tsx: 3 inputs (fleetSize number 1-1000, vertical select 4 options, frequency number 1-52); calculateRoi() imports roiFormulas from pricing.ts (line 8), computes annualTheftCost, konvoiSavings (green), deMinimisReimbursement (blue, capped via Math.min), paybackMonths; roi.astro and en/roi.astro embed with client:load embedMode="full"; preise.astro and en/pricing.astro embed with client:visible embedMode="compact" |
| 3 | Clicking "Book a consult" from ROI result pre-fills ConsultForm via URL query params (fleet size, vertical, estimated savings) -- cross-component contract works end-to-end in both locales | VERIFIED | RoiCalculator.tsx handleBookConsult() (line 65-73): builds URLSearchParams with fleet_size, vertical, estimated_savings; navigates to /preise?... (DE) or /en/pricing?... (EN). ConsultForm.tsx useEffect (line 41-54): reads fleet_size and estimated_savings from URLSearchParams on mount; pre-fills fleet_size field and message with formatted savings string. Both components use matching param names. |
| 4 | DE /foerderung/ + EN /en/funding/ explain the 80% de-minimis subsidy with FundingQualifierForm capturing company details via Formspree with DSGVO consent, and cross-link to ROI calculator | VERIFIED | foerderung.astro: BALM program name, "80% Ihrer Investition" hook, euro 2.000/vehicle, euro 33.000/company, "14. April - 31. August 2026" deadline, catalog 1.10 eligibility, ROI link href="/roi/" (line 89); FundingQualifierForm client:load (line 102). en/funding.astro: mirrors in English with href="/en/roi/" (line 89), FundingQualifierForm client:load (line 102). FundingQualifierForm.tsx: posts to PUBLIC_FORMSPREE_FUNDING_ID, has vertical dropdown, company_size dropdown, funding_interest checkbox, DSGVO z.literal(true) validation. |
| 5 | Both forms validate client-side with Zod, include _gotcha honeypot + Cloudflare Turnstile, require unchecked DSGVO consent checkbox linking to /datenschutz, redirect to /danke or /en/thanks/ on success, preserve field values with clear inline error on failure. Gate: at least one lead captured end-to-end through Formspree. | VERIFIED (code) | ConsultForm.tsx: Zod schema with z.literal(true) for dsgvo_consent (line 23); _gotcha hidden input (line 270); .cf-turnstile div with PUBLIC_TURNSTILE_SITEKEY (line 273); DSGVO checkbox links to /datenschutz (line 289); redirect to /danke or /en/thanks on response.ok (line 127); errors preserved via setErrors state (line 98-99), submitError on failure (line 129); isSubmitting false in finally block. FundingQualifierForm.tsx: identical protections -- Zod z.literal(true) (line 27), _gotcha (line 331), .cf-turnstile (line 334), /datenschutz link (line 350), redirect (line 121), error preservation (line 88-89). GATE NOTE: End-to-end Formspree lead capture requires human verification with configured env vars. |

**Score:** 5/5 truths verified (code-level)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/data/pricing.ts` | Tier data (3 tiers) + ROI formula assumptions | VERIFIED | 163 lines; exports pricingTiers (3 tiers) and roiFormulas with BALM 2026 figures |
| `src/pages/preise.astro` | DE pricing page at /preise/ | VERIFIED | 113 lines; imports pricingTiers, RoiCalculator (client:visible), ConsultForm (client:load) |
| `src/pages/en/pricing.astro` | EN pricing page at /en/pricing/ | VERIFIED | 113 lines; mirrors DE with en locale |
| `src/components/islands/RoiCalculator.tsx` | Preact island: ROI calculator | VERIFIED | 226 lines; imports roiFormulas, 3 inputs, 4 outputs, URLSearchParams pre-fill CTA |
| `src/pages/roi.astro` | DE standalone ROI page at /roi/ | VERIFIED | 37 lines; RoiCalculator client:load locale="de" embedMode="full" |
| `src/pages/en/roi.astro` | EN standalone ROI page at /en/roi/ | VERIFIED | 37 lines; RoiCalculator client:load locale="en" embedMode="full" |
| `src/components/islands/ConsultForm.tsx` | Preact island: consult request form | VERIFIED | 316 lines; Zod validation, _gotcha, Turnstile, DSGVO, Formspree POST, pre-fill |
| `src/pages/en/thanks.astro` | EN thank-you page at /en/thanks/ | VERIFIED | 58 lines; locale='en', index:false, t('thanks.*'), href="/en", calendar embed |
| `src/pages/danke.astro` | DE thank-you page at /danke | VERIFIED | 57 lines; locale='de', index:false, t('thanks.*'), href="/", calendar embed |
| `src/components/islands/FundingQualifierForm.tsx` | Preact island: funding pre-qualification form | VERIFIED | 378 lines; extends ConsultForm with vertical, company_size, funding_interest; PUBLIC_FORMSPREE_FUNDING_ID |
| `src/pages/foerderung.astro` | DE funding page at /foerderung/ | VERIFIED | 112 lines; BALM details, FundingQualifierForm client:load, ROI cross-link |
| `src/pages/en/funding.astro` | EN funding page at /en/funding/ | VERIFIED | 112 lines; mirrors DE with en locale |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| preise.astro | src/data/pricing.ts | `import { pricingTiers }` | WIRED | Line 6 imports, line 30 maps over tiers |
| en/pricing.astro | src/data/pricing.ts | `import { pricingTiers }` | WIRED | Line 6 imports, line 30 maps over tiers |
| RoiCalculator.tsx | src/data/pricing.ts | `import { roiFormulas }` | WIRED | Line 8 imports, used in calculateRoi() lines 39-46 |
| roi.astro | RoiCalculator.tsx | `import + client:load` | WIRED | Line 6 imports, line 27 embeds with client:load |
| en/roi.astro | RoiCalculator.tsx | `import + client:load` | WIRED | Line 6 imports, line 27 embeds with client:load |
| preise.astro | RoiCalculator.tsx | `import + client:visible` | WIRED | Line 8 imports, line 84 embeds with client:visible |
| en/pricing.astro | RoiCalculator.tsx | `import + client:visible` | WIRED | Line 8 imports, line 84 embeds with client:visible |
| preise.astro | ConsultForm.tsx | `import + client:load` | WIRED | Line 9 imports, line 93 embeds with client:load |
| en/pricing.astro | ConsultForm.tsx | `import + client:load` | WIRED | Line 9 imports, line 93 embeds with client:load |
| ConsultForm.tsx | Formspree | `fetch POST` | WIRED | Line 122-125: fetch to formspree.io/f/$ID with FormData |
| foerderung.astro | FundingQualifierForm.tsx | `import + client:load` | WIRED | Line 6 imports, line 102 embeds with client:load |
| en/funding.astro | FundingQualifierForm.tsx | `import + client:load` | WIRED | Line 6 imports, line 102 embeds with client:load |
| FundingQualifierForm.tsx | Formspree | `fetch POST` | WIRED | Line 116-118: fetch to formspree.io/f/$FUNDING_ID |
| foerderung.astro | /roi/ | `href="/roi/"` | WIRED | Line 89: text link with t('funding.roi_link') |
| en/funding.astro | /en/roi/ | `href="/en/roi/"` | WIRED | Line 89: text link with t('funding.roi_link') |
| RoiCalculator.tsx | ConsultForm.tsx | URLSearchParams pre-fill | WIRED | ROI lines 67-72 write params; ConsultForm lines 42-53 read params |
| navigation.ts | /foerderung | headerDataDe.links | WIRED | Line 29: Foerderung link |
| navigation.ts | /en/funding | headerDataEn.links | WIRED | Line 72: Funding link |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|-------------------|--------|
| preise.astro | pricingTiers | src/data/pricing.ts | Yes -- 3 tier objects with full DE/EN copy | FLOWING |
| en/pricing.astro | pricingTiers | src/data/pricing.ts | Yes -- same source | FLOWING |
| RoiCalculator.tsx | roiFormulas | src/data/pricing.ts | Yes -- BALM 2026 figures (0.8, 2000, 33000, vertical formulas) | FLOWING |
| ConsultForm.tsx | URL params | RoiCalculator URLSearchParams | Yes -- fleet_size, estimated_savings parsed on mount | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build succeeds | pnpm build | 93 pages built in 12.49s, exit 0 | PASS |
| pricing.ts exports pricingTiers | grep 'export const pricingTiers' src/data/pricing.ts | Match found | PASS |
| pricing.ts exports roiFormulas | grep 'export const roiFormulas' src/data/pricing.ts | Match found | PASS |
| RoiCalculator imports roiFormulas | grep 'roiFormulas' src/components/islands/RoiCalculator.tsx | Line 8: import present | PASS |
| ConsultForm has _gotcha | grep '_gotcha' src/components/islands/ConsultForm.tsx | Lines 114, 270: present | PASS |
| ConsultForm has Turnstile | grep 'cf-turnstile' src/components/islands/ConsultForm.tsx | Line 273: present | PASS |
| ConsultForm has z.literal(true) | grep 'z.literal' src/components/islands/ConsultForm.tsx | Line 23: z.literal(true) | PASS |
| FundingQualifierForm has separate endpoint | grep 'PUBLIC_FORMSPREE_FUNDING_ID' src/components/islands/FundingQualifierForm.tsx | Line 117: present | PASS |
| Both forms link to /datenschutz | grep '/datenschutz' src/components/islands/*.tsx | ConsultForm line 289, FundingQualifierForm line 350 | PASS |
| Nav has Funding links | grep 'Funding\|Foerderung' src/navigation.ts | Lines 29 (Foerderung), 72 (Funding) | PASS |
| ROI keys in both locales | grep 'roi.cta_calculate' translations.ts | 2 matches (DE + EN) | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-----------|-------------|--------|----------|
| PRICE-01 | 05-01 | DE + EN pricing page | SATISFIED | preise.astro + en/pricing.astro exist and render |
| PRICE-02 | 05-01 | Three tiers with prices | SATISFIED | pricingTiers has 3 tiers; prices show "auf Anfrage"/"on request" (by design) |
| PRICE-03 | 05-01 | Tier data sourced from src/data/pricing.ts | SATISFIED | Both pages import pricingTiers from ~/data/pricing |
| PRICE-04 | 05-01 | Pricing page ends with consult CTA | SATISFIED | CallToAction at bottom of both pages links to #consult-form |
| ROI-01 | 05-02 | Interactive ROI calculator on /roi/ + /en/roi/ + embedded on pricing | SATISFIED | RoiCalculator.tsx island; standalone pages + embedded on pricing (client:visible) |
| ROI-02 | 05-02 | Inputs: fleet size, vertical, parking frequency | SATISFIED | 3 inputs in RoiCalculator: fleetSize, vertical, frequency |
| ROI-03 | 05-02 | Outputs: theft cost, savings, de-minimis, payback | SATISFIED | 4 output rows rendered in results section |
| ROI-04 | 05-02 | Formula assumptions in src/data/pricing.ts | SATISFIED | roiFormulas imported, not hardcoded |
| ROI-05 | 05-02 | ROI result pre-fills ConsultForm via URL query params | SATISFIED | handleBookConsult builds URLSearchParams; ConsultForm useEffect reads them |
| FUND-01 | 05-04 | DE + EN funding page at /foerderung/ + /en/funding/ | SATISFIED | Both pages exist with full content |
| FUND-02 | 05-04 | Page explains 80% de-minimis subsidy | SATISFIED | BALM program name, 80% rate, catalog 1.10 all present |
| FUND-03 | 05-04 | FundingQualifierForm captures company details via Formspree with DSGVO | SATISFIED | FundingQualifierForm has vertical, company_size, funding_interest, DSGVO, Formspree POST |
| FUND-04 | 05-04 | Funding page cross-links to ROI calculator | SATISFIED | foerderung.astro href="/roi/"; en/funding.astro href="/en/roi/" |
| FORMS-01 | 05-03 | ConsultForm reusable Preact island | SATISFIED | ConsultForm.tsx is standalone island, embedded on pricing pages |
| FORMS-02 | 05-04 | FundingQualifierForm on funding page | SATISFIED | FundingQualifierForm.tsx embedded on foerderung.astro and en/funding.astro |
| FORMS-03 | 05-03 | Both forms validate with Zod | SATISFIED | ConsultForm: buildConsultSchema with z.object; FundingQualifierForm: buildFundingSchema with z.object |
| FORMS-04 | 05-03 | _gotcha honeypot + Cloudflare Turnstile on both forms | SATISFIED | Both have _gotcha input and .cf-turnstile div |
| FORMS-05 | 05-03 | DSGVO consent checkbox linking to /datenschutz | SATISFIED | Both forms: z.literal(true), checkbox, href="/datenschutz" |
| FORMS-06 | 05-03 | Success redirects to /danke or /en/thanks/ | SATISFIED | Both forms: window.location.href on response.ok |
| FORMS-07 | 05-03 | Error preserves field values with inline error | SATISFIED | setErrors maps Zod issues; submitError for network errors; isSubmitting in finally block |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| src/data/pricing.ts | 10, 134, 149, 152 | "placeholder" comments about launch config | Info | Intentional -- prices are quote-based ("auf Anfrage"); monthlyPriceEur=150 is a sales-team config item. Not a code stub. |
| src/pages/preise.astro | 79 | Stale comment "ROI Calculator embed placeholder -- wired in Plan 02" | Info | Comment is stale but the actual RoiCalculator island IS embedded on line 84. No functional impact. |

### Human Verification Required

### 1. Visual Layout and Badge Rendering

**Test:** Visit /preise/ and /en/pricing/ in a browser
**Expected:** Three tier cards in a row; Camera Module card has accent border (border-2 border-primary) and "Empfohlen"/"Recommended" badge floating above the card
**Why human:** Visual layout, CSS border rendering, badge positioning require browser rendering

### 2. ROI Calculator End-to-End Flow

**Test:** Visit /roi/, enter 50 trailers + Hochwerttransporte, click "Berechnen", then click "Jetzt Beratung buchen"
**Expected:** 4 result rows appear (theft cost neutral, savings green, subsidy blue, payback months); clicking CTA navigates to /preise/?fleet_size=50&vertical=high_value&estimated_savings=210000; on the pricing page, ConsultForm fleet_size field shows 50, message field contains "Geschaetztes Einsparpotenzial: euro 210.000"
**Why human:** Client-side Preact hydration, state computation, URL navigation, and pre-fill require a running browser

### 3. Form Validation Behavior

**Test:** On /preise/ ConsultForm, click submit with all fields empty; then fill all fields but leave DSGVO unchecked
**Expected:** Step 1: Inline red error messages appear below each required field (name, email, company, fleet_size, dsgvo_consent). Step 2: Only DSGVO error appears. No browser-native validation alerts.
**Why human:** Client-side Zod validation, inline error rendering, and error clearing on edit require browser execution

### 4. End-to-End Lead Capture (PHASE 5 GATE)

**Test:** Configure .env.local with PUBLIC_FORMSPREE_CONSULT_ID, PUBLIC_FORMSPREE_FUNDING_ID, PUBLIC_TURNSTILE_SITEKEY; run pnpm dev; fill and submit either form with test data
**Expected:** Browser redirects to /danke or /en/thanks; submission appears in Formspree dashboard
**Why human:** Requires configured Formspree account and Cloudflare Turnstile; external service integration cannot be tested without credentials

### 5. Funding Page Content Verification

**Test:** Visit /foerderung/ and /en/funding/
**Expected:** BALM program details visible: euro 2.000/vehicle (DE) / euro 2,000 (EN), euro 33.000/company (DE) / euro 33,000 (EN), "14. April - 31. August 2026" deadline, catalog 1.10 eligibility, ROI cross-link navigates to /roi/ (DE) or /en/roi/ (EN), FundingQualifierForm renders with vertical and company size dropdowns
**Why human:** Visual layout and form rendering require browser

### Gaps Summary

No code-level gaps found. All 5 success criteria are satisfied at the code and wiring level. All 20 requirement IDs (PRICE-01..04, ROI-01..05, FUND-01..04, FORMS-01..07) have implementation evidence.

The Phase 5 gate ("at least one lead captured end-to-end through Formspree") requires human verification because it depends on external service configuration (Formspree form IDs, Cloudflare Turnstile site key) that cannot be tested without credentials.

One informational note: the navigation does not include ROI Rechner/ROI Calculator links (the plan suggested these as optional). This does not affect any success criteria or requirements.

---

_Verified: 2026-04-26T12:30:00Z_
_Verifier: Claude (gsd-verifier)_
