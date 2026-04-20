# Codebase Structure

**Analysis Date:** 2026-04-20

## Directory Layout

```
KONVOI-HOMEPAGE/
├── .agents/                       # (absent)
├── .astro/                        # Generated Astro type cache (git-ignored)
├── .claude/                       # Claude Code workspace config
├── .github/                       # GitHub workflows / issue templates
├── .omc/                          # Local tooling workspace
├── .planning/                     # GSD planning artifacts
│   ├── codebase/                  # This directory — codebase maps
│   └── current-site-overview.md
├── .vscode/                       # Editor settings
├── _crawl/                        # Crawl artifacts (scratch)
├── dist/                          # Build output (git-ignored)
├── nginx/                         # nginx config for Docker deploy
├── node_modules/                  # pnpm install target (git-ignored)
├── public/                        # Static assets copied verbatim to /
│   ├── decapcms/                  # DecapCMS admin UI
│   │   ├── config.yml
│   │   └── index.html
│   ├── _headers                   # Netlify/Cloudflare cache headers
│   └── robots.txt
├── src/                           # Application source
│   ├── assets/                    # Pipeline-processed assets
│   │   ├── favicons/              # favicon.ico, favicon.svg, apple-touch-icon.png
│   │   ├── images/                # Local image imports (app-store, default, google-play, hero-image)
│   │   └── styles/
│   │       └── tailwind.css       # Tailwind v4 config + custom layers
│   ├── components/                # All Astro components
│   │   ├── blog/                  # Blog-specific building blocks
│   │   ├── common/                # Head/body utilities (Image, Metadata, Scripts, ...)
│   │   ├── ui/                    # Unstyled primitives (WidgetWrapper, Button, Headline, ...)
│   │   ├── widgets/               # Page-section components (Hero, Features, Footer, ...)
│   │   ├── CustomStyles.astro     # CSS custom properties + font import
│   │   ├── Favicons.astro         # Favicon link tags
│   │   └── Logo.astro             # Site wordmark
│   ├── data/                      # Content collection sources
│   │   └── post/                  # Blog posts (.md, .mdx) — loaded by src/content.config.ts
│   ├── layouts/                   # Document shells
│   │   ├── Layout.astro           # Base <html> + <head>
│   │   ├── PageLayout.astro       # Layout + Header/Footer/Announcement
│   │   ├── LandingLayout.astro    # PageLayout w/ minimal header
│   │   └── MarkdownLayout.astro   # PageLayout + prose typography
│   ├── pages/                     # File-based routes
│   │   ├── [...blog]/             # Dynamic blog tree
│   │   │   ├── [category]/[...page].astro
│   │   │   ├── [tag]/[...page].astro
│   │   │   ├── [...page].astro    # Blog list + pagination
│   │   │   └── index.astro        # Single post
│   │   ├── homes/                 # AstroWind demo (to be removed)
│   │   ├── landing/               # AstroWind demo (to be removed)
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── index.astro
│   │   ├── pricing.astro
│   │   ├── privacy.md
│   │   ├── rss.xml.ts
│   │   ├── services.astro
│   │   └── terms.md
│   ├── utils/                     # Build-time helpers (TS only)
│   │   ├── blog.ts                # Collection loader + static-path generators
│   │   ├── directories.ts         # __dirname / root-path helpers
│   │   ├── frontmatter.ts         # remark/rehype plugins
│   │   ├── images.ts              # findImage + OG image adapter
│   │   ├── images-optimization.ts # srcset / Unpic / astro:assets pipeline
│   │   ├── permalinks.ts          # URL builders
│   │   └── utils.ts               # Small helpers (trim, date fmt, K/M/B fmt)
│   ├── config.yaml                # Site config — source of truth
│   ├── content.config.ts          # Astro content collections schema
│   ├── env.d.ts                   # Triple-slash refs for types
│   ├── navigation.ts              # Header/footer menu data
│   └── types.d.ts                 # Shared TS interfaces (Post, Widget, Hero, ...)
├── vendor/                        # Vendored integrations (non-npm)
│   ├── integration/
│   │   ├── utils/
│   │   │   ├── configBuilder.ts   # Defaults + merge for YAML config
│   │   │   └── loadConfig.ts      # YAML reader
│   │   ├── index.ts               # Astro integration entry
│   │   └── types.d.ts             # astrowind:config module declaration
│   └── README.md
├── .dockerignore
├── .editorconfig
├── .gitignore
├── .npmrc
├── .prettierignore
├── .prettierrc.cjs                # Prettier config (Astro + Tailwind)
├── .stackblitzrc
├── astro.config.ts                # Astro build entry
├── docker-compose.yml
├── Dockerfile
├── eslint.config.js               # Flat ESLint config
├── LICENSE.md
├── netlify.toml                   # Netlify deploy config
├── package.json
├── pnpm-lock.yaml
├── README.md
├── sandbox.config.json
├── tsconfig.json                  # Extends astro/tsconfigs/base, ~ alias
└── vercel.json                    # Vercel deploy config
```

## Directory Purposes

**`src/assets/`:**
- Purpose: Assets processed by the Vite/Astro pipeline (hashed, optimized, bundled).
- Contains: `images/` (PNGs referenced via `~/assets/images/...`), `favicons/` (imported by `src/components/Favicons.astro`), `styles/tailwind.css` (Tailwind v4 entry loaded from `src/layouts/Layout.astro`).
- Key files: `src/assets/styles/tailwind.css`, `src/assets/favicons/favicon.svg`, `src/assets/images/hero-image.png`.

**`src/components/`:**
- Purpose: All reusable UI. Split into four logical buckets + three root files.
- Contains:
  - `blog/` — blog-only building blocks (`Grid`, `GridItem`, `List`, `ListItem`, `Headline`, `Pagination`, `SinglePost`, `RelatedPosts`, `Tags`, `ToBlogLink`).
  - `common/` — head/body concerns (`CommonMeta`, `Metadata`, `Favicons` helper, `BasicScripts`, `ApplyColorMode`, `SiteVerification`, `Analytics`, `SplitbeeAnalytics`, `Image`, `SocialShare`, `ToggleMenu`, `ToggleTheme`).
  - `ui/` — unstyled primitives (`WidgetWrapper`, `Background`, `Button`, `DListItem`, `Form`, `Headline`, `ItemGrid`, `ItemGrid2`, `Timeline`).
  - `widgets/` — section-level components: `Announcement`, `BlogHighlightedPosts`, `BlogLatestPosts`, `Brands`, `CallToAction`, `Contact`, `Content`, `FAQs`, `Features`, `Features2`, `Features3`, `Footer`, `Header`, `Hero`, `Hero2`, `HeroText`, `Note`, `Pricing`, `Stats`, `Steps`, `Steps2`, `Testimonials`.
  - Root: `Logo.astro`, `Favicons.astro`, `CustomStyles.astro`.
- Key files: `src/components/ui/WidgetWrapper.astro` (shared section chrome), `src/components/common/Image.astro` (responsive image), `src/components/widgets/Header.astro`, `src/components/widgets/Footer.astro`.

**`src/data/`:**
- Purpose: Content-collection sources. Loaded by `src/content.config.ts` via `glob` loader.
- Contains: `post/` with six demo `.md`/`.mdx` articles (template content, safe to replace).
- Key files: `src/data/post/astrowind-template-in-depth.mdx`, `src/data/post/markdown-elements-demo-post.mdx`.

**`src/layouts/`:**
- Purpose: Document shells consumed via `layout:` frontmatter (Markdown) or `<Layout>` imports (Astro).
- Contains: `Layout.astro` (base), `PageLayout.astro` (w/ header + footer), `LandingLayout.astro` (minimal header variant), `MarkdownLayout.astro` (prose).
- Key files: `src/layouts/Layout.astro` (owns `<head>` stack + `ClientRouter`), `src/layouts/PageLayout.astro`.

**`src/pages/`:**
- Purpose: File-based router — every `.astro`/`.md`/`.ts` file becomes a route.
- Contains:
  - Static pages: `index.astro`, `about.astro`, `contact.astro`, `pricing.astro`, `services.astro`, `404.astro`.
  - Markdown pages: `privacy.md`, `terms.md`.
  - Dynamic blog tree: `[...blog]/` (list, single post, category pages, tag pages).
  - RSS endpoint: `rss.xml.ts`.
  - **Demo scaffolding (AstroWind template, to be replaced):** `homes/{saas,startup,mobile-app,personal}.astro`, `landing/{lead-generation,sales,click-through,product,pre-launch,subscription}.astro`.
- Key files: `src/pages/index.astro`, `src/pages/[...blog]/[...page].astro`.

**`src/utils/`:**
- Purpose: Build-time helpers, shared across layouts/widgets/pages.
- Contains: `blog.ts`, `permalinks.ts`, `images.ts`, `images-optimization.ts`, `frontmatter.ts`, `utils.ts`, `directories.ts`.
- Key files: `src/utils/blog.ts` (content collection bridge), `src/utils/permalinks.ts` (URL builders), `src/utils/images-optimization.ts` (srcset pipeline).

**`vendor/integration/`:**
- Purpose: In-repo Astro integration that turns `src/config.yaml` into the `astrowind:config` virtual module.
- Contains: `index.ts` (integration + Vite plugin), `utils/loadConfig.ts` (YAML reader), `utils/configBuilder.ts` (defaults + types), `types.d.ts` (module declaration).
- Key files: `vendor/integration/index.ts`, `vendor/integration/utils/configBuilder.ts`.

**`public/`:**
- Purpose: Files copied verbatim to `dist/` at root level (no processing).
- Contains: `robots.txt`, `_headers` (host-specific cache directives), `decapcms/` (DecapCMS editor UI — `config.yml` + `index.html`).
- Key files: `public/_headers`, `public/decapcms/config.yml`.

**`.planning/`:**
- Purpose: GSD (Get Shit Done) planning artifacts — codebase maps, phase plans, decisions.
- Contains: `codebase/` (this directory), `current-site-overview.md`.
- Key files: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`.

## Key File Locations

**Entry Points:**
- `astro.config.ts` — Astro build config (integrations, Vite, markdown plugins, path alias).
- `package.json` — Scripts (`dev`, `build`, `preview`, `check`, `fix`), dependency manifest.
- `src/pages/index.astro` — Home route `/`.
- `src/pages/rss.xml.ts` — RSS endpoint `/rss.xml`.
- `vendor/integration/index.ts` — Custom Astro integration registered in `astro.config.ts`.

**Configuration:**
- `src/config.yaml` — Site identity, SEO defaults, blog behavior, UI theme, analytics (source of truth).
- `src/content.config.ts` — Content-collection schema for blog posts.
- `src/navigation.ts` — Header + footer menu data.
- `tsconfig.json` — Extends `astro/tsconfigs/base`, defines `~/*` → `src/*` alias.
- `eslint.config.js` — Flat ESLint config (Astro + TypeScript).
- `.prettierrc.cjs` — Prettier config (Astro plugin + Tailwind plugin order).
- `netlify.toml`, `vercel.json`, `Dockerfile`, `docker-compose.yml`, `nginx/` — Deploy targets.
- `public/_headers` — Cache-Control for `/_astro/*`.
- `public/decapcms/config.yml` — DecapCMS backend + collection schema.

**Core Logic:**
- `src/utils/blog.ts` — Blog collection loader, permalink generator, `getStaticPaths*` helpers, related-posts scorer.
- `src/utils/permalinks.ts` — URL builder functions and menu-tree resolver.
- `src/utils/images.ts` — Local image resolution + OG image adapter.
- `src/utils/images-optimization.ts` — `astro:assets` + Unpic-based srcset generation.
- `src/utils/frontmatter.ts` — Reading-time remark plugin + responsive-table/lazy-image rehype plugins.
- `src/components/ui/WidgetWrapper.astro` — Shared section chrome.
- `src/components/common/Metadata.astro` — 3-way SEO metadata merge.
- `src/components/common/BasicScripts.astro` — Client-side interactions (theme, menu, animation, scroll).

**Testing:**
- No test directory, no test framework, no test scripts. `pnpm check` runs `astro check` + `eslint` + `prettier --check` only.

## Naming Conventions

**Files:**
- Astro components: `PascalCase.astro` — e.g. `Hero.astro`, `WidgetWrapper.astro`, `BlogLatestPosts.astro`.
- Layouts: `PascalCase.astro` with `Layout` suffix — e.g. `PageLayout.astro`, `MarkdownLayout.astro`.
- Pages / routes: `kebab-case.astro` or `.md` for static routes — e.g. `about.astro`, `pricing.astro`, `mobile-app.astro`, `lead-generation.astro`, `privacy.md`.
- Dynamic routes: bracket notation matching Astro conventions — `[...blog]`, `[category]`, `[tag]`, `[...page].astro`.
- Utility modules: `kebab-case.ts` or single-word — `images-optimization.ts`, `blog.ts`, `permalinks.ts`.
- Config / data modules: lower-case `.ts` / `.yaml` / `.d.ts` — `config.yaml`, `navigation.ts`, `content.config.ts`, `types.d.ts`, `env.d.ts`.
- Content files: `kebab-case.md` / `.mdx` — `astrowind-template-in-depth.mdx`, `get-started-website-with-astro-tailwind-css.md`.

**Directories:**
- `lowercase` single-word — `assets`, `layouts`, `pages`, `utils`, `widgets`, `common`, `blog`, `ui`.
- Bracketed dynamic segments follow Astro conventions — `[...blog]`, `[category]`, `[tag]`.

**Code:**
- Interfaces / types: `PascalCase` — `Post`, `MetaData`, `Widget`, `Hero`, `CallToAction` (see `src/types.d.ts`).
- Functions / variables: `camelCase` — `getPermalink`, `fetchPosts`, `headerData`, `footerData`, `BLOG_BASE` is an exception (`SCREAMING_SNAKE_CASE` for constants derived from config).
- Constants derived from config: `SCREAMING_SNAKE_CASE` — `BLOG_BASE`, `CATEGORY_BASE`, `TAG_BASE`, `POST_PERMALINK_PATTERN`, `SITE`, `I18N`, `METADATA`, `APP_BLOG`, `UI`, `ANALYTICS`.
- Component props interfaces: always named `Props` inside the component's frontmatter.
- CSS custom properties: prefixed `--aw-*` — `--aw-color-primary`, `--aw-color-bg-page`, `--aw-font-heading`.

**Imports:**
- Internal imports always use the `~` alias — `import Foo from '~/components/widgets/Foo.astro'`.
- Config imports use the virtual module — `import { SITE, APP_BLOG } from 'astrowind:config'`.

## Where to Add New Code

**New top-level page (e.g. `/solutions`, `/product`):**
- Primary code: `src/pages/<slug>.astro` (kebab-case).
- Layout: `import Layout from '~/layouts/PageLayout.astro'`; set local `const metadata = { title: '…' }` and pass via `<Layout metadata={metadata}>`.
- Add navigation: update `src/navigation.ts` `headerData.links` / `footerData.links`.
- Tests: none (no test framework).

**New nested page (e.g. `/solutions/fleet-security`):**
- Primary code: `src/pages/solutions/<slug>.astro`.
- Register in nav menu under the relevant section of `src/navigation.ts`.

**New marketing widget (new reusable section):**
- Implementation: `src/components/widgets/<Name>.astro` (PascalCase).
- Wrap contents in `<WidgetWrapper id={id} isDark={isDark} containerClass={…} bg={bg}>` for consistency.
- Add a TS interface for props to `src/types.d.ts` (extend `Widget` and/or `Headline` when appropriate).
- Typical imports:
  ```ts
  import WidgetWrapper from '~/components/ui/WidgetWrapper.astro';
  import Headline from '~/components/ui/Headline.astro';
  import type { <Name> as Props } from '~/types';
  ```

**New UI primitive (button variant, grid layout, form element):**
- Implementation: `src/components/ui/<Name>.astro`.
- Do NOT import `astrowind:config` here — primitives are config-agnostic.

**New common head/body concern (analytics vendor, meta tag, head link):**
- Implementation: `src/components/common/<Name>.astro`.
- Wire into `src/layouts/Layout.astro` (head) or `src/components/common/BasicScripts.astro` (body-end scripts).
- If configurable, add a field to `src/config.yaml` and extend `vendor/integration/utils/configBuilder.ts` with a `getFoo(config)` function and re-export it from the default export; also extend `vendor/integration/types.d.ts`.

**New blog post:**
- File: `src/data/post/<slug>.md` or `.mdx`.
- Required frontmatter keys (see `src/content.config.ts` schema): `title`, plus optional `publishDate`, `updateDate`, `excerpt`, `image`, `category`, `tags`, `author`, `draft`, `metadata`.
- Draft posts (`draft: true`) are filtered out by `src/utils/blog.ts`.

**New utility function:**
- If cross-cutting: `src/utils/<topic>.ts` (kebab-case).
- If specific to one domain (blog, images, permalinks): extend the existing `src/utils/{blog,images,permalinks}.ts`.
- Shared helpers go in `src/utils/utils.ts`.

**New site-wide configuration value:**
- Add field to `src/config.yaml`.
- Extend `Config` / `SiteConfig` / etc. types in `vendor/integration/utils/configBuilder.ts` and add a `getFoo()` with defaults.
- Re-export from the default export in `configBuilder.ts`.
- Inline the JSON-stringified export into `vendor/integration/index.ts` `load(id)` string.
- Declare the export in `vendor/integration/types.d.ts`.
- Import anywhere via `import { FOO } from 'astrowind:config';`.

**New static image:**
- Pipeline-optimized: `src/assets/images/<name>.{png,jpg,webp,svg}`; reference as `~/assets/images/<name>.png`.
- Raw / untouched: `public/<name>.<ext>`; reference as `/<name>.<ext>`.

**New third-party image CDN:**
- Add hostname to `astro.config.ts` `image.domains` array.
- Ensure the CDN is supported by `unpic` (see `isUnpicCompatible` in `src/utils/images-optimization.ts`).

**New favicon / brand asset:**
- Replace files in `src/assets/favicons/` (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`) — imports in `src/components/Favicons.astro` are unchanged.

**Deleting AstroWind demo content (Konvoi migration):**
- Safe to delete wholesale once replaced: `src/pages/homes/`, `src/pages/landing/`.
- Safe to rewrite: `src/pages/index.astro`, `src/pages/about.astro`, `src/pages/contact.astro`, `src/pages/pricing.astro`, `src/pages/services.astro`, `src/pages/privacy.md`, `src/pages/terms.md`, `src/navigation.ts`, `src/config.yaml`, `src/components/Logo.astro`, `src/data/post/*` (all current posts are AstroWind docs), `src/assets/images/hero-image.png`, `src/assets/favicons/*`.
- Footer attribution (`footNote` in `src/navigation.ts`) currently credits Arthelokyo — update to Konvoi branding.

## Special Directories

**`vendor/`:**
- Purpose: In-repo integrations/libraries not published to npm. Currently holds the AstroWind Astro integration.
- Generated: No.
- Committed: Yes.

**`public/`:**
- Purpose: Static files served from `/` without any Astro processing.
- Generated: No.
- Committed: Yes.

**`public/decapcms/`:**
- Purpose: DecapCMS editor bundle + config. Accessible at `/decapcms/` when deployed; `config.yml` references `git-gateway` auth and writes posts to `src/content/post` (**note: inconsistent with actual collection path `src/data/post`**).
- Generated: No.
- Committed: Yes.

**`.astro/`:**
- Purpose: Astro's type-generation cache (referenced by `src/env.d.ts` via `/// <reference path="../.astro/types.d.ts" />`).
- Generated: Yes, by `astro dev` / `astro build` / `astro sync`.
- Committed: No (git-ignored).

**`dist/`:**
- Purpose: Static build output (`astro build`). Contains hashed `_astro/` assets + rendered HTML.
- Generated: Yes.
- Committed: No.

**`node_modules/`:**
- Purpose: pnpm install target.
- Generated: Yes.
- Committed: No.

**`.planning/`:**
- Purpose: GSD workflow artifacts — codebase maps, phase plans, decisions.
- Generated: By GSD commands.
- Committed: Yes.

**`_crawl/`:**
- Purpose: Scratch space for crawl artifacts (konvoi.eu reference site content during migration).
- Generated: Yes.
- Committed: Likely no (project convention pending).

**`.omc/`, `.claude/`:**
- Purpose: Local tooling workspace for agent-based dev workflows.
- Generated: By tooling.
- Committed: Partially (config only).

**`nginx/`:**
- Purpose: nginx configuration for the `Dockerfile` production image.
- Generated: No.
- Committed: Yes.

---

*Structure analysis: 2026-04-20*
