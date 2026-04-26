---
phase: 05-conversion-funnel
reviewed: 2026-04-26T14:32:00Z
depth: standard
files_reviewed: 13
files_reviewed_list:
  - src/components/islands/ConsultForm.tsx
  - src/components/islands/FundingQualifierForm.tsx
  - src/components/islands/RoiCalculator.tsx
  - src/data/pricing.ts
  - src/i18n/translations.ts
  - src/navigation.ts
  - src/pages/en/funding.astro
  - src/pages/en/pricing.astro
  - src/pages/en/roi.astro
  - src/pages/en/thanks.astro
  - src/pages/foerderung.astro
  - src/pages/preise.astro
  - src/pages/roi.astro
findings:
  critical: 0
  warning: 5
  info: 3
  total: 8
status: issues_found
---

# Phase 05: Code Review Report

**Reviewed:** 2026-04-26T14:32:00Z
**Depth:** standard
**Files Reviewed:** 13
**Status:** issues_found

## Summary

Phase 05 (Conversion Funnel) introduces three Preact islands (ConsultForm, FundingQualifierForm, RoiCalculator), pricing data, expanded i18n translations, navigation updates, and six Astro pages (pricing, ROI, funding, thank-you in DE/EN).

Overall the code is well-structured with good security practices: Zod validation, honeypot fields, Turnstile CAPTCHA, input clamping in the ROI calculator, and noindex on thank-you pages. However, several issues were found that could cause broken links for EN users, misleading ROI results, and inconsistent translation key usage.

## Warnings

### WR-01: Privacy policy link hardcoded to German path in both forms

**File:** `src/components/islands/ConsultForm.tsx:289`
**File:** `src/components/islands/FundingQualifierForm.tsx:350`
**Issue:** Both forms hardcode `href="/datenschutz"` for the DSGVO consent link regardless of locale. When rendered on EN pages (`/en/pricing`, `/en/funding`), users clicking the privacy policy link are sent to the German-language privacy page. There is currently no `/en/privacy` page, but the link should still be locale-aware so it works correctly once one is added, and so EN users are not confused by a German URL.
**Fix:**
```tsx
<a
  href={locale === 'de' ? '/datenschutz' : '/en/privacy'}
  class="text-primary underline underline-offset-2 hover:no-underline"
>
  {t('form.dsgvo_link_text', locale)}
</a>
```

### WR-02: ROI payback calculation shows 0 months when savings are positive

**File:** `src/components/islands/RoiCalculator.tsx:49-50`
**Issue:** When `monthlySavings` is 0 (impossible given current formulas since `savingsRate > 0`), `paybackMonths` falls back to 0. However, the real edge case is when `paybackMonths` computes to an extremely large number (e.g., fleet of 1 with minimum savings). `Math.round(annualKonvoiCost / monthlySavings)` can produce values like 128 months (10+ years), which is technically correct but misleading in a sales context. More critically, the displayed payback is "0 months" in the fallback case, which is factually wrong -- 0 months implies "free" rather than "cannot compute." Consider capping at a sensible upper bound or displaying a different message.
**Fix:**
```tsx
const rawPayback = monthlySavings > 0 ? Math.round(annualKonvoiCost / monthlySavings) : Infinity;
const paybackMonths = rawPayback > 120 ? -1 : rawPayback; // -1 signals "too long"

// In the render:
{result.paybackMonths === -1
  ? t('roi.output_payback_over_10y', locale)
  : `${result.paybackMonths} ${t('roi.output_payback_unit', locale)}`}
```

### WR-03: Turnstile token selector may match wrong widget when both forms exist on same page

**File:** `src/components/islands/ConsultForm.tsx:116`
**File:** `src/components/islands/FundingQualifierForm.tsx:110`
**Issue:** Both forms use `document.querySelector('[name="cf-turnstile-response"]')` to find the Turnstile token. If a page ever renders both forms (unlikely in current routing but possible), the global selector will always return the first widget's token, meaning the second form would submit with the wrong (or stale) Turnstile response. A more robust approach scopes the query to the form element.
**Fix:**
```tsx
// Inside handleSubmit, scope to the form:
const form = (e.target as HTMLFormElement);
const turnstileInput = form.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]');
```

### WR-04: Translation key mismatch -- FundingQualifierForm uses different company-size keys than other forms

**File:** `src/components/islands/FundingQualifierForm.tsx:289-291`
**File:** `src/i18n/translations.ts:159-161 and 179-180`
**Issue:** The FundingQualifierForm uses `form.company_size_51_250` and `form.company_size_250plus` (lines 290-291), while translations.ts also defines `form.company_size_51_200` and `form.company_size_201_plus` (lines 160-161, 382-383). This means there are two conflicting sets of company size breakpoints in the same translation file: one with a 51-200/201+ split and another with a 51-250/250+ split. While the FundingQualifierForm correctly references the keys it uses, the duplicate/conflicting keys create confusion and the unused keys (51_200, 201_plus) are dead translations that could mislead future developers.
**Fix:** Remove the unused `form.company_size_51_200` and `form.company_size_201_plus` keys from both locales in `translations.ts` if they are not referenced by any other component. If another form uses them, standardize the breakpoints across all forms.

### WR-05: NaN displayed if URL param `estimated_savings` is non-numeric in ConsultForm pre-fill

**File:** `src/components/islands/ConsultForm.tsx:50`
**Issue:** The pre-fill logic uses `parseInt(savings, 10).toLocaleString('de-DE')` on the raw URL parameter. If a malicious or corrupted URL contains a non-numeric `estimated_savings` value (e.g., `?estimated_savings=abc`), `parseInt` returns `NaN`, and `NaN.toLocaleString()` renders as the string `"NaN"` in the message field. This is not a security issue (the value is only shown to the submitting user), but it creates a confusing UX.
**Fix:**
```tsx
...(savings
  ? (() => {
      const parsed = parseInt(savings, 10);
      return isNaN(parsed) ? {} : {
        message: `${locale === 'de' ? 'Geschaetztes Einsparpotenzial' : 'Estimated savings'}: €${parsed.toLocaleString('de-DE')}`,
      };
    })()
  : {}),
```

## Info

### IN-01: Unused `frequency` input in ROI calculator

**File:** `src/components/islands/RoiCalculator.tsx:36-37, 52-53`
**Issue:** The "parking stops per week" input (`frequency`) is collected from the user and clamped (`safeFreq`), but never used in the ROI formula. The unused variable is explicitly suppressed with `void safeFreq`. While the comment says "per plan spec," this input collects data from users that has no effect on the output, which is misleading from a UX perspective.
**Fix:** Either integrate `frequency` into the formula (e.g., as a theft-risk multiplier) or remove the input field to avoid collecting data that does not influence the result.

### IN-02: `embedMode` prop accepted but never used in RoiCalculator

**File:** `src/components/islands/RoiCalculator.tsx:16, 27`
**Issue:** The `embedMode` prop (`'compact' | 'full'`) is accepted with a default of `'full'` but is never referenced in the render logic. Both pricing pages pass `embedMode="compact"` and both ROI pages pass `embedMode="full"`, but the output is identical regardless.
**Fix:** Either implement differentiated rendering for compact mode (e.g., hide the frequency input, reduce spacing) or remove the prop to avoid dead code.

### IN-03: Footer `secondaryLinks` use placeholder `#` hrefs

**File:** `src/navigation.ts:95-96`
**Issue:** The footer links for "Impressum" and "Datenschutz" use `href: '#'` which are non-functional placeholder links. These are legal-compliance pages that should point to real URLs.
**Fix:**
```ts
secondaryLinks: [
  { text: 'Impressum',   href: '/impressum' },
  { text: 'Datenschutz', href: '/datenschutz' },
  { text: 'Aktuelles',   href: '/aktuelles/' },
],
```

---

_Reviewed: 2026-04-26T14:32:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
