---
phase: 01-foundation-scrub
plan: "03"
subsystem: ci
tags: [github-actions, netlify, pnpm, ci, noindex, security]
dependency_graph:
  requires:
    - 01-01
    - 01-02
  provides:
    - pnpm-ci-pipeline
    - grep-gate-enforcement
    - netlify-noindex-meta
    - branch-deploy-block
  affects:
    - .github/workflows/actions.yaml
    - netlify.toml
    - src/layouts/Layout.astro
tech_stack:
  added:
    - pnpm/action-setup@v4 (GitHub Actions pnpm setup)
  patterns:
    - "Post-build grep gate in CI to permanently enforce no-AstroWind-debris constraint"
    - "Netlify CONTEXT env var to conditionally emit noindex meta at build time"
    - "netlify.toml context.branch-deploy override to block branch deploys"
key_files:
  created: []
  modified:
    - .github/workflows/actions.yaml
    - netlify.toml
    - src/layouts/Layout.astro
    - src/pages/[...blog]/[...page].astro
decisions:
  - "Single CI job replaces two-job matrix — simpler, saves runner minutes, matches Node 22+ project requirement"
  - "Grep gate uses case-insensitive -i flag on *.html/*.js/*.css only — avoids false positives from vendor/integration astrowind:config virtual module"
  - "noindex meta uses import.meta.env.CONTEXT ?? process.env.CONTEXT fallback — handles both Vite SSG and Node environments"
  - "netlify.toml branch-deploy override uses echo no-op — prevents branch deploy output without requiring Netlify UI team-plan features"
metrics:
  duration: "2 minutes (auto tasks only; checkpoint pending)"
  completed_date: "2026-04-22"
  tasks_completed: 2
  files_changed: 4
---

# Phase 1 Plan 03: Foundation Scrub — CI Pipeline & Netlify Config Summary

**One-liner:** GitHub Actions CI rewritten to pnpm with post-build grep gate enforcing no-AstroWind-debris, Layout.astro patched with Netlify-context noindex meta, netlify.toml switched to pnpm with branch-deploy block.

## What Was Done

### Task 1: Rewrite GitHub Actions workflow with pnpm and grep gate

Replaced the entire `.github/workflows/actions.yaml` file:

- **Removed:** `npm ci`, `cache: npm`, three-version node matrix (18/20/22), two separate jobs (`build` + `check`)
- **Added:** `pnpm/action-setup@v4` with `version: 10`, `cache: pnpm`, `pnpm install --frozen-lockfile`, single `build-and-check` job on Node 22
- **Grep gate:** Post-build step using `grep -riq "astrowind\|arthelokyo\|onwidget\|Unsplash\|Cupertino"` against `dist/*.html`, `dist/*.js`, `dist/*.css` — `exit 1` on any match, enforcing permanent AstroWind debris prevention on every PR

### Task 2: Add noindex meta to Layout.astro and update netlify.toml

**Layout.astro (FND-09):**
- Added Netlify context detection: `const netlifyContext = import.meta.env.CONTEXT ?? process.env.CONTEXT ?? 'production'`
- Added: `const isNonProduction = netlifyContext === 'deploy-preview' || netlifyContext === 'branch-deploy'`
- Added conditional noindex meta: `{isNonProduction && <meta name="robots" content="noindex, nofollow" />}` after `<Analytics />`
- `<ApplyColorMode />` not touched (fragile PR #646 flicker-fix preserved)
- Local dev unaffected: `process.env.CONTEXT` is undefined locally, defaults to `'production'`

**netlify.toml (FND-10):**
- `npm run build` replaced with `pnpm run build`
- Added `[context.branch-deploy]` block with no-op echo to prevent branch deploy output
- `[build.processing.html]`, `[[headers]]` Cache-Control blocks preserved unchanged

### Pre-checkpoint automated verification

- `pnpm run build` exits 0 — 2 pages built (404.html, blog/index.html)
- Grep gate on `dist/` exits 1 (no matches) — PASSED
- 404 page built at `dist/404.html` (Astro flat-file output, not `dist/404/index.html`)

## Commits

| Task | Hash | Message |
|------|------|---------|
| Task 1 | 479a3bc | feat(01-03): rewrite CI workflow to pnpm with grep gate |
| Task 2 | c0763a5 | feat(01-03): add noindex meta to Layout.astro and update netlify.toml for pnpm |
| Rule 1 fix | 44d2f8c | fix(01-03): replace AstroWind blog subtitle with Konvoi copy |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] AstroWind string in blog index caused grep gate failure**
- **Found during:** Pre-checkpoint automated verification
- **Issue:** `dist/blog/index.html` contained "related to AstroWind" — the blog index page (`src/pages/[...blog]/[...page].astro`) had a hardcoded AstroWind subtitle that was not in the demo-deletion scope of Plan 01
- **Fix:** Replaced subtitle with Konvoi-appropriate German copy: "Neuigkeiten, Einblicke und Ressourcen rund um Konvoi und Transportsicherheit"
- **Files modified:** `src/pages/[...blog]/[...page].astro`
- **Commit:** 44d2f8c

**2. [Plan clarification] dist/404/index.html path in verification spec**
- **Found during:** Pre-checkpoint verification
- **Issue:** Plan's verification step referenced `dist/404/index.html` but Astro builds the 404 page as `dist/404.html` (flat file)
- **Fix:** Verified `dist/404.html` exists — this is correct Astro behavior, not a bug. No code change needed.

## Known Stubs

None introduced by this plan. Task 3 (checkpoint) is pending human verification of the build preview and Netlify UI branch deploy policy configuration.

## Threat Surface

All three threat mitigations from the plan's threat register implemented:

| Threat ID | Mitigation | Status |
|-----------|-----------|--------|
| T-03-01: AstroWind debris in dist/ | Post-build grep gate in CI | Implemented + verified |
| T-03-02: Netlify Deploy Preview indexing | noindex meta on non-production CONTEXT | Implemented |
| T-03-03: Branch deploy public exposure | netlify.toml context.branch-deploy no-op + Netlify UI step | toml done; UI step at checkpoint |
| T-03-04: CI workflow permissions | Accepted as low risk | Accepted |

## Checkpoint Status

Task 3 is a `checkpoint:human-verify` — awaiting human verification of:
1. `pnpm run preview` at http://localhost:4321/ — 404 page with Konvoi branding, no AstroWind content
2. Netlify UI: Set Branch deploys to "None" (Site configuration > Build and deploy > Branches and deploy contexts)

## Self-Check

- `.github/workflows/actions.yaml` — contains `pnpm install --frozen-lockfile`, `pnpm/action-setup@v4`, `grep -riq`, `exit 1`; no `npm ci`, no `strategy: matrix`
- `netlify.toml` — contains `pnpm run build`, `[context.branch-deploy]`, `Branch deploy disabled`, `Cache-Control`
- `src/layouts/Layout.astro` — contains `netlifyContext`, `isNonProduction`, noindex meta, `<ApplyColorMode />` preserved
- `src/pages/[...blog]/[...page].astro` — no AstroWind strings
- `dist/` grep gate — exits 1 (no debris)
- Commits 479a3bc, c0763a5, 44d2f8c exist in git log

## Self-Check: PASSED
