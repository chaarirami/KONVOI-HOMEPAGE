---
phase: 03
status: issues_found
findings: 3
severity_counts:
  critical: 1
  high: 1
  medium: 1
  low: 0
reviewed_files: 9
---

# Phase 03 Code Review

## Findings

### CR-01 (Critical) — LanguageSwitcher.astro:9

**Unsafe `Astro.currentLocale` access.** The component relies on `Astro.currentLocale` which may be undefined when i18n config is not yet resolved. Should add fallback.

**Suggested fix:** Use `Astro.currentLocale ?? 'de'` or infer locale from pathname (`/en/` prefix = EN, else DE).

### HR-01 (High) — routeMap.ts:48-58

**Route normalization logic fragile.** Trailing-slash normalization works if routes are consistently formatted, but risks breaking if new routes added without trailing slashes.

**Suggested fix:** Use split/filter/rejoin approach for more robust normalization, or enforce convention with a validation check.

### MR-01 (Medium) — translations.ts

**Translation key naming convention.** The `lang.switch_to_en` / `lang.switch_to_de` keys have text that is intentionally in the target language (showing what you'll switch TO). This is actually correct UX but worth documenting with a comment.

## Passing Checks

- i18n config: DE at `/`, EN at `/en/`, no silent fallback
- Content collections: 7 collections registered with locale-aware schemas
- Parity checker: bidirectional validation, exits non-zero on drift
- Build pipeline: parity check chains before astro build
- Route map: covers all REQUIREMENTS.md routes
- EN index stub: valid `/en/` route exists

---

*Reviewed: 2026-04-22 | Depth: standard | Advisory only*
