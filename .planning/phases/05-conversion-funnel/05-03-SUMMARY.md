---
phase: 05-conversion-funnel
plan: "03"
subsystem: forms
tags: [preact, formspree, turnstile, zod, funding, de-minimis, i18n]
dependency_graph:
  requires:
    - 05-01  # translations.ts funding.* keys, routeMap.ts funding/roi routes, canonical.yaml funding section
    - 05-02  # ConsultForm pattern reference for island architecture
  provides:
    - FundingQualifierForm Preact island (FORMS-02, FUND-03)
    - DE funding page /foerderung/ (FUND-01, FUND-02, FUND-04)
    - EN funding page /en/funding/ (FUND-01, FUND-02, FUND-04)
  affects:
    - 05-04  # thank-you pages must exist for FORMS-06 redirect targets
tech_stack:
  added: []
  patterns:
    - Preact island with client:visible hydration (same pattern as ConsultForm, RoiCalculator)
    - Zod schema validation with safeParse + inline field errors + formData preservation
    - Cloudflare Turnstile explicit render API with unique container ID (turnstile-funding)
    - Formspree fetch POST with Accept: application/json (RESEARCH.md Pitfall 1 guard)
    - Locale-aware redirect via prop not pathname detection (RESEARCH.md Pitfall 7 guard)
    - canonical.yaml funding section injected at build time for catalog citation
key_files:
  created:
    - src/components/islands/FundingQualifierForm.tsx
    - src/pages/foerderung.astro
    - src/pages/en/funding.astro
  modified:
    - astro.config.ts  # Rule 3 deviation: added yamlPlugin + preact integration to match main repo
decisions:
  - "turnstile-funding container ID chosen (not turnstile-consult) to allow both forms to coexist on same page without DOM collision"
  - "PUBLIC_FORMSPREE_FUNDING_ID separate from PUBLIC_FORMSPREE_CONSULT_ID per RESEARCH.md recommendation for distinct Formspree routing"
  - "locale prop used for redirect (not window.location.pathname) to avoid Pitfall 7 false detection"
  - "worktree astro.config.ts updated to match main repo (yamlPlugin + preact integration) as Rule 3 auto-fix"
metrics:
  duration: "~15 min (includes worktree restoration and config fix)"
  completed: "2026-04-23"
  tasks_completed: 2
  files_created: 3
  files_modified: 1
---

# Phase 05 Plan 03: FundingQualifierForm + Funding Pages Summary

FundingQualifierForm Preact island with 7-field Zod-validated form (companyName, companySize, fleetSize, vertical, contactName, email, phone) plus DE/EN funding pages citing BG catalog section 1.10 from canonical.yaml.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build FundingQualifierForm Preact island | fca3a88 | src/components/islands/FundingQualifierForm.tsx |
| 2 | Build DE + EN funding pages | 82bca65 | src/pages/foerderung.astro, src/pages/en/funding.astro |

## Must-Have Verification

- [x] FundingQualifierForm.tsx has all D-14 fields: companyName, companySize (4 options), fleetSize, vertical, contactName, email, phone (optional)
- [x] Zod validates required/enum/email/min fields; values preserved on validation failure (single formData state)
- [x] `_gotcha` honeypot hidden field present; container ID `turnstile-funding` distinct from ConsultForm
- [x] DSGVO consent checkbox required, unchecked by default, links to /datenschutz or /en/privacy/
- [x] Formspree POST includes `Accept: application/json` header (RESEARCH.md Pitfall 1)
- [x] Redirect uses `locale` prop: `/danke` (DE), `/en/thanks/` (EN) (RESEARCH.md Pitfall 7)
- [x] foerderung.astro and en/funding.astro cite `brand.funding.de_catalog_section` (1.10) and `brand.funding.de_catalog_ref` from canonical.yaml
- [x] Cross-link to `/roi` in foerderung.astro and `/en/roi` in en/funding.astro (FUND-04)
- [x] Both pages embed `<FundingQualifierForm locale={locale} client:visible />`
- [x] Turnstile `?render=explicit` script tag on both pages
- [x] `pnpm build` exits 0; 52 pages built (50 original + foerderung + en/funding)
- [x] dist/foerderung/index.html and dist/en/funding/index.html exist

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Worktree astro.config.ts missing yamlPlugin, preact integration, i18n config**
- **Found during:** Task 1 verification (pnpm build)
- **Issue:** Worktree was based on pre-Phase-05 base commit missing the vite YAML plugin (needed for `import brand from '~/data/brand/canonical.yaml'`), `@astrojs/preact` integration, and i18n routing config. Build failed with "Expected ';', '}' or <eof>" on YAML import.
- **Fix:** Updated astro.config.ts to match main repo: added `import yaml from 'js-yaml'`, `import fs from 'fs'`, `yamlPlugin`, `preact({ compat: false })` integration, and `i18n` config block.
- **Files modified:** astro.config.ts
- **Commit:** d5a4dbe

**2. [Rule 3 - Blocking] Worktree working directory missing src/, public/, scripts/ from HEAD**
- **Found during:** Initial setup after git reset --soft
- **Issue:** `git reset --soft` moved HEAD to bc75a33d but left working tree at older state (488ce48). All Phase 04/05 files (translations.ts, ConsultForm.tsx, pricing.ts, routeMap.ts, public assets, scripts/) were missing from the working directory.
- **Fix:** `git checkout HEAD -- src/ public/ scripts/` restored all missing files. Also restored package.json and pnpm-lock.yaml which were missing `@astrojs/preact`, `preact`, `zod`, `tsx`.
- **Files modified:** Working tree restoration (not new commits — prerequisite for plan execution)
- **Commit:** N/A (prerequisite fix before task execution)

## Known Stubs

| Stub | File | Line | Reason |
|------|------|------|--------|
| `'REPLACE_WITH_FORMSPREE_FUNDING_ID'` | src/components/islands/FundingQualifierForm.tsx | 26 | Formspree form ID placeholder — requires `PUBLIC_FORMSPREE_FUNDING_ID` env var set in Netlify before form submissions work. Intentional: form renders and validates correctly; only submission is blocked until wired up. |

## Threat Surface Scan

No new threat surface beyond what is documented in the plan's threat_model. All trust boundaries (Browser → Formspree API, Browser → Cloudflare Turnstile CDN, canonical.yaml → HTML) were pre-identified. No unexpected new network endpoints or auth paths introduced.

## Self-Check: PASSED

| Check | Result |
|-------|--------|
| src/components/islands/FundingQualifierForm.tsx | FOUND |
| src/pages/foerderung.astro | FOUND |
| src/pages/en/funding.astro | FOUND |
| dist/foerderung/index.html | FOUND |
| dist/en/funding/index.html | FOUND |
| commit fca3a88 (Task 1) | FOUND |
| commit 82bca65 (Task 2) | FOUND |
