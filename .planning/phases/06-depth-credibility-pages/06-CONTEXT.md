# Phase 6: Depth & Credibility Pages - Context

**Gathered:** 2026-04-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the trust layer that supports the conversion decision: case studies with customer outcomes, blog ported from Jimdo, team page with photos and bios, careers page with open roles, and contact page with two named humans, office address, click-to-load Google Maps, and upcoming events. All DE + EN (except careers which is DE-only with EN shell redirect for v1). Every page ends with the consult CTA.

</domain>

<decisions>
## Implementation Decisions

### Case study presentation
- **D-01:** Card-based index page at `/fallstudien/` (DE) and `/en/case-studies/` (EN). Each card shows customer logo, customer name, vertical badge, and one-line outcome. Cards link to individual detail pages.
- **D-02:** Detail page structure: quote-first hero with customer logo and attribution, then structured sections for problem/approach/outcome (matching `caseStudy` collection schema fields), ending with consult CTA. Follows the same content-collection-driven template pattern as use-case pages.
- **D-03:** Launch with 3 case studies: Schumacher, JJX, Greilmeier. Content generated from `current-site-overview.md` testimonials + `voice.md` tone. Extensible via PR (add new markdown entry).

### Blog migration & routing
- **D-04:** Replace existing `[...blog]` AstroWind dynamic routing with locale-specific static routes. DE blog at `/aktuelles/` with posts at `/aktuelles/{slug}/`. EN blog at `/en/news/` with posts at `/en/news/{slug}/`. Aligns with I18N-02 file-tree routing — no `[locale]/` dynamic segments.
- **D-05:** Blog entries live in `src/content/post/de/` and `src/content/post/en/` using the existing `post` collection schema (locale + translationKey + canonicalKey). Generate placeholder markdown entries matching current Jimdo blog posts from `current-site-overview.md`.
- **D-06:** Per-locale RSS feeds at `/aktuelles/rss.xml` (DE) and `/en/news/rss.xml` (EN). Per-locale blog index with pagination. Tag pages per locale.
- **D-07:** Reuse existing blog components (`src/components/blog/`) — Grid, GridItem, List, ListItem, Pagination, SinglePost, Tags. Adapt `src/utils/blog.ts` for locale-aware filtering (filter by `data.locale`).

### Team page layout
- **D-08:** Photo grid layout — responsive grid (2 cols mobile, 3 cols tablet, 4 cols desktop). Each card: photo (square crop, consistent aspect ratio), name, title, short bio. No social links for v1.
- **D-09:** Member ordering via `order` field in team collection schema (already defined). 9-member starter roster: Alexander, Heinz, Rami, Trinh, Harsha, Jonas, Sushmita, Eric, Justus.
- **D-10:** Team entries use short-form collection pattern (I18N-07) — single file per member with `{de, en}` sibling fields for name, title, bio. Photo field points to `src/assets/images/team/` directory.

### Careers page
- **D-11:** DE-only careers page at `/karriere/` listing 8 open roles from `job` collection. Simple list layout: role title, department tag, type badge (fulltime/internship/initiative), and "Bewerben" mailto button opening `mailto:applications@konvoi.eu` with prefilled subject per role.
- **D-12:** EN shell page at `/en/careers/` renders a short message ("Our job listings are currently available in German only") with a prominent link to `/karriere/`. No silent redirect — explicit user action per i18n principles.
- **D-13:** Job entries in `src/content/job/de/` (DE primary, used for listing) and `src/content/job/en/` (EN translations for future use). Ship with 8 roles from current live site.

### Contact page structure
- **D-14:** Two-contact split: side-by-side cards (stacked on mobile). Each card shows photo, name, role description, direct phone number, and email. Justus Maenninghoff (customer advisor) and Heinz Luckhardt (investors/marketing/applicants). Contact info sourced from `canonical.yaml`.
- **D-15:** Office address block below contacts with static Google Maps screenshot. "Karte laden" / "Load map" button replaces screenshot with interactive iframe only after explicit click — DSGVO compliant, no iframe before consent per CONT-02.
- **D-16:** Upcoming events section below address, above final CTA. Chronological list sourced from `event` content collection. Past events auto-hidden by `endDate` comparison at build time. Each event shows name, date range, location, and optional link.
- **D-17:** Contact page ends with consult CTA (reuses `CallToAction.astro` widget).

### Claude's Discretion
- Blog pagination page size (likely 6-10 posts per page)
- Case study card visual design details (shadow, border, hover state)
- Team photo placeholder approach for dev (silhouette or initials)
- Contact page Maps screenshot source and dimensions
- Blog tag page URL structure (`/aktuelles/tag/{tag}/` vs `/aktuelles/tags/{tag}/`)
- Events section visual treatment (timeline vs simple list)
- RSS feed metadata (title, description, copyright)
- Existing `src/utils/blog.ts` refactoring scope — minimal changes to add locale filtering

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Requirements
- `.planning/REQUIREMENTS.md` -- CASE-01..04, BLOG-01..04, TEAM-01..03, CAREER-01..03, CONT-01..04

### Content & Brand Sources
- `.planning/current-site-overview.md` -- Jimdo site snapshot (2026-04-20): blog posts to migrate, team roster, job listings, contact details, event list, testimonial quotes for case studies
- `src/data/brand/voice.md` -- approved verbs, formal Sie, British EN; must read before generating any copy
- `src/data/brand/canonical.yaml` -- contact info (Justus, Heinz), office address, company details

### Content Collection Schemas
- `src/content.config.ts` -- all 7 collection schemas already defined; `caseStudy`, `post`, `job`, `event`, `team` schemas are the contracts for Phase 6 entries

### Existing Blog Infrastructure
- `src/components/blog/` -- Grid, GridItem, List, ListItem, Pagination, SinglePost, Tags, ToBlogLink, RelatedPosts, Headline
- `src/utils/blog.ts` -- collection loader, permalink generator, `getStaticPaths*` helpers; needs locale-aware adaptation
- `src/pages/[...blog]/` -- AstroWind blog routing (to be replaced with locale-specific routes)
- `src/pages/rss.xml.ts` -- existing RSS endpoint (to be replaced with per-locale feeds)

### Prior Phase Patterns
- `.planning/phases/04-core-marketing-pages/04-CONTEXT.md` -- content-collection-driven page template pattern (useCase/industry), nav structure with `#` placeholders for Phase 6 items
- `.planning/phases/05-conversion-funnel/05-CONTEXT.md` -- ConsultForm island pattern, Preact island architecture, thank-you page pattern
- `.planning/phases/03-i18n-content-collections/03-CONTEXT.md` -- i18n routing, routeMap.ts, translations.ts, locale-aware content loading

### Codebase Intelligence
- `.planning/codebase/CONVENTIONS.md` -- widget pattern, component naming, Tailwind v4 conventions
- `.planning/codebase/STRUCTURE.md` -- directory layout, where to add new pages/widgets/content

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CallToAction.astro` -- consult CTA widget, reuse on every Phase 6 page
- `ConsultForm.tsx` -- Preact island from Phase 5, embeddable on contact and case study pages
- `Hero.astro` -- page hero, extended in Phase 4 for video; reuse for case study detail hero
- `Content.astro` -- image + text section, useful for case study problem/approach/outcome blocks
- `Brands.astro` -- logo wall widget, candidate for case study customer logos on index
- `Testimonials.astro` -- quote display, can inform case study quote presentation
- `Stats.astro` -- number highlights, useful for case study outcome metrics
- Blog components (`Grid`, `Pagination`, `SinglePost`, `Tags`) -- full blog UI already built
- `WidgetWrapper.astro` -- section chrome for all new widgets
- `PageLayout.astro` -- standard page layout

### Established Patterns
- Content collections with `glob` loader and Zod schemas
- Dynamic routes via `getStaticPaths()` + `getCollection()` with locale filtering
- `t()` helper for i18n strings from translations.ts
- Preact islands with `client:visible` for interactive components
- `twMerge` for consumer-supplied class overrides

### Integration Points
- `src/navigation.ts` -- update Case Studies (`#` -> `/fallstudien/`), Company (`#` -> update sub-items for team/careers/contact)
- `src/i18n/routeMap.ts` -- add Phase 6 slug pairs (fallstudien, aktuelles, team, karriere, kontakt)
- `src/i18n/translations.ts` -- add Phase 6 UI strings (section headings, button labels, meta titles)
- `src/pages/` -- new pages: `fallstudien.astro`, `aktuelles/`, `team.astro`, `karriere.astro`, `kontakt.astro`, plus EN equivalents
- `src/content/` -- populate caseStudy, post, job, event, team directories with entries

</code_context>

<specifics>
## Specific Ideas

- Case study quotes should be prominent — they're the strongest trust signal on the site
- Blog posts migrated from Jimdo should preserve the original publish dates for SEO continuity
- Team photos should feel approachable and professional — consistent crop/size/treatment
- Contact page two-contact split mirrors the current Jimdo site structure (Justus for customers, Heinz for investors/marketing)
- Events section is lightweight — just a chronological list, not a calendar; auto-hide past events keeps the page fresh without manual maintenance
- Careers page is intentionally simple — 8 roles, mailto apply, no ATS integration

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 06-depth-credibility-pages*
*Context gathered: 2026-04-23*
