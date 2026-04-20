# Codebase Concerns

**Analysis Date:** 2026-04-20

> Project identity: `konvoi-homepage` is an AstroWind fork being rebuilt as the corporate B2B marketing site for Konvoi (trailer-security-tech, Germany). Build passes (Astro 6.1.8 + Tailwind 4.2.2 + TS 6.0.3 + pnpm), but content is ~100% AstroWind demo scaffolding and Konvoi-specific code is effectively 0%. The concerns below are ranked by severity: **CRITICAL / HIGH / MEDIUM / LOW**. Each concern includes the exact files that need to be changed so `/gsd-plan-phase` can scope work directly.

---

## Tech Debt

### [CRITICAL] AstroWind template debris across all public routes
- Issue: The site still is AstroWind. Every public-facing route ships template placeholder copy ("Stellar Pricing for Every Journey", "Elevate your online presence with our Beautiful Website Templates", "AstroWind LLC, 1 Cupertino, CA 95014", lorem ipsum) and links to `https://github.com/arthelokyo/astrowind` as the "Download" / "Get template" CTA. Going to production in this state would publicly ship a clone of the AstroWind demo under konvoi.eu.
- Files:
  - Demo homepages (not needed for Konvoi): `src/pages/homes/saas.astro`, `src/pages/homes/startup.astro`, `src/pages/homes/personal.astro`, `src/pages/homes/mobile-app.astro`
  - Demo landing pages (not needed for Konvoi): `src/pages/landing/lead-generation.astro`, `src/pages/landing/sales.astro`, `src/pages/landing/click-through.astro`, `src/pages/landing/product.astro`, `src/pages/landing/pre-launch.astro`, `src/pages/landing/subscription.astro`
  - Placeholder-copy "real" pages: `src/pages/index.astro`, `src/pages/about.astro`, `src/pages/services.astro`, `src/pages/pricing.astro`, `src/pages/contact.astro`
  - Header/footer nav linking to demo routes + GitHub: `src/navigation.ts` (all `#` links in footer `Product/Platform/Support/Company` sections, `AstroWind Desktop`, GitHub social link, `Arthelokyo` footNote)
  - Hardcoded AstroWind GitHub stars shield + external link: `src/components/widgets/Announcement.astro` (lines 12-21 hardcode `https://astro.build/blog/astro-5120/`, `img.shields.io/github/stars/arthelokyo/astrowind.svg`, and `github.com/arthelokyo/astrowind`)
  - Legal debris citing "AstroWind LLC, 1 Cupertino, CA 95014": `src/pages/privacy.md` (lines 23, 31), `src/pages/terms.md` (lines 24, 34) — last updated "January 06, 2023"
  - Demo blog corpus in `src/data/post/`: `astrowind-template-in-depth.mdx`, `get-started-website-with-astro-tailwind-css.md`, `how-to-customize-astrowind-to-your-brand.md`, `landing.md`, `markdown-elements-demo-post.mdx`, `useful-resources-to-create-websites.md` (four of them hardcode `canonical: https://astrowind.vercel.app/...` — these canonicals will leak AstroWind URLs into a production konvoi.eu sitemap unless removed)
  - Config still identifies the site as AstroWind: `src/config.yaml` lines 2-4, 11-14, 19, 26-27 (`site.name`, `site.site`, `metadata.title`, `metadata.description` rocket-emoji AstroWind blurb, `openGraph.site_name`, `twitter.handle/site: @arthelokyo`)
- Impact: Site is unshippable as Konvoi until replaced. Every single public page is off-brand. SEO liabilities (AstroWind canonicals, AstroWind OG metadata, `@arthelokyo` Twitter card) will follow the content into search indexes if deployed.
- Fix approach: Phased replacement. (1) Gate deploys behind a `robots: noindex` + staging subdomain until Konvoi content lands. (2) Delete `src/pages/homes/**`, `src/pages/landing/**`, and the six demo posts in `src/data/post/`. (3) Rewrite `src/pages/index.astro`, `about.astro`, `services.astro`, `pricing.astro`, `contact.astro` with Konvoi B2B trailer-security copy and imagery. (4) Delete `src/components/widgets/Announcement.astro` (or rebrand it to a Konvoi announcement bar). (5) Rewrite `src/pages/privacy.md` + `src/pages/terms.md` with Konvoi GmbH imprint / DSGVO-compliant German + English versions. (6) Replace every `getPermalink('/homes/...')`, `/landing/...`, and `arthelokyo` link in `src/navigation.ts`. (7) Update `src/config.yaml` → `site.name: Konvoi`, `site.site: https://www.konvoi.eu`, real OG image at `src/assets/images/`, remove `@arthelokyo` Twitter handles, set `metadata.description` in DE+EN.

### [HIGH] `vendor/integration/` vendored AstroWind integration with no upstream link
- Issue: `vendor/integration/` is a filesystem copy of a third-party Astro integration (the `astrowind-integration` that powers `astrowind:config` virtual module), imported via `import astrowind from './vendor/integration';` in `astro.config.ts:14,66-68`. `vendor/README.md` says only: "This folder will become an integration for AstroWind. We are working to allow updates to template instances." No upstream URL, no version pin, no changelog.
- Files: `vendor/integration/index.ts`, `vendor/integration/types.d.ts`, `vendor/integration/utils/*`, `vendor/README.md`, `astro.config.ts`
- Impact: If the real upstream fixes a bug (e.g. Astro 6 incompat in the `astro:build:done` hook) we don't get it. If we diverge we own maintenance forever. Upgrading Astro past 6.x may quietly break the virtual-module plugin.
- Fix approach: (a) Audit what `astrowind:config` is actually used for (probably just `site.name`, `metadata`, `apps.blog` config consumed by `src/layouts/*` and `src/utils/*`). (b) Either replace with a plain `import config from './config.yaml'` + `js-yaml` parse in a small local util, eliminating the integration entirely, or (c) promote `vendor/integration/` to a real in-repo `src/integrations/konvoi-config/` with a proper `name`, version, and owner comment. Option (b) is cleaner for a marketing site.

### [HIGH] Decap CMS scaffolding present but not wired to Konvoi workflow
- Issue: `public/decapcms/index.html` boots Decap CMS 3.x via unpkg CDN and Netlify Identity widget. `public/decapcms/config.yml` targets `src/content/post` (note: wrong folder — the real content is loaded from `src/data/post/` per `src/content.config.ts:51`) and uses `backend: git-gateway` with `branch: main`. No auth provider is configured (Konvoi site is not on Netlify per the repo signals, and there's no indication Git Gateway is provisioned).
- Files: `public/decapcms/config.yml`, `public/decapcms/index.html`, `src/content.config.ts`
- Impact: As shipped, `/decapcms/` will load, try to authenticate via Netlify Identity, fail, and save any successful edits to a non-existent `src/content/post` directory (not where posts actually live). Broken admin surface publicly exposed at `/decapcms/`.
- Fix approach: Decide: (a) Konvoi uses no CMS → delete `public/decapcms/` entirely. (b) Konvoi uses Decap → fix `folder: src/content/post` → `folder: src/data/post`, add `i18n` config for DE/EN, configure a real backend (GitHub OAuth / self-hosted git-gateway), add DE+EN media folders, add `<meta name="robots" content="noindex">` (already present) and consider serving at a non-guessable path.

### [HIGH] Blog / content collection is AstroWind-only, single-locale, and not aligned with Konvoi
- Issue: `src/content.config.ts` defines one `post` collection loading from `src/data/post/*.{md,mdx}`. All 6 existing posts are AstroWind marketing/demo content. Konvoi plans suggest either a localised DE+EN blog at `/aktuelles` or removing the blog entirely in favor of linking out.
- Files: `src/content.config.ts`, `src/data/post/*`, `src/pages/[...blog]/**`, `src/pages/rss.xml.ts`, `src/config.yaml` (`apps.blog` section), `src/components/widgets/BlogLatestPosts.astro`, `src/components/widgets/BlogHighlightedPosts.astro`
- Impact: If blog stays, all 6 demo posts go live under Konvoi's domain. If blog goes, multiple widgets, the RSS route, the `[...blog]` dynamic route, and the `apps.blog` config block still reference it and will either 404 or render empty sections.
- Fix approach: Decide first. If kept: (a) Delete all six demo posts. (b) Extend `postCollection` schema with a `locale: z.enum(['de','en'])` field. (c) Create first Konvoi DE + EN posts. (d) Update `apps.blog.pathname` to `aktuelles` (or keep `blog`). (e) Update `rss.xml.ts` to filter by locale. If removed: delete `src/pages/[...blog]/`, `src/pages/rss.xml.ts`, `src/content.config.ts`, `src/data/post/`, `src/components/widgets/BlogLatestPosts.astro`, `src/components/widgets/BlogHighlightedPosts.astro`, `src/components/blog/**`, and the `apps.blog` block in `src/config.yaml`, plus the `Blog` nav entry in `src/navigation.ts:88-112`.

### [MEDIUM] `TODO` / `FIXME` comments in core utilities
- Issue: Two active `TODO`/`FIXME` markers in code that executes on every page.
- Files:
  - `src/components/common/ApplyColorMode.astro:4` — `// TODO: This code is temporary` (color-mode application script, runs inline in every page `<head>`)
  - `src/utils/images-optimization.ts:39` — `// FIXME: Use this when image.width is minor than deviceSizes` (inside the `config` object that drives all `<Image>` responsive breakpoints)
- Impact: The color-mode script is load-bearing for theme flicker prevention (see recent commit `ed3cc87 Merge pull request #646 ... Fix theme-toggle-flickering`) — anyone refactoring it without understanding the temporary status risks reintroducing the flicker bug. The image-optimization FIXME means small images may be upsized unnecessarily, inflating CDN bandwidth.
- Fix approach: For the color-mode script, add a comment block linking PR #646 and documenting the invariant. For the image config, decide: either filter `imageSizes` by `image.width` in `getImagesOptimized()` or delete the FIXME and accept current behavior.

---

## Known Bugs

### [HIGH] RSS / OG / canonical URLs will emit `https://astrowind.vercel.app`
- Symptoms: `src/config.yaml:3` hard-codes `site.site: 'https://astrowind.vercel.app'`. This value flows into `@astrojs/sitemap`, `@astrolib/seo`, RSS feed, and `<link rel="canonical">` via `src/layouts/Layout.astro` and `src/components/common/Metadata.astro`. Any production build will publish sitemap + RSS with AstroWind URLs.
- Files: `src/config.yaml`, `astro.config.ts` (sitemap integration), `src/pages/rss.xml.ts`, `src/layouts/Layout.astro`, `src/components/common/Metadata.astro`
- Trigger: Run `pnpm build` and inspect `dist/sitemap-*.xml` + `dist/rss.xml`.
- Workaround: None — must fix config before first production build.

### [HIGH] Blog posts hardcode AstroWind canonicals
- Symptoms: `canonical: https://astrowind.vercel.app/...` appears in the frontmatter of 4 posts: `src/data/post/landing.md:11`, `src/data/post/get-started-website-with-astro-tailwind-css.md:12`, `src/data/post/how-to-customize-astrowind-to-your-brand.md:11`, `src/data/post/astrowind-template-in-depth.mdx:12`.
- Files: all four listed above
- Trigger: View page source on any rendered blog post — `<link rel="canonical" href="https://astrowind.vercel.app/...">` will be emitted, telling Google the canonical version of Konvoi's blog post lives on AstroWind's demo site.
- Workaround: Delete the posts (preferred) or strip the `canonical:` line.

### [MEDIUM] Footer links are mostly `href="#"` placeholders
- Symptoms: `src/navigation.ts:126-165` has ~22 footer links all pointing to `#`. Clicking any of them jumps to top of page.
- Files: `src/navigation.ts`
- Trigger: Click any link in Product / Platform / Support / Company footer sections.
- Workaround: None — must rewrite for Konvoi IA (Produkte, Karriere, Kontakt, Impressum, Datenschutz, EN equivalents).

---

## Security Considerations

### [HIGH] Public admin surface at `/decapcms/` with misconfigured backend
- Risk: `public/decapcms/index.html` is served as a static admin page at `https://<domain>/decapcms/`. It boots Decap CMS from `unpkg.com` (third-party CDN, no SRI) and Netlify Identity widget from `identity.netlify.com`. If the Konvoi deploy target ever does connect a git-gateway or identity provider, this becomes a live CMS editor on the public internet.
- Files: `public/decapcms/index.html`, `public/decapcms/config.yml`
- Current mitigation: `<meta name="robots" content="noindex">` in `index.html` line 6 prevents indexing but does not prevent access.
- Recommendations: (a) If CMS is not used, remove the `public/decapcms/` directory entirely. (b) If used, add HTTP auth at the hosting layer (Netlify/Vercel password protection), enforce SRI on the CDN scripts or pin to a local copy, wire a proper OAuth backend, and consider serving under a non-enumerable path.

### [MEDIUM] `img.shields.io` allowed in image whitelist — third-party URL-as-image
- Risk: `astro.config.ts:72` includes `img.shields.io` in `image.domains`. The only consumer is the hardcoded stars badge in `src/components/widgets/Announcement.astro:18`. Shields.io generates SVGs dynamically from URL params — if the URL is ever constructed from user input (it's not today), it becomes an open XSS surface. More realistically: if shields.io is compromised or goes down, the announcement bar breaks on every page.
- Files: `astro.config.ts`, `src/components/widgets/Announcement.astro`
- Current mitigation: Single hardcoded URL, not user-controlled.
- Recommendations: Remove `Announcement.astro` use, then remove `img.shields.io` from `image.domains`.

### [MEDIUM] `images.unsplash.com` / `plus.unsplash.com` / `cdn.pixabay.com` whitelist is a production liability
- Risk: `astro.config.ts:72` whitelists four external image hosts. Every live Konvoi page would fetch stock photography from third parties, creating (a) GDPR liability (IP addresses of EU visitors transferred to Unsplash/AWS), (b) availability risk if the upstream URL rots, (c) off-brand stock imagery in Konvoi's corporate site.
- Files: `astro.config.ts`, plus every `src/pages/homes/*.astro`, `src/pages/landing/*.astro`, `src/pages/index.astro`, `src/pages/about.astro`, `src/pages/services.astro`, `src/pages/pricing.astro`, and five of six demo posts in `src/data/post/`
- Current mitigation: None. These URLs render on every demo page visit.
- Recommendations: Import all imagery locally via `src/assets/images/` (Astro's `<Image>` handles optimization + self-hosting). After demo pages are deleted, reduce `image.domains` in `astro.config.ts` to `[]` or remove the array entirely.

### [LOW] `googleSiteVerificationId` is AstroWind's, not Konvoi's
- Risk: `src/config.yaml:7` contains `orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M` — this is onWidget/AstroWind's Google Search Console verification token. If the site deploys with this token, Konvoi's real domain will not verify in Search Console, and AstroWind's GSC account receives verification confirmation for a domain that isn't theirs.
- Files: `src/config.yaml:7`, `src/components/common/SiteVerification.astro`
- Current mitigation: None.
- Recommendations: Replace with Konvoi's token (or set to empty to disable).

### [LOW] License is MIT © onWidget, not a Konvoi license choice
- Risk: `LICENSE.md` is the unmodified AstroWind MIT license: "Copyright (c) 2023 onWidget". For a private corporate homepage, this is wrong both legally (Konvoi is not redistributing the derivative under MIT by choice) and practically (it suggests the site code is open for anyone to reuse). Fork obligations: AstroWind's MIT permits the fork, but the resulting konvoi-homepage does not have to be MIT; it should be re-licensed or marked proprietary.
- Files: `LICENSE.md`, `package.json` (already `"private": true` which is correct)
- Current mitigation: `package.json` sets `private: true`, preventing accidental publish to npm.
- Recommendations: Replace `LICENSE.md` with either (a) "All rights reserved © Konvoi GmbH" for a proprietary codebase, or (b) a UNLICENSED / "see LICENSE in upstream AstroWind" note if the goal is to keep MIT attribution to onWidget while closing the fork. Decide with Konvoi legal.

---

## Performance Bottlenecks

### [LOW] No measured problems — mostly theoretical for a static site
- Problem: Site is `output: 'static'` (see `astro.config.ts:25`), so runtime perf is near-zero. The only non-trivial perf cost is build-time image optimization via `sharp`.
- Files: `astro.config.ts`, `src/utils/images-optimization.ts`
- Cause: Large `deviceSizes` array (15 breakpoints from 640 to 6016px in `src/utils/images-optimization.ts:42-58`) — every image currently gets up to 15 responsive variants at build time.
- Improvement path: Once external Unsplash/shields/pixabay URLs are replaced with local assets, verify build time doesn't balloon. Consider trimming `deviceSizes` to 6-8 breakpoints appropriate for a marketing site (desktop 1920/1280, tablet 1080/828, mobile 640/375). Optional: enable `astro-compress` Image flag (currently `Image: false` at `astro.config.ts:60`) once upstream compat is confirmed.

### [LOW] `astro-compress` has `Image: false` and `SVG: false`
- Problem: `astro.config.ts:53-64` disables image and SVG compression by this integration.
- Files: `astro.config.ts`
- Cause: Likely a historical compat safeguard (SVG compression has broken Tabler icons in the past).
- Improvement path: After finalizing Konvoi assets, re-test with `SVG: true` and `Image: true` to see if output size drops meaningfully.

---

## Fragile Areas

### [HIGH] The `vendor/integration/` → `astrowind:config` virtual module chain
- Files: `vendor/integration/index.ts`, `vendor/integration/types.d.ts`, `astro.config.ts:14,66-68`, plus every consumer of `import ... from 'astrowind:config'` across `src/utils/`, `src/layouts/`, `src/components/common/Metadata.astro`, etc.
- Why fragile: A virtual module resolved by a vendored Vite plugin. Any Astro 6.x → 6.y minor bump that touches the `astro:build:done` hook signature, or any Vite major bump, can silently break `astrowind:config` resolution. Error will surface as "Cannot find module 'astrowind:config'" deep in component TypeScript.
- Safe modification: Don't touch `vendor/integration/` directly. If you need new config, add it to `src/config.yaml` and let the vendored integration pass it through.
- Test coverage: None — no tests exist.

### [HIGH] Color-mode flicker fix
- Files: `src/components/common/ApplyColorMode.astro`, `src/components/common/ToggleTheme.astro`, `src/components/common/BasicScripts.astro`
- Why fragile: Recent fix in PR #646 (commit `ed3cc87`) resolved a theme-toggle flicker. The file self-identifies as `// TODO: This code is temporary`. Runs as inline `<script>` at the top of every `<head>` to pre-compute the class before CSS paints.
- Safe modification: Do NOT move, defer, or deduplicate this script without reproducing the flicker manually in light+dark+system modes. Test with `theme: 'system'` (current default in `src/config.yaml:72`) on first paint and after toggling OS dark mode.
- Test coverage: None.

### [MEDIUM] The `[...blog]/[...page].astro` dynamic route
- Files: `src/pages/[...blog]/[...page].astro`, `src/utils/blog.ts`, `src/utils/permalinks.ts`
- Why fragile: Catch-all route that permutes blog list + category + tag + paginated-list + post-detail URLs from a single template, using config-driven permalink patterns. Modifying `apps.blog.permalink` or disabling any of `apps.blog.{list,category,tag}` in `src/config.yaml` can yield 404s that only appear at runtime.
- Safe modification: If removing blog, remove the whole route directory. If keeping but restructuring, run `pnpm build` and inspect `dist/` for expected pages.
- Test coverage: None.

---

## Scaling Limits

### Not applicable
- This is a static marketing site. Build time scales with number of pages + images, not runtime traffic. Once Konvoi content stabilizes, expect <200 pages including DE+EN + blog. No scaling wall is near.

---

## Dependencies at Risk

### [HIGH] `@astrolib/analytics@0.6.1` + `@astrolib/seo@1.0.0-beta.8` peer-dep drift
- Risk: Both packages declare `peerDependencies: { astro: "^1.2.1 || ^2.0.0 || ^3.0.0-beta.0 || ^3.0.0 || ^4.0.0 || ^5.0.0-beta.0 || ^5.0.0" }` (see `pnpm-lock.yaml:231-232, 236-237`) but the project runs `astro@6.1.8` (`package.json:30`). pnpm installs without error because peer ranges are soft, but these packages are unmaintained enough that Astro 5→6 API changes could break them silently.
- Impact: `@astrolib/seo` drives every `<head>` meta tag via `src/components/common/Metadata.astro`; a breakage would strip OG / Twitter / canonical markup site-wide. `@astrolib/analytics` is only wired if `analytics.vendors.googleAnalytics.id` is non-null (currently null in `src/config.yaml:69`) so its risk is dormant.
- Migration plan: (a) Replace `@astrolib/seo` with Astro's built-in `<meta>` + a small hand-rolled helper (the SEO component surface is ~10 tags — not worth a dependency). (b) Replace `@astrolib/analytics` with a direct Plausible/Matomo/GA4 snippet conditionally rendered when the site goes live; GA4 also raises DSGVO concerns for a German company, so prefer Plausible or self-hosted Matomo.

### [HIGH] `astro-compress@2.4.1` Astro-6 compatibility unverified
- Risk: Third-party integration; upstream may or may not have tested against Astro 6. Build passing is not the same as correctness — broken HTML minification can produce subtle SSR-vs-static differences.
- Impact: If it silently produces broken HTML (malformed attributes, collapsed boolean attributes that browsers re-parse wrong), pages render but lighthouse / a11y suffers.
- Migration plan: (a) Diff a non-minified build (`compress` removed) against the minified output; confirm no semantic changes. (b) If problems appear, replace with Astro's built-in HTML/CSS compression (Astro 6 has native `compressHTML: true`).

### [MEDIUM] Decap CMS loaded from `unpkg.com` without SRI
- Risk: `public/decapcms/index.html:12` loads `https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js` with no integrity hash. A supply-chain or unpkg compromise executes arbitrary JS in whoever-logs-into the admin UI, potentially a CMS editor with write access to the repo.
- Impact: Repo compromise.
- Migration plan: Either delete `public/decapcms/` (see Decap concern above) or pin to an exact version with SRI, or self-host the Decap bundle in `public/decapcms/vendor/`.

### [LOW] `astro@^6.1.8` is the project's primary version pin
- Risk: Astro major versions ship breaking changes yearly. `astro@^6.1.8` allows auto-upgrade to 6.x.y minors.
- Impact: Minor bump could break `vendor/integration/` or `@astrolib/*` peers.
- Migration plan: Consider pinning to an exact `6.1.8` (no `^`) until the vendor integration situation is resolved.

---

## Missing Critical Features

### [CRITICAL] i18n / DE+EN bilingual routing not configured
- Problem: Konvoi is a German company; DE+EN parity is a product requirement. Current setup is English-only:
  - `src/config.yaml:30-32` declares `i18n: { language: en, textDirection: ltr }` — this is informational only; no Astro i18n routing is configured.
  - `astro.config.ts` has no `i18n` block (Astro 5+ supports `i18n: { defaultLocale, locales, routing }` natively).
  - No language switcher component exists in `src/components/` — check `src/components/common/` and `src/components/ui/` shows only theme toggle.
  - `src/content.config.ts` schema has no `locale` field; posts are single-locale.
  - `src/navigation.ts` has one nav structure (English).
  - No `<html lang>` switching logic — `src/layouts/Layout.astro` hardcodes whatever the config says.
- Blocks: Shipping a bilingual Konvoi site.
- Fix approach: Add Astro i18n block to `astro.config.ts` (`defaultLocale: 'de'`, `locales: ['de','en']`, `routing: { prefixDefaultLocale: false }` so `/` = DE and `/en/` = EN). Duplicate `src/navigation.ts` per locale or refactor to `src/i18n/navigation.{de,en}.ts`. Add `locale` to `postCollection` schema. Add a `LanguageSwitcher.astro` component to `src/components/common/` and wire into `src/components/widgets/Header.astro`. Decide canonical strategy: EN pages should point `<link rel="canonical">` at EN URL, DE at DE URL, with `hreflang` pairs in `src/components/common/Metadata.astro`.

### [HIGH] No Konvoi Open Graph / social-share imagery
- Problem: `src/config.yaml:21` references `~/assets/images/default.png` as the default OG image. This is currently AstroWind's purple-space default. Social shares (LinkedIn, Slack previews, X) will render an AstroWind graphic for Konvoi links.
- Blocks: Brand-safe social sharing.
- Fix approach: Design 1200×628 Konvoi OG image(s), one per locale if desired. Replace `src/assets/images/default.png`. Consider per-page OG overrides for vertical landings (logistics, trailer-security).

### [HIGH] No analytics provider configured
- Problem: `src/config.yaml:66-69` has `analytics.vendors.googleAnalytics.id: null`. No Plausible, no Matomo, no Fathom wired.
- Blocks: Measuring traffic / campaign ROI at launch.
- Fix approach: For a German company, prefer Plausible (EU-hosted, cookieless, DSGVO-compliant by default) or self-hosted Matomo. GA4 requires consent banner + DPA complexity. Swap `@astrolib/analytics` for a Plausible snippet in `src/components/common/Analytics.astro`.

### [MEDIUM] No cookie consent / DSGVO banner
- Problem: No consent banner component exists in `src/components/`. If analytics are added without cookieless configuration, site violates DSGVO / TTDSG on first EU visitor.
- Blocks: Legal launch in Germany.
- Fix approach: Either (a) choose cookieless analytics (Plausible) and display a minimal privacy notice linking to `/datenschutz`, or (b) add a proper consent management platform (Cookiebot, Usercentrics, or a lightweight self-hosted widget).

### [MEDIUM] No careers / contact form submission backend
- Problem: `src/pages/contact.astro` renders a `<ContactUs>` form via `src/components/widgets/Contact.astro` but no form handler is wired — `output: 'static'` means no server endpoint. Submissions go nowhere.
- Blocks: Contact + careers flows at launch.
- Fix approach: Either (a) add a form service (Formspree, Web3Forms, Netlify Forms, Basin) and point the `<form action>` at it, or (b) switch `output` to `'hybrid'` and add a `src/pages/api/contact.ts` endpoint with rate-limiting + spam protection (hCaptcha/Turnstile) + email relay (Resend, Postmark).

---

## Test Coverage Gaps

### [HIGH] Zero tests of any kind
- What's not tested: Everything. No `*.test.*`, no `*.spec.*`, no `jest.config.*`, no `vitest.config.*`, no Playwright config, no `tests/` or `e2e/` directory.
- Files: N/A — nothing to list
- Risk: For a marketing site this is tolerable at rest, but during the AstroWind-to-Konvoi rewrite phase, silent regressions are likely: broken links, missing images, 404s on removed demo routes, sitemap leakage of AstroWind URLs.
- Priority: HIGH during the rewrite, MEDIUM thereafter.

### [HIGH] No broken-link / broken-image CI check
- What's not tested: Links inside MDX posts, `href="#"` placeholder detection, `<Image src="https://images.unsplash.com/...">` external references, anchor-link targets (`/#features` etc.), sitemap vs actual `dist/` cross-check.
- Files: Would apply across `src/pages/**`, `src/data/post/**`, `src/navigation.ts`
- Risk: Deploying with dead links is a brand/SEO harm. `src/navigation.ts:126-165` has ~22 footer links at `#` that will pass any build check silently.
- Priority: HIGH — cheap to add (`lychee`, `linkinator`, or `@11ty/eleventy-fetch`-based linkcheck in CI after build).

### [MEDIUM] No visual-regression / screenshot QA
- What's not tested: Layout shifts, dark/light mode rendering parity, responsive breakpoint correctness.
- Files: N/A
- Risk: Tailwind 4 beta-era bugs + Astro 6 rendering quirks can produce off-brand layouts that pass build but look wrong.
- Priority: MEDIUM. Playwright + `@percy/playwright` or Chromatic for a handful of canonical pages (home DE, home EN, contact, one landing, one blog post) is enough.

### [MEDIUM] No `astro check` enforcement in CI
- What's not tested: TypeScript errors in `.astro` files. `package.json:17` defines `check:astro` but there's no CI workflow file calling it (no `.github/workflows/` check visible in exploration).
- Files: `package.json`, `.github/workflows/*` (absent or minimal)
- Risk: TS errors in `.astro` components land unnoticed until a developer runs `pnpm check` locally.
- Priority: MEDIUM. Add a GitHub Actions workflow that runs `pnpm install --frozen-lockfile && pnpm check && pnpm build` on every PR.

---

*Concerns audit: 2026-04-20*
