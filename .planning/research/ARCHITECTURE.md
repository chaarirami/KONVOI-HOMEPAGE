# Architecture Patterns

**Domain:** Bilingual (DE/EN) B2B marketing site on Astro 6 + Tailwind 4
**Researched:** 2026-04-20
**Confidence:** HIGH (Astro docs + existing codebase verified)

## Recommended Architecture

Layered SSG with Astro 6 native i18n, content-collection-backed content, widget-composed pages, and a small set of hydrated islands reserved for genuinely interactive surfaces (ROI calculator, lead forms, data-viz widget). The existing AstroWind layer cake (config -> layouts -> pages -> widgets -> ui/common) stays intact; i18n, forms, ROI calc, and Konvoi-specific content collections are bolted onto it.

```
src/
├── config.yaml                         # Site identity (DE default, EN secondary)
├── content.config.ts                   # Collections: post, caseStudy, useCase, industry, event, job, team
├── i18n/
│   ├── index.ts                        # useTranslations(locale), getLocalizedPath(), alternateLinks()
│   ├── de.ts                           # UI strings (nav, CTAs, form labels, errors)
│   └── en.ts
├── navigation/
│   ├── de.ts                           # Nav tree for DE
│   └── en.ts                           # Nav tree for EN
├── layouts/
│   ├── Layout.astro                    # Base HTML shell (+ hreflang alternates)
│   ├── PageLayout.astro                # Locale-aware Header / Footer / Announcement
│   ├── LandingLayout.astro             # (keep, retarget for vertical / use-case pages)
│   └── MarkdownLayout.astro            # (keep for legal / careers markdown pages)
├── pages/
│   ├── index.astro                     # DE homepage              -> /
│   ├── en/
│   │   └── index.astro                 # EN homepage              -> /en/
│   ├── produkt.astro                   -> /produkt/
│   ├── en/product.astro                -> /en/product/
│   ├── anwendungen/[slug].astro        -> /anwendungen/diebstahl-ladung/
│   ├── en/use-cases/[slug].astro       -> /en/use-cases/cargo-theft/
│   ├── branchen/[slug].astro           -> /branchen/hochwertige-gueter/
│   ├── en/industries/[slug].astro      -> /en/industries/high-value/
│   ├── case-studies/
│   │   ├── index.astro                 -> /case-studies/ (slug stays EN in both)
│   │   └── [slug].astro
│   ├── en/case-studies/[slug].astro
│   ├── preise.astro                    -> /preise/    (EN: /en/pricing/)
│   ├── foerderung.astro                -> /foerderung/ (EN: /en/funding/)
│   ├── team.astro                      -> /team/       (same slug both locales)
│   ├── karriere.astro                  -> /karriere/   (EN: /en/careers/)
│   ├── kontakt.astro                   -> /kontakt/    (EN: /en/contact/)
│   ├── events.astro                    -> /events/     (same slug both locales)
│   ├── aktuelles/[...slug].astro       -> /aktuelles/... (DE blog)
│   ├── en/news/[...slug].astro         -> /en/news/...  (EN blog)
│   ├── impressum.astro                 -> /impressum/  (same slug both locales; legal term)
│   ├── datenschutz.astro               -> /datenschutz/ (same slug both locales)
│   └── 404.astro
├── components/
│   ├── ui/           WidgetWrapper, Button, Headline, Form, ItemGrid, Timeline, Background
│   ├── common/       Image, Metadata, CommonMeta, BasicScripts, LanguageSwitcher
│   ├── widgets/      Hero, Features, Pricing, CaseStudyTeaser, UseCaseGrid, IndustryHero, ...
│   ├── widgets/konvoi/  Preventive-vs-reactive, FundingEligibility, TeamGrid, EventsList
│   ├── islands/      RoiCalculator.tsx, ConsultForm.tsx, FundingQualifierForm.tsx, SensorDataViz.tsx
│   └── blog/         Grid, ListItem, Pagination, SinglePost, Tags, RelatedPosts
└── data/
    ├── post/de/*.md                    # DE blog posts (ported from Jimdo)
    ├── post/en/*.md                    # EN blog posts
    ├── case-study/de/*.md              # DE case studies
    ├── case-study/en/*.md
    ├── use-case/de/*.md                # DE use-case deep-dives
    ├── use-case/en/*.md
    ├── industry/de/*.md
    ├── industry/en/*.md
    ├── event/*.yaml                    # Events -- single source, bilingual fields
    ├── job/*.md                        # Jobs -- DE-only for v1 (German labour market)
    ├── team/*.yaml                     # Team bios -- single source, bilingual fields
    └── pricing.ts                      # Single source-of-truth for ROI calc + pricing page
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `src/config.yaml` + `astrowind:config` | Site identity, SEO defaults, analytics, UI theme. Source of truth loaded at build time via Vite virtual module. | Read by layouts, `Metadata.astro`, `permalinks.ts`, `i18n/index.ts`. |
| `src/i18n/index.ts` | Translation lookup (`t(key)`), locale detection (`Astro.currentLocale`), localized path builder (`getLocalizedPath(slug, locale)`), hreflang alternates generator. | Imported by every page, layouts, `LanguageSwitcher`, `Header`, `Footer`. |
| `src/navigation/{de,en}.ts` | Per-locale nav trees. Hrefs resolved at module load. | Imported by `PageLayout.astro` based on `Astro.currentLocale`. |
| `Layout.astro` | Base HTML shell, `<head>` stack, **hreflang alternate link tags**, `ClientRouter`. Sets `<html lang>` from current locale, not from static config. | Wraps every page; reads alternates from `i18n.alternateLinks()`. |
| `PageLayout.astro` | Locale-aware Header + Footer + Announcement + `<main>`. Picks `{headerData, footerData}` by current locale. | Wraps content pages; reads `navigation/{locale}.ts`. |
| Content collections (`src/data/**`) | Typed bilingual content (posts, case studies, use cases, industries, events, jobs, team). One entry per `(locale, slug)` pair. | Read by pages via `getCollection()` + filtered by `locale` field. |
| Widgets (`src/components/widgets/**`) | Reusable marketing sections; props-driven; **no hardcoded copy**. All strings come from page frontmatter or `t()` lookups. | Rendered by pages; wrap contents in `WidgetWrapper`. |
| Konvoi-specific widgets (`widgets/konvoi/`) | Bespoke sections the AstroWind catalogue does not cover: PreventiveVsReactive narrative, FundingEligibility narrative, TeamGrid, EventsList, UseCaseGrid, IndustryHero, PressStrip. | Rendered by pages; same WidgetWrapper contract. |
| Islands (`src/components/islands/*.tsx`) | Interactive, client-hydrated components: `RoiCalculator`, `ConsultForm`, `FundingQualifierForm`, `SensorDataViz`. Framework: **Preact** (smallest footprint, already de-facto Astro default). | Mounted from pages with `client:visible` (ROI, data-viz) or `client:load` (forms above the fold). |
| `src/data/pricing.ts` | Single source-of-truth for pricing tiers and per-unit theft-savings assumptions. Plain TS, imported by `pricing.astro` AND the ROI calculator island. | Pricing page + RoiCalculator. |
| `LanguageSwitcher.astro` (in `common/`) | Per-route locale switch. Uses `i18n.getAlternate(currentPath, currentLocale, otherLocale)` so clicking DE<->EN keeps the visitor on the translated equivalent of the same page. | Rendered inside `Header`. |

### Data Flow

```
  src/config.yaml
       |
       v
  astrowind:config virtual module ---> layouts, Metadata, permalinks, i18n helpers
                                        |
                                        v
  src/i18n/{de,en}.ts  -->  useTranslations(locale)  -->  t(key) inside pages/widgets
                                        |
                                        v
  src/data/**/{de,en}/*.md  -->  getCollection(name).filter(e => e.data.locale === locale)
                                        |
                                        v
  pages/ compose  -->  layouts/ wrap  -->  widgets/ render  -->  ui/ primitives
                                        |
                                        v
                           Astro build  -->  static HTML per (locale, slug)
                                        +    sitemap-index.xml with locale alternates
                                        +    robots.txt
                                        +    RSS feeds per locale
```

Interactive paths (runtime, client-side):

```
Visitor -> RoiCalculator island -> computes locally (no network) -> UI update
Visitor -> ConsultForm island -> POST to Formspree -> success/error UI on same island
Visitor -> FundingQualifierForm island -> POST to Formspree -> success/error UI
Visitor -> SensorDataViz island -> loads local JSON fixtures -> renders chart (no API)
```

There is **no runtime server**. All three islands are fully client-side; the only network destination is Formspree (or Netlify Forms fallback).

---

## i18n Strategy (LOCKED)

**Astro native i18n, DE default, `prefixDefaultLocale: false`.**

```ts
// astro.config.ts  (additions)
export default defineConfig({
  site: 'https://www.konvoi.eu',
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: false,   // -> DE at /, EN at /en/
      redirectToDefaultLocale: true,
      fallbackType: 'rewrite',      // Missing EN page silently falls back to DE content at /en/ URL
    },
    fallback: {
      en: 'de',                     // If EN content missing, show DE content. See note below.
    },
  },
});
```

**Decision: single `/` + `/en/` overlay (NOT a `[locale]/` dynamic tree).**

Rationale:
- File-based routing is explicit and readable. Every DE page has a direct EN counterpart in `src/pages/en/`.
- Avoids one dynamic `[locale]` tree that would force every page to conditionally render two locales in a single file.
- Matches Astro's native `prefixDefaultLocale: false` model.
- Editors can see "does the EN version exist?" by file presence, not by diffing frontmatter.
- **Cost:** two files per content page. Acceptable for ~25-30 pages total.

**Decision: localized URL slugs.**

Rationale:
- DE SEO is the primary market. `/anwendungen/diebstahl-ladung/` ranks for German queries; `/use-cases/cargo-theft/` does not.
- Localized slugs signal language relevance to Google beyond `<html lang>` and hreflang.
- Tradeoff: canonical URL mapping requires an explicit table (see `src/i18n/routeMap.ts` below).

**Fallback semantics (important subtlety).**
`fallbackType: 'rewrite'` means if `/en/foerderung/` doesn't exist as a file, Astro serves the DE `/foerderung/` content under the EN URL. For v1 parity we want **no fallbacks to hide missing translations** -- editors must create both files or neither. Setting `fallback` but enforcing "no missing pages" via a build-time check (a tiny CI script comparing file counts in `pages/**` vs `pages/en/**`) is the safer path. Alternative: omit the `fallback:` key and let missing EN routes 404, catching gaps during review.

**Route map for localized slugs.**

```ts
// src/i18n/routeMap.ts
export const routeMap = {
  '/':                  { de: '/',                  en: '/en/' },
  '/produkt/':          { de: '/produkt/',          en: '/en/product/' },
  '/preise/':           { de: '/preise/',           en: '/en/pricing/' },
  '/foerderung/':       { de: '/foerderung/',       en: '/en/funding/' },
  '/team/':             { de: '/team/',             en: '/en/team/' },
  '/karriere/':         { de: '/karriere/',         en: '/en/careers/' },
  '/kontakt/':          { de: '/kontakt/',          en: '/en/contact/' },
  '/events/':           { de: '/events/',           en: '/en/events/' },
  '/aktuelles/':        { de: '/aktuelles/',        en: '/en/news/' },
  '/case-studies/':     { de: '/case-studies/',     en: '/en/case-studies/' },
  '/impressum/':        { de: '/impressum/',        en: '/en/impressum/' },   // legal term kept in DE
  '/datenschutz/':      { de: '/datenschutz/',      en: '/en/datenschutz/' }, // legal term kept in DE
  // Use cases -- table stakes 7 URLs per locale, slug mapped per case
  '/anwendungen/diebstahl-ladung/':    { de: '/anwendungen/diebstahl-ladung/',    en: '/en/use-cases/cargo-theft/' },
  '/anwendungen/diebstahl-diesel/':    { de: '/anwendungen/diebstahl-diesel/',    en: '/en/use-cases/diesel-theft/' },
  '/anwendungen/diebstahl-fuhrpark/':  { de: '/anwendungen/diebstahl-fuhrpark/',  en: '/en/use-cases/equipment-theft/' },
  '/anwendungen/trailer-schaden/':     { de: '/anwendungen/trailer-schaden/',     en: '/en/use-cases/trailer-damage/' },
  '/anwendungen/fahrer-uebergriffe/':  { de: '/anwendungen/fahrer-uebergriffe/',  en: '/en/use-cases/driver-assault/' },
  '/anwendungen/standzeiten/':         { de: '/anwendungen/standzeiten/',         en: '/en/use-cases/stationary-time/' },
  '/anwendungen/transparenz/':         { de: '/anwendungen/transparenz/',         en: '/en/use-cases/operations-transparency/' },
  // Industries -- 4 verticals
  '/branchen/hochwertige-gueter/': { de: '/branchen/hochwertige-gueter/', en: '/en/industries/high-value/' },
  '/branchen/kuehlware/':          { de: '/branchen/kuehlware/',          en: '/en/industries/cooling/' },
  '/branchen/intermodal/':         { de: '/branchen/intermodal/',         en: '/en/industries/intermodal/' },
  '/branchen/sonstige/':           { de: '/branchen/sonstige/',           en: '/en/industries/other/' },
} as const;
```

**Legal-page slug choice.** `/impressum/` and `/datenschutz/` are kept in German on both locales. Reasoning: these are **German legal-law terms** (Impressumspflicht per TMG §5, Datenschutz per DSGVO); English visitors reading these pages are typically compliance people who will recognise the German term, and translating the URL to `/legal-notice/` masks that this is a German-law document. The page *content* is bilingual; the slug is not.

**Language switcher.** Uses `routeMap` in reverse to find "if I'm at `/anwendungen/diebstahl-ladung/`, which EN URL is the translation?" and renders that as the `<a hreflang="en">` target in the header.

---

## Content Collection Strategy (LOCKED)

**Decision: one collection per content type, `locale` as a filter field, one entry per (locale, slug) pair.**

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const localeEnum = z.enum(['de', 'en']);

export const collections = {
  post: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/data/post' }),  // post/de/*.md + post/en/*.md
    schema: ({ image }) => z.object({
      locale: localeEnum,                          // REQUIRED; must match directory
      title: z.string(),
      excerpt: z.string(),
      publishDate: z.date(),
      updateDate: z.date().optional(),
      image: image().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).default([]),
      author: z.string().default('KONVOI'),
      draft: z.boolean().default(false),
      metadata: z.object({ canonical: z.string().optional() }).optional(),
    }),
  }),

  caseStudy: defineCollection({
    loader: glob({ pattern: '**/*.md', base: 'src/data/case-study' }),
    schema: z.object({
      locale: localeEnum,
      customer: z.string(),            // e.g. "Schumacher Transporte"
      vertical: z.enum(['high-value', 'cooling', 'intermodal', 'other']),
      excerpt: z.string(),
      logo: z.string(),                // ~/assets/logos/schumacher.svg
      quote: z.string().optional(),
      quoteAuthor: z.string().optional(),
      publishDate: z.date(),
      metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      draft: z.boolean().default(false),
    }),
  }),

  useCase: defineCollection({
    loader: glob({ pattern: '**/*.md', base: 'src/data/use-case' }),
    schema: z.object({
      locale: localeEnum,
      slug: z.string(),                // explicit: 'cargo-theft' | 'diebstahl-ladung' (locale-specific)
      canonicalKey: z.enum([           // shared key across locales, drives hreflang + related-case-study lookup
        'cargo-theft', 'diesel-theft', 'equipment-theft', 'trailer-damage',
        'driver-assault', 'stationary-time', 'operations-transparency',
      ]),
      title: z.string(),
      excerpt: z.string(),
      icon: z.string(),
      relatedIndustries: z.array(z.string()).default([]),
      relatedCaseStudies: z.array(z.string()).default([]),
    }),
  }),

  industry: defineCollection({
    loader: glob({ pattern: '**/*.md', base: 'src/data/industry' }),
    schema: z.object({
      locale: localeEnum,
      slug: z.string(),
      canonicalKey: z.enum(['high-value', 'cooling', 'intermodal', 'other']),
      title: z.string(),
      excerpt: z.string(),
      heroImage: z.string(),
      relevantUseCases: z.array(z.string()).default([]),  // canonicalKeys from useCase
    }),
  }),

  event: defineCollection({
    loader: glob({ pattern: '*.yaml', base: 'src/data/event' }),
    schema: z.object({
      startDate: z.date(),
      endDate: z.date(),
      city: z.string(),
      country: z.string(),
      location: z.string(),
      url: z.string().url().optional(),
      // Bilingual in a single file -- events are short metadata, translation cost trivial
      title:   z.object({ de: z.string(), en: z.string() }),
      excerpt: z.object({ de: z.string(), en: z.string() }),
    }),
  }),

  job: defineCollection({
    loader: glob({ pattern: '*.md', base: 'src/data/job' }),
    schema: z.object({
      title: z.string(),
      department: z.string(),
      location: z.string().default('Hamburg, Germany'),
      employmentType: z.string(),
      applyEmail: z.string().email().default('jobs@konvoi.eu'),
      publishDate: z.date(),
      // DE-only v1. Careers in German labour market are applied for in German.
    }),
  }),

  team: defineCollection({
    loader: glob({ pattern: '*.yaml', base: 'src/data/team' }),
    schema: ({ image }) => z.object({
      name: z.string(),
      role:  z.object({ de: z.string(), en: z.string() }),
      bio:   z.object({ de: z.string(), en: z.string() }).optional(),
      photo: image(),
      linkedIn: z.string().url().optional(),
      order: z.number().default(100),
    }),
  }),
};
```

**Why one-entry-per-(locale, slug) for long-form content (posts, case studies, use cases, industries):**
- Long-form markdown is awkward to maintain inside a single YAML/JSON with `{de, en}` fields -- mdx syntax, images, frontmatter validation all get harder.
- Each file is independently draftable, reviewable, and translatable.
- `getCollection('caseStudy', ({ data }) => data.locale === currentLocale)` is one line at the page level.
- Matches the Astro docs recommendation ("Organize by locale within collections using src/content/blog/en/, /de/...").
- **Tradeoff:** risk of drift when one locale gets updated and the other doesn't. Mitigation: `canonicalKey` field on `useCase` and `industry` lets a CI check catch "canonicalKey 'cargo-theft' exists in DE but not EN".

**Why `{de, en}` fields for short-form metadata (events, team):**
- Events and team bios are structured, short, and change together. Splitting into two files doubles surface area for zero editing benefit.
- Dates, emails, phone numbers, photos are locale-invariant; only name, role, bio differ.
- Access pattern: `const roleLabel = member.data.role[Astro.currentLocale];` -- trivial.

**Jobs: DE-only for v1.** Konvoi hires for the Hamburg office into the German labour market; every current posting from the captured Jimdo site is in German. EN careers page renders the same job list with an EN-labelled page shell and DE job titles. If Konvoi later hires internationally, add a `locale` field and split into two directories.

---

## Page vs Widget vs Layout Boundaries

**Rules of thumb (codify in CONVENTIONS.md):**

1. **Layout** owns the HTML shell, `<head>`, and the chrome around `<main>` (header, footer, announcement, skip-link). Nothing page-specific.
2. **Page** owns: route existence, localized metadata, composition of widgets, content-collection queries, and all locale-aware strings it passes to widgets.
3. **Widget** owns: one rebrandable marketing section. Takes props. Renders `<WidgetWrapper>`. **Never** imports `astrowind:config` or reads `Astro.currentLocale` for copy -- it receives all copy via props. (Widgets MAY import `i18n` for things like date formatting.)
4. **UI primitive** owns: one unstyled-ish building block. No config dependency, no copy.

**When does a section deserve its own widget file?**
A section gets a file when (a) it appears on >=2 pages OR (b) it has >=15 lines of markup OR (c) it has its own set of typed props. Otherwise inline it into the page. Err on the side of inlining: the AstroWind tree has enough generic widgets; Konvoi needs 8-12 bespoke ones, not 40.

**Widgets to add (Konvoi-specific):**

| Widget | Used on | Why bespoke |
|--------|---------|-------------|
| `PreventiveVsReactive` | Homepage, product page | Core narrative hook; comparison layout not covered by existing Features/Steps. |
| `FundingEligibility` | Homepage, funding page, pricing page | 80% de-minimis callout with CTA; appears at least 3 places. |
| `UseCaseGrid` | Homepage, product page, industry landings | 7-tile grid linking to use-case pages; specific visual treatment. |
| `IndustryHero` | 4 industry landings | Vertical-specific hero with customer-logo strip. |
| `CaseStudyTeaser` | Homepage, case-study index, industry pages | Logo + metric + quote teaser card. |
| `PressStrip` | Homepage, about page | Horizontal press-mention logos. |
| `TeamGrid` | Team page | Pulls team collection, renders bios + photos. |
| `EventsList` | Contact page, events page | Reads `event` collection, filters `endDate >= today`. |
| `ConsultCtaBanner` | Every marketing page footer | Wraps the Book-a-Consult form or link; ensures single-CTA discipline. |

**Reuse of existing AstroWind widgets:**
- Keep: `Hero`, `Hero2`, `HeroText`, `Features`, `Features2`, `Features3`, `Pricing`, `FAQs`, `Steps`, `Steps2`, `Stats`, `Testimonials`, `Brands`, `CallToAction`, `Content`, `BlogLatestPosts`, `BlogHighlightedPosts`, `Note`, `Announcement`, `Header`, `Footer`.
- **Remove immediately** (AstroWind demo-only, no reuse value): nothing in `widgets/` -- all are generic.
- Everything in `pages/homes/` and `pages/landing/` is a composition example, not a widget, and gets deleted once Konvoi pages exist.

**The shared data-viz widget: `SensorDataViz`.**

This is the single most reused custom component (all 7 use-case pages). It's an island.

**Location:** `src/components/islands/SensorDataViz.tsx` (Preact).

**Props contract:**
```ts
interface SensorDataVizProps {
  scenario: 'cargo-theft' | 'diesel-theft' | 'equipment-theft'
          | 'trailer-damage' | 'driver-assault' | 'stationary-time'
          | 'operations-transparency';
  locale: 'de' | 'en';
  // Data loaded internally from src/data/sensor-scenarios/{scenario}.json
  // Strings (axis labels, legend, alarm badges) looked up by locale key
  autoPlay?: boolean;         // default true
  height?: number;            // default 480
}
```

**Usage:**
```astro
---
import SensorDataViz from '~/components/islands/SensorDataViz.tsx';
---
<SensorDataViz scenario="cargo-theft" locale={Astro.currentLocale} client:visible />
```

Hydrated with `client:visible` because the data-viz is below the fold on every use-case page and must not block LCP.

**Why a single shared widget, not 7 copies:** consistency is the whole point. The widget visually is the same (motion/shock/GPS traces on a timeline); only the data fixture and the alarm-trigger annotations change. Extracting per-scenario widgets duplicates the chart code 7x for no benefit.

---

## URL / Permalink Scheme (LOCKED)

See the `routeMap` table above. Summary of decisions:

- **Locale prefix:** `/` + `/en/`. DE is default. Set `prefixDefaultLocale: false`.
- **Slugs:** localized. DE `/anwendungen/`, EN `/en/use-cases/`. SEO wins outweigh mapping complexity.
- **Blog:** `/aktuelles/*` (DE) + `/en/news/*` (EN). Both ported from Jimdo. RSS per locale: `/rss.xml` (DE) + `/en/rss.xml` (EN).
- **Legal:** German slugs kept on both locales (`/impressum/`, `/datenschutz/`) because they are German-law terms.
- **Trailing slash:** enabled (`trailingSlash: 'always'` in `astro.config.ts`) -- matches existing config and is friendlier to static hosts.
- **Case-study slugs:** shared across locales (`/case-studies/schumacher/` + `/en/case-studies/schumacher/`). Customer names are proper nouns, don't translate.

---

## Form Architecture

**Stack: Formspree (primary) + Netlify Forms (fallback). Preact islands. Zod client-side validation.**

**Decision: client-side POST from a Preact island, not a server endpoint.**

Rationale:
- Site is static (`output: 'static'`); there is no server runtime.
- Formspree's `@formspree/react` handles submit, state, error UI, and spam honeypot.
- Preact drop-in (`alias` in `astro.config.ts`: `react` -> `preact/compat`) makes the 40 KB React import a ~10 KB Preact import.
- Netlify Forms available as fallback by adding `data-netlify="true"` + a hidden `form-name` on a non-island `<form>` tag, used only if Formspree is rejected for procurement reasons.

**Validation: Zod. HTML5 constraints are NOT enough.**
- Already in the dependency graph (used in `content.config.ts`), no new dependency.
- Funding qualifier form has business rules: "fleet size >= 5", "company founded >=2 years ago", "not currently in de-minimis cap" -- HTML5 `min`/`max`/`required` cannot express all of these.
- Consult form has lighter rules but shares the validator style for consistency.

**Implementation pattern:**

```tsx
// src/components/islands/ConsultForm.tsx
import { useForm, ValidationError } from '@formspree/react';
import { z } from 'zod';
import { useState } from 'preact/hooks';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  fleetSize: z.coerce.number().int().min(1),
  message: z.string().optional(),
  locale: z.enum(['de', 'en']),
});

export default function ConsultForm({ formId, labels }: {
  formId: string;
  labels: Record<string, string>;   // Passed from page, translated
}) {
  const [state, handleSubmit] = useForm(formId);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  // ... client-side validate with schema.safeParse before handleSubmit
  if (state.succeeded) return <SuccessUi label={labels.success} />;
  return (/* form markup, all labels from props */);
}
```

**Labels come from the page, not the island.** The island is framework-and-locale agnostic; it just receives `labels={{ name: 'Name', email: 'E-Mail', ... }}` from the Astro page. This keeps the i18n lookup at build time (zero client-side translation code).

**Hydration directive:**
- `ConsultForm` on the homepage CTA band: `client:visible` (below the fold)
- `ConsultForm` on `/kontakt/` (above the fold): `client:load`
- `FundingQualifierForm` on `/foerderung/`: `client:visible`

**Success / error UI:**
- Success: inline card replacement (no redirect). Text from `labels.success` prop. Optional secondary CTA ("Schedule a slot on Heinz's calendar" -> calendly.com/konvoi link if adopted).
- Error: inline alert above the submit button with retry. Formspree returns flat key-value errors; `ValidationError` from `@formspree/react` renders them.
- Network failure: same error UI with generic "Bitte versuchen Sie es erneut" / "Please try again" copy.

**Spam protection:**
- Formspree built-in honeypot + reCAPTCHA v3 (free tier). No custom captcha.
- Rate limit via Formspree plan; for v1 the free tier (50 submissions/month) is enough. Paid plan kicks in when traffic grows.

**Two form IDs:**
- `CONSULT_FORM_ID` (book-a-consult, used on homepage + contact + every page CTA)
- `FUNDING_FORM_ID` (funding pre-qualifier, only on `/foerderung/`)

Stored in `.env` as `PUBLIC_FORMSPREE_CONSULT_ID` and `PUBLIC_FORMSPREE_FUNDING_ID`; `PUBLIC_` prefix exposes them to client bundles.

---

## ROI Calculator Architecture

**Decision: Preact island, `client:visible`, lives at `src/components/islands/RoiCalculator.tsx`.**

Rationale:
- Pure client-side math -- no network calls, no server secrets.
- Preact because it's the lightest option Astro supports natively and it's fine for form-shaped state (fleet size, vertical, parking frequency -> computed annual savings).
- `client:visible` because ROI lives below the fold on `/preise/` and on its own `/roi/` subpage; lazy-hydrating it saves TTI.
- Vanilla JS alternative was considered and rejected: forms with reactive recalculation + conditional fields are enough of a pain in vanilla JS that a 10 KB Preact budget is worth it.

**Props contract:**
```ts
interface RoiCalculatorProps {
  locale: 'de' | 'en';
  labels: {
    headline: string;
    fleetSizeLabel: string;
    verticalLabel: string;
    parkingFreqLabel: string;
    // ... one-per-control, translated at build time
  };
  // Assumption knobs passed from src/data/pricing.ts so non-devs can tune them in code review
  assumptions: {
    avgCargoValue: Record<'high-value' | 'cooling' | 'intermodal' | 'other', number>;
    theftProbabilityPerParkingNight: number;
    koncoiPreventionRate: number;      // e.g. 0.85
    pricePerSensorPerMonth: number;
  };
  currency: 'EUR';
}
```

**Data source.** The calculator reads its assumption numbers from `src/data/pricing.ts`, which is a plain TS module exporting both the pricing tiers (consumed by `pricing.astro`) AND the ROI assumptions. Single source of truth; changing the monthly price updates both the pricing page and the ROI calculation automatically.

**Location.** `src/components/islands/RoiCalculator.tsx`. Mounted on:
- `/preise/` (and `/en/pricing/`) below the tier table.
- Optionally a dedicated `/roi/` (and `/en/roi/`) page if the team wants a standalone URL to link to from ads.

**No PDF export, no email capture in v1.** The calculator shows a result and has a "Book a consult" CTA that pre-fills the fleet-size field on the consult form via a URL param. Email-gated reports are a V2 experiment.

---

## Build Order / Phase Dependencies

Research-informed phase sequencing. Each phase unlocks the next.

**Phase 0 -- Foundation (must precede everything):**
- Strip AstroWind demo scaffolding (pages/homes, pages/landing, demo blog posts, demo imagery)
- Strip Decap CMS (`public/decapcms/`)
- Strip AstroWind attribution, replace LICENSE.md
- Keep: `vendor/integration/`, `src/components/widgets/`, `src/components/ui/`, layouts, utils
- Replace `src/config.yaml` with Konvoi values (site URL, name, OG defaults) -- but do NOT wire i18n yet in config.yaml because Astro native i18n lives in astro.config.ts, not the vendored integration
- Replace Logo.astro, favicons, Konvoi brand tokens in `src/assets/styles/tailwind.css`

**Phase 1 -- i18n Foundation (unlocks every content phase):**
- Configure Astro native i18n in `astro.config.ts` (`defaultLocale: 'de'`, `locales`, `prefixDefaultLocale: false`)
- Build `src/i18n/` (translations, `getLocalizedPath`, `alternateLinks`)
- Build `src/i18n/routeMap.ts`
- Build `src/navigation/{de,en}.ts`
- Update `Layout.astro` to emit hreflang alternate links
- Update `PageLayout.astro` to pick per-locale nav
- Build `LanguageSwitcher.astro`
- Ship a single pair of placeholder pages (`/` + `/en/`) to validate the whole chain before any real content
- **Gate: `pnpm build` produces both locale roots with correct hreflang.**

**Phase 2 -- Content Collections (unlocks case studies, use cases, industries, blog):**
- Update `src/content.config.ts` with the 7-collection schema above
- Remove the existing AstroWind `post` schema cleanly (schema still valid; move the demo posts out)
- Port 3-5 Jimdo blog posts (one DE, one EN if available) to validate both pipelines
- Validate `getCollection` + locale filter works end-to-end on the blog
- **Gate: `pnpm check` passes with new schemas; 3 test posts render on `/aktuelles/` and `/en/news/`.**

**Phase 3 -- Homepage + Primary Funnel (the revenue path):**
- Konvoi homepage DE (uses `PreventiveVsReactive`, `UseCaseGrid`, `CaseStudyTeaser`, `FundingEligibility`, `ConsultCtaBanner`)
- Konvoi homepage EN
- `/preise/` + `/en/pricing/` with `pricing.ts` as the source
- `/kontakt/` + `/en/contact/` (includes events widget, needs event collection -- so Phase 2 is strict prerequisite)
- `/foerderung/` + `/en/funding/` (needs FundingQualifierForm island)
- Build `ConsultForm` + `FundingQualifierForm` islands
- **Gate: at least one lead has come through Formspree end-to-end.**

**Phase 4 -- Product & Use Cases (SEO depth):**
- Product page `/produkt/` + `/en/product/`
- `SensorDataViz` island built (the long pole)
- 7 use-case pages DE + 7 EN (shared layout template, content-collection-driven, each embeds `SensorDataViz`)
- 4 industry landings DE + 4 EN
- **Gate: 7+7+4+4 = 22 content pages render in both locales without content-drift errors.**

**Phase 5 -- Supporting Pages:**
- Case studies: index + Schumacher, JJX, Greilmeier detail pages (DE + EN each)
- Team page (uses team collection)
- Careers page (DE only for v1, EN page reuses DE job list)
- Events page (if needed beyond contact-page embed)
- `/impressum/`, `/datenschutz/` (needs legal review; DO NOT block other phases on this)
- ROI calculator island on `/preise/` and `/roi/`

**Phase 6 -- SEO, Analytics, Launch Prep:**
- `@astrojs/sitemap` configured with `i18n` block so it emits `xhtml:link` hreflang alternates per URL
- Per-locale OG images (generate via `satori` at build time or hand-make; decide in phase)
- Analytics wiring (Plausible recommended over GA4 for a DE-market B2B site -- cookie-less avoids consent-banner ROI cost)
- Cookie consent banner (required for EU, minimal viable CMP like Klaro or Astro community CookieConsent)
- robots.txt finalisation, canonical audit
- Netlify deploy preview -> Netlify production + domain cutover

**Dependency graph (edges):**

```
Phase 0 (scaffolding removal)
   |
   v
Phase 1 (i18n)  --- unlocks ----> Phase 2, 3, 4, 5, 6
   |
   v
Phase 2 (collections)  --- unlocks ----> Phase 3 (events, pricing data), 4 (use-case + industry data), 5 (case studies, jobs, team)
   |
   v
Phase 3 (homepage + forms)  --- unlocks ----> first lead capture
   |
   v
Phase 4 (product + use cases + data-viz)  --- SensorDataViz can start in parallel with Phase 3 if resourced
   |
   v
Phase 5 (supporting pages + ROI)
   |
   v
Phase 6 (SEO polish, launch)
```

**Parallelisable work:** content writing (copy for homepage, use cases, industries) can happen in parallel with Phase 1 engineering. The `SensorDataViz` prototype can start as soon as Phase 2 (collections for data fixtures) is done, even if Phase 3 is still underway.

---

## SEO Architecture

**Per-page metadata flow:**

```
page.astro defines const metadata = { title, description, canonical, openGraph: { image, locale } }
       |
       v
passed to <Layout metadata={metadata}>
       |
       v
Metadata.astro merges: defaults <- src/config.yaml (via astrowind:config) <- page metadata
       |
       v
Adds hreflang <link rel="alternate"> for every (locale, page) in routeMap
       |
       v
@astrolib/seo renders final <head> tags
```

**Hreflang implementation.** Implemented in `Layout.astro` (or a new `common/HreflangLinks.astro`) that:
1. Reads `Astro.url.pathname` and `Astro.currentLocale`
2. Looks up the alternate in `routeMap`
3. Emits `<link rel="alternate" hreflang="de" href="https://www.konvoi.eu/...">` AND `hreflang="en"` AND `hreflang="x-default" -> DE` version (because DE is the default locale per Astro config).

All three are symmetric (DE page points to EN alternate; EN page points to DE alternate) -- this is a Google hard requirement.

**Sitemap.** `@astrojs/sitemap` is already in `astro.config.ts`. Reconfigure:

```ts
sitemap({
  i18n: {
    defaultLocale: 'de',
    locales: { de: 'de-DE', en: 'en-US' },
  },
  filter: (page) => !page.includes('/404'),
}),
```

This emits `<xhtml:link rel="alternate" hreflang="..."/>` for every URL automatically, matching the in-page hreflang tags. Google consumes the sitemap alternates as the primary signal for large sites.

**OG images per locale.** Three realistic options:
1. **Static per-locale file** (`og-home.de.png`, `og-home.en.png`) -- simplest, chosen for v1.
2. Satori-based generation at build time -- deferred to V2 unless brand wants "every page has a unique OG image".
3. Single shared OG (current state) -- rejected; loses localisation signal in social previews.

**Canonical URL.** `Metadata.astro` already resolves `getCanonical()` from `permalinks.ts`. Ensure it respects current locale -- the DE page's canonical is `https://www.konvoi.eu/...`, the EN page's canonical is `https://www.konvoi.eu/en/...`.

---

## Performance Budget

**Core Web Vitals targets (75th percentile, as Google measures):**
- LCP < 2.0s (better than Google's 2.5s threshold; marketing site, mostly hero images)
- INP < 200ms
- CLS < 0.1
- Lighthouse Performance >= 95

**Architectural decisions that protect these:**

| Decision | Protects | Mechanism |
|----------|----------|-----------|
| `output: 'static'` | LCP, TTFB | Prerendered HTML from CDN. No runtime. |
| Islands-only interactivity | TBT, INP | Zero JS by default; only 4 components ship client-side code (ROI calc, 2 forms, data-viz). |
| **Preact over React** for islands | LCP bundle cost | ~10 KB Preact vs ~40 KB React for the same JSX. Added as alias in `astro.config.ts`. |
| `client:visible` default | LCP, TBT | Hydration is deferred until islands enter the viewport. |
| `astro-icon` with tree-shaken tabler set | HTML/CSS weight | Only imported icon names are shipped. |
| `@astrojs/image` + `unpic` | LCP, CLS | AVIF/WEBP responsive sources per viewport; explicit `width`/`height` prevents CLS. |
| `astro-compress` | Transfer size | HTML + CSS + JS minification in build. |
| Inter Variable font self-hosted | LCP | Subsetted Inter already in `CustomStyles.astro`. Confirm `font-display: swap` and preload. |
| Netlify `_headers` immutable cache on `/_astro/*` | Repeat-view LCP | Already present. Works because Astro hashes filenames. |
| No third-party scripts except analytics | TBT | No Intercom, no HubSpot, no chat widget. Formspree endpoint is fetch-only, no script. |
| Analytics choice: Plausible (cookie-less) | TBT, compliance | ~1 KB async script. Avoids CMP tax on LCP. |
| No client-side router for page transitions | CLS | Keep `<ClientRouter fallback="swap" />` as-is; don't add SPA-style navigation. |
| Pre-generated OG images | Build time | No runtime OG generation that would need Edge Functions. |

**Per-page JS budget (compressed, transferred to client):**
- Homepage: < 20 KB (Preact runtime + ConsultForm)
- Use-case page: < 30 KB (Preact + SensorDataViz + chart lib)
- Pricing page: < 35 KB (Preact + RoiCalculator + ConsultForm)
- Simple pages (legal, team, careers, events): 0 KB (no islands)

**Chart library choice for SensorDataViz.**
- Use **uPlot** (~40 KB) if the library is needed for smooth time-series animation.
- Or use **raw SVG + Preact signals** if the motion curves are simple enough (~0 extra KB).
- Decide empirically in the first SensorDataViz spike; both fit within the use-case page budget.
- **Do NOT use Chart.js or D3** -- too heavy for a marketing site, fail the Lighthouse target.

**Anti-Patterns to Avoid**

### Anti-Pattern 1: "One big `[locale]` dynamic route"
**What:** Creating `src/pages/[locale]/index.astro`, `src/pages/[locale]/produkt.astro` and conditionally rendering DE/EN inside each file.
**Why bad:** Every page file becomes a bilingual conditional. Diff reviews are unreadable. Astro's native i18n routing works *better* with file-tree-per-locale.
**Instead:** Use `src/pages/en/` overlay as documented. Two files per page, one per locale.

### Anti-Pattern 2: Hardcoding copy in widgets
**What:** A widget imports `astrowind:config` or conditionally renders `de` vs `en` strings.
**Why bad:** Widgets become coupled to i18n internals; reuse breaks; overrides are impossible.
**Instead:** Widgets receive all strings as typed props. Pages call `t('nav.product')` and pass the result.

### Anti-Pattern 3: Decap CMS / headless CMS after the fact
**What:** Revisiting Decap (already configured, pointing at the wrong path) for "editor friendliness".
**Why bad:** Team is all technical; markdown + PR is already chosen (PROJECT.md). Decap adds a service, git-gateway identity, webhook surface, and an admin UI to maintain -- all for a 3-person editor team.
**Instead:** Delete `public/decapcms/`. Write one-page `CONTENT.md` explaining how to add a post, a case study, a team member.

### Anti-Pattern 4: Client-side translation
**What:** Shipping both DE and EN strings and swapping them in the browser.
**Why bad:** Double the transfer size. Slow switch UX. Breaks SEO (Googlebot sees mixed content).
**Instead:** Build-time localisation. `t()` is evaluated at build; client code only sees the already-localised strings.

### Anti-Pattern 5: Server endpoints for forms
**What:** `src/pages/api/submit-consult.ts` endpoint that forwards to email/CRM.
**Why bad:** Breaks `output: 'static'`; forces Astro adapter + serverless deploy; adds secrets to manage. PROJECT.md explicitly rules it out.
**Instead:** Client POST to Formspree from a Preact island. Formspree forwards to Konvoi email.

### Anti-Pattern 6: Storing pricing in config.yaml
**What:** Adding `pricing.tiers` to `src/config.yaml` so the virtual module `astrowind:config` exposes it.
**Why bad:** YAML is a bad fit for typed arrays with nested fields and shared-with-ROI-calc assumptions. `configBuilder.ts` would need schema extension.
**Instead:** `src/data/pricing.ts` (plain TS) imported directly by `pricing.astro` AND the ROI calculator island.

### Anti-Pattern 7: Mixing framework islands
**What:** React form + Svelte ROI calc + Solid data-viz.
**Why bad:** Ships 3 runtimes to the browser, ~100 KB wasted.
**Instead:** Pick Preact and stick to it for all 4 islands.

### Anti-Pattern 8: Canonical URL pointing at the other locale
**What:** Every page canonical = `https://www.konvoi.eu/produkt/` regardless of which locale is rendered.
**Why bad:** Signals to Google that `/en/product/` is a duplicate of `/produkt/`; EN page gets deindexed.
**Instead:** Each locale's page canonicalises to itself; hreflang handles the alternate relationship.

---

## Scalability Considerations

| Concern | v1 (launch) | Year 1 (100 pages, 10K visitors/mo) | Year 3 (300 pages, 100K visitors/mo) |
|---------|-------------|-------------------------------------|--------------------------------------|
| Page count | ~50 routes across both locales | ~100 routes | ~300 routes, likely a 3rd locale (FR or NL) |
| Build time | < 60s | < 120s; consider `astro build --remote` caching if CI time creeps up | Split into content-only and code-only pipelines; precommit content validation |
| Content authoring | Markdown + PR | Same | Consider lightweight CMS only if editor team exceeds 5 non-dev people |
| i18n | 2 locales, locale-per-directory | 3 locales -> still locale-per-directory, routeMap grows | 5+ locales -> re-evaluate; maybe Astro i18n + `astro-i18next` hybrid |
| Forms | Formspree free tier (50/mo) | Formspree Pro ($10/mo, 1K/mo) | Formspree Gold or self-hosted backend if spam becomes unmanageable |
| CDN/hosting | Netlify free | Netlify Pro | Netlify Pro + HTTP/3, image CDN edge cache |
| Analytics | Plausible (3K events/mo free tier) | Plausible paid | Same; add Segment if funnel analysis needed |
| ROI calc | Client-only, zero cost | Same | If gated (email capture for report), add Formspree submit |
| Case studies | ~3 customers | ~10 customers | ~30 customers -> may need filter/search UI |

**At none of these scales does the architecture need to change.** Static + islands + content collections scale gracefully to hundreds of pages. The re-architecture trigger is: "add a customer portal" or "add real-time inventory", at which point this repo splits from the new app repo cleanly.

---

## Deletion Plan for AstroWind Scaffolding

**Safe to delete in Phase 0 (before any new Konvoi work):**
- `src/pages/homes/` -- entire directory, 4 demo homes
- `src/pages/landing/` -- entire directory, 6 demo landings
- `src/data/post/*.md` and `*.mdx` -- all AstroWind demo posts
- `public/decapcms/` -- not used; inconsistent path
- `src/assets/images/hero-image.png`, `app-store.svg`, `google-play.svg` -- demo imagery
- `LICENSE.md` (MIT AstroWind) -- replace with Konvoi private licence
- Footer attribution in `src/navigation.ts` (`footNote` crediting Arthelokyo)

**Delete in Phase 1 after i18n structure lands:**
- `src/pages/index.astro` (current AstroWind demo homepage) -- overwritten with Konvoi homepage
- `src/pages/about.astro`, `contact.astro`, `pricing.astro`, `services.astro` -- overwritten or deleted
- `src/pages/privacy.md`, `terms.md` -- replaced with `impressum.astro`, `datenschutz.astro`
- `src/navigation.ts` (monolithic) -- split into `navigation/{de,en}.ts`

**Keep but refactor:**
- `src/components/widgets/Header.astro`, `Footer.astro` -- refactor to accept locale-specific nav data (small change; pattern already supports it).
- `src/components/widgets/Announcement.astro` -- keep, retarget copy.
- `src/components/ui/Form.astro` -- inspect; if it's a generic form wrapper keep, otherwise delete (islands will supply their own forms).
- `src/components/widgets/Contact.astro` -- DELETE; Konvoi contact page is bespoke (two named contacts + map), existing widget is generic.

**Keep untouched:**
- `vendor/integration/` -- config virtual module pipeline is reusable
- `src/utils/permalinks.ts`, `blog.ts`, `images.ts`, `images-optimization.ts`, `frontmatter.ts`, `utils.ts`
- `src/components/ui/WidgetWrapper.astro`, `Button.astro`, `Headline.astro`, `Background.astro`
- `src/components/common/*` (all of them)
- `src/components/blog/*` (all of them)
- `src/assets/styles/tailwind.css` -- keep the structure, replace Konvoi-specific color tokens

**Order of operations matters.** The `[...blog]` dynamic tree currently depends on the post schema, which is being rewritten. Do the deletion in the right order:
1. First, move AstroWind demo posts out of `src/data/post/` (keep 1-2 temporarily as schema examples).
2. Update `src/content.config.ts` to the new 7-collection schema.
3. Rebuild `src/utils/blog.ts` to add locale filtering (or keep it as-is and add a thin locale-aware wrapper; simpler path).
4. Rebuild `src/pages/[...blog]/` tree into `src/pages/aktuelles/[...slug].astro` + `src/pages/en/news/[...slug].astro`.
5. Delete the old `[...blog]/` tree.

**Danger zone (do NOT delete blindly):**
- `src/components/widgets/Hero.astro`, `Hero2.astro`, `HeroText.astro` -- all three reused across Konvoi pages, keep all variants.
- `astro.config.ts` -- extend with i18n config, **do not rewrite** (preserves image domains, compress config, icon set).
- `package.json` scripts -- `pnpm check` is the sole quality gate; keep it.

---

## Sources

- [Internationalization (i18n) Routing - Astro Docs](https://docs.astro.build/en/guides/internationalization/) -- HIGH confidence, primary spec for `defaultLocale`, `prefixDefaultLocale`, `routing`, `fallback`
- [Add i18n features - Astro Docs Recipe](https://docs.astro.build/en/recipes/i18n/) -- HIGH confidence, content-collection-per-locale pattern
- [Astro i18n Configuration Guide - BetterLink Blog (Dec 2025)](https://eastondev.com/blog/en/posts/dev/20251202-astro-i18n-guide/) -- MEDIUM, corroborates routing + language switcher implementation
- [Astro Internationalization (i18n) in 2026: The Complete Guide - Mavik Labs](https://www.maviklabs.com/blog/internationalization-astro-2026/) -- MEDIUM, current-year synthesis
- [getCollection for specific locale - Astro roadmap discussion #922](https://github.com/withastro/roadmap/discussions/922) -- HIGH, locale-filter pattern confirmed by Astro maintainers
- [Adding a Form to Astro - Formspree](https://formspree.io/guides/astro/) -- HIGH, Formspree-official Astro integration guide
- [Build HTML forms in Astro pages - Astro Docs](https://docs.astro.build/en/recipes/build-forms/) -- HIGH, confirmed static-first form patterns
- [Islands architecture - Astro Docs](https://docs.astro.build/en/concepts/islands/) -- HIGH, islands + hydration directives
- [Astro SEO: the definitive guide - Joost.blog](https://joost.blog/astro-seo-complete-guide/) -- MEDIUM, hreflang + sitemap patterns
- [Hreflang Implementation Guide - LinkGraph 2026](https://www.linkgraph.com/blog/hreflang-implementation-guide/) -- MEDIUM, symmetric-annotation + x-default rules
- [Why we chose Astro for our marketing websites - Nord Security](https://nordsecurity.com/blog/why-we-chose-astro-for-our-websites) -- MEDIUM, marketing-site case study
- [Astro Framework 2026: Astro 6, Cloudflare & What Changed](https://alexbobes.com/programming/a-deep-dive-into-astro-build/) -- MEDIUM, current-year context on Astro 6

---

*Architecture research: 2026-04-20*
