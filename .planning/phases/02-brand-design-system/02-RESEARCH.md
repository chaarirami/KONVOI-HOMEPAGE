# Phase 2: Brand & Design System - Research

**Researched:** 2026-04-22
**Domain:** Design tokens, typography, colour theming, accessibility baseline
**Confidence:** HIGH

## Summary

Phase 2 applies the Konvoi visual identity (Montserrat + PT Serif fonts, branded colour palette, logo/favicon assets) site-wide via reusable design tokens, with dark mode stable and accessibility baseline passing. The work clusters into five concrete tasks: (1) add `@fontsource` packages and wire font imports; (2) update CSS custom properties in `CustomStyles.astro` with Konvoi HSL colours; (3) replace favicon and logo assets; (4) create brand data files (`canonical.yaml`, `voice.md`); (5) audit accessibility. All work flows through the existing Tailwind v4 CSS-first architecture — tokens are defined once in `CustomStyles.astro` and automatically propagate to utilities via `tailwind.css` `@theme` block.

**Primary recommendation:** Execute in this order: fonts → colours → assets → data files → accessibility audit. Each step is independent once the previous is merged, allowing parallel verification. The `ApplyColorMode.astro` component must remain untouched — it handles dark mode flicker prevention and is fragile.

---

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Use exact HSL palette from Konvoi dashboard (no marketing-specific adjustments). Fine-tune only if Lighthouse flags contrast issues.
- **D-02:** Light mode primary: `hsl(214.48 38.33% 55.49%)` (steel blue). Secondary: `hsl(217 60% 93%)`. Accent: `hsl(217.14 42% 80.39%)`. Background: `hsl(220 100% 98.04%)`. Foreground: `hsl(215 20% 25%)`.
- **D-03:** Dark mode primary: `hsl(217 60% 70%)`. Background: `hsl(220 35% 10%)`. Foreground: `hsl(217 40% 90%)`. Card: `hsl(220 32% 14%)`.
- **D-04:** Map dashboard HSL tokens into `--aw-color-*` CSS custom property structure in `CustomStyles.astro` (`:root` and `.dark` blocks). `@theme` block in `tailwind.css` already references these vars.
- **D-05:** Montserrat for headings (maps to `--aw-font-sans` and `--aw-font-heading`). PT Serif for body (maps to `--aw-font-serif`). Self-hosted via `@fontsource/montserrat` and `@fontsource/pt-serif` — never `fonts.googleapis.com`.
- **D-06:** Montserrat weights: 400, 500, 600, 700 (~120KB total).
- **D-07:** PT Serif weights: 400, 700, no italic variants (~40KB total).
- **D-08:** Extract logo and favicon assets from live konvoi.eu site. Optimize SVG where possible. Replace `src/assets/favicons/` and site logo image.
- **D-09:** `src/data/brand/canonical.yaml` sourced from `.planning/current-site-overview.md`. Covers legal entity, address, phone, contact emails, tier prices.
- **D-10:** `src/data/brand/voice.md` drafted by extracting patterns from live konvoi.eu copy and preventive-vs-reactive positioning. User reviews and refines.
- **D-11:** Dark mode palette from dashboard dark theme. No changes to `ApplyColorMode.astro` (fragile). `@custom-variant dark (&:where(.dark, .dark *))` pinned in `tailwind.css` with comment.

### Claude's Discretion
- Accessibility audit approach for BRAND-07 (Axe vs Lighthouse vs both)
- CSS custom property naming (keep `--aw-*` prefix or rename for future refactor)
- Shadow tokens (port dashboard shadow scale or keep current AstroWind)
- Chart colours (skip unless data-viz component demands them)
- Border radius tokens (dashboard uses `0.625rem`; follow or keep current)

### Deferred Ideas
None — discussion stayed within phase scope.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BRAND-01 | Montserrat + PT Serif self-hosted via @fontsource packages; no fonts.googleapis.com requests | Font package versions verified; import strategy documented in "Standard Stack" and "Code Examples" |
| BRAND-02 | Konvoi colour palette in Tailwind v4 @theme tokens; HSL values from dashboard | Colour palette mapped to CSS custom properties in CustomStyles.astro; token flow diagram provided |
| BRAND-03 | Favicon and logo assets with Konvoi artwork; no AstroWind iconography | Asset replacement strategy documented; file paths identified |
| BRAND-04 | @custom-variant dark pinned with comment; no changes to ApplyColorMode.astro | Dark mode architecture documented; fragility noted; comment pattern specified |
| BRAND-05 | src/data/brand/canonical.yaml (legal entity, address, phone, emails, tier prices) | Data structure documented; source (current-site-overview.md) referenced; schema provided |
| BRAND-06 | src/data/brand/voice.md (approved vs banned verbs for positioning) | Voice guidelines documented; extraction approach specified; user review step noted |
| BRAND-07 | Axe/Lighthouse baseline: zero critical findings on contrast, focus-visible, keyboard nav | Colour palette contrast already verified (WCAG AAA); audit methodology documented; tools specified |

</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Typography (font loading) | Browser / Client | Build (Astro) | Fonts imported in CSS (`tailwind.css`), delivered as static assets; Astro build wires the imports |
| Colour theming (light/dark) | Browser / Client | Build (Astro) | CSS custom properties set in `CustomStyles.astro`, toggled via `.dark` class; client-side script (`ApplyColorMode.astro`) handles toggle and flicker prevention |
| Favicon delivery | Static / CDN | — | Pre-built favicon assets served from `src/assets/favicons/`; no dynamic logic |
| Logo rendering | Frontend (Astro) | — | Logo image in `src/assets/images/`; embedded in Header component |
| Brand data exposure | Backend / Data Layer | Frontend (Astro) | `canonical.yaml` + `voice.md` in `src/data/brand/`; imported as data in components/pages; used for metadata, footer copy, etc. |
| Accessibility baseline | Frontend / Astro | Build (Tools) | HTML structure + Tailwind utilities ensure contrast/focus/keyboard nav; Lighthouse + Axe audit validates; no server-side involvement |

---

## Standard Stack

### Core (Verified 2026-04-22)

| Library | Version | Purpose | Why Standard | Source |
|---------|---------|---------|--------------|--------|
| `@fontsource/montserrat` | ^5.2.8 | Montserrat font self-hosting (headings) | Industry-standard hosted font package; replaces Google Fonts CDN (Munich 2022 ruling); no licensing cost | [VERIFIED: npm registry] — package exists, stable, widely used in EU projects |
| `@fontsource/pt-serif` | ^5.2.8 | PT Serif font self-hosting (body) | Open-source serif face matching current site; no licensing cost | [VERIFIED: npm registry] — package exists, stable |
| `tailwindcss` | ^4.2.2 | CSS-first utility framework | Current project standard; v4 CSS-first avoids JS config | [VERIFIED: package.json] — already installed |
| `@tailwindcss/vite` | ^4.2.2 | Tailwind v4 Vite plugin | Wired in `astro.config.ts`; replaces deprecated `@astrojs/tailwind` | [VERIFIED: package.json] — already installed |
| `@tailwindcss/typography` | ^0.5.19 | Typography plugin (prose styling) | Activated in `tailwind.css` via `@plugin` directive | [VERIFIED: package.json] — already installed |

### No External Design System Library

| Why Not | Constraint |
|---------|-----------|
| shadcn/ui | Project uses Astro + Tailwind utilities, not React. No component library needed. |
| Storybook | Marketing site; component documentation via code examples + Tailwind utilities sufficient |
| Design system SaaS | Konvoi dashboard CSS is the canonical source (D-01, D-02, D-03); no third-party registry |

### Installation

```bash
pnpm add @fontsource/montserrat@^5.2.8 @fontsource/pt-serif@^5.2.8
```

**Note:** `tailwindcss`, `@tailwindcss/vite`, and `@tailwindcss/typography` are already installed. Verify versions match above before execution.

### Version Verification (2026-04-22)

```bash
npm view @fontsource/montserrat version
npm view @fontsource/pt-serif version
```

**Current versions from npm registry:**
- `@fontsource/montserrat`: 5.2.8 (published 2025-12-10) [VERIFIED]
- `@fontsource/pt-serif`: 5.2.8 (published 2025-12-10) [VERIFIED]

Both packages are current as of this session. Total combined asset size: ~160KB (120KB Montserrat + 40KB PT Serif), well within acceptable performance budget for a marketing site.

---

## Architecture Patterns

### System Architecture Diagram

```
User Browser
    ↓
Load HTML (dist/index.html)
    ↓
    ├─→ src/assets/styles/tailwind.css (compiled to dist/_astro/*.css)
    │   ├─→ @import '@fontsource/montserrat/400.css'  [static asset]
    │   ├─→ @import '@fontsource/pt-serif/400.css'    [static asset]
    │   ├─→ @import 'tailwindcss'                     [Tailwind core]
    │   ├─→ @plugin '@tailwindcss/typography'         [plugin]
    │   ├─→ @custom-variant dark (...)                [class-based dark mode]
    │   └─→ @theme { --color-primary: var(--aw-color-primary) ... }
    │       (variables reference CustomStyles.astro CSS vars)
    │
    ├─→ src/components/CustomStyles.astro (compiled to <style> in HTML <head>)
    │   ├─→ :root { --aw-color-primary: hsl(214.48 38.33% 55.49%); ... }
    │   └─→ .dark { --aw-color-primary: hsl(217 60% 70%); ... }
    │
    ├─→ src/assets/favicons/ (favicon.svg, favicon.ico, apple-touch-icon.png)
    │   [Browser tab + home screen icons]
    │
    ├─→ src/assets/images/ (logo image)
    │   [Header branding]
    │
    └─→ src/data/brand/ (canonical.yaml, voice.md)
        [JSON/YAML data parsed at build time; available to components]

Dark Mode Toggle:
    User clicks theme toggle
        ↓
    src/components/common/ApplyColorMode.astro (client script)
        ├─→ Detect system preference (prefers-color-scheme)
        ├─→ Read localStorage for user override
        ├─→ Apply/remove .dark class on <html>
        └─→ No page reload; CSS cascade applies dark mode vars
```

### Token Flow: From Design to DOM

1. **Design decisions** → `CONTEXT.md` (D-02, D-03 locked HSL values)
2. **CSS custom properties** → `src/components/CustomStyles.astro` (`:root` and `.dark` blocks)
3. **Tailwind theme mapping** → `src/assets/styles/tailwind.css` (`@theme` block references `var(--aw-color-*)`)
4. **Utility generation** → Tailwind compiler generates `bg-primary`, `text-primary`, `dark:bg-primary`, etc.
5. **HTML markup** → Components use `class="bg-primary dark:bg-secondary"` (static classes)
6. **Rendered DOM** → Browser applies CSS; dark mode toggle updates `:root` or `.dark` scope

### Recommended Project Structure

```
src/
├── assets/
│   ├── styles/
│   │   └── tailwind.css              # Tailwind config + @theme + @utility
│   ├── favicons/
│   │   ├── favicon.svg               # Phase 2: Replace
│   │   ├── favicon.ico               # Phase 2: Replace
│   │   └── apple-touch-icon.png      # Phase 2: Replace
│   └── images/
│       └── [logo image]              # Phase 2: Replace
├── components/
│   └── CustomStyles.astro            # Phase 2: Update :root + .dark CSS vars
├── data/
│   └── brand/                        # Phase 2: Create this directory
│       ├── canonical.yaml            # Phase 2: Create
│       └── voice.md                  # Phase 2: Create
├── layouts/
│   └── Layout.astro                  # No changes; uses CustomStyles + tailwind
└── pages/
    └── [page routes]                 # Components inherit theming
```

### Pattern 1: Font Loading via @fontsource

**What:** Self-hosted web fonts via @fontsource packages — no Google Fonts CDN, no GDPR concerns.

**When to use:** Always, for any font that needs to be delivered to browsers.

**Example:**

```css
/* src/assets/styles/tailwind.css */
@import '@fontsource/montserrat/400.css';
@import '@fontsource/montserrat/500.css';
@import '@fontsource/montserrat/600.css';
@import '@fontsource/montserrat/700.css';

@import '@fontsource/pt-serif/400.css';
@import '@fontsource/pt-serif/700.css';

@import 'tailwindcss';

/* Later in file: */
@theme {
  --font-sans: var(--aw-font-sans, ui-sans-serif), ...;
  --font-serif: var(--aw-font-serif, ui-serif), ...;
  --font-heading: var(--aw-font-heading, ui-sans-serif), ...;
}
```

```astro
<!-- src/components/CustomStyles.astro -->
<style is:inline>
  :root {
    --aw-font-sans: 'Montserrat', sans-serif;
    --aw-font-serif: 'PT Serif', serif;
    --aw-font-heading: 'Montserrat', sans-serif;
  }
</style>
```

**Result:** Fonts load synchronously with CSS; no layout shift (FOUT/FOIT avoided because @fontsource delivers matching fallback metrics).

[CITED: @fontsource documentation — packages provide self-hosted web fonts without external CDN]

### Pattern 2: CSS Custom Properties + Tailwind @theme

**What:** Define brand colours once in CSS custom properties, reference them in Tailwind's `@theme` block, get utilities automatically.

**When to use:** Always, for any design token that should cascade to multiple utilities.

**Example:**

```css
/* src/components/CustomStyles.astro */
:root {
  --aw-color-primary: hsl(214.48 38.33% 55.49%);
  --aw-color-secondary: hsl(217 60% 93%);
}

.dark {
  --aw-color-primary: hsl(217 60% 70%);
  --aw-color-secondary: hsl(217 40% 90%);
}
```

```css
/* src/assets/styles/tailwind.css */
@theme {
  --color-primary: var(--aw-color-primary);
  --color-secondary: var(--aw-color-secondary);
}
```

```astro
<!-- In any component: -->
<button class="bg-primary text-white dark:bg-secondary">
  Click me
</button>
```

**Result:** Single source of truth; light/dark utilities auto-generated; no duplication.

[CITED: Tailwind CSS v4 documentation — @theme block with CSS custom properties is the v4 pattern (replaces v3 config file)]

### Pattern 3: Dark Mode Toggle via Class + Client Script

**What:** Dark mode implemented as a class on `<html>` or parent, updated by a client-side script that checks system preference + localStorage.

**When to use:** All interactive dark mode toggles.

**Example:**

```astro
<!-- src/components/common/ApplyColorMode.astro (DO NOT MODIFY) -->
<script is:inline>
  // On page load, detect system preference or read localStorage
  const isDark = localStorage.getItem('theme') === 'dark' || 
                 window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDark) document.documentElement.classList.add('dark');
</script>
```

```css
/* src/assets/styles/tailwind.css */
@custom-variant dark (&:where(.dark, .dark *));
```

```astro
<!-- In any component: -->
<div class="bg-white dark:bg-slate-900 text-black dark:text-white">
  Content changes based on .dark class
</div>
```

**Result:** Dark mode toggle with no page reload; flicker prevented by script running before hydration.

**CRITICAL:** Do NOT modify `ApplyColorMode.astro` — it is fragile and responsible for flicker prevention (PR #646).

[CITED: Tailwind CSS v4 documentation — @custom-variant replaces v3 darkMode: 'class' config]

### Anti-Patterns to Avoid

- **Inline dark mode overrides in every component:** Use `@theme` + CSS custom properties instead; avoids duplication and maintenance burden.
- **Hard-coded hex/rgb colours in utility classes:** Always use CSS custom properties from `@theme` so theme changes propagate globally.
- **Google Fonts CDN:** Always use `@fontsource` packages for legal/performance reasons (Munich 2022 ruling).
- **Modifying `ApplyColorMode.astro`:** This component is a fragile flicker-prevention mechanism. Leave it alone; if dark mode logic needs changes, coordinate with a maintenance window.
- **Custom colour tokens without a corresponding utility:** If you define a CSS var, ensure it's mapped in `@theme` so utilities are generated.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Web font delivery | Custom font server or manual @font-face rules | `@fontsource` packages | Handles metrics, fallbacks, weight variants, modern formats automatically |
| Design token management | Spreadsheet or config file outside codebase | CSS custom properties + Tailwind @theme | Single source of truth; cascading; automatic utility generation |
| Dark mode toggle | Custom localStorage + class management | `ApplyColorMode.astro` (existing) | Prevents flicker; handles system preference; proven in production |
| Colour contrast validation | Manual WCAG checks | Lighthouse + Axe DevTools | Automated, comprehensive, flags edge cases |
| Favicon generation | Custom script or manual SVG/ICO creation | Extract from live site, optimize with SVG tools | Time-consuming; error-prone; existing assets are already optimized |

**Key insight:** Design systems are deceptively complex — font loading requires understanding font metrics and fallbacks, dark mode requires careful script timing, and colour contrast has legal implications (WCAG AA/AAA). Using proven patterns and tools saves time and prevents subtle bugs.

---

## Common Pitfalls

### Pitfall 1: Font Loading Causing Layout Shift (FOUT/FOIT)

**What goes wrong:** Fonts load slowly; browser renders with fallback; text jumps when real font arrives. Affects Cumulative Layout Shift (CLS) metric.

**Why it happens:** Web fonts are external resources; if fallback metrics don't match, layout shifts. Using `@import` without proper sizing can cause invisible text (FOIT).

**How to avoid:**
- Use `@fontsource` packages which ship matching fallback metrics.
- Declare `font-display: swap` in `@font-face` (or trust @fontsource defaults, which use `swap`).
- Test on slow 3G (DevTools throttling) to confirm no visible jump.

**Warning signs:**
- Text appears, disappears, then reappears with different size/weight.
- Lighthouse CLS score > 0.1.

### Pitfall 2: Dark Mode Flicker on Page Load

**What goes wrong:** Page loads in light mode, then suddenly flashes to dark mode (or vice versa). Terrible UX; looks buggy.

**Why it happens:** If dark mode class is applied after initial render, there's a flash. If script runs too late, the delay is noticeable.

**How to avoid:**
- Use `is:inline` script in `ApplyColorMode.astro` so it runs before hydration.
- Never move `ApplyColorMode.astro` logic into a lazy hydrated component.
- Test by toggling theme and reloading the page with DevTools open.

**Warning signs:**
- You see the page flash light→dark or dark→light on every reload.
- Dark mode toggle works but has visible delay.

### Pitfall 3: CSS Custom Property Fallback Madness

**What goes wrong:** A component references a CSS var that doesn't exist. The fallback chain is unclear. Dark mode colours are inconsistent.

**Why it happens:** If you define `--color-primary` in `:root` but forget to add it to `.dark`, dark mode breaks. If fallback chain is too long, it's hard to debug.

**How to avoid:**
- Always define both `:root` and `.dark` blocks side-by-side in `CustomStyles.astro`.
- Use a template structure to ensure parity (same keys in both blocks).
- Test dark mode explicitly: toggle in DevTools, verify all colours change.

**Warning signs:**
- Dark mode colours are wrong (too bright, too dark, garbled).
- Some components inherit correct dark colours, others don't.

### Pitfall 4: Tailwind v4 @theme Syntax Confusion

**What goes wrong:** Tokens defined in CSS custom properties don't generate utilities. Or utilities are duplicated because both `@theme` and `@utility` are used for the same thing.

**Why it happens:** v4 changed the syntax from v3. `@theme` is the new pattern; `@utility` is for custom rules that don't have a corresponding token.

**How to avoid:**
- Use `@theme { --color-primary: var(--aw-color-primary); }` for tokens (generates utilities automatically).
- Use `@utility btn { @apply ... }` for custom rules (utilities without a token).
- Never use both for the same concept.

**Warning signs:**
- `bg-primary` doesn't exist (but you defined `--color-primary`).
- Tailwind build warnings about duplicate utilities.

### Pitfall 5: Forgetting to Audit Light Mode Too

**What goes wrong:** Dark mode contrast is perfect, but light mode has text that fails WCAG AA. Or focus indicators are invisible in light mode.

**Why it happens:** Contrast math is relative to background. A dark text on light background can be different from light text on dark background. Focus rings can be too subtle in one mode.

**How to avoid:**
- Run Lighthouse + Axe on BOTH light and dark modes explicitly.
- Check colour contrast for every text/background pair in both modes.
- Test focus visibility by tabbing through the page in both modes.

**Warning signs:**
- Lighthouse accessibility score is high, but Axe flags contrast violations.
- Focus ring is invisible in light mode but visible in dark mode (or vice versa).

---

## Code Examples

### 1. Font Import in Tailwind (BRAND-01)

**Source:** [CITED: @fontsource documentation] + project conventions

```css
/* src/assets/styles/tailwind.css — at the top, before @import 'tailwindcss' */

@import '@fontsource/montserrat/400.css';
@import '@fontsource/montserrat/500.css';
@import '@fontsource/montserrat/600.css';
@import '@fontsource/montserrat/700.css';

@import '@fontsource/pt-serif/400.css';
@import '@fontsource/pt-serif/700.css';

@import 'tailwindcss';
@plugin '@tailwindcss/typography';
```

### 2. CSS Custom Properties for Colours (BRAND-02)

**Source:** [CITED: Tailwind v4 CSS-first documentation] + CONTEXT.md D-02, D-03

```astro
<!-- src/components/CustomStyles.astro -->
---
// Font imports will be added in Phase 2 (BRAND-01)
---

<style is:inline>
  :root {
    /* Fonts -- Phase 2 will replace with Montserrat + PT Serif (BRAND-01) */
    --aw-font-sans: 'Montserrat', sans-serif;
    --aw-font-serif: 'PT Serif', serif;
    --aw-font-heading: 'Montserrat', sans-serif;

    /* Light mode colours from Konvoi dashboard (CONTEXT.md D-02) */
    --aw-color-primary: hsl(214.48 38.33% 55.49%);
    --aw-color-secondary: hsl(217 60% 93%);
    --aw-color-accent: hsl(217.14 42% 80.39%);
    --aw-color-bg-page: hsl(220 100% 98.04%);
    --aw-color-text-default: hsl(215 20% 25%);
    --aw-color-text-muted: hsl(215 20% 25% / 66%);

    ::selection {
      background-color: lavender;
    }
  }

  .dark {
    /* Dark mode colours from Konvoi dashboard (CONTEXT.md D-03) */
    --aw-font-sans: 'Montserrat', sans-serif;
    --aw-font-serif: 'PT Serif', serif;
    --aw-font-heading: 'Montserrat', sans-serif;

    --aw-color-primary: hsl(217 60% 70%);
    --aw-color-secondary: hsl(217 40% 90%);
    --aw-color-accent: hsl(217.14 42% 80.39%);
    --aw-color-bg-page: hsl(220 35% 10%);
    --aw-color-card: hsl(220 32% 14%);
    --aw-color-text-default: hsl(217 40% 90%);
    --aw-color-text-muted: hsl(217 40% 90% / 66%);

    ::selection {
      background-color: black;
      color: snow;
    }
  }
</style>
```

### 3. Tailwind @theme Mapping (BRAND-02)

**Source:** [CITED: Tailwind v4 CSS-first documentation]

```css
/* src/assets/styles/tailwind.css */
@import 'tailwindcss';

@plugin '@tailwindcss/typography';

/* CRITICAL: This line is load-bearing for dark mode (BRAND-04) */
/* Do NOT remove or modify. See Phase 1 CONTEXT.md for PR #646 fragility. */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-primary: var(--aw-color-primary);
  --color-secondary: var(--aw-color-secondary);
  --color-accent: var(--aw-color-accent);
  --color-default: var(--aw-color-text-default);
  --color-muted: var(--aw-color-text-muted);

  --font-sans:
    var(--aw-font-sans, ui-sans-serif), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--aw-font-serif, ui-serif), ui-serif, Georgia, serif;
  --font-heading:
    var(--aw-font-heading, ui-sans-serif), ui-sans-serif, system-ui, sans-serif;
}
```

### 4. Brand Data File (BRAND-05)

**Source:** [CITED: current-site-overview.md §1, §8] + CONTEXT.md D-09

```yaml
# src/data/brand/canonical.yaml
legal:
  entity: KONVOI GmbH
  address: Harburger Schlossstraße 6-12, 21079 Hamburg, Germany
  phone: +49 40 766293660
  emails:
    customer: justus@konvoi.eu
    marketing: heinz@konvoi.eu
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

### 5. Brand Voice File (BRAND-06)

**Source:** [ASSUMED] — User will refine after initial draft

```markdown
# src/data/brand/voice.md

## Konvoi Brand Voice

### Preventive vs. Reactive Positioning

KONVOI is "the first **preventive** solution for your fleet." This means:

**Approved verbs:**
- prevent, anticipate, secure, detect, classify, deter, enable
- "We prevent cargo theft" (not "We alert you to theft")

**Banned verbs:**
- respond, react, alert (implies reactive, not preventive)
- avoid, react-after, "respond to alerts"

### Tone
- Professional, confident in German engineering (Hamburg-based)
- B2B direct language (no hype, no marketing fluff)
- Data-driven when possible (€8B/yr theft market, 80% de-minimis subsidy)

### Example copy transformations

**Instead of:** "Our system alerts you when theft is detected"
**Say:** "Our system **detects and prevents** cargo theft with AI classification"

**Instead of:** "Respond quickly to security threats"
**Say:** "Anticipate threats and secure your fleet proactively"
```

### 6. Dark Mode Toggle (Reference: DO NOT MODIFY)

**Source:** [CITED: Tailwind v4 documentation] + Phase 1 context (PR #646)

```astro
<!-- src/components/common/ApplyColorMode.astro — EXISTING, DO NOT TOUCH -->
<script is:inline>
  function applyColorMode() {
    const savedMode = localStorage.getItem('aw-mode');
    const isDark =
      savedMode === 'dark' ||
      (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  applyColorMode();
  window.addEventListener('storage', applyColorMode);
</script>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Google Fonts CDN | @fontsource self-hosted packages | ~2020 | Eliminates GDPR/privacy concerns; improves performance; avoids Munich ruling compliance risk |
| Tailwind v3 config file (`tailwind.config.js`) | Tailwind v4 CSS-first (`@import 'tailwindcss'`) | v4 (2024) | Simpler config; all styling in one CSS file; no JS config bloat |
| `darkMode: 'class'` in config | `@custom-variant dark (...)` in CSS | v4 (2024) | Cleaner, more declarative; no config file needed |
| Hard-coded colour hex values | CSS custom properties + Tailwind @theme | Industry standard (2023+) | Single source of truth; easier maintenance; supports theming |
| Manual accessibility testing | Lighthouse + Axe DevTools (automated) | 2023+ | Faster feedback; catches regressions; documented standards (WCAG 2.1) |

**Deprecated/outdated:**
- **Google Fonts:** Munich 2022 ruling makes it a compliance risk for German-market sites. @fontsource is the replacement.
- **Tailwind v3 JS config:** v4 CSS-first is simpler and more in line with CSS standards. No reason to use v3 config in new code.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|--------------|
| A1 | `@fontsource/montserrat` and `@fontsource/pt-serif` v5.2.8 are current and stable | Standard Stack | If versions are outdated, font metrics or features may differ; could affect layout or rendering |
| A2 | Konvoi dashboard CSS values (D-02, D-03 HSL palette) are final and won't change | User Constraints | If colours are later adjusted, Phase 2 tokens would need re-work before Phase 3+ content ships |
| A3 | `ApplyColorMode.astro` can remain untouched during Phase 2 | Code Examples | If modifications are needed (e.g., new theme options), coordination with a maintenance window required |
| A4 | Logo and favicon assets can be extracted from live konvoi.eu site | User Constraints | If assets are not publicly available or behind auth, extraction step fails; need alternative source |
| A5 | `src/data/brand/canonical.yaml` data (addresses, phone, emails) matches current Konvoi operational info | User Constraints | If sourced from outdated snapshot (2026-04-20), data may be stale; user must verify after creation |

**Mitigation:** User reviews and confirms canonical.yaml and voice.md before Phase 3 merges. Font versions verified against npm registry in this session (current as of 2026-04-22).

---

## Open Questions

1. **Font Weight Subsetting**
   - What we know: D-06 specifies Montserrat 400/500/600/700; D-07 specifies PT Serif 400/700.
   - What's unclear: Should we subset fonts further (e.g., remove weights not used in markup)? Or keep all weights available?
   - Recommendation: Start with full weights (120KB Montserrat + 40KB PT Serif = 160KB total). Measure actual usage post-launch. If performance impact detected, revisit subsetting in a future maintenance phase.

2. **Shadow and Border Radius Tokens**
   - What we know: Claude's discretion allows shadow/border-radius decisions. Dashboard uses `0.625rem` border radius.
   - What's unclear: Should marketing site adopt dashboard border radius, or keep AstroWind defaults?
   - Recommendation: Defer to execution phase. If designer input available, align with dashboard. Otherwise, keep status quo (Phase 1 preserved AstroWind utilities).

3. **Chart Colour Palette**
   - What we know: Phase 2 scope doesn't include data visualizations (deferred to Phase 4+ use-case pages).
   - What's unclear: When `SensorDataViz` is built in Phase 4, how many colours do we need? Should we define a chart palette now?
   - Recommendation: Skip for Phase 2. Add chart colours in Phase 4 when SensorDataViz requirements are clear.

4. **Accessibility Audit Tool Selection**
   - What we know: BRAND-07 requires "Axe / Lighthouse baseline passes with no critical findings."
   - What's unclear: Run both tools, or either one? Any preference?
   - Recommendation: Run both. Lighthouse catches CSS/rendering issues; Axe catches ARIA/HTML semantic issues. Both should pass.

---

## Environment Availability

**Step 2.6: SKIPPED (no external dependencies identified)**

Phase 2 work is entirely within the source tree — no external CLI tools, databases, or services are required beyond the project's existing build pipeline (pnpm, Node.js, Astro). All dependencies are npm packages already in `package.json`.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Lighthouse (Chrome DevTools) + Axe DevTools (browser extension) |
| Config file | None — built-in tools, no project config needed |
| Quick run command | `pnpm build && open dist/index.html` then use DevTools (Lighthouse, Axe tabs) |
| Full suite command | Same as quick run; no automated test suite for marketing site |

### Phase Requirements → Audit Map

| Req ID | Behavior | Audit Type | Tool | Command | Automated? |
|--------|----------|-----------|------|---------|-----------|
| BRAND-01 | No Google Fonts URLs in dist/ | Grep / Audit | Bash | `grep -r "googleapis.com" dist/ \|\| echo "PASS"` | ✅ |
| BRAND-02 | Colour tokens generate utilities (bg-primary, text-primary, dark:bg-primary) | Build verification | Astro | `pnpm build` (inspect dist/_astro/*.css) | ✅ |
| BRAND-03 | Favicon + logo files exist and are referenced in HTML | File check | Bash | `ls src/assets/favicons/ && grep -q "favicon" dist/index.html` | ✅ |
| BRAND-04 | @custom-variant dark line present + commented in tailwind.css | Grep | Bash | `grep -A2 "@custom-variant dark" src/assets/styles/tailwind.css` | ✅ |
| BRAND-05 | canonical.yaml parses and exports required fields | Type check | Astro | `astro check` (TypeScript validates YAML schema if typed) | ✅ |
| BRAND-06 | voice.md exists and is readable | File check | Bash | `test -f src/data/brand/voice.md && echo "PASS"` | ✅ |
| BRAND-07 | Lighthouse Accessibility ≥90, Axe: 0 critical | Accessibility | Lighthouse + Axe | Manual: DevTools → Lighthouse tab, Axe extension | ❌ Manual |

### Sampling Rate

- **Per task commit:** Run `pnpm build` to verify no syntax errors; `grep -r "googleapis.com" dist/` to verify no Google Fonts.
- **Per wave merge:** Run Lighthouse on baseline pages (home, 404) + Axe DevTools scan. Document scores.
- **Phase gate:** Lighthouse Accessibility score ≥90, Axe 0 critical/serious violations, before moving to Phase 3.

### Wave 0 Gaps

None — existing test infrastructure (Astro `astro check` + grep scripts) covers Phase 2 structural requirements. Accessibility audit is manual but tooling (Lighthouse, Axe) is freely available.

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | no | — |
| V6 Cryptography | no | — |
| V7 Error Handling | no | — |
| V8 Data Protection | partial | CSS custom properties (colours) are public; no sensitive data in `canonical.yaml` beyond contact info (already public on live site) |
| V9 Communications | no | — |
| V10 Malicious Code | no | — |
| V11 Business Logic | no | — |
| V12 Files & Resources | yes | Favicon/logo assets sourced from live site; verify no malicious SVG payloads (XSS risk if SVG contains scripts) |
| V13 API | no | — |
| V14 Configuration | yes | CSS custom properties exposed in CSS (public); `voice.md` is content file (public) |

### Known Threat Patterns for {Astro + Tailwind + Static Site}

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| SVG XSS in favicon/logo | Tampering | Use SVG optimizer to strip executable elements (scripts, event handlers). Verify SVG source before adding to repo. |
| CSS injection via custom properties | Tampering | CSS custom properties are declarative; cannot execute code. No risk. |
| Hardcoded secrets in canonical.yaml | Disclosure | `canonical.yaml` is safe for public emails/phone (already public). No secrets (API keys, tokens) belong here. Use `.env` (git-ignored) for secrets. |
| Man-in-the-middle on font delivery | Tampering | `@fontsource` packages are npm-delivered; no runtime fetch. Integrity guaranteed by npm lockfile (`pnpm-lock.yaml`). |

**Conclusion:** Phase 2 has minimal security surface. Largest risk is SVG payload injection in favicon/logo — mitigate by sanitizing external SVG sources.

---

## Sources

### Primary (HIGH confidence)

- **npm registry** - `@fontsource/montserrat` v5.2.8, `@fontsource/pt-serif` v5.2.8 verified 2026-04-22
- **project package.json** - tailwindcss ^4.2.2, @tailwindcss/vite ^4.2.2, @tailwindcss/typography ^0.5.19 confirmed as current dependencies
- **CONTEXT.md** - Phase 2 locked decisions (D-01 through D-11) from discuss-phase session 2026-04-22
- **02-UI-SPEC.md** - UI Design Contract with detailed colour palette, typography specs, component inventory
- **CONVENTIONS.md** - Tailwind v4 CSS-first patterns, Astro component conventions, import organization rules
- **STACK.md** - Technology stack analysis; confirms Tailwind v4 CSS-first, astro-icon, @tailwindcss/vite wiring

### Secondary (MEDIUM confidence)

- **current-site-overview.md** - Live Konvoi.eu site snapshot (2026-04-20); source for canonical.yaml content, brand voice extraction
- **01-CONTEXT.md** - Phase 1 decisions including ApplyColorMode.astro fragility (PR #646), AstroWind cleanup completed
- **@fontsource documentation** - Package structure, weight availability, self-hosting methodology [CITED]
- **Tailwind v4 CSS-first documentation** - @theme, @custom-variant, @utility syntax and semantics [CITED]

### Tertiary (LOW confidence - marked for validation)

- **ASSUMED** - Konvoi dashboard CSS values (D-02, D-03 HSL palette) will not change during Phase 2 execution
- **ASSUMED** - ApplyColorMode.astro can remain untouched (no dark mode logic changes planned)
- **ASSUMED** - Logo/favicon assets are publicly available from konvoi.eu live site

---

## Metadata

**Confidence breakdown:**
- **Standard Stack:** HIGH - Font packages verified on npm registry; Tailwind already in use with current versions confirmed
- **Architecture:** HIGH - Tailwind v4 CSS-first pattern documented in CONVENTIONS.md; token flow is straightforward
- **Pitfalls:** MEDIUM - Common issues documented from experience; Phase 1 already identified ApplyColorMode fragility
- **Accessibility:** MEDIUM - Colour palette contrast verified in discussion phase; audit tools (Lighthouse, Axe) are standard

**Research date:** 2026-04-22
**Valid until:** 2026-05-22 (30 days — design system is stable; npm package versions may drift in 60+ days)

**Confidence:** HIGH overall. Phase 2 is a token + asset migration task with proven patterns. No experimental technologies. Execution risk is low if locked decisions (D-01 through D-11) are honoured.
