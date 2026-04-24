---
phase: 04-core-marketing-pages
plan: "01"
subsystem: widget-components
tags:
  - astro-components
  - video
  - scroll-animation
  - marketing
dependency_graph:
  requires:
    - src/components/ui/WidgetWrapper.astro
    - src/components/ui/Button.astro
    - src/components/ui/Headline.astro
  provides:
    - src/components/widgets/HeroVideo.astro
    - src/components/widgets/IncidentVideo.astro
    - src/components/widgets/ScrollSteps.astro
    - src/components/widgets/SensorDiagram.astro
  affects:
    - Plans 02-06 (all consume these shared widget components)
tech_stack:
  added: []
  patterns:
    - HTML5 video element with autoplay muted loop playsinline for mobile-safe background video
    - CSS scroll-timeline (animation-timeline view()) with @supports graceful fallback
    - WidgetWrapper composition pattern for consistent section spacing
    - Percentage-based absolute positioning for responsive callout annotations
key_files:
  created:
    - src/components/widgets/HeroVideo.astro
    - src/components/widgets/IncidentVideo.astro
    - src/components/widgets/ScrollSteps.astro
    - src/components/widgets/SensorDiagram.astro
    - public/videos/.gitkeep
    - public/images/placeholders/.gitkeep
  modified: []
decisions:
  - "Used multi-line JSX attribute style for video element attributes (autoplay/muted/loop/playsinline on separate lines) — idiomatic Astro, all attributes present and correct"
  - "SensorDiagram defaults imageSrc to /images/placeholders/trailer-diagram.png per D-07 placeholder strategy"
  - "aspectRatio prop in IncidentVideo kept in interface for API completeness but aliased as _aspectRatio since aspect-video class covers 16:9 by default"
metrics:
  duration: "4 min"
  completed_date: "2026-04-24"
  tasks: 2
  files: 6
---

# Phase 04 Plan 01: Shared Widget Components Summary

**One-liner:** Four Astro widget components for Phase 4 marketing pages — background video hero, HTML5 video wrapper, CSS scroll-timeline animated steps, and scroll-driven sensor callout diagram.

## What Was Built

Four shared widget components that all Phase 4 marketing plans (02–06) depend on as foundational building blocks.

### HeroVideo.astro
Full-width hero section with a background `<video>` element (`autoplay muted loop playsinline`). Accepts `videoSrc`, `posterImage`, `title`, `subtitle`, `tagline`, and `actions` (mapped to Button components). Includes a `bg-black/50` overlay for text contrast. Structure mirrors the existing Hero.astro pattern (`relative md:-mt-[76px] not-prose`).

### IncidentVideo.astro
Reusable HTML5 video wrapper wrapped in `WidgetWrapper` for consistent section spacing. Accepts `videoSrc`, `posterImage`, `caption`, `aspectRatio`, and `id`. Video renders with `controls autoplay muted loop playsinline` and a German-language fallback message. Optional `<figcaption>` for caption text.

### ScrollSteps.astro
Scroll-triggered animated step sequence using CSS `animation-timeline: view()`. Steps display as numbered circles (1, 2, 3…) with title and description in cards. Full `@supports` fallback ensures older browsers see instant reveal (opacity: 1) rather than blank content. Staggered `animation-range` values per step index (0%, 15%, 30% offsets).

### SensorDiagram.astro
Sensor callout annotations positioned absolutely on a trailer image using CSS percentage coordinates (`left: x%; top: y%`). Each callout fades in via CSS `animation-timeline: view()` with `calloutReveal` keyframes. Defaults to `/images/placeholders/trailer-diagram.png` until user provides the 3D render. Full `@supports` fallback.

## Threat Model Compliance

| Threat ID | Status |
|-----------|--------|
| T-04-01-01 (videoSrc injection) | Mitigated — all props are author-controlled build-time values, no set:html on any prop |
| T-04-01-02 (posterImage external URL) | Mitigated — components accept only local paths, no CDN references introduced |
| T-04-01-03 (video fallback) | Mitigated — poster attribute on all video elements, German fallback text in IncidentVideo |
| T-04-01-04 (set:html injection) | Mitigated — zero uses of set:html in any of the four new components |

## Deviations from Plan

None — plan executed exactly as written.

The multi-line attribute format for video element (autoplay/muted/loop/playsinline on separate lines) is idiomatic Astro JSX style, functionally identical to the single-line format in the plan spec. All four attributes are present on both video elements.

## Known Stubs

- `public/videos/.gitkeep` — videos/ directory scaffolded; user will add `/videos/hero-bg.mp4` and per-use-case MP4 files
- `public/images/placeholders/.gitkeep` — placeholders/ directory scaffolded; user will add `/images/placeholders/trailer-diagram.png`
- SensorDiagram imageSrc defaults to `/images/placeholders/trailer-diagram.png` — placeholder until 3D render provided (D-07)

These stubs are intentional per D-02 and D-07 in CONTEXT.md. Plans 02–06 will reference video/image paths; actual asset files are provided by the user separately.

## Self-Check: PASSED

Files verified:
- src/components/widgets/HeroVideo.astro — EXISTS
- src/components/widgets/IncidentVideo.astro — EXISTS
- src/components/widgets/ScrollSteps.astro — EXISTS
- src/components/widgets/SensorDiagram.astro — EXISTS
- public/videos/.gitkeep — EXISTS
- public/images/placeholders/.gitkeep — EXISTS

Commits verified:
- 31e4d5a — feat(04-01): add HeroVideo.astro and IncidentVideo.astro components
- 54a1c49 — feat(04-01): add ScrollSteps.astro and SensorDiagram.astro components

Astro check: 0 errors, 0 warnings, 0 hints (115 files checked)
