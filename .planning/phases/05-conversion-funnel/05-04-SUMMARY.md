---
phase: 05-conversion-funnel
plan: "04"
subsystem: navigation
tags: [navigation, routing, phase5-gate, human-verify]
dependency_graph:
  requires: [05-02, 05-03]
  provides: [nav-pricing-wired, phase5-complete]
  affects: [src/navigation.ts]
tech_stack:
  added: []
  patterns: [bilingual-nav-hrefs, static-route-wiring]
key_files:
  created: []
  modified:
    - src/navigation.ts
decisions:
  - "Förderung not added to top-level nav — surfaced via pricing page and homepage CTA per plan spec"
  - "Only Preise/Pricing hrefs updated; all Phase 6 entries (Case Studies, About, Contact, Careers) remain '#'"
metrics:
  duration: "~8 min"
  completed: "2026-04-23"
  tasks_completed: 2
  files_modified: 1
---

# Phase 5 Plan 04: Navigation Wiring + Phase 5 Verification Gate Summary

**One-liner:** Wired navigation.ts Preise/Pricing hrefs from placeholder '#' to real Phase 5 routes (/preise, /en/pricing); build confirmed green with all 8 Phase 5 pages in dist/.

## What Was Built

### Task 1: Update navigation.ts — wire Phase 5 real hrefs (PRICE-01, FUND-01)

Updated `src/navigation.ts` with the two Phase 5 pricing route changes:

- `headerDataDe.links`: `{ text: 'Preise', href: '#' }` → `{ text: 'Preise', href: '/preise' }`
- `headerDataEn.links`: `{ text: 'Pricing', href: '#' }` → `{ text: 'Pricing', href: '/en/pricing' }`

Förderung/Funding was confirmed absent from top-level nav (per plan spec — it is surfaced via the pricing page and homepage CTA, not the main nav).

`pnpm build` exited 0 with 52 pages built. All 8 Phase 5 pages confirmed in dist/:
- dist/preise/index.html
- dist/en/pricing/index.html
- dist/roi/index.html
- dist/en/roi/index.html
- dist/foerderung/index.html
- dist/en/funding/index.html
- dist/danke/index.html
- dist/en/thanks/index.html

### Task 2: Human verification of all 20 Phase 5 requirements + live Formspree gate

**Status: AUTO-APPROVED (--auto mode)**

This checkpoint was auto-approved for workflow continuity. The following verification items remain pending human testing via `/gsd-verify-work`:

**PRICE-01, PRICE-02:** /preise and /en/pricing render three tier cards with "auf Anfrage" / "on request" prices
**PRICE-03:** Tier data sourced from src/data/pricing.ts (not hardcoded)
**PRICE-04:** ConsultForm visible and hydrated on both pricing pages
**ROI-01 to ROI-05:** RoiCalculator on /roi and /en/roi with live inputs, number formatting, pre-fill cross-component contract
**FUND-01 to FUND-04:** /foerderung and /en/funding with BG-Katalog citation, content sections, cross-link to ROI calculator
**FUND-03:** FundingQualifierForm with all 7 fields visible
**FORMS-03, FORMS-07:** Inline validation, value preservation across field errors
**FORMS-04:** _gotcha honeypot, Turnstile widget, submit block without Turnstile
**FORMS-05:** DSGVO checkbox unchecked by default, privacy link opens correct locale page
**FORMS-06 (ROADMAP GATE):** End-to-end form submission → /danke or /en/thanks redirect → Formspree dashboard entry confirmed

**Note:** The ROADMAP Phase 5 gate ("at least one lead captured end-to-end through Formspree") requires a human tester to complete a real form submission. This has NOT been automated — it requires manual verification.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | 3873fec | feat(05-04): wire Phase 5 nav hrefs — /preise and /en/pricing |
| Task 2 | — | Auto-approved checkpoint (no code changes) |

## Deviations from Plan

### Worktree State Recovery

**Found during:** Pre-execution setup

**Issue:** Worktree was based on stale commit 488ce48 after orchestrator `git reset --soft 371bf15`. Working tree had old Phase 2 navigation.ts (empty links), missing Phase 4+5 page files, and missing scripts/ directory.

**Fix:** Ran `git checkout HEAD -- src/ astro.config.ts package.json pnpm-lock.yaml public/ scripts/` to restore working tree to HEAD (371bf15) state before making changes. Also ran `pnpm install --frozen-lockfile` to restore node_modules (tsx missing).

**Files modified:** None (restore operation, not a code change)

**Rule:** Rule 3 (Auto-fix blocking issues)

## Known Stubs

None in files modified by this plan. Phase 6 nav entries (Fallstudien, Über uns, Kontakt) remain `href: '#'` — intentional, to be wired in Phase 6.

## Threat Flags

None. Navigation href changes are hardcoded internal route strings with no user input or XSS vectors.

## Self-Check: PASSED

- src/navigation.ts: `/preise` present — FOUND
- src/navigation.ts: `/en/pricing` present — FOUND
- Commit 3873fec: FOUND
- dist/preise/index.html: FOUND
- dist/en/pricing/index.html: FOUND
- dist/roi/index.html: FOUND
- dist/en/roi/index.html: FOUND
- dist/foerderung/index.html: FOUND
- dist/en/funding/index.html: FOUND
- dist/danke/index.html: FOUND
- dist/en/thanks/index.html: FOUND
