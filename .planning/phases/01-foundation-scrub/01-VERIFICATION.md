---
phase: 01-foundation-scrub
verified: 2026-04-22T12:00:00Z
status: gaps_found
score: 3/5 must-haves verified
overrides_applied: 3
overrides:
  - must_have: "No demo pages, no AstroWind blog posts exist in the repository"
    reason: "User requested all template pages be restored after deletion to update content in-place rather than rebuild from scratch. Demo pages/blog posts are intentionally kept and will be replaced in later phases."
    accepted_by: "chaarirami"
    accepted_at: "2026-04-22T11:42:27Z"
  - must_have: "astro.config.ts image.domains contains only hosts Konvoi actually uses"
    reason: "image.domains restored to include pixabay/unsplash because the restored demo pages reference those CDN images. Will be cleaned when pages are rewritten with Konvoi content."
    accepted_by: "chaarirami"
    accepted_at: "2026-04-22T11:42:27Z"
  - must_have: "Netlify UI branch deploy policy set to production-only"
    reason: "Netlify UI configuration is a manual step deferred by user acknowledgment. netlify.toml context.branch-deploy override is in place as the automated mitigation."
    accepted_by: "chaarirami"
    accepted_at: "2026-04-22T11:42:27Z"
gaps:
  - truth: "Post-build grep CI gate confirms zero matches for banned strings in dist/"
    status: failed
    reason: "The CI grep gate checks for arthelokyo|onwidget in dist/ HTML/JS/CSS. The user-restored demo pages contain arthelokyo URLs (e.g., https://github.com/arthelokyo/astrowind) in 13 HTML files. The grep gate WILL FAIL on every CI run, blocking all PRs."
    artifacts:
      - path: ".github/workflows/actions.yaml"
        issue: "Grep gate pattern (arthelokyo|onwidget) matches content in restored demo pages that build to dist/"
      - path: "src/layouts/LandingLayout.astro"
        issue: "Line 26 has hardcoded href 'https://github.com/arthelokyo/astrowind' which renders into all landing page HTML"
      - path: "src/pages/index.astro"
        issue: "Contains multiple arthelokyo URLs (lines 29, 383)"
      - path: "src/pages/homes/mobile-app.astro"
        issue: "Contains arthelokyo URLs (lines 18, 21, 243)"
      - path: "src/pages/homes/personal.astro"
        issue: "Contains arthelokyo URL (line 29)"
      - path: "src/pages/homes/saas.astro"
        issue: "Contains arthelokyo URL (line 45)"
      - path: "src/pages/homes/startup.astro"
        issue: "Contains arthelokyo URLs (lines 31, 305)"
      - path: "src/pages/services.astro"
        issue: "Contains arthelokyo URL (line 206)"
    missing:
      - "Either widen the grep gate exclusion to skip arthelokyo (removing it entirely or replacing with a pattern that only catches strings NOT in demo page hrefs), OR scrub all arthelokyo URLs from the restored demo pages (replace with '#' or Konvoi URLs), OR exclude demo page paths from the grep gate scan"
  - truth: "GitHub Actions workflow build completes green"
    status: failed
    reason: "Build itself succeeds (36 pages, exit 0), but the grep gate step that runs immediately after build will fail due to arthelokyo matches in dist/. The workflow as a whole will not pass."
    artifacts:
      - path: ".github/workflows/actions.yaml"
        issue: "The grep gate step (lines 37-43) will exit 1 due to arthelokyo matches in 13 dist/ HTML files"
    missing:
      - "This is the same root cause as the grep gate gap above -- fixing that fixes this"
human_verification:
  - test: "Run pnpm run preview and verify Konvoi branding"
    expected: "Header shows DE/EN language switcher, footer shows Konvoi GmbH credit with Impressum/Datenschutz links, no AstroWind branding in navigation or footer"
    why_human: "Visual rendering verification cannot be done programmatically"
  - test: "Verify Netlify UI branch deploy policy"
    expected: "Netlify Dashboard > Site configuration > Build and deploy > Branch deploys is set to None or production-only"
    why_human: "Netlify dashboard configuration cannot be verified programmatically"
---

# Phase 1: Foundation Scrub Verification Report

**Phase Goal:** Every trace of AstroWind template debris is gone from source and build output, and CI enforces it permanently -- earning the right to deploy anything as Konvoi
**Verified:** 2026-04-22T12:00:00Z
**Status:** gaps_found
**Re-verification:** No -- initial verification

## Important Context: User-Requested Deviation

After phase execution completed (plans 01-01 through 01-03), the user requested all template pages be restored (commit `0ae6416`) to update content in-place rather than rebuild from scratch. This revert:

1. Restored all demo pages (homes/, landing/, index, about, contact, pricing, services, privacy, terms)
2. Restored all demo blog posts (src/data/post/)
3. Re-added image domains to astro.config.ts for the restored pages
4. Narrowed the CI grep gate from `astrowind|arthelokyo|onwidget|Unsplash|Cupertino` to `arthelokyo|onwidget` only

Items 1-3 are accepted deviations (overrides above). Item 4 created a new problem: the narrowed gate still catches `arthelokyo` strings present in the restored pages.

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | pnpm build succeeds and post-build grep CI gate confirms zero matches for banned strings in dist/ | FAILED | Build succeeds (36 pages), but grep gate finds arthelokyo in 13 dist/ HTML files. CI will fail on every run. |
| 2 | No demo pages, no AstroWind blog posts, no public/decapcms/, no MIT LICENSE.md | PASSED (override) | Override: User restored demo pages/posts intentionally for in-place content replacement. public/decapcms/ IS deleted. LICENSE.md IS Konvoi proprietary. Accepted by chaarirami on 2026-04-22. |
| 3 | config.yaml reflects Konvoi identity, astro.config.ts image.domains cleaned, AstroWind packages removed | PASSED (override for image.domains) | config.yaml: Konvoi name/URL/DE language, empty twitter handles, empty Google verification -- VERIFIED. image.domains: restored per user request (override). Packages: all 3 removed from package.json -- VERIFIED. |
| 4 | Every Netlify Deploy Preview and Branch Deploy URL renders with noindex nofollow meta; only main triggers branch deploys | VERIFIED | Layout.astro lines 26-27: netlifyContext detection with isNonProduction check. Line 40: conditional noindex meta. netlify.toml: context.branch-deploy override with no-op echo. Netlify UI config deferred (override). |
| 5 | GitHub Actions workflow uses pnpm and the build completes green | FAILED | Workflow correctly uses pnpm/action-setup@v4, pnpm install --frozen-lockfile, pnpm run check, pnpm run build. But the grep gate step after build will exit 1 due to arthelokyo matches in dist/. Full workflow will NOT pass. |

**Score:** 3/5 truths verified (includes 3 overrides)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `LICENSE.md` | Konvoi proprietary notice | VERIFIED | Contains "Konvoi GmbH", "All rights reserved". No MIT, no onWidget, no arthelokyo. |
| `src/layouts/PageLayout.astro` | Layout without Announcement import | VERIFIED | No Announcement import or usage. Clean imports: Layout, Header, Footer, navigation. 27 lines. |
| `src/config.yaml` | Konvoi site identity | VERIFIED | name: Konvoi, site: https://www.konvoi.eu, language: de, empty twitter handles, empty googleSiteVerificationId. Zero astrowind/arthelokyo/onwidget strings. |
| `src/navigation.ts` | Stripped Konvoi navigation shell | VERIFIED | Empty links/actions, Impressum/Datenschutz footer, LinkedIn+RSS social, "Konvoi GmbH" footNote. No getPermalink/getBlogPermalink imports. |
| `src/components/widgets/LanguageSwitcher.astro` | Visual DE/EN toggle shell | VERIFIED | Both buttons disabled, DE highlighted, no href routing, aria-labelled. 38 lines. |
| `src/components/widgets/Header.astro` | Header with LanguageSwitcher | VERIFIED | Imports LanguageSwitcher (line 7), renders it in flex row (line 142). |
| `astro.config.ts` | Cleaned Astro config | PARTIAL (override) | Partytown removed, AstroIntegration removed, hasExternalScripts/whenExternalScripts removed. image.domains restored to [pixabay, unsplash] per user request (override). |
| `src/components/CustomStyles.astro` | System fonts, no Inter | VERIFIED | system-ui/Georgia fonts, no @fontsource-variable/inter, no Inter Variable. Color vars preserved. |
| `src/components/common/Analytics.astro` | Empty stub | VERIFIED | Empty component with Phase 7 Plausible comment. No @astrolib/analytics import. |
| `src/env.d.ts` | No fontsource declaration | VERIFIED | 5 lines, triple-slash references only. No @fontsource-variable/inter. |
| `.github/workflows/actions.yaml` | CI pipeline with pnpm and grep gate | VERIFIED (structure) | pnpm/action-setup@v4, version 10, node-version 22, cache pnpm, frozen-lockfile, check, build, grep gate. No npm ci, no matrix. BUT grep gate will fail on current codebase (see gaps). |
| `netlify.toml` | Netlify config with pnpm and branch-deploy block | VERIFIED | pnpm run build, context.branch-deploy override, Cache-Control headers preserved. |
| `src/layouts/Layout.astro` | Conditional noindex meta | VERIFIED | netlifyContext detection (line 26), isNonProduction check (line 27), conditional noindex meta (line 40). ApplyColorMode preserved. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| PageLayout.astro | Header.astro | import Header | WIRED | Line 3: `import Header from '~/components/widgets/Header.astro'` |
| Layout.astro | Analytics.astro | import Analytics | WIRED | Line 12: `import Analytics from '~/components/common/Analytics.astro'` |
| Layout.astro | CustomStyles.astro | import CustomStyles | WIRED | Line 8: `import CustomStyles from '~/components/CustomStyles.astro'` |
| Header.astro | LanguageSwitcher.astro | import LanguageSwitcher | WIRED | Line 7: import, Line 142: `<LanguageSwitcher />` rendered |
| Layout.astro | Netlify CONTEXT env var | process.env.CONTEXT | WIRED | Line 26: `import.meta.env.CONTEXT ?? process.env.CONTEXT ?? 'production'` |
| actions.yaml | dist/ | grep gate after build | WIRED | Lines 37-43: grep step runs after build step |

### Data-Flow Trace (Level 4)

Not applicable -- no dynamic data rendering artifacts in this phase. All artifacts are config, layout, or CI files.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| pnpm build succeeds | `pnpm run build` | 36 pages built, exit 0 | PASS |
| Grep gate (arthelokyo/onwidget) | `grep -riq "arthelokyo\|onwidget" dist/ *.html *.js *.css` | Matches in 13 files | FAIL |
| No Announcement in PageLayout | `grep Announcement src/layouts/PageLayout.astro` | No matches | PASS |
| Konvoi identity in config | `grep "name: Konvoi" src/config.yaml` | Match found | PASS |
| No banned packages | `grep "@fontsource-variable/inter\|@astrolib/analytics\|@astrojs/partytown" package.json` | No matches | PASS |
| No MIT in LICENSE | `grep MIT LICENSE.md` | No matches | PASS |
| LanguageSwitcher exists and has disabled buttons | File exists, `grep disabled LanguageSwitcher.astro` | 2 matches | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| FND-01 | 01-01 | Delete all AstroWind demo scaffolding | PASSED (override) | Pages restored by user request for in-place editing. DecapCMS deleted. |
| FND-02 | 01-02 | Remove AstroWind branding from config.yaml | SATISFIED | config.yaml fully Konvoi-branded, zero AstroWind strings |
| FND-03 | 01-01 | Remove public/decapcms/ | SATISFIED | Directory does not exist |
| FND-04 | 01-02 | Remove @astrolib/analytics, @astrojs/partytown, @fontsource-variable/inter | SATISFIED | All 3 absent from package.json, imports removed from source |
| FND-05 | 01-01 | Replace LICENSE.md with Konvoi private notice | SATISFIED | Konvoi GmbH proprietary, no MIT |
| FND-06 | 01-02 | Trim astro.config.ts image.domains | PASSED (override) | Domains restored for kept pages per user request |
| FND-07 | 01-03 | GitHub Actions uses pnpm | SATISFIED | pnpm/action-setup@v4, pnpm install --frozen-lockfile, pnpm run check/build |
| FND-08 | 01-03 | Post-build grep CI gate | BLOCKED | Gate exists but will fail due to arthelokyo in restored pages |
| FND-09 | 01-03 | Netlify context-aware noindex meta | SATISFIED | Layout.astro conditional noindex for deploy-preview/branch-deploy |
| FND-10 | 01-03 | Branch deploy policy | SATISFIED (partial) | netlify.toml context.branch-deploy override in place; Netlify UI config deferred |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| src/layouts/LandingLayout.astro | 16-18 | Dead slot: `<Fragment slot="announcement">` references removed slot from PageLayout | Info | No build error (Astro drops unmatched named slots), but dead code |
| src/layouts/LandingLayout.astro | 26 | Hardcoded `href: 'https://github.com/arthelokyo/astrowind'` | Blocker | Renders arthelokyo into dist/ HTML, fails CI grep gate |
| src/pages/index.astro | 29, 383 | Multiple arthelokyo URLs | Blocker | Same root cause as above |
| src/components/CustomStyles.astro | 2 | Comment "Phase 2 will replace" | Info | Expected stub, documented for Phase 2 |
| src/components/common/Analytics.astro | 2 | Comment "Phase 7" | Info | Expected stub, documented for Phase 7 |
| src/navigation.ts | 14 | `href: '#'` placeholder links | Info | Expected stubs for Impressum/Datenschutz, documented for Phase 7 |

### Human Verification Required

### 1. Visual Konvoi Branding Check

**Test:** Run `pnpm run preview` and open http://localhost:4321/ -- inspect header and footer
**Expected:** Header shows DE/EN language switcher (disabled buttons). Footer shows "Konvoi GmbH" with Impressum/Datenschutz links. No AstroWind branding in navigation or footer chrome.
**Why human:** Visual rendering of component positioning and styling cannot be verified programmatically

### 2. Netlify UI Branch Deploy Policy

**Test:** Open Netlify Dashboard > Site configuration > Build and deploy > Branches and deploy contexts > Branch deploys
**Expected:** Set to "None" or "Deploy only the production branch and its deploy previews"
**Why human:** Netlify dashboard configuration cannot be accessed programmatically

## Gaps Summary

**1 root cause, 2 affected truths:**

The user-requested page restoration (commit `0ae6416`) introduced `arthelokyo` strings back into the source tree. The CI grep gate was narrowed from `astrowind|arthelokyo|onwidget|Unsplash|Cupertino` to `arthelokyo|onwidget`, but this is still too broad -- the restored demo pages contain `arthelokyo` URLs that render into `dist/` HTML output.

**13 HTML files** in `dist/` match the grep gate pattern, sourced from:
- `src/layouts/LandingLayout.astro` (hardcoded Download button href)
- `src/pages/index.astro` (multiple arthelokyo references)
- `src/pages/homes/*.astro` (4 files)
- `src/pages/landing/*.astro` (6 files, via LandingLayout)
- `src/pages/services.astro` (1 file)
- `src/data/post/markdown-elements-demo-post.mdx` (renders via blog)

**Fix options (choose one):**
1. **Remove arthelokyo from grep gate** -- change pattern to just `onwidget`, since onwidget is the actual brand owner and arthelokyo is just a GitHub username
2. **Scrub arthelokyo URLs from restored pages** -- replace all `https://github.com/arthelokyo/astrowind` with `#` or a Konvoi URL in demo pages and LandingLayout.astro
3. **Exclude demo page directories from grep scan** -- add `--exclude-dir` flags for homes/, landing/, etc.

Option 2 is recommended as it fixes the root cause while preserving the grep gate's protective intent.

---

_Verified: 2026-04-22T12:00:00Z_
_Verifier: Claude (gsd-verifier)_
