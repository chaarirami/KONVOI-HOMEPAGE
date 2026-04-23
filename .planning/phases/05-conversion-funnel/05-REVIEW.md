---
phase: 05-conversion-funnel
reviewed: 2026-04-23T14:32:00Z
depth: standard
files_reviewed: 15
files_reviewed_list:
  - src/data/pricing.ts
  - src/components/islands/RoiCalculator.tsx
  - src/components/islands/ConsultForm.tsx
  - src/components/islands/FundingQualifierForm.tsx
  - src/pages/preise.astro
  - src/pages/en/pricing.astro
  - src/pages/roi.astro
  - src/pages/en/roi.astro
  - src/pages/foerderung.astro
  - src/pages/en/funding.astro
  - src/pages/danke.astro
  - src/pages/en/thanks.astro
  - src/navigation.ts
  - src/i18n/translations.ts
  - src/env.d.ts
findings:
  critical: 2
  warning: 4
  info: 3
  total: 9
status: issues_found
---

# Phase 5: Code Review Report

**Reviewed:** 2026-04-23T14:32:00Z
**Depth:** standard
**Files Reviewed:** 15
**Status:** issues_found

## Summary

Phase 5 introduces the conversion funnel: pricing page with tier cards, ROI calculator, consultation form, funding qualification form, and thank-you pages -- all with DE/EN locale support. The implementation is generally well-structured with good attention to documented pitfalls (Formspree JSON header, Turnstile explicit render, DSGVO consent). However, there are two critical issues related to placeholder secrets that will cause silent form submission failures in production, along with several warnings around inconsistent routing, a misleading ROI edge case, and CSS class inconsistency on thank-you pages.

## Critical Issues

### CR-01: Formspree placeholder ID will silently fail form submissions in production

**File:** `src/components/islands/ConsultForm.tsx:24-26`
**Issue:** The Formspree endpoint ID falls back to the literal string `'REPLACE_WITH_FORMSPREE_ID'` when the environment variable `PUBLIC_FORMSPREE_CONSULT_ID` is not set. In production, if the env var is missing, the form will POST to `https://formspree.io/f/REPLACE_WITH_FORMSPREE_ID`, which returns a non-200 response. The user sees a generic "Submission failed" error with no indication that the root cause is a missing configuration. This is a silent data-loss risk: the operator believes the form is live, but no submissions are received.
**Fix:** Fail loudly at build time or render time. Replace the nullish coalescing fallback with a build-time assertion or a visible dev-mode warning:
```tsx
const FORMSPREE_ID = import.meta.env.PUBLIC_FORMSPREE_CONSULT_ID as string;
if (!FORMSPREE_ID || FORMSPREE_ID === 'REPLACE_WITH_FORMSPREE_ID') {
  console.error('[ConsultForm] PUBLIC_FORMSPREE_CONSULT_ID is not configured. Form submissions will fail.');
}
```
Alternatively, render a visible banner in the form component when the ID is a placeholder so it is impossible to miss during QA.

### CR-02: Formspree placeholder ID in FundingQualifierForm (same issue as CR-01)

**File:** `src/components/islands/FundingQualifierForm.tsx:25-26`
**Issue:** Identical problem: `PUBLIC_FORMSPREE_FUNDING_ID` falls back to `'REPLACE_WITH_FORMSPREE_FUNDING_ID'`. Same silent failure risk.
**Fix:** Same approach as CR-01:
```tsx
const FORMSPREE_ID = import.meta.env.PUBLIC_FORMSPREE_FUNDING_ID as string;
if (!FORMSPREE_ID || FORMSPREE_ID === 'REPLACE_WITH_FORMSPREE_FUNDING_ID') {
  console.error('[FundingQualifierForm] PUBLIC_FORMSPREE_FUNDING_ID is not configured. Form submissions will fail.');
}
```

## Warnings

### WR-01: Turnstile test key used as production fallback bypasses CAPTCHA protection

**File:** `src/components/islands/ConsultForm.tsx:29-30`
**File:** `src/components/islands/FundingQualifierForm.tsx:29-30`
**Issue:** The Cloudflare Turnstile site key falls back to `'1x00000000000000000000AA'` (the Cloudflare "always passes" test key) when `PUBLIC_TURNSTILE_SITE_KEY` is not set. If the env var is missing in production, all CAPTCHA challenges auto-pass, meaning the Turnstile anti-spam layer is completely bypassed. Bots can submit the form freely.
**Fix:** Apply the same fail-loud pattern as CR-01/CR-02. Log a warning or render a dev-mode indicator when the test key is active:
```tsx
const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string;
if (!TURNSTILE_SITE_KEY || TURNSTILE_SITE_KEY === '1x00000000000000000000AA') {
  console.warn('[ConsultForm] Using Turnstile test key — CAPTCHA protection is disabled.');
}
```

### WR-02: Inconsistent trailing slash on DE thank-you redirect causes potential 404

**File:** `src/components/islands/ConsultForm.tsx:191`
**File:** `src/components/islands/FundingQualifierForm.tsx:181`
**Issue:** The DE redirect is `'/danke'` (no trailing slash) while the EN redirect is `'/en/thanks/'` (with trailing slash). If Astro's `trailingSlash` config is set to `'always'` (common for static sites), the `/danke` redirect may 404 or cause an extra redirect hop. The Astro page at `src/pages/danke.astro` will generate `/danke/index.html` in most configurations, making the canonical URL `/danke/`.
**Fix:** Add trailing slash to the DE redirect for consistency:
```tsx
const thankYouUrl = locale === 'en' ? '/en/thanks/' : '/danke/';
```

### WR-03: ROI payback period returns 0 months when savings are zero (misleading)

**File:** `src/data/pricing.ts:105-106`
**Issue:** When `monthlySavings` is 0 (which happens when `parkingFrequency` is very low and the vertical has a low savings factor), `paybackPeriodMonths` is set to `0`. In `RoiCalculator.tsx:49-51`, a value of `<= 0` renders as "< 1 month", implying nearly instant payback. In reality, zero savings means payback never occurs. The current logic conflates "instant payback" with "no payback".
**Fix:** Return a sentinel value (e.g., `Infinity` or `-1`) when savings are zero, and handle it in the UI:
```ts
// pricing.ts
const paybackPeriodMonths =
  monthlySavings > 0 ? Math.ceil(netAnnualKonvoiCost / monthlySavings) : Infinity;

// RoiCalculator.tsx
const paybackLabel =
  result.paybackPeriodMonths === Infinity
    ? isDE ? 'n/a' : 'n/a'
    : result.paybackPeriodMonths <= 0
      ? isDE ? '< 1 Monat' : '< 1 month'
      : `${result.paybackPeriodMonths} ${isDE ? 'Monate' : 'months'}`;
```

### WR-04: Thank-you page CTA button uses wrong CSS class (bg-primary instead of bg-konvoi-primary)

**File:** `src/pages/danke.astro:33`
**File:** `src/pages/en/thanks.astro:33`
**Issue:** The "Back to Home" button uses `bg-primary` while every other CTA button across all phase-5 pages uses `bg-konvoi-primary`. If `bg-primary` is not defined in the Tailwind config (or maps to a different color), the button will either be unstyled or visually inconsistent with the rest of the site.
**Fix:** Change to the project-standard class:
```html
class="inline-block rounded-lg bg-konvoi-primary px-6 py-3 text-white font-semibold hover:bg-konvoi-primary/90 transition-colors"
```

## Info

### IN-01: VERTICALS array duplicated across three island components

**File:** `src/components/islands/RoiCalculator.tsx:17-22`
**File:** `src/components/islands/ConsultForm.tsx:32-37`
**File:** `src/components/islands/FundingQualifierForm.tsx:32-37`
**Issue:** The `VERTICALS` array (value/de/en label mapping) is defined identically in three files. If a vertical is added or renamed, all three must be updated in sync -- a maintenance risk.
**Fix:** Extract into `src/data/pricing.ts` alongside the `Vertical` type and import from there:
```ts
// pricing.ts
export const VERTICALS: { value: Vertical; de: string; en: string }[] = [
  { value: 'high-value', de: 'Hochwertige Guter', en: 'High-Value Cargo' },
  // ...
];
```

### IN-02: Duplicate `declare global` for Turnstile window type

**File:** `src/components/islands/ConsultForm.tsx:14-22`
**File:** `src/components/islands/FundingQualifierForm.tsx:14-22`
**Issue:** Both form components declare the same `Window.turnstile` global type augmentation. While TypeScript merges these without error, it is unnecessary duplication and could diverge over time.
**Fix:** Move the declaration to `src/env.d.ts` or a shared `src/types/turnstile.d.ts` file.

### IN-03: Header CTA links to #consult anchor that only exists on pricing pages

**File:** `src/navigation.ts:34`
**File:** `src/navigation.ts:69`
**Issue:** The header action button links to `#consult`, which resolves to the `id="consult"` section on the pricing pages. On all other pages (homepage, product, use-case, industry), this anchor does not exist, so clicking the header CTA scrolls nowhere. This is a pre-existing issue (not introduced in Phase 5) but the pricing page integration makes it visible.
**Fix:** Change the header CTA to link to the pricing page with the anchor:
```ts
// DE
actions: [{ text: 'Beratung anfragen', href: '/preise#consult' }],
// EN
actions: [{ text: 'Book a consult', href: '/en/pricing#consult' }],
```

---

_Reviewed: 2026-04-23T14:32:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
