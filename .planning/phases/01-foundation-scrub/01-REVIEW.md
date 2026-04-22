---
phase: 01-foundation-scrub
reviewed: 2026-04-22T09:46:44Z
depth: standard
files_reviewed: 15
files_reviewed_list:
  - .github/workflows/actions.yaml
  - astro.config.ts
  - LICENSE.md
  - netlify.toml
  - package.json
  - src/components/common/Analytics.astro
  - src/components/CustomStyles.astro
  - src/components/widgets/Header.astro
  - src/components/widgets/LanguageSwitcher.astro
  - src/config.yaml
  - src/env.d.ts
  - src/layouts/Layout.astro
  - src/layouts/PageLayout.astro
  - src/navigation.ts
  - src/pages/[...blog]/[...page].astro
findings:
  critical: 1
  warning: 3
  info: 4
  total: 8
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-04-22T09:46:44Z
**Depth:** standard
**Files Reviewed:** 15
**Status:** issues_found

## Summary

This review covers the Phase 01 (foundation-scrub) changes: rebranding from AstroWind to Konvoi, CI migration to pnpm, config cleanup, language switcher shell, and noindex meta for non-production deploys. The reviewed files are generally well-structured. The CI workflow, Netlify config, package.json, and LanguageSwitcher component are clean.

Key concerns: (1) the CI grep gate will not catch AstroWind references that remain in template page content (which renders into the built HTML), (2) a language mismatch on the blog listing page where the heading is English but the subtitle is German despite `i18n.language: de` in config, and (3) `process.env.CONTEXT` may not be available at build time in Astro's static output mode without explicit env configuration.

## Critical Issues

### CR-01: CI grep gate will fail on AstroWind content still present in template pages

**File:** `.github/workflows/actions.yaml:37-43`
**Issue:** The CI job greps `dist/` for `arthelokyo` and `onwidget` and fails the build if found. However, multiple template pages that were intentionally kept (per user preference) still contain extensive AstroWind references in their content. For example, `src/pages/index.astro` references "AstroWind" over 20 times, `src/pages/privacy.md` and `src/pages/terms.md` reference "AstroWind LLC", and `src/pages/services.astro` links to `https://github.com/arthelokyo/astrowind`. These will render into `dist/*.html` and trigger the grep gate, causing every CI build to fail.

Affected template pages (outside review scope but impacting the CI file in scope):
- `src/pages/index.astro` -- references "AstroWind" extensively and links to `arthelokyo`
- `src/pages/services.astro` -- links to `arthelokyo/astrowind`
- `src/pages/privacy.md` -- references "AstroWind LLC"
- `src/pages/terms.md` -- references "AstroWind LLC"
- `src/pages/homes/*.astro` -- multiple references to "AstroWind" and `arthelokyo`
- `src/pages/landing/*.astro` -- links to `arthelokyo/astrowind`
- `src/layouts/LandingLayout.astro` -- links to `arthelokyo/astrowind`
- `src/data/post/*.md` -- canonical URLs pointing to `astrowind.vercel.app`

**Fix:** Either (a) defer the grep gate to a later phase when template content is replaced with Konvoi content, or (b) narrow the grep to check only Konvoi-authored files (e.g., Layout.astro, config, navigation) rather than all of `dist/`. Option (a) is simplest:

```yaml
      # TODO: Re-enable after Phase 2 replaces template page content
      # - name: Check for AstroWind author attribution in dist/
      #   run: |
      #     if grep -riq "arthelokyo\|onwidget" \
      #          --include="*.html" --include="*.js" --include="*.css" dist/; then
      #       echo "ERROR: AstroWind author attribution detected in dist/"
      #       exit 1
      #     fi
      #     echo "Grep gate passed"
```

## Warnings

### WR-01: Blog listing page has mixed-language content (German subtitle, English heading)

**File:** `src/pages/[...blog]/[...page].astro:41-44`
**Issue:** The config sets `i18n.language: de`, and the blog subtitle is in German ("Neuigkeiten, Einblicke und Ressourcen rund um Konvoi und Transportsicherheit"), but the heading on line 43 reads "The Blog" in English. This is a language consistency issue for a German-primary site.

**Fix:**
```astro
    <Headline
      subtitle="Neuigkeiten, Einblicke und Ressourcen rund um Konvoi und Transportsicherheit"
    >
      Blog
    </Headline>
```

Use "Blog" (works in both languages) or a German equivalent like "Unser Blog".

### WR-02: `process.env.CONTEXT` may be undefined in Astro static builds

**File:** `src/layouts/Layout.astro:26`
**Issue:** The line `const netlifyContext = import.meta.env.CONTEXT ?? process.env.CONTEXT ?? 'production'` uses `process.env.CONTEXT` as a fallback. In Astro's static output mode (`output: 'static'`), frontmatter code runs at build time. Netlify does set the `CONTEXT` environment variable during the build process, so `process.env.CONTEXT` should work. However, `import.meta.env.CONTEXT` will be `undefined` unless `CONTEXT` is explicitly listed in Astro's `env` schema or prefixed with `PUBLIC_`. The fallback chain works correctly in practice (falling through to `process.env.CONTEXT`), but the first check (`import.meta.env.CONTEXT`) is dead code that always evaluates to `undefined`. This is not a runtime bug but is misleading.

**Fix:** Simplify to only use the mechanism that actually works:
```typescript
const netlifyContext = process.env.CONTEXT ?? 'production';
```

### WR-03: Commented-out import and code blocks in blog listing page

**File:** `src/pages/[...blog]/[...page].astro:8,23-24,47-50`
**Issue:** Multiple blocks of commented-out code remain: the `PostTags` import (line 8), variable assignments (lines 23-24), and the HTML block (lines 47-50). While these are template artifacts retained intentionally, they add noise and may confuse future contributors about whether these features are planned or abandoned.

**Fix:** Either remove the commented-out code entirely (since git history preserves it), or add a clear comment explaining the intent:
```typescript
// PostTags intentionally removed -- category/tag filtering deferred to Phase N
```

## Info

### IN-01: Inconsistent CSS color syntax in dark mode

**File:** `src/components/CustomStyles.astro:38`
**Issue:** Line 38 uses the legacy comma-separated `rgb(247, 248, 248)` syntax while every other color value in the file uses the modern space-separated syntax (e.g., `rgb(0 0 0)`, `rgb(229 236 246)`). Both syntaxes are valid CSS but mixing them is inconsistent.

**Fix:**
```css
--aw-color-text-heading: rgb(247 248 248);
```

### IN-02: `getAsset` imported but only used once in navigation.ts

**File:** `src/navigation.ts:1`
**Issue:** `getAsset` is imported and used only for the RSS link (`getAsset('/rss.xml')`). The RSS feed link also appears in the Header component (line 149) via the same `getAsset` call. This creates two separate RSS link constructions. Not a bug, but worth noting for future consolidation.

**Fix:** No action needed now. When navigation data is expanded in later phases, consider centralizing RSS URL construction.

### IN-03: Empty `links` and `actions` arrays in headerData

**File:** `src/navigation.ts:4-5`
**Issue:** `headerData` exports empty `links: []` and `actions: []`. This means the site currently renders with no navigation links and no header action buttons. This is intentional for the foundation phase (content comes later), but the resulting header shows only the logo, theme toggle, language switcher, and RSS icon.

**Fix:** No action needed -- this is expected for Phase 01. Navigation links will be populated in later phases.

### IN-04: Placeholder footer links with `href="#"`

**File:** `src/navigation.ts:14-15`
**Issue:** "Impressum" and "Datenschutz" links use `href="#"` as placeholders, and the LinkedIn social link also uses `href="#"`. These will scroll to the top of the page when clicked, which could confuse users if the site is deployed before these are updated.

**Fix:** Consider using `href="/impressum"` and `href="/datenschutz"` even if those pages do not exist yet (they will 404 but signal correct intent), or disable the links with a comment noting which phase will add real URLs.

---

_Reviewed: 2026-04-22T09:46:44Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
