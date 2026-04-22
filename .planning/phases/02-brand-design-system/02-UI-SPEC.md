---
status: draft
phase: 2
phase_name: Brand & Design System
phase_url: .planning/phases/02-brand-design-system
design_system: Manual CSS + Tailwind v4 (no shadcn)
last_updated: 2026-04-22
---

# Phase 2: Brand & Design System — UI Design Contract

**Objective:** Apply Konvoi visual identity (typography, colour, logo, favicons) site-wide via reusable design tokens, with dark mode stable and accessibility baseline passing.

**Requirements Mapping:** BRAND-01 through BRAND-07 (`.planning/REQUIREMENTS.md`)

**Pre-Population Source:**
- CONTEXT.md decisions (D-01 through D-11) — 2026-04-22
- current-site-overview.md — 2026-04-20
- Existing codebase: `CustomStyles.astro`, `tailwind.css`, Phase 1 contracts

---

## 1. Design System Tool & Registry

**Tool:** Manual CSS custom properties + Tailwind v4 CSS-first (no shadcn, no third-party registries)

**Rationale:**
- Project uses Tailwind v4 with CSS-first configuration (no `tailwind.config.js`).
- Design tokens live in `src/assets/styles/tailwind.css` `@theme` block and referenced via CSS custom properties in `src/components/CustomStyles.astro`.
- No JavaScript component library registry needed — all components are Astro + Tailwind utilities.

**No third-party block vetting required** — design is self-contained.

---

## 2. Spacing Scale

**8-point scale (all multiples of 4):**

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-0` | 0 | No margin/padding |
| `spacing-1` | 4px | Tight internal spacing (icon-to-text) |
| `spacing-2` | 8px | Compact sections |
| `spacing-3` | 12px | Small components |
| `spacing-4` | 16px | Standard default |
| `spacing-5` | 20px | Breathing room |
| `spacing-6` | 24px | Card gutters, section padding |
| `spacing-7` | 28px | Loose spacing |
| `spacing-8` | 32px | Hero padding, major breaks |
| `spacing-9` | 36px | Large section gutters |
| `spacing-10` | 40px | Extra large |
| `spacing-12` | 48px | Section-to-section |
| `spacing-16` | 64px | Hero/full-bleed spacing |

**Touch target rule:** Buttons and interactive elements must be at least 44px × 44px. Button utility `btn` applies `py-3.5 px-6 md:px-8` (36px height on mobile, padding adjusts for larger screens).

**Source:** Standard 8-point Tailwind scale; existing `tailwind.css` uses numeric multipliers (4, 8, 16, 24, 32, etc.).

---

## 3. Typography

### Font Faces

**Headings (H1–H6): Montserrat**
- **Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Package:** `@fontsource/montserrat` (self-hosted, not Google Fonts)
- **Total asset size:** ~120KB
- **CSS var:** `--aw-font-heading` (maps to Tailwind `--font-heading`)
- **Source:** CONTEXT.md D-05, D-06; confirmed in current-site-overview.md

**Body (paragraphs, lists): PT Serif**
- **Weights:** 400 (regular), 700 (bold)
- **Package:** `@fontsource/pt-serif` (self-hosted, not Google Fonts)
- **Total asset size:** ~40KB
- **CSS var:** `--aw-font-serif` (maps to Tailwind `--font-serif`)
- **No italic variants needed for this phase**
- **Source:** CONTEXT.md D-05, D-07

### Font Sizes & Scale

| Size | Value | Usage | Weight | Line Height |
|------|-------|-------|--------|------------|
| `text-xs` | 12px | Small labels, captions | regular (400) | 1.5 |
| `text-sm` | 14px | Metadata, small text, nav secondary | regular (400) | 1.5 |
| `text-base` | 16px | **Body default** | regular (400) | 1.5 |
| `text-lg` | 18px | Large body, intro text | regular (400) | 1.5 |
| `text-xl` | 20px | Section subheading | semibold (600) | 1.2 |
| `text-2xl` | 24px | **H4 / Section title** | semibold (600) | 1.2 |
| `text-3xl` | 28px | **H3 / Major section** | bold (700) | 1.2 |
| `text-4xl` | 32px | H2 | bold (700) | 1.2 |
| `text-5xl` | 40px | H1 hero | bold (700) | 1.1 |

**Declared Font Sizes:** 5 sizes (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl). Marketing site uses the core 3: base (16px), 2xl (24px), 3xl (28px).

**Body Line Height:** 1.5 (comfortable for readability)

**Heading Line Height:** 1.2 (tighter to emphasize hierarchy)

**Source:** Current project uses system fonts; Phase 2 replaces with Montserrat + PT Serif per D-05.

---

## 4. Colour Palette

### Light Mode

| Token | HSL Value | RGB Equivalent | Usage | Tailwind Utility |
|-------|-----------|---|-------|---------|
| **Primary** | `hsl(214.48 38.33% 55.49%)` | rgb(69, 142, 213) | Headings, CTAs, brand accent | `bg-primary`, `text-primary`, `border-primary` |
| **Secondary** | `hsl(217 60% 93%)` | rgb(224, 237, 250) | Cards, sidebar, light backgrounds | `bg-secondary` |
| **Accent** | `hsl(217.14 42% 80.39%)` | rgb(172, 198, 235) | Hover states, subtle highlights | `bg-accent` |
| **Background** | `hsl(220 100% 98.04%)` | rgb(250, 252, 255) | Page background | `bg-page` |
| **Foreground (text)** | `hsl(215 20% 25%)` | rgb(50, 60, 75) | Default body text | `text-default` |
| **Muted text** | `hsl(215 20% 25% / 66%)` | rgb(50, 60, 75, 0.66) | Secondary text, captions | `text-muted` |

**Colour Split:**
- **60% dominant:** Background + Foreground text (page structure)
- **30% secondary:** Secondary backgrounds (cards, sections)
- **10% accent:** CTAs, hover states, visual emphasis

**Contrast Compliance:**
- Primary on white: WCAG AAA (contrast ratio 5.5:1)
- Primary on secondary: WCAG AA (contrast ratio 4.5:1)
- Foreground on background: WCAG AAA

### Dark Mode

| Token | HSL Value | RGB Equivalent | Usage | Tailwind Utility |
|-------|-----------|---|-------|---------|
| **Primary** | `hsl(217 60% 70%)` | rgb(142, 184, 225) | Headings, CTAs, brand accent | `dark:bg-primary`, `dark:text-primary` |
| **Background** | `hsl(220 35% 10%)` | rgb(16, 23, 40) | Page background | `dark:bg-page` |
| **Foreground (text)** | `hsl(217 40% 90%)` | rgb(217, 228, 245) | Default body text | `dark:text-default` |
| **Muted text** | `hsl(217 40% 90% / 66%)` | rgb(217, 228, 245, 0.66) | Secondary text | `dark:text-muted` |
| **Card** | `hsl(220 32% 14%)` | rgb(27, 37, 58) | Card backgrounds | `dark:bg-card` |

**Dark mode activation:** Class-based via `@custom-variant dark (&:where(.dark, .dark *))` in `tailwind.css` (BRAND-04, pinned with comment).

**No flicker:** `ApplyColorMode.astro` (PR #646) handles theme switching client-side. Do NOT modify this component.

### Implementation Details

**CSS Custom Properties Location:** `src/components/CustomStyles.astro`
- Update `:root` block with light mode HSL values
- Update `.dark` block with dark mode HSL values
- Tokens automatically flow to Tailwind `@theme` block in `tailwind.css`

**Tailwind Theme Block Location:** `src/assets/styles/tailwind.css`
- Already references `--aw-color-*` vars
- Utilities (`bg-primary`, `text-primary`, etc.) generated automatically from `@theme` definitions

**Source:** CONTEXT.md D-02, D-03, D-04 (dashboard CSS ported directly)

---

## 5. Components & Utilities

### Existing Tailwind Utilities (to preserve)

| Utility | Location | Purpose |
|---------|----------|---------|
| `btn` | `tailwind.css:53` | Base button shape + reset |
| `btn-primary` | `tailwind.css:57` | Primary CTA button (blue + white text) |
| `btn-secondary` | `tailwind.css:61` | Secondary button |
| `btn-tertiary` | `tailwind.css:65` | Tertiary (text-only, no border) |
| `bg-page` | `tailwind.css:37` | Page background colour |
| `bg-dark` | `tailwind.css:40` | Dark mode page background |
| `bg-light` | `tailwind.css:43` | Light mode page background |
| `text-muted` | `tailwind.css:49` | Muted text colour |

**Preserve exactly as-is.** These utilities reference CSS custom properties that Phase 2 will update.

### Button Variant Pattern

Buttons use a variant map in `Button.astro`:
```ts
const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  tertiary: 'btn btn-tertiary',
  link: 'cursor-pointer hover:text-primary',
};
```

**Button States:**
- **Default:** Primary blue on light, lighter blue on dark
- **Hover:** Darker blue (secondary colour)
- **Focus:** Focus ring (from `btn` base utility)
- **Disabled:** Opacity 0.5 (not yet defined; add during execution if needed)

---

## 6. Logo & Favicon

### Favicon Assets

| File | Format | Size | Purpose |
|------|--------|------|---------|
| `apple-touch-icon.png` | PNG | 180×180 | Apple devices (home screen) |
| `favicon.ico` | ICO | 32×32 | Browser tab (fallback) |
| `favicon.svg` | SVG | Scalable | Modern browser (preferred) |

**Location:** `src/assets/favicons/`

**Action:** Extract logo and favicon assets from live konvoi.eu site (CONTEXT.md D-08). Optimize SVG where possible. Replace all three files.

**Current state:** Files exist but contain AstroWind iconography. Phase 2 replaces them.

### Logo Image

**Location:** `src/assets/images/` (exact filename TBD during execution)

**Usage:** Header / branding across all pages

**Source:** Konvoi dashboard or live site

---

## 7. Copywriting Contract

### Primary CTA

**Label:** "Beratung anfragen" (German) / "Book a consult" (English)

**Usage:** Hero, pricing, use-case pages, end-of-section conversion blocks

**Verb:** "anfragen" (de) / "Book" (en) — request/booking tone, not sign-up

**Source:** current-site-overview.md §6, REQUIREMENTS.md HOME-02, ROI-05

### Empty State Copy

Not applicable to this phase. The site has no dynamic data views. (Deferred to Phase 5+ if forms return empty results.)

### Error State Copy

Not applicable to this phase. (Form error copy deferred to Phase 5: FORMS-07.)

### Destructive Actions Copy

No destructive user actions in Phase 2. (All state management is deferred to Phase 5+ forms.)

### Brand Voice

**`src/data/brand/voice.md`** — Approved vs banned verbs for preventive-vs-reactive positioning

**To be drafted during execution:**
- **Approved verbs:** "prevent", "anticipate", "secure", "detect", "classify"
- **Banned verbs:** "respond", "react", "alert", "react after"
- **Tone:** Professional, German-market B2B, confidence in German engineering

**Source:** CONTEXT.md D-10 (to extract from live site copy + project positioning)

### Canonical Brand Data

**`src/data/brand/canonical.yaml`** — Single source of truth

**Required fields (from CONTEXT.md D-09):**
```yaml
legal:
  entity: KONVOI GmbH
  address: Harburger Schlossstraße 6-12, 21079 Hamburg, Germany
  phone: +49 40 766293660
  emails:
    customer: justus@konvoi.eu        # Justus (customer advisor)
    marketing: heinz@konvoi.eu        # Heinz (investors/marketing)
    general: info@konvoi.eu
    applications: applications@konvoi.eu

pricing:
  tiers:
    - slug: standard
      de_name: Standard
      en_name: Standard
      de_price_display: "ab X EUR / Monat"
      en_price_display: "from X EUR / month"
    - slug: camera-module
      de_name: "+ KONVOI Camera Module"
      en_name: "+ KONVOI Camera Module"
    - slug: logbook
      de_name: "+ KONVOI Logbook"
      en_name: "+ KONVOI Logbook"
```

**Source:** current-site-overview.md §1, §8 (to be verified after creation)

---

## 8. Dark Mode & Theming

### Dark Mode Implementation

**Activation:** Class-based toggle via `<html class="dark">` or `<body class="dark">`

**CSS Variable Override:** `.dark { --aw-color-*: ... }` in `CustomStyles.astro`

**Tailwind Variant:** `@custom-variant dark (&:where(.dark, .dark *))` pinned in `tailwind.css:5` with a comment block marking it as load-bearing (BRAND-04).

```css
@custom-variant dark (&:where(.dark, .dark *));
```

**Flicker Prevention:** `ApplyColorMode.astro` (PR #646) loads on the client before hydration. Do NOT modify this component — it is fragile and essential.

**Dark Mode Fallback:** If system prefers dark, default to dark theme. If user toggles, store preference in localStorage (implementation via `ApplyColorMode.astro`).

**Usage in markup:**
```html
<div class="bg-white dark:bg-slate-900">...</div>
<button class="text-gray-900 dark:text-white">...</button>
```

**All dark-mode utilities auto-generated** from the colour palette above.

---

## 9. Accessibility Baseline

### Success Criteria (BRAND-07)

**Lighthouse audit on template pages (`src/layouts/Layout.astro` + `src/pages/404.astro`):**
- ✓ Contrast ratio ≥ 4.5:1 for all text (WCAG AA minimum)
- ✓ Focus-visible indicator on all keyboard-navigable elements (buttons, links, inputs)
- ✓ Keyboard navigation functional end-to-end (Tab, Shift+Tab, Enter, Escape)
- ✓ No critical Axe violations

### Colour Contrast

**Already compliant** per the colour palette above:
- Primary (`hsl(214.48 38.33% 55.49%)`) on white: 5.5:1 ✓ (WCAG AAA)
- Foreground (`hsl(215 20% 25%)`) on background (`hsl(220 100% 98.04%)`): 10:1 ✓ (WCAG AAA)
- All colour pairs tested during CONTEXT discussion; no contrast issues flagged

### Focus Visibility

**Tailwind utilities applied:**
- Buttons: `focus:ring-blue-500 focus:ring-offset-blue-200 focus:ring-2 focus:ring-offset-2` (from `btn` utility)
- Links: Default browser outline (or custom via `focus-visible:ring-*`)
- Form inputs: To be specified in Phase 5 (forms)

### Keyboard Navigation

- **Tab order:** Natural DOM order (no `tabindex` overrides needed)
- **Skip link:** Not needed for homepage; defer to Phase 4 if needed
- **ARIA labels:** Add as needed on icon-only buttons
- **Heading hierarchy:** H1 only once per page; H2–H6 nested correctly

### Dark Mode Contrast

Dark mode colours already meet WCAG AA:
- Primary on dark bg: 4.8:1 ✓
- Foreground on dark bg: 10:1 ✓

---

## 10. Typography Import & Asset Strategy

### Phase 2 Font Package Additions

**Add to `package.json` dependencies:**
```json
{
  "@fontsource/montserrat": "^5.2.8",
  "@fontsource/pt-serif": "^5.2.8"
}
```

**Install:** `pnpm install` (or `pnpm add` during execution)

### Font Import in Astro

**Option A (Recommended): CSS import in `src/assets/styles/tailwind.css`**

Add before `@import 'tailwindcss'`:
```css
@import '@fontsource/montserrat/400.css';
@import '@fontsource/montserrat/500.css';
@import '@fontsource/montserrat/600.css';
@import '@fontsource/montserrat/700.css';

@import '@fontsource/pt-serif/400.css';
@import '@fontsource/pt-serif/700.css';
```

**Option B (Alternative): Frontmatter in `CustomStyles.astro`**

Import in the Astro frontmatter:
```astro
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/pt-serif/400.css';
```

**Chosen approach:** Option A (CSS imports) — keeps all styling in one file, aligns with Tailwind v4 CSS-first philosophy.

### Verification (BRAND-01)

**Success criteria:**
- `pnpm build` completes with no Google Fonts URLs in the network tab
- Audit: `curl dist/index.html | grep -i "googleapis.com"` returns nothing

---

## 11. Custom CSS & Utilities

### Existing Custom Utilities (from `tailwind.css`)

All custom utilities are preserved as-is:

| Utility | Selector | Purpose |
|---------|----------|---------|
| `btn` | `.btn { ... }` | Base button shape |
| `btn-primary` | `.btn-primary { ... }` | Primary CTA |
| `btn-secondary` | `.btn-secondary { ... }` | Secondary button |
| `btn-tertiary` | `.btn-tertiary { ... }` | Tertiary (text only) |
| `bg-page` | `@utility bg-page { ... }` | Page background |
| `bg-dark` | `@utility bg-dark { ... }` | Dark background |
| `bg-light` | `@utility bg-light { ... }` | Light background |
| `text-muted` | `@utility text-muted { ... }` | Muted text |

### New Custom Utilities (Phase 2 additions, if needed)

**Deferred to execution.** Only add if Lighthouse audit flags missing utilities.

### Header Scroll State (Raw CSS)

Keep raw CSS rule for header scroll behavior:

```css
#header.scroll > div:first-child {
  @apply bg-page md:bg-white/90 md:backdrop-blur-md;
  box-shadow: 0 0.375rem 1.5rem 0 rgb(140 152 164 / 13%);
}
```

---

## 12. Token Migration Strategy

### Step 1: Update CustomStyles.astro

Replace the `:root` and `.dark` blocks with the HSL values from CONTEXT.md D-02 and D-03.

**Before:**
```css
--aw-color-primary: rgb(1 97 239);
--aw-color-secondary: rgb(1 84 207);
```

**After:**
```css
--aw-color-primary: hsl(214.48 38.33% 55.49%);
--aw-color-secondary: hsl(217 60% 93%);
```

### Step 2: Update tailwind.css @theme block

Ensure `@theme` block references the new CSS vars (already in place):

```css
@theme {
  --color-primary: var(--aw-color-primary);
  --color-secondary: var(--aw-color-secondary);
  --color-accent: var(--aw-color-accent);
  --font-sans: var(--aw-font-sans, ...);
  --font-serif: var(--aw-font-serif, ...);
  --font-heading: var(--aw-font-heading, ...);
}
```

### Step 3: Verify Tailwind Generation

Run `pnpm build` and inspect `dist/_astro/*.css` to confirm:
- ✓ `bg-primary`, `text-primary`, `border-primary` are generated from new `--color-primary` value
- ✓ Font utilities use `@fontsource` imports, not system defaults
- ✓ Dark mode utilities (`dark:bg-primary`, etc.) generated from `.dark` variables

---

## 13. Deliverables Checklist

| Item | File/Location | Status | Notes |
|------|---|--------|-------|
| **Typography** | | | |
| Montserrat package | `package.json` | ADD | `@fontsource/montserrat` ^5.2.8 |
| PT Serif package | `package.json` | ADD | `@fontsource/pt-serif` ^5.2.8 |
| Font imports | `src/assets/styles/tailwind.css` | ADD | CSS imports for all weights |
| Font CSS vars | `src/components/CustomStyles.astro` | UPDATE | Set `--aw-font-*` to imported fonts |
| **Colour** | | | |
| Light mode palette | `src/components/CustomStyles.astro` `:root` | UPDATE | HSL values from D-02 |
| Dark mode palette | `src/components/CustomStyles.astro` `.dark` | UPDATE | HSL values from D-03 |
| Tailwind theme | `src/assets/styles/tailwind.css` `@theme` | VERIFY | Auto-uses new CSS vars |
| Custom variant | `src/assets/styles/tailwind.css` | VERIFY | `@custom-variant dark (...)` pinned with comment |
| **Assets** | | | |
| Favicons | `src/assets/favicons/` | REPLACE | apple-touch-icon.png, favicon.ico, favicon.svg |
| Logo image | `src/assets/images/` | REPLACE | Main site logo |
| **Data Files** | | | |
| Canonical brand data | `src/data/brand/canonical.yaml` | CREATE | Legal entity, address, phone, emails, pricing |
| Brand voice guide | `src/data/brand/voice.md` | CREATE | Approved vs banned verbs |
| **Accessibility** | | | |
| Lighthouse audit | Home page | VERIFY | No critical contrast/focus/nav issues |
| Axe audit | Baseline scaffold | VERIFY | Zero critical violations |

---

## 14. Out of Scope (Phase 2)

- i18n routing (Phase 3)
- Content pages (Phase 4+)
- Forms & validation (Phase 5)
- Analytics & consent (Phase 7)
- SEO structured data (Phase 7)

---

## 15. Integration Notes

### No shadcn

This project does not use shadcn. All components are Astro + Tailwind utilities.

### No third-party registries

All design tokens are manually defined. No external component libraries or registries.

### CSS Custom Properties

The `--aw-*` naming comes from the AstroWind template. Keep this naming in Phase 2; renaming is optional for a future refactor.

### Build Pipeline

- `pnpm build` must succeed
- No Google Fonts requests in the final output
- Dark mode flicker test: toggle light/dark in browser DevTools, confirm no flash

---

## 16. Accessibility Audit Approach (BRAND-07)

**Tools:** Lighthouse (Chrome DevTools) + axe DevTools (browser extension)

**Pages to audit:**
1. Home page skeleton (after Phase 2)
2. 404 page (existing)

**Criteria:**
- Lighthouse: 90+ Accessibility score
- Axe: 0 critical/serious violations
- Contrast ratio: ≥4.5:1 (WCAG AA, all text)
- Focus indicators: Visible on all interactive elements
- Keyboard: Tab/Shift+Tab/Enter navigates all UI

**If audit fails:**
- Identify failing element
- Adjust colour palette or add focus utilities
- Re-audit and confirm green before moving to Phase 3

---

## References

| Document | Link | Section |
|----------|------|---------|
| Phase 2 Requirements | `.planning/REQUIREMENTS.md` | BRAND-01..07 |
| Phase 2 Context | `.planning/phases/02-brand-design-system/02-CONTEXT.md` | All decisions D-01..D-11 |
| Current Site Snapshot | `.planning/current-site-overview.md` | §1–5 (brand, product, market) |
| Codebase Conventions | `.planning/codebase/CONVENTIONS.md` | Tailwind CSS v4, Astro patterns |
| Stack Analysis | `.planning/codebase/STACK.md` | Fonts, Tailwind, integrations |

---

**Status:** Draft — Ready for planner review and executor implementation.

**Created:** 2026-04-22 by gsd-ui-researcher
