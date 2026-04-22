# Phase 1: Foundation Scrub - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Remove every trace of AstroWind template debris from source and build output, replace the license, add CI enforcement gates, and lock Netlify deploy policy. After this phase, the repo is a clean Konvoi-owned shell ready to receive brand identity (Phase 2) and content (Phase 4+).

</domain>

<decisions>
## Implementation Decisions

### Scrubbed Pages Fate
- **D-01:** Delete `index.astro`, `about.astro`, `contact.astro`, `pricing.astro` entirely. Site shows 404 on these routes until Phase 4+ rebuilds them. Cleanest scrub — zero risk of AstroWind debris leaking through placeholder content.
- **D-02:** Delete `services.astro` permanently. No Konvoi requirement in any phase references a "services" page. The product page (Phase 4) covers what Konvoi offers.

### License
- **D-03:** Replace `LICENSE.md` with a short proprietary notice: "Copyright © 2025–2026 Konvoi GmbH. All rights reserved. Unauthorized copying, modification, or distribution of this software is strictly prohibited without prior written consent from Konvoi GmbH."

### Navigation & Component Cleanup
- **D-04:** Delete `Announcement.astro` entirely. No Konvoi requirement references an announcement bar. Can be recreated from scratch if needed later.
- **D-05:** Strip `src/navigation.ts` footer to bare minimum — remove all ~22 `#` placeholder link sections (Product/Platform/Support/Company). Keep only the footer credit line rewritten to "© Konvoi GmbH" and placeholder slots for legal links (Impressum/Datenschutz come in Phase 7).
- **D-06:** Strip header nav to Konvoi logo + a non-functional DE/EN language switcher shell. No nav links until pages exist in Phase 4. The switcher gets positioning early even though i18n routing is Phase 3.

### Claude's Discretion
- CI grep gate implementation approach (FND-08) — shell script vs. package.json script vs. GitHub Actions step
- Netlify context detection method for `noindex` meta injection (FND-09) — Netlify env vars approach
- `astro.config.ts` `image.domains` cleanup — straightforward removal per FND-06
- `src/config.yaml` replacement values — site URL (`https://www.konvoi.eu`), site name (`Konvoi`), empty Twitter/Google verification fields until Konvoi provides them
- Package removal order and dependency cleanup for `@astrolib/analytics`, `@astrojs/partytown`, `@fontsource-variable/inter` (FND-04)
- GitHub Actions workflow rewrite for pnpm (FND-07) — standard pnpm CI pattern
- `privacy.md` and `terms.md` — delete alongside the other placeholder pages (legal pages rebuilt in Phase 7 as Impressum/Datenschutz)
- `vendor/integration/` `astrowind:config` virtual module naming — leave as-is in Phase 1; grep gate checks `dist/` only so source references are safe; renaming is a separate concern for a future phase if desired

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Requirements
- `.planning/REQUIREMENTS.md` §Foundation & cleanup — FND-01 through FND-10, the exact scope of this phase

### Codebase Intelligence
- `.planning/codebase/CONCERNS.md` — Severity-ranked debt list with exact file paths for every AstroWind artifact to remove
- `.planning/codebase/STRUCTURE.md` — Full directory layout showing what exists and where new code goes
- `.planning/codebase/CONVENTIONS.md` — Coding conventions to follow during cleanup (import style, Tailwind v4 patterns, naming)

### Reference Content
- `.planning/current-site-overview.md` — Snapshot of live Jimdo site; not directly needed for Phase 1 but provides context for what the rebuilt site must eventually contain

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/layouts/Layout.astro`, `PageLayout.astro` — Document shells stay intact; pages deleted in Phase 1 will re-import these when rebuilt
- `src/components/ui/WidgetWrapper.astro`, `Button.astro`, `Headline.astro` — UI primitives are template-agnostic; keep as infrastructure
- `src/components/common/Image.astro` — Responsive image component; keep
- `src/pages/404.astro` — Already exists; becomes the default experience after page deletions
- `src/components/common/ApplyColorMode.astro` — Fragile flicker fix (PR #646); do not touch during scrub

### Established Patterns
- Tailwind v4 CSS-first config in `src/assets/styles/tailwind.css` — `@theme`, `@utility`, `@custom-variant` (no JS config file)
- `astrowind:config` virtual module via `vendor/integration/` — load-bearing, leave naming as-is
- `~/` path alias for all internal imports
- `pnpm` exclusively (never npm)

### Integration Points
- `astro.config.ts` — Integrations list, image domains, site config (main config hub)
- `package.json` — Scripts, dependencies, engine constraints
- `src/config.yaml` — Site identity consumed by `astrowind:config` virtual module
- `src/navigation.ts` — Header/footer menu data
- `.github/workflows/` — CI pipeline (needs pnpm rewrite)
- `netlify.toml` — Deploy config, headers, redirects

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for all cleanup work.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation-scrub*
*Context gathered: 2026-04-22*
