---
phase: 06-depth-credibility-pages
plan: "01"
subsystem: case-studies
tags: [content-collections, case-studies, pages, i18n, DE, EN]
dependency_graph:
  requires:
    - src/content.config.ts (extended with caseStudy collection)
    - src/layouts/PageLayout.astro
    - src/components/widgets/CallToAction.astro
  provides:
    - caseStudy content collection schema
    - 6 markdown entries (DE+EN) for Schumacher, JJX, Greilmeier
    - CaseStudyCard component
    - DE case study index + detail routes (/fallstudien/, /fallstudien/{slug}/)
    - EN case study index + detail routes (/en/case-studies/, /en/case-studies/{slug}/)
  affects:
    - src/content.config.ts (added caseStudy collection registration)
tech_stack:
  added:
    - caseStudy Astro Content Collection (glob loader, Zod schema)
  patterns:
    - getCollection with locale filter
    - getStaticPaths with canonicalKey as slug
    - quote-first hero detail page pattern (D-02)
    - card-grid index pattern (D-01)
key_files:
  created:
    - src/content.config.ts (modified — added caseStudy collection)
    - src/content/caseStudy/de/schumacher.md
    - src/content/caseStudy/de/jjx.md
    - src/content/caseStudy/de/greilmeier.md
    - src/content/caseStudy/en/schumacher.md
    - src/content/caseStudy/en/jjx.md
    - src/content/caseStudy/en/greilmeier.md
    - src/components/widgets/CaseStudyCard.astro
    - src/pages/fallstudien.astro
    - src/pages/fallstudien/[slug].astro
    - src/pages/en/case-studies.astro
    - src/pages/en/case-studies/[slug].astro
  modified: []
decisions:
  - "caseStudy collection uses glob loader with base: src/content/caseStudy — picks up de/ and en/ subdirectories via **/*.md pattern"
  - "canonicalKey (not the file id) used as URL slug — enables consistent /schumacher/ regardless of locale subdirectory path"
  - "Pre-existing build failure (canonical.yaml YAML import in Phase 4/5 pages) is out of scope — deferred to phase 06 integration or a fix plan"
metrics:
  duration: "~4 minutes"
  completed: "2026-04-23"
  tasks_completed: 2
  files_created: 11
requirements:
  - CASE-01
  - CASE-02
  - CASE-03
  - CASE-04
---

# Phase 6 Plan 01: Case Studies Section Summary

**One-liner:** Content collection-driven case study section with 3 DE+EN markdown entries (Schumacher, JJX, Greilmeier), card-grid index pages, and quote-first detail pages ending with consult CTA.

---

## What Was Built

### Task 1: caseStudy Collection Schema + 6 Markdown Entries

Added the `caseStudy` collection to `src/content.config.ts` with a Zod schema matching the plan's interface exactly:

- `locale: z.enum(['de', 'en'])` — required locale discriminator
- `translationKey`, `canonicalKey` — i18n pairing and URL slug fields
- `customer`, `vertical`, `problem`, `approach`, `outcome` — structured content fields
- `quote`, `quoteAttribution`, `logo`, `publishDate`, `metadata` — optional fields

Created 6 markdown files under `src/content/caseStudy/de/` and `src/content/caseStudy/en/`:
- `schumacher.md` (DE+EN) — pharmaceutical/high-value cargo, 0 thefts since deployment
- `jjx.md` (DE+EN) — European long-haul, real-time anomaly detection at rest stops
- `greilmeier.md` (DE+EN) — intermodal compliance, PDF damage documentation via Logbook

All content follows `voice.md` tone: formal, B2B, preventive positioning, no exclamation points.

### Task 2: CaseStudyCard + Index + Detail Pages

**CaseStudyCard.astro** (D-01 pattern):
- Secondary bg (`hsl(217 60% 93%)`), rounded card, hover shadow lift
- Logo or initials fallback, vertical badge, outcome snippet with `line-clamp-3`
- Locale-aware href (`/fallstudien/{slug}/` vs `/en/case-studies/{slug}/`)
- Accessible: `focus-visible` outline, semantic `<a>` wrapper

**DE index** (`/fallstudien/`): Filters `caseStudy` collection by `locale === 'de'`, sorts by publishDate descending, renders 3-column responsive card grid + CallToAction.

**EN index** (`/en/case-studies/`): Mirror with `locale === 'en'` and EN copy.

**DE detail** (`/fallstudien/[slug].astro`): `getStaticPaths` using `canonicalKey` as slug param. Quote-first hero section (customer logo, blockquote, attribution, vertical badge, title), then Problem/Approach/Outcome sections, markdown body prose, and CallToAction (`Beratung anfragen`).

**EN detail** (`/en/case-studies/[slug].astro`): Mirror with EN section headings ("The Problem", "Our Approach", "The Outcome") and EN CTA copy.

---

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Pre-existing Issues (Out of Scope)

**Pre-existing build failure — canonical.yaml YAML import**
- **Found during:** Task 2 verification (`pnpm build`)
- **Issue:** Phase 4/5 pages (`produkt.astro`, `preise.astro`, `foerderung.astro`, and EN equivalents) import `src/data/brand/canonical.yaml` directly as a JavaScript module. Vite/Rollup has no YAML plugin configured, causing a build error.
- **Impact on this plan:** Zero — my new case study pages do not import YAML. The Vite error occurs before static page generation reaches the caseStudy collection.
- **Deferred to:** `.planning/phases/06-depth-credibility-pages/deferred-items.md` (or next applicable plan)

---

## Known Stubs

The logo paths (`/images/case-studies/schumacher-logo.svg`, `jjx-logo.svg`, `greilmeier-logo.svg`) point to files that do not yet exist in `public/images/case-studies/`. The CaseStudyCard component has a graceful fallback (4-character initials placeholder) so the index page renders correctly without the SVGs. Logo files must be added before final launch (customer approval also pending per STATE.md blocker).

---

## Threat Flags

None — no new network endpoints, auth paths, or trust boundary surface introduced. All content is static markdown rendered via Astro Content Collections with auto-escaped JSX interpolation (T-06-01-01 disposition: accept). Logo SVGs are static assets (T-06-01-02 disposition: accept).

---

## Self-Check: PASSED

All 13 key files confirmed present on disk. All 3 task commits confirmed in git log:
- `ecbe664` feat(06-01): add caseStudy collection schema and 6 markdown entries (DE+EN)
- `1d7ac93` fix(06-01): restore files deleted by accidental soft-reset commit
- `8e149c2` feat(06-01): add CaseStudyCard component and case study page routes (DE+EN)
