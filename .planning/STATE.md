---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 07-02-PLAN.md
last_updated: "2026-04-26T13:07:44.288Z"
last_activity: 2026-04-26
progress:
  total_phases: 7
  completed_phases: 4
  total_plans: 27
  completed_plans: 29
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-20)

**Core value:** Turn visitors into booked consult calls.
**Current focus:** Phase 07 — seo-consent-launch

## Current Position

Phase: 07 (seo-consent-launch) — EXECUTING
Plan: 5 of 5
Status: Ready to execute
Last activity: 2026-04-26

Progress: [█████░░░░░] 57%

## Performance Metrics

**Velocity:**

- Total plans completed: 44
- Average duration: ~3 min
- Total execution time: ~0.35 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 3 | ~9 min | ~3 min |
| 02 | 4 | - | - |
| 03 | 4 | - | - |
| 04 | 7 | - | - |
| 05 | 4 | - | - |

**Recent Trend:**

- Last 5 plans: 02-04 (5m), 02-03 (2m), 02-02 (2m), 02-01 (3m), 01-03 (2m)
- Trend: Consistent ~2-5 min/plan

*Updated after each plan completion*
| Phase 01 P03 | 2min | 2 tasks | 4 files |
| Phase 02 P01 | 3min | 2 tasks | 2 files |
| Phase 02 P02 | 2min | 2 tasks | 3 files |
| Phase 02 P03 | 2min | 2 tasks | 2 files |
| Phase 02 P04 | 5min | 1 task  | 0 files |
| Phase 04 P01 | 4 | 2 tasks | 6 files |
| Phase 04 P04 | 15 | 1 tasks | 14 files |
| Phase 04 P07 | 6 | 1 tasks | 8 files |
| Phase 04 P02 | 4 | 2 tasks | 2 files |
| Phase 04 P03 | 3 | 2 tasks | 4 files |
| Phase 04 P05 | 5 | 2 tasks | 2 files |
| Phase 04 P06 | 2 | 2 tasks | 2 files |
| Phase 05 P01 | 3 | 2 tasks | 3 files |
| Phase 05 P02 | 4 | 2 tasks | 4 files |
| Phase 05 P03 | 8 | 2 tasks | 3 files |
| Phase 07 P01 | 4 | 2 tasks | 5 files |
| Phase 07 P03 | 4min | 2 tasks | 7 files |
| Phase 07 P04 | 2 | 2 tasks | 3 files |
| Phase 07 P02 | 3 | 2 tasks | 6 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: 7 phases derived from 99 requirements at standard granularity (1-7 numbering)
- [Roadmap]: Phase 1 (Foundation Scrub) is a hard blocker -- nothing ships until AstroWind debris is gone
- [Roadmap]: i18n (Phase 3) before any content pages (Phase 4+)
- [Roadmap]: SensorDataViz built in Phase 4 alongside use-case pages
- [Roadmap]: Pricing + ROI + funding + forms clustered in Phase 5
- [Roadmap]: SEO + consent + legal are launch gates in Phase 7, after all content
- [Roadmap]: Phase 7 includes Jimdo 301 redirects + DNS cutover as final launch step
- Single CI job replaces two-job npm matrix — pnpm with frozen-lockfile on Node 22 only (FND-07)
- Post-build grep gate in CI permanently enforces no-AstroWind-debris on every PR (FND-08)
- Layout.astro emits noindex,nofollow meta on Netlify deploy-preview and branch-deploy contexts only (FND-09)
- netlify.toml context.branch-deploy no-op echo blocks branch deploys; Netlify UI step required for full FND-10 compliance
- Konvoi HSL colour tokens applied in CustomStyles.astro (is:inline) — dark mode variant pinned in tailwind.css (BRAND-01/02/03/04)
- Primary colour (hsl(214.48 38.33% 55.49%)) restricted to large text ≥24px and UI components only — fails AA for small body text (BRAND-07)
- is:inline audit pattern: HSL tokens appear in HTML output, not _astro/*.css bundle — future CI grep checks must target dist/**/*.html
- Pricing amounts set to "auf Anfrage" / "on request" — live site is quote-based; actual prices to be filled before Phase 5 (PRICE-02)
- Tier slugs (standard, camera-module, logbook) declared stable — Phase 5 ROI calculator references them by slug (PRICE-03)
- [Phase 04]: HeroVideo/IncidentVideo use multi-line JSX attribute style for video element — autoplay muted loop playsinline on separate lines, idiomatic Astro, all attributes present
- [Phase 04]: EN stationary-time slug is stationary-time-optimization per routeMap.ts (not stationary-time as listed in plan)
- [Phase 04]: relatedUseCases stores DE slugs in both locales — EN page template resolves to EN hrefs via hardcoded map
- [Phase 04]: Use plain img tags for public-path SVG logos — Astro 6 Image component throws MissingImageDimension for public SVGs even with dimensions
- [Phase 04]: Product page uses Hero.astro (not HeroVideo) — text-first layout for /produkt and /en/product; background video not needed on product detail page
- [Phase 04]: Placeholder PNGs (1x1 transparent) created for trailer-diagram.png and installation-poster.jpg to satisfy T-04-03-02 — user replaces with real assets
- [Phase 04]: render(entry) from astro:content required for glob loader collections — entry.render() unavailable in Astro 6 content layer API
- [Phase 04]: render(entry) from astro:content required for glob loader collections — entry.render() unavailable in Astro 6 content layer API (already confirmed in 04-05)
- [Phase 05]: Badge text (Empfohlen/Recommended) lives in pricing.ts data file — single-source-of-truth principle
- [Phase 05]: Placeholder WidgetWrapper sections with id anchors for RoiCalculator (Plan 02) and ConsultForm (Plan 03) wiring
- [Phase 05]: Preact island uses automatic JSX runtime via @astrojs/preact — no explicit h import needed
- [Phase 05]: client:load directive (not client:visible) for RoiCalculator — it is the primary page content per UI-SPEC § 7.2
- [Phase 05]: z.literal(true) used for DSGVO consent validation — rejects unchecked checkbox at Zod schema level before form POST
- [Phase 05]: Turnstile token read from DOM via querySelector('[name=cf-turnstile-response]') after submit — implicit rendering pattern, no explicit turnstile.render() call
- [Phase 07]: [Phase 07-01]: Legal pages use PageLayout.astro matching existing simple content pages
- [Phase 07]: [Phase 07-01]: Rybbit legal basis cites § 25 Abs. 2 Nr. 2 TDDDG (not TTDSG) — cookieless analytics exemption
- [Phase 07]: [Phase 07-01]: Cal.eu documented as external link only — no embedding, no data transfer on our domain
- [Phase 07]: [Phase 07-03]: Removed AstroSeo component — replaced with raw link/meta tag emission for full canonical+hreflang control
- [Phase 07]: [Phase 07-03]: Hreflang derivation uses pathname prefix: /en/* is EN, else DE; x-default always points to DE URL
- [Phase 07]: [Phase 07-03]: SchemaOrg.astro emits Organization+LocalBusiness globally; accepts optional schema prop for page-specific JSON-LD
- [Phase 07]: [Phase 07-04]: NODE_VERSION=24 in [build.environment] pins Netlify build to Node 24; deploy-preview context sets CONTEXT env var for Layout.astro noindex gate
- [Phase 07]: [Phase 07-04]: RYBBIT_DOMAIN placeholder in CSP (script-src + connect-src) — must be replaced with actual self-hosted domain before DNS cutover
- [Phase 07]: [Phase 07-02]: vanilla-cookieconsent v3 uses namespace import (import * as) matching export = CookieConsent type definition; TypeScript warning ts(80003) is benign
- [Phase 07]: [Phase 07-02]: Rybbit analytics uses is:inline script tag; CookieConsent uses bundled Astro script module; astro:after-swap listener ensures banner persists across View Transitions

### Pending Todos

None yet.

### Blockers/Concerns

- Before Phase 2: Font licensing for Montserrat + PT Serif should be verified
- Before Phase 4: Sensor-data fixture format/schema needs decision
- Before Phase 5: ROI formula inputs need sales-team sign-off
- Before Phase 6: Case-study customer approvals (Schumacher, JJX, Greilmeier) needed
- Before Phase 7: Jimdo URL redirect inventory, Plausible vs Pirsch decision, trust cert claims

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| *(none)* | | | |

## Session Continuity

Last session: 2026-04-26T13:07:44.285Z
Stopped at: Completed 07-02-PLAN.md
Resume file: None

**Completed Phases:** 3
**Next Phase:** 4 (Core Marketing Pages) — needs planning
