# Phase 3: i18n & Content Collections - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-22
**Phase:** 03-i18n-content-collections
**Mode:** --auto (all decisions auto-selected)
**Areas discussed:** Route mapping, Content collections, Language switcher, CI parity check, UI string translations, Content directory structure

---

## Route Mapping Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Static bidirectional map | Simple TS Record with getLocalePath() helper | ✓ |
| Dynamic route resolution | Parse URL segments at runtime | |
| Config-file based | YAML/JSON route config loaded at build | |

**User's choice:** [auto] Static bidirectional map (recommended default)
**Notes:** Type-safe, zero runtime cost, easy to maintain for a marketing site with known routes.

---

## Content Collection Schema Design

| Option | Description | Selected |
|--------|-------------|----------|
| Per-requirement split | Long-form: de/en subdirs + locale enum. Short-form: sibling fields | ✓ |
| All subdirectory-based | Every collection uses de/en subdirectories | |
| All sibling-field based | Every collection uses {de, en} inline fields | |

**User's choice:** [auto] Per-requirement split (recommended default per I18N-06/07)
**Notes:** Matches REQUIREMENTS.md exactly. Long-form content benefits from file separation; short-form (events, team) is simpler with inline fields.

---

## Language Switcher

| Option | Description | Selected |
|--------|-------------|----------|
| Header-mounted, routeMap-based | Uses routeMap.ts, preserves current route, no redirect | ✓ |
| Footer-only switcher | Less prominent, footer placement | |
| Dropdown with flag icons | More visual but accessibility concerns | |

**User's choice:** [auto] Header-mounted, routeMap-based (recommended default)
**Notes:** Phase 1 D-06 already placed shell in header. Natural extension.

---

## CI Parity Check

| Option | Description | Selected |
|--------|-------------|----------|
| Build-time TS script | Standalone script in package.json build pipeline | ✓ |
| Astro integration hook | Custom integration checking at build start | |
| GitHub Actions separate step | CI-only check, not local | |

**User's choice:** [auto] Build-time TS script (recommended default)
**Notes:** Runs locally and in CI. Fails fast before Astro build if translations are missing.

---

## UI String Translations

| Option | Description | Selected |
|--------|-------------|----------|
| TS translation file with t() helper | Simple, type-safe, dot-notation keys | ✓ |
| JSON files per locale | Standard i18n pattern but no type safety | |
| Astro i18n library (e.g., astro-i18next) | Full library overhead for a marketing site | |

**User's choice:** [auto] TS translation file with t() helper (recommended default)
**Notes:** Marketing site has ~50-100 UI strings. Full i18n library is overkill.

---

## Claude's Discretion

- Exact Zod schema fields per collection (beyond locale/translationKey/canonicalKey)
- `astro:i18n` helper vs custom `getLocalePath()` implementation
- Build script implementation details
- Stub page approach for yet-unbuilt routes
