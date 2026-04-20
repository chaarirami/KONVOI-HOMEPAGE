# Technology Stack

**Analysis Date:** 2026-04-20

## Languages

**Primary:**
- TypeScript `^6.0.3` — All `src/**` logic, `astro.config.ts`, `vendor/integration/**`, content schemas (`src/content.config.ts`)
- Astro component language (`.astro` files) — All UI components under `src/components/**`, pages under `src/pages/**`, layouts under `src/layouts/**`

**Secondary:**
- JavaScript (ESM) — ESLint config (`eslint.config.js`) and Prettier config (`.prettierrc.cjs`, CommonJS)
- YAML — Theme configuration (`src/config.yaml`), Decap CMS config (`public/decapcms/config.yml`), GitHub Actions workflow (`.github/workflows/actions.yaml`)
- Markdown / MDX — Blog posts (`src/data/post/*.md|mdx`), static legal pages (`src/pages/privacy.md`, `src/pages/terms.md`)
- CSS (Tailwind v4 CSS-first) — `src/assets/styles/tailwind.css`

## Runtime

**Environment:**
- Node.js — declared engines: `^22.0.0 || >=24.0.0` in `package.json`
- Browser — static HTML output (`output: 'static'` in `astro.config.ts`); no server runtime in production

**Package Manager:**
- **pnpm is the mandated package manager** (not npm). The `package.json` `pnpm` block configures `onlyBuiltDependencies: ["esbuild", "sharp"]` and `.npmrc` sets `shamefully-hoist=true` and the same `only-built-dependencies` list. All dev scripts (`pnpm run check`, `pnpm run fix`, etc.) assume pnpm.
- Lockfile: `pnpm-lock.yaml` present (npm lockfiles should NOT be committed)
- NOTE: `.github/workflows/actions.yaml` still uses `npm ci` / `npm run build` / `npm run check` — this is stale leftover from AstroWind and must be migrated to pnpm to match the local toolchain.

## Frameworks

**Core:**
- Astro `^6.1.8` — Static-site generator; meta-framework orchestrating file-based routing, content collections, MDX, image optimization, view transitions (`ClientRouter` from `astro:transitions` used in `src/layouts/Layout.astro`)
- Tailwind CSS `^4.2.2` — Utility-first styling; configured CSS-first via `@import 'tailwindcss'` in `src/assets/styles/tailwind.css`. **`@astrojs/tailwind` was dropped in favor of `@tailwindcss/vite` `^4.2.2`** — wired as a Vite plugin in `astro.config.ts` (`vite.plugins: [tailwindcss()]`), not as an Astro integration.
- `@tailwindcss/typography` `^0.5.19` — Activated via `@plugin '@tailwindcss/typography';` inside `src/assets/styles/tailwind.css` (v4 plugin directive, no `tailwind.config.*` file exists).

**Testing:**
- None detected. No `jest.config.*`, `vitest.config.*`, `playwright.config.*`, or `*.test.*` / `*.spec.*` files are present. The `package.json` scripts do not define a `test` command; CI has a commented-out `# - run: npm test`.

**Build/Dev:**
- `astro` CLI — `dev`, `build`, `preview`, `check` via `package.json` scripts
- `@astrojs/check` `^0.9.8` — TypeScript-aware Astro type checking (`astro check`)
- `astro-compress` `^2.4.1` — Post-build CSS/HTML/JS minification (Image/SVG compression disabled in `astro.config.ts`)
- `@astrojs/mdx` `^5.0.3` — MDX support for content collections and pages
- `@astrojs/sitemap` `^3.7.2` — Generates `sitemap-index.xml` at build time
- `@astrojs/partytown` `^2.1.7` — Conditionally loaded via `whenExternalScripts` guard (`hasExternalScripts = false` in `astro.config.ts` → currently inactive)
- `astro-icon` `^1.1.5` — Icon integration backed by `@iconify-json/tabler` and `@iconify-json/flat-color-icons`
- `sharp` `^0.34.5` — Image processing backend for Astro's `astro:assets`
- Vite — Provided transitively by Astro; path alias `~` → `./src` defined in `astro.config.ts` (mirrored in `tsconfig.json` paths)

## Key Dependencies

**Critical:**
- `astro` `^6.1.8` — Framework core
- `@tailwindcss/vite` `^4.2.2` — Replaces legacy `@astrojs/tailwind`; Tailwind v4 pipeline
- `tailwindcss` `^4.2.2` — Design system
- `typescript` `^6.0.3` — Type system (extends `astro/tsconfigs/base`, `strictNullChecks: true`)
- `@astrolib/seo` `^1.0.0-beta.8` — Drives `src/components/common/Metadata.astro` (Open Graph, Twitter, canonical)
- `@astrolib/analytics` `^0.6.1` — Provides `GoogleAnalytics` component used in `src/components/common/Analytics.astro`
- `unpic` `^4.2.2` — Remote image CDN optimizer in `src/utils/images-optimization.ts` (`unpicOptimizer`, `isUnpicCompatible`)
- `astro-embed` `^0.13.0` — Media embeds (e.g., `YouTube` used in `src/pages/homes/startup.astro`)
- `astro-icon` `^1.1.5` — `<Icon />` component used across widgets
- `limax` `^4.2.3` — URL slug generation in `src/utils/permalinks.ts`
- `lodash.merge` `^4.6.2` — Deep config merging in `vendor/integration/utils/configBuilder.ts` and `src/components/common/Metadata.astro`
- `@fontsource-variable/inter` `^5.2.8` — Self-hosted Inter variable font

**Infrastructure:**
- `@astrojs/rss` `^4.0.18` — Generates feed via `src/pages/rss.xml.ts`
- `reading-time` `^1.5.0` — Remark plugin input in `src/utils/frontmatter.ts` (`readingTimeRemarkPlugin`)
- `mdast-util-to-string` `^4.0.0` — Used alongside `reading-time` in the remark plugin
- `unist-util-visit` `^5.1.0` — Rehype plugin helper in `src/utils/frontmatter.ts` (`responsiveTablesRehypePlugin`, `lazyImagesRehypePlugin`)
- `tailwind-merge` `^3.5.0` — Runtime class deduplication (`twMerge`) in `src/components/ui/Button.astro`, `Headline.astro`, `ItemGrid.astro`, `WidgetWrapper.astro`, etc.
- `js-yaml` `^4.1.1` — Loads `src/config.yaml` inside `vendor/integration/utils/loadConfig.ts`
- `@astrojs/check` `^0.9.8`, `@astrojs/markdown-remark` (transitive via Astro)

**Linting / Formatting:**
- `eslint` `^10.2.1` with flat config (`eslint.config.js`)
- `@eslint/js` `^10.0.1`, `typescript-eslint` `^8.58.2`, `@typescript-eslint/parser` `^8.58.2`, `@typescript-eslint/eslint-plugin` `^8.58.2`
- `eslint-plugin-astro` `^1.7.0`, `astro-eslint-parser` `^1.4.0`
- `globals` `^17.5.0`
- `prettier` `^3.8.3` + `prettier-plugin-astro` `^0.14.1`

## Configuration

**Environment:**
- No `.env` / `.env.*` file is present and none is expected in the current build — it is a fully static site.
- Runtime environment reads: `import.meta.env.MODE` (`src/utils/directories.ts`) and `import.meta.env.SITE` (`src/pages/rss.xml.ts`). Both are Astro-injected, not user-supplied.
- Theme configuration is loaded from `src/config.yaml` at build time by the custom `astrowind` integration (`vendor/integration/index.ts`) and exposed via the Vite virtual module `astrowind:config` (exports `SITE`, `I18N`, `METADATA`, `APP_BLOG`, `UI`, `ANALYTICS`).
- Analytics ID is null by default (`src/config.yaml` → `analytics.vendors.googleAnalytics.id: null`). Populating it would inject `@astrolib/analytics` at build time.
- Google site verification: `googleSiteVerificationId` field in `src/config.yaml` (currently the leftover AstroWind demo ID — needs replacement for konvoi.eu).

**Build:**
- `astro.config.ts` — Integrations: `sitemap`, `mdx`, `icon`, conditional `partytown`, `compress`, custom `astrowind`. Image `domains` whitelist: `cdn.pixabay.com`, `images.unsplash.com`, `plus.unsplash.com`, `img.shields.io`. Markdown remark/rehype plugins wired from `src/utils/frontmatter.ts`. Output mode: `static`.
- `tsconfig.json` — Extends `astro/tsconfigs/base`, `strictNullChecks: true`, `allowJs: true`, path alias `~/*` → `src/*`.
- `eslint.config.js` — Flat config; combines `js.configs.recommended`, `eslint-plugin-astro flat/recommended`, `typescript-eslint.configs.recommended`. Astro files use `astro-eslint-parser` with `@typescript-eslint/parser` inside; `.astro/*.js` virtual files use the TS parser. `no-unused-vars` off in favor of `@typescript-eslint/no-unused-vars` with `argsIgnorePattern: '^_'`. Ignores: `dist`, `node_modules`, `.github`, `types.generated.d.ts`, `.astro`.
- `.prettierrc.cjs` — `printWidth: 120`, `semi: true`, `singleQuote: true`, `tabWidth: 2`, `trailingComma: 'es5'`, `useTabs: false`; Astro files parsed via `prettier-plugin-astro`.
- `.npmrc` — `shamefully-hoist=true`; `only-built-dependencies=["esbuild","sharp"]` (mirrors `package.json > pnpm.onlyBuiltDependencies`).
- `public/_headers` — Netlify/Cloudflare Pages-style cache headers: `/_astro/* Cache-Control: public, max-age=31536000, immutable`.
- `public/robots.txt` — Permissive `User-agent: * / Disallow:` (empty Disallow). Appended automatically with `Sitemap: ...` by the custom integration's `astro:build:done` hook (`vendor/integration/index.ts`).

## Platform Requirements

**Development:**
- Node.js 22.x or 24+ (from `package.json > engines`)
- pnpm (lockfile: `pnpm-lock.yaml`); do NOT use npm or yarn locally
- Sharp requires native build support — whitelisted under `onlyBuiltDependencies`
- Windows development supported (current working directory is Windows-based), but Unix-style paths used internally; contributors on Windows should use Git Bash or WSL if shell scripts appear

**Production:**
- Static hosting (the `output: 'static'` config + `public/_headers` Netlify/Cloudflare-style file suggests **Netlify or Cloudflare Pages** as the likely deploy target; no explicit adapter is configured, consistent with `static` output)
- Build produces `dist/` containing HTML, `_astro/*` hashed assets, `sitemap-index.xml`, and a rewritten `robots.txt`
- `.github/workflows/actions.yaml` currently runs CI on Node 18, 20, 22 via `npm ci` / `npm run build` / `npm run check` — mismatched with local pnpm + Node 22/24 toolchain; must be updated.

---

*Stack analysis: 2026-04-20*
