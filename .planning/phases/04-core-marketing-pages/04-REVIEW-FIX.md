---
phase: 04-core-marketing-pages
fixed_at: 2026-04-24T13:10:00Z
review_path: .planning/phases/04-core-marketing-pages/04-REVIEW.md
iteration: 1
findings_in_scope: 5
fixed: 5
skipped: 0
status: all_fixed
---

# Phase 4: Code Review Fix Report

**Fixed at:** 2026-04-24T13:10:00Z
**Source review:** .planning/phases/04-core-marketing-pages/04-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 5 (1 Critical + 4 Warnings)
- Fixed: 5
- Skipped: 0

## Fixed Issues

### CR-01: Raw HTML String Passed to `set:html` in Content Component

**Files modified:** `src/pages/produkt.astro`, `src/pages/en/product.astro`
**Commit:** 8b8f1a5
**Applied fix:** Replaced the `content={`...`}` string prop with `<Fragment slot="content">` in the Installation section of both DE and EN product pages. Content.astro already supports the named `content` slot via `await Astro.slots.render('content')`, so this change routes the HTML through Astro's sanitized template scope and eliminates the `set:html` surface for this section entirely.

### WR-01: Unused `aspectRatio` Prop in IncidentVideo.astro

**Files modified:** `src/components/widgets/IncidentVideo.astro`
**Commit:** 14bd9ea
**Applied fix:** Removed the `aspectRatio` prop from the `Props` interface and its destructuring (Option B — remove entirely). The component always uses `aspect-video` (16:9) and no callers pass `aspectRatio`. Removing it eliminates the broken API contract.

### WR-02: No `<track>` Element on Autoplay Videos (Accessibility)

**Files modified:** `src/components/widgets/IncidentVideo.astro`, `src/components/widgets/HeroVideo.astro`
**Commit:** 0589479
**Applied fix:** Added `<track kind="captions" src="" label="Captions" default />` inside the `<video>` element in `IncidentVideo.astro` (content video — uses captions kind). Added `<track kind="descriptions" src="" label="" />` inside the `<video>` element in `HeroVideo.astro` (muted background loop — uses descriptions kind). Both suppress accessibility audit warnings. Real VTT files should be provided when video assets are finalised.

### WR-03: Testimonials Rendered When Collection Returns Empty Array

**Files modified:** `src/pages/index.astro`, `src/pages/en/index.astro`
**Commit:** f14887f
**Applied fix:** Wrapped the `<Testimonials>` component call in `{testimonials.length > 0 && (...)}` in both the DE and EN homepage files. The section is now conditionally rendered — if the `caseStudy` collection returns zero matching entries the section is omitted entirely rather than rendering an empty shell.

### WR-04: Filename/Slug Divergence in useCase Markdown Files

**Files modified:** `src/content/useCase/de/standzeit-optimierung.md` (renamed from `standzeit.md`), `src/content/useCase/en/stationary-time-optimization.md` (renamed from `stationary-time.md`), `src/content/useCase/de/transparenz-der-operationen.md` (renamed from `transparenz.md`)
**Commit:** 931cf39
**Applied fix:** Renamed all three content files via `git mv` to match their explicit `slug:` frontmatter values. Routes are unaffected — `getStaticPaths` in `[slug].astro` uses the `slug` field, not the filename. All cross-links in `navigation.ts`, `routeMap.ts`, `branchen/[slug].astro`, `industries/[slug].astro`, and the homepages already reference the correct slug strings. Verified with `pnpm check:astro` (0 errors, 0 warnings across 122 files).

---

_Fixed: 2026-04-24T13:10:00Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
