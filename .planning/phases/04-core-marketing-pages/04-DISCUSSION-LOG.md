# Phase 4: Core Marketing Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-23
**Phase:** 04-core-marketing-pages
**Areas discussed:** Homepage hero & sections, SensorDataViz island, Content & copy approach, Navigation structure

---

## Homepage hero & sections

### Hero visual approach

| Option | Description | Selected |
|--------|-------------|----------|
| Static image + CTA | High-quality product photo, fast load, reuses Hero.astro | |
| Background video + overlay | Looping muted video with text overlay and CTA, matches Jimdo feel | ✓ |
| Animated illustration | Custom SVG/CSS animation showing prevention flow | |

**User's choice:** Background video + overlay
**Notes:** Matches current Jimdo site feel — visitors currently see motion/action immediately on landing.

### Video source

| Option | Description | Selected |
|--------|-------------|----------|
| Self-hosted MP4 | Ship compressed MP4 in public/, no third-party dependency | ✓ |
| YouTube embed (lazy) | Click-to-load, consent-gated, adds YouTube dependency | |
| Placeholder for now | Static image placeholder, wire video slot | |

**User's choice:** Self-hosted MP4
**Notes:** No consent banner needed, fastest after first visit.

### Video readiness

| Option | Description | Selected |
|--------|-------------|----------|
| Static fallback for now | Build video hero markup + poster image, MP4 added before launch | ✓ |
| I have / will provide video | Drop MP4 into repo during Phase 4 execution | |

**User's choice:** Static fallback for now
**Notes:** Unblocks dev without waiting for video production.

### Homepage section order

| Option | Description | Selected |
|--------|-------------|----------|
| Match current site order | Value props → logos → testimonials → press → partners → CTA | |
| Conversion-optimized reorder | Logos → testimonials → value props → explainer → press → partners → CTA | ✓ |
| You decide | Claude picks best order | |

**User's choice:** Conversion-optimized reorder — social proof first
**Notes:** Trust signals (logos + testimonials) closer to first scroll before explaining what KONVOI does.

---

## SensorDataViz island

### Visualization type

| Option | Description | Selected |
|--------|-------------|----------|
| Timeline chart | Time-series line/area chart showing motion, shock, GPS traces over time | ✓ |
| Step-by-step narrative | Visual storytelling with numbered steps, icons/illustrations | |
| Static diagram per scenario | Simple annotated image/SVG per use case, no JS | |

**User's choice:** Timeline chart
**Notes:** Data-driven, shows pattern building toward threat classification. Matches "AI classifies patterns" narrative.

### Interactivity level

| Option | Description | Selected |
|--------|-------------|----------|
| Animated playback | Auto-plays on scroll-into-view, data draws left to right, hover tooltips | ✓ |
| Static with hover tooltips | Full chart renders immediately, hover for detail | |
| You decide | Claude picks based on complexity budget | |

**User's choice:** Animated playback
**Notes:** Engaging without requiring user input. Detection → Classification → Alarm phases highlight sequentially.

### Chart library

| Option | Description | Selected |
|--------|-------------|----------|
| Custom SVG/Canvas | Zero dependency, ~5-10KB, full animation control | |
| uPlot | Lightweight time-series library, ~35KB | |
| Chart.js | Popular, ~60KB tree-shaken | |

**User's choice:** "You decide" — Claude's discretion
**Notes:** User deferred library choice to Claude. Pick smallest viable option.

---

## Content & copy approach

### Copy production

| Option | Description | Selected |
|--------|-------------|----------|
| Generate real copy | Claude generates DE + EN from current-site-overview + voice.md + canonical.yaml | ✓ |
| Placeholder / lorem ipsum | Structural placeholder text with correct headings | |
| Hybrid: real hero + placeholder body | Real copy for high-visibility sections, placeholder for body | |

**User's choice:** Generate real copy
**Notes:** Gets real content into site fast so full experience is judgeable during dev. User reviews before launch.

### Use-case copy storage

| Option | Description | Selected |
|--------|-------------|----------|
| Content collection | Markdown entries in src/content/useCase/de/ and en/ | ✓ |
| Hardcoded in .astro | Copy directly in Astro page templates | |

**User's choice:** Content collection
**Notes:** Consistent with Phase 3 schema. Editors update copy via PR without touching .astro files.

### Industry vertical copy storage

| Option | Description | Selected |
|--------|-------------|----------|
| Industry collection | Markdown entries in src/content/industry/de/ and en/ | ✓ |
| Hardcoded .astro pages | 4 pages hardcoded in templates | |

**User's choice:** Industry collection
**Notes:** Consistent with use-case pattern. Already registered in Phase 3.

---

## Navigation structure

### Use Cases + Verticals nav nesting

| Option | Description | Selected |
|--------|-------------|----------|
| Use Cases dropdown with verticals | Single top-level item, dropdown with 7 use cases + separator + 4 verticals | ✓ |
| Separate Use Cases + Industries | Two top-level items, two separate dropdowns | |
| Flat top-level (no dropdowns) | All items as direct links, requires index pages | |

**User's choice:** Use Cases dropdown with verticals
**Notes:** Compact nav bar, verticals secondary to use cases. Separator between use cases and industry verticals.

### Future nav items

| Option | Description | Selected |
|--------|-------------|----------|
| Add all nav items now, link to # | Full nav structure from day one, future pages link to # | ✓ |
| Only link existing Phase 4 pages | Nav grows incrementally per phase | |
| You decide | Claude picks based on REQ-NAV-01 | |

**User's choice:** Add all nav items now, link to #
**Notes:** Nav structure complete from day one per REQ-NAV-01. Phase 5/6 replace # links with real pages.

---

## Claude's Discretion

- Chart library for SensorDataViz (custom SVG/Canvas, uPlot, or Chart.js)
- Sensor fixture JSON schema format
- Product page diagram approach
- Widget reuse vs creation decisions
- Mobile nav behavior
- Testimonial data sourcing approach

## Deferred Ideas

None — discussion stayed within phase scope.
