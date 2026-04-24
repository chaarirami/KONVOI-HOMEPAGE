# Phase 4: Core Marketing Pages - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the core marketing page set: homepage, product page, 7 use-case pages, and 4 industry vertical landings — all in DE and EN. After this phase, a visitor can navigate the full Konvoi product story from homepage through specific theft-type use cases to industry-specific landings, with consistent brand narrative and working cross-links to Phase 6 pages (case studies, blog, team, careers, contact).

</domain>

<decisions>
## Implementation Decisions

### SensorDataViz → Video Replacement
- **D-01:** Do NOT build the `SensorDataViz` Preact island. Replace with `<video>` elements on each use-case page showing real dashboard incident replays.
- **D-02:** Video files are placeholder for now. User will record staged incidents from the existing Next.js dashboard (`c:\Users\Rami\Desktop\konvoi-dashboard\app\(dashboard)\incidents-view\[...id]\page.tsx`) — one per use case.
- **D-03:** Build a reusable `IncidentVideo.astro` component that accepts a video source path, poster image, and caption. Autoplay muted with controls. Swap-ready for real recordings.

### Homepage
- **D-04:** Hero: "Security Tech Made in Germany" headline + preventive-vs-reactive tagline + primary "Beratung anfragen" / "Book a consult" CTA. Background video loop (muted, autoplay). User has video ready.
- **D-05:** Homepage section order (restructured from Jimdo):
  1. Hero + CTA (with background video)
  2. Preventive-vs-reactive explainer (HOME-05)
  3. Use-case teaser cards — 7 icon cards in 3-4 column grid (HOME links to UC pages)
  4. Testimonials — 3 quotes: Schumacher, JJX, Greilmeier (HOME-04, sourced from caseStudy collection)
  5. Customer logo wall (HOME-03)
  6. "Known from" press-mentions strip (HOME-06)
  7. "Supported by" partners/investors strip (HOME-07)
  8. End-of-page consult CTA (HOME-08)
- **D-06:** Use-case teasers display as icon cards grid (3-4 columns desktop, stacked mobile). Each card: icon + title + 1-line description + link to use-case page.

### Product Page
- **D-07:** Trailer sensor positions visual (PROD-02): Scroll-driven callout annotations on one or more high-quality 3D rendered trailer images. As user scrolls, sensor positions highlight with annotated callouts. User provides the 3D render asset(s). Placeholder image until asset is ready.
- **D-08:** Detection → Classification → Measures flow (PROD-03): Scroll-triggered animated 3-step sequence. Steps reveal sequentially on scroll with icons, titles, and 2-3 line descriptions. More engaging than static steps.
- **D-09:** Add-on modules section (PROD-04): KONVOI Camera Module + KONVOI Logbook presented as feature cards with descriptions.
- **D-10:** Installation section (PROD-05): "120-minute install promise" with step-by-step process. Video placeholder for install video.

### Use-Case Pages
- **D-11:** 7 individual DE+EN pages at locked slugs per UC-01. Each page structure: problem framing + cost anchor + Konvoi approach + incident video placeholder + CTA.
- **D-12:** Full-depth pages: 400-600 words DE+EN per use case. AI-generated draft copy using voice.md tone guidelines + current-site-overview.md data. User reviews and refines.
- **D-13:** Video placeholder per use case replaces the original SensorDataViz requirement (UC-03/UC-04). Component: `IncidentVideo.astro`.
- **D-14:** Cross-links to relevant industry verticals (UC-05) and back to Phase 6 case studies where applicable.

### Industry Verticals
- **D-15:** 4 DE+EN landings: high-value, cooling, intermodal, other (VERT-01).
- **D-16:** Each vertical hero frames the vertical's unique risk profile (VERT-02).
- **D-17:** Each vertical cross-links 2-3 relevant use cases (VERT-03) and ends with consult CTA (VERT-04).

### Content & Copy
- **D-18:** AI-generated production-quality draft copy for all pages (DE+EN). Source: voice.md guidelines + current-site-overview.md data + REQUIREMENTS.md acceptance criteria. User reviews post-build.
- **D-19:** Copy follows preventive-vs-reactive positioning per voice.md. No reactive/alert-based framing — Konvoi prevents, not alerts.

### Claude's Discretion
- Exact icon choices for use-case teaser cards
- Scroll animation library/approach for product page (CSS-only vs lightweight JS)
- Use-case page layout details beyond the required sections
- Industry vertical content depth (within the AI-generated copy approach)
- Whether to use `useCase` and `industry` content collections for page data or hardcode in .astro files
- Navigation wiring approach (update `src/navigation.ts` + `routeMap.ts`)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Requirements
- `.planning/REQUIREMENTS.md` — HOME-01..08, PROD-01..05, UC-01..05, VERT-01..04 (22 requirements)

### Brand & Voice
- `src/data/brand/canonical.yaml` — Legal entity, address, phone, emails, tier prices
- `src/data/brand/voice.md` — Approved vs banned verbs for preventive positioning

### Current Site Content (copy source)
- `.planning/current-site-overview.md` — Structured snapshot of live Jimdo site (2026-04-20): all sections, testimonials, use-case copy, team roster, contact details

### Prior Phase Decisions
- `.planning/phases/02-brand-design-system/02-CONTEXT.md` — HSL colour tokens, font system, logo assets
- `.planning/phases/03-i18n-content-collections/03-CONTEXT.md` — i18n routing, routeMap.ts, content collection schemas

### i18n Infrastructure
- `src/i18n/routeMap.ts` — Route mapping (needs Phase 4 route additions)
- `src/i18n/translations.ts` — UI string translations (needs Phase 4 string additions)
- `src/content.config.ts` — Content collection schemas (useCase, industry already registered)

### Existing Components
- `src/components/widgets/Hero.astro` — Hero component (reusable/adaptable)
- `src/components/widgets/Brands.astro` — Logo wall component
- `src/components/widgets/Testimonials.astro` — Testimonial component
- `src/components/widgets/CallToAction.astro` — CTA component
- `src/components/widgets/Features.astro` — Feature cards
- `src/components/widgets/Steps.astro` — Step-by-step flow

### Dashboard Reference (video source)
- External: `c:\Users\Rami\Desktop\konvoi-dashboard\app\(dashboard)\incidents-view\[...id]\page.tsx` — Dashboard incident viewer; user will record staged incidents from here

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Hero.astro`, `Hero2.astro` — Hero components with CTA support; adaptable for background video
- `Brands.astro` — Logo wall with grid layout; ready for customer/press/partner logos
- `Testimonials.astro` — Testimonial carousel/grid; can source from caseStudy collection
- `CallToAction.astro` — CTA block with heading + button; reusable for end-of-page CTAs
- `Features.astro`, `Features2.astro`, `Features3.astro` — Feature display variants; usable for use-case cards
- `Steps.astro`, `Steps2.astro` — Step-by-step display; basis for Detection→Classification→Measures flow
- `Content.astro` — Content section with image + text; usable for product page sections
- `CaseStudyCard.astro` — Already built in Phase 6; homepage testimonials can reference case studies

### Established Patterns
- Tailwind v4 CSS-first config with `@theme` tokens
- Astro component composition via `WidgetWrapper.astro` for consistent spacing
- `src/content/useCase/de/` + `en/` and `src/content/industry/de/` + `en/` directories scaffolded
- i18n: DE pages at `src/pages/*.astro`, EN at `src/pages/en/*.astro`

### Integration Points
- `src/navigation.ts` — Add Phase 4 nav items (Product, Use Cases, Verticals)
- `src/i18n/routeMap.ts` — Add all Phase 4 DE↔EN route pairs
- `src/i18n/translations.ts` — Add Phase 4 UI strings
- `src/pages/index.astro` — Homepage (exists, needs full rebuild)
- `src/pages/en/` — EN page directory (exists from Phase 6)
- Phase 6 pages exist and have working routes — cross-links must point to real URLs

</code_context>

<specifics>
## Specific Ideas

- Homepage hero uses a real background video the user already has — build component to accept video source
- Trailer sensor visual is scroll-driven callouts on 3D rendered images — user will provide render assets, use placeholders initially
- Use-case videos come from the real Next.js dashboard showing staged incident replays — much more credible than synthetic widgets
- Detection→Classification→Measures uses scroll-triggered animation, not static steps
- Phase 6 pages already live (case studies, blog, team, careers, contact) — cross-links from homepage/use-cases should point to real pages

</specifics>

<deferred>
## Deferred Ideas

- **True 3D interactive trailer model (Three.js)** — Could upgrade the scroll-callout approach to a full 3D .glb model with rotation. Deferred for post-v1 enhancement.
- **Dashboard embedding** — User has a full incident replay dashboard in Next.js. Could potentially embed a simplified version as an iframe or micro-frontend in a future phase. Not in scope for Phase 4.

</deferred>

---

*Phase: 04-core-marketing-pages*
*Context gathered: 2026-04-24*
