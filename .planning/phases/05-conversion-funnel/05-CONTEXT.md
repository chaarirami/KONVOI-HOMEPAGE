# Phase 5: Conversion Funnel - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the conversion funnel: pricing page with three tiers, interactive ROI calculator, funding eligibility page explaining the de-minimis subsidy, and two lead-capture forms (ConsultForm + FundingQualifierForm) backed by Formspree with DSGVO compliance. After this phase, a visitor can understand pricing, estimate fleet savings, learn about 80% government funding, and submit a consult request or funding pre-qualification — with leads landing in Formspree end-to-end.

</domain>

<decisions>
## Implementation Decisions

### Pricing Page
- **D-01:** Show real "ab X EUR / pro Trailer / Monat" prices for all three tiers. Placeholder values ("X €") for now — user updates in `src/data/pricing.ts` before launch.
- **D-02:** Camera Module tier highlighted with accent border + "Empfohlen" / "Recommended" badge. Standard and Logbook tiers get equal, unhighlighted treatment.
- **D-03:** Pricing page layout follows B2B best practices: 3 cards side-by-side, generous whitespace, feature checklist per tier (checkmarks for included, dashes for not), each card ends with "Beratung anfragen" / "Book a consult" CTA.
- **D-04:** De-minimis funding teaser below the tier cards: "Bis zu 80% förderbar — mehr erfahren →" linking to `/foerderung/`.
- **D-05:** Customer logos or testimonial quote near bottom for trust reinforcement.

### ROI Calculator
- **D-06:** Placeholder formula assumptions hardcoded in `src/data/pricing.ts` using industry averages (TAPA €8B/yr figure extrapolated per vertical). Sales team updates values before launch.
- **D-07:** De-minimis reimbursement shown as secondary line in ROI output — product value (theft-cost savings) leads, subsidy sweetens the deal underneath.
- **D-08:** ROI calculator input UX, output presentation, and embed approach on pricing page: Claude's Discretion.

### Lead Capture Forms
- **D-09:** `ConsultForm` fields: name, email, phone, company name, fleet size, message (optional). Reusable across site (homepage, pricing, use-case pages).
- **D-10:** `FundingQualifierForm` fields: same base as ConsultForm + vertical dropdown + "interested in de-minimis funding" checkbox. Lives on funding page only.
- **D-11:** Both forms: Zod client-side validation, `_gotcha` honeypot + Cloudflare Turnstile, required unchecked DSGVO consent checkbox linking to `/datenschutz`, redirect to `/danke` (DE) or `/en/thanks/` (EN) on success, preserve all field values with clear inline error on failure.
- **D-12:** ROI → ConsultForm pre-fill contract (which params, encoding): Claude's Discretion.
- **D-13:** Formspree endpoint architecture (single vs separate forms): Claude's Discretion.

### Funding Page
- **D-14:** Marketing-first tone. Lead with savings hook: "80% Ihrer Investition wird vom Staat übernommen." Hard numbers: up to €2,000 per vehicle, max €33,000 per company per year.
- **D-15:** Use updated official program name: "Förderprogramm Umweltschutz und Sicherheit" (ehem. De-minimis), administered by BALM (Bundesamt für Logistik und Mobilität). Application period 2026 started April 14.
- **D-16:** Eligible measures include alarm systems, sensor systems, GPS tracking — Konvoi's product fits squarely under catalog category for theft prevention.
- **D-17:** Funding page cross-link to ROI calculator: Claude's Discretion.

### Claude's Discretion
- ROI calculator input format (sliders, dropdowns, number fields)
- ROI output presentation style (summary card, animated reveal, side-by-side)
- ROI calculator embed approach on pricing page (full vs compact)
- ROI → ConsultForm pre-fill param selection and encoding
- Formspree endpoint architecture (single shared vs separate per form)
- Funding → ROI cross-link implementation (embedded widget vs link)
- Preact island architecture and component boundaries
- Turnstile integration approach
- Form error message styling

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Requirements
- `.planning/REQUIREMENTS.md` — PRICE-01..04, ROI-01..05, FUND-01..04, FORMS-01..07 (20 requirements)

### Brand & Pricing Data
- `src/data/brand/canonical.yaml` — Tier slugs (standard, camera-module, logbook), pricing display values, contact emails
- `src/data/brand/voice.md` — Approved vs banned verbs for preventive positioning

### Prior Phase Decisions
- `.planning/phases/03-i18n-content-collections/03-CONTEXT.md` — i18n routing, routeMap.ts, translations.ts patterns
- `.planning/phases/04-core-marketing-pages/04-CONTEXT.md` — Component patterns, content collection usage, CTA approach

### i18n Infrastructure
- `src/i18n/routeMap.ts` — Routes already mapped: pricing, roi, funding, thanks
- `src/i18n/translations.ts` — UI string translations (needs Phase 5 string additions)

### Existing Components
- `src/components/widgets/Pricing.astro` — AstroWind pricing widget (needs full rewrite for Konvoi tiers)
- `src/components/widgets/CallToAction.astro` — CTA component (reusable)
- `src/components/ui/Form.astro` — AstroWind form primitive (reference for patterns)
- `src/pages/danke.astro` — Thank-you page already built (Phase 6)

### De-minimis Program References
- BALM official: `https://www.balm.bund.de/DE/Foerderprogramme/Gueterkraftverkehr/Deminimis/deminimis_node.html`
- Catalog detail: `https://www.deminimis.info/was-wird-gefoerdert/de-minimis-foerderung-diebstahl.php`
- Program handbook 2026: `https://www.deminimis.info/blog/das-neue-de-minimis-handbuch-2026-ist-da-alle-infos-zum-foerderprogramm-umweltschutz-und-sicherheit-in-2026/`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Pricing.astro` — AstroWind pricing widget with tier cards, ribbon support, feature lists. Needs rewrite but structure is a starting point.
- `CallToAction.astro` — End-of-page CTA block. Reusable on pricing, funding, ROI pages.
- `Form.astro` — AstroWind form primitive in `src/components/ui/`. Reference for field patterns.
- `WidgetWrapper.astro` — Standard section wrapper for consistent spacing.
- `danke.astro` + EN `thanks.astro` — Thank-you pages already built with translation support.

### Established Patterns
- Preact + `@astrojs/preact` already installed — first `.tsx` islands will be `RoiCalculator`, `ConsultForm`, `FundingQualifierForm`
- Tailwind v4 CSS-first config with `@theme` tokens
- `canonical.yaml` tier data with stable slugs — `pricing.ts` will extend this with formula assumptions
- i18n via `routeMap.ts` + `translations.ts` — routes already registered

### Integration Points
- `src/data/pricing.ts` — New file: tier data + ROI formula assumptions (single source of truth, per PRICE-03 and ROI-04)
- `src/pages/preise.astro` + `src/pages/en/pricing.astro` — Rewrite existing `pricing.astro`
- `src/pages/roi.astro` + `src/pages/en/roi.astro` — New pages
- `src/pages/foerderung.astro` + `src/pages/en/funding.astro` — New pages
- `src/pages/en/thanks.astro` — May need creation (EN thank-you page)
- `src/navigation.ts` — Add Pricing, Funding to nav
- `src/i18n/translations.ts` — Add Phase 5 UI strings (form labels, error messages, ROI labels)
- `astro.config.ts` — May need Turnstile domain in CSP (Phase 7 handles CSP formally)

</code_context>

<specifics>
## Specific Ideas

- Pricing follows per-vehicle/month pattern standard in fleet management industry (Samsara, EROAD, Geotab all use this)
- De-minimis program name officially changed to "Förderprogramm Umweltschutz und Sicherheit" — page should use both names for SEO and recognition
- Application period 2026 opened April 14 — time pressure is a conversion lever on the funding page
- Per-vehicle cap (€2,000) and per-company cap (€33,000/year) are hard numbers that should appear on the page
- ROI calculator is the first Preact island in the codebase — sets the pattern for interactive components

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-conversion-funnel*
*Context gathered: 2026-04-24*
