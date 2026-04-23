---
phase: 03-i18n-content-collections
verified: 2026-04-23T14:30:00Z
status: human_needed
score: 4/4 roadmap success criteria verified
overrides_applied: 0
re_verification:
  previous_status: passed
  previous_score: 23/23
  gaps_closed: []
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Start dev server (pnpm dev), visit http://localhost:4321/, view page source"
    expected: "<html lang='de' in the source"
    why_human: "Requires running dev server to confirm Astro.currentLocale resolves correctly at runtime"
  - test: "Visit http://localhost:4321/en/, view page source"
    expected: "<html lang='en' in the source"
    why_human: "Requires running dev server to confirm EN locale route resolves"
  - test: "On the DE homepage (/), click EN in the language switcher"
    expected: "Browser navigates to /en/ without auto-redirect loop"
    why_human: "Requires browser navigation to confirm switcher links are functional"
  - test: "On the EN homepage (/en/), click DE in the language switcher"
    expected: "Browser navigates to / (DE homepage)"
    why_human: "Requires browser navigation to confirm bidirectional switcher works"
  - test: "Visit http://localhost:4321/en/nonexistent"
    expected: "404 page (not silent fallback to DE content)"
    why_human: "Requires running server to confirm no-fallback behavior"
  - test: "Run pnpm build with empty content directories (Phase 3 state)"
    expected: "Build succeeds; [parity] No content entries found message appears before Astro build output"
    why_human: "Requires full build execution to confirm end-to-end pipeline"
---

# Phase 03: i18n & Content Collections -- Verification Report

**Phase Goal:** Astro native i18n is wired end-to-end (DE default at `/`, EN at `/en/`), all 7 content collections are registered with locale-aware schemas, and CI catches translation drift before it ships.
**Verified:** 2026-04-23T14:30:00Z
**Status:** human_needed
**Re-verification:** Yes -- previous verification passed at 23/23 in worktree; this re-verifies on main after merge.

## Goal Achievement

### Observable Truths (Roadmap Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | DE content serves at `/` and EN at `/en/` via Astro native i18n config; no `[locale]/` dynamic segments; missing EN pages return 404 | VERIFIED | `astro.config.ts` lines 21-28: `i18n: { defaultLocale: 'de', locales: ['de', 'en'], routing: { prefixDefaultLocale: false } }`. No fallback configured. No `[locale]` directory in `src/pages/`. |
| 2 | LanguageSwitcher.astro in the header preserves current route via routeMap -- clicking DE/EN navigates to translated equivalent without auto-redirecting | VERIFIED | `LanguageSwitcher.astro` imports `getLocalePath` from `~/i18n/routeMap` (line 6), reads `Astro.url.pathname` (line 8), resolves paths with fallback (lines 12-13), renders `<a>` links with `hreflang` attributes. Imported and rendered in `Header.astro` line 7/142. |
| 3 | All 7 content collections registered in `src/content.config.ts` with correct locale schemas | VERIFIED | 7 collections exported (lines 220-228): post, caseStudy, useCase, industry, job, event, team. 5 long-form collections have `locale: z.enum(['de', 'en'])` (5 matches), `translationKey: z.string()`, `canonicalKey: z.string()`. 2 short-form collections (event, team) use `{de, en}` sibling Zod objects. `metadataDefinition()` reused across all 5 long-form schemas (5 matches). |
| 4 | CI translation-parity check fails the build when a long-form entry lacks a DE/EN sibling | VERIFIED | `scripts/check-translation-parity.ts` scans 5 long-form collections (`LONG_FORM_COLLECTIONS` array, line 20), compares `translationKey` sets bidirectionally, calls `process.exit(1)` on mismatch (line 109). `package.json` build script: `"tsx scripts/check-translation-parity.ts && astro build"` (line 13). `tsx ^4.19.2` in devDependencies (line 63). |

**Score:** 4/4 roadmap success criteria verified

### Plan-Level Must-Haves (23 items)

| # | Truth (from PLAN frontmatter) | Status | Evidence |
|---|------|--------|----------|
| 1 | Astro resolves DE routes at `/` and EN routes at `/en/` with no dynamic `[locale]` segments | VERIFIED | i18n config present; no `[locale]` dirs in src/pages |
| 2 | Missing EN pages return 404, never silently serve DE content | VERIFIED | No fallback configured in i18n block; comment confirms intent |
| 3 | `getLocalePath('/anwendungen/ladungsdiebstahl/', 'en')` returns `/en/use-cases/cargo-theft/` | VERIFIED | routeMap.ts line 22 has exact mapping; getLocalePath normalizes trailing slashes |
| 4 | `getLocalePath('/en/use-cases/cargo-theft/', 'de')` returns `/anwendungen/ladungsdiebstahl/` | VERIFIED | Bidirectional lookup iterates all routeMap values |
| 5 | `t('nav.home', 'de')` returns 'Startseite', `t('nav.home', 'en')` returns 'Home' | VERIFIED | translations.ts line 11: `'nav.home': 'Startseite'` (de), line 45: `'nav.home': 'Home'` (en) |
| 6 | All 7 content collections are registered | VERIFIED | 7 defineCollection calls; all 7 exported |
| 7 | Long-form collections accept locale/translationKey/canonicalKey fields | VERIFIED | 5 schemas include all 3 required fields |
| 8 | Short-form collections use `{de, en}` sibling object fields | VERIFIED | event: `name: z.object({ de, en })`, team: `name/title/bio: z.object({ de, en })` |
| 9 | Directory scaffold exists with de/ and en/ subdirs for all 5 long-form collections | VERIFIED | All 10 .gitkeep files present (post/de, post/en, caseStudy/de, etc.) + 2 short-form dirs |
| 10 | pnpm build runs the parity check before astro build | VERIFIED | package.json build script chains tsx parity check before astro build |
| 11 | A DE entry with no EN counterpart causes build exit non-zero | VERIFIED | Script iterates deKeys, checks enKeys.has(key), sets hasErrors=true and calls process.exit(1) |
| 12 | An EN entry with no DE counterpart causes build exit non-zero | VERIFIED | Script iterates enKeys, checks deKeys.has(key), same exit logic |
| 13 | Matching translationKey pairs pass without error | VERIFIED | Only fires exit(1) when hasErrors is true; matching keys produce no error |
| 14 | Empty collection directories are silently skipped | VERIFIED | Lines 76-82: skips if dirs don't exist or both key sets are empty |
| 15 | `<html>` element has `lang='de'` on DE pages and `lang='en'` on EN pages | VERIFIED | Layout.astro line 23: `Astro.currentLocale ?? 'de'`; line 30: `lang={currentLocale}` |
| 16 | Clicking DE in switcher on EN page navigates to DE equivalent | VERIFIED | LanguageSwitcher line 12: `dePath = getLocalePath(currentPath, 'de') ?? '/'`; rendered as `<a href={dePath}>` |
| 17 | Clicking EN in switcher on DE page navigates to EN equivalent | VERIFIED | LanguageSwitcher line 13: `enPath = getLocalePath(currentPath, 'en') ?? '/en/'`; rendered as `<a href={enPath}>` |
| 18 | Active locale visually distinguished (underline + font-semibold) | VERIFIED | class:list applies `font-semibold underline underline-offset-2` when locale matches |
| 19 | Switcher renders as `<a>` links, not disabled `<button>` elements | VERIFIED | No `<button>` or `disabled` in LanguageSwitcher.astro; uses `<a href>` elements |
| 20 | `src/pages/en/index.astro` exists as a minimal EN homepage stub | VERIFIED | File exists, imports Layout, renders minimal content |
| 21 | routeMap covers all 7 use-case pairs | VERIFIED | grep count: 7 entries with `use-cases/` key prefix |
| 22 | routeMap covers all 4 industry pairs | VERIFIED | grep count: 4 entries with `industries/` key prefix |
| 23 | Route map pairs match REQUIREMENTS.md slugs | VERIFIED | Spot-checked: `/anwendungen/ladungsdiebstahl/` maps to `/en/use-cases/cargo-theft/`; `/branchen/hochwertige-gueter/` maps to `/en/industries/high-value/` |

**Score:** 23/23 plan-level must-haves verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `astro.config.ts` | i18n routing config | VERIFIED | Lines 21-28: defaultLocale de, locales [de, en], routing.prefixDefaultLocale false, no fallback |
| `src/i18n/routeMap.ts` | Bidirectional route map + getLocalePath | VERIFIED | 22 route entries (11 top-level + 7 UC + 4 VERT); getLocalePath with trailing-slash normalization; exports `routeMap` and `getLocalePath` |
| `src/i18n/translations.ts` | UI string translations + t() | VERIFIED | 25+ keys per locale (nav, cta, footer, forms, misc); t() falls back to key; exports `translations` and `t` |
| `src/content.config.ts` | 7 collection definitions | VERIFIED | 7 defineCollection calls; Zod schemas with correct fields; all exported |
| `src/content/post/de/.gitkeep` | Directory scaffold | VERIFIED | Exists |
| `src/content/post/en/.gitkeep` | Directory scaffold | VERIFIED | Exists |
| `src/content/caseStudy/de/.gitkeep` | Directory scaffold | VERIFIED | Exists |
| `src/content/caseStudy/en/.gitkeep` | Directory scaffold | VERIFIED | Exists |
| `src/content/useCase/de/.gitkeep` | Directory scaffold | VERIFIED | Exists |
| `src/content/useCase/en/.gitkeep` | Directory scaffold | VERIFIED | Exists |
| `src/content/industry/de/.gitkeep` | Directory scaffold | VERIFIED | Exists |
| `src/content/industry/en/.gitkeep` | Directory scaffold | VERIFIED | Exists |
| `src/content/job/de/.gitkeep` | Directory scaffold | VERIFIED | Exists |
| `src/content/job/en/.gitkeep` | Directory scaffold | VERIFIED | Exists |
| `src/content/event/.gitkeep` | Directory scaffold | VERIFIED | Exists |
| `src/content/team/.gitkeep` | Directory scaffold | VERIFIED | Exists |
| `src/content/README.md` | Authoring documentation | VERIFIED | Documents long-form vs short-form patterns, required frontmatter, CI parity check reference |
| `scripts/check-translation-parity.ts` | Build-time parity enforcer | VERIFIED | 122 lines; scans 5 long-form collections; exits 1 on mismatch; skips empty dirs |
| `src/layouts/Layout.astro` | lang attribute via Astro.currentLocale | VERIFIED | Uses `Astro.currentLocale ?? 'de'`; no astrowind:config I18N import remaining |
| `src/components/widgets/LanguageSwitcher.astro` | Functional language switcher | VERIFIED | Imports getLocalePath; renders `<a>` links with aria-current and hreflang |
| `src/pages/en/index.astro` | EN homepage stub | VERIFIED | Minimal stub with Layout import; intentional Phase 3 placeholder for Phase 4 |
| `package.json` | Build pipeline + tsx devDep | VERIFIED | Build script chains parity check; tsx ^4.19.2 in devDependencies |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `astro.config.ts` | Astro routing | i18n config block | WIRED | `defaultLocale: 'de'` present in valid i18n block |
| `Layout.astro` | Astro i18n runtime | `Astro.currentLocale` | WIRED | Line 23: `Astro.currentLocale ?? 'de'` |
| `LanguageSwitcher.astro` | `routeMap.ts` | `import { getLocalePath }` | WIRED | Line 6: import; lines 12-13: called for both locales |
| `Header.astro` | `LanguageSwitcher.astro` | import + JSX render | WIRED | Line 7: import; line 142: `<LanguageSwitcher />` |
| `package.json` build script | `check-translation-parity.ts` | tsx runner | WIRED | `"tsx scripts/check-translation-parity.ts && astro build"` |
| `check-translation-parity.ts` | `src/content/*/de/ and en/` | `fs.readdirSync` | WIRED | Script constructs paths from CONTENT_DIR and scans |
| `content.config.ts` | `src/content/` dirs | glob loader base | WIRED | Each collection uses `base: 'src/content/{name}'` |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| `LanguageSwitcher.astro` | `currentPath`, `dePath`, `enPath` | `Astro.url.pathname` + `getLocalePath()` | Yes -- reads runtime URL, resolves from static routeMap | FLOWING |
| `Layout.astro` | `currentLocale` | `Astro.currentLocale` | Yes -- set by Astro runtime based on URL prefix | FLOWING |
| `check-translation-parity.ts` | file lists from de/en dirs | `fs.readdirSync` | Yes -- reads actual filesystem | FLOWING |

### Behavioral Spot-Checks

Step 7b: SKIPPED (requires running dev server -- all runtime checks routed to human verification below).

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-----------|-------------|--------|----------|
| **I18N-01** | 03-01, 03-04 | Astro native i18n config -- DE default, EN prefix, no silent fallback | SATISFIED | i18n block in astro.config.ts; Layout.astro uses Astro.currentLocale; no fallback configured |
| **I18N-02** | 03-01, 03-04 | File-tree layout -- DE at `src/pages/**`, EN at `src/pages/en/**`, no `[locale]/` | SATISFIED | `src/pages/en/index.astro` exists; no `[locale]` directories found in src/pages |
| **I18N-03** | 03-01 | routeMap.ts maps every DE/EN slug pair | SATISFIED | 22 route pairs covering top-level (11), UC-01 (7), VERT-01 (4); getLocalePath helper exported |
| **I18N-04** | 03-04 | LanguageSwitcher.astro preserves current route via routeMap, never auto-redirects | SATISFIED | Imports getLocalePath, renders `<a>` links, falls back to locale roots when path not in map |
| **I18N-05** | 03-02 | 7 content collections registered in content.config.ts | SATISFIED | post, caseStudy, useCase, industry, job, event, team -- all defined and exported |
| **I18N-06** | 03-02 | Long-form collections use de/en subdirs with locale enum + translationKey + canonicalKey | SATISFIED | 5 long-form schemas enforce all 3 fields; glob pattern `**/*.{md,mdx}` covers de/en subdirs |
| **I18N-07** | 03-02 | Short-form collections use `{de, en}` sibling fields in single file | SATISFIED | event and team use nested `z.object({ de: z.string(), en: z.string() })` for bilingual fields |
| **I18N-08** | 03-03 | CI translation-parity check -- every long-form entry has matching DE+EN siblings | SATISFIED | Script scans 5 collections, compares translationKey sets bidirectionally, exits 1 on drift; wired into build |

**Orphaned requirements:** None. All 8 I18N requirements (I18N-01 through I18N-08) are claimed by plans and satisfied.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/pages/en/index.astro` | 3 | Comment: "route placeholder for Phase 3" | Info | Intentional stub -- documented in Plan 03-04; full EN homepage is Phase 4 (HOME-01) |
| `src/pages/en/index.astro` | 12 | "English content coming soon." text | Info | Intentional Phase 3 placeholder text -- not a blocker; replaced in Phase 4 |

No blockers or warnings. Both matches are intentional stubs documented in the plan and scoped for replacement in Phase 4.

### Human Verification Required

### 1. DE page lang attribute

**Test:** Start dev server (`pnpm dev`), visit `http://localhost:4321/`, view page source
**Expected:** `<html lang="de"` in the source
**Why human:** Requires running dev server to confirm Astro.currentLocale resolves correctly at runtime

### 2. EN page lang attribute

**Test:** Visit `http://localhost:4321/en/`, view page source
**Expected:** `<html lang="en"` in the source
**Why human:** Requires running dev server to confirm EN locale route resolves

### 3. Language switcher DE-to-EN navigation

**Test:** On the DE homepage (`/`), click EN in the language switcher
**Expected:** Browser navigates to `/en/` without auto-redirect loop
**Why human:** Requires browser navigation to confirm switcher links produce correct hrefs

### 4. Language switcher EN-to-DE navigation

**Test:** On the EN homepage (`/en/`), click DE in the language switcher
**Expected:** Browser navigates to `/` (DE homepage)
**Why human:** Requires browser navigation to confirm bidirectional switcher works

### 5. Missing EN page returns 404

**Test:** Visit `http://localhost:4321/en/nonexistent`
**Expected:** 404 page (not silent fallback to DE content)
**Why human:** Requires running server to confirm no-fallback behavior

### 6. Parity check in build pipeline

**Test:** Run `pnpm build` with empty content directories (Phase 3 state)
**Expected:** Build succeeds; `[parity] No content entries found` message appears before Astro build output
**Why human:** Requires full build execution to confirm end-to-end pipeline

### Gaps Summary

No gaps found. All 4 roadmap success criteria and all 23 plan-level must-haves are verified in the codebase on main. All artifacts exist, are substantive, are wired, and have data flowing through them. All 8 I18N requirements (I18N-01 through I18N-08) are satisfied with no orphaned requirements.

Six items require human verification (runtime behavior that cannot be confirmed by static code analysis alone).

---

_Verified: 2026-04-23T14:30:00Z_
_Verifier: Claude (gsd-verifier)_
_Branch: main (all phase 3 commits merged)_
