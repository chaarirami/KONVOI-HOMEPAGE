---
phase: 06-depth-credibility-pages
plan: "02"
subsystem: blog
tags:
  - blog
  - i18n
  - content-collections
  - rss
  - astro-paginate
dependency_graph:
  requires:
    - 06-01 (phase base commit b80f801)
    - src/content.config.ts (post collection schema)
  provides:
    - DE blog at /aktuelles/ (paginated, RSS, tag pages)
    - EN blog at /en/news/ (paginated, RSS, tag pages)
    - 4 migrated Jimdo DE blog posts in src/content/post/de/
  affects:
    - src/utils/blog.ts (added fetchPostsByLocale helper)
    - src/content.config.ts (updated loader base + schema fields)
tech_stack:
  added:
    - "@astrojs/rss (RSS feed generation)"
  patterns:
    - "Astro Content Collections with locale-filtered getCollection()"
    - "Paginated routes using [...page].astro (not index.astro)"
    - "Post shim pattern: CollectionEntry → Post type via inline mapping"
key_files:
  created:
    - src/content/post/de/konvoi-ladungsdiebstahl-praevention.md
    - src/content/post/de/de-minimis-foerderung-transport.md
    - src/content/post/de/konvoi-sensorik-erklaert.md
    - src/content/post/de/cargo-kriminalitaet-europa-2024.md
    - src/content/post/en/.gitkeep
    - src/pages/aktuelles/[...page].astro
    - src/pages/aktuelles/[slug].astro
    - src/pages/aktuelles/rss.xml.ts
    - src/pages/aktuelles/tag/[tag]/[...page].astro
    - src/pages/en/news/[...page].astro
    - src/pages/en/news/[slug].astro
    - src/pages/en/news/rss.xml.ts
    - src/pages/en/news/tag/[tag]/[...page].astro
  modified:
    - src/utils/blog.ts (added fetchPostsByLocale)
    - src/content.config.ts (loader base + locale/translationKey/canonicalKey fields)
  deleted:
    - src/pages/[...blog]/ (entire directory)
    - src/pages/rss.xml.ts (root AstroWind RSS)
decisions:
  - "Use [...page].astro not index.astro for paginated blog indexes — Astro renders index.astro as both a static page and a paginated route, causing page prop to be undefined on the static render path"
  - "Do not use encodeURIComponent in getStaticPaths tag params — Astro handles URL encoding internally; encoding in params causes NoMatchingStaticPathFound errors"
  - "Update content.config.ts loader base from src/data/post to src/content/post and add locale/translationKey/canonicalKey required fields to match plan schema spec"
  - "Build Post shim inline in each route (CollectionEntry → Post type) rather than using fetchPosts() which lacks locale filtering and has APP_BLOG dependency"
metrics:
  duration: "~15 min"
  completed: "2026-04-23"
  tasks: 2
  files: 15
---

# Phase 06 Plan 02: Blog Routes (DE /aktuelles/ + EN /en/news/) Summary

Replaced AstroWind `[...blog]` catch-all routing with locale-specific static blog routes. Migrated 4 Jimdo blog posts as DE markdown entries. Wired per-locale RSS feeds, paginated indexes, and tag pages for both DE (/aktuelles/) and EN (/en/news/).

## What Was Built

### Task 1: Delete old routes, create content, add locale helpers
- Deleted `src/pages/[...blog]/` (4 files) and `src/pages/rss.xml.ts` — old AstroWind blog routing
- Updated `src/content.config.ts`: changed loader base from `src/data/post` to `src/content/post`, added required `locale`, `translationKey`, `canonicalKey` fields to schema
- Created 4 DE blog posts migrated from Jimdo site snapshot:
  - `konvoi-ladungsdiebstahl-praevention.md` (2024-11-15) — cargo theft prevention
  - `de-minimis-foerderung-transport.md` (2024-09-01) — 80% de-minimis funding
  - `konvoi-sensorik-erklaert.md` (2024-07-10) — sensor system explained
  - `cargo-kriminalitaet-europa-2024.md` (2024-04-20) — cargo crime statistics
- Created `src/content/post/en/.gitkeep` (EN posts are v2 scope)
- Added `fetchPostsByLocale()` helper to `src/utils/blog.ts`

### Task 2: Locale-specific blog route files (8 files)
- `src/pages/aktuelles/[...page].astro` — DE blog index, paginated 6/page, locale filter `de`
- `src/pages/aktuelles/[slug].astro` — DE post detail using SinglePost + Content slot
- `src/pages/aktuelles/rss.xml.ts` — DE RSS feed via `@astrojs/rss`
- `src/pages/aktuelles/tag/[tag]/[...page].astro` — DE tag pages, paginated
- `src/pages/en/news/[...page].astro` — EN blog index (0 posts, empty state)
- `src/pages/en/news/[slug].astro` — EN post detail
- `src/pages/en/news/rss.xml.ts` — EN RSS feed
- `src/pages/en/news/tag/[tag]/[...page].astro` — EN tag pages

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | f66db77 | feat(06-02): delete old [...blog] routes, migrate 4 DE blog posts, add locale helpers |
| 2 | 95c8036 | feat(06-02): add locale-specific blog routes for DE /aktuelles/ and EN /en/news/ |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] content.config.ts loader base pointed to wrong directory**
- **Found during:** Task 1
- **Issue:** `src/content.config.ts` had `base: 'src/data/post'` but plan schema spec and new post files use `src/content/post/`
- **Fix:** Updated loader base to `src/content/post` and added required `locale`, `translationKey`, `canonicalKey` fields to schema
- **Files modified:** `src/content.config.ts`
- **Commit:** f66db77

**2. [Rule 1 - Bug] index.astro paginate causes undefined `page` prop**
- **Found during:** Task 2 build verification
- **Issue:** Astro renders `index.astro` as both a static page (no paginate props) AND as a paginated route, causing `TypeError: Cannot read properties of undefined (reading 'data')` at `/aktuelles/`
- **Fix:** Renamed `index.astro` to `[...page].astro` — the canonical Astro pattern for paginated routes that handles both first page (`/aktuelles/`) and subsequent pages (`/aktuelles/2/`)
- **Files modified:** `src/pages/aktuelles/[...page].astro`, `src/pages/en/news/[...page].astro`
- **Commit:** 95c8036

**3. [Rule 1 - Bug] encodeURIComponent in tag params causes NoMatchingStaticPathFound**
- **Found during:** Task 2 build verification (first build attempt)
- **Issue:** Using `encodeURIComponent(tag)` in `getStaticPaths` params caused Astro to fail matching the decoded URL path `/aktuelles/tag/cargo-kriminalität` against the encoded slug `cargo-kriminalit%C3%A4t`
- **Fix:** Removed `encodeURIComponent()` — Astro handles URL encoding internally; params should be plain strings
- **Files modified:** `src/pages/aktuelles/tag/[tag]/[...page].astro`, `src/pages/en/news/tag/[tag]/[...page].astro`
- **Commit:** 95c8036

**4. Plan specifies `index.astro` as file name, actual file is `[...page].astro`**
- **Reason:** Deviation 2 above — functional correction required by Astro routing behavior
- **Impact:** Route URLs are identical (`/aktuelles/`, `/aktuelles/2/`); only filename differs

## Known Stubs

None — all 4 DE blog posts have real content from the Jimdo site snapshot. EN blog correctly shows empty state (0 posts) — intentional per plan spec; EN posts are v2 scope (V2-CT-01).

## Threat Flags

None — no new network endpoints, auth paths, or trust boundary changes beyond what was in the plan's threat model.

## Self-Check: PASSED

- `src/content/post/de/*.md` — 4 files exist ✓
- `src/content/post/en/.gitkeep` — exists ✓
- `src/pages/aktuelles/[...page].astro` — exists ✓
- `src/pages/aktuelles/rss.xml.ts` — exists ✓
- `src/pages/en/news/[...page].astro` — exists ✓
- `src/pages/en/news/rss.xml.ts` — exists ✓
- `dist/aktuelles/index.html` — exists ✓
- `dist/aktuelles/rss.xml` — exists ✓
- `dist/en/news/index.html` — exists ✓
- `dist/en/news/rss.xml` — exists ✓
- Commit f66db77 — exists ✓
- Commit 95c8036 — exists ✓
- `pnpm build` — 36 pages, no errors ✓
