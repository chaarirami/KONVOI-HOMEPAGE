---
phase: 02-brand-design-system
plan: "03"
subsystem: ui
tags: [brand, yaml, content, voice, canonical-data, pricing, i18n]

# Dependency graph
requires:
  - phase: 01-foundation-scrub
    provides: Clean Astro 6 repo with AstroWind debris removed, ready for brand layer
provides:
  - src/data/brand/canonical.yaml — single source of truth for legal entity, contacts, pricing tier slugs, funding de-minimis ref, install promise
  - src/data/brand/voice.md — approved/banned verb lists, tone guidelines, CTA guidance, copy transformation examples, localisation notes
affects:
  - 02-brand-design-system (remaining plans)
  - 04-content-pages (canonical.yaml imported for contact emails, pricing tiers)
  - 05-pricing-roi (ROI calculator references tier slugs standard/camera-module/logbook)
  - phase-copywriting (voice.md governs all marketing copy)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "src/data/brand/ as home for brand data files (YAML + Markdown reference docs)"
    - "canonical.yaml imported in Astro frontmatter via: import brand from '~/data/brand/canonical.yaml'"
    - "Stable tier slugs (standard, camera-module, logbook) as cross-phase reference keys"

key-files:
  created:
    - src/data/brand/canonical.yaml
    - src/data/brand/voice.md
  modified: []

key-decisions:
  - "Pricing amounts set to 'auf Anfrage' / 'on request' — live site is quote-based; actual prices to be filled before Phase 5"
  - "Tier slugs (standard, camera-module, logbook) declared stable — Phase 5 ROI calculator references them by slug (PRICE-03)"
  - "voice.md is a reference document only — not imported at runtime by Astro components"
  - "Contact name Justus Männinghoff confirmed as Customer Advisor from current-site-overview.md §7"

patterns-established:
  - "Brand data files live in src/data/brand/ — not in src/content/ (not content collections, not page routes)"
  - "Bilingual data pattern: every user-facing string has de_ and en_ variants in canonical.yaml"
  - "Preventive-vs-reactive language enforced by voice.md — approved/banned verb tables are the gate"

requirements-completed: [BRAND-05, BRAND-06]

# Metrics
duration: 2min
completed: 2026-04-22
---

# Phase 2 Plan 03: Brand Data Files Summary

**canonical.yaml + voice.md establish Konvoi legal data, three stable pricing tier slugs, and preventive-vs-reactive brand voice rules as single sources of truth for all future phases**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-22T10:49:43Z
- **Completed:** 2026-04-22T10:51:27Z
- **Tasks:** 2 (+ 1 checkpoint auto-approved in auto_advance mode)
- **Files modified:** 2

## Accomplishments

- Created `src/data/brand/canonical.yaml` with KONVOI GmbH legal entity, Hamburg address, main phone, four contact emails (justus, heinz, info, applications), three pricing tier slugs with bilingual placeholder prices, funding de-minimis reference, and install promise
- Created `src/data/brand/voice.md` with approved verbs (prevent, anticipate, secure, detect, classify, deter, enable, protect), banned verbs (respond, react, alert/notify/track as primary claims), tone guidelines, CTA guidance ("Beratung anfragen" / "Book a consult"), copy transformation examples, and localisation notes
- Both files verified against all acceptance criteria; no secrets present in canonical.yaml

## Task Commits

Each task was committed atomically:

1. **Task 1: Create src/data/brand/canonical.yaml** - `60e3d2e` (feat)
2. **Task 2: Create src/data/brand/voice.md** - `b232d1f` (feat)

## Files Created/Modified

- `src/data/brand/canonical.yaml` - Single source of truth for legal entity, contact emails, pricing tier slugs, funding de-minimis ref, install promise
- `src/data/brand/voice.md` - Brand voice reference: approved/banned verb lists, tone guidelines, CTA guidance, copy transformation examples, localisation rules

## Decisions Made

- Pricing amounts set to `"auf Anfrage"` / `"on request"` — the live konvoi.eu site is quote-based and does not publish prices publicly; actual amounts to be filled before Phase 5 pricing page work
- Tier slugs (`standard`, `camera-module`, `logbook`) declared stable in a YAML comment — Phase 5 ROI calculator will reference these by slug (REQUIREMENTS.md PRICE-03)
- `voice.md` stored as a Markdown reference document in `src/data/brand/`, not in `src/content/` — it is not a content collection entry and is not served by Astro as a page route
- Checkpoint auto-approved (auto_advance mode active) — files meet all acceptance criteria and contain only publicly available business data

## Deviations from Plan

None — plan executed exactly as written. Both files contain exactly the content specified in the plan's `<action>` blocks, with one minor addition: a YAML comment in `canonical.yaml` warning against renaming tier slugs (required by threat model T-02-10 mitigation disposition).

## Issues Encountered

None. All acceptance criteria passed on first run.

## User Setup Required

None — no external service configuration required. However, user review of both files is recommended before Phase 3 merges:

- **canonical.yaml:** Verify contact names, phone numbers, email addresses, and funding percentage are current
- **voice.md:** Verify approved/banned verb lists and CTA phrasing match how the team actually communicates about the product

## Known Stubs

- `canonical.yaml` pricing amounts (`de_price_display: "auf Anfrage"`, `en_price_display: "on request"`) — intentional placeholders; actual prices require sales-team sign-off before Phase 5 (REQUIREMENTS.md PRICE-02). This does not block Phase 3 or Phase 4.

## Next Phase Readiness

- `src/data/brand/canonical.yaml` is ready for import in Phase 4 contact and pricing components
- `src/data/brand/voice.md` governs all copy written in Phase 4 content pages
- Phase 5 ROI calculator can reference tier slugs `standard`, `camera-module`, `logbook` from canonical.yaml
- No blockers for Phase 3 (i18n routing) or Phase 4 (content pages)

## Threat Flags

No new threat surface introduced beyond what is documented in the plan's threat model. `src/data/brand/` files are not served as Astro page routes — they are build-time data only.

## Self-Check: PASSED

- `src/data/brand/canonical.yaml` exists and contains all required fields
- `src/data/brand/voice.md` exists and contains all required sections
- Commits `60e3d2e` and `b232d1f` present in git log
- No secrets in canonical.yaml (grep for secret|token|password|api_key returns no matches)

---
*Phase: 02-brand-design-system*
*Completed: 2026-04-22*
