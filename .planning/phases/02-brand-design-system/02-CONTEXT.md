# Phase 2: Brand & Design System - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Apply Konvoi brand identity (typography, colour, logo, favicons) site-wide via reusable design tokens, with dark mode stable and accessibility baseline passing. After this phase, every page renders Konvoi's visual identity and the design system primitives are ready for content pages (Phase 4+).

</domain>

<decisions>
## Implementation Decisions

### Colour Palette
- **D-01:** Use the exact HSL palette from the Konvoi dashboard (Next.js + shadcn project). No marketing-specific adjustments — brand consistency across products. Researcher may fine-tune only if Lighthouse flags contrast issues (BRAND-07).
- **D-02:** Light mode primary: `hsl(214.48 38.33% 55.49%)` (steel blue). Secondary: `hsl(217 60% 93%)`. Accent: `hsl(217.14 42% 80.39%)`. Background: `hsl(220 100% 98.04%)`. Foreground: `hsl(215 20% 25%)`.
- **D-03:** Dark mode primary: `hsl(217 60% 70%)`. Background: `hsl(220 35% 10%)`. Foreground: `hsl(217 40% 90%)`. Card: `hsl(220 32% 14%)`. Full dark palette from dashboard CSS.
- **D-04:** Map dashboard HSL tokens into the existing `--aw-color-*` CSS custom property structure in `CustomStyles.astro` (`:root` and `.dark` blocks). The `@theme` block in `tailwind.css` already references these vars — tokens flow through automatically.

### Typography
- **D-05:** Montserrat for headings and sans-serif (maps to `--aw-font-sans` and `--aw-font-heading`). PT Serif for serif/body text (maps to `--aw-font-serif`). Self-hosted via `@fontsource/montserrat` and `@fontsource/pt-serif` packages — never `fonts.googleapis.com`.
- **D-06:** Montserrat weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold). ~120KB total.
- **D-07:** PT Serif weights: 400 (regular), 700 (bold). No italic variants. ~40KB total.

### Logo & Favicon
- **D-08:** Extract logo and favicon assets from the live konvoi.eu site. Researcher downloads, optimises (SVG where possible), and replaces `src/assets/favicons/` (apple-touch-icon.png, favicon.ico, favicon.svg) and the site logo image.

### Brand Data Files
- **D-09:** `src/data/brand/canonical.yaml` content sourced from `.planning/current-site-overview.md` (captured 2026-04-20). Covers legal entity, address, phone, contact emails, and tier prices. User verifies after creation.
- **D-10:** `src/data/brand/voice.md` drafted by extracting patterns from live konvoi.eu copy and the preventive-vs-reactive positioning in PROJECT.md. User reviews and refines.

### Dark Mode
- **D-11:** Dark mode palette comes directly from the dashboard dark theme. No changes to `ApplyColorMode.astro` (fragile PR #646 component — leave untouched). `@custom-variant dark (&:where(.dark, .dark *))` stays pinned in `tailwind.css` with comment per BRAND-04.

### Claude's Discretion
- Accessibility audit approach for BRAND-07 (Axe vs Lighthouse vs both)
- Exact CSS custom property naming migration strategy (whether to rename `--aw-*` prefix or keep as-is for Phase 2)
- Shadow tokens — whether to port dashboard shadow scale or keep current AstroWind shadows
- Chart colours — not needed for marketing site; skip unless a data-viz component demands them
- Border radius tokens — dashboard uses `0.625rem`; Claude decides if marketing site follows or keeps current

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Requirements
- `.planning/REQUIREMENTS.md` -- BRAND-01 through BRAND-07, exact scope of this phase

### Brand Source (dashboard CSS)
- The complete dashboard CSS was provided inline during discussion (not a file in this repo). Key values are captured in D-02 and D-03 above. If the full dashboard CSS is needed, ask the user.

### Current Site Content
- `.planning/current-site-overview.md` -- Structured snapshot of live Jimdo site (2026-04-20); source of truth for canonical.yaml data (D-09) and voice.md extraction (D-10)

### Codebase Intelligence
- `.planning/codebase/CONVENTIONS.md` -- Tailwind v4 CSS-first config patterns, `@theme`/`@utility`/`@custom-variant` conventions
- `.planning/codebase/STACK.md` -- Current font packages, Astro integration wiring, build pipeline

### Phase 1 Context
- `.planning/phases/01-foundation-scrub/01-CONTEXT.md` -- Phase 1 decisions on what was kept/deleted; `ApplyColorMode.astro` fragility note; `--aw-*` CSS var naming left as-is

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/CustomStyles.astro` — Phase 2 placeholder comments already in place for font + colour vars. Direct replacement target for `:root` and `.dark` blocks.
- `src/assets/styles/tailwind.css` — `@theme` block references `--aw-font-*` and `--aw-color-*` vars. Tokens flow through automatically once `CustomStyles.astro` is updated.
- `src/components/common/ApplyColorMode.astro` — Flicker-prevention script for dark mode (PR #646). Do NOT modify.
- `src/components/ui/Button.astro` — Uses `btn-primary`/`btn-secondary` utilities from `tailwind.css` which reference `--color-primary`/`--color-secondary`. Colour change propagates automatically.

### Established Patterns
- Tailwind v4 CSS-first config: `@theme`, `@utility`, `@custom-variant` (no JS config file)
- Font vars set in `CustomStyles.astro` `:root`/`.dark`, consumed by `tailwind.css` `@theme` block
- `@fontsource` packages for self-hosted fonts (current `@fontsource-variable/inter` was removed in Phase 1; same pattern for Montserrat + PT Serif)

### Integration Points
- `src/components/CustomStyles.astro` — Where colour + font CSS vars live (`:root` and `.dark`)
- `src/assets/styles/tailwind.css` — Where `@theme` tokens map CSS vars to Tailwind utilities
- `src/assets/favicons/` — Three favicon files to replace
- `src/assets/images/` — Logo image to replace
- `src/data/brand/` — New directory for `canonical.yaml` + `voice.md` (does not exist yet)
- `package.json` — Add `@fontsource/montserrat` + `@fontsource/pt-serif` dependencies

</code_context>

<specifics>
## Specific Ideas

- Dashboard CSS was provided as the canonical brand reference — the marketing site should feel like the same product family
- Montserrat for headings matches the dashboard's `--font-heading: var(--font-sans)` pattern
- No JetBrains Mono needed for the marketing site (dashboard-only concern)

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope.

</deferred>

---

*Phase: 02-brand-design-system*
*Context gathered: 2026-04-22*
