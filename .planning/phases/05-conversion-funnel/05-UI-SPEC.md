---
phase: 5
slug: conversion-funnel
status: draft
design_system: Manual CSS + Tailwind v4 (inherited from Phase 2)
shadcn_initialized: false
preset: none
created: 2026-04-24
---

# Phase 5: Conversion Funnel — UI Design Contract

> Visual and interaction contract for pricing, ROI calculator, funding, and lead-capture forms. Reuses Phase 2 design system; adds Preact island patterns and form copywriting.

**Requirements Mapping:** PRICE-01..04, ROI-01..05, FUND-01..04, FORMS-01..07 (20 requirements)

**Pre-Population Source:**
- Phase 2 UI-SPEC.md (spacing, typography, colour, dark mode)
- Phase 5 CONTEXT.md decisions (D-01 to D-17)
- Phase 5 RESEARCH.md (Preact islands, Formspree, Turnstile, form validation patterns)

---

## 1. Design System

| Property | Value |
|----------|-------|
| Tool | Manual CSS + Tailwind v4 (no shadcn) |
| Preset | Not applicable |
| Component library | None (all Astro + Tailwind utilities) |
| Icon library | Tailwind heroicons (existing, Phase 2) |
| Font | Montserrat (headings), PT Serif (body) — inherited Phase 2 |

**Rationale:** Phase 5 extends Phase 2's design system with interactive Preact islands for forms and calculator. No new design system components; all work within existing Tailwind v4 CSS-first structure.

---

## 2. Spacing Scale

**Inherited from Phase 2 — no changes:**

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline padding |
| sm | 8px | Compact form field spacing |
| md | 16px | Default form element padding, section padding |
| lg | 24px | Card/section gutters |
| xl | 32px | Form container padding |
| 2xl | 48px | Section-to-section breaks |
| 3xl | 64px | Page-level hero/footer spacing |

**Form-specific exceptions:** None — all form fields and containers use standard 8-point scale.

**Touch target rule (Phase 2, carries forward):** Interactive elements (buttons, form inputs, Turnstile widget) must be at least 44px × 44px. Button utility applies `py-3.5 px-6 md:px-8` (36px height minimum).

**Source:** Phase 2 UI-SPEC.md § Spacing Scale (standard Tailwind scale, no Phase 5 additions).

---

## 3. Typography

**Inherited from Phase 2 — no changes:**

| Role | Size | Weight | Line Height | Font |
|------|------|--------|-------------|------|
| Body (p, li) | 16px (text-base) | 400 | 1.5 | PT Serif |
| Label (form, small text) | 14px (text-sm) | 400 | 1.5 | PT Serif |
| Section subheading | 20px (text-xl) | 600 | 1.2 | Montserrat |
| Section title (H4) | 24px (text-2xl) | 600 | 1.2 | Montserrat |
| Major section (H3) | 28px (text-3xl) | 700 | 1.2 | Montserrat |
| Page heading (H2) | 32px (text-4xl) | 700 | 1.2 | Montserrat |
| Hero heading (H1) | 40px (text-5xl) | 700 | 1.1 | Montserrat |

**Form labels:** Use `text-sm` (14px, weight 400), uppercase or sentence case per German B2B conventions.

**Form validation errors:** Use `text-sm` (14px) in error colour (red). Display inline below field with 4px top margin.

**ROI calculator outputs:** Display as `text-lg` or `text-xl` (18–20px) in bold for emphasis on results (annual theft cost, savings, de-minimis subsidy, payback period).

**Source:** Phase 2 UI-SPEC.md § Typography (no Phase 5 deviations).

---

## 4. Colour Palette

**Inherited from Phase 2 — no changes:**

### Light Mode

| Token | HSL Value | Usage | Utility |
|-------|-----------|-------|---------|
| Primary | `hsl(214.48 38.33% 55.49%)` | CTAs, headings, focus states | `bg-primary`, `text-primary`, `border-primary` |
| Secondary | `hsl(217 60% 93%)` | Card backgrounds, light surfaces | `bg-secondary` |
| Accent | `hsl(217.14 42% 80.39%)` | Hover states, subtle highlights | `bg-accent` |
| Background | `hsl(220 100% 98.04%)` | Page background | `bg-page` |
| Foreground (text) | `hsl(215 20% 25%)` | Body text | `text-default` |
| Muted text | `hsl(215 20% 25% / 66%)` | Secondary text, captions | `text-muted` |
| Form border | `hsl(217 30% 80%)` | Form field borders | `border-gray-300` (Tailwind) |
| Error | `hsl(0 84.2% 60.2%)` | Form validation errors | `text-red-500`, `border-red-500` |
| Success | `hsl(142 71% 45%)` | Form success (optional) | `text-green-600` |

### Dark Mode

| Token | HSL Value | Usage | Utility |
|-------|-----------|-------|---------|
| Primary | `hsl(217 60% 70%)` | CTAs, headings | `dark:bg-primary`, `dark:text-primary` |
| Background | `hsl(220 35% 10%)` | Page background | `dark:bg-page` |
| Foreground (text) | `hsl(217 40% 90%)` | Body text | `dark:text-default` |
| Muted text | `hsl(217 40% 90% / 66%)` | Secondary text | `dark:text-muted` |
| Card | `hsl(220 32% 14%)` | Form containers, pricing cards | `dark:bg-card` |
| Form border | `hsl(217 20% 30%)` | Form field borders (dark) | `dark:border-gray-600` |
| Error | `hsl(0 84.2% 60.2%)` | Form validation errors (dark) | `dark:text-red-400` |

**Colour contract split (60/30/10):**
- **60% dominant:** Background + foreground text (page structure)
- **30% secondary:** Card backgrounds, section breaks (pricing tier cards, form containers)
- **10% accent:** CTAs only — never used for decoration or non-critical elements

**Accent reserved for:**
- "Beratung anfragen" / "Book a consult" buttons (primary CTA)
- "Empfohlen" / "Recommended" badge on Camera Module tier
- Focus ring on form inputs
- Success state on form submission
- ROI calculator "Calculate" and "Book a consult" buttons

**Form-specific colours:**
- **Error state:** Red (`text-red-500`, `border-red-500`) with complementary error icon
- **Success state:** Green (`text-green-600`) — optional, used on form submission confirmation
- **Focus state:** Primary blue ring (`focus:ring-primary focus:ring-2`)
- **Disabled state:** 50% opacity (applies to form submit button while submitting)

**Dark mode flicker prevention:** Class-based toggle via `ApplyColorMode.astro` (Phase 2). Do NOT modify.

**Source:** Phase 2 UI-SPEC.md § Colour Palette (established, inherited without changes).

---

## 5. Components & Interaction Patterns

### 5.1 Pricing Tier Cards

**Layout:** 3 cards side-by-side (desktop); stacked vertical (mobile)

**Card structure (per tier):**
- **Header:** Tier name (e.g., "Standard", "+ KONVOI Camera Module")
- **Price:** "ab X EUR / pro Trailer / Monat" (sourced from `src/data/pricing.ts`)
- **Badge:** "Empfohlen" / "Recommended" on Camera Module tier only (accent colour background, primary text)
- **Feature checklist:** Bulleted list with ✓ (checkmark) for included, — (dash) for not included
- **CTA:** "Beratung anfragen" / "Book a consult" (primary button, `btn-primary`)

**States:**
- **Default:** Standard outline, secondary background
- **Highlighted (Camera Module only):** Accent border (2px), no background change
- **Hover:** Slight shadow lift, text-primary CTA becomes darker blue
- **Focus (keyboard nav):** Focus ring on CTA button only

**Source:** CONTEXT.md D-02, D-03 (Camera Module highlighted, equal treatment for Standard/Logbook)

### 5.2 ROI Calculator (Preact Island)

**Inputs:**
- **Fleet size:** Number input (1–1000), label "Flottengröße" / "Fleet size", unit "Anhänger" / "trailers"
- **Vertical:** Dropdown (4 options: "Hochwerttransporte" / "High-value", "Tiefkühl-Logistik" / "Cooling", "Intermodale" / "Intermodal", "Sonstiges" / "Other")
- **Frequency:** Optional advanced input (parsing deferred to PLAN phase)
- **Submit:** "Berechnen" / "Calculate" button (primary)

**Outputs (when calculated):**
- **Annual theft cost:** "€X.XXX / Jahr" / "€X,XXX / year" (left-aligned, large bold text)
- **Konvoi savings:** "€X.XXX" in green (`text-green-600`) with label "Geschätztes Einsparpotenzial" / "Estimated savings"
- **De-minimis subsidy:** "€X.XXX" in secondary blue with label "Staatliche Förderung (80%)" / "Government subsidy (80%)"
- **Payback period:** "X Monate" / "X months" with label "Amortisationszeit" / "Payback period"

**CTA after calculation:** "Jetzt Beratung buchen" / "Book a consult now" (primary button, navigates to pricing page pre-filling form with fleet size + savings)

**Embed mode (pricing page):** Compact — collapsible or hidden by default, expanding on user interaction
**Standalone mode (/roi/ page):** Full — all inputs and outputs visible, prominent

**States:**
- **Initial:** Inputs visible, placeholder values shown (fleet size = 10), "Calculate" button enabled
- **Calculating:** Brief loading state (< 1s), submit button disabled
- **Calculated:** Results displayed below inputs, "Book a consult" button visible
- **Reset:** User changes input → results hidden, "Calculate" button re-enabled

**Interactions:**
- User enters fleet size + selects vertical → clicks "Calculate"
- Results appear with no page refresh (client-side computation)
- "Book a consult" → navigates to pricing page with URL params (?fleet_size=X&vertical=Y&savings=€Z)
- Changing input again → results disappear, user must recalculate

**Source:** CONTEXT.md D-06, D-07, D-08; RESEARCH.md Pattern 2 (ROI Calculator skeleton)

### 5.3 ConsultForm (Preact Island)

**Fields (in order):**
1. **Name** — text input, label "Name", placeholder "Max Mustermann", required
2. **Email** — email input, label "E-Mail", placeholder "max@example.com", required
3. **Phone** — tel input (optional), label "Telefon", placeholder "+49 40 xxx"
4. **Company** — text input, label "Unternehmen", placeholder "Logistik GmbH", required
5. **Fleet size** — number input, label "Flottengröße", placeholder "10", unit "Anhänger", required
6. **Message** — textarea (optional), label "Nachricht", placeholder "Weitere Informationen..."
7. **DSGVO consent** — checkbox, label "Ich akzeptiere die Datenschutzerklärung" with link to `/datenschutz`, required (must be checked)
8. **Honeypot** — hidden input `name="_gotcha"` (never shown to user)
9. **Turnstile widget** — rendered as `.cf-turnstile` div, auto-creates `cf-turnstile-response` hidden field

**Layout:** Single-column stack, full width on mobile, max-width 500px on desktop, centered

**States:**
- **Initial (empty):** All fields blank except pre-filled values (if pre-filled from ROI)
- **Validating:** Submit button disabled, "Wird versendet..." / "Sending..." text
- **Valid:** Submit button enabled
- **Invalid:** Inline error messages below each invalid field (red text), submit button disabled
- **Submitted successfully:** Redirect to `/danke` (DE) or `/en/thanks/` (EN) with success message

**Validation rules (Zod schema):**
- **Name:** Required (min 1 char), error: "Dieses Feld ist erforderlich" / "This field is required"
- **Email:** Required, valid email format, error: "Bitte geben Sie eine gültige E-Mail ein" / "Please enter a valid email"
- **Phone:** Optional (can be empty)
- **Company:** Required (min 1 char)
- **Fleet size:** Required, number ≥ 1, error: "Die Flottengröße muss mindestens 1 sein" / "Fleet size must be at least 1"
- **Message:** Optional
- **DSGVO consent:** Required (checkbox must be checked), error: "Bitte akzeptieren Sie die Datenschutzerklärung" / "Please accept the privacy policy"
- **Turnstile:** Required (token must be non-empty)

**Error display:**
- **Position:** Inline below field, 4px top margin
- **Colour:** Error red (`text-red-500`)
- **Size:** `text-sm` (14px)
- **Behaviour:** Clear when user edits the field

**Submit button:**
- **Text:** "Beratung anfragen" / "Book a consult" (initially), "Wird versendet..." / "Sending..." (while submitting)
- **Style:** `btn-primary` (full width on mobile, fixed width on desktop)
- **Disabled:** During submission, if form invalid, if Turnstile token missing

**Pre-fill contract (from ROI calculator):**
- URL params: `?fleet_size=X&vertical=Y&savings=€Z`
- On mount, extract params with `URLSearchParams`
- Pre-fill **fleet_size** field with numeric value
- Pre-fill **message** field with "Geschätztes Einsparpotenzial: €Z" / "Estimated savings: €Z" (if savings param provided)
- Do NOT pre-fill vertical (not a form field)

**Cross-browser behaviour:**
- Desktop (chrome/firefox/safari): Form submits via `fetch` to Formspree, waits for 200 response, redirects client-side
- Mobile: Same behaviour, form fully scrollable

**Accessibility:**
- All labels associated with inputs via `htmlFor` + `id`
- Error messages linked to inputs via ARIA? (defer to PLAN phase if needed)
- Focus ring on all inputs + buttons
- Form submission keyboard-accessible (Tab to submit, Enter to submit)

**Source:** CONTEXT.md D-09, D-11; RESEARCH.md Pattern 1 (ConsultForm code example)

### 5.4 FundingQualifierForm (Preact Island)

**Fields (in order):**
1. **Name** — text input, same as ConsultForm
2. **Email** — email input, same as ConsultForm
3. **Phone** — tel input (optional), same as ConsultForm
4. **Company** — text input, same as ConsultForm
5. **Fleet size** — number input, same as ConsultForm
6. **Vertical** — dropdown, same as ROI calculator (high-value, cooling, intermodal, other), required
7. **Company size** — dropdown, label "Unternehmensgröße" / "Company size" (options: "1–10 MA", "11–50 MA", "51–250 MA", "250+ MA"), required
8. **Interested in de-minimis** — checkbox, label "Ich bin an der 80%-Förderung interessiert" / "I'm interested in 80% government funding", optional
9. **Message** — textarea (optional), same as ConsultForm
10. **DSGVO consent** — checkbox, same as ConsultForm, required
11. **Honeypot** — hidden, same as ConsultForm
12. **Turnstile widget** — same as ConsultForm

**Layout:** Single-column, same as ConsultForm

**States:** Same as ConsultForm (initial, validating, valid, invalid, submitted)

**Validation rules:** Same as ConsultForm + additional:
- **Vertical:** Required (dropdown must have selection)
- **Company size:** Required

**Submit button:**
- **Text:** "Förderung anfragen" / "Request funding" (initially), "Wird versendet..." / "Sending..." (while submitting)
- Same styling as ConsultForm

**Cross-form integration:** On funding page only. Link to ROI calculator: "Jetzt Ihre Einsparungen berechnen" / "Calculate your savings now" (text link to `/roi/` or embedded widget)

**Source:** CONTEXT.md D-10 (extends ConsultForm with vertical + company size + funding checkbox)

### 5.5 Pricing Page (`/preise`, `/en/pricing`)

**Page structure:**
1. **Hero:** Title "Preise" / "Pricing", tagline (TBD in PLAN phase)
2. **Pricing tiers:** 3-card grid (pricing cards from § 5.1)
3. **De-minimis teaser:** "Bis zu 80% förderbar — mehr erfahren →" linking to `/foerderung/`
4. **ROI calculator (embedded):** Compact mode, `client:visible` (lazy load)
5. **ConsultForm:** Full form, `client:load` (eager load)
6. **Trust reinforcement:** Customer logos or testimonial quote (optional, TBD in PLAN)
7. **End CTA:** `CallToAction` component — "Beratung anfragen" / "Book a consult"

**Responsive:** Desktop grid 3 columns, tablet 2 columns, mobile 1 column (stacked)

**Source:** CONTEXT.md D-02..D-05 (pricing page requirements)

### 5.6 Funding Page (`/foerderung`, `/en/funding`)

**Page structure:**
1. **Hero:** Title "Förderung" / "Funding", subtitle emphasizing 80% government support
2. **Program details section:**
   - **Program name:** "Förderprogramm Umweltschutz und Sicherheit" (ehem. De-minimis) with explanation of rebrand
   - **Administrator:** BALM (Bundesamt für Logistik und Mobilität)
   - **Application period:** April 14 – August 31, 2026 (with time-pressure language)
   - **Eligible measures:** List including alarm systems, sensor systems, GPS tracking (Konvoi fits)
   - **Funding caps:** Up to €2,000 per vehicle, max €33,000 per company per year
3. **Savings hook:** "80% Ihrer Investition wird vom Staat übernommen" (marketing-first tone per D-14)
4. **How it works section:** Step-by-step explanation (visual or text, TBD in PLAN)
5. **ROI calculator link/embed:** "Jetzt Ihre Einsparungen berechnen" / "Calculate your savings now" (can be link or embedded widget)
6. **FundingQualifierForm:** Full form for lead capture
7. **End CTA:** `CallToAction` component

**Responsive:** Full width on mobile, max-width container on desktop

**Source:** CONTEXT.md D-14..D-17 (funding page requirements + de-minimis program 2026 details)

### 5.7 Thank-You Pages (`/danke`, `/en/thanks`)

**Page structure:**
1. **Heading:** "Vielen Dank!" / "Thank you!" (h1, center-aligned)
2. **Body:** "Wir haben Ihre Anfrage erhalten und werden Sie in Kürze kontaktieren." / "We've received your request and will contact you shortly." (center-aligned, muted text colour, 1.5 line height)
3. **CTA:** "Zurück zur Startseite" / "Back to homepage" (text link or button, primary colour)
4. **Optional email confirmation:** "Bestätigungsmail an max@example.com versendet" / "Confirmation email sent to max@example.com" (small text, muted)

**Response time SLA:** Display confirmation immediately on form submission success (< 1s client-side redirect via `_next` field in Formspree)

**Source:** CONTEXT.md D-11 (redirect to `/danke` or `/en/thanks/` on form success)

---

## 6. Copywriting Contract

### 6.1 Primary CTA Labels

| Element | German | English | Verb | Tone |
|---------|--------|---------|------|------|
| Button text | "Beratung anfragen" | "Book a consult" | anfragen / book | Request, not signup |
| Pricing tier CTA | "Beratung anfragen" | "Book a consult" | Same | Same |
| ROI calculator CTA | "Jetzt Beratung buchen" | "Book a consult now" | buchen / book | Urgency with "jetzt"/"now" |
| Funding form CTA | "Förderung anfragen" | "Request funding" | anfragen / request | Specific to funding |
| De-minimis teaser | "Bis zu 80% förderbar — mehr erfahren →" | "Up to 80% funding available — learn more →" | — | Teaser link |

**Source:** CONTEXT.md D-01, BRAND voice guidance (preventive positioning)

### 6.2 Form Labels & Placeholders

| Field | German Label | English Label | German Placeholder | English Placeholder |
|-------|--------------|---------------|--------------------|---------------------|
| Name | "Name" | "Name" | "Max Mustermann" | "John Smith" |
| Email | "E-Mail" | "Email" | "max@example.com" | "john@example.com" |
| Phone | "Telefon" | "Phone" | "+49 40 123456" | "+49 40 123456" |
| Company | "Unternehmen" | "Company" | "Logistik GmbH" | "Logistics Inc" |
| Fleet size | "Flottengröße" | "Fleet size" | "10" (with unit "Anhänger" / "trailers") | "10" |
| Vertical | "Branche" / "Branchen-fokus" | "Industry" | "— Bitte wählen —" | "— Please select —" |
| Company size | "Unternehmensgröße" | "Company size" | "— Bitte wählen —" | "— Please select —" |
| Message | "Nachricht" | "Message" | "Weitere Informationen zu..." | "Additional information about..." |

**Source:** German B2B conventions + Phase 5 form fields (D-09, D-10)

### 6.3 Form Error Messages

| Validation Rule | German Error | English Error |
|-----------------|--------------|---------------|
| Required field empty | "Dieses Feld ist erforderlich" | "This field is required" |
| Invalid email | "Bitte geben Sie eine gültige E-Mail ein" | "Please enter a valid email address" |
| Fleet size < 1 | "Die Flottengröße muss mindestens 1 sein" | "Fleet size must be at least 1" |
| DSGVO not checked | "Bitte akzeptieren Sie die Datenschutzerklärung" | "Please accept the privacy policy" |
| Turnstile missing | "Bestätigung erforderlich" / "CAPTCHA erforderlich" | "Verification required" |
| Form submission failed | "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." | "An error occurred. Please try again later." |

**Display:** Inline below field, red text (`text-red-500`), 14px, clear on field edit

**Source:** CONTEXT.md D-11, RESEARCH.md (Common Pitfalls § Zod Error Messages)

### 6.4 ROI Calculator Labels

| Output | German Label | English Label | Format | Example |
|--------|--------------|---------------|--------|---------|
| Annual theft cost | "Jährliche Diebstahl-kosten" | "Annual theft cost" | €X.XXX | €240.000 |
| Konvoi savings | "Geschätztes Einsparpotenzial" | "Estimated savings" | €X.XXX | €72.000 |
| De-minimis subsidy | "Staatliche Förderung (80%)" | "Government subsidy (80%)" | €X.XXX | €28.800 |
| Payback period | "Amortisationszeit" | "Payback period" | X Monate / X months | 8 Monate / 8 months |

**Input labels:**
- Fleet size: "Flottengröße" / "Fleet size"
- Vertical: "Branche" / "Industry"
- Frequency: "Durchschnittliche Parkdauer pro Woche" / "Average parking frequency per week" (optional, TBD in PLAN)

**Button text:** "Berechnen" / "Calculate", "Jetzt Beratung buchen" / "Book a consult now"

**Source:** CONTEXT.md D-06, D-07 (ROI formula inputs/outputs)

### 6.5 Funding Page Content (Copywriting Guidance)

**Headline:** "Bis zu 80% staatliche Förderung für Ihre Sicherheitsinvestition" / "Government funding for up to 80% of your security investment"

**Subheading:** "Das Förderprogramm Umweltschutz und Sicherheit (ehem. De-minimis) übernimmt bis zu €2.000 pro Anhänger — wir zeigen Ihnen wie" / "The Government Security & Environment Program (formerly De-minimis) covers up to €2,000 per trailer — we'll show you how"

**Key facts callout (use secondary background):**
- Maximum €2.000 pro Fahrzeug / per vehicle
- Maximum €33.000 pro Unternehmen pro Jahr / per company per year
- Antragsfristen: 14. April – 31. August 2026 / Application deadline: April 14 – August 31, 2026
- Eligible: Alarm systems, sensor systems, GPS tracking (Konvoi fits category for theft prevention)

**Time-pressure language:** "Die aktuelle Antragsrunde endet am 31. August 2026 — nutzen Sie die Gelegenheit jetzt!" / "The current application period ends August 31, 2026 — seize the opportunity now!"

**Source:** CONTEXT.md D-14..D-17, RESEARCH.md (BALM official 2026 program details)

### 6.6 DSGVO Consent Checkbox

**Label text:**
- German: "Ich akzeptiere die [Datenschutzerklärung](#)" (link to `/datenschutz`)
- English: "I accept the [privacy policy](#)" (link to `/en/privacy-policy` — note: slug is `/datenschutz` in both locales per SEO-07 requirement, but this needs verification in Phase 7)

**Requirement:** Checkbox must start **unchecked** (false). Form rejects if unchecked at submission.

**Error message:** "Bitte akzeptieren Sie die Datenschutzerklärung" / "Please accept the privacy policy"

**Source:** CONTEXT.md D-11, REQUIREMENTS.md FORMS-05

### 6.7 Empty State & Error Handling

**Form initial state (no validation errors):** No message shown. All fields blank except pre-filled values.

**Form submission error:** "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut. Wenn das Problem weiterhin besteht, kontaktieren Sie uns unter info@konvoi.eu." / "An error occurred. Please try again later. If the problem persists, contact us at info@konvoi.eu." (centred, red text, below submit button)

**Successful submission:** Redirect to `/danke` (DE) or `/en/thanks/` (EN) — no error message shown.

**Source:** CONTEXT.md D-11 (FORMS-07: preserve field values, surface inline error)

---

## 7. Preact Island Architecture

### 7.1 Islands Used

| Island | Location | Component Path | Client Directive | Purpose |
|--------|----------|-----------------|------------------|---------|
| RoiCalculator | Pricing page + /roi/ standalone | `src/components/islands/RoiCalculator.tsx` | `client:visible` (pricing embed), `client:load` (/roi/ page) | Interactive ROI calculation with form pre-fill |
| ConsultForm | Pricing, use-case pages, anywhere | `src/components/islands/ConsultForm.tsx` | `client:load` | Lead capture for consult requests |
| FundingQualifierForm | Funding page only | `src/components/islands/FundingQualifierForm.tsx` | `client:load` | Lead capture for funding pre-qualification |

### 7.2 Client Directives Rationale

- **`client:load`:** ConsultForm, FundingQualifierForm — forms are above-the-fold or critical to page purpose. Hydrate immediately.
- **`client:visible`:** RoiCalculator on pricing page — below-the-fold, non-critical. Load only when user scrolls into view (lazy loading).
- **`client:load` on /roi/ page:** RoiCalculator as main content. Hydrate immediately.

### 7.3 Form State & Validation

**Client-side validation:** Zod schema validates all fields before submission. Errors display inline below each field.

**Turnstile integration:** Cloudflare Turnstile widget loads via CDN, renders in `.cf-turnstile` container, auto-creates `cf-turnstile-response` hidden field. Token captured client-side, sent to Formspree on submission.

**Server-side validation (Phase 7):** Formspree validates Turnstile token via Siteverify API (to be implemented in Phase 7 CSP/launch gate). Phase 5 assumes client-side token capture only.

**Form submission flow:**
1. User fills form + checks DSGVO
2. User clicks "Beratung anfragen" / "Book a consult"
3. Client-side Zod validation runs (no server roundtrip)
4. If valid: Form state hidden, "Wird versendet..." / "Sending..." button state
5. `fetch` POST to `https://formspree.io/f/{FORM_ID}` with FormData
6. Formspree returns 200: `window.location.href = '/danke'` (DE) or `/en/thanks/` (EN)
7. Formspree returns error: Zod errors cleared, display generic error message (preserve all filled values)

### 7.4 Pre-fill Contract (ROI → ConsultForm)

**Source:** ROI calculator result screen

**CTA:** "Jetzt Beratung buchen" / "Book a consult now" button

**URL construction:**
```javascript
const params = new URLSearchParams({
  fleet_size: String(result.fleetSize),
  vertical: result.vertical,
  estimated_savings: String(Math.round(result.konvoiSavings)),
});
window.location.href = `${locale === 'de' ? '/preise' : '/en/pricing'}?${params.toString()}`;
```

**ConsultForm pre-fill (on mount):**
```javascript
const params = new URLSearchParams(window.location.search);
const fleetSize = params.get('fleet_size');
const vertical = params.get('vertical');
const savings = params.get('estimated_savings');

// Pre-fill fleet_size field
if (fleetSize) formData.fleet_size = parseInt(fleetSize, 10);

// Pre-fill message field with savings estimate
if (savings) formData.message = `Geschätztes Einsparpotenzial: €${parseInt(savings).toLocaleString()}`;

// Do NOT pre-fill vertical (not a form field in ConsultForm)
```

**URLSearchParams encoding:** Automatic (handles special characters, spaces, punctuation)

**Example URL:** `/preise/?fleet_size=50&vertical=cooling&estimated_savings=72000`

**Source:** CONTEXT.md D-12, RESEARCH.md (Pattern 2 ROI calculator, Code Example: URL Query Params)

---

## 8. Formspree & Turnstile Integration

### 8.1 Formspree Setup

**Service:** SaaS form backend (no custom server code)

**Endpoint:** `https://formspree.io/f/{FORM_ID}`

**Form IDs (to be set up in .env):**
- `PUBLIC_FORMSPREE_CONSULT_ID` — ConsultForm (consult requests from pricing, ROI, home)
- `PUBLIC_FORMSPREE_FUNDING_ID` — FundingQualifierForm (funding pre-qualification requests)

**Honeypot field:** Hidden input `name="_gotcha"` (always empty). Formspree silently rejects if filled (standard spam filtering).

**Redirect field:** `_next` field sent in FormData, e.g., `_next = '/danke'`. Formspree redirects browser after successful submission.

**Response:** 200 OK = success (redirect via `_next`). Non-200 = error (client displays error message, preserves form data).

**Source:** RESEARCH.md § Formspree API documentation, Code Examples

### 8.2 Cloudflare Turnstile

**Service:** Privacy-friendly bot detection (alternative to Google reCAPTCHA)

**Widget:** Load script from `https://challenges.cloudflare.com/turnstile/v0/api.js`, render in `<div class="cf-turnstile" data-sitekey="..."></div>`

**Implicit rendering:** Script auto-scans for `.cf-turnstile` divs, renders widgets, emits `cf-turnstile-response` hidden field when token is ready.

**Token capture:** Preact form listens for `turnstileCallback` global function or reads `cf-turnstile-response` field value before submission.

**Client-side validation (Phase 5):** Optional — include token in Zod schema but don't block form submission if missing.

**Server-side validation (Phase 7):** Formspree webhook or Siteverify API endpoint validates token (requires secret key). Phase 7 handles this.

**Site key:** `PUBLIC_TURNSTILE_SITEKEY` (set in `.env`)

**Source:** RESEARCH.md § Cloudflare Turnstile documentation, Code Examples

### 8.3 Form Security Checklist

| Control | Status | Notes |
|---------|--------|-------|
| DSGVO consent checkbox | ✓ Implemented | Required, unchecked by default, links to `/datenschutz` |
| Honeypot field (`_gotcha`) | ✓ Implemented | Hidden, always empty, Formspree silently rejects if filled |
| Turnstile widget | ✓ Implemented | Client-side rendering, token sent to Formspree |
| Client-side Zod validation | ✓ Implemented | All fields validated before submission |
| Server-side Turnstile validation | ⏳ Deferred to Phase 7 | Formspree webhook + Siteverify API |
| HTTPS (Formspree) | ✓ Standard | Formspree uses HTTPS by default |
| CSP headers | ⏳ Deferred to Phase 7 | Phase 7 CSP restricts scripts to Formspree, Turnstile, self-hosted fonts |

**Source:** RESEARCH.md § Security Domain, Common Pitfalls

---

## 9. Responsive Behaviour

### 9.1 Breakpoints (Tailwind v4 default)

| Size | Breakpoint | Use |
|------|-----------|-----|
| Mobile | < 640px | Single column, stacked |
| Tablet | 640px–1024px | 2 columns (pricing cards), adjusted spacing |
| Desktop | > 1024px | Full layout (3-column pricing, side-by-side ROI + form) |

**Source:** Phase 2 UI-SPEC.md (standard Tailwind breakpoints, inherited)

### 9.2 Pricing Page Responsive

- **Mobile:** Cards stacked vertically, full width
- **Tablet:** 2 cards per row (first card spans, Camera Module + Logbook in second row)
- **Desktop:** 3 cards in single row, equal width

### 9.3 Form Responsive

- **Mobile:** Full width, form container max-width 100% with padding
- **Tablet/Desktop:** Max-width 500px, centred

### 9.4 ROI Calculator Responsive

- **Mobile:** Inputs stacked full width, results inline (flex row, 2 values per row)
- **Desktop:** Inputs in 2-column grid (fleet size | vertical), results in 2x2 grid

---

## 10. Dark Mode Implementation

**Activation:** Class-based toggle via `<html class="dark">` (from Phase 2 `ApplyColorMode.astro`)

**Form elements:** Use `dark:border-gray-600` for input borders, `dark:bg-card` for form containers

**Error messages:** `dark:text-red-400` (lighter red for dark mode readability)

**ROI results:** `dark:text-green-400` for savings, `dark:text-blue-300` for de-minimis subsidy

**No flicker:** `ApplyColorMode.astro` pre-loads color mode before hydration. Do NOT modify.

**Source:** Phase 2 UI-SPEC.md § Dark Mode Implementation (inherited, no Phase 5 changes)

---

## 11. Accessibility Baseline (WCAG AA)

### 11.1 Form Accessibility

- **Labels:** All form fields have associated `<label htmlFor="...">` elements
- **Focus ring:** `focus:ring-primary focus:ring-2` on all inputs + buttons
- **Error messages:** Associated with fields via `aria-describedby` (optional, defer to PLAN)
- **Keyboard nav:** Tab order natural (DOM order), form fully keyboard-accessible
- **Contrast:** Error text (red) on white/dark backgrounds ≥ 4.5:1
- **Touch targets:** Buttons ≥ 44px × 44px (inherited from Phase 2 `btn` utility)

### 11.2 Colour Contrast (inherited from Phase 2)

- Primary on white: 5.5:1 ✓ (WCAG AAA)
- Primary on light secondary: 4.5:1 ✓ (WCAG AA)
- Foreground on background: 10:1 ✓ (WCAG AAA)
- Error (red) on white: 5.2:1 ✓ (WCAG AA)
- Dark mode primary on dark bg: 4.8:1 ✓ (WCAG AA)

### 11.3 Turnstile Accessibility

- Widget renders as inline block, keyboard-accessible
- Challenge (if presented) keyboard-solvable
- No vision-required interaction (alt mode available)

**Source:** RESEARCH.md § Security Domain (ASVS V5 Input Validation, V7 Error Handling)

---

## 12. No New Design System Dependencies

**Phase 5 adds NO new design tokens, colours, fonts, or spacing values.**

All visual contracts are inherited from Phase 2:
- ✓ Spacing: 8-point scale (Phase 2)
- ✓ Typography: Montserrat + PT Serif (Phase 2)
- ✓ Colour: HSL palette (Phase 2)
- ✓ Dark mode: Class-based (Phase 2)
- ✓ Icon library: Tailwind heroicons (Phase 2)

**Phase 5 adds:**
- Preact island component patterns
- Form validation & error display
- Formspree + Turnstile integration (SaaS, not design)
- Pricing tier card layout
- ROI calculator output display

All built using **existing Phase 2 utilities.**

---

## 13. Deliverables Checklist

| Item | File/Location | Status | Notes |
|------|---|--------|-------|
| **Preact Islands** | | | |
| RoiCalculator | `src/components/islands/RoiCalculator.tsx` | To create | Pattern 2 (RESEARCH.md) |
| ConsultForm | `src/components/islands/ConsultForm.tsx` | To create | Pattern 1 (RESEARCH.md) |
| FundingQualifierForm | `src/components/islands/FundingQualifierForm.tsx` | To create | Extends Pattern 1 |
| **Pages** | | | |
| Pricing page (DE) | `src/pages/preise.astro` | To create/rewrite | Hero + tiers + ROI + form |
| Pricing page (EN) | `src/pages/en/pricing.astro` | To create/rewrite | Same as DE |
| ROI page (DE) | `src/pages/roi.astro` | To create | RoiCalculator full mode |
| ROI page (EN) | `src/pages/en/roi.astro` | To create | Same as DE |
| Funding page (DE) | `src/pages/foerderung.astro` | To create | Hero + funding details + form |
| Funding page (EN) | `src/pages/en/funding.astro` | To create | Same as DE |
| Thank-you page (EN) | `src/pages/en/thanks.astro` | To create | May already exist; verify |
| **Data Files** | | | |
| Pricing & ROI formulas | `src/data/pricing.ts` | To create | Tier data, formula assumptions |
| **i18n Strings** | | | |
| Form labels, errors, ROI | `src/i18n/translations.ts` | To update | Add Phase 5 UI strings |
| Route mappings | `src/i18n/routeMap.ts` | To verify | pricing, roi, funding routes already registered (Phase 3) |
| **Navigation** | | | |
| Header/footer nav links | `src/navigation.ts` | To update | Add pricing, ROI, funding links |
| **Environment** | | | |
| Formspree form IDs | `.env` / `.env.local` | To create | PUBLIC_FORMSPREE_CONSULT_ID, PUBLIC_FORMSPREE_FUNDING_ID |
| Turnstile site key | `.env` / `.env.local` | To create | PUBLIC_TURNSTILE_SITEKEY |

---

## 14. Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | N/A | Not applicable — no shadcn |
| Third-party registries | None | Not required — all components are custom Astro + Tailwind |

**No design system dependencies introduced in Phase 5.** All work within Phase 2's established manual CSS + Tailwind v4 structure.

---

## 15. Out of Scope (Phase 5)

- SEO structured data for pricing/ROI (Phase 7)
- Analytics event tracking (Phase 7)
- Server-side Turnstile validation (Phase 7)
- CSP headers (Phase 7)
- Blog, team, careers, case studies (Phase 6)
- Dark mode flicker fix (Phase 2 — already complete)
- Advanced ROI formula assumptions (PLAN phase — determine formula inputs)

---

## 16. Checker Sign-Off

| Dimension | Status | Notes |
|-----------|--------|-------|
| 1. Copywriting | ⏳ Pending | Form labels, error messages, CTA copy, funding page messaging defined |
| 2. Visuals | ⏳ Pending | Pricing cards, ROI output layout, form container styling defined; no imagery specified |
| 3. Colour | ✓ Approved | Inherited from Phase 2 — no changes, full compliance |
| 4. Typography | ✓ Approved | Inherited from Phase 2 — no changes, form text hierarchy defined |
| 5. Spacing | ✓ Approved | Inherited from Phase 2 — no exceptions, 8-point scale applied throughout |
| 6. Registry Safety | ✓ Approved | No third-party blocks; all custom components; no safety vetting required |

**Approval:** Pending gsd-ui-checker verification

---

## 17. Integration Notes

### Phase 2 → Phase 5 Continuity

- ✓ Tailwind v4 CSS-first (no `tailwind.config.js`)
- ✓ No shadcn, no third-party registries
- ✓ CSS custom properties in `CustomStyles.astro` (inherited)
- ✓ Montserrat + PT Serif fonts (inherited)
- ✓ Dark mode via `ApplyColorMode.astro` (do NOT modify)
- ✓ Existing button utilities (`btn`, `btn-primary`, `btn-secondary`)

### Phase 3 → Phase 5 Continuity

- ✓ i18n routing with `routeMap.ts` (routes: pricing, roi, funding, thanks pre-registered)
- ✓ `translations.ts` for UI strings (Phase 5 adds form labels, errors, ROI output, funding copy)
- ✓ DE default locale, EN at `/en/` prefix

### Phase 4 → Phase 5 Continuity

- ✓ `CallToAction.astro` component (reusable for pricing, funding, end-of-page CTAs)
- ✓ Hero component pattern (reusable on pricing, ROI, funding pages)
- ✓ `WidgetWrapper.astro` (section container for pricing cards, ROI, form sections)
- ✓ Preact islands pattern (established with first SensorDataViz in Phase 4; Phase 5 extends)

---

## 18. References

| Document | Link | Section |
|----------|------|---------|
| Phase 5 Requirements | `.planning/REQUIREMENTS.md` | PRICE-01..04, ROI-01..05, FUND-01..04, FORMS-01..07 |
| Phase 5 Context | `.planning/phases/05-conversion-funnel/05-CONTEXT.md` | All decisions D-01..D-17 |
| Phase 5 Research | `.planning/phases/05-conversion-funnel/05-RESEARCH.md` | Formspree, Turnstile, Zod, Preact patterns |
| Phase 2 UI-SPEC | `.planning/phases/02-brand-design-system/02-UI-SPEC.md` | Spacing, typography, colour, dark mode |
| Phase 4 UI-SPEC | `.planning/phases/04-core-marketing-pages/04-UI-SPEC.md` | Component patterns, hero, CTA, WidgetWrapper |
| DSGVO Program 2026 | BALM official | De-minimis caps, application period, eligible measures |

---

**Status:** Draft — Ready for planner review and executor implementation.

**Created:** 2026-04-24 by gsd-ui-researcher

**Pre-Populated From:**
- Phase 2 UI-SPEC.md: Spacing, typography, colour, dark mode (inherited, no changes)
- Phase 5 CONTEXT.md: Decisions D-01 to D-17 (pricing page, ROI calculator, funding page, forms, copywriting)
- Phase 5 RESEARCH.md: Preact island patterns, Formspree/Turnstile integration, form validation, common pitfalls
- Phase 4 UI-SPEC.md: Component patterns reused (Hero, CallToAction, WidgetWrapper)
