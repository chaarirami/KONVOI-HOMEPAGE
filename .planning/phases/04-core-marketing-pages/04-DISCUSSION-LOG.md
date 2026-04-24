# Phase 4: Core Marketing Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-24
**Phase:** 04-core-marketing-pages
**Areas discussed:** SensorDataViz widget, Homepage narrative flow, Content & copy strategy, Product page visuals

---

## SensorDataViz Widget

| Option | Description | Selected |
|--------|-------------|----------|
| Timeline chart | Line/area chart showing sensor readings over time | |
| Dashboard cards | Stat cards + sparklines showing key metrics | |
| Animated scenario replay | Step-through animation showing incident unfolding | |
| Video from dashboard (user-proposed) | Record staged incidents from existing Next.js dashboard | ✓ |

**User's choice:** Replace SensorDataViz Preact island entirely with `<video>` elements showing real dashboard incident replays.
**Notes:** User has an existing Next.js dashboard at `konvoi-dashboard` with incident replay capability (video + sensor viz + accelerometer + GPS map). Full dashboard embedding rejected due to stack mismatch (Next.js→Astro), bundle weight, and data dependency. Pre-recorded video clips from staged incidents are more credible and far simpler. User confirmed staged incidents are available for recording.

---

## Homepage Narrative Flow

### Hero Emphasis

| Option | Description | Selected |
|--------|-------------|----------|
| Keep preventive-first | "Security Tech Made in Germany" + tagline + CTA, static hero | |
| Preventive-first + background video | Same positioning but with muted autoplay background video | ✓ |
| Product demo video hero | Autoplay loop showing dashboard or trailer install | |
| Stats-driven hero | Lead with €8B/yr cargo theft figure | |

**User's choice:** Preventive-first positioning with background video loop. User has video ready.

### Section Order

| Option | Description | Selected |
|--------|-------------|----------|
| Restructure | Hero → Explainer → UC cards → Testimonials → Logos → Press → Partners → CTA | ✓ |
| Follow Jimdo order | Hero → 3 pillars → Logos → Testimonials → Press → Partners → CTA | |

**User's choice:** Restructured order — puts value proposition before social proof.

### Use-Case Teasers

| Option | Description | Selected |
|--------|-------------|----------|
| Icon cards grid | 3-4 column grid of compact cards with icon + title + link | ✓ |
| Horizontal scroll strip | Single swipeable row | |
| Accordion list | Expand/collapse per use case | |

**User's choice:** Icon cards grid.

### Hero Video

| Option | Description | Selected |
|--------|-------------|----------|
| Placeholder for now | Static image initially, swap video later | |
| Video ready | User provides video during implementation | ✓ |

**User's choice:** Has video ready to provide.

---

## Content & Copy Strategy

### Copy Approach

| Option | Description | Selected |
|--------|-------------|----------|
| AI-generated draft copy | Claude generates DE+EN using voice.md + site overview | ✓ |
| Placeholder lorem ipsum | Structural placeholders only | |
| Port from Jimdo + rewrite | Start from existing copy, rewrite for new positioning | |

**User's choice:** AI-generated production-quality draft copy. User reviews post-build.

### Use-Case Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Full pages (400-600 words) | Problem context, cost data, Konvoi approach, video, CTA | ✓ |
| Compact cards (~200 words) | Concise problem + solution + CTA | |

**User's choice:** Full-depth pages for SEO value and thorough problem framing.

---

## Product Page Visuals

### Trailer Sensor Positions

| Option | Description | Selected |
|--------|-------------|----------|
| SVG diagram | Illustrated trailer with labeled sensor positions | |
| Scroll callouts on 3D render | 3D rendered trailer, scroll reveals sensor callouts | ✓ |
| True 3D model (Three.js) | Interactive .glb model rotating on scroll | |
| Placeholder image | Static placeholder until asset ready | |

**User's choice:** Scroll-driven callout annotations on 3D rendered trailer images. User provides render assets. Initially proposed "3D rendered truck where you scroll to see different sensor positions" — landed on the lighter scroll-callout approach over full Three.js.
**Notes:** True 3D (Three.js) deferred as post-v1 enhancement.

### Detection → Classification → Measures Flow

| Option | Description | Selected |
|--------|-------------|----------|
| 3-step visual flow | Static horizontal/vertical steps with icons | |
| Animated sequence | Scroll-triggered sequential reveal | ✓ |

**User's choice:** Scroll-triggered animated 3-step sequence.

---

## Claude's Discretion

- Icon choices for use-case teaser cards
- Scroll animation library/approach
- Use-case page layout details
- Industry vertical content depth
- Content collection usage vs hardcoded .astro files
- Navigation wiring approach

## Deferred Ideas

- True 3D interactive trailer model (Three.js) — post-v1
- Dashboard embedding as iframe/micro-frontend — not in Phase 4 scope
