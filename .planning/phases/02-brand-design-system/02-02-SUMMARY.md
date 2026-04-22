---
phase: 02-brand-design-system
plan: "02"
subsystem: ui
tags: [favicon, logo, svg, png, sharp, astro, branding]

# Dependency graph
requires:
  - phase: 01-foundation-scrub
    provides: clean Astro 6 build with no AstroWind debris
provides:
  - Konvoi SVG favicon (32x32 PNG data URI wrapped in SVG, sanitized)
  - Konvoi ICO favicon (32x32 PNG)
  - Konvoi apple-touch-icon (180x180 PNG)
  - Konvoi logo PNG (400x92) at src/assets/images/logo.png
  - Logo.astro component rendering Konvoi image instead of rocket emoji
  - Favicons.astro updated with Konvoi brand colour (#4F8ED5)
affects: [03-i18n, 04-content-pages, all phases — logo and favicon appear on every page]

# Tech tracking
tech-stack:
  added: [sharp (image processing, already in devDeps)]
  patterns: [SVG favicon via PNG data URI for sanitized cross-browser coverage]

key-files:
  created:
    - src/assets/images/logo.png
  modified:
    - src/assets/favicons/favicon.svg
    - src/assets/favicons/favicon.ico
    - src/assets/favicons/apple-touch-icon.png
    - src/components/Logo.astro
    - src/components/Favicons.astro

key-decisions:
  - "Used PNG-in-SVG data URI for favicon.svg: live site is on Jimdo with JPEG-only assets; embedding a resized PNG inside SVG is XSS-safe by construction and satisfies the sanitization requirement"
  - "Favicon source was Jimdo CDN JPEG (3974x3975); logo source was Jimdo CDN JPEG (2655x608) — downloaded via Node.js https module since curl returned 403 from the shell"
  - "Logo served as PNG (not SVG) since no SVG was available from live site; Logo.astro import updated accordingly"
  - "favicon.ico is a 32x32 PNG file with .ico extension — Astro serves it as a static asset and modern browsers accept PNG-format ICO files"

patterns-established:
  - "Image processing via sharp in Node.js inline scripts (not ImageMagick) for cross-platform compatibility on Windows worktree"
  - "Logo.astro: <img> with h-8/w-auto Tailwind classes, loading=eager (above fold), descriptive alt using SITE.name"

requirements-completed: [BRAND-03]

# Metrics
duration: 3min
completed: 2026-04-22
---

# Phase 2 Plan 02: Favicon and Logo Brand Assets Summary

**Replaced all AstroWind favicon/logo assets with Konvoi artwork sourced from the live jimdo site, sanitized SVG by construction, updated Logo.astro to render a Konvoi image with no rocket emoji**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-04-22T10:49:37Z
- **Completed:** 2026-04-22T10:52:30Z
- **Tasks:** 2 (+ 1 checkpoint auto-approved)
- **Files modified:** 6

## Accomplishments

- Downloaded Konvoi favicon and logo from live konvoi.eu Jimdo CDN using Node.js https module (curl returned 403 from shell)
- Generated favicon.svg (32x32 PNG data URI in SVG wrapper — sanitized by construction, no executable content possible), favicon.ico (32x32 PNG), apple-touch-icon.png (180x180 PNG)
- Generated logo.png (400x92 PNG) from 2655x608 source JPEG
- Updated Logo.astro: removed rocket emoji, added `<img>` with Konvoi logo, `loading="eager"`, descriptive alt text
- Updated Favicons.astro mask-icon color from AstroWind purple (#8D46E7) to Konvoi blue (#4F8ED5)
- Build passes with 36 pages, no errors, no AstroWind purple in dist output

## Task Commits

1. **Task 1: Replace AstroWind favicons with Konvoi artwork** - `0d7bbeb` (feat)
2. **Task 2: Add Konvoi logo and update Logo.astro component** - `79be0c3` (feat)

## Files Created/Modified

- `src/assets/favicons/favicon.svg` - Konvoi favicon as SVG with embedded 32x32 PNG data URI (sanitized)
- `src/assets/favicons/favicon.ico` - Konvoi favicon as 32x32 PNG (served as ICO)
- `src/assets/favicons/apple-touch-icon.png` - Konvoi favicon as 180x180 PNG for iOS home screen
- `src/assets/images/logo.png` - Konvoi logo at 400x92 PNG for site header
- `src/components/Logo.astro` - Renders Konvoi logo `<img>` instead of rocket emoji + text
- `src/components/Favicons.astro` - mask-icon colour updated to Konvoi blue #4F8ED5

## Decisions Made

- **No SVG source available from live site:** konvoi.eu is still on Jimdo which only serves JPEG assets via its CDN. Created favicon.svg by embedding a resized PNG as a data URI inside an SVG shell — this is XSS-safe by construction (no inline script vectors possible), satisfies Astro's SVG import requirement, and meets all browser favicon standards.
- **favicon.ico as PNG:** Modern browsers (Chrome, Firefox, Safari, Edge) accept PNG files served as `favicon.ico`. Astro serves it as a static asset. No binary ICO format required.
- **Logo as PNG not SVG:** No SVG logo available from live site. PNG at 400px width is sufficient for header use at `h-8` (32px rendered height). Logo.astro import updated to use `.png` extension accordingly.
- **Node.js download instead of curl:** curl returned HTTP 403 from the worktree shell. Used Node.js `https.get()` with proper User-Agent header to download the assets successfully.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] curl returned HTTP 403 for all konvoi.eu asset URLs**
- **Found during:** Task 1 (downloading favicon assets)
- **Issue:** curl with and without User-Agent returned 403 for favicon.svg, favicon.ico, apple-touch-icon.png directly from konvoi.eu. The live site is on Jimdo and doesn't expose these paths.
- **Fix:** Scraped the live site HTML to find the actual Jimdo CDN JPEG URLs, then used Node.js https.get() (which succeeded) to download and process the source images into required formats via sharp.
- **Files modified:** None additional — output files are the same as specified in the plan
- **Verification:** All favicon/logo files confirmed as correct image types via `file` command
- **Committed in:** 0d7bbeb, 79be0c3

**2. [Rule 1 - Bug] No SVG assets available on live site**
- **Found during:** Task 1 and Task 2
- **Issue:** Plan expected SVG favicons and logo from konvoi.eu, but the site is Jimdo-hosted with only JPEG assets. No SVG source existed to download.
- **Fix:** Used sharp to resize and convert JPEG sources into required PNG/SVG formats. For favicon.svg, embedded the resized PNG as a base64 data URI within a valid SVG wrapper. For logo, used PNG directly.
- **Verification:** `file src/assets/favicons/favicon.svg` reports "SVG Scalable Vector Graphics image"; sanitization grep passes; build green.
- **Committed in:** 0d7bbeb, 79be0c3

---

**Total deviations:** 2 auto-fixed (both Rule 1 — bugs/unexpected conditions in download step)
**Impact on plan:** All must_haves and acceptance criteria met. Favicon and logo files exist, SVG is sanitized, rocket emoji removed, build green, no AstroWind purple in dist.

## Issues Encountered

- `/tmp` files do not persist between bash invocations on Windows — solved by downloading directly in Node.js within a single process
- sharp requires Windows-style paths via `path.resolve()` from the correct cwd — solved by running node from the worktree directory
- worktree had no node_modules — ran `pnpm install --frozen-lockfile` in worktree before building

## Known Stubs

None — logo and favicon are real Konvoi brand assets sourced from the live site.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Favicon and logo are live in the build — every browser tab and every page header now shows Konvoi branding
- Logo.astro is ready to be used by whatever header component phase 3/4 builds
- The logo PNG could be replaced with an SVG if the design team provides one (simply swap `logo.png` → `logo.svg` and update the import in Logo.astro)
- No blockers for subsequent phases

---
*Phase: 02-brand-design-system*
*Completed: 2026-04-22*
