# Phase 3: i18n & Content Collections - Pattern Map

**Mapped:** 2026-04-22
**Files analyzed:** 8 new/modified files
**Analogs found:** 7 / 8 (87.5%)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `astro.config.ts` | config | build-time | `astro.config.ts` (current) | exact |
| `src/i18n/routeMap.ts` | utility | transform | `src/utils/permalinks.ts` | role-match |
| `src/i18n/translations.ts` | utility | transform | `src/config.yaml` (i18n section) | role-match |
| `src/components/widgets/LanguageSwitcher.astro` | component | request-response | `src/components/widgets/Header.astro` | role-match |
| `src/content.config.ts` | config | build-time | `src/content.config.ts` (current) | exact |
| `scripts/check-translation-parity.ts` | script | batch | No existing analog | none |
| `package.json` | config | build-time | `package.json` (current) | exact |
| `src/layouts/Layout.astro` | layout | request-response | `src/layouts/Layout.astro` (current) | exact |

---

## Pattern Assignments

### `astro.config.ts` (config, build-time)

**Analog:** Current `astro.config.ts` (Phase 1)

**Current Config Pattern** (lines 1-76):
```typescript
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';

// Integrations imported at top level
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import compress from 'astro-compress';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: 'static',
  
  integrations: [
    sitemap(),
    mdx(),
    // ... other integrations
  ],
  
  // config blocks follow
  image: { ... },
  markdown: { ... },
  vite: { ... }
});
```

**Add i18n Configuration Block** — Insert after `output: 'static'` and before `integrations`:
```typescript
i18n: {
  defaultLocale: 'de',
  locales: ['de', 'en'],
  prefixDefaultLocale: false,
  fallback: undefined, // No silent fallback — missing EN pages return 404
},
```

**Why this pattern:** Astro's native `i18n` config is declarative and integrates automatically with routing and sitemap generation. Positioned early in the config object for clarity. The `fallback: undefined` is critical per I18N-01 requirement.

---

### `src/i18n/routeMap.ts` (utility, transform)

**Analog:** `src/utils/permalinks.ts`

**Import Pattern** (lines 1-5 of permalinks.ts):
```typescript
import slugify from 'limax';
import { SITE, APP_BLOG } from 'astrowind:config';
import { trim } from '~/utils/utils';
```

**Apply to routeMap.ts:**
```typescript
// No external dependencies needed; use TypeScript primitives and standard exports
export const routeMap: Record<string, { de: string; en: string }> = {
  // ...
};

export function getLocalePath(currentPath: string, targetLocale: 'de' | 'en'): string | null {
  // ...
}
```

**Core Transform Pattern** (lines 42-87 from permalinks.ts):
```typescript
export const getPermalink = (slug = '', type = 'page'): string => {
  let permalink: string;

  if (
    slug.startsWith('https://') ||
    slug.startsWith('http://') ||
    slug.startsWith('://') ||
    slug.startsWith('#') ||
    slug.startsWith('javascript:')
  ) {
    return slug;
  }

  switch (type) {
    case 'home':
      permalink = getHomePermalink();
      break;
    // ... cases
    default:
      permalink = createPath(slug);
      break;
  }

  return definitivePermalink(permalink);
};
```

**Apply to getLocalePath:** Similar pattern — take input (currentPath), find matching route key in routeMap, return target locale's path. Guard against null/undefined.

**Error Handling Pattern:**
```typescript
// Return null if path not found (similar to how getPermalink uses switch/default)
export function getLocalePath(
  currentPath: string,
  targetLocale: 'de' | 'en'
): string | null {
  for (const [key, paths] of Object.entries(routeMap)) {
    if (paths.de === currentPath || paths.en === currentPath) {
      return paths[targetLocale];
    }
  }
  return null; // Path not in map
}
```

**Why this pattern:** Follows the project's existing utility structure (modular functions, clear switch/default fallback logic, TypeScript typing). The route map itself is a static record (no dynamic imports or state).

---

### `src/i18n/translations.ts` (utility, transform)

**Analog:** `src/config.yaml` (i18n section, lines 29-31)

**Current i18n Config Pattern:**
```yaml
i18n:
  language: de
  textDirection: ltr
```

**Apply to translations.ts:**
```typescript
// Flat, dot-notation keys following project conventions
export const translations: Record<'de' | 'en', Record<string, string>> = {
  de: {
    'nav.home': 'Startseite',
    'nav.about': 'Über Uns',
    'nav.contact': 'Kontakt',
    'cta.book_consult': 'Beratung buchen',
    'footer.copyright': '© Konvoi',
    // ... other UI strings
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'cta.book_consult': 'Book Consultation',
    'footer.copyright': '© Konvoi',
    // ... other UI strings
  },
};

export function t(key: string, locale: 'de' | 'en'): string {
  return translations[locale]?.[key] ?? key;
}
```

**Import Pattern** (from src/config.yaml usage):
```typescript
// No imports needed; self-contained record and helper
// Exported for use in components: import { t } from '~/i18n/translations'
```

**Why this pattern:** Mirrors the config.yaml structure but as TypeScript for type safety. Flat dot-notation matches existing project conventions (seen in AstroWind config). Helper function `t()` follows the project's utility pattern of exporting helper functions.

---

### `src/components/widgets/LanguageSwitcher.astro` (component, request-response)

**Analog:** `src/components/widgets/Header.astro` (Phase 1 shell — lines 1-49)

**Current Shell Pattern** (lines 1-7):
```astro
---
import { Icon } from 'astro-icon/components';
import Logo from '~/components/Logo.astro';
import ToggleTheme from '~/components/common/ToggleTheme.astro';
import ToggleMenu from '~/components/common/ToggleMenu.astro';
import Button from '~/components/ui/Button.astro';
import LanguageSwitcher from '~/components/widgets/LanguageSwitcher.astro';
```

**Current LanguageSwitcher Shell** (lines 1-39):
```astro
---
const currentLang = 'de';
---

<div class="flex items-center gap-1 ml-2 text-sm font-medium" aria-label="Language switcher (coming soon)">
  <button
    type="button"
    class:list={[
      'px-2 py-1 rounded transition-colors',
      currentLang === 'de'
        ? 'text-default font-semibold underline underline-offset-2'
        : 'text-muted hover:text-default',
    ]}
    aria-current={currentLang === 'de' ? 'true' : undefined}
    disabled
    title="Deutsch (aktiv)"
  >
    DE
  </button>
  <span class="text-muted" aria-hidden="true">|</span>
  <button
    type="button"
    class:list={[
      'px-2 py-1 rounded transition-colors',
      currentLang === 'en'
        ? 'text-default font-semibold underline underline-offset-2'
        : 'text-muted hover:text-default',
    ]}
    aria-current={currentLang === 'en' ? 'true' : undefined}
    disabled
    title="English (coming soon)"
  >
    EN
  </button>
</div>
```

**Wire Up Pattern — Apply to LanguageSwitcher.astro:**
```astro
---
import { getLocalePath } from '~/i18n/routeMap';

// Read current path from request
const currentPath = Astro.url.pathname;
const currentLocale = Astro.currentLocale; // Available from i18n config

// Get target locale paths
const dePath = getLocalePath(currentPath, 'de');
const enPath = getLocalePath(currentPath, 'en');
---

<div class="flex items-center gap-1 ml-2 text-sm font-medium" aria-label="Language switcher">
  <a
    href={dePath || '/'}
    class:list={[
      'px-2 py-1 rounded transition-colors',
      currentLocale === 'de'
        ? 'text-default font-semibold underline underline-offset-2'
        : 'text-muted hover:text-default',
    ]}
    aria-current={currentLocale === 'de' ? 'page' : undefined}
    title="Deutsch"
  >
    DE
  </a>
  <span class="text-muted" aria-hidden="true">|</span>
  <a
    href={enPath || '/en/'}
    class:list={[
      'px-2 py-1 rounded transition-colors',
      currentLocale === 'en'
        ? 'text-default font-semibold underline underline-offset-2'
        : 'text-muted hover:text-default',
    ]}
    aria-current={currentLocale === 'en' ? 'page' : undefined}
    title="English"
  >
    EN
  </a>
</div>
```

**Key Changes:**
- Remove hardcoded `currentLang = 'de'`
- Import `getLocalePath` from routeMap
- Use `Astro.url.pathname` to read current path
- Use `Astro.currentLocale` for active state (provided by i18n config)
- Replace `<button disabled>` with `<a href>` for actual navigation
- Fallback to home paths if current path not in routeMap
- Update `aria-current` to use 'page' value (ARIA best practice)

**Why this pattern:** Preserves the existing shell's styling (class structure, gap spacing, text styling). Follows Header.astro's pattern of reading `Astro.url` and using project's utility imports (`~/` path alias). Maintains accessibility with proper `aria-current` attributes.

---

### `src/content.config.ts` (config, build-time)

**Analog:** Current `src/content.config.ts` (lines 1-72)

**Current Import and Helper Pattern** (lines 1-48):
```typescript
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),
      canonical: z.url().optional(),
      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),
      description: z.string().optional(),
      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),
      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();
```

**Current Collection Definition Pattern** (lines 50-72):
```typescript
const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});

export const collections = {
  post: postCollection,
};
```

**Apply to Phase 3 Expansion** — Keep metadataDefinition() helper, expand collections:

**Long-form collection pattern** (5 collections: post, caseStudy, useCase, industry, job):
```typescript
const postCollection = defineCollection({
  loader: glob({
    pattern: ['**/*.{md,mdx}'],
    base: 'src/content/post' // Changes from 'src/data/post'
  }),
  schema: z.object({
    // i18n fields (new in Phase 3)
    locale: z.enum(['de', 'en']),
    translationKey: z.string(),
    canonicalKey: z.string(),

    // Existing fields reused from current post schema
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});
```

**Short-form collection pattern** (2 collections: event, team):
```typescript
const teamCollection = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: 'src/content/team'
  }),
  schema: z.object({
    // Bilingual sibling fields (new in Phase 3)
    name: z.object({
      de: z.string(),
      en: z.string(),
    }),
    bio: z.object({
      de: z.string(),
      en: z.string(),
    }),
    // Shared metadata (not bilingual)
    photo: z.string(),
    title: z.string(),
  }),
});
```

**Export all 7 collections:**
```typescript
export const collections = {
  post: postCollection,
  caseStudy: caseStudyCollection,
  useCase: useCaseCollection,
  industry: industryCollection,
  job: jobCollection,
  event: eventCollection,
  team: teamCollection,
};
```

**Why this pattern:** Reuses the existing `metadataDefinition()` helper and glob loader pattern. Adds locale-aware fields (enum + string keys) per CONTEXT.md D-09 and D-10. Changes base path from `src/data/post` to `src/content/post` (Astro standard). Maintains consistent schema structure across collections.

---

### `scripts/check-translation-parity.ts` (script, batch)

**Analog:** No direct analog in codebase. Based on RESEARCH.md Pattern 4 (lines 340-407) and frontmatter parsing utilities in `src/utils/frontmatter.ts`.

**Frontmatter Parsing Reference** (from RESEARCH.md — using gray-matter or similar):
```typescript
import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
// gray-matter is not in package.json, but js-yaml is available (line 55)
// Use simple regex-based YAML front matter parsing instead
```

**Build Script Pattern** (from package.json lines 10-22):
```json
"scripts": {
  "build": "astro build",
  // Will become: "build": "tsx scripts/check-translation-parity.ts && astro build",
  // Pattern: Run parity check first, exit non-zero on error, then build
}
```

**Recommended Implementation Pattern:**
```typescript
import * as fs from 'fs';
import * as path from 'path';

async function checkTranslationParity() {
  const contentDir = 'src/content';
  let hasErrors = false;

  // Long-form collections requiring parity checking
  const longFormCollections = ['post', 'caseStudy', 'useCase', 'industry', 'job'];

  for (const collection of longFormCollections) {
    const collectionPath = path.join(contentDir, collection);
    const deDir = path.join(collectionPath, 'de');
    const enDir = path.join(collectionPath, 'en');

    // Skip if directories don't exist yet (Phase 3 creates empty dirs)
    if (!fs.existsSync(deDir) || !fs.existsSync(enDir)) {
      continue;
    }

    const deFiles = fs.readdirSync(deDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    const enFiles = fs.readdirSync(enDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

    const deKeys = new Set<string>();
    const enKeys = new Set<string>();

    // Parse frontmatter and extract translationKey
    for (const file of deFiles) {
      const content = fs.readFileSync(path.join(deDir, file), 'utf-8');
      const translationKey = extractTranslationKey(content, file);
      deKeys.add(translationKey);
    }

    for (const file of enFiles) {
      const content = fs.readFileSync(path.join(enDir, file), 'utf-8');
      const translationKey = extractTranslationKey(content, file);
      enKeys.add(translationKey);
    }

    // Check bidirectional parity
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
    process.exit(1); // Fail build
  }

  console.log('✓ Translation parity check passed');
}

// Helper: Extract translationKey from YAML frontmatter
function extractTranslationKey(content: string, filename: string): string {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    const fm = fmMatch[1];
    const keyMatch = fm.match(/translationKey:\s*['"]?([^'"\\n]+)['"]?/);
    if (keyMatch) {
      return keyMatch[1];
    }
  }
  // Fallback: use filename without extension
  return filename.replace(/\.(md|mdx)$/, '');
}

checkTranslationParity().catch(err => {
  console.error(err);
  process.exit(1);
});
```

**Integration with package.json:**
```json
{
  "scripts": {
    "build": "tsx scripts/check-translation-parity.ts && astro build"
  },
  "devDependencies": {
    "tsx": "^4.x.x" // May need to add if not present
  }
}
```

**Why this pattern:** Uses Node.js built-in `fs` for file I/O (no new dependencies). Simple regex-based YAML parsing (gray-matter not in package.json, but approach is compatible). Follows the research recommendation (RESEARCH.md lines 340-407) with practical adjustments for project dependencies. Exit codes follow Unix convention (0 = success, 1 = error) for CI integration.

---

### `package.json` (config, build-time)

**Analog:** Current `package.json` (lines 10-22)

**Current Build Script Pattern** (line 13):
```json
"scripts": {
  "build": "astro build",
}
```

**Update Pattern:**
```json
{
  "scripts": {
    "build": "tsx scripts/check-translation-parity.ts && astro build"
  }
}
```

**Consideration:** Verify that `tsx` is available in devDependencies. If not, add it:
```json
{
  "devDependencies": {
    "tsx": "^4.7.0"
  }
}
```

**Why this pattern:** Follows the project's existing convention of chaining scripts with `&&`. The parity check runs before Astro build; if it fails (exits 1), the build is skipped. Aligns with CI best practices (fail fast, early validation).

---

### `src/layouts/Layout.astro` (layout, request-response)

**Analog:** Current `src/layouts/Layout.astro` (lines 1-52)

**Current Pattern** (lines 1-31):
```astro
---
import '~/assets/styles/tailwind.css';

import { I18N } from 'astrowind:config';

import CommonMeta from '~/components/common/CommonMeta.astro';
// ... other imports

export interface Props {
  metadata?: MetaDataType;
}

const { metadata = {} } = Astro.props;
const { language, textDirection } = I18N;
const netlifyContext = import.meta.env.CONTEXT ?? process.env.CONTEXT ?? 'production';
const isNonProduction = netlifyContext === 'deploy-preview' || netlifyContext === 'branch-deploy';
---

<!doctype html>
<html lang={language} dir={textDirection} class="2xl:text-[20px]">
```

**Update Pattern — Replace hardcoded I18N import with Astro.currentLocale:**
```astro
---
import '~/assets/styles/tailwind.css';

import CommonMeta from '~/components/common/CommonMeta.astro';
// ... other imports

export interface Props {
  metadata?: MetaDataType;
}

const { metadata = {} } = Astro.props;
const currentLocale = Astro.currentLocale ?? 'de'; // From i18n config
const textDirection = 'ltr'; // Hardcoded for now (both DE and EN use ltr)
const netlifyContext = import.meta.env.CONTEXT ?? process.env.CONTEXT ?? 'production';
const isNonProduction = netlifyContext === 'deploy-preview' || netlifyContext === 'branch-deploy';
---

<!doctype html>
<html lang={currentLocale} dir={textDirection} class="2xl:text-[20px]">
```

**Why this change:** `Astro.currentLocale` is provided by the i18n config automatically. It replaces the hardcoded I18N from astrowind:config. The `textDirection` can remain 'ltr' for both DE and EN. This ties the HTML lang attribute to the actual locale detected by Astro's routing, ensuring proper HTML semantics and screen reader behavior.

---

## Shared Patterns

### Astro Native i18n Integration
**Source:** `astro.config.ts` (i18n block, from RESEARCH.md lines 212-223)

**Pattern:** Astro's native `i18n` config automatically makes `Astro.currentLocale` available in all layouts and components. This is the primary integration point for all locale-aware features.

**Apply to:**
- `src/layouts/Layout.astro` — use `Astro.currentLocale` for `<html lang>` attribute
- `src/components/widgets/LanguageSwitcher.astro` — read `Astro.currentLocale` for active state
- Any component needing locale detection — use `Astro.currentLocale` (no middleware needed)

### i18n-Aware Import Pattern
**Source:** Project conventions (path alias `~/` in Header.astro, line 2-11)

**Pattern:** All i18n utilities use `~/` path alias for imports:
```typescript
import { getLocalePath } from '~/i18n/routeMap';
import { t } from '~/i18n/translations';
```

**Apply to:**
- LanguageSwitcher.astro and any component using routeMap or translations
- Pages using locale-aware rendering (Phase 4+)

### TypeScript Typing for Locale
**Source:** CONTEXT.md D-01, D-09

**Pattern:** Always use strict locale typing:
```typescript
type Locale = 'de' | 'en';

// In functions:
function getLocalePath(currentPath: string, targetLocale: Locale): string | null { ... }

// In Zod schemas:
locale: z.enum(['de', 'en']),

// In Record keys:
Record<Locale, Record<string, string>>
```

**Apply to:**
- `src/i18n/routeMap.ts` — function signatures
- `src/i18n/translations.ts` — object keys and function params
- `src/content.config.ts` — schema enums for locale field
- Any new file dealing with locale selection

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `scripts/check-translation-parity.ts` | script | batch | No build-time validation scripts exist yet in codebase. Pattern derived from RESEARCH.md examples and Node.js fs module conventions. |

---

## Metadata

**Analog search scope:** 
- `src/` — components, utilities, layouts, content config
- `astro.config.ts` — main config file
- `package.json` — build scripts
- `src/data/` — existing content structure (for comparison)

**Files scanned:** 35+ source files and configuration files

**Pattern extraction date:** 2026-04-22

**Key takeaways:**
1. **i18n routing** — Astro native config handles all locale detection; use `Astro.currentLocale` everywhere
2. **Utilities** — Follow existing `src/utils/` pattern (modular functions, TypeScript strict typing, `~/` imports)
3. **Content structure** — Expand existing glob loader pattern to nested `de/`+`en/` directories
4. **TypeScript** — Always use `z.enum(['de', 'en'])` for locale fields; never plain strings
5. **Accessibility** — Update language switcher from `<button disabled>` to `<a>` tags with proper `aria-current` values

---

*Phase: 03-i18n-content-collections*
*Pattern mapping completed: 2026-04-22*
