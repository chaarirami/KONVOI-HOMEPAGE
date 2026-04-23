# Content Collections

This directory contains all structured content for the Konvoi site.
See `src/content.config.ts` for the full Zod schema for each collection.

## Directory Structure

### Long-form collections (bilingual — separate files per locale)

Each long-form entry has TWO files: one in `de/` and one in `en/`.
Both files must share the same `translationKey` frontmatter value.
The CI parity check (`scripts/check-translation-parity.ts`) enforces this.

```
src/content/
├── post/           # Blog posts (Phase 6)
│   ├── de/
│   └── en/
├── caseStudy/      # Customer case studies (Phase 6)
│   ├── de/
│   └── en/
├── useCase/        # Product use-case pages (Phase 4)
│   ├── de/
│   └── en/
├── industry/       # Industry vertical pages (Phase 4)
│   ├── de/
│   └── en/
└── job/            # Job listings (Phase 6)
    ├── de/
    └── en/
```

### Short-form collections (bilingual — single file with {de, en} sibling fields)

Each short-form entry is ONE file. Bilingual fields are nested objects.
No parity check needed — both locales are always in the same file.

```
src/content/
├── event/          # Upcoming events (Phase 6)
└── team/           # Team members (Phase 6)
```

## Required Frontmatter

### Long-form entries (post, caseStudy, useCase, industry, job)

```yaml
---
locale: 'de'            # or 'en' — must match the directory
translationKey: 'my-slug'  # same value in both de/ and en/ files
canonicalKey: 'my-slug'    # slug without locale prefix
title: 'My Title'
---
```

### Short-form entries (event, team)

```yaml
---
name:
  de: 'Deutsch'
  en: 'English'
bio:
  de: 'Deutsch bio'
  en: 'English bio'
photo: '/images/team/name.jpg'
---
```
