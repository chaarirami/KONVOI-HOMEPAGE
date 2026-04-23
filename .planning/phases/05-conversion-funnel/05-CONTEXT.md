# Phase 5: Conversion Funnel - Context

**Gathered:** 2026-04-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the conversion funnel: pricing page, ROI calculator, funding page, consult form, and funding qualifier form. Visitor can understand pricing, calculate fleet ROI with de-minimis subsidy, and submit a lead — all DE + EN, with Formspree integration end-to-end.

</domain>

<decisions>
## Implementation Decisions

### Pricing Page Layout
- **D-01:** Side-by-side tier cards (3 cards: Standard, + Camera Module, + Logbook). Each card shows tier name, "ab X EUR / Monat" price, feature list, and CTA. Mobile stacks vertically.
- **D-02:** Tier data sourced from `src/data/brand/canonical.yaml` `pricing.tiers` array (already has slug, de_name, en_name, de_price_display, en_price_display, de_description, en_description). Create `src/data/pricing.ts` that re-exports canonical pricing plus ROI formula assumptions — single source of truth per PRICE-03 and ROI-04.
- **D-03:** Pricing page embeds RoiCalculator island below tiers per ROI-01. Ends with ConsultForm per PRICE-04.

### ROI Calculator UX
- **D-04:** RoiCalculator is a Preact island (`src/components/islands/RoiCalculator.tsx`) using `client:visible`. Inputs: fleet size (number input with +/- buttons, min 1), primary vertical (dropdown: high-value/cooling/intermodal/other), average parking-stop frequency (slider: 1-30 stops/week).
- **D-05:** Output as summary card showing: estimated annual theft cost, estimated KONVOI savings, de-minimis reimbursement (80%), and payback period. All numbers formatted locale-aware (DE: 1.234,56 € / EN: €1,234.56).
- **D-06:** "Book a consult" button below ROI result pre-fills ConsultForm via URL query params: `?fleet={size}&vertical={slug}&savings={amount}`. Per ROI-05.
- **D-07:** Formula assumptions (theft cost per trailer per vertical, savings factor, de-minimis percentage) live in `src/data/pricing.ts`. Values from current-site-overview.md cost anchors.

### Form Architecture
- **D-08:** Both forms are Preact islands. ConsultForm: `src/components/islands/ConsultForm.tsx`. FundingQualifierForm: `src/components/islands/FundingQualifierForm.tsx`. Both use `client:visible`.
- **D-09:** Client-side POST to Formspree via `fetch()` — no page reload. On success: redirect to `/danke` (DE) or `/en/thanks/` (EN). On error: preserve all field values, show inline error message per FORMS-07.
- **D-10:** Zod validation on submit before POST. Schema validates required fields, email format, fleet size range. Inline error messages per field.
- **D-11:** Spam protection: hidden `_gotcha` honeypot field + Cloudflare Turnstile widget. Turnstile rendered explicitly via `turnstile.render()` callback — compatible with Preact island lifecycle.
- **D-12:** DSGVO consent: unchecked checkbox, required before submit, links to `/datenschutz` (DE) or `/en/privacy/` (EN). Per FORMS-05.
- **D-13:** ConsultForm fields: name, email, company, fleet size, vertical (dropdown), message (optional). Pre-fillable via URL params from ROI calculator.
- **D-14:** FundingQualifierForm fields: company name, company size (dropdown), fleet size, vertical, contact name, email, phone (optional). Per FUND-03.

### Funding Page
- **D-15:** Dedicated pages at `/foerderung/` (DE) + `/en/funding/` (EN). Explains 80% de-minimis subsidy citing catalog section 1.10 per FUND-02. Content from canonical.yaml `funding` object.
- **D-16:** Page embeds FundingQualifierForm island. Cross-links to ROI calculator per FUND-04.
- **D-17:** Content structure: what is de-minimis → eligibility criteria → how KONVOI qualifies → calculate your savings (link to ROI) → apply now (FundingQualifierForm).

### Thank-You Pages
- **D-18:** Create `/danke/` (DE) and `/en/thanks/` (EN) pages. Simple confirmation with "We'll contact you within 24 hours" SLA message, and link back to homepage.

### Claude's Discretion
- ROI formula calibration (exact multipliers per vertical) — use reasonable estimates, user reviews before launch
- Turnstile site key management — environment variable or hardcoded for static site
- Form field ordering and layout within islands
- Thank-you page visual design

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Pricing & ROI Data
- `src/data/brand/canonical.yaml` §pricing — tier slugs, names, prices, descriptions
- `src/data/brand/canonical.yaml` §funding — de-minimis percentage, catalog reference
- `.planning/current-site-overview.md` §4 — cost anchors per use case (€8B cargo, €2K diesel, €600/tyre)
- `.planning/REQUIREMENTS.md` §Pricing page — PRICE-01..04
- `.planning/REQUIREMENTS.md` §ROI calculator — ROI-01..05
- `.planning/REQUIREMENTS.md` §Funding — FUND-01..04
- `.planning/REQUIREMENTS.md` §Forms — FORMS-01..07

### Brand & Voice
- `src/data/brand/voice.md` — approved verbs, formal Sie, British EN
- `src/data/brand/canonical.yaml` §company — legal entity, contact info for forms

### Existing Patterns
- `src/components/islands/SensorDataViz.tsx` — reference Preact island pattern (fetch, loading states, error handling)
- `src/i18n/translations.ts` — translation key pattern for new pricing/ROI/form strings
- `src/i18n/routeMap.ts` — locked slugs for Phase 5 routes

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CallToAction.astro` — consult CTA widget, reuse on pricing and funding pages
- `SensorDataViz.tsx` — Preact island pattern with fetch, loading/error states, uPlot — reference for RoiCalculator and form islands
- `PageLayout.astro` — standard page layout with metadata
- `Hero.astro` — page hero with tagline/title/subtitle
- `Content.astro` — content sections with slots
- `canonical.yaml` — pricing tiers and funding data already defined

### Established Patterns
- Preact islands with `client:visible` for interactive components
- `t()` helper for i18n strings from translations.ts
- Content from canonical.yaml imported via `import brand from '~/data/brand/canonical.yaml'`
- Dynamic routes use `getStaticPaths()` + `getCollection()`

### Integration Points
- Navigation: pricing link currently `href: '#'` — update to `/preise/` (DE) and `/en/pricing/` (EN)
- Homepage CTA: already links to `mailto:info@konvoi.eu` — update to ConsultForm page or anchor
- Use-case pages: CTA section could embed ConsultForm or link to pricing
- routeMap.ts: add Phase 5 slugs (preise, roi, foerderung, danke)

</code_context>

<specifics>
## Specific Ideas

- Prices display as "auf Anfrage" / "on request" per canonical.yaml — no numeric prices yet
- ROI calculator should feel like a tool, not a form — immediate results as inputs change
- De-minimis explanation should be authoritative but not bureaucratic — cite the official catalog reference
- ConsultForm pre-fill from ROI should feel seamless — user sees their numbers carried over

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-conversion-funnel*
*Context gathered: 2026-04-23*
