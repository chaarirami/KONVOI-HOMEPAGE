---
phase: 01-foundation-scrub
plan: "02"
subsystem: ui
tags: [astro, config, navigation, i18n, tailwind, partytown, analytics, fonts]

requires: []
provides:
  - Konvoi-branded config.yaml (name, URL, DE language, empty verification token, empty Twitter handles)
  - Stripped navigation.ts with empty header links, Impressum/Datenschutz footer placeholders, LinkedIn+RSS social, Konvoi GmbH credit
  - LanguageSwitcher.astro visual DE/EN shell (non-functional, Phase 3 wires routing)
  - Header.astro updated to render LanguageSwitcher in right-side flex row
  - astro.config.ts cleaned of partytown and external image CDN domains
  - CustomStyles.astro using system-ui/Georgia fonts (Phase 2 adds Montserrat/PT Serif)
  - Analytics.astro empty stub (Phase 7 adds Plausible)
  - env.d.ts without fontsource-variable/inter declaration
  - package.json without @fontsource-variable/inter, @astrolib/analytics, @astrojs/partytown
affects:
  - 01-03 (page scrub — demo pages still present; Plan 03 deletes them)
  - 02-brand (CustomStyles stub ready for Montserrat/PT Serif replacement)
  - 03-i18n (LanguageSwitcher shell ready for routing wiring)
  - 07-seo (Analytics stub ready for Plausible snippet)

tech-stack:
  added: []
  patterns:
    - "LanguageSwitcher as visual shell first, routing wired in later phase (D-06 pattern)"
    - "System-ui fonts as placeholder pending brand phase"
    - "Analytics as import-safe stub pending SEO phase"

key-files:
  created:
    - src/components/widgets/LanguageSwitcher.astro
  modified:
    - src/config.yaml
    - src/navigation.ts
    - src/components/widgets/Header.astro
    - astro.config.ts
    - src/components/CustomStyles.astro
    - src/components/common/Analytics.astro
    - src/env.d.ts
    - package.json
    - pnpm-lock.yaml
    - src/pages/homes/personal.astro
    - src/pages/homes/startup.astro

key-decisions:
  - "D-06: Language switcher placed as disabled visual shell — no routing until Phase 3 (I18N-04)"
  - "image.domains set to [] to eliminate GDPR-liable third-party image fetching (T-02-02)"
  - "AstroWind demo pages (homes/personal, homes/startup) patched with local image placeholder rather than re-adding CDN domains — pages will be deleted in Plan 03"
  - "Existing color variable values in CustomStyles preserved exactly; only font variables changed"

patterns-established:
  - "Shell-first pattern: visual component created before routing/logic exists, wired in a dedicated later phase"
  - "Stub pattern: components that will be replaced keep the same import path so Layout.astro never breaks"

requirements-completed:
  - FND-02
  - FND-04
  - FND-06

duration: 25min
completed: "2026-04-22"
---

# Phase 01 Plan 02: Foundation Scrub — Config, Nav & Package Cleanup Summary

**Konvoi identity injected into config/nav, DE/EN language switcher shell added to header, partytown/Inter/analytics packages removed, and build verified green**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-04-22T10:50:00Z
- **Completed:** 2026-04-22T10:57:13Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- `src/config.yaml` fully re-branded: Konvoi name, `https://www.konvoi.eu`, empty Google verification token, empty Twitter handles, `language: de` — zero AstroWind strings remain
- `src/navigation.ts` stripped to bare Konvoi shell: empty header links/actions, Impressum + Datenschutz footer placeholders, LinkedIn + RSS social links, `© Konvoi GmbH · All rights reserved.` credit
- `LanguageSwitcher.astro` created as a visual DE/EN toggle shell — both buttons `disabled`, no routing, aria-labelled for screen readers; inserted into Header right-side flex row (D-06 satisfied)
- `astro.config.ts` cleaned: partytown integration + `hasExternalScripts`/`whenExternalScripts` block removed, `AstroIntegration` type import removed, `image.domains` set to `[]`
- `CustomStyles.astro` replaced Inter Variable with `system-ui, sans-serif` / `Georgia, serif` fallbacks; all existing color variables preserved exactly
- `Analytics.astro` replaced with empty stub preserving import path; Phase 7 Plausible comment present
- `env.d.ts` `@fontsource-variable/inter` declaration removed
- Three packages removed: `@fontsource-variable/inter`, `@astrolib/analytics`, `@astrojs/partytown`
- `pnpm run build` exits 0 — 36 pages built

## Task Commits

1. **Task 1: Rewrite config.yaml, navigation.ts, create LanguageSwitcher.astro, update Header.astro** — `16bbf16` (feat)
2. **Task 2: Clean astro.config.ts, stub Analytics/CustomStyles, remove packages** — `63468b9` (feat)

## Files Created/Modified

- `src/config.yaml` — Konvoi site identity (name, URL, googleSiteVerificationId, twitter handles, i18n language)
- `src/navigation.ts` — bare Konvoi nav shell (empty links/actions, Impressum/Datenschutz, LinkedIn+RSS, Konvoi GmbH credit)
- `src/components/widgets/LanguageSwitcher.astro` — **new** — visual DE/EN toggle shell, both buttons disabled
- `src/components/widgets/Header.astro` — import + render of LanguageSwitcher in right-side flex row
- `astro.config.ts` — partytown removed, AstroIntegration type removed, image.domains=[]
- `src/components/CustomStyles.astro` — system-ui/Georgia fonts, all color vars preserved
- `src/components/common/Analytics.astro` — empty stub with Phase 7 comment
- `src/env.d.ts` — fontsource-variable/inter declaration removed
- `package.json` / `pnpm-lock.yaml` — three packages removed
- `src/pages/homes/personal.astro` — Unsplash URL replaced with local default.png (Rule 1 fix)
- `src/pages/homes/startup.astro` — nine Pixabay URLs replaced with local default.png (Rule 1 fix)

## Decisions Made

- **D-06 visual shell:** LanguageSwitcher created as disabled buttons only — no `<a href>` or routing. Phase 3 (I18N-04) wires locale detection and routing. This avoids false affordance while satisfying the positioning requirement.
- **image.domains=[]:** Removes all external CDN whitelisting per T-02-02 (GDPR liability). Demo pages that referenced those CDNs were patched with local `default.png` rather than re-adding domains — they are deleted in Plan 03 anyway.
- **Color vars preserved:** The plan template showed a subset of color variables. The actual file had additional vars (`--aw-color-text-heading`, `--aw-color-bg-page-dark`, `::selection`). All were preserved exactly; only font variables changed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Remote image build failure after image.domains=[]**
- **Found during:** Task 2 (build verification after astro.config.ts edit)
- **Issue:** Setting `image.domains: []` caused `RemoteImageNotAllowed` build errors on AstroWind demo pages (`homes/personal.astro`, `homes/startup.astro`) which referenced Unsplash/Pixabay URLs via Astro's `<Image>` component
- **Fix:** Replaced all 10 external CDN image `src` values with `~/assets/images/default.png` in the two affected pages. These pages are deleted in Plan 03; the patch is a minimal hold-over to keep the build green.
- **Files modified:** `src/pages/homes/personal.astro`, `src/pages/homes/startup.astro`
- **Verification:** `pnpm run build` exits 0, 36 pages built successfully
- **Committed in:** `63468b9` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug triggered by correct plan change)
**Impact on plan:** Necessary to achieve the plan's own success criterion ("pnpm run build succeeds"). Zero scope creep — patched pages are scheduled for deletion in Plan 03.

## Issues Encountered

- The plan's overall verification grep (`grep -ri "astrowind\|arthelokyo\|onwidget" ... astro.config.ts`) flagged a false positive: `import astrowind from './vendor/integration'` and `astrowind({ config: ... })` — these are the required vendor integration calls that load `src/config.yaml`, not AstroWind branding strings. All true acceptance criteria pass.

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| `CustomStyles.astro` font vars point to system-ui/Georgia | `src/components/CustomStyles.astro` | Phase 2 (BRAND-01) replaces with Montserrat + PT Serif |
| `Analytics.astro` renders nothing | `src/components/common/Analytics.astro` | Phase 7 (SEO-05) adds Plausible snippet |
| `LanguageSwitcher.astro` buttons are disabled | `src/components/widgets/LanguageSwitcher.astro` | Phase 3 (I18N-04) wires i18n routing and active-state logic |
| `footerData.secondaryLinks` Impressum/Datenschutz use `href: '#'` | `src/navigation.ts` | Phase 7 adds real URLs |

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Plan 03 (page scrub) can proceed: all config/nav AstroWind references eliminated; `homes/personal.astro` and `homes/startup.astro` flagged for deletion
- Phase 2 (brand): `CustomStyles.astro` stub is in place with the correct import path and CSS variable names — swap font vars only
- Phase 3 (i18n): `LanguageSwitcher.astro` shell exists with correct component path; `navigation.ts` has the i18n comment pointing to I18N-04
- Phase 7 (SEO/analytics): `Analytics.astro` stub is in place with correct import path

---
*Phase: 01-foundation-scrub*
*Completed: 2026-04-22*
