---
phase: 01-foundation-scrub
plan: "01"
subsystem: scaffolding
tags: [cleanup, astrowind, license, security]
dependency_graph:
  requires: []
  provides:
    - clean-page-tree
    - konvoi-license
    - announcement-free-layout
  affects:
    - src/layouts/PageLayout.astro
    - LICENSE.md
tech_stack:
  added: []
  patterns: []
key_files:
  created: []
  modified:
    - src/layouts/PageLayout.astro
  deleted:
    - src/pages/index.astro
    - src/pages/about.astro
    - src/pages/contact.astro
    - src/pages/pricing.astro
    - src/pages/services.astro
    - src/pages/privacy.md
    - src/pages/terms.md
    - src/pages/homes/saas.astro
    - src/pages/homes/startup.astro
    - src/pages/homes/mobile-app.astro
    - src/pages/homes/personal.astro
    - src/pages/landing/lead-generation.astro
    - src/pages/landing/sales.astro
    - src/pages/landing/click-through.astro
    - src/pages/landing/product.astro
    - src/pages/landing/pre-launch.astro
    - src/pages/landing/subscription.astro
    - src/data/post/astrowind-template-in-depth.mdx
    - src/data/post/get-started-website-with-astro-tailwind-css.md
    - src/data/post/how-to-customize-astrowind-to-your-brand.md
    - src/data/post/landing.md
    - src/data/post/markdown-elements-demo-post.mdx
    - src/data/post/useful-resources-to-create-websites.md
    - public/decapcms/config.yml
    - public/decapcms/index.html
    - src/components/widgets/Announcement.astro
    - LICENSE.md (replaced)
decisions:
  - "Deleted public/decapcms/ to remove unauthenticated CMS admin surface with no-SRI third-party JS (T-01-01)"
  - "Deleted all demo blog posts containing astrowind.vercel.app canonical URLs to prevent SEO leakage (T-01-02)"
  - "Replaced MIT license with Konvoi proprietary notice to fix legal attribution (T-01-03, D-03)"
  - "Kept src/data/post/ directory (empty) to preserve blog route tree for future posts"
metrics:
  duration: "1 minute"
  completed_date: "2026-04-22"
  tasks_completed: 2
  files_changed: 28
---

# Phase 1 Plan 01: Foundation Scrub — Demo Deletion Summary

**One-liner:** Deleted 26 AstroWind demo/placeholder files, removed unauthenticated DecapCMS surface, patched PageLayout.astro Announcement cascade, and replaced MIT license with Konvoi GmbH proprietary notice.

## What Was Done

### Task 1: Delete all AstroWind demo pages, blog posts, DecapCMS, and Announcement component

Deleted all AstroWind scaffolding from the repository:

- **4 demo home pages** (`src/pages/homes/`): saas, startup, mobile-app, personal
- **6 demo landing pages** (`src/pages/landing/`): lead-generation, sales, click-through, product, pre-launch, subscription
- **7 placeholder top-level pages**: index, about, contact, pricing, services, privacy, terms
- **6 demo blog posts** from `src/data/post/` (all containing `astrowind.vercel.app` canonical URLs)
- **DecapCMS directory** (`public/decapcms/`): config.yml and index.html — removed unauthenticated admin surface loading unpkg CDN scripts with no SRI
- **Announcement.astro** component

**Cascade fix:** Patched `src/layouts/PageLayout.astro` atomically — removed the `import Announcement` line and the `<slot name="announcement"><Announcement /></slot>` block so the layout compiles without the deleted component.

### Task 2: Replace LICENSE.md with Konvoi proprietary notice

Overwrote the AstroWind MIT license (crediting onWidget) with the Konvoi GmbH proprietary copyright notice per D-03/FND-05. LICENSE.md now contains only:

> Copyright (c) 2025-2026 Konvoi GmbH. All rights reserved. Unauthorized copying, modification, or distribution of this software is strictly prohibited without prior written consent from Konvoi GmbH.

## Commits

| Task | Hash | Message |
|------|------|---------|
| Task 1 | 9f84b48 | chore(01-01): delete AstroWind demo scaffolding and fix PageLayout cascade |
| Task 2 | ec26e1d | chore(01-01): replace MIT license with Konvoi proprietary notice |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — this plan only deleted files and replaced one with a definitive legal text. No UI-rendering stubs introduced.

## Threat Flags

All three threats from the plan's threat register were mitigated:

| Threat | Disposition | Action |
|--------|-------------|--------|
| T-01-01: Unauthenticated DecapCMS admin surface | Mitigated | Deleted `public/decapcms/` entirely |
| T-01-02: AstroWind canonical URLs in blog post metadata | Mitigated | Deleted all 6 demo posts |
| T-01-03: MIT license crediting onWidget | Mitigated | Replaced with Konvoi proprietary notice |

## Self-Check

Verified after completion:
- `src/pages/homes/` — does not exist
- `src/pages/landing/` — does not exist
- `public/decapcms/` — does not exist
- `src/components/widgets/Announcement.astro` — does not exist
- `src/layouts/PageLayout.astro` — zero occurrences of "Announcement"
- `src/layouts/PageLayout.astro` — contains Header and Footer imports
- `LICENSE.md` — contains "Konvoi GmbH", "All rights reserved"; no "MIT", "onWidget", or "arthelokyo"
- `src/data/post/` — empty directory preserved for blog route tree
- Commits 9f84b48 and ec26e1d exist in git log

## Self-Check: PASSED
