---
phase: 07-seo-consent-launch
plan: 04
subsystem: deployment
tags: [netlify, csp, headers, redirects, security]
dependency_graph:
  requires: []
  provides: [netlify-deploy-config, csp-headers, jimdo-redirects]
  affects: [all-routes]
tech_stack:
  added: []
  patterns: [netlify-headers, netlify-redirects, content-security-policy]
key_files:
  created:
    - public/_redirects
  modified:
    - netlify.toml
    - public/_headers
decisions:
  - NODE_VERSION=24 set in [build.environment] — matches Astro 6 Node floor; deploy-preview context exposes CONTEXT env var for Layout.astro noindex gate
  - unsafe-inline in script-src and style-src — required for Astro inline scripts and vanilla-cookieconsent; no unsafe-eval added
  - RYBBIT_DOMAIN placeholder in CSP — user must replace with actual self-hosted domain before DNS cutover
  - Catch-all redirect commented out — preserves legitimate 404s and avoids masking broken links post-launch
metrics:
  duration: 2min
  completed: "2026-04-26"
  tasks_completed: 2
  files_modified: 3
---

# Phase 07 Plan 04: Netlify Deploy Config, CSP Headers, and Jimdo Redirects Summary

netlify.toml hardened with NODE_VERSION=24 and deploy-preview context; public/_headers ships full CSP with Web3Forms, Turnstile, Google Maps, and Rybbit placeholder; public/_redirects maps all known Jimdo DE/EN paths to Konvoi equivalents with 301.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Update netlify.toml with NODE_VERSION and deploy-preview config | 2f88a80 | netlify.toml |
| 2 | Write public/_headers (CSP) and public/_redirects (Jimdo 301s) | 2521029 | public/_headers, public/_redirects |

## Decisions Made

1. **NODE_VERSION = "24" in [build.environment]**: Pins the Netlify build to Node 24, matching the Astro 6 minimum and the local dev environment. Deploy-preview context sets CONTEXT=deploy-preview so Layout.astro's isNonProduction check correctly emits noindex on preview builds.

2. **'unsafe-inline' in script-src and style-src**: Required for Astro's inline ApplyColorMode/BasicScripts and for vanilla-cookieconsent v3 which injects inline styles. No 'unsafe-eval' added. For a static marketing site this is the accepted trade-off per plan threat model T-07-04-04.

3. **RYBBIT_DOMAIN placeholder in CSP**: Rybbit is self-hosted but domain unknown at plan time. Placeholder appears in both script-src and connect-src. Must be replaced with actual domain before DNS cutover.

4. **Catch-all redirect commented out**: A /* → / 302 catch-all would swallow legitimate 404s and mask broken links. Specific 301 rules cover all known Jimdo paths; Netlify serves its own 404 for unmapped URLs.

## Verification Results

- `dist/_headers` contains `Content-Security-Policy` with `api.web3forms.com`, `challenges.cloudflare.com`, `maps.googleapis.com`, `www.google.com`, `RYBBIT_DOMAIN`
- `dist/_headers` contains `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`
- No `formspree`, `plausible`, or `pirsch` entries in `dist/_headers`
- `dist/_redirects` exists and contains `/die-loesung -> /produkt/ 301` and EN variants
- `pnpm build` exits with code 0 (97 pages built)
- `netlify.toml` contains `NODE_VERSION = "24"` and `[context.deploy-preview.environment]`

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

- `https://RYBBIT_DOMAIN` in `public/_headers` (lines 8 and 13 of CSP): placeholder domain for self-hosted Rybbit analytics. Must be replaced with actual domain before DNS cutover. This is intentional and documented in the file header comment.

## Threat Flags

No new security surface introduced beyond what the threat model documents. The _headers file implements all T-07-04-01 through T-07-04-06 mitigations. T-07-04-07 (redirect loop risk) is accepted — catch-all is commented out.

## Self-Check: PASSED

- netlify.toml: FOUND
- public/_headers: FOUND
- public/_redirects: FOUND
- dist/_headers: FOUND (verified post-build)
- dist/_redirects: FOUND (verified post-build)
- Commit 2f88a80: FOUND
- Commit 2521029: FOUND
