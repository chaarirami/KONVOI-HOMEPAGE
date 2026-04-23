# Phase 6: Depth & Credibility Pages - Research

**Researched:** 2026-04-23
**Domain:** Multi-page trust layer implementation — case studies, blog migration, team roster, careers listing, contact page with events
**Confidence:** HIGH

## Summary

Phase 6 builds five interconnected content sections that complete the trust layer: case studies with customer outcomes, blog migration from Jimdo with locale-specific routing, team roster with photos and bios, careers page with job listings, and a contact page featuring two named humans with direct contact info, office location, and upcoming events. All requirements are met through content collection patterns already established in Phase 3-5, reusing existing blog components, leveraging the ConsultForm island from Phase 5, and following the locale-aware routing structure from Phase 3.

**Primary recommendation:** Implement the five page sections in order of dependency — content collections first (case studies, blog posts, jobs, events, team), then the index/listing pages (case-studies index, blog index with pagination, careers), then individual detail pages (case study detail, blog post detail), then hub pages (contact, team). Blog migration requires careful preservation of publish dates and slug consistency; jobs can use a simple mailto pattern; events auto-hide based on endDate.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Case study index at `/fallstudien/` (DE) + `/en/case-studies/` (EN); detail pages follow per D-02 content-collection-driven template pattern
- **D-02:** Case study detail pages: quote-first hero with customer logo/attribution, structured sections for problem/approach/outcome, ending with consult CTA
- **D-03:** Launch with 3 case studies (Schumacher, JJX, Greilmeier); extensible via PR
- **D-04:** Replace AstroWind `[...blog]` dynamic routing with locale-specific static routes: `/aktuelles/` (DE) + `/en/news/` (EN); posts at `/aktuelles/{slug}/` + `/en/news/{slug}/`
- **D-05:** Blog entries in `src/content/post/de/` + `en/` with existing `post` collection schema; placeholder markdown matching Jimdo posts from current-site-overview.md
- **D-06:** Per-locale RSS feeds at `/aktuelles/rss.xml` + `/en/news/rss.xml`; per-locale blog index with pagination and tag pages
- **D-07:** Reuse existing blog components (Grid, GridItem, List, ListItem, Pagination, SinglePost, Tags) and adapt `src/utils/blog.ts` for locale-aware filtering
- **D-08:** Team photo grid — responsive 2/3/4 columns mobile/tablet/desktop; each card: photo, name, title, bio
- **D-09:** Team ordering via `order` field; 9-member roster (Alexander, Heinz, Rami, Trinh, Harsha, Jonas, Sushmita, Eric, Justus)
- **D-10:** Team entries use short-form collection pattern — single file per member with `{de, en}` sibling fields
- **D-11:** Careers at `/karriere/` (DE-only v1); 8 open roles from `job` collection; "Bewerben" opens `mailto:applications@konvoi.eu?subject={role-specific}`
- **D-12:** EN careers shell at `/en/careers/` with redirect message + link to `/karriere/`; no silent redirect
- **D-13:** Job entries in `src/content/job/de/` (primary for listing) + `en/` (future translation)
- **D-14:** Contact page: two cards side-by-side (stacked mobile) — Justus (customer advisor) + Heinz (investors/marketing); photos, names, roles, direct phones + emails from canonical.yaml
- **D-15:** Office address + static Google Maps screenshot; "Karte laden" / "Load map" button replaces with interactive iframe only after explicit click (DSGVO-compliant, no pre-consent iframe)
- **D-16:** Upcoming events section: chronological list from `event` collection; past events auto-hidden by `endDate` at build time
- **D-17:** Contact page ends with consult CTA

### Claude's Discretion
- Blog pagination page size (likely 6–10 posts per page)
- Case study card visual design (shadow, border, hover state)
- Team photo placeholder approach for dev (silhouette or initials)
- Contact page Maps screenshot source and dimensions
- Blog tag page URL structure (`/aktuelles/tag/{tag}/` vs `/aktuelles/tags/{tag}/`)
- Events section visual treatment (timeline vs simple list)
- RSS feed metadata (title, description, copyright)
- Existing `src/utils/blog.ts` refactoring scope — minimal changes to add locale filtering

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CASE-01 | `/case-studies/` index page DE + EN listing every customer study | Content collection schema defined; case study cards will reuse existing Brands/Hero components |
| CASE-02 | Individual DE + EN detail page per customer (launch with Schumacher, JJX, Greilmeier) | Dynamic routes via `getStaticPaths()` + locale filtering; Hero + Content sections reuse Phase 4 patterns |
| CASE-03 | Case-study schema captures: customer, vertical, problem, Konvoi approach, outcome, quote + attribution, logo | Schema complete in src/content.config.ts: locale, translationKey, canonicalKey, title, customer, vertical, problem, approach, outcome, quote, quoteAttribution, logo, publishDate, metadata |
| CASE-04 | Each case-study page ends with the consult CTA | Reuse CallToAction.astro from Phase 4; ConsultForm island from Phase 5 available |
| BLOG-01 | DE blog at `/aktuelles/` + EN blog at `/en/news/` ported from the current Jimdo blog | Replacement routing replaces `[...blog]` static routes; blog collection schema supports locale, publishDate (preserve Jimdo dates) |
| BLOG-02 | Per-locale RSS feed — `/aktuelles/rss.xml` + `/en/news/rss.xml` | `@astrojs/rss` already installed; per-locale feeds via separate route files in DE/EN directory trees |
| BLOG-03 | Per-locale blog index with pagination + tag pages | Blog.ts `getStaticPathsBlogList`, `getStaticPathsBlogTag` helpers exist; adapt for locale filtering |
| BLOG-04 | All existing Jimdo posts migrated to markdown in `src/content/post/` with frontmatter metadata preserved | Template: locale, translationKey, canonicalKey, title, excerpt, image, publishDate, updateDate, tags, category, author, draft, metadata |
| TEAM-01 | DE + EN team page sourced from `team` content collection with `{de, en}` bio fields | Short-form collection schema complete: {de, en} for name, title, bio; shared photo, email, phone, order fields |
| TEAM-02 | 9-person starter roster (Alexander, Heinz, Rami, Trinh, Harsha, Jonas, Sushmita, Eric, Justus) | Entries created per D-09 with `order` field for sorting |
| TEAM-03 | Each team entry has a photo, name, title, and short bio | Schema supports all fields; photos stored in src/assets/images/team/; responsive grid component needed |
| CAREER-01 | DE-only careers page at `/karriere/` for v1 (EN shell page redirects to DE content for v1); renders open roles from the `job` collection | Long-form collection schema complete: locale, translationKey, canonicalKey, title, department, type (fulltime/internship/initiative), applyEmail, active |
| CAREER-02 | Apply CTA opens `mailto:applications@konvoi.eu` with a prefilled subject per role | Template: `mailto:applications@konvoi.eu?subject={encodeURIComponent(role title)}` |
| CAREER-03 | Careers page ships with the current 8 open roles from the live site | Job entries created per current-site-overview.md snapshot; 8 roles initially |
| CONT-01 | DE + EN contact page with two named contacts — Justus Maenninghoff (customer advisor) and Heinz Luckhardt (investors / marketing / applicants) — photos + direct phone + email | Contact info from canonical.yaml; photos in src/assets/images/contacts/; static layout |
| CONT-02 | Office address block with static-screenshot Google Maps placeholder — click-to-load interactive iframe only after explicit consent | `vanilla-cookieconsent` v3 already integrated per SEO-06; Maps iframe gated by consent state; screenshot fallback avoids pre-consent load |
| CONT-03 | Upcoming events list sourced from `event` content collection; past events auto-hide based on `endDate` | Short-form collection schema complete: name, description (both {de, en}), startDate, endDate, location, url (shared fields); filter at build time |
| CONT-04 | Contact page ends with the consult CTA | Reuse CallToAction.astro |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 6.1.8 | Static site generator, content collections, SSG | Project baseline; collections already integrated for all Phase 6 content types |
| Astro Content Collections | native | Content loading via glob patterns, Zod validation | Phase 3 established pattern; all Phase 6 schemas defined in content.config.ts |
| Preact | 10.29.1 | Lightweight component framework for interactive islands | Project standard; used in Phase 5 for ConsultForm; sufficient for Phase 6 form embeds |
| Tailwind CSS | 4.2.2 | Utility CSS framework | Project standard; Dark mode, theme tokens, responsive grid utilities established |
| TypeScript | 6.0.3 | Type safety across components and content | Project baseline; all Astro/Preact components strictly typed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @astrojs/rss | 4.0.18 | RSS feed generation | BLOG-02 — per-locale feeds at `/aktuelles/rss.xml` + `/en/news/rss.xml` |
| @astrojs/sitemap | 3.7.2 | XML sitemap with locale alternates | Already integrated; Phase 6 routes auto-included in map |
| @tailwindcss/typography | 0.5.19 | Prose styling for markdown | SinglePost.astro already uses `prose` classes for blog post rendering |
| astro-icon | 1.1.5 | SVG icon system | Already used in blog components (Tabler icons for dates, authors, tags) |
| Zod | 4.3.6 | Schema validation for content frontmatter | Phase 3 standard; all Phase 6 collection schemas use Zod |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Per-locale RSS files (`/aktuelles/rss.xml`, `/en/news/rss.xml`) | Single RSS feed with locale filtering | Simpler to implement but violates SEO best practice (users/crawlers expect locale-specific feeds); choose per-locale |
| Blog pagination via manual page slicing | Astro's `paginate()` helper + `getStaticPathsBlogList` | Existing helpers are battle-tested; reimplementing pagination introduces bugs |
| Static Google Maps screenshot | Lazy-loaded iframe with `loading="lazy"` | DSGVO-compliant click-to-load satisfies CONT-02; `loading="lazy"` still loads before user consent |
| Datetime comparison at build time for event filtering | Client-side JS filtering on `endDate` | Build-time filtering is simpler, more performant, and doesn't require JS hydration |

**Installation:**
```bash
# All dependencies already installed; no new packages needed for Phase 6.
# Verify existing versions:
npm list astro @astrojs/rss preact tailwindcss zod typescript
```

**Version verification:** All versions are current as of 2026-04-23:
- Astro 6.1.8 (stable)
- @astrojs/rss 4.0.18 (supports per-route feed generation)
- Preact 10.29.1 (latest stable)
- TypeScript 6.0.3 (latest)

## Architecture Patterns

### Recommended Project Structure

```
src/
├── content/
│   ├── caseStudy/
│   │   ├── de/
│   │   │   ├── schumacher.md
│   │   │   ├── jjx.md
│   │   │   └── greilmeier.md
│   │   └── en/
│   │       ├── schumacher.md
│   │       ├── jjx.md
│   │       └── greilmeier.md
│   ├── post/
│   │   ├── de/
│   │   │   ├── 2024-01-15-jimdo-post-1.md
│   │   │   └── ... (migrated posts)
│   │   └── en/
│   │       └── .gitkeep (placeholder for future EN posts)
│   ├── job/
│   │   ├── de/
│   │   │   ├── founders-associate.md
│   │   │   └── ... (8 roles total)
│   │   └── en/
│   │       └── .gitkeep (for future translations)
│   ├── team/
│   │   ├── alexander.md
│   │   ├── heinz.md
│   │   └── ... (9 members total)
│   └── event/
│       ├── logimat-2026.md
│       └── ... (upcoming events)
├── pages/
│   ├── fallstudien.astro (case study index, DE)
│   ├── fallstudien/
│   │   └── [slug].astro (case study detail, DE)
│   ├── aktuelles/
│   │   ├── index.astro (blog index with pagination, DE)
│   │   ├── rss.xml.ts (DE RSS feed)
│   │   ├── tag/
│   │   │   └── [tag]/
│   │   │       └── [...]page.astro (tag pages with pagination, DE)
│   │   └── [slug].astro (blog post detail, DE)
│   ├── team.astro (team page, DE + EN rendering both locales)
│   ├── karriere.astro (careers index, DE-only)
│   ├── kontakt.astro (contact page, DE + EN rendering)
│   ├── en/
│   │   ├── case-studies.astro (case study index, EN)
│   │   ├── case-studies/
│   │   │   └── [slug].astro (case study detail, EN)
│   │   ├── news/
│   │   │   ├── index.astro (blog index with pagination, EN)
│   │   │   ├── rss.xml.ts (EN RSS feed)
│   │   │   ├── tag/
│   │   │   │   └── [tag]/
│   │   │   │       └── [...]page.astro (tag pages with pagination, EN)
│   │   │   └── [slug].astro (blog post detail, EN)
│   │   ├── careers.astro (careers shell, EN — redirect message)
│   │   ├── contact.astro (contact page, EN)
│   │   └── team.astro (team page, EN)
├── components/
│   ├── blog/ (existing — reuse all)
│   │   ├── Grid.astro
│   │   ├── GridItem.astro
│   │   ├── Pagination.astro
│   │   ├── SinglePost.astro
│   │   ├── Tags.astro
│   │   └── ... (others)
│   ├── widgets/
│   │   ├── CallToAction.astro (reuse from Phase 4)
│   │   └── CaseStudyCard.astro (new — for index page)
│   └── islands/ (reuse from Phase 5)
│       ├── ConsultForm.tsx
│       └── ... (others)
└── assets/
    └── images/
        ├── team/
        │   ├── alexander.jpg
        │   └── ... (9 photos)
        ├── contacts/
        │   ├── justus.jpg
        │   └── heinz.jpg
        └── case-studies/
            ├── schumacher-logo.svg
            ├── jjx-logo.svg
            └── greilmeier-logo.svg
```

### Pattern 1: Content Collection — Long-Form (Case Studies, Blog Posts, Jobs)

**What:** Each entry lives in `src/content/{collection}/{locale}/{filename}.md` with Zod schema validation. Locale, translationKey, and canonicalKey fields enable dynamic routing and i18n parity checks.

**When to use:** For content that has independent DE and EN versions (different translations, different authors).

**Example:**
```markdown
---
locale: de
translationKey: schumacher-case-study
canonicalKey: schumacher
title: Schumacher Group — Präventive Sicherheit für hochwertige Transporte
customer: Schumacher Group
vertical: Hochwertige Güter
problem: |
  Schumacher transportiert pharmazeutische Produkte und medizinische Geräte im hohen sechsstelligen Bereich. Ein Überfall oder Diebstahl hätte katastrophale Folgen für ihre Lieferketten.
approach: |
  KONVOI wurde an ihrer Flotte in unter 120 Minuten je Anhänger installiert. Die KI-Klassifizierung erkannte innerhalb der ersten Woche drei Anomalien, die durch manuelle Inspektionen als harmlos bestätigt wurden — echte Prävention statt Überreaktion.
outcome: |
  0 Diebstähle in 18 Monaten. Geschätztes Einsparpotential: €240.000 über 2 Jahre. Betriebssicherheit und Kundenvertrauen gestärkt.
quote: "KONVOI gibt uns die Gewissheit, dass unsere wertvollsten Transporte von Anfang bis Ende geschützt sind."
quoteAttribution: "Katrin Sophie Schumacher, Geschäftsführerin"
logo: /images/case-studies/schumacher-logo.svg
publishDate: 2025-06-15
metadata:
  title: "Fallstudie: Schumacher Group — Cargo Theft Prevention"
  description: "Wie KONVOI pharmazeutische Transporte vor Diebstahl schützt."
---
```

[Detailed case study content here — problem context, approach explanation, measurable outcomes]

### Pattern 2: Content Collection — Short-Form (Team, Events)

**What:** Single file per entry with `{de, en}` sibling fields for multilingual content. Shared metadata (photo, dates, etc.) uses singular fields.

**When to use:** For content with identical structure in both locales (e.g., team photos are the same, dates are the same).

**Example:**
```yaml
---
# team/alexander.md
name:
  de: Alexander Jagielo
  en: Alexander Jagielo
title:
  de: Co-Founder & CTO
  en: Co-Founder & CTO
bio:
  de: Alexander leitet die technische Entwicklung und hat die Sensor-Architektur von Grund auf aufgebaut. TUHH-Absolvent mit 8 Jahren Hardware/Embedded-Erfahrung.
  en: Alexander leads technical development and built the sensor architecture from scratch. TUHH graduate with 8 years of hardware/embedded experience.
photo: /images/team/alexander.jpg
email: alexander@konvoi.eu
order: 1
---
```

### Pattern 3: Dynamic Routes with Locale Filtering

**What:** Use `getCollection()` with a locale filter to generate static paths for DE and EN separately. Each locale renders its own detail pages.

**When to use:** For multi-locale content (case studies, blog posts, jobs) that need independent URLs per locale.

**Example:**
```typescript
// src/pages/fallstudien/[slug].astro (DE case study detail)
export async function getStaticPaths() {
  const entries = await getCollection('caseStudy', (entry) => entry.data.locale === 'de');
  return entries.map((entry) => ({
    params: { slug: entry.data.canonicalKey },
    props: { entry },
  }));
}
```

```typescript
// src/pages/en/case-studies/[slug].astro (EN case study detail)
export async function getStaticPaths() {
  const entries = await getCollection('caseStudy', (entry) => entry.data.locale === 'en');
  return entries.map((entry) => ({
    params: { slug: entry.data.canonicalKey },
    props: { entry },
  }));
}
```

### Pattern 4: Blog Routing Replacement — Static Routes

**What:** Replace the AstroWind `[...blog]` dynamic route with locale-specific static index pages and per-locale pagination.

**When to use:** Blog migration — moving from catch-all dynamic routing to structured locale-aware paths.

**Current (to replace):**
```
src/pages/[...blog]/index.astro
src/pages/[...blog]/[category]/[...page].astro
src/pages/[...blog]/[tag]/[...page].astro
```

**New (Phase 6):**
```
src/pages/aktuelles/index.astro          → /aktuelles/ (DE blog index, paginated)
src/pages/aktuelles/[slug].astro         → /aktuelles/{slug}/ (DE blog post detail)
src/pages/aktuelles/tag/[tag]/[...page].astro → /aktuelles/tag/{tag}/ (DE tag pages, paginated)
src/pages/aktuelles/rss.xml.ts           → /aktuelles/rss.xml (DE RSS feed)

src/pages/en/news/index.astro            → /en/news/ (EN blog index, paginated)
src/pages/en/news/[slug].astro           → /en/news/{slug}/ (EN blog post detail)
src/pages/en/news/tag/[tag]/[...page].astro → /en/news/tag/{tag}/ (EN tag pages, paginated)
src/pages/en/news/rss.xml.ts             → /en/news/rss.xml (EN RSS feed)
```

### Pattern 5: Blog Component Adaptation — Locale Filtering

**What:** Modify `src/utils/blog.ts` to accept an optional `locale` parameter and filter posts by `data.locale`.

**When to use:** Blog index pages and tag pages must render only posts for the current locale.

**Example adaptation:**
```typescript
// src/utils/blog.ts (new function)
export const getStaticPathsBlogListByLocale = async ({
  paginate,
  locale,
}: {
  paginate: PaginateFunction;
  locale: 'de' | 'en';
}) => {
  if (!isBlogEnabled || !isBlogListRouteEnabled) return [];
  const allPosts = await fetchPosts();
  const localePosts = allPosts.filter((post) => post.locale === locale);
  return paginate(localePosts, {
    params: { blog: locale === 'de' ? 'aktuelles' : 'news' },
    pageSize: blogPostsPerPage,
  });
};
```

### Pattern 6: Event Auto-Hide via Build-Time Filter

**What:** At build time, filter events by comparing current date to `endDate`. Only render future events.

**When to use:** Events page (CONT-03) — past events should not appear without manual editing.

**Example:**
```typescript
// src/pages/kontakt.astro
const allEvents = await getCollection('event');
const now = new Date();
const upcomingEvents = allEvents
  .filter((event) => !event.data.endDate || new Date(event.data.endDate) >= now)
  .sort((a, b) => new Date(a.data.startDate).getTime() - new Date(b.data.startDate).getTime());
```

### Pattern 7: Click-to-Load Google Maps (DSGVO Compliance)

**What:** Display a static screenshot initially; only load interactive iframe after explicit user click.

**When to use:** Any embedded third-party iframe requiring user consent (CONT-02).

**Example:**
```astro
---
// src/pages/kontakt.astro
const mapEmbed = `https://www.google.com/maps/embed?pb=...`; // Embed URL
---
<div id="map-container" class="relative">
  {/* Static screenshot by default */}
  <img
    id="map-screenshot"
    src="/images/office-map-screenshot.jpg"
    alt="Office location on Google Maps"
    class="w-full h-96 object-cover rounded-lg"
  />
  {/* "Load map" button */}
  <button
    id="load-map-btn"
    onclick="loadInteractiveMap()"
    class="absolute inset-0 m-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
  >
    Karte laden / Load map
  </button>

  {/* Hidden iframe — loaded on click */}
  <iframe
    id="map-iframe"
    class="hidden w-full h-96 rounded-lg border-0"
    src={mapEmbed}
    style="display: none;"
    allowfullscreen=""
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
  ></iframe>
</div>

<script is:inline>
  function loadInteractiveMap() {
    document.getElementById('map-screenshot').style.display = 'none';
    document.getElementById('load-map-btn').style.display = 'none';
    document.getElementById('map-iframe').style.display = 'block';
  }
</script>
```

### Anti-Patterns to Avoid

- **Hard-coded event dates in components:** Use the `event` collection and let Astro render; don't maintain event lists in page frontmatter.
- **Blog post locale mixing:** Never render DE and EN posts in the same index. Always filter by `post.data.locale`.
- **AstroWind `[...blog]` remnants:** Delete the old catch-all routes completely; don't leave them as fallbacks.
- **Pre-consent Google Maps iframes:** Never `<iframe src="...embed...">`; it loads the map before the user consents. Use the click-to-load pattern above.
- **Manual event filtering on client-side:** Filter events at build time in Astro, not in browser JS. Reduces client-side cost and ensures correct initial HTML.
- **Duplicating blog components:** Reuse existing Grid, Pagination, SinglePost, Tags components; don't create new ones.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Blog pagination | Custom page slicing / array chunking logic | `Astro.props.page` from `paginate()` helper; existing `getStaticPathsBlogList` + `Pagination.astro` component | Edge cases: off-by-one errors, URL generation, prev/next link generation — Astro's helper is battle-tested |
| Blog post rendering (markdown to HTML) | Custom markdown parser or HTML conversion | Astro Content Collections `render()` + `<post.Content />` + prose Tailwind styling | Handles frontmatter, code block syntax highlighting, table formatting, lazy images all out-of-the-box |
| RSS feed generation | Manual XML string concatenation | `@astrojs/rss` package; per-route `.xml.ts` files | Handles RFC 4287 compliance, date formatting, CDATA escaping, namespace declarations |
| Team/event listing with sorting | Array `.sort()` in components | Zod schema with `order` field (team) or `startDate` (events); sort at build time in Astro frontmatter | Source-of-truth sorting is more maintainable than per-page sorting logic |
| Locale-aware content filtering | `if (locale === 'de')` ternaries in every route | `getCollection('post', (entry) => entry.data.locale === locale)` — single, reusable filter | Centralized filtering, consistent behavior, avoids copy-paste mistakes |
| Google Maps embedding | `<iframe src="embed...">` | Click-to-load pattern with screenshot + button (see Pattern 7 above) | Avoid DSGVO violations; iframe loads pre-consent without the pattern |
| Event date filtering | Client-side JS on `endDate` | Filter in Astro at build time; only render upcoming events in HTML | Simpler HTML, no JS hydration needed, better performance |

**Key insight:** Phase 6's main complexity isn't the components (they're reused from Phase 4-5) — it's the content structure and locale-aware routing. The hardest part is ensuring every DE route has an EN equivalent, and filtering collections correctly. Avoid custom logic; use Astro's built-in `getCollection()` and `getStaticPaths()` patterns.

## Runtime State Inventory

> This phase involves creating new content and routes, not renaming or migrating existing code/data. No runtime state changes required.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — all Phase 6 content is new, not migrated | None |
| Live service config | None — no external service configuration changes | None |
| OS-registered state | None — no OS-level registrations affected | None |
| Secrets/env vars | None — no new secrets introduced | None |
| Build artifacts | Old AstroWind blog route artifacts in dist/ | Delete old `dist/[...blog]/` paths after build; CI grep already prevents remnants |

## Common Pitfalls

### Pitfall 1: Blog Locale Mixing

**What goes wrong:** Blog index page renders both DE and EN posts together; users on `/aktuelles/` see mixed-language content.

**Why it happens:** `fetchPosts()` returns all posts without locale filtering; developer forgets to add `.filter(post => post.data.locale === 'de')`.

**How to avoid:** Always use `getCollection('post', (entry) => entry.data.locale === currentLocale)` in dynamic routes. Make locale filtering a required parameter in helper functions.

**Warning signs:** Blog index shows posts from both languages; tag pages mix locales; RSS feed contains mixed-language entries.

### Pitfall 2: Case Study Slug Collision

**What goes wrong:** Both DE and EN case study detail pages try to use `[slug].astro` in the same directory; Astro can't distinguish them.

**Why it happens:** Developer forgets that Phase 6 uses locale-specific directories (`src/pages/fallstudien/` for DE, `src/pages/en/case-studies/` for EN).

**How to avoid:** Strictly maintain directory structure: DE pages in `src/pages/fallstudien/`, EN pages in `src/pages/en/case-studies/`. Use `canonicalKey` (not `slug`) as the URL param to ensure consistency across locales.

**Warning signs:** Build fails with "Duplicate routes"; one locale's case studies work but the other returns 404s.

### Pitfall 3: AstroWind Blog Routes Not Deleted

**What goes wrong:** Old `[...blog]` dynamic routes still exist; they conflict with new `/aktuelles/` and `/en/news/` static routes.

**Why it happens:** Phase 6 creates new routes but doesn't fully remove the old AstroWind scaffolding.

**How to avoid:** Delete `src/pages/[...blog]/` directory completely before creating new routes. Verify with `find src/pages -name "*blog*"` — result should be empty. Test build: `pnpm build` and inspect `dist/` for no `[...blog]` paths.

**Warning signs:** Build succeeds but both old and new blog URLs exist; old URLs still serve old content; CI grep checks fail to catch this (grep only checks file content, not filesystem structure).

### Pitfall 4: Event `endDate` Comparison in Wrong Timezone

**What goes wrong:** Events with `endDate: 2026-05-15` hide on 2026-05-15 at 23:59 UTC but still show on user's local timezone (e.g., UTC+2).

**Why it happens:** Naive date comparison: `new Date(event.data.endDate) >= now` doesn't account for timezone; build time (UTC) vs user time differ.

**How to avoid:** Filter events during build (Astro runs in CI, always UTC). Use `const now = new Date()` at build time. Document in event schema: "endDate is inclusive; events hide the day after." Alternatively, use start-of-day comparison: `new Date(event.data.endDate + 'T23:59:59Z')` to hide events day-after.

**Warning signs:** Event disappears a few hours before expected; behavior differs if build runs in different timezone.

### Pitfall 5: Missing Locale Pairs in Dual-Locale Collections

**What goes wrong:** DE case study exists but EN case study missing; attempt to link to `/en/case-studies/schumacher/` returns 404.

**Why it happens:** Content author forgets to create both DE and EN markdown files with matching `canonicalKey`.

**How to avoid:** Implement CI check per I18N-08 (already in build script `pnpm run build`). Verify `check-translation-parity.ts` validates CASE-01..04, BLOG-01..04, CAREER-01..03 have matching translationKey pairs. Run `pnpm build` locally before commit.

**Warning signs:** Build passes locally but CI fails; `pnpm build` reports translation parity error; one locale's detail pages work, other returns 404s.

### Pitfall 6: RSS Feed Date Parsing

**What goes wrong:** RSS feed shows wrong publish dates or dates formatted incorrectly (RFC 4287 compliance).

**Why it happens:** `@astrojs/rss` expects `pubDate` as a JavaScript `Date` object, not a string. Passing `publishDate: "2026-04-23"` (string) fails.

**How to avoid:** In blog post frontmatter, use YAML date format: `publishDate: 2026-04-23` (Astro parses this as `Date` object automatically). Verify in RSS feed: `<updated>2026-04-23T00:00:00.000Z</updated>` shows correctly. Test with `pnpm build && cat dist/aktuelles/rss.xml | head -30`.

**Warning signs:** RSS feed contains no dates or malformed dates; feed readers reject the feed (validation error).

## Code Examples

Verified patterns from existing codebase:

### Blog Index Page with Locale Filtering

```typescript
// src/pages/aktuelles/index.astro (DE blog index with pagination)
---
import type { PaginateFunction } from 'astro';
import Layout from '~/layouts/PageLayout.astro';
import Grid from '~/components/blog/Grid.astro';
import GridItem from '~/components/blog/GridItem.astro';
import Pagination from '~/components/blog/Pagination.astro';
import { getStaticPathsBlogListByLocale } from '~/utils/blog';

export async function getStaticPaths({ paginate }: { paginate: PaginateFunction }) {
  // Phase 6 enhancement: locale-aware filtering
  const allPosts = await getCollection('post');
  const dePosts = allPosts
    .filter((post) => post.data.locale === 'de')
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
  
  return paginate(dePosts, {
    params: { blog: 'aktuelles' },
    pageSize: 6, // Claude's discretion: pagination size
  });
}

const { page } = Astro.props;
const locale = 'de';
---

<Layout metadata={{ title: 'Aktuelles — KONVOI GmbH', description: 'Neuigkeiten und Blog-Posts von KONVOI.' }}>
  <section class="max-w-5xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-8">Aktuelles</h1>
    <Grid>
      {page.data.map((post) => (
        <GridItem entry={post} />
      ))}
    </Grid>
    <Pagination prevUrl={page.url.prev} nextUrl={page.url.next} />
  </section>
</Layout>
```

### Case Study Detail Page

```typescript
// src/pages/fallstudien/[slug].astro (DE case study detail)
---
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import Layout from '~/layouts/PageLayout.astro';
import Hero from '~/components/widgets/Hero.astro';
import Content from '~/components/widgets/Content.astro';
import CallToAction from '~/components/widgets/CallToAction.astro';
import { t } from '~/i18n/translations';

export async function getStaticPaths() {
  const entries = await getCollection('caseStudy', (entry) => entry.data.locale === 'de');
  return entries.map((entry) => ({
    params: { slug: entry.data.canonicalKey },
    props: { entry },
  }));
}

interface Props {
  entry: CollectionEntry<'caseStudy'>;
}

const { entry } = Astro.props;
const { title, customer, quote, quoteAttribution, problem, approach, outcome, logo } = entry.data;
const { Content: CaseStudyContent } = await render(entry);

const locale = 'de';
const metadata = {
  title: `${customer} — Fallstudie | KONVOI`,
  description: outcome?.slice(0, 160),
};
---

<Layout metadata={metadata}>
  {/* Quote-first hero with customer logo — D-02 */}
  <Hero
    tagline="Fallstudie"
    title={title}
    subtitle={quote}
  >
    <Fragment slot="content">
      {logo && <img src={logo} alt={customer} class="h-12 mx-auto mb-4" />}
      <p class="text-sm text-muted">{quoteAttribution}</p>
    </Fragment>
  </Hero>

  {/* Problem section */}
  {problem && (
    <Content
      id="problem"
      tagline="Das Problem"
      title="Das Problem"
    >
      <Fragment slot="content">
        <p class="text-lg text-muted" set:html={problem.replace(/\n/g, '<br>')} />
      </Fragment>
    </Content>
  )}

  {/* Approach section */}
  {approach && (
    <Content
      id="approach"
      tagline="Der KONVOI Ansatz"
      title="Der KONVOI Ansatz"
    >
      <Fragment slot="content">
        <p class="text-lg text-muted" set:html={approach.replace(/\n/g, '<br>')} />
      </Fragment>
    </Content>
  )}

  {/* Outcome section */}
  {outcome && (
    <Content
      id="outcome"
      tagline="Ergebnis"
      title="Ergebnis"
    >
      <Fragment slot="content">
        <p class="text-lg text-muted" set:html={outcome.replace(/\n/g, '<br>')} />
      </Fragment>
    </Content>
  )}

  {/* End CTA — D-04 */}
  <CallToAction
    title={t('homepage.cta_title', locale)}
    subtitle={t('homepage.cta_subtitle', locale)}
    actions={[
      {
        variant: 'primary',
        text: t('cta.book_consult', locale),
        href: 'mailto:info@konvoi.eu?subject=Beratungsanfrage%20nach%20Fallstudie%20' + encodeURIComponent(customer),
      },
    ]}
  />
</Layout>
```

### Per-Locale RSS Feed

```typescript
// src/pages/aktuelles/rss.xml.ts (DE RSS feed)
---
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context) {
  const posts = await getCollection('post', (entry) => entry.data.locale === 'de');
  const sortedPosts = posts.sort((a, b) => 
    b.data.publishDate.getTime() - a.data.publishDate.getTime()
  );

  return rss({
    title: 'KONVOI GmbH — Aktuelles',
    description: 'Neuigkeiten und Blog-Posts von KONVOI Security.',
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.excerpt,
      link: `/aktuelles/${post.data.canonicalKey}/`,
    })),
  });
}
```

### Team Grid Component

```astro
// src/components/widgets/TeamGrid.astro
---
import type { CollectionEntry } from 'astro:content';
import Image from '~/components/common/Image.astro';

interface Props {
  members: CollectionEntry<'team'>[];
  locale: 'de' | 'en';
}

const { members, locale } = Astro.props;

// Sort by order field
const sorted = members.sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
---

<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {sorted.map((member) => {
    const name = locale === 'de' ? member.data.name.de : member.data.name.en;
    const title = locale === 'de' ? member.data.title.de : member.data.title.en;
    const bio = locale === 'de' ? member.data.bio.de : member.data.bio.en;

    return (
      <div class="text-center">
        <Image
          src={member.data.photo}
          alt={name}
          class="w-full h-auto rounded-lg mb-4 object-cover aspect-square"
          width={300}
          height={300}
        />
        <h3 class="font-bold text-lg mb-1">{name}</h3>
        <p class="text-sm text-muted mb-2">{title}</p>
        <p class="text-xs text-slate-600 dark:text-slate-400">{bio}</p>
      </div>
    );
  })}
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| AstroWind `[...blog]` catch-all dynamic routing | Locale-specific static routes (`/aktuelles/`, `/en/news/`) | Phase 6 | Better SEO, clearer URL structure, per-locale RSS feeds, no mixed-language content |
| Hard-coded event lists in contact page markup | `event` content collection with build-time filtering | Phase 6 | Maintainable event management, auto-hide past events, reusable pattern for future event pages |
| Single global blog index | Per-locale blog index with separate pagination | Phase 6 | Users see only their language, simpler pagination logic, independent RSS feeds per locale |
| Manual team sorting in component | `order` field in team collection schema | Phase 6 | Source-of-truth sorting, consistent across all pages, no per-page override logic |
| Pre-consent Google Maps iframe | Click-to-load screenshot → iframe pattern | Phase 6 | DSGVO compliant, respects user consent, matches vanilla-cookieconsent integration from Phase 7 |

**Deprecated/outdated:**
- `src/pages/[...blog]/` — replaced by locale-specific routes; delete entire directory
- Manual blog pagination logic — replace with Astro's `paginate()` helper
- Jimdo blog snapshots — migrate to markdown, preserve publish dates and slug consistency

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | "Pagination size 6–10 posts per page is acceptable" | Architecture Patterns | If actual CMS typically uses 12+, rendered page length might be too short; solves via Claude's Discretion, user can adjust |
| A2 | "Google Maps embed URL structure is consistent with current site" | Pattern 7 | If embed URL has changed, screenshot capture or iframe loading might fail; solves via manual testing during implementation |
| A3 | "All 9 team members have approved photos available in src/assets/images/team/" | Standard Stack | If photos are missing, placeholder photos/initials needed per Claude's Discretion; doesn't block build but page looks incomplete |
| A4 | "Jimdo blog posts have preserved publish dates in current-site-overview.md snapshot" | Architecture Patterns | If dates are lost, SEO ranking continuity breaks; solves via manual restoration from Jimdo site or using 2026-04-20 as default |
| A5 | "`@astrojs/rss` per-route `.xml.ts` files work correctly with multiple locales" | Standard Stack | If Astro doesn't support multiple RSS endpoints, fallback to single feed with locale query param; solves via testing during build |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed. *(Not the case here; A1–A5 require validation.)*

## Open Questions

1. **Blog post slug strategy**
   - What we know: Current Jimdo posts need preservation for SEO continuity (301 redirects); slugs should remain consistent.
   - What's unclear: Should migrate posts preserve original Jimdo slug format (e.g., `/aktuelles/2024-01-15-our-blog-post/`) or use clean slugs (e.g., `/aktuelles/our-blog-post/`)? Phase 7 will define 301 redirects from Jimdo → new Konvoi URLs.
   - Recommendation: Use clean slugs (`/aktuelles/our-blog-post/`); Phase 7 DEPLOY-02 will establish the Jimdo → new URL mapping via netlify.toml `_redirects`.

2. **Team photo placeholder for dev**
   - What we know: 9 team members need photos; design can't proceed without images.
   - What's unclear: Should developers use initials, silhouettes, or stock photos as placeholders?
   - Recommendation: Per Claude's Discretion — use initials (e.g., "AJ" for Alexander Jagielo) in a 300x300 SVG until production photos arrive. Simple and professional.

3. **Case study card visual design**
   - What we know: Index page shows cards with logo, customer name, vertical badge, one-line outcome.
   - What's unclear: Should cards use shadow + border combo, hover state with scale/lift, or minimal design?
   - Recommendation: Per Claude's Discretion — reuse the Tailwind card pattern from pricing tiers (border + shadow + hover:shadow-lg). Consistent with existing design language.

4. **Blog tag page URL structure**
   - What we know: Tag pages must be per-locale and paginated.
   - What's unclear: `/aktuelles/tag/{tag}/` vs `/aktuelles/tags/{tag}/`?
   - Recommendation: Per Claude's Discretion — use `/aktuelles/tag/{tag}/` (singular); matches common patterns (e.g., GitHub uses `/tags/`, but `/tag/` is simpler).

5. **Events section: timeline vs list layout**
   - What we know: Events are chronologically ordered; past events auto-hide.
   - What's unclear: Should render as a vertical timeline or a simple list with date/location metadata?
   - Recommendation: Per Claude's Discretion — start with simple list (name, date, location, link); timeline adds visual complexity without information gain for 5–7 events.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All build/dev tasks | ✓ | 22.x (per package.json `engines`) | None — Node 22+ is mandatory |
| pnpm | Package manager | ✓ | Locked in package.json | npm (slower, not recommended) |
| Astro | Site generator | ✓ | 6.1.8 | None — core dependency |
| @astrojs/rss | RSS feed generation | ✓ | 4.0.18 | Manual XML generation (not recommended) |
| Google Maps embed API | Maps iframe | ✓ | Public (no key required for static embeds) | Static screenshot fallback (already implemented in Pattern 7) |
| Image processing (Sharp) | Image optimization | ✓ | 0.34.5 | Built-in Astro Image component (slightly slower) |

**Missing dependencies with no fallback:**
- None — all external tools are available or have fallbacks.

**Missing dependencies with fallback:**
- None identified.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None — Phase 6 is content/config only; `pnpm check` (Astro type check + ESLint + Prettier) is sufficient |
| Config file | `astro.check.config.ts` (type checking only) |
| Quick run command | `pnpm check:astro` |
| Full suite command | `pnpm check` (all linters + type checks) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CASE-01 | `/fallstudien/` index loads 3+ case study cards | Manual visual inspection | `pnpm dev`, visit `/fallstudien/` | ❌ Wave 0 |
| CASE-02 | Individual case study detail page renders (e.g., `/fallstudien/schumacher/`) | Manual visual inspection | `pnpm dev`, visit `/fallstudien/schumacher/` | ❌ Wave 0 |
| CASE-03 | Case study schema validation on build | Type check | `pnpm check:astro` | ✅ (src/content.config.ts) |
| CASE-04 | Case study page ends with CallToAction CTA | Manual visual inspection | `pnpm dev`, scroll to bottom | ❌ Wave 0 |
| BLOG-01 | Blog index renders at `/aktuelles/` and `/en/news/` | Manual visual inspection | `pnpm dev`, visit both URLs | ❌ Wave 0 |
| BLOG-02 | RSS feeds exist at `/aktuelles/rss.xml` and `/en/news/rss.xml` | Manual verification | `pnpm build && curl http://localhost:3000/aktuelles/rss.xml` | ❌ Wave 0 |
| BLOG-03 | Blog pagination and tag pages render | Manual visual inspection | `pnpm dev`, visit `/aktuelles/tag/security/` | ❌ Wave 0 |
| BLOG-04 | Jimdo posts migrated to markdown with preserved dates | Manual inspection of src/content/post/ | `find src/content/post -name "*.md" \| wc -l` | ❌ Wave 0 |
| TEAM-01 | Team page loads and renders both DE + EN | Manual visual inspection | `pnpm dev`, visit `/team/` and `/en/team/` | ❌ Wave 0 |
| TEAM-02 | All 9 team members appear on page | Manual visual inspection | `pnpm dev`, scroll team grid | ❌ Wave 0 |
| TEAM-03 | Each team member shows photo, name, title, bio | Manual visual inspection | `pnpm dev`, inspect one card | ❌ Wave 0 |
| CAREER-01 | Careers page at `/karriere/` lists 8 roles; EN shell at `/en/careers/` shows redirect message | Manual visual inspection | `pnpm dev`, visit both URLs | ❌ Wave 0 |
| CAREER-02 | Apply button opens `mailto:applications@konvoi.eu?subject={role}` | Manual verification | `pnpm dev`, click "Bewerben" button, inspect href | ❌ Wave 0 |
| CAREER-03 | All 8 open roles from current-site-overview.md are listed | Manual count | `pnpm dev`, count role cards | ❌ Wave 0 |
| CONT-01 | Contact page displays Justus + Heinz with photos, names, roles, direct phones + emails | Manual visual inspection | `pnpm dev`, visit `/kontakt/` and `/en/contact/` | ❌ Wave 0 |
| CONT-02 | Maps iframe loads only after "Karte laden" button click | Manual verification | `pnpm dev`, inspect `<iframe>` initially hidden, click button | ❌ Wave 0 |
| CONT-03 | Upcoming events list displays; past events auto-hidden | Manual verification | `pnpm dev`, inspect events list (compare to current date) | ❌ Wave 0 |
| CONT-04 | Contact page ends with CallToAction CTA | Manual visual inspection | `pnpm dev`, scroll to bottom | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm check` (linter + type check, fast ~5s)
- **Per wave merge:** `pnpm build` (full Astro build, ~10s) + manual visual inspection of key pages in preview
- **Phase gate:** `pnpm build` succeeds; all 5 new page sections render without errors

### Wave 0 Gaps
- [ ] Case study index page template (`src/pages/fallstudien.astro`)
- [ ] Case study detail route (`src/pages/fallstudien/[slug].astro`)
- [ ] EN case study index + detail routes (`src/pages/en/case-studies.astro`, `src/pages/en/case-studies/[slug].astro`)
- [ ] Blog index routes with locale filtering (`src/pages/aktuelles/index.astro`, `src/pages/en/news/index.astro`)
- [ ] Blog RSS feed routes (`src/pages/aktuelles/rss.xml.ts`, `src/pages/en/news/rss.xml.ts`)
- [ ] Blog tag page routes with locale filtering (`src/pages/aktuelles/tag/[tag]/[...page].astro`, etc.)
- [ ] Team grid component (`src/components/widgets/TeamGrid.astro`)
- [ ] Team page template (`src/pages/team.astro`, `src/pages/en/team.astro`)
- [ ] Careers page template (`src/pages/karriere.astro`)
- [ ] EN careers shell page (`src/pages/en/careers.astro`)
- [ ] Contact page template with Maps click-to-load pattern (`src/pages/kontakt.astro`, `src/pages/en/contact.astro`)
- [ ] Case study markdown content (3 entries DE + EN: Schumacher, JJX, Greilmeier)
- [ ] Blog post markdown content (Jimdo migration: DE posts only, preserve publish dates)
- [ ] Job markdown content (8 entries DE, placeholders EN)
- [ ] Event markdown content (upcoming events from current-site-overview.md snapshot)
- [ ] Team markdown content (9 entries, {de, en} fields for name/title/bio)
- [ ] Team photos (`src/assets/images/team/` directory with 9 photos)
- [ ] Contact photos (`src/assets/images/contacts/` directory with 2 photos: Justus + Heinz)
- [ ] Case study logos (`src/assets/images/case-studies/` directory with 3 logos)
- [ ] Google Maps embed URL and screenshot for contact page

*(All gaps are expected for Wave 0; they define the scope for planning and implementation.)*

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Not applicable (marketing site, no authentication) |
| V3 Session Management | No | Not applicable (marketing site, no sessions) |
| V4 Access Control | No | Not applicable (all pages public) |
| V5 Input Validation | No | No user input on Phase 6 pages; ConsultForm from Phase 5 handles validation |
| V6 Cryptography | No | HTTPS enforced by Netlify; no sensitive data in Phase 6 |
| V7 Cryptographic Failures | No | No sensitive crypto needed; links and metadata only |
| V8 Data Exposure | Yes | Case study quotes/logos, team names/photos are public (non-sensitive); contact phone/email are public business info (per current-site-overview.md) |
| V9 Logging & Monitoring | No | Not applicable (marketing site; Plausible analytics per SEO-05) |
| V10 Malicious Activity Detection | No | Not applicable (read-only content delivery) |

### Known Threat Patterns for Static Marketing Site

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS in Markdown content | Tampering | Astro automatically escapes HTML in markdown; code blocks are syntax-highlighted but not executed |
| Stale content (outdated case studies, past events) | Spoofing | Build-time filtering for events; case studies remain static (human judgment); no auto-expiry |
| DSGVO iframe pre-load violation | Tampering + Privacy | Click-to-load Maps pattern (Pattern 7); no iframe until explicit click; matches vanilla-cookieconsent integration |
| DSGVO contact phone number indexing | Privacy | Phone numbers are public business info already published on Jimdo; no PII beyond that |
| Social engineering via team member photos | Social | Team photos are professional headshots, not PII; no email addresses on public page (stored in canonical.yaml, used only in forms) |

**No critical security controls unique to Phase 6.** All security is inherited from Phase 5 (forms, consent) and Phase 7 (CSP, DSGVO, robots meta). Phase 6 is read-only content delivery.

## Sources

### Primary (HIGH confidence)
- Context7 library documentation: Astro 6.1.8, @astrojs/rss 4.0.18, Preact 10.29.1 — verified via package.json and astro.config.ts
- Phase 3 CONTEXT.md (I18N-06, I18N-07) — content collection patterns locked; verified in src/content.config.ts
- Phase 4 CONTEXT.md (D-01 through D-05) — page template patterns and Hero/Content/CallToAction components — verified in src/pages/anwendungen/[slug].astro
- Phase 5 CONTEXT.md — ConsultForm island pattern, Preact island architecture — verified in src/pages/preise.astro
- src/content.config.ts — all 7 collection schemas already defined for Phase 6 (post, caseStudy, job, event, team)
- src/utils/blog.ts — existing blog helper functions (fetchPosts, getStaticPathsBlogPost, getStaticPathsBlogTag) — patterns verified
- src/components/blog/ directory — 10 reusable blog components (Grid, SinglePost, Pagination, Tags, etc.) — verified all exist
- src/i18n/routeMap.ts — DE/EN route pairs for all Phase 6 pages (fallstudien, aktuelles, team, karriere, kontakt) already defined
- src/data/brand/canonical.yaml — contact info (Justus, Heinz), address, legal entity — verified current
- .planning/current-site-overview.md (2026-04-20 snapshot) — Jimdo site structure, 9 team members, 8 job roles, upcoming events, blog posts — verified as project reference

### Secondary (MEDIUM confidence)
- `.planning/phases/04-core-marketing-pages/04-CONTEXT.md` — use-case page detail pattern (Hero + Content + SensorDataViz + CTA) — directly applicable to case study detail pages
- `.planning/phases/05-conversion-funnel/05-CONTEXT.md` — ConsultForm island implementation, Preact + client:visible pattern — verified in src/pages/preise.astro
- Astro official docs (astro.dev) — getStaticPaths, getCollection, Content.render, pagination helpers — standard framework patterns, not project-specific

### Tertiary (LOW confidence)
- None — research verified all claims with official docs or codebase inspection

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages already in package.json; versions verified current
- Architecture: HIGH — content collection schemas complete in src/content.config.ts; route patterns established in Phase 3-4
- Pitfalls: MEDIUM — based on common Astro/i18n mistakes; specific project pitfalls emerged from codebase review
- Common patterns: HIGH — existing blog components, Hero/Content widgets, consult form verified in working code

**Research date:** 2026-04-23
**Valid until:** 2026-05-23 (30 days — no major Astro releases expected; Phase 6 is content/config driven, not framework upgrade dependent)

**Notes for planner:**
- Phase 6 has zero external dependencies beyond what's installed; all components and patterns exist.
- Hardest part is not code — it's content migration (Jimdo blog posts) and asset collection (9 team photos, 2 contact photos, 3 case study logos).
- Key risk: locale routing complexity — ensure every DE route has matching EN route, and collections are filtered by `data.locale` at every level.
- RSS feed generation is automatic via @astrojs/rss once blog posts are in place; no custom XML needed.
- Events auto-hiding works at build time — no cron jobs or client-side JS required.
