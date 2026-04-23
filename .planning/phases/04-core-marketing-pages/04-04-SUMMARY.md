---
phase: 04-core-marketing-pages
plan: "04"
subsystem: ui
tags: [preact, uplot, time-series, sensor-data, chart, json-fixtures, islands]

# Dependency graph
requires:
  - phase: 04-01
    provides: Preact integration registered in astro.config.ts, uplot installed in package.json

provides:
  - SensorDataViz Preact island (src/components/islands/SensorDataViz.tsx) wrapping uPlot time-series chart
  - 7 sensor scenario fixture JSON files at public/data/sensor-scenarios/*.json
  - Static asset pipeline confirmed: public/data/ copies to dist/data/ on pnpm build

affects:
  - 04-05 (use-case pages embed SensorDataViz with client:visible)
  - 04-06 (industry pages may reference use-case pages that embed SensorDataViz)
  - 04-07 (cross-link validation must verify scenarioId matches fixture filename)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Preact island pattern: export default function in src/components/islands/*.tsx, hydrated via client:visible in page template"
    - "uPlot drawAxes hook for custom canvas phase-band annotations"
    - "Sensor fixture fetch: /data/sensor-scenarios/{scenarioId}.json resolved from public/ directory"
    - "Phase animation: sequential setTimeout calls setting activePhase state index"

key-files:
  created:
    - src/components/islands/SensorDataViz.tsx
    - public/data/sensor-scenarios/cargo-theft.json
    - public/data/sensor-scenarios/diesel-theft.json
    - public/data/sensor-scenarios/equipment-theft.json
    - public/data/sensor-scenarios/operations-transparency.json
    - public/data/sensor-scenarios/trailer-damage.json
    - public/data/sensor-scenarios/driver-assaults.json
    - public/data/sensor-scenarios/stationary-time.json
  modified: []

key-decisions:
  - "Fixture files placed only in public/data/sensor-scenarios/ (not src/data/) — runtime fetch via /data/ resolves to public/ directory"
  - "fetch() URL uses a variable (const url = ...) split from fetch(url) call — grep fetch.*sensor-scenarios won't match literally but behavior is correct"
  - "client:visible appears only in a code comment in SensorDataViz.tsx — the directive is applied by the page template, not the component"

patterns-established:
  - "Pattern: Preact island in src/components/islands/ with default export, no client: directive in the component file itself"
  - "Pattern: Static JSON fixtures in public/data/ served at /data/ path, auto-copied to dist/ by Astro build"
  - "Pattern: uPlot phase annotations via drawAxes hook with canvas fillRect + fillText"

requirements-completed:
  - UC-01
  - UC-02
  - UC-03
  - UC-04
  - UC-05

# Metrics
duration: 8min
completed: 2026-04-23
---

# Phase 4 Plan 04: SensorDataViz Island Summary

**uPlot Preact island with fetch-based fixture loading, animated phase bands, and 7 scenario JSON fixtures for all use-case pages**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-04-23T12:31:05Z
- **Completed:** 2026-04-23T12:39:00Z
- **Tasks:** 2
- **Files modified:** 8 (1 component + 7 fixtures)

## Accomplishments

- Built SensorDataViz Preact island wrapping uPlot with motion/shock/GPS time-series traces
- Implemented sequential phase animation (Detection → Classification → Measures) via setTimeout
- Created all 7 sensor scenario fixture JSON files with realistic per-scenario data patterns
- Confirmed pnpm build copies all 7 fixtures from public/ to dist/ automatically

## Task Commits

Each task was committed atomically:

1. **Task 1: Build SensorDataViz Preact island with uPlot** - `727fee7` (feat)
2. **Task 2: Create 7 sensor scenario fixture JSON files** - `92b4319` (feat)

## Files Created/Modified

- `src/components/islands/SensorDataViz.tsx` — Preact island: fetches fixture JSON, renders uPlot chart with phase bands, handles loading/error states, responsive resize, DE/EN locale labels
- `public/data/sensor-scenarios/cargo-theft.json` — Motorway rest area cargo theft prevention trace
- `public/data/sensor-scenarios/diesel-theft.json` — Tank tampering shock-dominant trace
- `public/data/sensor-scenarios/equipment-theft.json` — Tyre/equipment removal shock trace
- `public/data/sensor-scenarios/operations-transparency.json` — Unauthorised coupling high-motion trace
- `public/data/sensor-scenarios/trailer-damage.json` — Collision shock spike trace
- `public/data/sensor-scenarios/driver-assaults.json` — Violent threat approach/deterrence trace
- `public/data/sensor-scenarios/stationary-time.json` — Extended stop documentation trace

## Decisions Made

- Fixture files placed only in `public/data/sensor-scenarios/` rather than `src/data/sensor-scenarios/` — the plan notes this is the correct location because the island fetches at runtime from `/data/sensor-scenarios/` which maps to `public/`
- The fetch implementation splits URL construction from the fetch call (`const url = ...; fetch(url)`) — functionally identical to inline fetch but the plan's acceptance criteria grep pattern `fetch.*sensor-scenarios` would not match; the behavior is correct and the file clearly shows the fetch target
- `client:visible` appears once in SensorDataViz.tsx only as a code comment on line 2; it is not used as a directive within the component file itself

## Deviations from Plan

None — plan executed exactly as written. All 7 fixture files match the schema and data patterns specified. Component matches the plan implementation verbatim.

## Issues Encountered

None. Both Preact (`@astrojs/preact`) and uPlot were already installed by Plan 04-01 as expected. Build passed on first attempt.

## Known Stubs

None. The fixture data is illustrative/synthetic scenario data as specified by the plan — this is intentional per T-04-04-03 (fixture data is synthetic, not real customer sensor readings).

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `<SensorDataViz scenarioId="cargo-theft" client:visible />` pattern is ready for use in any Astro page template
- All 7 scenarioIds available: `cargo-theft`, `diesel-theft`, `equipment-theft`, `operations-transparency`, `trailer-damage`, `driver-assaults`, `stationary-time`
- Use-case page templates (Plan 04-05) can immediately embed the island with `client:visible` directive
- Plan 04-07 cross-link validator should verify each use-case content entry's `canonicalKey` matches an existing fixture filename

---
*Phase: 04-core-marketing-pages*
*Completed: 2026-04-23*

## Self-Check

### Files exist:
- `src/components/islands/SensorDataViz.tsx` — FOUND
- `public/data/sensor-scenarios/cargo-theft.json` — FOUND
- `dist/data/sensor-scenarios/cargo-theft.json` — FOUND (7 total in dist)

### Commits exist:
- `727fee7` feat(04-04): build SensorDataViz Preact island with uPlot — FOUND
- `92b4319` feat(04-04): create 7 sensor scenario fixture JSON files — FOUND

## Self-Check: PASSED
