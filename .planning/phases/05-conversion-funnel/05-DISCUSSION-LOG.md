# Phase 5: Conversion Funnel - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-24
**Phase:** 05-conversion-funnel
**Areas discussed:** Pricing tiers & display, ROI calculator experience, Lead capture form fields, Funding page narrative

---

## Pricing Tiers & Display

### Pricing display approach

| Option | Description | Selected |
|--------|-------------|----------|
| "auf Anfrage" with feature comparison | Keep quote-based, focus on feature differentiation | |
| Real "ab X EUR / Monat" prices | Show starting-at prices with placeholder values | ✓ |
| Hybrid | Starting-at for Standard only, "auf Anfrage" for add-ons | |

**User's choice:** Real prices with placeholder "X €" values, user updates before launch.
**Notes:** None.

### Tier visual emphasis

| Option | Description | Selected |
|--------|-------------|----------|
| Highlight Standard | "Beliebt" badge, encourages entry | |
| Highlight Camera Module | "Empfohlen" badge, pushes upsell | ✓ |
| No highlight | Equal visual weight | |
| You decide | Claude picks | |

**User's choice:** Highlight Camera Module with "Empfohlen" / "Recommended" badge.
**Notes:** User also requested research on how pricing pages are designed online. Web research conducted — key findings applied: 3 cards, whitespace, feature checklist, per-tier CTA, trust elements.

---

## ROI Calculator Experience

### Input format

| Option | Description | Selected |
|--------|-------------|----------|
| Sliders + dropdowns | Visual, engaging, fewer errors | |
| Number fields + dropdowns | Faster for knowledgeable users | |
| Guided wizard | Step-by-step, more hand-holding | |
| You decide | Claude picks | ✓ |

**User's choice:** Claude's discretion.
**Notes:** None.

### Output presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Single summary card | Clean and scannable | |
| Animated reveal | Numbers count up, dramatic | |
| Side-by-side comparison | "Without vs With Konvoi" | |
| You decide | Claude picks | ✓ |

**User's choice:** Claude's discretion.
**Notes:** None.

### Formula assumptions

| Option | Description | Selected |
|--------|-------------|----------|
| Placeholder assumptions | Industry averages, sales updates later | ✓ |
| Skip formula entirely | Qualitative estimates only | |
| You decide | Claude picks | |

**User's choice:** Placeholder assumptions using TAPA data, sales team updates values in pricing.ts before launch.
**Notes:** None.

### Calculator placement

| Option | Description | Selected |
|--------|-------------|----------|
| Full calculator on both | Same component on /roi/ and /preise/ | |
| Compact on pricing, full on /roi/ | Smaller "quick estimate" on pricing page | |
| You decide | Claude picks | ✓ |

**User's choice:** Claude's discretion.
**Notes:** None.

### De-minimis prominence in ROI

| Option | Description | Selected |
|--------|-------------|----------|
| Hero number | Subsidy is biggest, most emphasized figure | |
| Equal weight | Three equal figures | |
| Secondary line | Product value leads, subsidy underneath | ✓ |
| You decide | Claude picks | |

**User's choice:** Product value first, de-minimis as bonus underneath.
**Notes:** User rationale: sell on product merit, subsidy sweetens.

---

## Lead Capture Form Fields

### ConsultForm fields

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal | Name, email, phone, message | |
| Qualified | Name, email, phone, company, fleet size, message | ✓ |
| Pre-qualified | All above + vertical, referral source | |
| You decide | Claude picks | |

**User's choice:** Qualified — name, email, phone, company name, fleet size, optional message.
**Notes:** None.

### FundingQualifierForm approach

| Option | Description | Selected |
|--------|-------------|----------|
| Distinct form | Unique fields focused on funding eligibility | |
| ConsultForm + funding extras | Same base + vertical dropdown + funding checkbox | ✓ |
| You decide | Claude picks | |

**User's choice:** Same base as ConsultForm plus vertical dropdown and funding interest checkbox.
**Notes:** Keeps it DRY — shared base component.

### ROI → ConsultForm pre-fill

| Option | Description | Selected |
|--------|-------------|----------|
| Fleet size + vertical + savings | Three most useful params | |
| Everything | All inputs + outputs serialized | |
| You decide | Claude picks | ✓ |

**User's choice:** Claude's discretion.
**Notes:** None.

### Formspree endpoint architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Single endpoint | Both forms to one inbox, hidden field distinguishes | |
| Separate endpoints | Each form gets own Formspree form ID | |
| You decide | Claude picks | ✓ |

**User's choice:** Claude's discretion.
**Notes:** None.

---

## Funding Page Narrative

### Content tone

| Option | Description | Selected |
|--------|-------------|----------|
| Marketing-first | Lead with savings hook, push to form fast | ✓ |
| Detailed explainer | Thorough legal walkthrough | |
| Hybrid | Marketing hook + expandable legal details | |
| You decide | Claude picks | |

**User's choice:** Marketing-first tone.
**Notes:** User also requested research on the de-minimis grant. Key findings: program renamed to "Förderprogramm Umweltschutz und Sicherheit", administered by BALM, 80% of net costs, max €2k/vehicle, max €33k/company/year, 2026 applications opened April 14.

### Funding → ROI cross-link

| Option | Description | Selected |
|--------|-------------|----------|
| Embedded mini-calculator | Compact ROI widget on funding page | |
| Link only | Text link to /roi/ | |
| You decide | Claude picks | ✓ |

**User's choice:** Claude's discretion.
**Notes:** None.

---

## Claude's Discretion

- ROI input format (sliders, dropdowns, number fields)
- ROI output presentation (summary card, animated reveal, side-by-side)
- ROI embed approach on pricing page (full vs compact)
- ROI → ConsultForm pre-fill params
- Formspree endpoint architecture
- Funding → ROI cross-link implementation

## Deferred Ideas

None — discussion stayed within phase scope.
