# Phase 4: Core Marketing Pages - Context

**Gathered:** 2026-04-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Homepage, product page, 7 use-case pages with shared SensorDataViz Preact island, and 4 industry vertical pages — all in DE + EN. A visitor landing on the homepage can navigate through the product story, any theft-type use case with interactive sensor-data visualization, or any industry vertical. All pages follow the Konvoi brand voice and funnel toward the "Book a consult" CTA.

</domain>

<decisions>
## Implementation Decisions

### Homepage hero & sections
- **D-01:** Background video hero — looping muted autoplay MP4 with dark overlay, "SECURITY TECH MADE IN GERMANY" headline, preventive-vs-reactive sub-tagline, and primary "Beratung anfragen" / "Book a consult" CTA. Self-hosted MP4 in `public/` (no YouTube, no consent banner needed).
- **D-02:** Static fallback poster image for dev. Video slot wired in markup (`<video>` element with `poster` attribute). Real MP4 asset added before launch — dev proceeds without waiting for video production.
- **D-03:** Conversion-optimized section order (social proof first):
  1. Hero (video + CTA)
  2. Customer logo wall
  3. 3 testimonials (Schumacher, JJX, Greilmeier)
  4. Unique value props: Preventive / Learning / Independent (3-column)
  5. Preventive-vs-reactive explainer section
  6. "Known from" press-mentions strip
  7. "Supported by" partners/investors strip
  8. End-of-page consult CTA

### SensorDataViz island
- **D-04:** Timeline chart — time-series line/area chart showing motion, shock, and GPS event traces along a timeline. Visualizes how sensor data builds toward a threat classification. Data-driven, matches the "AI classifies patterns" narrative.
- **D-05:** Animated playback — auto-plays on scroll-into-view. Data traces draw left to right, then detection → classification → alarm phases highlight sequentially. Hover/tap shows tooltips with event detail.
- **D-06:** Each of 7 use-case pages embeds the same `SensorDataViz` Preact island, reading per-scenario fixtures from `src/data/sensor-scenarios/*.json` (one JSON file per use case). Fixture schema defined by Claude during planning.

### Content & copy approach
- **D-07:** Generate production-grade DE + EN copy for all Phase 4 pages from `current-site-overview.md` + `voice.md` + `canonical.yaml`. User reviews and edits copy before launch. Real content from day one so the full experience is judgeable during dev.
- **D-08:** Use-case pages render from the `useCase` content collection — markdown entries in `src/content/useCase/de/` and `src/content/useCase/en/` with the Phase 3 locale-aware schema. Editors update copy via PR without touching `.astro` templates.
- **D-09:** Industry vertical pages render from the `industry` content collection — markdown entries in `src/content/industry/de/` and `src/content/industry/en/`. Same pattern as use cases.

### Navigation structure
- **D-10:** Single "Use Cases" / "Anwendungen" top-level nav item with a dropdown listing all 7 use cases, then a separator, then 4 industry verticals. Compact nav bar, verticals secondary to use cases.
- **D-11:** Full nav structure populated in Phase 4: Product, Use Cases (dropdown), Pricing (#), Case Studies (#), Company (#), Contact (#). Items for Phase 5/6 pages link to `#` until those phases build the pages. Nav structure complete from day one per REQ-NAV-01.

### Claude's Discretion
- Chart library choice for SensorDataViz (custom SVG/Canvas, uPlot, or Chart.js — pick smallest viable option)
- Sensor fixture JSON schema structure (`src/data/sensor-scenarios/*.json`)
- Product page sensor-on-trailer diagram approach (SVG illustration, annotated image, or CSS-drawn)
- Which existing widgets to reuse vs create new for each page section
- Mobile nav behavior (hamburger menu pattern, dropdown touch behavior)
- Testimonial data sourcing — inline from `canonical.yaml` or dedicated data structure
- Homepage logo wall and press strip — placeholder logos until real assets provided
- Product page install video slot — same pattern as hero video (wired, fallback image)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Requirements
- `.planning/REQUIREMENTS.md` §Homepage — HOME-01 through HOME-08
- `.planning/REQUIREMENTS.md` §Product page — PROD-01 through PROD-05
- `.planning/REQUIREMENTS.md` §Use cases — UC-01 through UC-05
- `.planning/REQUIREMENTS.md` §Industry verticals — VERT-01 through VERT-04

### Content & Brand Sources
- `.planning/current-site-overview.md` — Structured snapshot of live Jimdo site (2026-04-20); source of truth for copy generation, section content, testimonial quotes, use-case cost anchors, and product specs
- `src/data/brand/voice.md` — Approved vs banned verbs, tone guidelines, copy transformation examples, localization notes (formal "Sie", British EN). **Must read before generating any copy.**
- `src/data/brand/canonical.yaml` — Legal entity, contacts, pricing tiers (slug-stable), install promise, funding data

### Prior Phase Decisions
- `.planning/phases/03-i18n-content-collections/03-CONTEXT.md` — i18n routing (DE at `/`, EN at `/en/`), content collection schemas (locale + translationKey + canonicalKey), routeMap.ts structure, translations.ts pattern
- `.planning/phases/02-brand-design-system/02-CONTEXT.md` — Konvoi HSL colour palette, Montserrat + PT Serif typography, dark mode, `--aw-color-*` CSS vars, `CustomStyles.astro` token pattern

### Codebase
- `src/i18n/routeMap.ts` — All Phase 4 slug pairs already registered (use-case and industry routes)
- `src/content.config.ts` — 7 content collections with Zod schemas; `useCase` and `industry` schemas are the templates for Phase 4 entries
- `src/i18n/translations.ts` — UI string translation helper; Phase 4 adds nav labels, section headings, CTA text

### Codebase Intelligence
- `.planning/codebase/CONVENTIONS.md` — Widget pattern (WidgetWrapper), component naming, import conventions, Tailwind v4 CSS-first patterns
- `.planning/codebase/STRUCTURE.md` — Directory layout, where to add new pages/widgets/content

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Hero.astro` — Existing hero widget with image + content + CTA support. Needs extension for `<video>` background, but structure is reusable.
- `Brands.astro` — Logo wall widget. Directly maps to customer logos, press logos, partners/investors strips (HOME-03, HOME-06, HOME-07).
- `Testimonials.astro` — 3-testimonial section. Maps directly to HOME-04 (Schumacher, JJX, Greilmeier).
- `CallToAction.astro` — End-of-page CTA block. Maps to HOME-08 and every page's consult CTA.
- `Features.astro` / `Features2.astro` / `Features3.astro` — Multi-column feature sections. Candidates for "Preventive / Learning / Independent" value props (HOME-05) and product page features.
- `Steps.astro` / `Steps2.astro` — Step-by-step flow. Maps to PROD-03 "Detection → Classification → Measures".
- `Content.astro` — Image + text section. Useful for product page hardware spec and use-case problem framing.
- `Stats.astro` — Number/stat highlights. Useful for cost anchors on use-case pages (€8B/yr, etc.).
- `Button.astro` — Primary/secondary/tertiary/link variants via `btn-*` utilities.
- `WidgetWrapper.astro` — Section chrome (id, isDark, containerClass, bg slot). Every section component wraps in this.

### Established Patterns
- Tailwind v4 CSS-first config: `@theme`, `@utility`, `@custom-variant` (no JS config)
- Content collections with `glob` loader and Zod schemas
- `~/` path alias for all internal imports
- Astro file-based routing (filename = URL)
- Widget prop types in `src/types.d.ts` extending `Widget` base
- `twMerge` for consumer-supplied class overrides

### Integration Points
- `src/navigation.ts` — Empty `links[]` to populate with full nav structure
- `src/pages/` — New pages: `produkt.astro`, `anwendungen/*.astro`, `branchen/*.astro`, `en/product.astro`, `en/use-cases/*.astro`, `en/industries/*.astro`
- `src/content/useCase/` and `src/content/industry/` — New markdown entries in `de/` and `en/` subdirs
- `src/data/sensor-scenarios/` — New JSON fixture files (one per use case)
- `src/components/widgets/` — New/extended widgets: VideoHero, SensorDataViz wrapper
- `src/i18n/translations.ts` — Add nav labels, section headings, CTA text

</code_context>

<specifics>
## Specific Ideas

- Hero should match the current Jimdo site's video-first feel — visitors currently see motion/action immediately on landing
- Conversion-optimized order puts social proof (logos + testimonials) right after the hero before explaining what KONVOI does — trust before education
- Timeline chart for SensorDataViz was chosen specifically because it shows the "pattern building toward threat classification" narrative — the data tells the prevention story
- Copy generated from `current-site-overview.md` should preserve the cost anchors from the live site (€8B/yr cargo theft, €1.2M pharma shipment, €2,000 diesel, €600/tire) as concrete data points
- Use formal "Sie" for DE copy, British English for EN copy per `voice.md`

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-core-marketing-pages*
*Context gathered: 2026-04-23*
