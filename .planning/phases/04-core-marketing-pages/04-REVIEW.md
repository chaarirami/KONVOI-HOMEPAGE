---
phase: 04-core-marketing-pages
reviewed: 2026-04-24T00:00:00Z
depth: standard
files_reviewed: 12
files_reviewed_list:
  - src/components/widgets/HeroVideo.astro
  - src/components/widgets/IncidentVideo.astro
  - src/components/widgets/ScrollSteps.astro
  - src/components/widgets/SensorDiagram.astro
  - src/pages/index.astro
  - src/pages/en/index.astro
  - src/pages/produkt.astro
  - src/pages/en/product.astro
  - src/pages/anwendungen/[slug].astro
  - src/pages/en/use-cases/[slug].astro
  - src/pages/branchen/[slug].astro
  - src/pages/en/industries/[slug].astro
findings:
  critical: 1
  warning: 4
  info: 4
  total: 9
status: issues_found
---

# Phase 4: Code Review Report

**Reviewed:** 2026-04-24
**Depth:** standard
**Files Reviewed:** 12
**Status:** issues_found

## Summary

All 12 source files were reviewed. The implementation is structurally sound: `getStaticPaths` is used correctly, `render()` is called properly, locale filtering is consistent, and the hardcoded cross-link maps are a safe, deliberate choice that avoids path-traversal risks. The i18n routing pairs correctly match `routeMap.ts`.

One critical issue was found: the product pages pass a raw HTML string via the `content` prop to `Content.astro`, which renders it with `set:html`. While the string is authored inline (not user input), this pattern is fragile and will silently render injected markup if the string is ever sourced from a collection field or external data.

Four warnings cover: an unused declared prop in `IncidentVideo.astro`, a missing `<track>` element on all `<video>` tags (accessibility requirement for muted autoplay videos), empty testimonials rendering without a guard, and a slug mismatch risk between the EN homepage link and the EN use-case collection slug.

---

## Critical Issues

### CR-01: Raw HTML String Passed to `set:html` in Content Component

**File:** `src/pages/produkt.astro:152-163`, `src/pages/en/product.astro:152-163`

**Issue:** Both product pages pass a multi-line HTML string literal as the `content` prop to `<Content>`. `Content.astro` renders this via `set:html={content}` (line 47 of `Content.astro`). While the string is currently a hardcoded literal, this establishes a pattern where structured markup bypasses Astro's template-level escaping. If `content` is ever refactored to pull from a collection field, an environment variable, or a CMS, the raw HTML will render unsanitized. Additionally, inline HTML strings are invisible to TypeScript's type checker and will silently accept injected tags.

**Fix:** Replace the HTML string with Astro's native slot/component composition. Eliminate the `content` prop for this use case:

```astro
<!-- Instead of: content={`<p>...</p><ul>...</ul>`} -->
<Content tagline="Installation" title="..." subtitle="..." isReversed={true}>
  <Fragment slot="content">
    <p>KONVOI wird von unserem zertifizierten Installations-Team direkt bei Ihnen vor Ort montiert.
    Die Installation dauert <strong>unter 120 Minuten pro Trailer</strong> ...</p>
    <ul>
      <li>Keine Kabelarbeiten an der Trailer-Elektrik</li>
      <li>Keine Betriebsunterbrechung des Fahrzeugbetriebs</li>
      <li>Sofort einsatzbereit nach Installation</li>
      <li>Full-Service inklusive: Hardware, Software, Wartung, Support</li>
    </ul>
  </Fragment>
</Content>
```

This keeps content in Astro's sanitized template scope and removes the `set:html` surface entirely for this section.

---

## Warnings

### WR-01: Unused `aspectRatio` Prop in IncidentVideo.astro

**File:** `src/components/widgets/IncidentVideo.astro:8-17`

**Issue:** The component declares and accepts an `aspectRatio` prop (`'16:9' | '4:3'`), assigns it to `_aspectRatio` (the leading underscore signals intentional non-use), but never applies it to the rendered `<div>`. The container always uses the hardcoded Tailwind class `aspect-video` (16:9). A caller passing `aspectRatio="4:3"` will see no effect, with no warning or error. This is a broken API contract.

**Fix:** Either apply the prop to the container class, or remove it from the interface entirely to avoid misleading callers:

```astro
// Option A — apply it:
const aspectClass = aspectRatio === '4:3' ? 'aspect-4/3' : 'aspect-video';
// then: class={`relative w-full ${aspectClass} bg-slate-900 ...`}

// Option B — remove it (cleaner if 4:3 is never needed):
// Delete the aspectRatio field from Props and the destructure line.
```

---

### WR-02: No `<track>` Element on Autoplay Videos (Accessibility)

**File:** `src/components/widgets/HeroVideo.astro:27-36`, `src/components/widgets/IncidentVideo.astro:24-35`

**Issue:** Both components render `<video autoplay muted loop playsinline>` without a `<track kind="captions">` element. WCAG 2.1 Success Criterion 1.2.2 requires captions for prerecorded synchronized media. While muted background loops are generally exempt (no meaningful audio), `IncidentVideo` is used for content videos (incident replays, installation walkthroughs) that may carry meaningful visual or audio context. Browsers also warn about missing tracks in accessibility audits.

**Fix:** Add a `<track>` element referencing a VTT file, or at minimum a disabled default track to suppress audit warnings:

```astro
<!-- In IncidentVideo.astro, inside <video>: -->
<source src={videoSrc} type="video/mp4" />
<track kind="captions" src="" label="Captions" default />

<!-- In HeroVideo.astro (background loop — can use kind="descriptions" or omit captions): -->
<track kind="descriptions" src="" label="" />
```

When real video assets are finalized, proper `.vtt` caption files should be provided for IncidentVideo.

---

### WR-03: Testimonials Rendered When Collection Returns Empty Array

**File:** `src/pages/index.astro:133-138`, `src/pages/en/index.astro:133-138`

**Issue:** Both homepages render `<Testimonials ... testimonials={testimonials} />` unconditionally. If the `caseStudy` collection returns zero entries matching the `['schumacher', 'jjx', 'greilmeier']` filter (e.g., before case study content files are committed, or if `canonicalKey` field values change), the component receives an empty array. Depending on `Testimonials.astro`'s own handling, this either renders an empty section with a visible heading/subtitle and no quotes, or causes a render error.

**Fix:** Guard the section with a length check:

```astro
{testimonials.length > 0 && (
  <Testimonials
    title="Das sagen unsere Kunden"
    subtitle="Reale Ergebnisse von Unternehmen, die auf präventive Sicherheit setzen."
    testimonials={testimonials}
  />
)}
```

---

### WR-04: EN Homepage Use-Case Link Key Mismatch Risk (`stationary-time-optimization` vs collection slug)

**File:** `src/pages/en/index.astro:128`

**Issue:** The EN homepage links to `/en/use-cases/stationary-time-optimization`. The EN use-case collection file `src/content/useCase/en/stationary-time.md` has `slug: stationary-time-optimization` in its frontmatter (confirmed), so the route resolves correctly today. However, the content file is named `stationary-time.md` while the slug is `stationary-time-optimization` — the filename and slug are deliberately divergent. This is fine for Astro (slug field drives `getStaticPaths`, not filename), but if someone renames or recreates the file following the filename convention and omits the explicit `slug:` field, the generated route will silently become `/en/use-cases/stationary-time`, breaking the homepage link with no build-time error.

The same pattern exists for DE: `standzeit.md` uses `slug: standzeit-optimierung`.

**Fix:** Add a comment in both files to document the intentional divergence, and consider renaming the files to match the slug to eliminate the inconsistency:

```
src/content/useCase/de/standzeit.md         → rename to standzeit-optimierung.md
src/content/useCase/en/stationary-time.md   → rename to stationary-time-optimization.md
src/content/useCase/de/transparenz.md       → rename to transparenz-der-operationen.md
```

This makes the filename-to-slug relationship self-evident and prevents accidental slug drift.

---

## Info

### IN-01: SensorDiagram Callout Position Uses Inline Style String Concatenation

**File:** `src/components/widgets/SensorDiagram.astro:49`

**Issue:** Callout positions are applied via inline string concatenation: `style={"left:" + callout.x + ";top:" + callout.y}`. The `x` and `y` props are typed as `string` with no validation. Astro's JSX expression rendering will not escape CSS property values, so a value like `"0;background:red"` would inject additional CSS declarations. These values come from hardcoded page props (not user input), so the immediate risk is low, but the pattern is fragile.

**Fix:** Use Astro's `style` object syntax which applies property-level escaping, or restrict the type:

```astro
// Option A — style object (Astro escapes values):
style={{ left: callout.x, top: callout.y }}

// Option B — restrict types to percentage strings via Zod/regex in schema
```

---

### IN-02: ScrollSteps Animation Only Handles Up to 3 Steps

**File:** `src/components/widgets/ScrollSteps.astro:73-82`

**Issue:** The scroll animation CSS hard-codes `data-step` selectors for indices 0, 1, and 2 only. The component's `Step[]` prop accepts any number of steps. If a caller passes 4 or more steps, steps 3+ will not animate (they receive the base `animation-timeline: view()` rule but no custom `animation-range` offset). This is a silent degradation rather than an error, but it means future callers cannot safely add a 4th step and expect animation.

**Fix:** Document the 3-step limit in the interface comment, or use a CSS custom property and `nth-child` to make it data-driven:

```css
/* Data-driven approach — no hardcoded indices: */
.scroll-step:nth-child(1) { animation-range: entry 0%  cover 30%; }
.scroll-step:nth-child(2) { animation-range: entry 15% cover 45%; }
.scroll-step:nth-child(3) { animation-range: entry 30% cover 60%; }
.scroll-step:nth-child(4) { animation-range: entry 45% cover 75%; }
```

Or add a JSDoc comment on the `steps` prop: `/** Maximum 3 steps — scroll animation only defined for indices 0-2. */`

---

### IN-03: IncidentVideo Fallback `<p>` Tag Is Not Accessible

**File:** `src/components/widgets/IncidentVideo.astro:34`

**Issue:** The video fallback content is `<p class="absolute inset-0 flex items-center justify-center ...">`. A `<p>` element placed inside `<video>` as fallback content is semantically valid HTML, but the `absolute` positioning classes have no effect because the `<p>` is not rendered inside the DOM layout when the video is supported (it is only shown by browsers that do not support `<video>`, which is effectively no current browser). The message is also German-only (`"Video wird geladen — bitte Browser aktualisieren."`) even though the component is used on the EN product and use-case pages.

**Fix:** The fallback text should be locale-aware, or generic enough to work in both contexts. Since true video fallback is irrelevant for any supported browser, simplify to a plain text node:

```astro
<video ...>
  <source src={videoSrc} type="video/mp4" />
  Your browser does not support the video element.
</video>
```

---

### IN-04: `quote ?? ''` Silently Produces Empty Testimonial

**File:** `src/pages/index.astro:15`, `src/pages/en/index.astro:15`

**Issue:** The testimonial mapping uses `cs.data.quote ?? ''` — if a case study entry has no `quote` field, the resulting testimonial object has an empty string for the testimonial text. Depending on how `Testimonials.astro` renders, this may display a testimonial card with no quote text, only a name and job title. The `quote` field is correctly defined as optional in the schema, so this is a data quality issue rather than a schema bug.

**Fix:** Filter out entries without quotes before mapping:

```astro
const testimonials = caseStudiesDe
  .filter((cs) => cs.data.quote)
  .map((cs) => ({
    testimonial: cs.data.quote!,
    name: cs.data.quoteAttribution ?? cs.data.customer,
    job: cs.data.vertical,
  }));
```

This also makes WR-03's empty-array guard naturally handle the missing-quote scenario.

---

_Reviewed: 2026-04-24_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
