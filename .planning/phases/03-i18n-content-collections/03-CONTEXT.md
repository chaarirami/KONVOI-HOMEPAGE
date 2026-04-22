# Phase 3: i18n & Content Collections - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire Astro native i18n routing end-to-end (DE default at `/`, EN at `/en/`), register all 7 content collections with locale-aware schemas, build a header-mounted language switcher that preserves current route, and add a CI parity check that fails the build when a long-form entry is missing its translation counterpart. After this phase, every page supports bilingual content and content authors can add DE+EN entries that are validated at build time.

</domain>

<decisions>
## Implementation Decisions

### i18n Routing (I18N-01, I18N-02)
- **D-01:** Use Astro native `i18n` config in `astro.config.ts`: `defaultLocale: 'de'`, `locales: ['de', 'en']`, `prefixDefaultLocale: false`. DE content serves at `/`, EN at `/en/`. No `[locale]/` dynamic segments.
- **D-02:** `fallback` strategy set to `undefined` (no fallback). Missing EN pages return 404, never silently serve DE content. This is a hard requirement per I18N-01.
- **D-03:** File-tree layout: DE pages live at `src/pages/**/*.astro`, EN pages at `src/pages/en/**/*.astro`. Each EN page is an explicit file mirroring the DE structure.

### Route Mapping (I18N-03)
- **D-04:** Create `src/i18n/routeMap.ts` as a static bidirectional map. Structure: `Record<string, { de: string; en: string }>` keyed by a canonical route key (e.g., `'use-cases/cargo-theft'`). Export `getLocalePath(currentPath: string, targetLocale: 'de' | 'en'): string` helper.
- **D-05:** Route map covers all slug pairs from REQUIREMENTS.md (e.g., `/anwendungen/ladungsdiebstahl/` ↔ `/en/use-cases/cargo-theft/`). Phase 3 includes stub entries for all known routes; content phases (4-7) fill in as pages are created.

### Language Switcher (I18N-04)
- **D-06:** `LanguageSwitcher.astro` component mounted in `Header.astro` (Phase 1 D-06 already placed a shell switcher). Reads current `Astro.url.pathname`, calls `getLocalePath()` from routeMap.ts, renders DE/EN links. Active locale is visually indicated.
- **D-07:** Switcher never auto-redirects. No `Accept-Language` detection. Locale is always explicit via URL. Per PROJECT.md: "Language auto-redirect" is out of scope.

### Content Collections (I18N-05, I18N-06, I18N-07)
- **D-08:** Register all 7 collections in `src/content.config.ts`: `post`, `caseStudy`, `useCase`, `industry`, `event`, `job`, `team`. Replace the current single `post` collection with the full set.
- **D-09:** Long-form collections (`post`, `caseStudy`, `useCase`, `industry`, `job`) use `de/` + `en/` subdirectories under `src/content/{collection}/`. Each entry has a `locale` field (Zod enum `z.enum(['de', 'en'])`), a `translationKey` (string matching the canonical key), and a `canonicalKey` (slug without locale prefix).
- **D-10:** Short-form collections (`event`, `team`) use `{de, en}` sibling fields in a single file. Example: `name: { de: 'Alexander', en: 'Alexander' }`, `bio: { de: '...', en: '...' }`. No subdirectories needed.
- **D-11:** Content base directory moves from `src/data/post/` (AstroWind legacy) to `src/content/` (Astro standard). The `glob` loader pattern updates accordingly. `src/data/brand/` (Phase 2) stays where it is — it's reference data, not content collections.
- **D-12:** The existing `metadataDefinition()` Zod helper from `content.config.ts` is preserved and reused across all collections that need SEO metadata.

### UI String Translations
- **D-13:** Create `src/i18n/translations.ts` exporting `Record<'de' | 'en', Record<string, string>>` for static UI strings (nav labels, button text, form labels, footer text). Export a `t(key: string, locale: string): string` helper.
- **D-14:** Translation keys use dot-notation namespacing: `'nav.home'`, `'cta.book_consult'`, `'footer.copyright'`. Flat structure, no nesting — simple enough for a marketing site.

### CI Parity Check (I18N-08)
- **D-15:** Create a build-time script (`scripts/check-translation-parity.ts`) that scans `src/content/` long-form collection directories for de/en file parity. For each `de/{slug}.md`, a matching `en/{slug}.md` with the same `translationKey` must exist (and vice versa).
- **D-16:** Script runs as part of `pnpm build` pipeline (added to package.json scripts). Exits non-zero on missing translations, failing the CI build. Short-form collections are excluded (they're always bilingual by structure).

### Claude's Discretion
- Exact Zod schema fields for each collection beyond locale/translationKey/canonicalKey (content-specific fields like `title`, `excerpt`, `image` vary per collection)
- Whether to use `astro:i18n` `getRelativeLocaleUrl()` helper or custom `getLocalePath()` — either works, Claude picks the cleanest approach
- Build script implementation details (glob vs. fs.readdir, error formatting)
- Whether stub pages for yet-unbuilt routes are empty `.astro` files or redirect to 404

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Requirements
- `.planning/REQUIREMENTS.md` §i18n & content collections — I18N-01 through I18N-08, exact scope

### Existing Content Config
- `src/content.config.ts` — Current single `post` collection with Zod schema; must be expanded to 7 collections
- `astro.config.ts` — No i18n config yet; must add `i18n` block

### Prior Phase Decisions
- `.planning/phases/01-foundation-scrub/01-CONTEXT.md` — D-06: header already has language switcher shell
- `.planning/phases/02-brand-design-system/02-CONTEXT.md` — Brand tokens and font system in place; Phase 3 components inherit them

### Codebase Intelligence
- `.planning/codebase/CONVENTIONS.md` — Naming conventions, import patterns, TypeScript strictness
- `.planning/codebase/STACK.md` — Astro 6, Tailwind v4, MDX integration, glob loaders

### Route Slugs (from REQUIREMENTS.md)
- UC-01 defines all 7 use-case DE/EN slug pairs
- VERT-01 defines 4 industry vertical slugs
- BLOG-01 defines `/aktuelles/` (DE) and `/en/news/` (EN)
- CASE-01 defines `/case-studies/` index

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/content.config.ts` — Existing `metadataDefinition()` Zod helper reusable across all 7 collections
- `src/utils/permalinks.ts` — Permalink generation utilities; may need locale-aware extension
- `src/components/widgets/Header.astro` — Language switcher shell already positioned (Phase 1)

### Established Patterns
- Astro content collections with `glob` loader and Zod schemas (current `post` collection)
- TypeScript path alias `~/` for all imports
- Astro file-based routing (filename = URL)
- Component naming: PascalCase.astro

### Integration Points
- `astro.config.ts` — Add `i18n` config block
- `src/content.config.ts` — Expand from 1 to 7 collections
- `src/components/widgets/Header.astro` — Wire language switcher to routeMap
- `src/layouts/Layout.astro` — May need `lang` attribute on `<html>` from Astro locale
- `package.json` — Add parity check script to build pipeline

</code_context>

<specifics>
## Specific Ideas

- DE is the primary locale (default, unprefixed). EN is secondary (prefixed with `/en/`). This matches the business reality: Konvoi's core market is DACH.
- No locale auto-detection or redirect. The current Jimdo site has no EN content, so the redesign introduces EN as an explicit opt-in.
- Content authors will add bilingual entries as markdown files in de/en subdirectories. The CI check enforces that every DE entry has an EN counterpart.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-i18n-content-collections*
*Context gathered: 2026-04-22 via --auto mode*
