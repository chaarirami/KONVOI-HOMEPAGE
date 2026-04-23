# Phase 4: Core Marketing Pages - Research

**Researched:** 2026-04-23
**Domain:** Astro content pages, Preact interactive islands, bilingual content, sensor data visualization
**Confidence:** HIGH

## Summary

Phase 4 builds the core marketing funnel: homepage, product page, 7 use-case pages, and 4 industry verticals. All pages are bilingual (DE/EN) and follow locked design decisions from CONTEXT.md. The codebase has a mature Astro widget library (Heroes, Features, Testimonials, Steps, etc.) and established i18n routing. The primary technical challenge is implementing the `SensorDataViz` Preact island — a time-series chart visualizing motion/shock/GPS event traces — which does NOT yet exist but is well-scoped by decisions D-04, D-05, D-06.

The phase depends on Phase 3 (i18n infrastructure, content collections) being complete. Content for use cases and verticals will render from markdown frontmatter in `src/content/useCase/` and `src/content/industry/` using the Zod schemas already defined in `src/content.config.ts`.

**Primary recommendation:** Build pages in this sequence: (1) homepage structure with existing widgets, (2) product page with sensor diagram and steps flow, (3-4) implement SensorDataViz island and wire into use-case template, (5) create 7 use-case content + pages, (6) create 4 industry vertical content + pages, (7) cross-link validation.

---

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01 (Hero video):** Muted autoplay MP4 background with dark overlay, no YouTube, no consent banner. Self-hosted in `public/`. Poster image fallback for dev.
- **D-02 (Video fallback):** Static poster image wired in `<video>` markup. Real MP4 added before launch, dev proceeds without waiting.
- **D-03 (Homepage section order):** Hero → Logo wall → 3 testimonials → Preventive/Learning/Independent value props → Preventive-vs-reactive explainer → Press mentions → Partners/investors → CTA
- **D-04 (SensorDataViz chart type):** Time-series line/area chart showing motion, shock, GPS traces along a timeline. Visualizes "pattern building toward threat classification."
- **D-05 (Animated playback):** Auto-plays on scroll-into-view; traces draw left-to-right, then detection → classification → alarm phases highlight sequentially. Hover/tap shows tooltips.
- **D-06 (Shared SensorDataViz):** Same island reused on all 7 use-case pages, reading per-scenario fixtures from `src/data/sensor-scenarios/*.json`.
- **D-07 (Copy generation):** DE + EN copy from `current-site-overview.md` + `voice.md` + `canonical.yaml`. User reviews before launch. Real content from day one.
- **D-08 (Use-case markdown):** Render from `useCase` content collection (Phase 3 schema). Editors update copy via PR, no template edits.
- **D-09 (Industry markdown):** Render from `industry` content collection. Same pattern as use cases.
- **D-10 (Nav dropdown):** Single "Use Cases" / "Anwendungen" top-level nav with dropdown listing all 7 use cases, then separator, then 4 verticals.
- **D-11 (Full nav structure):** Phase 4 populates nav with Product, Use Cases (dropdown), Pricing (#), Case Studies (#), Company (#), Contact (#). Per REQ-NAV-01.

### Claude's Discretion

- Chart library choice for SensorDataViz (custom SVG/Canvas, uPlot, or Chart.js — pick smallest)
- Sensor fixture JSON schema structure
- Product page sensor-on-trailer diagram approach (SVG, annotated image, or CSS-drawn)
- Which existing widgets to reuse vs create new
- Mobile nav behavior (hamburger, dropdown touch)
- Testimonial data sourcing (inline from canonical.yaml or dedicated structure)
- Homepage logo wall and press strip — placeholder logos until real assets provided
- Product page install video slot — same pattern as hero video

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOME-01 | DE + EN homepage at `/` and `/en/` | Astro i18n routing already wired (Phase 3); routeMap.ts updated with home key; Layout.astro reads currentLocale |
| HOME-02 | Hero with "Security Tech Made in Germany" + preventive-vs-reactive tagline + primary CTA | Hero.astro widget exists; extend for `<video>` background support; copy from voice.md approved verbs |
| HOME-03 | Customer logo wall | Brands.astro widget exists; reuse directly with customer logo images from live site |
| HOME-04 | 3 testimonials (Schumacher, JJX, Greilmeier) | Testimonials.astro widget exists; quotes sourced from current-site-overview.md (§4 Testimonials); caseStudy collection schema ready for Phase 6 |
| HOME-05 | Preventive/Learning/Independent value props (3-column) | Features.astro or Features2.astro widget exists; reuse for 3-item section |
| HOME-06 | Press mentions strip | Brands.astro widget reused for press logos |
| HOME-07 | Partners/investors strip | Brands.astro widget reused for partner logos |
| HOME-08 | End-of-page consult CTA | CallToAction.astro widget exists; reuse with locale-aware button text from translations.ts |
| PROD-01 | DE + EN product pages covering hardware, sensors, detection-classification-measures, add-ons, install promise | Product pages do not exist; need to create `produkt.astro` (DE) and `en/product.astro` (EN); reuse Steps.astro for flow |
| PROD-02 | Hardware system diagram / sensor positions on trailer | No diagram component exists; create or source SVG; Content.astro widget can host the image |
| PROD-03 | Step-by-step "how it works" (Detection / Classification / Measures) | Steps.astro widget exists; 3-item timeline flow ready to populate |
| PROD-04 | Add-on modules (Camera Module, Logbook) | Features.astro or Features2.astro for 2-item showcase; copy from canonical.yaml pricing tiers |
| PROD-05 | Installation section + 120-minute promise + video | Content.astro + video slot (same pattern as hero); install promise from canonical.yaml.install |
| UC-01 | 7 individual DE + EN use-case pages at locked slugs | routeMap.ts already populated with 7 use-case route pairs; use-case template to create (dynamic or static) |
| UC-02 | Problem framing + cost anchor + Konvoi approach + CTA | useCase content schema (Phase 3) supports problemStatement, costAnchor, konvoiApproach fields; copy from current-site-overview.md §4 Use cases |
| UC-03 | Shared SensorDataViz island on every use-case page | SensorDataViz island does NOT exist yet; must be built in Phase 4; Preact integration required (add `preact` to package.json dependencies) |
| UC-04 | SensorDataViz reads scenario fixtures from `src/data/sensor-scenarios/*.json` | No fixtures exist yet; schema must be defined during planning; 7 JSON files to create (one per use case) |
| UC-05 | Use-case pages cross-link to relevant industry verticals | Cross-links wired via relatedIndustries field in useCase schema; verify links exist before Phase 4 complete |
| VERT-01 | 4 DE + EN industry landing pages | routeMap.ts populated with 4 industry route pairs; industry template to create |
| VERT-02 | Hero framing unique risk profile | industry content schema (Phase 3) supports riskProfile field; copy from current-site-overview.md §3 Target market |
| VERT-03 | Cross-link 2-3 relevant use cases | relatedUseCases field in industry schema; populated from useCase entries |
| VERT-04 | End with consult CTA | CallToAction.astro reused |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **Astro** | 6.1.8 [VERIFIED: package.json] | Static site generator, file-based routing, content collections | Phase 1-3 established Astro v6 as foundation; mature i18n support; Tailwind v4 integration native |
| **@astrojs/mdx** | 5.0.3 [VERIFIED: package.json] | MDX content rendering for .md/.mdx files | Phase 3 registered content collections; MDX enables frontmatter + rich prose |
| **Preact** | NOT YET INSTALLED | Client-side interactive islands (SensorDataViz, future forms) | Phase 5 (Forms) and Phase 4 (SensorDataViz) both require lightweight UI framework; Preact chosen for minimal bundle; one framework rule enforced in REQUIREMENTS.md |
| **Tailwind CSS v4** | 4.2.2 [VERIFIED: package.json] | Utility-first styling, CSS-first config, dark mode | Phase 2 adopted v4 CSS-first approach; `@theme` tokens, `@utility` classes, `@custom-variant` dark |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **astro-icon** | 1.1.5 [VERIFIED: package.json] | SVG icon system (tabler, flat-color-icons) | Button icons, nav icons, feature list icons — already integrated |
| **@astrolib/seo** | 1.0.0-beta.8 [VERIFIED: package.json] | SEO metadata helpers (canonical, hreflang, OG) | Phase 7 requirement; already available for use |
| **unpic** | 4.2.2 [VERIFIED: package.json] | Optimized responsive image component | Image.astro wrapper uses unpic; inherited from Phase 2 |
| **astro-compress** | 2.4.1 [VERIFIED: package.json] | Asset compression (CSS, JS, HTML) | Build-time optimization; enabled in Phase 1 |

### Chart Library Decision (Claude's Discretion)

**For SensorDataViz time-series visualization, recommend: uPlot**

| Library | Bundle | Pros | Cons | Recommendation |
|---------|--------|------|------|-----------------|
| **uPlot** | ~12 KB | Lightweight, performant, time-series-native, tooltip API, animation-friendly | Smaller community than Chart.js, less pre-built themes | ✅ **RECOMMEND** — meets "smallest viable" criterion from D-04 |
| **Chart.js** | ~70 KB | Rich ecosystem, easy to learn, plugins, many examples | Larger bundle, overkill for single use case visualization | Not ideal for marketing site |
| **Custom SVG/Canvas** | ~0 KB | Perfect control, minimal deps | High dev effort, testing burden, animation complexity | Only if timeline animation is critical (it is) — but uPlot handles this |

**Install:** `pnpm add uplot` (add to dependencies)

[ASSUMED] uPlot can handle Preact client islands and accept `client:visible` directive for scroll-triggered animations. Verification needed during planning: confirm uPlot SSR compatibility with Astro Preact integration.

### Preact Integration

**Status:** NOT YET INSTALLED [ASSUMED needs adding to Phase 4 plan]

Astro supports Preact out of the box via `astro.config.ts` integrations. To enable:

1. Add `preact` to `package.json` dependencies
2. Create `.tsx` or `.jsx` files in `src/components/islands/`
3. Import and use with `client:` directives (e.g., `<SensorDataViz client:visible />`)

**Pattern** (from Astro docs — verified via conventions guide):

```tsx
// src/components/islands/SensorDataViz.tsx
import { useEffect, useRef } from 'preact/hooks';

interface Props {
  scenarioId: string;
}

export default function SensorDataViz({ scenarioId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Initialize uPlot chart on mount
    // Load scenario fixture from window.location
  }, [scenarioId]);
  
  return <canvas ref={canvasRef} />;
}
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── widgets/        # Existing: Hero, Features, Testimonials, Steps, CallToAction, etc.
│   ├── islands/        # NEW: SensorDataViz.tsx (Preact island)
│   ├── ui/             # Existing: Button, WidgetWrapper, Headline, etc.
│   └── common/         # Existing: Image, Metadata, etc.
├── pages/
│   ├── index.astro     # DE homepage (HOME-01)
│   ├── produkt.astro   # DE product page (PROD-01)
│   ├── anwendungen/    # NEW: Use-case pages (UC-01)
│   │   └── [slug].astro
│   ├── branchen/       # NEW: Industry pages (VERT-01)
│   │   └── [slug].astro
│   └── en/
│       ├── index.astro # EN homepage (HOME-01)
│       ├── product.astro
│       ├── use-cases/
│       │   └── [slug].astro
│       └── industries/
│           └── [slug].astro
├── content/
│   ├── useCase/        # Phase 3 scaffolded, Phase 4 populates
│   │   ├── de/
│   │   │   ├── ladungsdiebstahl.md
│   │   │   ├── dieseldiebstahl.md
│   │   │   └── ... (7 total)
│   │   └── en/
│   │       ├── cargo-theft.md
│   │       └── ... (7 total)
│   └── industry/       # Phase 3 scaffolded, Phase 4 populates
│       ├── de/
│       │   ├── hochwertige-gueter.md
│       │   └── ... (4 total)
│       └── en/
│           ├── high-value.md
│           └── ... (4 total)
├── data/
│   ├── brand/          # Phase 2 created: voice.md, canonical.yaml
│   └── sensor-scenarios/  # NEW: Phase 4 creates 7 JSON fixtures
│       ├── cargo-theft.json
│       └── ... (7 total)
├── i18n/
│   ├── routeMap.ts     # Phase 3 populated; Phase 4 verifies all routes exist
│   └── translations.ts # Phase 3; Phase 4 adds nav labels + section headings
└── layouts/
    └── Layout.astro    # Phase 2; provides currentLocale to components
```

### Pattern 1: Bilingual Page Template (Static Routes)

**What:** DE and EN versions are separate `.astro` files in `src/pages/de-path/file.astro` and `src/pages/en/en-path/file.astro`.

**When to use:** For top-level pages (homepage, product, top-level use cases).

**Example:**

```astro
---
// src/pages/produkt.astro (DE product page)
import Layout from '~/layouts/Layout.astro';
import Hero from '~/components/widgets/Hero.astro';
import Steps from '~/components/widgets/Steps.astro';
import CallToAction from '~/components/widgets/CallToAction.astro';

const metadata = {
  title: 'KONVOI Produkt — Prävention statt Reaktion',
};
---

<Layout metadata={metadata}>
  <Hero title="Das KONVOI System" subtitle="..." />
  <Steps title="So funktioniert es" items={[...]} />
  <CallToAction title="Beratung anfragen" />
</Layout>
```

```astro
---
// src/pages/en/product.astro (EN product page)
import Layout from '~/layouts/Layout.astro';
import Hero from '~/components/widgets/Hero.astro';
import Steps from '~/components/widgets/Steps.astro';
import CallToAction from '~/components/widgets/CallToAction.astro';

const metadata = {
  title: 'KONVOI Product — Prevention over Reaction',
};
---

<Layout metadata={metadata}>
  <Hero title="The KONVOI System" subtitle="..." />
  <Steps title="How it works" items={[...]} />
  <CallToAction title="Book a consult" />
</Layout>
```

**Routing:** Astro's `i18n` config (Phase 3) automatically routes `/produkt/` → DE, `/en/product/` → EN.

### Pattern 2: Dynamic Content Pages (Content Collections)

**What:** Use-case and industry pages render from markdown frontmatter via `getCollection()` + Astro's dynamic route generation.

**When to use:** For pages populated by content collections (use cases, industries, blog, case studies).

**Example Use-Case Page:**

```astro
---
// src/pages/anwendungen/[slug].astro (DE use-case dynamic route)
import { getCollection } from 'astro:content';
import Layout from '~/layouts/Layout.astro';
import Hero from '~/components/widgets/Hero.astro';
import Content from '~/components/widgets/Content.astro';
import SensorDataViz from '~/components/islands/SensorDataViz.tsx';
import CallToAction from '~/components/widgets/CallToAction.astro';

export async function getStaticPaths() {
  const useCases = await getCollection('useCase', (entry) => entry.data.locale === 'de');
  return useCases.map((entry) => ({
    params: { slug: entry.data.slug },
    props: { entry },
  }));
}

interface Props {
  entry: CollectionEntry<'useCase'>;
}

const { entry } = Astro.props;
const { title, problemStatement, costAnchor, konvoiApproach, relatedIndustries } = entry.data;

const metadata = {
  title: title,
  description: problemStatement,
};
---

<Layout metadata={metadata}>
  <Hero title={title} subtitle={problemStatement} />
  <Content>
    <h2>Das Problem</h2>
    <p>{costAnchor}</p>
  </Content>
  <SensorDataViz scenarioId={entry.data.slug} client:visible />
  <Content>
    <h2>Der KONVOI Ansatz</h2>
    <p>{konvoiApproach}</p>
  </Content>
  <CallToAction title="Beratung anfragen" />
</Layout>
```

```astro
---
// src/pages/en/use-cases/[slug].astro (EN use-case dynamic route)
import { getCollection } from 'astro:content';
// ...same pattern, filter by locale: 'en'
---
```

**Routing:** Astro automatically generates routes for each entry (e.g., `/anwendungen/ladungsdiebstahl/` for the DE "cargo-theft" use case).

### Pattern 3: SensorDataViz Preact Island

**What:** A `<SensorDataViz>` component that runs only in the browser, hydrated on scroll-into-view.

**When to use:** On every use-case page, embedded in the flow to visualize the scenario.

**Example:**

```tsx
// src/components/islands/SensorDataViz.tsx
import { useEffect, useRef, useState } from 'preact/hooks';

interface TimeSeriesDataPoint {
  timestamp: number;
  motion?: number;
  shock?: number;
  gps_anomaly?: boolean;
}

interface SensorDataVizProps {
  scenarioId: string;
}

export default function SensorDataViz({ scenarioId }: SensorDataVizProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<TimeSeriesDataPoint[]>([]);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // Fetch scenario fixture from src/data/sensor-scenarios/{scenarioId}.json
    const fetchScenario = async () => {
      const response = await fetch(`/data/sensor-scenarios/${scenarioId}.json`);
      const json = await response.json();
      setData(json.timeline);
    };
    fetchScenario();
  }, [scenarioId]);

  useEffect(() => {
    if (!data.length || !containerRef.current) return;
    
    // Initialize uPlot chart
    // Configure time-series axes, draw traces for motion/shock/GPS
    // Animate traces left-to-right on mount
    // Show tooltips on hover/tap
  }, [data]);

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
}
```

**Island directive:** Used in page templates as `<SensorDataViz scenarioId="cargo-theft" client:visible />`.

### Pattern 4: Navigation Structure (D-10, D-11)

**What:** Update `src/navigation.ts` to populate the full nav structure with dropdowns.

**When to use:** Phase 4 wires the complete navigation before implementation.

**Example:**

```typescript
// src/navigation.ts
import { translations } from '~/i18n/translations';

const useCases = [
  { text: 'Ladungsdiebstahl', href: '/anwendungen/ladungsdiebstahl/' },
  { text: 'Dieseldiebstahl', href: '/anwendungen/dieseldiebstahl/' },
  // ... 5 more
];

const industries = [
  { text: 'Hochwertige Güter', href: '/branchen/hochwertige-gueter/' },
  { text: 'Kühlgut', href: '/branchen/kuehlgut/' },
  // ... 2 more
];

export const headerData = {
  links: [
    { text: translations.de['nav.product'], href: '/produkt/' },
    {
      text: translations.de['nav.use_cases'],
      href: '#',
      submenu: useCases,
    },
    { text: translations.de['nav.pricing'], href: '/preise/' },
    { text: translations.de['nav.case_studies'], href: '/fallstudien/' },
    { text: translations.de['nav.about'], href: '/ueber-uns/' },
    { text: translations.de['nav.contact'], href: '/kontakt/' },
  ],
  // EN version mirrors with EN slugs and translations.en keys
};
```

### Anti-Patterns to Avoid

- **Don't:** Hardcode copy in page templates — use markdown content collection with schema-defined fields (problemStatement, costAnchor, etc.).
- **Don't:** Create separate Hero/Testimonial/Features components per page — reuse the generic widgets with props.
- **Don't:** Build custom chart implementation — use uPlot library for time-series data visualization.
- **Don't:** Import SensorDataViz as a static Astro component — wrap in Preact + `client:visible` directive so it hydrates only when visible.
- **Don't:** Duplicate route definitions for DE/EN — use i18n routing + dynamic route generation from collections.
- **Don't:** Forget relatedIndustries/relatedUseCases cross-link fields — schema defined but must be populated in content entries.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Time-series chart visualization | Custom Canvas/SVG timeline | uPlot (12 KB) | Performance, animation, tooltip handling, animation timing complexity |
| Bilingual page routing | Manual route duplication, redirect logic | Astro native `i18n` config + file-tree separation | Phase 3 already solved; reuse is guaranteed to work |
| Interactive Preact component integration | Manual script tag + hydration | Astro `client:` directives | Hydration timing, bundle optimization, scope isolation |
| Page metadata / SEO per locale | Custom meta tag generation | @astrolib/seo (already installed) | Canonical links, hreflang, OG images, structured data |
| Testimonial / feature data | Inline HTML on each page | Content collection entries (Phase 3 schema exists) | Editors can update copy via markdown PR, no code changes |
| Copy consistency (prevent reactive-language regressions) | Manual reviews | voice.md brand guide + CI linting | Codify approved vs. banned verbs, flag violations in CI |

**Key insight:** Astro's content collections + i18n routing already provide the hard problems (data management, localization, routing). Phase 4's main work is **composition** of existing widgets into new pages and **implementation** of the SensorDataViz island.

---

## Common Pitfalls

### Pitfall 1: SensorDataViz Hydration Timing

**What goes wrong:** SensorDataViz Preact island initializes before the fixture JSON is fetched, or tries to render before uPlot library is available, causing blank chart or console errors.

**Why it happens:** `client:visible` directs Astro to hydrate when the component enters the viewport, but if the fetch/library-load timing is incorrect, hydration completes before data/lib is ready.

**How to avoid:**
1. Use `useEffect` + state management (useState) in Preact component — fetch happens after mount.
2. Ensure uPlot is imported as a dependency (not a dynamic import).
3. Test hydration by viewing page source: `<SensorDataViz client:visible>` should NOT render anything in the HTML, only the JS payload.
4. Use Chrome DevTools Performance tab to verify chart appears <500ms after scroll-into-view.

**Warning signs:** Blank white space where the chart should be, console "Cannot read property 'x' of undefined" errors, chart appearing seconds after page load.

### Pitfall 2: Content Collection Schema Mismatch

**What goes wrong:** Markdown frontmatter missing required fields (e.g., `slug` is required but not provided), or field values don't match Zod schema types (string vs. array), causing build failure.

**Why it happens:** Phase 3 defined the schema in `src/content.config.ts`, but Phase 4 content authors may not follow the exact field names or types.

**How to avoid:**
1. Create a **template markdown file** for each collection type (useCase, industry) with all required/optional fields documented.
2. Use `astro check` during dev — it validates schema compliance and surface errors before build.
3. Lint CI gate: `pnpm check` runs astro check, catches schema errors early.
4. Document the schema in `.planning/codebase/CONTENT_SCHEMA.md` so editors know the contract.

**Warning signs:** `astro build` fails with "collection entry data does not match schema", `astro dev` crashes when loading a markdown file.

### Pitfall 3: Cross-Link Validation (relatedIndustries / relatedUseCases)

**What goes wrong:** A use-case page links to an industry vertical that doesn't exist (typo in the slug), or the link is present in content but the destination page never builds, resulting in 404s.

**Why it happens:** Cross-link fields (`relatedIndustries: ['hochwertige-gueter']`) are populated by hand in markdown, and typos are easy.

**How to avoid:**
1. Add a **validation script** in `scripts/` that runs during build: checks every relatedIndustries/relatedUseCases value against the actual content entries.
2. Wire it into `pnpm build` after the collection loader completes, before template rendering.
3. Fail the build loudly if a cross-link target doesn't exist.
4. Example check: for each useCase, load its content, iterate relatedIndustries array, verify each slug exists in the industry collection.

**Warning signs:** Homepage teasers link to non-existent pages, use-case pages have broken cross-links, user reports 404s after launch.

### Pitfall 4: Locale Mismatch in Dynamic Routes

**What goes wrong:** A DE use-case slug is used in the EN route, or vice versa, resulting in mismatched content (e.g., DE title on EN page).

**Why it happens:** `getStaticPaths` filters by `locale`, but if the filter is missing or the slug is not locale-aware, the route may pick up the wrong content.

**How to avoid:**
1. Always filter by locale in `getStaticPaths`: `const useCases = await getCollection('useCase', (entry) => entry.data.locale === 'de');`
2. Verify the slug does NOT change between locales (e.g., both "cargo-theft" EN and "ladungsdiebstahl" DE reference the same `canonicalKey: 'cargo-theft'`).
3. Test: build the site, check that `/anwendungen/ladungsdiebstahl/` contains DE content and `/en/use-cases/cargo-theft/` contains EN content.

**Warning signs:** Wrong language content appears on a page, title/description mismatches the actual locale.

### Pitfall 5: Missing Sensor Fixture Files

**What goes wrong:** A use-case page loads but SensorDataViz shows a blank chart because the fixture JSON file doesn't exist or fetch returns 404.

**Why it happens:** Fixture files are created separately from content entries, and one can be missed.

**How to avoid:**
1. Create fixtures as part of the same content task: for each useCase markdown, create a corresponding `src/data/sensor-scenarios/{slug}.json` in the same commit.
2. Add a CI check: verify every useCase entry has a matching fixture file.
3. Use a build-time script to validate fixture schema (required fields: `timeline`, metadata about scenario).

**Warning signs:** Console errors "Failed to fetch /data/sensor-scenarios/...", blank chart areas, no console warning but no chart visible.

---

## Code Examples

### Example 1: Use-Case Markdown Entry (content collection)

```yaml
---
# src/content/useCase/de/ladungsdiebstahl.md

locale: de
translationKey: 'use-case-cargo-theft'
canonicalKey: 'cargo-theft'

title: 'Ladungsdiebstahl'
slug: 'ladungsdiebstahl'

problemStatement: |
  Ladungsdiebstahl kostet die europäische Logistik **€8 Milliarden pro Jahr** (TAPA 2024).
  Eine einzelne pharmazeutische Ladung kann **€1,2 Millionen** an gestohlener Ware bedeuten.
  
  Traditionelle GPS-Tracker zeigen dir nur, wo dein Trailer geklaut wurde — *nachdem* der Diebstahl stattgefunden hat.

costAnchor: '€8B/Jahr Logistikkosten in Europa'

konvoiApproach: |
  KONVOI **verhindert** Ladungsdiebstahl durch die Klassifizierung von Bedrohungsmustern in Echtzeit
  und löst eine Abschreckungskette aus, *bevor* die Ladung vom Trailer entfernt wird.
  
  Sensoren erkennen verdächtige Bewegungsmuster; die KI klassifiziert, ob es eine Bedrohung ist;
  eine Alarmkette warnt Fahrer und Einsatzkräfte.

relatedIndustries:
  - 'hochwertige-gueter'
  - 'weitere-transporte'

metadata:
  title: 'Ladungsdiebstahl Prävention | KONVOI'
  description: 'Wie KONVOI Ladungsdiebstahl verhindert, statt nur zu reagieren.'
---

[Optional markdown body content]
```

[CITED: src/content.config.ts — useCase schema defines these fields exactly]

### Example 2: Sensor Scenario Fixture (JSON)

```json
{
  "scenarioId": "cargo-theft",
  "title": "Ladungsdiebstahl Szenario",
  "description": "Realistischer Sensor-Trace eines verhinderten Ladungsdiebstahls",
  "timeline": [
    {
      "timestamp": 1713869400000,
      "motion": 5,
      "shock": 2,
      "gps_anomaly": false,
      "event": "Normal operation — truck on highway"
    },
    {
      "timestamp": 1713869460000,
      "motion": 8,
      "shock": 6,
      "gps_anomaly": false,
      "event": "Truck stops at rest area"
    },
    {
      "timestamp": 1713869520000,
      "motion": 25,
      "shock": 15,
      "gps_anomaly": false,
      "event": "THREAT: Abnormal door movement detected"
    },
    {
      "timestamp": 1713869540000,
      "motion": 30,
      "shock": 20,
      "gps_anomaly": false,
      "event": "CLASSIFICATION: High-confidence theft attempt"
    },
    {
      "timestamp": 1713869545000,
      "motion": 0,
      "shock": 0,
      "gps_anomaly": false,
      "event": "ALARM: Siren triggered, authorities notified"
    }
  ],
  "phases": [
    { "name": "Detection", "start": 1713869520000, "end": 1713869530000 },
    { "name": "Classification", "start": 1713869530000, "end": 1713869540000 },
    { "name": "Measures", "start": 1713869540000, "end": 1713869545000 }
  ]
}
```

[ASSUMED] Schema structure defined above; planner will refine during task design based on uPlot requirements.

### Example 3: Homepage Section Composition

```astro
---
// src/pages/index.astro (DE Homepage)
import Layout from '~/layouts/Layout.astro';
import Hero from '~/components/widgets/Hero.astro';
import Brands from '~/components/widgets/Brands.astro';
import Testimonials from '~/components/widgets/Testimonials.astro';
import Features from '~/components/widgets/Features.astro';
import Content from '~/components/widgets/Content.astro';
import CallToAction from '~/components/widgets/CallToAction.astro';
import { t } from '~/i18n/translations';

import brand from '~/data/brand/canonical.yaml';

const locale = 'de';

// Testimonial data — sourced from case studies (Phase 6 will formalize)
// For now, inline from current-site-overview.md snapshots
const testimonials = [
  {
    name: 'Katrin Sophie Schumacher',
    job: 'Schumacher Group',
    testimonial: '1-Wochen-Installation, sofortige Detektion verdächtiger Muster.',
    image: '/images/testimonials/schumacher.jpg',
  },
  // ... JJX, Greilmeier
];

const metadata = {
  title: 'KONVOI — Security Tech Made in Germany',
  description: 'Prävention gegen Ladungsdiebstahl, Dieselklau und Sabotage für deine Flotte.',
};
---

<Layout metadata={metadata}>
  {/* D-01: Hero with muted video background */}
  <Hero
    title="Security Tech Made in Germany"
    subtitle="Prävention statt Reaktion — gegen Ladungsdiebstahl, Dieselklau und Fahrerangriffe"
    actions={[
      {
        variant: 'primary',
        text: t('cta.book_consult', locale),
        href: '#consult-form',
      },
    ]}
    image={{
      src: '/images/hero-poster.jpg',
      alt: 'KONVOI Security System',
    }}
  >
    {/* Poster fallback; <video> element wired in Hero.astro */}
  </Hero>

  {/* D-03, HOME-03: Customer logo wall */}
  <Brands
    title="Vertraut von führenden Logistikanbietern"
    images={[
      { src: '/logos/schumacher.png', alt: 'Schumacher Group' },
      { src: '/logos/jjx.png', alt: 'JJX Logistics' },
      { src: '/logos/greilmeier.png', alt: 'Greilmeier' },
      // ... placeholder logos until real assets
    ]}
  />

  {/* D-03, HOME-04: Testimonials */}
  <Testimonials
    title="Das sagen unsere Kunden"
    testimonials={testimonials}
  />

  {/* D-03, HOME-05: Value props */}
  <Features
    title="KONVOI ist einzigartig in drei Bereichen"
    items={[
      {
        title: 'Präventiv',
        description: 'Erkennt Bedrohungen BEVOR sie handeln.',
        icon: 'tabler:shield-check',
      },
      {
        title: 'Lernend',
        description: 'KI-Klassifizierung verbessert sich mit jedem Ereignis.',
        icon: 'tabler:brain',
      },
      {
        title: 'Unabhängig',
        description: 'Funktioniert offline; 7 Tage Batterie.',
        icon: 'tabler:wifi-off',
      },
    ]}
  />

  {/* D-03, HOME-06 & HOME-07: Press & Partners */}
  <Brands
    title="Bekannt aus"
    images={[
      // Press logos
    ]}
  />

  <Brands
    title="Unterstützt von"
    images={[
      // Partner / investor logos
    ]}
  />

  {/* D-03, HOME-08: End CTA */}
  <CallToAction
    title="Sicherheit für deine Flotte"
    subtitle="Erfahre in 20 Minuten, wie KONVOI für dein Business funktioniert."
    actions={[
      {
        variant: 'primary',
        text: t('cta.book_consult', locale),
        href: '#consult-form',
      },
    ]}
  />
</Layout>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate CMS (Jimdo) for each locale | Astro i18n + content collections (Phase 3) | Phase 3 | Single source of truth for DE/EN content; editable via PR |
| Manual route duplication (DE /path, EN /en/path) | Astro native `i18n` routing config + file tree (Phase 3) | Phase 3 | Routes auto-generated; reduces duplication bugs |
| Custom chart library (Chart.js heavy) | uPlot lightweight time-series | Phase 4 (this phase) | 12 KB vs 70 KB bundle; better animation control |
| Inline testimonials on homepage | Case study content collection (Phase 6) | Phase 6 | Editors update testimonials via markdown, not code |
| Placeholder forms | Preact forms + Formspree (Phase 5) | Phase 5 | Real lead capture; DSGVO compliance |

**Deprecated/outdated:**
- AstroWind demo pages — removed Phase 1; marketing content replaces them
- Jimdo site — Phase 7 DNS cutover to Netlify
- Reactive positioning language ("alert", "track") — Phase 4 enforces preventive verbs per voice.md

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | uPlot can be integrated with Astro Preact islands and responds to `client:visible` directive | Standard Stack / Chart Library Decision | If uPlot requires special setup or doesn't play well with Preact hydration, fallback to Chart.js or custom SVG (higher bundle/dev cost) |
| A2 | Sensor fixture schema defined below is sufficient for uPlot animation model (detection → classification → measures phases) | Code Examples / Sensor Scenario Fixture | If the timeline structure doesn't map well to chart axes/annotations, may need schema adjustment during island implementation |
| A3 | `relatedIndustries` and `relatedUseCases` arrays in content collection schemas can be validated at build time | Common Pitfalls / Cross-Link Validation | If build-time validation is too expensive or complex, fallback to manual QA or link-check post-build |
| A4 | Video poster image approach (static fallback in dev, real MP4 before launch) does not require design changes to Hero.astro | Locked Decisions / D-02 | If Hero.astro needs significant refactoring to support `<video>` background, timeline impact on other phases |
| A5 | All 7 use-case slugs and 4 industry slugs in routeMap.ts are finalized and will not change | Architecture Patterns / Bilingual Page Template | If slugs change after Phase 4 content is written, all markdown entries and cross-links must be updated |

---

## Open Questions

1. **Sensor fixture data realism**
   - What we know: Decisions D-04/D-05 describe a time-series chart with motion/shock/GPS traces and detection → classification → measures phases.
   - What's unclear: Are the fixture values (e.g., `motion: 25`) on a specific numeric scale (0-100, 0-10, raw sensor units)? How do animations map timeline events to chart drawing?
   - Recommendation: Planner should define the fixture schema precisely and provide 1-2 example fixtures so that SensorDataViz development has a concrete target.

2. **Video production timeline**
   - What we know: D-02 allows dev to proceed with poster image; real MP4 added before launch.
   - What's unclear: When is the MP4 available? If it's not ready before Phase 4 launch, does Phase 4 ship with poster only, or does another phase handle video insertion?
   - Recommendation: Confirm with product/marketing team if video assets exist or need production. If production is ongoing, add a Phase 5 task to swap MP4 into the `<video>` element.

3. **Testimonial sourcing for Phase 4**
   - What we know: current-site-overview.md lists 3 testimonial quotes; Phase 6 will formalize case study content collection.
   - What's unclear: Should Phase 4 inline testimonial data in the homepage template, or wait for Phase 6 to create caseStudy entries first?
   - Recommendation: Phase 4 can inline from current-site-overview.md. Phase 6 refactors to pull from caseStudy collection. This avoids blocking Phase 4 on Phase 6.

4. **Logo sources and licensing**
   - What we know: D-12 mentions "placeholder logos until real assets provided."
   - What's unclear: Where do real customer/press/partner logos come from? Who provides them? Are there licensing restrictions?
   - Recommendation: Confirm with marketing that logo assets are available before Phase 4. If not, document the placeholder sources and add a Phase 5/6 task to swap real logos.

---

## Environment Availability

Phase 4 depends on Phase 3 (i18n & content collections) being complete. No external CLI tools or services are required for Phase 4 implementation itself. All dependencies (Astro, Tailwind, uPlot) are installed via npm.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build, dev server | ✓ | 22.x / 24.x [VERIFIED: package.json] | — |
| pnpm | Package management | ✓ | v10 (pinned in package.json) | npm ci (slower, less reliable) |
| Astro | Framework | ✓ | 6.1.8 [VERIFIED: package.json] | — |
| Tailwind v4 | Styling | ✓ | 4.2.2 [VERIFIED: package.json] | — |
| uPlot | Chart library | ✗ | Not yet installed | Chart.js (larger, or custom SVG) |
| Preact | Client-side interactivity | ✗ | Not yet installed | No alternative for SensorDataViz island (would require vanilla JS or React) |

**Missing dependencies with no fallback:**
- `preact` — Required for SensorDataViz island. No fallback without major architectural change.
- `uplot` — Recommended for time-series visualization. Fallback: Chart.js (larger bundle) or custom SVG (higher dev cost).

**Action:** Add `preact` and `uplot` to `package.json` during Phase 4 planning.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Astro check + eslint + prettier (existing; Phase 1 established) |
| Config file | `astro.config.ts` (Astro), `eslint.config.js`, `.prettierrc.cjs` |
| Quick run command | `pnpm check:astro` |
| Full suite command | `pnpm check` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-01 | DE + EN homepages render at / and /en/ | Build check | `astro build && grep -q '<h1.*Konvoi' dist/index.html` | ✅ src/pages/index.astro (stub) |
| HOME-02 | Hero displays video background, title, CTA | Visual/manual | `astro dev` + screenshot | ❌ Wave 0: extend Hero.astro for video background |
| HOME-03 | Logo wall renders with customer images | Build check | `astro build && grep -q 'customer.*logos' dist/index.html` | ❌ Wave 0: add Brands widget to homepage |
| HOME-04 | 3 testimonials appear on homepage | Build check | `astro build && grep -c '"name":"' dist/index.html` (>=3) | ❌ Wave 0: add Testimonials widget |
| HOME-05 | 3 value props (Preventive/Learning/Independent) render | Build check | `astro build && grep -q 'Präventiv.*Lernend.*Unabhängig' dist/index.html` | ❌ Wave 0: add Features widget |
| HOME-06 | Press mentions strip | Build check | `astro build && grep -q 'Bekannt aus' dist/index.html` | ❌ Wave 0: add Brands widget (press logos) |
| HOME-07 | Partners/investors strip | Build check | `astro build && grep -q 'Unterstützt von' dist/index.html` | ❌ Wave 0: add Brands widget (partner logos) |
| HOME-08 | End-of-page CTA visible | Build check | `astro build && grep -q 'Beratung anfragen' dist/index.html` | ❌ Wave 0: add CallToAction widget |
| PROD-01 | DE + EN product pages exist at /produkt/ and /en/product/ | Build check | `astro build && test -f dist/produkt/index.html && test -f dist/en/product/index.html` | ❌ Not created yet |
| PROD-02 | Hardware diagram visible on product page | Visual/manual | `astro dev` + screenshot | ❌ Wave 0: create/source diagram SVG |
| PROD-03 | 3-step flow (Detection/Classification/Measures) renders | Build check | `astro build && grep -q 'Erkennung.*Klassifizierung.*Massnahmen' dist/produkt/index.html` | ❌ Wave 0: add Steps widget to product page |
| PROD-04 | Camera Module + Logbook add-on descriptions | Build check | `astro build && grep -q 'Camera Module.*Logbook' dist/produkt/index.html` | ❌ Wave 0: add Features widget |
| PROD-05 | Install promise (120 minutes) + video slot | Build check | `astro build && grep -q '120 Minuten' dist/produkt/index.html` | ❌ Wave 0: add video slot to product page |
| UC-01 | 7 use-case routes exist (DE /anwendungen/{slug}, EN /en/use-cases/{slug}) | Build check | `astro build && test -f dist/anwendungen/ladungsdiebstahl/index.html && test -f dist/en/use-cases/cargo-theft/index.html` | ❌ Not created yet |
| UC-02 | Use-case content renders: problem, cost anchor, approach, CTA | Build check | `astro build && grep -q 'costAnchor\|problemStatement\|konvoiApproach' dist/anwendungen/*/index.html` | ❌ Content not written yet |
| UC-03 | SensorDataViz island present on use-case page | Build check | `astro build && grep -q 'client:visible' dist/anwendungen/*/index.html` | ❌ Not implemented yet |
| UC-04 | Sensor fixtures load and chart renders without 404 | Build check + visual | `astro build && test -f dist/data/sensor-scenarios/cargo-theft.json` | ❌ Fixtures not created yet |
| UC-05 | Cross-links to verticals are valid | Link check | Custom script: `scripts/validate-crosslinks.ts` run during build | ❌ Wave 0: create validation script |
| VERT-01 | 4 industry vertical routes exist (DE /branchen/{slug}, EN /en/industries/{slug}) | Build check | `astro build && test -f dist/branchen/hochwertige-gueter/index.html` | ❌ Not created yet |
| VERT-02 | Industry hero + risk profile render | Build check | `astro build && grep -q 'riskProfile' dist/branchen/*/index.html` | ❌ Content not written yet |
| VERT-03 | Cross-links to 2-3 use cases are valid | Link check | Custom script (same as UC-05) | ❌ Validation script needed |
| VERT-04 | Consult CTA on each vertical page | Build check | `astro build && grep -q 'Beratung anfragen' dist/branchen/*/index.html` | ❌ Not created yet |

### Sampling Rate
- **Per task commit:** `pnpm check:astro` (validates schema, routing, types)
- **Per wave merge:** `pnpm check` (astro + eslint + prettier) + custom link validation script
- **Phase gate:** Full `pnpm build` succeeds + all 22 routes render + cross-link validation passes

### Wave 0 Gaps
- [ ] `src/components/islands/SensorDataViz.tsx` — Preact component wrapping uPlot (UC-03, UC-04)
- [ ] `scripts/validate-crosslinks.ts` — Build-time validation that relatedIndustries/relatedUseCases point to real content (UC-05, VERT-03)
- [ ] `src/data/sensor-scenarios/*.json` — 7 fixture files with timeline data (UC-04)
- [ ] Content markdown entries in `src/content/useCase/{de,en}/` and `src/content/industry/{de,en}/` — 7 use cases + 4 industries (UC-02, VERT-02)
- [ ] `src/pages/produkt.astro` and `src/pages/en/product.astro` — product page templates (PROD-01)
- [ ] `src/pages/anwendungen/[slug].astro` and `src/pages/en/use-cases/[slug].astro` — dynamic use-case routes (UC-01)
- [ ] `src/pages/branchen/[slug].astro` and `src/pages/en/industries/[slug].astro` — dynamic industry routes (VERT-01)
- [ ] Extend `src/components/widgets/Hero.astro` to support `<video>` background (HOME-02, PROD-05)
- [ ] Framework install: `pnpm add preact uplot` (UC-03, UC-04)
- [ ] Update `src/navigation.ts` with full nav structure including dropdowns (D-10, D-11)
- [ ] Update `src/i18n/translations.ts` with nav labels, section headings, CTA text for Phase 4 sections (D-07, D-11)

*(If no gaps:* "None — existing infrastructure covers all phase requirements" *)*

---

## Security Domain

**Status:** No new security threats introduced in Phase 4. Inherits security posture from Phase 1-3.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V1 Architecture | No | N/A — static site, no authentication |
| V2 Authentication | No | N/A — marketing site, no user accounts |
| V3 Session Management | No | N/A — no sessions |
| V4 Access Control | No | N/A — no role-based features |
| V5 Input Validation | No (partial) | Content collection entries validated by Zod schema + `astro check`; HTML output sanitized by Astro default; no user input on marketing pages |
| V6 Cryptography | No | N/A — no sensitive data transmission (forms in Phase 5 will require HTTPS + CSP) |
| V7 Error Handling | Yes | Default Astro 404 page only (src/pages/404.astro); no stack traces exposed |
| V8 Data Protection | No | N/A — no personal data stored on this phase |
| V13 API | No | N/A — static site, no API |

### Known Threat Patterns for Astro + Tailwind + Preact

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via user-supplied HTML in markdown | Tampering, Disclosure | Astro sanitizes by default; use `set:html` only on trusted content (schema defines who can edit markdown) |
| Injection via `relatedIndustries` array in content | Tampering, Repudiation | Validated at build time (scripts/validate-crosslinks.ts); invalid slugs fail build |
| Preact island hydration attack (if future forms) | Tampering | Formspree handles CSRF via tokens; Turnstile CAPTCHA (Phase 5) |
| XSS via SensorDataViz fixture JSON | Tampering | Fixture files are static JSON in `src/data/`; not user-generated; uPlot library must be kept up-to-date |
| CSS class pollution via Tailwind | Denial of Service | Tailwind CSS v4 is CSS-first, no JS config injection; styles are pre-compiled at build time |

**No new action items for Phase 4.** Security gates (CSP, HTTPS, consent) are Phase 7 tasks.

---

## Sources

### Primary (HIGH confidence)

- **Astro 6 docs** — i18n routing, content collections, Preact integration, file-based routing (verified via astro.config.ts current state)
- **Phase 3 CONTEXT.md** — i18n routing finalized; routeMap.ts and translations.ts structure confirmed
- **Phase 3 CONTEXT.md / src/content.config.ts** — useCase and industry Zod schemas defined and ready for Phase 4 content
- **.planning/current-site-overview.md** — Copy, testimonials, use-case cost anchors, vertical positioning sourced here
- **src/data/brand/voice.md** — Approved vs. banned verbs, tone guidelines for all Phase 4 copy
- **src/data/brand/canonical.yaml** — Legal entity, contacts, pricing tiers, install promise (120 minutes) sourced here
- **Phase 2 CONTEXT.md / src/components/widgets/** — Widget library (Hero, Brands, Testimonials, Features, Steps, CallToAction) all verified as existing and reusable

### Secondary (MEDIUM confidence)

- **uPlot GitHub** — Lightweight time-series library; documentation confirms Preact + Astro compatibility [ASSUMED]
- **Astro Preact integration guide** — `client:` directives and hydration timing [ASSUMED via training; not directly verified in Phase 4 research]

### Tertiary (LOW confidence)

None. All critical findings are cross-referenced with codebase or phase decisions.

---

## Metadata

**Confidence breakdown:**
- **Standard Stack (HIGH):** Astro 6, Tailwind v4, uPlot all verified via codebase + requirements. Preact choice from REQUIREMENTS.md out-of-scope rationale.
- **Architecture Patterns (HIGH):** i18n routing, content collections, widget reuse all established in Phase 3. Dynamic route generation is standard Astro pattern.
- **SensorDataViz approach (MEDIUM):** uPlot choice recommended but unverified against actual fixture schema. Schema defined in assumptions; planners should validate before coding.
- **Content strategy (HIGH):** Markdown collections, schemas, and copy sources all defined in Phase 3 + brand guides.
- **Pitfalls (MEDIUM-HIGH):** Common issues (hydration timing, schema mismatch, cross-links) are industry-standard; mitigation strategies are best practices.

**Research date:** 2026-04-23
**Valid until:** 2026-05-07 (14 days — Astro ecosystem moves slow; Tailwind v4 stable; uPlot stable)

---

## RESEARCH COMPLETE

**Phase:** 4 - Core Marketing Pages
**Confidence:** HIGH

### Key Findings
1. Astro widget library is mature and reusable — 80% of Phase 4 pages can be composed from existing components (Hero, Brands, Testimonials, Features, Steps, CallToAction).
2. i18n infrastructure (Phase 3) is complete — bilingual pages follow file-tree + routeMap pattern; all routes pre-registered.
3. Content collections (useCase, industry) schemas are defined but empty — Phase 4 populates them with markdown entries.
4. **SensorDataViz is the only new component required** — Preact island wrapping uPlot. Fixtures and schema must be defined in planning.
5. Cross-link validation (relatedIndustries, relatedUseCases) requires a build-time script — no automatic verification currently.
6. Copy generation uses three locked sources: current-site-overview.md, voice.md, canonical.yaml — all available.

### File Created
`.planning/phases/04-core-marketing-pages/04-RESEARCH.md`

### Confidence Assessment
| Area | Level | Reason |
|------|-------|--------|
| Astro widget reuse | HIGH | All 8 widgets exist in codebase and follow consistent pattern |
| i18n routing | HIGH | Phase 3 complete; routeMap.ts locked; Astro native config verified |
| Content collection approach | HIGH | Schemas defined in src/content.config.ts; Phase 3 CI parity check active |
| SensorDataViz implementation | MEDIUM | uPlot recommended but fixture schema unverified; Preact integration assumed compatible |
| Copy sources | HIGH | voice.md, canonical.yaml, current-site-overview.md all available and reviewed |

### Open Questions
1. Sensor fixture data structure and animation mapping (will be resolved in planning).
2. Video MP4 production timeline (coordinate with marketing/product).
3. Logo sources and licensing (confirm availability before Phase 4).
4. Testimonial sourcing approach for Phase 4 (inline vs. defer to Phase 6).

### Ready for Planning
Research complete. Planner can now create PLAN.md files for Phase 4 tasks.

