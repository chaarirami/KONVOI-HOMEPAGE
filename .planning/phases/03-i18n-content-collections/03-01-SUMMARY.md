---
phase: 03-i18n-content-collections
plan: "01"
subsystem: i18n
tags: [i18n, routing, astro-config, translations, route-map]
dependency_graph:
  requires: []
  provides: [i18n-routing-config, route-map, translations, getLocalePath, t-helper]
  affects: [astro.config.ts, LanguageSwitcher, all-locale-aware-components]
tech_stack:
  added: []
  patterns: [astro-i18n-routing, bidirectional-route-map, flat-dot-notation-translations]
key_files:
  created:
    - src/i18n/routeMap.ts
    - src/i18n/translations.ts
  modified:
    - astro.config.ts
decisions:
  - "prefixDefaultLocale moved to routing sub-object in Astro 6 — top-level placement causes TS error"
  - "No fallback configured in i18n block — missing EN pages return 404 as required by I18N-01"
metrics:
  duration: "~8 minutes"
  completed_date: "2026-04-23"
  tasks_completed: 2
  files_modified: 3
---

# Phase 03 Plan 01: i18n Routing Config and Utility Modules Summary

## One-liner

Astro i18n routing with DE at `/` and EN at `/en/`, bidirectional route map covering 22 routes (7 use-cases + 4 industries + 11 top-level), and flat-key translation helper for both locales.

## What Was Built

**Task 1: `astro.config.ts` i18n block**

Added the Astro native i18n configuration block with `defaultLocale: 'de'`, `locales: ['de', 'en']`, and `routing.prefixDefaultLocale: false` so DE routes serve at `/` without a `/de/` prefix and EN routes serve at `/en/`. No fallback is configured, meaning missing EN pages return 404 rather than silently serving DE content (I18N-01 / D-02).

**Task 2: `src/i18n/routeMap.ts`**

Static bidirectional route map keyed by canonical route key, mapping to DE and EN path strings. Covers:
- 11 top-level pages (home, about, contact, product, pricing, roi, funding, careers, news, case-studies, thanks)
- 7 use-case pairs from UC-01 (cargo-theft, diesel-theft, equipment-theft, operations-transparency, trailer-damage, driver-assaults, stationary-time)
- 4 industry vertical pairs from VERT-01 (high-value, cooling, intermodal, other)

`getLocalePath(currentPath, targetLocale)` normalises trailing slashes and returns the equivalent locale path, or `null` if the path is unknown. Used by the LanguageSwitcher (Plan 04).

**Task 3: `src/i18n/translations.ts`**

Flat dot-notation UI string translations for `de` and `en` locales covering: nav labels, CTAs, footer text, language switcher labels, form labels, and misc strings. `t(key, locale)` falls back to the key itself if not found — never throws.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `prefixDefaultLocale` is a nested `routing` property in Astro 6**
- **Found during:** Task 1 verification (`pnpm check:astro`)
- **Issue:** The plan specified `prefixDefaultLocale: false` as a top-level i18n property. In Astro 6 the type system requires it at `i18n.routing.prefixDefaultLocale`. Top-level placement caused TS error `ts(2561): Object literal may only specify known properties`.
- **Fix:** Moved to `routing: { prefixDefaultLocale: false }` sub-object. Semantic intent unchanged — DE still serves at `/` with no prefix.
- **Files modified:** `astro.config.ts`
- **Commit:** ef413af (amended in same commit)

**2. [Rule 1 - Bug] `fallback: undefined` not a valid top-level i18n property**
- **Found during:** Same type check as above
- **Issue:** Setting `fallback: undefined` explicitly is redundant and the Astro 6 type for `fallback` expects an object (locale-to-locale mapping), not `undefined`. The comment intent (no silent fallback) is preserved simply by omitting the `fallback` key.
- **Fix:** Removed `fallback: undefined`; added comment `// No fallback configured — missing EN pages return 404` for clarity.
- **Files modified:** `astro.config.ts`

## Known Stubs

None. The route map stubs route keys for pages not yet built (Phases 4-7), but this is intentional and documented in the file header. The `getLocalePath` function correctly returns `null` for any path not yet in the map, so callers can handle it gracefully. No UI renders broken data.

## Threat Flags

None. The i18n config and static route map introduce no new network endpoints, auth paths, file access patterns, or schema changes at trust boundaries. All threat mitigations from the plan's threat register are in place:
- T-03-01-01: `fallback` omitted (no silent DE fallback for missing EN paths)
- T-03-01-02: `getLocalePath` returns only pre-defined strings from static map or null
- T-03-01-03: `routeMap.ts` is version-controlled, no runtime mutation

## Self-Check: PASSED

Files exist:
- `astro.config.ts` — modified, contains i18n block
- `src/i18n/routeMap.ts` — created
- `src/i18n/translations.ts` — created

Commits exist:
- `ef413af` feat(03-01): add i18n config block to astro.config.ts
- `4b1782a` feat(03-01): create src/i18n/routeMap.ts and translations.ts

Type check: `pnpm check:astro` — 0 errors, 0 warnings, 0 hints (100 files checked)
