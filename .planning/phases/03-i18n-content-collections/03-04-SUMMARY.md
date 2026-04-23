---
phase: 03-i18n-content-collections
plan: "04"
subsystem: i18n-integration
tags:
  - i18n
  - layout
  - language-switcher
  - routing
dependency_graph:
  requires:
    - "03-01"  # routeMap.ts and i18n config
    - "03-02"  # content collections schema
    - "03-03"  # parity check build gate
  provides:
    - "visible i18n integration: html lang attribute + functional language switcher"
    - "src/pages/en/index.astro — /en/ route"
  affects:
    - "src/layouts/Layout.astro"
    - "src/components/widgets/LanguageSwitcher.astro"
    - "src/pages/en/index.astro"
tech_stack:
  added: []
  patterns:
    - "Astro.currentLocale for locale detection in .astro files"
    - "getLocalePath(pathname, targetLocale) for switcher link resolution"
    - "aria-current='page' on active locale link"
    - "hreflang attributes on language switcher links"
key_files:
  modified:
    - src/layouts/Layout.astro
    - src/components/widgets/LanguageSwitcher.astro
  created:
    - src/pages/en/index.astro
decisions:
  - "Fallback to '/' and '/en/' in LanguageSwitcher when path not in routeMap — handles Phase 3 stub pages without throwing errors"
  - "textDirection hardcoded to 'ltr' — both DE and EN use left-to-right; removes astrowind:config I18N dependency"
  - "aria-current='page' (not 'true') — ARIA best practice for navigation landmarks"
metrics:
  duration: "~8 min"
  completed: "2026-04-23"
  tasks: 2
  files_modified: 3
  commits:
    - "6af6e12: feat(03-04): update Layout.astro to use Astro.currentLocale"
    - "74b73ee: feat(03-04): wire LanguageSwitcher with routeMap and create EN homepage stub"
---

# Phase 3 Plan 04: i18n Integration (Layout + LanguageSwitcher) Summary

**One-liner:** Wired Astro.currentLocale into html lang attribute and replaced disabled-button LanguageSwitcher with functional `<a>` links via routeMap.getLocalePath, plus created `/en/` route stub.

## What Was Built

### Task 1 — Layout.astro lang attribute (commit 6af6e12)

Updated `src/layouts/Layout.astro` to derive the `<html lang>` attribute from `Astro.currentLocale` (provided by the i18n config added in Plan 03-01) rather than the static `I18N.language` value from `astrowind:config`.

Changes:
- Removed `import { I18N } from 'astrowind:config'`
- Replaced `const { language, textDirection } = I18N` with `const currentLocale = Astro.currentLocale ?? 'de'` and `const textDirection = 'ltr'`
- Changed `<html lang={language}>` to `<html lang={currentLocale}>`

Result: DE pages at `/` emit `lang="de"`; EN pages at `/en/*` emit `lang="en"`. Astro runtime sets `currentLocale` based on the URL prefix per the i18n config.

### Task 2 — LanguageSwitcher.astro wiring + EN homepage stub (commit 74b73ee)

Rewrote `src/components/widgets/LanguageSwitcher.astro` to be fully functional:
- Imports `getLocalePath` from `~/i18n/routeMap`
- Reads `Astro.url.pathname` to determine the current page
- Resolves DE and EN target paths via `getLocalePath`; falls back to `/` and `/en/` if the path is not in the routeMap
- Renders `<a href>` links (not disabled `<button>` elements) with `aria-current="page"` on the active locale and `hreflang` attributes for search engines
- Active locale is visually distinguished: `font-semibold underline underline-offset-2`

Created `src/pages/en/index.astro` as a minimal placeholder so the `/en/` route exists and the language switcher has a valid EN target. Full EN homepage content is deferred to Phase 4 (HOME-01).

## Verification Results

- `pnpm check:astro`: 0 errors, 0 warnings, 0 hints (102 files checked)
- `pnpm build`: 20 pages built successfully; `[parity]` check ran and passed
- All acceptance criteria met:
  - No `I18N` import in Layout.astro
  - `Astro.currentLocale ?? 'de'` present in Layout.astro
  - `lang={currentLocale}` on `<html>` element
  - `getLocalePath` imported in LanguageSwitcher
  - No `disabled` attributes in LanguageSwitcher
  - No hardcoded `currentLang` in LanguageSwitcher
  - `aria-current`, `hreflang` attributes present
  - `src/pages/en/index.astro` exists with Layout import

## Deviations from Plan

None — plan executed exactly as written. The lockfile was updated (pnpm install required) because `tsx` was added by Wave 1 (plan 03-03) and the worktree had no node_modules; this is expected for a fresh parallel worktree and not a deviation.

## Known Stubs

| File | Stub | Reason |
|------|------|--------|
| src/pages/en/index.astro | "English content coming soon." placeholder body | Intentional Phase 3 stub — full EN homepage is Phase 4 (HOME-01). The stub satisfies the /en/ route requirement for this plan. |

## Threat Flags

None — all surfaces covered by plan's threat model (T-03-04-01, T-03-04-02, T-03-04-03 all mitigated or accepted as designed).

## Self-Check: PASSED

Files verified:
- FOUND: src/layouts/Layout.astro (contains `Astro.currentLocale ?? 'de'`, `lang={currentLocale}`)
- FOUND: src/components/widgets/LanguageSwitcher.astro (contains `getLocalePath`, `aria-current`, `hreflang`)
- FOUND: src/pages/en/index.astro

Commits verified:
- FOUND: 6af6e12 feat(03-04): update Layout.astro to use Astro.currentLocale for html lang attribute
- FOUND: 74b73ee feat(03-04): wire LanguageSwitcher with routeMap and create EN homepage stub
