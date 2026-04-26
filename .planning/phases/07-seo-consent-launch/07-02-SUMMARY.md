---
phase: 07-seo-consent-launch
plan: "02"
subsystem: consent-analytics
tags: [cookie-consent, vanilla-cookieconsent, rybbit, analytics, dsgvo, gdpr]
dependency_graph:
  requires: []
  provides:
    - vanilla-cookieconsent v3 DSGVO consent banner (DE+EN)
    - Rybbit cookieless analytics script
    - CookieConsent.astro component
    - Analytics.astro with Rybbit snippet
  affects:
    - src/layouts/Layout.astro
    - src/components/widgets/Footer.astro
tech_stack:
  added:
    - vanilla-cookieconsent@3.1.0
  patterns:
    - Astro <script> bundled module for CookieConsent (not is:inline)
    - is:inline for third-party Rybbit script src
    - astro:after-swap listener for View Transitions re-initialization
    - data-cc="show-preferencesModal" declarative API (no JS needed on button)
key_files:
  created:
    - src/components/common/CookieConsent.astro
  modified:
    - src/components/common/Analytics.astro
    - src/layouts/Layout.astro
    - src/components/widgets/Footer.astro
    - package.json
    - pnpm-lock.yaml
decisions:
  - vanilla-cookieconsent v3 uses namespace import (import * as CookieConsent) matching the export = CookieConsent type definition pattern
  - Rybbit script uses is:inline because it is a third-party src attribute (not a module to bundle)
  - CookieConsent.astro uses Astro bundled <script> (no is:inline) so Astro processes the ES module import for vanilla-cookieconsent
  - astro:after-swap listener added to restore consent state after View Transition navigation
metrics:
  duration_minutes: 3
  completed_date: "2026-04-26"
  tasks_completed: 2
  tasks_total: 2
  files_created: 1
  files_modified: 5
---

# Phase 07 Plan 02: Cookie Consent & Analytics Summary

## One-liner

vanilla-cookieconsent v3 with DSGVO DE+EN translations (necessary + functional categories), Rybbit cookieless analytics script wired unconditionally, both rendered in Layout.astro head with View Transitions support.

## What Was Built

### Task 1: Install vanilla-cookieconsent and create CookieConsent.astro (commit: 9bef606)

- Installed `vanilla-cookieconsent@3.1.0` via pnpm
- Created `src/components/common/CookieConsent.astro` with:
  - Two categories: `necessary` (readOnly, Cloudflare Turnstile) and `functional` (Google Maps)
  - Full DE+EN translations for consentModal and preferencesModal
  - `autoDetect: 'document'` reads `<html lang>` attribute to serve correct language
  - `astro:after-swap` event listener ensures banner persists after View Transition navigation
  - Rybbit explicitly excluded from banner per CONTEXT.md D-05
- Added `Cookie-Einstellungen` button to `src/components/widgets/Footer.astro` with `data-cc="show-preferencesModal"` declarative attribute

### Task 2: Wire Rybbit analytics into Analytics.astro and update Layout.astro (commit: b375baa)

- Replaced `Analytics.astro` placeholder with Rybbit async script tag using `is:inline`
- Placeholders `RYBBIT_DOMAIN` and `RYBBIT_SITE_ID` must be replaced before DNS cutover
- Updated `Layout.astro` to import and render `<CookieConsent />` after `<Analytics />` and before `<ClientRouter />`
- Build verified: 97 pages built successfully in 8.18s
- `dist/index.html` and `dist/en/index.html` both contain Rybbit script tag and CookieConsent bundle reference

## Verification Results

- Build: 97 pages built, no errors
- `dist/index.html` contains `RYBBIT_DOMAIN` script tag: FOUND
- `dist/en/index.html` contains `RYBBIT_DOMAIN` script tag: FOUND
- `dist/index.html` contains `show-preferencesModal`: FOUND
- `dist/index.html` contains `Cookie-Einstellungen`: FOUND
- CookieConsent bundle: `dist/_astro/CookieConsent.astro_astro_type_script_index_0_lang.C74W2np2.js`
- `pnpm check`: Only pre-existing errors (245 errors unrelated to this plan); no new errors from CookieConsent.astro or Footer.astro

## Decisions Made

1. **Namespace import pattern**: `import * as CookieConsent` matches the `export = CookieConsent` type definition. TypeScript warning (ts(80003)) is benign — the namespace import is correct for this CJS-style type export.
2. **Rybbit uses `is:inline`**: Third-party script loaded via `src` attribute — Astro must pass through verbatim rather than bundling.
3. **CookieConsent uses bundled `<script>`**: Astro processes the ES module import for `vanilla-cookieconsent`, enabling proper tree-shaking and bundling.
4. **`astro:after-swap` listener**: vanilla-cookieconsent v3 is idempotent on re-run — calling `run()` after swap restores state from `cc_cookie`. Critical for View Transitions compatibility.

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| `RYBBIT_DOMAIN` placeholder | `src/components/common/Analytics.astro` | Self-hosted Rybbit instance not yet provisioned; must be replaced before DNS cutover (see user_setup in plan frontmatter) |
| `RYBBIT_SITE_ID` placeholder | `src/components/common/Analytics.astro` | Same as above — site ID assigned by Rybbit after provisioning |

These stubs are intentional pre-launch placeholders documented in the plan's `user_setup` section. They do not prevent the plan's goal (DSGVO consent banner) from being achieved.

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

- `src/components/common/CookieConsent.astro`: EXISTS
- `src/components/common/Analytics.astro`: EXISTS (modified)
- `src/layouts/Layout.astro`: EXISTS (modified)
- `src/components/widgets/Footer.astro`: EXISTS (modified)
- Commit `9bef606`: EXISTS
- Commit `b375baa`: EXISTS
