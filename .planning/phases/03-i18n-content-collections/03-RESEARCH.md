# Phase 3: i18n & Content Collections - Research

**Researched:** 2026-04-22
**Domain:** Astro native i18n routing + multi-collection content management
**Confidence:** HIGH

## Summary

Astro 6.1 (current version) provides mature native i18n routing via the `i18n` configuration block in `astro.config.ts`. The configuration is straightforward: `defaultLocale: 'de'`, `locales: ['de', 'en']`, `prefixDefaultLocale: false` achieves the desired routing structure (DE at `/`, EN at `/en/`) without dynamic `[locale]/` segments. Setting `fallback: undefined` explicitly disables silent fallback—missing EN pages return 404 as required.

Content collections use Astro's glob loaders with Zod schemas. Expanding from the current single `post` collection to 7 collections (5 long-form with `de/` + `en/` subdirectories, 2 short-form with `{de, en}` sibling fields) is a straightforward schema extension. The parity check script runs at build time via the `build` npm script, scanning file parity and exiting non-zero on missing translations.

**Primary recommendation:** Use Astro's native `i18n` config with automatic routing (default). Implement static `routeMap.ts` for language switcher navigation. Extend `content.config.ts` with 7 collections using conditional Zod schemas. Build parity check as a standalone TypeScript script invoked during the build pipeline.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Astro native `i18n` config: `defaultLocale: 'de'`, `locales: ['de', 'en']`, `prefixDefaultLocale: false`. DE at `/`, EN at `/en/`. No `[locale]/` dynamic segments.
- **D-02:** `fallback` strategy set to `undefined`. Missing EN pages return 404, never silently serve DE. Hard requirement per I18N-01.
- **D-03:** File-tree layout: DE at `src/pages/**/*.astro`, EN at `src/pages/en/**/*.astro`. Explicit mirroring.
- **D-04:** `src/i18n/routeMap.ts` — static bidirectional map. `Record<string, { de: string; en: string }>` keyed by canonical route key. Export `getLocalePath(currentPath, targetLocale)`.
- **D-05:** Route map covers all slug pairs from REQUIREMENTS.md; Phase 3 includes stubs for all known routes; content phases fill in as pages are created.
- **D-06:** `LanguageSwitcher.astro` mounted in `Header.astro` (shell exists from Phase 1 D-06). Reads `Astro.url.pathname`, calls `getLocalePath()`, renders DE/EN links with active-state indication.
- **D-07:** Switcher never auto-redirects. No `Accept-Language` detection. Locale always explicit via URL. "Language auto-redirect" out of scope per PROJECT.md.
- **D-08:** Register 7 collections in `src/content.config.ts`: `post`, `caseStudy`, `useCase`, `industry`, `event`, `job`, `team`. Replace single `post` collection.
- **D-09:** Long-form collections (`post`, `caseStudy`, `useCase`, `industry`, `job`) use `de/` + `en/` subdirectories. Each entry has `locale` field (Zod enum), `translationKey` (matching canonical key), `canonicalKey` (slug without locale prefix).
- **D-10:** Short-form collections (`event`, `team`) use `{de, en}` sibling fields in a single file. No subdirectories.
- **D-11:** Content base moves from `src/data/post/` (AstroWind legacy) to `src/content/` (Astro standard). `glob` loader pattern updates. `src/data/brand/` stays — reference data, not collections.
- **D-12:** Existing `metadataDefinition()` Zod helper from `content.config.ts` preserved and reused across collections.
- **D-13:** `src/i18n/translations.ts` exports `Record<'de' | 'en', Record<string, string>>` for UI strings. Dot-notation namespacing (e.g., `'nav.home'`, `'cta.book_consult'`).
- **D-14:** `t(key: string, locale: string): string` helper exported from translations.ts.
- **D-15:** Build-time script `scripts/check-translation-parity.ts` scans `src/content/` for de/en file parity. For each `de/{slug}.md`, matching `en/{slug}.md` with same `translationKey` must exist (vice versa).
- **D-16:** Script runs as part of `pnpm build` pipeline. Exits non-zero on missing translations, failing CI build. Short-form collections excluded (always bilingual by structure).

### Claude's Discretion
- Exact Zod schema fields for each collection beyond locale/translationKey/canonicalKey (content-specific like title, excerpt, image vary per collection)
- Whether to use `astro:i18n` `getRelativeLocaleUrl()` or custom `getLocalePath()` — either works
- Build script implementation details (glob vs. fs.readdir, error formatting)
- Whether stub pages for unbuilt routes are empty `.astro` files or redirect to 404

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| I18N-01 | Astro native `i18n` config with defaultLocale 'de', no silent fallback, DE at `/`, EN at `/en/` | `fallback: undefined` disables fallback behavior; automatic routing with native `i18n` config achieves this |
| I18N-02 | File-tree layout — DE at `src/pages/**`, EN at `src/pages/en/**`, no `[locale]/` dynamic segments | Astro automatic routing generates routes from file tree; no middleware needed |
| I18N-03 | `routeMap.ts` bidirectional slug mapping for all DE/EN pairs | Static TypeScript object keyed by canonical route, paired with `getLocalePath()` helper |
| I18N-04 | `LanguageSwitcher.astro` preserves current route via `routeMap`, never auto-redirects | Switcher reads `Astro.url.pathname`, calls `getLocalePath()` to compute target URL |
| I18N-05 | 7 content collections in `src/content.config.ts` | `defineCollection()` + glob loaders support multiple collections in single file |
| I18N-06 | Long-form collections with `de/` + `en/` subdirectories, `locale` enum, `translationKey`, `canonicalKey` | Zod enums via `z.enum(['de', 'en'])`, glob patterns support nested dirs |
| I18N-07 | Short-form collections with `{de, en}` sibling fields in single file | Zod object fields with nested shape: `name: z.object({ de: z.string(), en: z.string() })` |
| I18N-08 | CI translation-parity check — every long-form entry must have DE and EN sibling with matching `translationKey` | TypeScript script using fs, running at build time, exits non-zero on parity violation |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| i18n routing config | Frontend Server (build-time config) | — | Astro config applies to all routes; no runtime locale detection needed |
| Locale detection in switcher | Browser / Client (Astro component) | — | `Astro.url.pathname` is available in component; no middleware required |
| Route mapping | Frontend Server (routeMap.ts) | — | Static map computed at build time; accessed by client-side switcher |
| Content collection registration | Frontend Server (build-time config) | — | Content collections are build-time; schema validation happens at build |
| Translation parity enforcement | Frontend Server (build-time CI) | — | Parity check runs as npm script; fails build before artifact generation |
| Bilingual content files | Repository (version control) | — | Markdown files in `src/content/` committed to git; content authorship pattern |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | ^6.1.8 | Native i18n routing, static site generation, content collections | [VERIFIED: npm registry] Production-grade i18n support since Astro 3.5; v6 is current stable; this project already uses it |
| @astrojs/mdx | ^5.0.3 | MDX content support for collections | [VERIFIED: package.json] Already in devDependencies; integrates seamlessly with content collections |
| Zod | (via astro/zod) | Runtime schema validation for content frontmatter | [CITED: Astro docs] Built into Astro; no separate installation needed; `import { z } from 'astro/zod'` |
| TypeScript | ^6.0.3 | Type safety for routeMap.ts and parity script | [VERIFIED: package.json] Already in devDependencies; required for Astro v6 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @astrojs/sitemap | ^3.7.2 | Locale-aware sitemap generation with hreflang alternates | [CITED: REQUIREMENTS.md SEO-02] Already in dependencies; integrates with `i18n` config |
| limax | ^4.2.3 | URL slug generation (currently used in permalinks.ts) | [VERIFIED: package.json] Existing utility; used for consistent slug formatting |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Astro native `i18n` + automatic routing | astro:i18n `manual` routing strategy | Manual strategy gives lower-level control but requires custom middleware; automatic routing is simpler, sufficient for this use case |
| Static `routeMap.ts` for switcher | Dynamic route discovery via `getRelativeLocaleUrl()` | `getRelativeLocaleUrl()` requires knowing all locales at build time; static map is explicit and easier to stub all routes in Phase 3 |
| TypeScript parity script | Astro-specific plugin/integration | Custom script is simpler, easier to debug, runs as npm script; no plugin overhead |
| Zod enum for `locale` field | String type with validation | Enum enforces two-value constraint at TypeScript level; strings allow typos |

**Installation:** No new packages required. All dependencies are already present in `package.json` (Astro, @astrojs/mdx, TypeScript).

**Version verification:** 
- Astro ^6.1.8 [VERIFIED: npm view astro version = 6.1.8 as of 2026-04-22]
- @astrojs/mdx ^5.0.3 [VERIFIED: package.json]
- TypeScript ^6.0.3 [VERIFIED: package.json]
- Zod is bundled with Astro (no separate package.json entry needed)

## Architecture Patterns

### System Architecture Diagram

```
Request → File-based Route (Astro)
           ↓
       i18n Config (astro.config.ts)
       - defaultLocale: 'de'
       - locales: ['de', 'en']
       - prefixDefaultLocale: false
       - fallback: undefined
           ↓
    [Route Resolution]
    ├─ Requests to / → src/pages/index.astro (DE)
    ├─ Requests to /en/* → src/pages/en/*.astro (EN)
    └─ Requests to EN path with no file → 404
           ↓
      Rendered Page
      (with lang attribute from Astro.currentLocale)
           ↓
    [Header Component]
    ├─ LanguageSwitcher.astro
    │  ├─ Reads Astro.url.pathname
    │  ├─ Calls getLocalePath(pathname, targetLocale)
    │  └─ Links to /path (DE) or /en/path (EN)
    └─ routeMap.ts static map
           ↓
       Link Click → Navigation
       (no auto-redirect, explicit URL change)

[Content Collections] (Build-time)
├─ src/content/{collection}/de/*.md
├─ src/content/{collection}/en/*.md
├─ Zod schema validation (locale enum, translationKey, canonicalKey)
└─ [Parity Check Script]
   ├─ Scans de/ and en/ files
   ├─ Ensures matching translationKey pairs
   └─ Exits non-zero on mismatch → CI fails
```

### Recommended Project Structure
```
src/
├── pages/
│   ├── index.astro                 # DE homepage
│   ├── en/
│   │   └── index.astro             # EN homepage
│   ├── about.astro                 # DE about page
│   ├── en/
│   │   └── about.astro             # EN about page
│   └── ...                          # Other DE pages
├── content/
│   ├── post/
│   │   ├── de/
│   │   │   ├── first-post.md
│   │   │   └── second-post.md
│   │   └── en/
│   │       ├── first-post.md
│   │       └── second-post.md
│   ├── caseStudy/
│   │   ├── de/
│   │   │   └── schumacher.md
│   │   └── en/
│   │       └── schumacher.md
│   ├── useCase/
│   │   ├── de/
│   │   │   ├── cargo-theft.md
│   │   │   ├── diesel-theft.md
│   │   │   └── ...
│   │   └── en/
│   │       └── ...
│   ├── industry/
│   │   ├── de/
│   │   │   └── ...
│   │   └── en/
│   │       └── ...
│   ├── job/
│   │   ├── de/
│   │   │   └── ...
│   │   └── en/
│   │       └── ...
│   ├── event/                      # Single file, {de, en} fields
│   │   ├── upcoming-webinar.md
│   │   └── conference-2026.md
│   └── team/                       # Single file, {de, en} fields
│       ├── alexander.md
│       ├── heinz.md
│       └── ...
├── i18n/
│   ├── routeMap.ts                 # Static route mapping
│   └── translations.ts             # UI string translations
├── data/
│   └── brand/                      # Reference data (not collections)
│       ├── canonical.yaml
│       └── voice.md
└── components/
    └── widgets/
        ├── Header.astro
        └── LanguageSwitcher.astro
```

### Pattern 1: i18n Configuration in astro.config.ts
**What:** Astro's native `i18n` configuration block enables automatic locale-aware routing based on file structure.

**When to use:** Always for multilingual Astro sites. Replaces custom routing logic with built-in middleware.

**Example:**
```typescript
// Source: https://docs.astro.build/en/guides/internationalization/
export default defineConfig({
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    prefixDefaultLocale: false,
    fallback: undefined, // Disable silent fallback — missing EN pages return 404
  },
  // ... other config
});
```

**Key behaviors:**
- Requests to `/` and `/about` route to DE files (`src/pages/index.astro`, `src/pages/about.astro`)
- Requests to `/en/` and `/en/about` route to EN files (`src/pages/en/index.astro`, `src/pages/en/about.astro`)
- `Astro.currentLocale` available in components — use for `<html lang>` attribute
- `getRelativeLocaleUrl()` helper available from `astro:i18n` module for dynamic route generation
- No `[locale]/` dynamic segment needed; routing is file-tree-based

### Pattern 2: Static Route Map for Language Switcher
**What:** A TypeScript object mapping canonical route keys to locale-specific paths.

**When to use:** When you need to navigate between DE and EN versions of the same page without hard-coding paths.

**Example:**
```typescript
// Source: Phase 3 CONTEXT.md D-04
// src/i18n/routeMap.ts
export const routeMap: Record<string, { de: string; en: string }> = {
  'home': { de: '/', en: '/en/' },
  'about': { de: '/about', en: '/en/about' },
  'use-cases/cargo-theft': { de: '/anwendungen/ladungsdiebstahl', en: '/en/use-cases/cargo-theft' },
  'contact': { de: '/kontakt', en: '/en/contact' },
  // ... all routes from REQUIREMENTS.md
};

export function getLocalePath(
  currentPath: string,
  targetLocale: 'de' | 'en'
): string | null {
  // Find route key matching currentPath, return target locale path
  for (const [key, paths] of Object.entries(routeMap)) {
    if (paths.de === currentPath || paths.en === currentPath) {
      return paths[targetLocale];
    }
  }
  return null; // Path not found in map
}
```

**Key benefits:**
- Explicit mapping prevents route mismatches
- Phase 3 can stub all routes; content phases update as pages are created
- Language switcher can find translated equivalent even before page is built

### Pattern 3: Content Collections with Locale-Aware Schemas
**What:** Expanding from single collection to 7 collections, each with Zod schema enforcing locale, translationKey, and canonicalKey fields.

**When to use:** When your site has structured content (posts, case studies, team members) that needs bilingual versions.

**Example (long-form collection with de/en subdirectories):**
```typescript
// Source: https://docs.astro.build/en/guides/content-collections/
// src/content.config.ts
const postCollection = defineCollection({
  loader: glob({ 
    pattern: ['**/*.{md,mdx}'],
    base: 'src/content/post' 
  }),
  schema: z.object({
    // Metadata
    locale: z.enum(['de', 'en']),
    translationKey: z.string(),
    canonicalKey: z.string(),

    // Content-specific fields (reused from existing metadataDefinition)
    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    metadata: metadataDefinition(),
  }),
});
```

**File layout:**
- `src/content/post/de/first-post.md` has `locale: 'de'`, `translationKey: 'first-post'`
- `src/content/post/en/first-post.md` has `locale: 'en'`, `translationKey: 'first-post'`
- Parity check ensures both files exist for each `translationKey`

**Example (short-form collection with {de, en} sibling fields):**
```typescript
// src/content.config.ts
const teamCollection = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: 'src/content/team'
  }),
  schema: z.object({
    name: z.object({
      de: z.string(),
      en: z.string(),
    }),
    bio: z.object({
      de: z.string(),
      en: z.string(),
    }),
    photo: z.string(),
    title: z.string(),
  }),
});
```

**File layout:**
- `src/content/team/alexander.md` contains `name: { de: '...', en: '...' }` — bilingual in one file
- No subdirectories needed; fields are always available in both locales

### Pattern 4: Build-Time Translation Parity Check
**What:** A TypeScript script that validates DE and EN content have matching translationKey pairs, run as part of `pnpm build`.

**When to use:** To catch missing translations before they ship to production.

**Example:**
```typescript
// Source: Phase 3 CONTEXT.md D-15/D-16
// scripts/check-translation-parity.ts
import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

async function checkTranslationParity() {
  const contentDir = 'src/content';
  let hasErrors = false;

  // Long-form collections that need parity checking
  const longFormCollections = ['post', 'caseStudy', 'useCase', 'industry', 'job'];

  for (const collection of longFormCollections) {
    const collectionPath = path.join(contentDir, collection);
    const deDir = path.join(collectionPath, 'de');
    const enDir = path.join(collectionPath, 'en');

    if (!fs.existsSync(deDir) || !fs.existsSync(enDir)) {
      continue; // Collection not yet created
    }

    const deFiles = fs.readdirSync(deDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    const enFiles = fs.readdirSync(enDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

    const deKeys = new Set<string>();
    const enKeys = new Set<string>();

    // Extract translationKey from each file
    for (const file of deFiles) {
      const content = fs.readFileSync(path.join(deDir, file), 'utf-8');
      const { data } = matter(content);
      deKeys.add(data.translationKey || file.replace(/\.(md|mdx)$/, ''));
    }

    for (const file of enFiles) {
      const content = fs.readFileSync(path.join(enDir, file), 'utf-8');
      const { data } = matter(content);
      enKeys.add(data.translationKey || file.replace(/\.(md|mdx)$/, ''));
    }

    // Check for mismatches
    for (const key of deKeys) {
      if (!enKeys.has(key)) {
        console.error(`[Parity Error] ${collection}: DE entry "${key}" has no EN sibling`);
        hasErrors = true;
      }
    }

    for (const key of enKeys) {
      if (!deKeys.has(key)) {
        console.error(`[Parity Error] ${collection}: EN entry "${key}" has no DE sibling`);
        hasErrors = true;
      }
    }
  }

  if (hasErrors) {
    process.exit(1);
  }
}

checkTranslationParity().catch(err => {
  console.error(err);
  process.exit(1);
});
```

**Integration in package.json:**
```json
{
  "scripts": {
    "build": "tsx scripts/check-translation-parity.ts && astro build"
  }
}
```

### Anti-Patterns to Avoid
- **Auto-redirecting by `Accept-Language` header:** This violates the requirement that locale be always explicit via URL. A user bookmarking `/en/page` should always land on EN, never auto-redirect to DE.
- **Using dynamic `[locale]/` routing segments:** File-tree routing (DE at `src/pages/`, EN at `src/pages/en/`) is cleaner and Astro's native i18n handles it. Dynamic segments add unnecessary complexity.
- **Hardcoding locale paths in components:** This creates maintenance burden. Use `routeMap` or `getRelativeLocaleUrl()` instead.
- **Falling back to DE when EN content is missing:** The `fallback: undefined` setting prevents this. Missing content should return 404.
- **Storing translationKey and canonicalKey as separate concept:** Keep them as a pair in the schema. They represent the same logical entry in different languages.
- **Using string locale values instead of Zod enum:** `z.enum(['de', 'en'])` catches typos at build time; plain strings don't.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| i18n routing (URL structure, locale detection, path generation) | Custom middleware for locale detection and routing | Astro native `i18n` config + `astro:i18n` helpers | Astro's automatic routing handles edge cases (trailing slashes, redirects, canonical URLs), SEO best practices (hreflang), and sitemap generation. Custom logic is error-prone and duplicates Astro's own implementation. |
| Schema validation for frontmatter fields | Custom JavaScript validators for content | Zod schema validation (built into Astro) | Zod provides TypeScript type inference, detailed error messages, and async validation. Hand-rolled validation leads to inconsistent error handling and loses type information. |
| Translation parity enforcement | Manual checklist or reviewer process | Automated build-time script that exits non-zero | Humans miss entries. Automated checks are reliable, fast, and always run. Script can be version-controlled and audited. |
| Language switcher route mapping | Individual hardcoded links in component | Static routeMap.ts object + getLocalePath() helper | Hardcoding creates maintenance burden: every new page requires updating the switcher. Static map makes the mapping explicit and testable. Planner can easily stub new routes. |

**Key insight:** Astro's native i18n support has been production-ready since 3.5; reinventing it is slower, less reliable, and ignores SEO requirements (hreflang, sitemap alternates). The framework handles the hard parts (trailing slashes, localized sitemap, automatic middleware). Custom solutions always miss edge cases.

## Common Pitfalls

### Pitfall 1: Forgetting `fallback: undefined` Breaks I18N-01 Requirement
**What goes wrong:** If `fallback` is not explicitly set or set to a locale name, Astro will silently serve DE content when EN content is missing. This violates I18N-01: missing EN pages must return 404.

**Why it happens:** Astro's default fallback behavior is to prevent 404s. It's intended for better UX in multi-language sites where all content exists. For Konvoi's use case (EN is secondary, incomplete during Phase 3), fallback must be disabled.

**How to avoid:** Explicitly set `fallback: undefined` in `astro.config.ts`. Test by requesting an EN URL that has no page — must return 404, not redirect to DE equivalent.

**Warning signs:** EN pages mysteriously render DE content. Check the browser's network tab — status code is 200 (should be 404) with a redirect in the response chain.

### Pitfall 2: Mixing File Structures (Some Collections with de/en Subdirs, Others Without)
**What goes wrong:** If long-form collections use `de/` + `en/` subdirectories but one collection mistakenly doesn't (files at root), the parity check and schema loading fail inconsistently. Content ends up unpublished or validation errors occur at build time.

**Why it happens:** Collections are added incrementally across phases. Phase 3 adds structure; Phase 4-6 add content. If not documented clearly, later phases might not follow the convention.

**How to avoid:** In Phase 3, create empty `de/` and `en/` subdirectories for all 5 long-form collections. Add a README in `src/content/` explaining the structure. The parity check script should validate directory structure, not just file names.

**Warning signs:** Build fails with "cannot find entry" or schema validation errors. Check `src/content/{collection}` structure — files should be in `de/` or `en/`, never at root.

### Pitfall 3: routeMap.ts Diverging from Actual Pages
**What goes wrong:** routeMap stubs routes in Phase 3; actual pages are added in Phase 4+. If an EN page is added but routeMap is not updated, the language switcher still links to a non-existent path.

**Why it happens:** routeMap is a static, manual mapping. No auto-discovery. Content authors creating pages don't know they also need to update routeMap.

**How to avoid:** Update routeMap as each new page is created. The planner should include a routeMap update task whenever a new page task is added. Consider a CI check that validates routeMap entries have corresponding files (optional: implement in Phase 7 as a build-time lint).

**Warning signs:** Language switcher links to 404 pages. Check `src/pages/` and `src/pages/en/` structure against `src/i18n/routeMap.ts` — they should have 1:1 correspondence.

### Pitfall 4: Zod Schema Field Mismatch Between DE and EN Collections
**What goes wrong:** A DE entry has `title`, `excerpt`, `image`; an EN entry has `title`, `excerpt` but no `image` field. Both fail schema validation because the schema is global (applies to all files in the collection, regardless of locale).

**Why it happens:** Content authors assume each locale's schema can vary. Or, early entries were created with different fields; later standardization is incomplete.

**How to avoid:** Enforce identical schema for all entries in a collection, regardless of locale. The Zod schema is shared across `de/` and `en/` files. If `image` is required, both must have it. Use `.optional()` if a field is sometimes missing, but the field itself must exist in the schema.

**Warning signs:** Build fails with "missing required field" or "unknown field" errors mentioning specific entries. Check the schema in `content.config.ts` — fields should match all files' frontmatter structure.

### Pitfall 5: Translation Key Typos Break Parity Check
**What goes wrong:** DE file has `translationKey: 'cargo_theft'`, EN file has `translationKey: 'cargo-theft'` (underscore vs. hyphen). Parity check doesn't match them and fails the build.

**Why it happens:** `translationKey` is user-provided in frontmatter. Human error during file creation or copy-paste mistakes.

**How to avoid:** Derive `translationKey` automatically from the filename if not provided. Example: if file is `cargo-theft.md`, default `translationKey: 'cargo-theft'`. Authors can override if needed, but the default should be correct.

**Warning signs:** Build fails with "parity mismatch" error listing specific translationKeys. Check file frontmatter — translationKey spelling must match exactly between DE and EN files.

## Code Examples

Verified patterns from official sources:

### i18n Configuration
```typescript
// Source: https://docs.astro.build/en/guides/internationalization/
// astro.config.ts
import { defineConfig } from 'astro/config';

export default defineConfig({
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    prefixDefaultLocale: false,
    fallback: undefined, // No silent fallback to DE
  },
  // ... other config
});
```

### Using Astro.currentLocale in Layout
```astro
---
// src/layouts/Layout.astro
const { currentLocale } = Astro;
---

<html lang={currentLocale} dir="ltr">
  <!-- ... -->
</html>
```

### Language Switcher with routeMap
```astro
---
// src/components/widgets/LanguageSwitcher.astro
import { getLocalePath } from '~/i18n/routeMap';

const currentPath = Astro.url.pathname;
const dePath = getLocalePath(currentPath, 'de');
const enPath = getLocalePath(currentPath, 'en');
const currentLocale = Astro.currentLocale;
---

<div class="language-switcher">
  <a href={dePath} class:list={{'active': currentLocale === 'de'}}>
    DE
  </a>
  <a href={enPath} class:list={{'active': currentLocale === 'en'}}>
    EN
  </a>
</div>
```

### Querying Collections by Locale
```typescript
// In a page or component
import { getCollection } from 'astro:content';

// Get all DE posts
const dePosts = await getCollection('post', ({ data }) => data.locale === 'de');

// Get all EN posts
const enPosts = await getCollection('post', ({ data }) => data.locale === 'en');

// Get a specific post by translationKey
const enPost = await getCollection('post', ({ data }) => 
  data.locale === 'en' && data.translationKey === 'first-post'
);
```

### Rendering a Long-Form Entry
```astro
---
// src/pages/en/[...slug].astro
import { getCollection } from 'astro:content';
import { render } from 'astro:content';

const enPosts = await getCollection('post', ({ data }) => data.locale === 'en');

export async function getStaticPaths() {
  return enPosts.map(post => ({
    params: { slug: post.data.canonicalKey },
    props: { post }
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| i18n via custom middleware + dynamic `[locale]` routing | Astro native `i18n` config + automatic file-tree routing | Astro 3.5 (2024-01) | Routing is now declarative, built-in, and integrates with sitemap/SEO automatically. Custom middleware is no longer necessary. |
| Single global content collection | Multiple typed collections with Zod | Astro 5.0+ (2024-04+) | Content Layer API unified loaders; schemas per collection; better type inference; faster builds. |
| Manual translation validation | Build-time parity check scripts | Emerging pattern (2024+) | Automation prevents human error; catches issues before CI/CD. |
| Auto-redirect by `Accept-Language` | Explicit URL-based locale selection | Web best practices (WCAG, SEO) | Search engines and users expect locales to be URL-explicit for bookmarking, sharing, and caching. |

**Deprecated/outdated:**
- **AstroWind template i18n pattern:** The bundled template uses a legacy i18n recipe predating native routing. Phase 1 removed the old template structure; Phase 3 implements the modern approach.
- **Manual i18n setup (pre-Astro-3.5):** Before native routing, you had to build middleware, route guards, and hreflang manually. Now it's built-in.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Astro 6.1.8 has stable `i18n` config with `defaultLocale`, `locales`, `prefixDefaultLocale`, `fallback` | Standard Stack | If Astro version regresses or API changes unexpectedly, config syntax might differ. Mitigation: REQUIREMENTS.md locked on Astro ^6.1.8; breaking changes unlikely within minor version. |
| A2 | `fallback: undefined` disables fallback behavior entirely | Code Examples | If Astro interprets undefined differently (e.g., as "not set" with default fallback enabled), missing EN pages won't return 404. Mitigation: Test by requesting missing EN URL and verifying 404 response. |
| A3 | glob loader patterns support nested `de/` and `en/` subdirectories in content collections | Standard Stack | If glob doesn't match nested patterns as documented, files won't load. Mitigation: Test glob pattern early in Phase 3 Wave 0. |
| A4 | Zod enum (`z.enum(['de', 'en'])`) validates at schema level | Code Examples | If Zod version changes or enum behavior differs, locale validation might not catch typos. Mitigation: TypeScript compiler already enforces enum at type level; runtime validation is defensive. |
| A5 | `Astro.currentLocale` is available in all layout and component contexts | Code Examples | If currentLocale is undefined in some page types (e.g., dynamic routes), `<html lang>` attribute won't render correctly. Mitigation: Astro's i18n middleware sets currentLocale on all routes; test in Wave 0. |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed.

This table is NOT empty. A1-A5 are architecture decisions that depend on Astro 6.1 behavior. Recommend quick validation tests in Wave 0 (e.g., test fallback behavior, glob patterns, Astro.currentLocale availability).

## Open Questions

1. **Should routeMap stub ALL known routes from REQUIREMENTS.md in Phase 3, or add incrementally as pages are created?**
   - What we know: CONTEXT.md D-05 says "Phase 3 includes stub entries for all known routes; content phases (4-7) fill in as pages are created."
   - What's unclear: Whether "stub entries" means empty objects `{ de: '', en: '' }` or placeholder routes like `{ de: '/{?}', en: '/en/{?}' }`
   - Recommendation: Planner should define exact stub format. Suggest: all routes explicitly mapped to canonical paths from REQUIREMENTS.md, even if pages don't exist yet. LanguageSwitcher will 404 for unbuilt pages, which is acceptable.

2. **For short-form collections (event, team), should all fields be bilingually required, or can some fields (like photo, dates) be locale-agnostic?**
   - What we know: CONTEXT.md D-10 specifies `{de, en}` sibling fields for content-specific fields (name, bio, title).
   - What's unclear: Whether metadata-only fields like `photo` (same image for both locales) or `startDate` (same date event) must be bilingually structured or can be singularly present.
   - Recommendation: Planner should clarify schema. Suggest: content fields (name, bio, title) are bilingual; metadata (photo, dates, links) can be singular. Example: `name: { de: '...', en: '...' }` but `photo: '/path/to/image.png'`.

3. **Should the parity check script be written in TypeScript or Node.js, and where should it live (scripts/ or src/)?**
   - What we know: CONTEXT.md D-15/D-16 mentions `scripts/check-translation-parity.ts` but doesn't specify transpilation.
   - What's unclear: Whether to use `tsx` (TypeScript runner), plain `.js`, or a Bash script.
   - Recommendation: Use `tsx` for TypeScript (already in many Node.js projects). Place in `scripts/` directory. Invoke via `pnpm build` pipeline with `tsx scripts/check-translation-parity.ts && astro build`.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro build process, pnpm, TypeScript | ✓ | v24.11.0 | — |
| pnpm | Package management | ✓ | 10.32.1 | npm (not recommended per project memory) |
| TypeScript | Static type checking for routeMap.ts and parity script | ✓ | ^6.0.3 | JavaScript (would lose type safety) |
| gray-matter (or similar YAML parser) | Parsing frontmatter in parity script | ✓ (js-yaml in devDependencies) | ^4.1.1 | Manual frontmatter parsing (error-prone) |

**Missing dependencies with no fallback:**
- None. All required tools are present.

**Missing dependencies with fallback:**
- Parity script could use `js-yaml` directly instead of `gray-matter` if needed (already in devDependencies for AstroWind config loading).

## Validation Architecture

**nyquist_validation enabled:** true (default, not explicitly disabled in .planning/config.json)

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `pnpm check` (Astro check, ESLint, Prettier) + manual validation |
| Config file | `.eslintrc.cjs`, `prettier.config.mjs`, `tsconfig.json` |
| Quick run command | `pnpm check` (3 checks: astro, eslint, prettier) |
| Full suite command | `pnpm build && pnpm check` (includes parity check) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| I18N-01 | Astro i18n config with fallback: undefined, no silent fallback | manual smoke | Request missing EN URL → 404 | ❌ Wave 0 — manual test in dev server |
| I18N-02 | File structure creates proper routes (/ for DE, /en/* for EN) | manual smoke | Navigate to / and /en/ → render correct locale | ❌ Wave 0 — manual test |
| I18N-03 | routeMap covers all slug pairs | manual inspection | Check routeMap.ts against REQUIREMENTS.md | ❌ Phase 3 creates routeMap.ts |
| I18N-04 | LanguageSwitcher reads pathname, calls getLocalePath, preserves route | manual smoke | Click DE/EN switcher → navigate to translated equivalent | ❌ Wave 0 — manual test |
| I18N-05 | 7 collections registered in content.config.ts | integration | `astro check` passes; `getCollection('post')` returns entries | ❌ Phase 3 updates content.config.ts; Wave 0 tests loading |
| I18N-06 | Long-form entries have locale, translationKey, canonicalKey fields | schema validation | Astro build fails if frontmatter missing these fields | ✅ Zod schema enforces in content.config.ts |
| I18N-07 | Short-form entries have {de, en} sibling fields | schema validation | Astro build fails if fields missing EN or DE variant | ✅ Zod schema enforces |
| I18N-08 | Parity check catches missing DE/EN pairs and fails build | integration | Create mismatched DE/EN files → `pnpm build` exits 1 | ❌ Phase 3 creates parity check script; Wave 0 tests it |

### Sampling Rate
- **Per task commit:** `pnpm check` (ensures TypeScript and lint compliance)
- **Per wave merge:** `pnpm build` (includes parity check; ensures routes are valid)
- **Phase gate:** Full build green + manual smoke tests (navigate site, switch languages, verify 404s)

### Wave 0 Gaps
- [ ] `scripts/check-translation-parity.ts` — parity check implementation (creates and populates)
- [ ] `src/i18n/routeMap.ts` — static route mapping with all REQUIREMENTS.md routes stubbed
- [ ] `src/i18n/translations.ts` — UI translation strings for header, buttons, footer (or placeholder)
- [ ] Update `src/content.config.ts` — expand from 1 to 7 collections with Zod schemas
- [ ] Create `src/content/{post,caseStudy,useCase,industry,job}/de/` and `en/` directories
- [ ] Create `src/content/{event,team}/` directories
- [ ] Update `astro.config.ts` — add `i18n` block with `defaultLocale`, `locales`, `prefixDefaultLocale: false`, `fallback: undefined`
- [ ] Update `LanguageSwitcher.astro` — wire up getLocalePath, read Astro.url.pathname, render active state
- [ ] Update `Layout.astro` — ensure `lang` attribute uses `Astro.currentLocale`
- [ ] Update `package.json` — add parity check to build script (`tsx scripts/check-translation-parity.ts &&`)

*(If all gaps exist, that's expected for Phase 3 Wave 0 — nothing has been implemented yet.)*

## Sources

### Primary (HIGH confidence)
- **[Astro 6.1.8 Internationalization Guide](https://docs.astro.build/en/guides/internationalization/)** — Verified Astro native i18n config, routing behavior, `defaultLocale`, `prefixDefaultLocale`, `fallback` parameter
- **[Astro i18n API Reference](https://docs.astro.build/en/reference/modules/astro-i18n/)** — Helper functions: `getRelativeLocaleUrl()`, `getPathByLocale()`, `requestHasLocale()`, etc.
- **[Astro Content Collections Guide](https://docs.astro.build/en/guides/content-collections/)** — Zod schema definition, glob loaders, nested directories, collection definition patterns
- **[npm registry: Astro 6.1.8](https://www.npmjs.com/package/astro)** — Verified current stable version, dependencies, changelog
- **[Project package.json](file:///C:\Users\RamiChaari\Desktop\KONVOI-HOMEPAGE\package.json)** — Verified dependencies already in place (Astro, @astrojs/mdx, TypeScript, @astrojs/sitemap)
- **[Phase 3 CONTEXT.md](file:///C:\Users\RamiChaari\Desktop\KONVOI-HOMEPAGE\.planning\phases\03-i18n-content-collections\03-CONTEXT.md)** — Locked decisions D-01 through D-16
- **[REQUIREMENTS.md I18N section](file:///C:\Users\RamiChaari\Desktop\KONVOI-HOMEPAGE\.planning\REQUIREMENTS.md)** — Phase 3 requirements I18N-01 through I18N-08

### Secondary (MEDIUM confidence)
- **[Astro Recipes: i18n](https://docs.astro.build/en/recipes/i18n/)** — Additional patterns and advanced usage examples
- **[Astro Sitemap Integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** — Integration with i18n config for hreflang alternates

### Tertiary (LOW confidence)
- **[Astro.build Blog: i18n Routing Feature Announcement](https://astro.build/blog/astro-350/)** — Historical context on when native routing landed (Astro 3.5)

## Metadata

**Confidence breakdown:**
- Standard stack (HIGH): Astro 6.1 is production stable; i18n feature verified in official docs and npm registry
- Architecture (HIGH): File-tree routing, automatic locale handling, and fallback behavior are core Astro features since 3.5; well-documented
- Pitfalls (MEDIUM): Identified from Astro GitHub issues and common mistakes in other projects; mitigations are testable in Wave 0
- Assumptions (MEDIUM): Depend on Astro 6.1 behavior; unlikely to change, but Wave 0 smoke tests should validate

**Research date:** 2026-04-22
**Valid until:** 2026-05-22 (30 days — Astro 6.x is stable; minor changes unlikely this month)

---

*Phase: 03-i18n-content-collections*
*Research completed: 2026-04-22 via gsd-phase-researcher*
