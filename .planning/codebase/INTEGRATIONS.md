# External Integrations

**Analysis Date:** 2026-04-20

## APIs & External Services

**Analytics:**
- Google Analytics (GA4) — Injected via `@astrolib/analytics` `^0.6.1`. Gated by `ANALYTICS?.vendors?.googleAnalytics?.id` in `src/components/common/Analytics.astro`. The ID lives in `src/config.yaml` under `analytics.vendors.googleAnalytics.id` (currently `null` — disabled). When an ID is set, the component forwards a `partytown` boolean (default `true` per `vendor/integration/utils/configBuilder.ts` getAnalytics defaults), which would route GA through `@astrojs/partytown` — however Partytown is currently gated off because `hasExternalScripts = false` in `astro.config.ts`. Enabling GA for production therefore requires both setting the ID AND flipping `hasExternalScripts` (or refactoring the guard).
- Splitbee Analytics — Component exists at `src/components/common/SplitbeeAnalytics.astro` (inlines `https://cdn.splitbee.io/sb.js` with `data-respect-dnt` / `data-no-cookie` attributes), but it is not imported anywhere in the current layouts. Leftover AstroWind scaffolding, not wired into pages.

**SEO / Metadata:**
- `@astrolib/seo` `^1.0.0-beta.8` — Used in `src/components/common/Metadata.astro` via the `AstroSeo` component. Handles Open Graph, Twitter cards, canonical URLs, noindex/nofollow. Feeds defaults from `astrowind:config` (SITE, METADATA, I18N). The `Props` type is re-exported as `AstroSeoProps` locally.
- `@astrojs/sitemap` `^3.7.2` — Generates `sitemap-index.xml` at build. The custom integration `vendor/integration/index.ts` (`astro:build:done` hook) detects `@astrojs/sitemap` in `cfg.integrations` and rewrites/creates `robots.txt` to append a `Sitemap: <URL>` line.
- `@astrojs/rss` `^4.0.18` — `src/pages/rss.xml.ts` emits the feed. Pulls `SITE`, `METADATA`, `APP_BLOG` from `astrowind:config` and uses `import.meta.env.SITE` for the base URL.

**Media Embeds:**
- `astro-embed` `^0.13.0` — Imports `YouTube` from `astro-embed` in `src/pages/homes/startup.astro` (leftover demo). Can embed YouTube, Vimeo, Twitter, and similar providers if pulled into future pages.

**Image CDN / Optimization:**
- Astro native `astro:assets` + `sharp` `^0.34.5` — Used for local images via `astroAssetsOptimizer` in `src/utils/images-optimization.ts`.
- `unpic` `^4.2.2` — Third-party image CDN transformer used by `unpicOptimizer` in `src/utils/images-optimization.ts` and guarded by `isUnpicCompatible` in `src/components/common/Image.astro`. Auto-detects and rewrites URLs for supported CDNs (Imgix, Cloudinary, Vercel, Netlify, Shopify, Contentful, etc.).
- Whitelisted remote image hosts (from `astro.config.ts > image.domains`): `cdn.pixabay.com`, `images.unsplash.com`, `plus.unsplash.com`, `img.shields.io`. These are AstroWind demo hosts and should be trimmed/replaced with konvoi.eu production asset hosts.

**Icons:**
- `astro-icon` `^1.1.5` + Iconify packs:
  - `@iconify-json/tabler` `^1.2.33` — Bundled with `include: ['*']` (whole set)
  - `@iconify-json/flat-color-icons` `^1.2.3` — Narrow include list (9 icons: `template`, `gallery`, `approval`, `document`, `advertising`, `currency-exchange`, `voice-presentation`, `business-contact`, `database`)
- Icon names are referenced as strings like `tabler:mail`, `tabler:headset`, `tabler:map-pin` throughout widgets.

**Fonts:**
- `@fontsource-variable/inter` `^5.2.8` — Self-hosted Inter variable font. Module declaration in `src/env.d.ts`. No Google Fonts or CDN calls at runtime.

## Data Storage

**Databases:**
- None. This is a fully static site with no database client, no ORM, and no server-side data layer.

**File Storage:**
- Local filesystem only.
  - Blog posts: `src/data/post/*.md|mdx` (loaded by `src/content.config.ts` via Astro `glob` loader; schema validated with Zod from `astro/zod`)
  - Static assets: `src/assets/images/`, `src/assets/styles/`
  - Public passthrough: `public/` (e.g., `robots.txt`, `_headers`, `decapcms/`)
- No cloud object storage (S3, GCS, R2) configured.

**Caching:**
- Build-time: none beyond Vite/Astro internals.
- Runtime: HTTP caching for hashed assets configured in `public/_headers` (`/_astro/*` → 1 year immutable).

## Authentication & Identity

**Auth Provider:**
- None for the public site itself.
- **Decap CMS (formerly Netlify CMS)** admin UI scaffolding exists at `public/decapcms/index.html` + `public/decapcms/config.yml`. Config uses `backend: git-gateway` on `branch: main` — meaning auth would be delegated to Netlify Identity / Git Gateway if the CMS is activated. **Status: leftover AstroWind scaffolding, not confirmed as part of the Konvoi rollout.** The configured `folder: 'src/content/post'` does not match the real content path `src/data/post` defined in `src/content.config.ts`, so the CMS is currently broken and must be fixed or removed.

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, Datadog, Rollbar, Bugsnag, or similar SDK imported).

**Logs:**
- Build-time logger via Astro `logger.fork('astrowind')` in `vendor/integration/index.ts` (e.g., `buildLogger.info(...)` for config-load and robots.txt rewrite messages).
- Runtime client logging: `console.error(...)` calls in `src/utils/images-optimization.ts` when image dimensions are ambiguous. No structured logging pipeline.

## CI/CD & Deployment

**Hosting:**
- Not explicitly declared. Strong signals toward **Netlify or Cloudflare Pages** static hosting: `public/_headers` uses Netlify/CF Pages header file syntax; Decap CMS config uses `git-gateway` (Netlify-native); no Astro server adapter is configured.

**CI Pipeline:**
- GitHub Actions — `.github/workflows/actions.yaml`
  - Triggers: `push` to `main`, `pull_request` targeting `main`
  - Jobs: `build` (Node matrix 18/20/22, runs `npm ci` + `npm run build`), `check` (Node 22, runs `npm run check`)
  - **STALE**: Uses `npm ci` / `npm run build` / `cache: npm`; the repo now uses pnpm with a `pnpm-lock.yaml` and Node `^22 || >=24`. Action needs migration to `pnpm/action-setup` + `pnpm install --frozen-lockfile`.
  - Test step is commented out (`# - run: npm test`) — no test suite yet.

## Environment Configuration

**Required env vars:**
- None at runtime. The codebase reads only Astro-injected values:
  - `import.meta.env.MODE` → `src/utils/directories.ts`
  - `import.meta.env.SITE` → `src/pages/rss.xml.ts`
- All other configuration is compile-time from `src/config.yaml`.

**Secrets location:**
- No secrets in the repo, no `.env*` files present.
- Future integrations (analytics ID, Google site verification, contact form endpoints) will likely be injected either via the hosting provider's environment or by editing `src/config.yaml`.

## Webhooks & Callbacks

**Incoming:**
- None. No server routes exist (static output only); no API endpoints.

**Outgoing:**
- None in code. The contact form at `src/pages/contact.astro` uses the `Contact` widget (`src/components/widgets/Contact.astro`) but has NO `action=`, `method=`, `onsubmit`, or `fetch(...)` handler wired up. The form is currently a non-functional placeholder and must be connected to a form backend (Netlify Forms, Formspree, HubSpot, custom webhook, etc.) as part of the Konvoi rollout.
- `src/components/common/BasicScripts.astro` contains one `mailto:` share handler for social sharing — not a webhook.

## Third-Party Scripts Inventory

- `@astrolib/analytics` GoogleAnalytics component (conditional, currently off)
- Splitbee `cdn.splitbee.io/sb.js` (component exists, not referenced)
- Partytown worker (conditional, currently off; guard `hasExternalScripts = false`)
- No Hotjar, Intercom, Segment, Stripe, or other third-party SDKs detected.

---

*Integration audit: 2026-04-20*
