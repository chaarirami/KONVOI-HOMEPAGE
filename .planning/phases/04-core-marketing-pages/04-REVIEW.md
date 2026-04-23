---
phase: 04-core-marketing-pages
reviewed: 2026-04-23T14:32:00Z
depth: standard
files_reviewed: 18
files_reviewed_list:
  - astro.config.ts
  - package.json
  - scripts/validate-crosslinks.ts
  - src/content.config.ts
  - src/components/islands/SensorDataViz.tsx
  - src/components/widgets/Brands.astro
  - src/components/widgets/Content.astro
  - src/components/widgets/Hero.astro
  - src/i18n/translations.ts
  - src/navigation.ts
  - src/types.d.ts
  - src/pages/index.astro
  - src/pages/produkt.astro
  - src/pages/en/index.astro
  - src/pages/en/product.astro
  - src/pages/anwendungen/[slug].astro
  - src/pages/branchen/[slug].astro
  - src/pages/en/use-cases/[slug].astro
  - src/pages/en/industries/[slug].astro
findings:
  critical: 1
  warning: 5
  info: 3
  total: 9
status: issues_found
---

# Phase 04: Code Review Report

**Reviewed:** 2026-04-23T14:32:00Z
**Depth:** standard
**Files Reviewed:** 18
**Status:** issues_found

## Summary

Reviewed the core marketing pages phase covering the Astro config, content schema, i18n translations, navigation data, SensorDataViz interactive island, widget components (Hero, Content, Brands), and all page templates (DE + EN homepages, product pages, use-case dynamic routes, and industry vertical dynamic routes). Also reviewed the crosslinks validation build script.

The codebase is well-structured with consistent DE/EN parity, proper use of the i18n `t()` helper, and clean Astro content collection schemas. Key concerns center on a timer memory leak in the SensorDataViz Preact island, unsanitized HTML rendering of content collection frontmatter strings, and a fragile custom YAML parser in the build validation script.

## Critical Issues

### CR-01: setTimeout leak in SensorDataViz causes state updates on unmounted components

**File:** `src/components/islands/SensorDataViz.tsx:146-148`
**Issue:** The effect that animates phase highlights creates multiple `setTimeout` calls but does not clear them in the cleanup function. When the component unmounts or `fixture`/`locale` changes, the old timeouts keep firing, calling `setActivePhase` on a potentially unmounted or re-initialized component. This causes "state update on unmounted component" warnings and can produce visual glitches if a user rapidly navigates between use-case pages in a client-side transition.

```tsx
// Current code (line 146-148):
fixture.phases.forEach((_, idx) => {
  setTimeout(() => setActivePhase(idx), 600 + idx * 900);
});
```

The cleanup function on line 150-153 only destroys the uPlot chart but does not clear these timeouts.

**Fix:**
```tsx
// Collect timeout IDs and clear them on cleanup
const timeoutIds: number[] = [];
fixture.phases.forEach((_, idx) => {
  const id = window.setTimeout(() => setActivePhase(idx), 600 + idx * 900);
  timeoutIds.push(id);
});

return () => {
  timeoutIds.forEach((id) => clearTimeout(id));
  chartRef.current?.destroy();
  chartRef.current = null;
};
```

Also reset `activePhase` at the start of the effect to avoid stale state when `fixture` changes:
```tsx
setActivePhase(-1);
```

## Warnings

### WR-01: Unsanitized HTML injection from content collection frontmatter via set:html

**File:** `src/pages/anwendungen/[slug].astro:51`
**File:** `src/pages/anwendungen/[slug].astro:78`
**File:** `src/pages/en/use-cases/[slug].astro:49`
**File:** `src/pages/en/use-cases/[slug].astro:74`
**File:** `src/pages/branchen/[slug].astro:61`
**File:** `src/pages/en/industries/[slug].astro:59`
**Issue:** Content collection frontmatter fields (`problemStatement`, `konvoiApproach`, `riskProfile`) are rendered as raw HTML via `set:html={value.replace(/\n/g, '<br>')}`. While these are authored in markdown frontmatter (not user input), any HTML included by content authors will be rendered without sanitization. If a content author accidentally or intentionally includes `<script>` tags or event handlers in frontmatter strings, they will execute in the browser. This is a defense-in-depth concern since content authors are trusted, but the pattern is fragile.

**Fix:** Either escape HTML entities before rendering, or render the content through Astro's markdown pipeline instead of raw `set:html`:
```astro
---
// Option A: escape HTML then replace newlines
function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
---
<p set:html={escapeHtml(problemStatement).replace(/\n/g, '<br>')} />
```

### WR-02: Fragile custom YAML frontmatter parser may silently produce incorrect data

**File:** `scripts/validate-crosslinks.ts:5-35`
**Issue:** The `parseFrontmatter()` function uses a hand-rolled regex-based YAML parser that only handles single-level key-value pairs and flat arrays (indented with exactly 2 spaces). It will silently produce incorrect results for: (a) keys containing hyphens at the start of a word (line 22 regex `^([\w][\w-]*)` is fine but won't match leading hyphens), (b) multi-line string blocks (`|` or `>` -- line 26-27 treats them as empty arrays), (c) nested objects, (d) array items with colons. The `|` and `>` block scalars are initialized as empty arrays (`result[key] = []`) instead of accumulating subsequent lines as a string, which is semantically wrong.

**Fix:** Replace the custom parser with the `js-yaml` package that is already a project dependency:
```typescript
import yaml from 'js-yaml';

function parseFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  return (yaml.load(match[1]) as Record<string, unknown>) ?? {};
}
```

### WR-03: brand YAML import accessed without type safety -- runtime crash if YAML structure changes

**File:** `src/pages/produkt.astro:111-142`
**File:** `src/pages/en/product.astro:107-137`
**Issue:** The `brand` import from `~/data/brand/canonical.yaml` is typed as `any` (the custom Vite YAML plugin returns untyped data). Properties like `brand.pricing.tiers[1].de_name` and `brand.install.de_promise` are accessed with deep property chains without null checks. If the YAML file structure changes (e.g., a tier is removed or reordered), this will crash at build time with an unhelpful "Cannot read property of undefined" error rather than a clear validation message.

**Fix:** Add a TypeScript type definition for the YAML import and validate at the access site:
```typescript
// src/types/brand.d.ts
declare module '~/data/brand/canonical.yaml' {
  interface BrandData {
    pricing: {
      tiers: Array<{
        slug: string;
        de_name: string;
        en_name: string;
        de_description: string;
        en_description: string;
      }>;
    };
    install: {
      de_promise: string;
      en_promise: string;
    };
    // ... other fields
  }
  const data: BrandData;
  export default data;
}
```

### WR-04: Hardcoded array indices for pricing tiers are fragile

**File:** `src/pages/produkt.astro:111,117`
**File:** `src/pages/en/product.astro:107,113`
**Issue:** `brand.pricing.tiers[1]` and `brand.pricing.tiers[2]` use hardcoded numeric indices to access specific pricing tiers. If a tier is inserted, removed, or reordered in the YAML file, the wrong tier data will be displayed without any error or warning. The YAML file already has stable `slug` values (`camera-module`, `logbook`) per its own comments.

**Fix:** Look up tiers by slug instead of index:
```typescript
const cameraTier = brand.pricing.tiers.find((t) => t.slug === 'camera-module');
const logbookTier = brand.pricing.tiers.find((t) => t.slug === 'logbook');
// Then use cameraTier?.de_name with appropriate fallback
```

### WR-05: SensorDataViz activePhase state is never reset when fixture changes

**File:** `src/components/islands/SensorDataViz.tsx:50,146`
**Issue:** When `scenarioId` changes (navigating between use-case pages), the `fixture` state is replaced by the new fetch, triggering the chart rebuild effect. However, `activePhase` retains its previous value (e.g., `2` if all 3 phases were animated). The new chart's phase dots may initially render in the "active" state before the new timeouts override them, causing a flash of incorrect highlight state.

**Fix:** Reset `activePhase` when `scenarioId` changes, either at the top of the fetch effect or the chart build effect:
```tsx
// At the start of the chart build effect (line 65):
useEffect(() => {
  if (!fixture || !containerRef.current) return;
  setActivePhase(-1); // Reset before animating new phases
  // ... rest of chart setup
}, [fixture, locale]);
```

## Info

### IN-01: Placeholder navigation links use href="#" causing scroll-to-top

**File:** `src/navigation.ts:28-31`
**Issue:** Several navigation items (`Preise`, `Fallstudien`, `Uber uns`, `Kontakt` in DE; `Pricing`, `Case Studies`, `About`, `Contact` in EN) have `href: '#'`. Clicking these will scroll the page to the top without navigating anywhere, which is confusing UX. These are presumably placeholders for future phases.

**Fix:** Either use `href: '#!'` to prevent scroll, add a `disabled` state to the navigation component, or comment them out until the target pages exist.

### IN-02: Unused getAsset import in navigation.ts

**File:** `src/navigation.ts:1`
**Issue:** `getAsset` is imported from `./utils/permalinks` and used only once on line 85 (`getAsset('/rss.xml')`). This is not unused per se, but worth noting that the import exists in the navigation file specifically for the RSS link in the footer data. The function call could be replaced with a direct string if the asset path is static.

**Fix:** No change required. This is informational only -- the `getAsset` call is intentional for build-time asset resolution.

### IN-03: types.d.ts uses HTMLInputTypeAttribute without explicit import

**File:** `src/types.d.ts:165`
**Issue:** The `Input` interface references `HTMLInputTypeAttribute` which is a TypeScript DOM lib type. In a `.d.ts` file this resolves correctly when the `dom` lib is included in `tsconfig.json`, but it creates an implicit dependency on the DOM lib being present. This is expected for a web project but worth documenting.

**Fix:** No change required. The `dom` lib is standard for Astro projects and will always be present.

---

_Reviewed: 2026-04-23T14:32:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
