---
phase: 05-conversion-funnel
plan: "03"
subsystem: forms
tags: [preact, formspree, zod, turnstile, dsgvo, i18n, lead-capture]
dependency_graph:
  requires:
    - 05-01 (pricing page — ConsultForm wired in Plan 04)
    - 05-02 (RoiCalculator — provides URL params pre-fill contract)
  provides:
    - ConsultForm Preact island (reusable across site)
    - EN /en/thanks/ page
    - Form translation keys (DE + EN)
  affects:
    - src/pages/preise.astro (Plan 04 wires ConsultForm here)
    - src/pages/en/pricing.astro (Plan 04 wires ConsultForm here)
tech_stack:
  added: []
  patterns:
    - Zod z.literal(true) for boolean consent validation
    - Translation key as Zod error message (t(issue.message, locale) lookup pattern)
    - Turnstile implicit rendering via .cf-turnstile class + script loaded in useEffect
    - URL param pre-fill via useEffect + URLSearchParams on mount
    - FormData POST to Formspree with _gotcha honeypot and cf-turnstile-response
key_files:
  created:
    - src/components/islands/ConsultForm.tsx
    - src/pages/en/thanks.astro
  modified:
    - src/i18n/translations.ts
decisions:
  - "form.dsgvo_label and form.error_dsgvo already existed in translations.ts — kept existing values (plan says skip existing keys)"
  - "z.literal(true) used for DSGVO consent (not z.boolean().refine()) per plan spec — rejects unchecked checkbox at Zod level"
  - "Turnstile token read from DOM via querySelector('[name=cf-turnstile-response]') after submit — matches implicit rendering pattern"
  - "phone label uses existing form.phone_label key from translations.ts (already present); only placeholder was missing"
metrics:
  duration: "8 min"
  completed: "2026-04-24"
  tasks_completed: 2
  files_changed: 3
---

# Phase 05 Plan 03: ConsultForm Island + EN Thanks Page Summary

**One-liner:** Preact ConsultForm island with Zod validation, _gotcha honeypot, Cloudflare Turnstile, DSGVO consent, Formspree POST, and ROI URL-param pre-fill; EN /en/thanks/ page mirroring DE danke.astro.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add form translation keys + create ConsultForm.tsx | 33e9b96 | src/i18n/translations.ts, src/components/islands/ConsultForm.tsx |
| 2 | Create EN /en/thanks/ thank-you page | 0fa8988 | src/pages/en/thanks.astro |

## What Was Built

### ConsultForm.tsx (src/components/islands/ConsultForm.tsx)

Reusable Preact island for consult lead capture. Fields in order per UI-SPEC §5.3:

1. **Name** (text, required) — placeholder from `form.name_placeholder`
2. **Email** (email, required) — Zod `.email()` validation
3. **Phone** (tel, optional) — labelled with "(optional)"
4. **Company** (text, required)
5. **Fleet size** (number, required) — with unit label (Anhänger/trailers), min=1 via Zod `.coerce.number().min(1)`
6. **Message** (textarea, optional, rows=4)
7. **_gotcha** hidden honeypot input (`display:none`, `tabindex=-1`, `autocomplete=off`)
8. **Turnstile widget** (`.cf-turnstile` div with `PUBLIC_TURNSTILE_SITEKEY`; script lazy-loaded via useEffect)
9. **DSGVO consent checkbox** — `z.literal(true)` rejects unchecked; links to `/datenschutz`
10. **Submit button** — shows `form.submitting` key while `isSubmitting=true`
11. **submitError** display below button on Formspree non-200 or network error

**Pre-fill logic (useEffect on mount):** Reads `?fleet_size` and `?estimated_savings` from URL. The savings param is formatted as "Geschätztes Einsparpotenzial: €X" (DE) or "Estimated savings: €X" (EN) using `parseInt(..., 10).toLocaleString('de-DE')`.

**Submission:** POST to `https://formspree.io/f/${PUBLIC_FORMSPREE_CONSULT_ID}` with `Accept: application/json` header and FormData body. On 200 → navigate to `/danke` (DE) or `/en/thanks` (EN). On error → show `form.error_submit` with field values preserved.

### Translation Keys Added (src/i18n/translations.ts)

New keys added to both DE and EN (existing keys skipped per plan):

| Key | DE | EN |
|-----|----|----|
| `form.name_placeholder` | Max Mustermann | John Smith |
| `form.email_placeholder` | max@example.com | john@example.com |
| `form.phone_placeholder` | +49 40 123456 | +49 40 123456 |
| `form.company_placeholder` | Logistik GmbH | Logistics Inc |
| `form.fleet_label` | Flottengröße | Fleet size |
| `form.fleet_placeholder` | 10 | 10 |
| `form.fleet_unit` | Anhänger | trailers |
| `form.message_placeholder` | Weitere Informationen... | Additional information... |
| `form.submit_consult` | Beratung anfragen | Book a consult |

All `thanks.*`, `form.error_*`, and `form.dsgvo_*` keys already existed — not duplicated.

### EN Thank-You Page (src/pages/en/thanks.astro)

Exact mirror of `danke.astro` with:
- `locale = 'en' as const`
- `metadata.title = 'Thank you — KONVOI'`
- `metadata.robots = { index: false, follow: false }` (noindex)
- Back-to-homepage link: `href="/en"`
- All `t()` keys identical to DE version — EN strings resolve from translations.ts

## Verification Results

All plan verification checks passed:

| Check | Result |
|-------|--------|
| `_gotcha` hidden input present | PASS (3 occurrences: comment, formData.append, JSX input) |
| `.cf-turnstile` div with `PUBLIC_TURNSTILE_SITEKEY` | PASS |
| `z.literal(true` for DSGVO validation | PASS |
| `estimated_savings` param pre-fill | PASS |
| `form.error_dsgvo` in DE translations | PASS |
| `form.error_dsgvo` in EN translations | PASS |
| `thanks.title` in DE translations | PASS |
| `thanks.title` in EN translations | PASS |
| `src/pages/en/thanks.astro` exists | PASS |
| `index: false` in EN thanks metadata | PASS |
| `pnpm build` exits 0 (91 pages) | PASS |

## Deviations from Plan

None — plan executed exactly as written.

The translations.ts already contained `form.error_required`, `form.error_email`, `form.error_fleet_min`, `form.error_dsgvo`, `form.error_captcha`, `form.error_submit`, `form.submitting`, `form.dsgvo_label`, `form.dsgvo_link_text`, `form.phone_label`, `form.name_label`, `form.email_label`, `form.company_label`, `form.message_label`, `thanks.title`, `thanks.subtitle`, `thanks.body`, `thanks.back_home` in both locales. These were correctly skipped per plan instruction "skip any that already exist."

## Known Stubs

- `PUBLIC_FORMSPREE_CONSULT_ID` — not set; form POST will fail at runtime until Formspree account is created and ID set in `.env`
- `PUBLIC_TURNSTILE_SITEKEY` — not set; Turnstile widget will not render until Cloudflare Turnstile site key is configured

Both are expected pre-launch configuration items, not implementation stubs. The build succeeds without them (Astro does not fail builds for missing `PUBLIC_*` env vars).

## Threat Model Coverage

All T-05-03-01 through T-05-03-07 threats addressed per plan:

| Threat | Status |
|--------|--------|
| T-05-03-01 Injection (XSS) | Mitigated — error messages from translation keys only; Preact escapes string children |
| T-05-03-02 Injection (email) | Mitigated — `z.string().email()` validates format before submission |
| T-05-03-03 Tampering (spam) | Mitigated — `_gotcha` honeypot present with exact field name |
| T-05-03-04 DoS (spam flood) | Mitigated — Turnstile `.cf-turnstile` div present; server Siteverify deferred Phase 7 |
| T-05-03-05 DSGVO bypass | Mitigated — `z.literal(true)` rejects unchecked consent |
| T-05-03-06 URL param injection | Accepted — `parseInt(..., 10)` used; values in Preact state only |
| T-05-03-07 Form ID disclosure | Accepted — `PUBLIC_*` prefix is intentionally client-exposed |

## Self-Check: PASSED

- `src/components/islands/ConsultForm.tsx` — FOUND
- `src/pages/en/thanks.astro` — FOUND
- Commit `33e9b96` — FOUND
- Commit `0fa8988` — FOUND
- `pnpm build` — 91 pages, Complete
