import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// ---------------------------------------------------------------------------
// Shared Zod helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Long-form collections (I18N-06)
// Each entry lives in src/content/{collection}/de/ or en/
// Required fields: locale (enum), translationKey, canonicalKey
// ---------------------------------------------------------------------------

// blog posts (migrated from Jimdo in Phase 6)
const postCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/post' }),
  schema: z.object({
    locale: z.enum(['de', 'en']),
    translationKey: z.string(),
    canonicalKey: z.string(),

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

// customer case studies (Phase 6 — Schumacher, JJX, Greilmeier)
const caseStudyCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/caseStudy' }),
  schema: z.object({
    locale: z.enum(['de', 'en']),
    translationKey: z.string(),
    canonicalKey: z.string(),

    title: z.string(),
    customer: z.string(),
    vertical: z.string(),
    problem: z.string(),
    approach: z.string(),
    outcome: z.string(),
    quote: z.string().optional(),
    quoteAttribution: z.string().optional(),
    logo: z.string().optional(),
    publishDate: z.date().optional(),

    metadata: metadataDefinition(),
  }),
});

// product use-case pages (Phase 4 — 7 use cases)
const useCaseCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/useCase' }),
  schema: z.object({
    locale: z.enum(['de', 'en']),
    translationKey: z.string(),
    canonicalKey: z.string(),

    title: z.string(),
    slug: z.string(),
    problemStatement: z.string().optional(),
    costAnchor: z.string().optional(),
    konvoiApproach: z.string().optional(),
    relatedIndustries: z.array(z.string()).optional(),
    publishDate: z.date().optional(),

    metadata: metadataDefinition(),
  }),
});

// industry vertical landing pages (Phase 4 — 4 verticals)
const industryCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/industry' }),
  schema: z.object({
    locale: z.enum(['de', 'en']),
    translationKey: z.string(),
    canonicalKey: z.string(),

    title: z.string(),
    slug: z.string(),
    riskProfile: z.string().optional(),
    relatedUseCases: z.array(z.string()).optional(),
    publishDate: z.date().optional(),

    metadata: metadataDefinition(),
  }),
});

// job listings (Phase 6 — 8 open roles)
const jobCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/job' }),
  schema: z.object({
    locale: z.enum(['de', 'en']),
    translationKey: z.string(),
    canonicalKey: z.string(),

    title: z.string(),
    department: z.string().optional(),
    type: z.enum(['fulltime', 'internship', 'initiative']).optional(),
    applyEmail: z.string().optional(),
    publishDate: z.date().optional(),
    active: z.boolean().default(true),

    metadata: metadataDefinition(),
  }),
});

// ---------------------------------------------------------------------------
// Short-form collections (I18N-07)
// Each entry is a single file with {de, en} sibling fields for bilingual content.
// Shared metadata (photo, dates) uses singular fields (not bilingual).
// ---------------------------------------------------------------------------

// events (Phase 6 — upcoming events list on contact page)
const eventCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/event' }),
  schema: z.object({
    name: z.object({
      de: z.string(),
      en: z.string(),
    }),
    description: z
      .object({
        de: z.string(),
        en: z.string(),
      })
      .optional(),
    // Shared singular fields (same for both locales)
    startDate: z.date(),
    endDate: z.date().optional(),
    location: z.string().optional(),
    url: z.string().optional(),
  }),
});

// team members (Phase 6 — 9 members)
const teamCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/team' }),
  schema: z.object({
    name: z.object({
      de: z.string(),
      en: z.string(),
    }),
    title: z.object({
      de: z.string(),
      en: z.string(),
    }),
    bio: z.object({
      de: z.string(),
      en: z.string(),
    }),
    // Shared singular fields
    photo: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    order: z.number().optional(),
  }),
});

// ---------------------------------------------------------------------------
// Export (I18N-05)
// ---------------------------------------------------------------------------

export const collections = {
  post: postCollection,
  caseStudy: caseStudyCollection,
  useCase: useCaseCollection,
  industry: industryCollection,
  job: jobCollection,
  event: eventCollection,
  team: teamCollection,
};
