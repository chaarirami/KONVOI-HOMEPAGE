---
phase: 03-i18n-content-collections
reviewed: 2026-04-23T10:42:00Z
depth: standard
files_reviewed: 10
files_reviewed_list:
  - astro.config.ts
  - package.json
  - scripts/check-translation-parity.ts
  - src/components/widgets/LanguageSwitcher.astro
  - src/content.config.ts
  - src/content/README.md
  - src/i18n/routeMap.ts
  - src/i18n/translations.ts
  - src/layouts/Layout.astro
  - src/pages/en/index.astro
findings:
  critical: 0
  warning: 1
  info: 2
  total: 3
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-04-23T10:42:00Z
**Depth:** standard
**Files Reviewed:** 10
**Status:** issues_found

## Summary

The Phase 3 i18n implementation is well-structured and follows the project's design decisions consistently. The Astro i18n config, content collection schemas, route map, translation strings, language switcher, and build-time parity checker are all coherent and correctly wired together. No critical or security issues were found. Three minor findings are noted below -- one type safety warning and two informational items.

Key positives:
- Astro i18n config correctly sets DE as default at `/` with no prefix, EN at `/en/`
- Content collection schemas properly enforce `locale`, `translationKey`, and `canonicalKey` on all long-form collections
- Short-form collections (event, team) use inline `{de, en}` bilingual fields -- no parity check needed
- Build pipeline gates on translation parity before `astro build`
- LanguageSwitcher correctly uses `Astro.currentLocale ?? 'de'` with safe fallback
- Route map covers all known routes with bidirectional lookup

## Warnings

### WR-01: Translation helper `t()` accepts overly wide `locale` parameter type

**File:** `src/i18n/translations.ts:84`
**Issue:** The `t()` function declares `locale: string` but only supports `'de'` and `'en'`. Any string that is not `'en'` silently falls back to `'de'` via the ternary on line 85. This defeats TypeScript's ability to catch invalid locale values at compile time. If a caller passes a typo like `t('nav.home', 'enn')`, no error is raised and it silently returns the German string.
**Fix:**
```typescript
// Change the parameter type from string to Locale
export function t(key: string, locale: Locale): string {
  return translations[locale]?.[key] ?? key;
}
```
This makes the ternary fallback on line 85 unnecessary and catches invalid locale values at compile time. If callers pass `Astro.currentLocale` (which is `string | undefined`), they should narrow it first: `t('nav.home', (locale === 'en' ? 'en' : 'de'))`.

## Info

### IN-01: Async function with no await in parity checker

**File:** `scripts/check-translation-parity.ts:66`
**Issue:** `checkTranslationParity` is declared `async` but contains no `await` expressions. All file I/O uses synchronous `fs.readFileSync` and `fs.readdirSync`. The async declaration is harmless but misleading -- it suggests the function performs asynchronous work when it does not.
**Fix:** Either remove the `async` keyword and change the `.catch()` call on line 119 to a try/catch:
```typescript
function checkTranslationParity(): void {
  // ... existing body unchanged ...
}

try {
  checkTranslationParity();
} catch (err: unknown) {
  console.error('[parity] Unexpected error:', err);
  process.exit(1);
}
```
Or keep `async` if the intent is to migrate to async `fs.promises` later (document this with a comment).

### IN-02: German link text on English page stub

**File:** `src/pages/en/index.astro:13`
**Issue:** The link text reads `"Zur deutschen Version"` (German) on what is the English homepage. While this is a stub page, the link text should be in the page's own language for consistency.
**Fix:**
```html
<a href="/" class="text-link hover:underline">&larr; Go to German version</a>
```

---

_Reviewed: 2026-04-23T10:42:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
