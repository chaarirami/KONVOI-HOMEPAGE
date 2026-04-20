# Architecture

**Analysis Date:** 2026-04-20

## Pattern Overview

**Overall:** Static Site Generator (SSG) — Astro 6 content-driven architecture with a custom Vite-plugin integration that exposes a YAML-defined site config as a virtual module.

**Key Characteristics:**
- Pure static output (`output: 'static'` in `astro.config.ts`) — every route is prerendered to HTML at build time; no runtime server.
- Component-driven rendering: pages compose high-level "widgets" (self-contained section components) rather than writing bespoke HTML per page.
- Centralized site configuration: a single `src/config.yaml` file is the source of truth for site identity, SEO defaults, blog behavior, analytics, and UI theme — delivered to components via the `astrowind:config` virtual module.
- Content-as-data via Astro Content Collections: blog posts live in `src/data/post/` as `.md`/`.mdx` and are loaded through `astro/loaders` `glob`.
- Thin layer for routing: Astro's file-based router in `src/pages/` maps directly to URLs, with a single dynamic `[...blog]` tree providing paginated list / category / tag / post routes.
- Theming via CSS custom properties injected by `src/components/CustomStyles.astro`, combined with Tailwind CSS 4 utilities (no legacy `tailwind.config.js` — Tailwind 4 config is in `src/assets/styles/tailwind.css`).
- Zero-JS by default; a single inline script (`BasicScripts.astro`) provides dark-mode toggle, mobile menu, sticky-header scroll logic, social share links, and an IntersectionObserver-based animation queue.
- View Transitions enabled via `<ClientRouter fallback="swap" />` in `src/layouts/Layout.astro`.

## Layers

The codebase is organized as a 5-layer pipeline: **config → layouts → pages → widgets → ui/common**. Data flows from YAML config downward; rendering flows from pages upward.

**Layer 1 — Configuration:**
- Purpose: Single source of truth for site identity, SEO defaults, i18n, blog behavior, analytics, and UI theme.
- Location: `src/config.yaml`, consumed by `vendor/integration/index.ts`.
- Contains: Static YAML values only; no logic.
- Depends on: Nothing.
- Used by: Every layer below via the `astrowind:config` virtual module.

**Layer 2 — Integration / Virtual Module:**
- Purpose: Load YAML config, apply defaults, expose it to the app as a typed TypeScript module.
- Location: `vendor/integration/index.ts`, `vendor/integration/utils/configBuilder.ts`, `vendor/integration/utils/loadConfig.ts`, `vendor/integration/types.d.ts`.
- Contains: Astro Integration (`astro:config:setup` hook) + Vite plugin that resolves `astrowind:config` to runtime-evaluated constants.
- Depends on: `src/config.yaml`, `lodash.merge`, `js-yaml`.
- Used by: Layouts, widgets, utils, and pages via `import { SITE, I18N, METADATA, APP_BLOG, UI, ANALYTICS } from 'astrowind:config';`.

**Layer 3 — Layouts:**
- Purpose: Provide the HTML document scaffold (head, body, header, footer) that wraps page content.
- Location: `src/layouts/`
- Contains:
  - `Layout.astro` — base `<html>/<head>/<body>` shell; includes `CommonMeta`, `Favicons`, `CustomStyles`, `ApplyColorMode`, `Metadata`, `SiteVerification`, `Analytics`, `BasicScripts`, and `ClientRouter`.
  - `PageLayout.astro` — wraps `Layout.astro` and adds `Announcement` + `Header` + `<main>` + `Footer` widgets pulled from `src/navigation.ts`.
  - `LandingLayout.astro` — wraps `PageLayout.astro` and overrides the header with a minimal right-aligned variant (AstroWind template scaffolding).
  - `MarkdownLayout.astro` — wraps `PageLayout.astro` and injects `prose` typography styles for `.md` pages (privacy, terms).
- Depends on: `astrowind:config` (`I18N`, `UI`), `src/navigation.ts`, common and widget components.
- Used by: Every file in `src/pages/` via `<Layout>` / `<PageLayout>` / `<LandingLayout>` / frontmatter `layout:` key.

**Layer 4 — Pages (Routes):**
- Purpose: One file per URL; compose layouts + widgets with page-specific content (props, copy, images).
- Location: `src/pages/`
- Contains:
  - Static `.astro` pages (`index.astro`, `about.astro`, `contact.astro`, `pricing.astro`, `services.astro`, `404.astro`).
  - Markdown pages with frontmatter-declared layouts (`privacy.md`, `terms.md`).
  - Demo template scaffolding (`homes/*.astro`, `landing/*.astro`) — **will be replaced by Konvoi content**.
  - RSS endpoint (`rss.xml.ts`).
  - Dynamic blog tree (`[...blog]/`) — list + post + category + tag routes, all using `export const prerender = true` and `getStaticPaths` helpers from `src/utils/blog.ts`.
- Depends on: Layouts, widgets, `src/utils/blog.ts`, `src/utils/permalinks.ts`.
- Used by: Nothing inside the app — pages are URL entry points.

**Layer 5 — Widgets:**
- Purpose: Reusable marketing sections (Hero, Features, Pricing, FAQs, Testimonials, Stats, CallToAction, Content, Steps, Contact, Header, Footer, Announcement, Note, Brands, BlogLatestPosts, BlogHighlightedPosts).
- Location: `src/components/widgets/`
- Contains: Props-driven `.astro` components, typed via interfaces in `src/types.d.ts` (e.g. `Hero`, `Features`, `Pricing`). Most widgets wrap their contents in `<WidgetWrapper>`.
- Depends on: `~/components/ui/*`, `~/components/common/*`, `~/types`, `astro-icon`, `tailwind-merge`, occasionally `astrowind:config` or blog utils.
- Used by: Pages and layouts.

**Layer 6 — UI Primitives & Common:**
- Purpose: Low-level, unstyled-ish building blocks shared across widgets.
- Location:
  - `src/components/ui/` — `WidgetWrapper.astro`, `Background.astro`, `Button.astro`, `Headline.astro`, `Form.astro`, `ItemGrid.astro`, `ItemGrid2.astro`, `Timeline.astro`, `DListItem.astro`.
  - `src/components/common/` — `Image.astro` (optimized `<img>` via `~/utils/images-optimization.ts`), `Metadata.astro`, `CommonMeta.astro`, `Favicons` helper, `Analytics.astro`, `SplitbeeAnalytics.astro`, `BasicScripts.astro`, `ApplyColorMode.astro`, `SiteVerification.astro`, `SocialShare.astro`, `ToggleMenu.astro`, `ToggleTheme.astro`.
  - `src/components/blog/` — `Grid`, `GridItem`, `List`, `ListItem`, `Pagination`, `Headline`, `RelatedPosts`, `SinglePost`, `Tags`, `ToBlogLink`.
  - Root component files — `Logo.astro`, `Favicons.astro`, `CustomStyles.astro`.
- Depends on: `~/types`, `astro-icon`, `tailwind-merge`, `astro:assets`, `unpic`.
- Used by: Widgets and layouts.

## Data Flow

**Primary config flow (build time):**

1. User edits `src/config.yaml`.
2. `astro.config.ts` registers the `astrowind` integration with `config: './src/config.yaml'`.
3. On `astro:config:setup`, `vendor/integration/index.ts` calls `loadConfig('./src/config.yaml')` which reads + `yaml.load`s the file.
4. `configBuilder(rawJsonConfig)` applies defaults via `lodash.merge` and returns `{ SITE, I18N, METADATA, APP_BLOG, UI, ANALYTICS }`.
5. The integration registers a Vite plugin that resolves the virtual module `astrowind:config` to `\0astrowind:config` and emits JSON-stringified exports:
   ```js
   export const SITE = {...};
   export const I18N = {...};
   export const METADATA = {...};
   export const APP_BLOG = {...};
   export const UI = {...};
   export const ANALYTICS = {...};
   ```
6. Any component/util can now do `import { SITE, APP_BLOG } from 'astrowind:config';` and receives fully-merged, typed values at build time.
7. The integration also calls `updateConfig({ site, base, trailingSlash })` so `SITE.site` / `SITE.base` become the Astro build's effective URL identity.
8. `addWatchFile(config.yaml)` ensures dev-server HMR re-evaluates the module on edits.
9. On `astro:build:done`, the integration post-processes `dist/robots.txt` to append/overwrite a `Sitemap:` line referencing `dist/sitemap-index.xml` generated by `@astrojs/sitemap`.

**Virtual module contract (`astrowind:config`):**

| Export       | Type (from `vendor/integration/utils/configBuilder.ts`) | Shape summary |
|--------------|---------------------------------------------------------|---------------|
| `SITE`       | `SiteConfig`                                            | `{ name, site, base, trailingSlash, googleSiteVerificationId }` |
| `I18N`       | `I18NConfig`                                            | `{ language, textDirection, dateFormatter? }` |
| `METADATA`   | `MetaDataConfig`                                        | `{ title: { default, template }, description, robots, openGraph, twitter }` |
| `APP_BLOG`   | `AppBlogConfig`                                         | `{ isEnabled, postsPerPage, isRelatedPostsEnabled, relatedPostsCount, post, list, category, tag }` where each of post/list/category/tag has `{ isEnabled, permalink or pathname, robots: { index, follow } }` |
| `UI`         | `UIConfig`                                              | `{ theme: 'system' \| 'light' \| 'dark' \| 'light:only' \| 'dark:only' }` |
| `ANALYTICS`  | `AnalyticsConfig`                                       | `{ vendors: { googleAnalytics: { id?, partytown? } } }` |

The module declaration lives in `vendor/integration/types.d.ts` and is referenced from `src/env.d.ts` (`/// <reference types="../vendor/integration/types.d.ts" />`).

**Blog content flow (build time):**

1. `src/content.config.ts` defines a `post` collection via Astro's `glob` loader (`pattern: ['*.md', '*.mdx'], base: 'src/data/post'`), with a Zod schema validating `title`, `publishDate`, `excerpt`, `image`, `category`, `tags`, `author`, `draft`, and nested `metadata`.
2. `src/utils/blog.ts`:
   - `load()` calls `getCollection('post')`, awaits `render(post)` for each entry to get `Content` + `remarkPluginFrontmatter`, normalizes into `Post` (`src/types.d.ts`), sorts by `publishDate` desc, filters `draft`.
   - Result memoized in module-scoped `_posts` (see "Concerns").
   - `generatePermalink()` expands `%slug%`, `%id%`, `%category%`, `%year%`, `%month%`, `%day%`, `%hour%`, `%minute%`, `%second%` tokens from `APP_BLOG.post.permalink`.
   - Exports `getStaticPathsBlogList/BlogPost/BlogCategory/BlogTag` consumed by the four `[...blog]` routes.
3. `src/utils/permalinks.ts` reads `SITE.base`, `SITE.trailingSlash`, `APP_BLOG.list.pathname`, `APP_BLOG.category.pathname`, `APP_BLOG.tag.pathname`, `APP_BLOG.post.permalink` and exposes `getPermalink(slug, type)` / `getHomePermalink()` / `getBlogPermalink()` / `getAsset()` / `getCanonical()` / `cleanSlug()` / `applyGetPermalinks()`.
4. Pages call these helpers; the RSS endpoint (`src/pages/rss.xml.ts`) iterates `fetchPosts()` and emits XML via `@astrojs/rss`.

**Page render flow (request = build time):**

1. Astro invokes the route file in `src/pages/*`.
2. The page imports a layout (`PageLayout.astro`, `LandingLayout.astro`, or `MarkdownLayout.astro`).
3. The page defines a local `metadata` object and passes it to `<Layout metadata={metadata}>`.
4. `PageLayout` injects `Announcement` + `Header` (with `headerData` from `src/navigation.ts`) + `<main>` slot + `Footer` (with `footerData`).
5. `Layout` renders the `<head>` stack: `CommonMeta` (charset/viewport/sitemap link), `Favicons`, `CustomStyles` (CSS custom properties + Inter Variable font), `ApplyColorMode`, `Metadata` (merges page metadata with `METADATA` defaults through `@astrolib/seo`), `SiteVerification`, `Analytics`, and `ClientRouter`.
6. Page body composes widgets (`<Hero …/>`, `<Features …/>`, etc.). Each widget typically wraps content in `<WidgetWrapper>` for consistent spacing/backgrounds/animations.
7. `BasicScripts.astro` is appended to `<body>` to bootstrap theme toggle, mobile menu, scroll-based header class, social share, and the `Observer` IntersectionObserver animation queue.

**State Management:**
- No runtime state library. All "state" is static at build time.
- Client-side only: dark-mode preference persisted to `localStorage.theme`; scroll position tracked ephemerally in `BasicScripts` for sticky-header styling.
- Module-scoped cache `_posts` in `src/utils/blog.ts` memoizes blog post loading within a single build.

## Key Abstractions

**Virtual Config Module (`astrowind:config`):**
- Purpose: Turn static YAML into a typed, tree-shakeable TS module without reading files at runtime.
- Implementation: `vendor/integration/index.ts` + `vendor/integration/types.d.ts`.
- Pattern: Astro Integration registers a Vite plugin whose `resolveId` maps `'astrowind:config'` to `'\0astrowind:config'` and whose `load` returns a string of JSON-stringified `export const` declarations.

**WidgetWrapper pattern (`src/components/ui/WidgetWrapper.astro`):**
- Purpose: Consistent section chrome across all marketing widgets — id anchor, max-width container, responsive padding, optional `isDark` theming, background slot, and intersection-observer entrance animation.
- Usage: Widget authors do NOT render `<section>` themselves; they render `<WidgetWrapper id={id} isDark={isDark} containerClass={...} bg={bg}> … </WidgetWrapper>`.
- Class composition: `tailwind-merge`'s `twMerge` merges caller-provided `containerClass` with the default container classes, allowing Tailwind-style overrides.
- Examples: `src/components/widgets/Features.astro`, `src/components/widgets/Stats.astro`, `src/components/widgets/Pricing.astro`, `src/components/widgets/CallToAction.astro`.
- Exception: `Hero.astro`, `Header.astro`, `Footer.astro`, `Announcement.astro` render their own `<section>` / `<header>` / `<footer>` instead of using `WidgetWrapper`.

**Content Collection loader pattern (`src/content.config.ts`):**
- Purpose: Load `.md`/`.mdx` files from `src/data/post/` as typed, queryable data.
- Implementation: `glob` loader from `astro/loaders` + Zod schema (`defineCollection({ loader: glob({ pattern, base }), schema })`).
- Consumption: `getCollection('post')` + `render(post)` in `src/utils/blog.ts`, which normalizes entries into the `Post` type defined in `src/types.d.ts`.
- Note: DecapCMS is configured (`public/decapcms/config.yml`) to write to `src/content/post` — **this path is inconsistent** with the actual collection base `src/data/post` and needs alignment when CMS is adopted.

**Permalink helpers (`src/utils/permalinks.ts`):**
- Purpose: Uniform URL generation that respects `SITE.base`, `SITE.trailingSlash`, and the blog's configurable pathnames/permalink patterns.
- Key functions: `getPermalink(slug, type)` (types: `home`, `blog`, `asset`, `category`, `tag`, `post`, `page`), `getHomePermalink`, `getBlogPermalink`, `getAsset`, `getCanonical`, `cleanSlug`, `applyGetPermalinks` (walks a menu tree and resolves `{ type, url }` objects into final hrefs).
- Used by: `src/navigation.ts`, every page, widget Headers/Footers, RSS endpoint.

**Image optimization pipeline (`src/utils/images-optimization.ts` + `src/utils/images.ts` + `src/components/common/Image.astro`):**
- Purpose: Generate responsive `srcset` for local assets (via `astro:assets` `getImage`) and remote CDN-hosted images (via `unpic`'s `transformUrl` / `parseUrl`).
- `findImage()` resolves `~/assets/images/...` paths through `import.meta.glob`, passes absolute/HTTP URLs through, and returns `null` for unknown local paths.
- `adaptOpenGraphImages()` rewrites OpenGraph image URLs into optimized variants for social previews.

**Menu data pattern (`src/navigation.ts`):**
- Purpose: Declarative nav tree with nested dropdowns; hrefs are resolved through `getPermalink()` at module-load time.
- Exports `headerData` (`links[]`, `actions[]`) and `footerData` (`links[]`, `secondaryLinks[]`, `socialLinks[]`, `footNote`) consumed by `src/layouts/PageLayout.astro` → `src/components/widgets/Header.astro` / `Footer.astro`.
- **AstroWind template content** — all entries currently point at demo pages/external repos and must be rewritten for Konvoi.

## Entry Points

**HTTP routes (prerendered at build):**
- `/` — `src/pages/index.astro` (AstroWind home demo).
- `/about`, `/contact`, `/pricing`, `/services` — `src/pages/{about,contact,pricing,services}.astro` (AstroWind demo pages).
- `/privacy`, `/terms` — `src/pages/{privacy,terms}.md` rendered through `MarkdownLayout`.
- `/404` — `src/pages/404.astro`.
- `/homes/{saas,startup,mobile-app,personal}` — `src/pages/homes/*.astro` (AstroWind demo scaffolding; **to be deleted/replaced for Konvoi**).
- `/landing/{lead-generation,sales,click-through,product,pre-launch,subscription}` — `src/pages/landing/*.astro` (AstroWind demo scaffolding; **to be deleted/replaced for Konvoi**).
- `/blog` list + pagination — `src/pages/[...blog]/[...page].astro` + `src/pages/[...blog]/index.astro` (single-post).
- `/category/:slug` paginated — `src/pages/[...blog]/[category]/[...page].astro`.
- `/tag/:slug` paginated — `src/pages/[...blog]/[tag]/[...page].astro`.
- `/rss.xml` — `src/pages/rss.xml.ts` (returns XML `Response`).

**Build entry point:**
- `astro.config.ts` — registers integrations (`@astrojs/sitemap`, `@astrojs/mdx`, `astro-icon`, `astro-compress`, `astrowind` custom integration), configures `image.domains`, Tailwind Vite plugin, remark/rehype plugins, and the `~` path alias.

**Integration entry point:**
- `vendor/integration/index.ts` — default-exported factory that returns an `AstroIntegration`. Registered in `astro.config.ts` as `astrowind({ config: './src/config.yaml' })`.

## Error Handling

**Strategy:** Graceful degradation — the site is static marketing, so most errors are build-time and the fallback is "render without the feature".

**Patterns:**
- **Missing image assets:** `findImage()` returns `null` when `~/assets/images/...` isn't in the `import.meta.glob` index; consumers render no image rather than crash (`src/utils/images.ts:49-52`).
- **Missing Unpic parse:** `unpicOptimizer()` returns `[]` when `parseUrl()` can't recognize the CDN — callers degrade to an unoptimized `<img>` (`src/utils/images-optimization.ts:248-252`).
- **Blog disabled:** Every static-path helper short-circuits to `[]` when `APP_BLOG.isEnabled` is false (`src/utils/blog.ts:178, 187, 198, 222`). The RSS endpoint returns `404` in that case (`src/pages/rss.xml.ts:8-13`).
- **404 route:** `src/pages/404.astro` handled by Astro's built-in static 404.
- **Integration post-build failure:** `astro:build:done` hook swallows `robots.txt` rewrite errors silently (empty `catch { }`) so a failing sitemap rewrite never aborts the build (`vendor/integration/index.ts:109-112`).
- **Image pipeline logs:** `getImagesOptimized()` uses `console.error` when required `width`/`height`/`aspectRatio` are missing instead of throwing.

**No runtime exception boundary** exists because there is no runtime server.

## Cross-Cutting Concerns

**Logging:**
- Build-time: `logger.fork('astrowind')` inside the custom integration (`vendor/integration/index.ts:23`).
- Dev-time: `console.error` for missing image dimensions in the image pipeline.
- Runtime (client): no dedicated logger; `BasicScripts.astro` is silent.

**Validation:**
- Zod schema in `src/content.config.ts` validates blog frontmatter at build time; invalid posts fail the build.
- No runtime form validation — the demo contact form (`src/components/widgets/Contact.astro`) is UI-only.

**Authentication:**
- None. Public marketing site.
- DecapCMS (`public/decapcms/`) references `git-gateway` for future editor auth — not wired to any identity provider.

**SEO / metadata:**
- 3-way merge (`lodash.merge`) of defaults → site config → page metadata inside `src/components/common/Metadata.astro`.
- Rendered via `@astrolib/seo`'s `AstroSeo` component.
- Canonical URLs enforced through `getCanonical()` honoring `SITE.trailingSlash`.
- OpenGraph images post-processed via `adaptOpenGraphImages()` to use optimized variants.

**Theming / dark mode:**
- Default theme from `UI.theme` in `src/config.yaml` (`system | light | dark | light:only | dark:only`).
- `ApplyColorMode.astro` reads `localStorage.theme` and applies `.dark` class on `<html>` before first paint.
- `ToggleTheme.astro` button writes to `localStorage.theme` and toggles the class (see `BasicScripts.astro` click handler).
- CSS custom properties in `src/components/CustomStyles.astro` (`--aw-color-primary`, `--aw-color-bg-page`, etc.) drive Tailwind utility classes.

**Animation:**
- `BasicScripts.astro`'s `Observer` attaches to elements with `intersect*` classes and staggers animation delays via a shared `animationCounter`. Widgets opt in with `intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade`.

**Caching:**
- `public/_headers` sets `Cache-Control: public, max-age=31536000, immutable` on `/_astro/*` (hashed assets) — consumed by Netlify / Cloudflare Pages host.
- In-memory memoization of blog posts (`_posts` in `src/utils/blog.ts`) within a build.

**Analytics:**
- `src/components/common/Analytics.astro` + `SplitbeeAnalytics.astro` read `ANALYTICS.vendors.googleAnalytics.id` from the virtual config.
- Currently `analytics.vendors.googleAnalytics.id: null` in `src/config.yaml` — analytics is disabled by default.
- `hasExternalScripts = false` in `astro.config.ts` keeps `@astrojs/partytown` wrapping disabled; flip to `true` when GA is wired.

---

*Architecture analysis: 2026-04-20*
