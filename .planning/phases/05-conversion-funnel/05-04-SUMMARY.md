---
phase: 05-conversion-funnel
plan: 04
subsystem: funding-wiring
tags: [funding, forms, islands, navigation, preact, i18n]
dependency_graph:
  requires:
    - src/components/islands/ConsultForm.tsx (Plan 03)
    - src/components/islands/RoiCalculator.tsx (Plan 02)
    - src/data/pricing.ts (Plan 01)
  provides:
    - src/components/islands/FundingQualifierForm.tsx
    - src/pages/foerderung.astro (/foerderung/)
    - src/pages/en/funding.astro (/en/funding/)
  affects:
    - src/pages/preise.astro (live island embeds)
    - src/pages/en/pricing.astro (live island embeds)
    - src/navigation.ts (Förderung/Funding nav links)
    - src/i18n/translations.ts (funding + form keys)
key-files:
  created:
    - src/components/islands/FundingQualifierForm.tsx
    - src/pages/foerderung.astro
    - src/pages/en/funding.astro
  modified:
    - src/pages/preise.astro
    - src/pages/en/pricing.astro
    - src/navigation.ts
    - src/i18n/translations.ts
---

## What Was Built

FundingQualifierForm Preact island extending ConsultForm pattern with vertical dropdown, company size dropdown, and funding interest checkbox. Posts to separate Formspree endpoint (PUBLIC_FORMSPREE_FUNDING_ID). Same protections: _gotcha honeypot, Turnstile, DSGVO z.literal(true) validation.

DE /foerderung/ and EN /en/funding/ pages with BALM 2026 program details: €2,000/vehicle cap, €33,000/company cap, April 14 – August 31 2026 deadline, catalog item 1.10 eligibility. ROI cross-link to /roi/ and /en/roi/.

Pricing pages updated: RoiCalculator embedded with client:visible, ConsultForm with client:load — replacing placeholder comments from Plans 01-03.

Navigation updated with Förderung/Funding links in both DE and EN headerData.

Calendar booking embed added to /danke and /en/thanks — conditional on PUBLIC_CAL_BOOKING_URL env var.

## Self-Check: PASSED

All acceptance criteria verified:
- FundingQualifierForm exports, honeypot, Turnstile, DSGVO validation present
- Funding pages contain BALM figures and ROI cross-links
- Pricing pages embed live islands (client:visible, client:load)
- Navigation includes Förderung/Funding
- Build: 93 pages, exits 0

## Deviations

- Calendar booking embed added to thank-you pages (user request during execution) — not in original plan
- Homepage link on thank-you pages changed to secondary/outline style to promote calendar CTA
