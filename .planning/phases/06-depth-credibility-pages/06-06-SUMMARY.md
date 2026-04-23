---
phase: 06-depth-credibility-pages
plan: "06"
subsystem: navigation-i18n-routing
tags: [navigation, i18n, routing, language-switcher, translations]
dependency_graph:
  requires:
    - src/navigation.ts (base structure from Phase 4)
    - src/i18n/routeMap.ts (created in Phase 3, extended here)
    - src/i18n/translations.ts (created in Phase 3, extended here)
  provides:
    - src/navigation.ts (Phase 6 real URLs wired)
    - src/i18n/routeMap.ts (team + case-study detail + blog tag route pairs)
    - src/i18n/translations.ts (Phase 6 UI strings in DE + EN)
  affects:
    - LanguageSwitcher.astro (route lookup for /fallstudien/ ↔ /en/case-studies/, /team/ ↔ /en/team/)
    - Header.astro (nav links now resolve to real pages)
    - sitemap (nav links discoverable by crawlers)
tech_stack:
  added: []
  patterns:
    - "Flat dot-notation translation keys per D-14 — t('key', locale) helper"
    - "Bidirectional routeMap keyed by canonical route key — getLocalePath() for language switcher"
    - "Separate headerDataDe / headerDataEn exports with legacy headerData = headerDataDe for compat"
    - "Dropdown nav entries use href: '#' as parent with links: [] children"
decisions:
  - "Über uns / About expanded to dropdown with Team + Karriere/Careers sub-items — Kontakt remains a top-level link"
  - "Footer RSS link updated to /aktuelles/rss.xml to match the blog route created in Plan 06-02"
  - "routeMap and translations.ts recreated in full (they were deleted in f66db77 during 06-02 cleanup) carrying forward all Phase 3-5 content plus Phase 6 additions"
  - "Untracked src/pages/[...blog]/ and src/pages/rss.xml.ts from original worktree state left unstaged — they are pre-existing AstroWind artifacts handled by Wave 1 plans"
key_files:
  created:
    - src/i18n/routeMap.ts
    - src/i18n/translations.ts
  modified:
    - src/navigation.ts
metrics:
  duration: "~15 min"
  completed_date: "2026-04-23"
  tasks: 1
  files: 3
---

# Phase 06 Plan 06: Navigation + i18n Routing Wire-up Summary

**One-liner:** Wire all Phase 6 pages into navigation (real URLs replacing # placeholders), recreate routeMap.ts with team + case-study detail pairs, and recreate translations.ts with complete Phase 3-6 UI strings.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Update navigation.ts, routeMap.ts, translations.ts for Phase 6 | efe6301 | src/navigation.ts, src/i18n/routeMap.ts, src/i18n/translations.ts |

## What Was Built

### navigation.ts

Updated `headerDataDe` and `headerDataEn` with real Phase 6 URLs replacing `#` placeholders:

**DE nav changes:**
- `{ text: 'Fallstudien', href: '#' }` → `href: '/fallstudien/'`
- `{ text: 'Über uns', href: '#' }` → dropdown with Team (`/team/`) + Karriere (`/karriere/`)
- `{ text: 'Kontakt', href: '#' }` → `href: '/kontakt/'`

**EN nav changes:**
- `{ text: 'Case Studies', href: '#' }` → `href: '/en/case-studies/'`
- `{ text: 'About', href: '#' }` → dropdown with Team (`/en/team/`) + Careers (`/en/careers/`)
- `{ text: 'Contact', href: '#' }` → `href: '/en/contact/'`

**Footer updates:**
- RSS href: `getAsset('/rss.xml')` → `getAsset('/aktuelles/rss.xml')`
- Added `{ text: 'Aktuelles', href: '/aktuelles/' }` to secondaryLinks
- LinkedIn href now set to live LinkedIn URL

Phase 4+5 changes already integrated: Produkt, all Anwendungen/Use Cases, all Branchen/Industries, Preise/Pricing hrefs carried forward.

### src/i18n/routeMap.ts

Recreated from scratch (file was deleted in commit f66db77 during 06-02 cleanup). Contains:
- All Phase 3 top-level route pairs (home, contact, product, pricing, roi, funding, careers, news, case-studies, thanks)
- All use-case route pairs (7 use cases)
- All industry vertical route pairs (4 verticals)
- **Phase 6 additions:**
  - `team: { de: '/team', en: '/en/team' }`
  - `'case-studies/schumacher': { de: '/fallstudien/schumacher', en: '/en/case-studies/schumacher' }`
  - `'case-studies/jjx': { de: '/fallstudien/jjx', en: '/en/case-studies/jjx' }`
  - `'case-studies/greilmeier': { de: '/fallstudien/greilmeier', en: '/en/case-studies/greilmeier' }`
  - `'news/tag': { de: '/aktuelles/tag', en: '/en/news/tag' }`

### src/i18n/translations.ts

Recreated from scratch (file was deleted in commit f66db77 during 06-02 cleanup). Contains all Phase 3-5 UI strings plus **Phase 6 additions**:

| Key prefix | DE strings | EN strings |
|-----------|-----------|-----------|
| `case_studies.*` | 5 keys | 5 keys |
| `blog.*` | 4 keys | 4 keys |
| `team.*` | 2 keys | 2 keys |
| `careers.*` | 5 keys | 5 keys |
| `contact.*` | 6 keys | 6 keys |
| `nav.team` | 1 key | 1 key |

## Deviations from Plan

### Auto-fixed — Missing Base State

**Context:** This worktree (Wave 2) was based on commit `9bf9109` which did NOT contain `src/i18n/routeMap.ts` or `src/i18n/translations.ts`. These files existed in the Phase 3 commit tree but were deleted in commit `f66db77` (feat 06-02 cleanup, -21,548 lines).

**Action:** Files were recreated in full carrying all Phase 3-5 content (sourced from the Wave 1 worktree `agent-a44e1056` which had the last known-good state) plus Phase 6 additions as specified in the plan.

**Impact:** No user-facing behavior change — content is identical to the last committed state of these files before deletion.

**Similarly**, `navigation.ts` in this worktree had only the Phase 1 stub (empty `headerData.links`). The full Phase 4+5 bilingual nav structure was integrated before applying Phase 6 additions, sourced from commits `fb90df4` and `3873fec`.

## Known Stubs

- Footer `Impressum` and `Datenschutz` links remain `href: '#'` — real URLs deferred to Phase 7 (legal pages)
- CTA actions `href: '#consult'` in both DE/EN nav — consult form anchor wired in Phase 5, kept as-is

## Threat Model Mitigations Applied

All nav href values are static strings in version-controlled TypeScript. No user input flows into navigation hrefs. T-06-06-01 (Tampering) accepted per plan.

## Self-Check

- [x] `src/navigation.ts` — FOUND, contains `/fallstudien/`, `/kontakt/`, `/en/case-studies/`, `/en/contact/`
- [x] `src/i18n/routeMap.ts` — FOUND, contains `team:`, `case-studies/schumacher`, `news/tag`
- [x] `src/i18n/translations.ts` — FOUND, contains all Phase 6 key prefixes
- [x] Commit efe6301 — FOUND

## Self-Check: PASSED
