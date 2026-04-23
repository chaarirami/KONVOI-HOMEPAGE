# Roadmap: konvoi-homepage

## Overview

Transform the AstroWind-forked repo into a bilingual (DE/EN) Konvoi corporate marketing site that turns visitors into booked consult calls. The build moves through 7 phases: debris removal, brand identity, i18n infrastructure, core marketing pages with the shared sensor-data visualization, the conversion funnel (pricing/ROI/funding/forms), depth and credibility content (case studies/blog/team/careers/contact), and finally SEO/consent/legal/launch gates culminating in DNS cutover from Jimdo to Netlify.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation Scrub** - Remove all AstroWind debris, replace licence, add CI gates, lock Netlify deploy policy
- [x] **Phase 2: Brand & Design System** - Apply Konvoi visual identity, brand tokens, self-hosted typography, accessibility baseline
- [ ] **Phase 3: i18n & Content Collections** - Wire Astro native i18n routing, register 7 content collections, build language switcher, CI parity check
- [ ] **Phase 4: Core Marketing Pages** - Homepage, product page, 7 use-case pages with shared SensorDataViz island, 4 industry verticals -- all DE + EN
- [ ] **Phase 5: Conversion Funnel** - Pricing tiers, ROI calculator, funding eligibility, lead-capture forms with DSGVO compliance
- [ ] **Phase 6: Depth & Credibility Pages** - Case studies, blog port, team, careers, contact with events and click-to-load Maps
- [ ] **Phase 7: SEO, Consent & Launch** - Sitemap hreflang, Plausible analytics, cookie consent, Impressum/Datenschutz, CSP, Jimdo redirects, DNS cutover

## Phase Details

### Phase 1: Foundation Scrub
**Goal**: Every trace of AstroWind template debris is gone from source and build output, and CI enforces it permanently -- earning the right to deploy anything as Konvoi
**Depends on**: Nothing (hard blocker for every other phase)
**Requirements**: FND-01, FND-02, FND-03, FND-04, FND-05, FND-06, FND-07, FND-08, FND-09, FND-10
**Success Criteria** (what must be TRUE):
  1. `pnpm build` succeeds and the post-build grep CI gate confirms zero matches for `astrowind|arthelokyo|onwidget|Unsplash|Cupertino` in `dist/`; this gate runs on every PR forever
  2. No demo pages (`src/pages/homes/*`, `src/pages/landing/*`), no AstroWind blog posts (`src/data/post/*`), no `public/decapcms/` directory, and no MIT `LICENSE.md` exist in the repository
  3. `src/config.yaml` reflects Konvoi identity and `astro.config.ts` `image.domains` contains only hosts Konvoi actually uses -- AstroWind site URL, Twitter handle, Google verification token, `@astrolib/analytics`, `@astrojs/partytown`, `@fontsource-variable/inter`, and Unsplash/Pixabay/Shields hosts are all removed
  4. Every Netlify Deploy Preview and Branch Deploy URL renders with `<meta name="robots" content="noindex, nofollow">`; only the `main` branch triggers branch deploys
  5. GitHub Actions workflow uses `pnpm` (not `npm ci`) and the build completes green
**Plans:** 3 plans
Plans:
- [x] 01-01-PLAN.md -- Delete all AstroWind demo pages, blog posts, DecapCMS, Announcement.astro, replace LICENSE.md
- [x] 01-02-PLAN.md -- Rewrite config.yaml/navigation.ts to Konvoi identity, clean astro.config.ts, remove unused packages
- [x] 01-03-PLAN.md -- Rewrite GitHub Actions CI for pnpm + grep gate, add noindex meta, update netlify.toml

### Phase 2: Brand & Design System
**Goal**: Konvoi brand identity (typography, colour, logo, favicons) is applied site-wide via reusable design tokens, with dark mode stable and accessibility baseline passing
**Depends on**: Phase 1
**Requirements**: BRAND-01, BRAND-02, BRAND-03, BRAND-04, BRAND-05, BRAND-06, BRAND-07
**Success Criteria** (what must be TRUE):
  1. Every page renders Montserrat (headings) and PT Serif (body) self-hosted via `@fontsource/*` packages; no request to `fonts.googleapis.com` appears in the network tab
  2. Konvoi colour palette lives in Tailwind v4 `@theme` tokens in `src/assets/styles/tailwind.css`, and the `@custom-variant dark (&:where(.dark, .dark *))` line is pinned with a comment block; toggling light/dark/system modes produces correct theming with no flicker
  3. Favicon and logo assets display the Konvoi mark on every page -- no AstroWind iconography remains
  4. `src/data/brand/canonical.yaml` (legal entity, address, phone, emails, tier prices) and `src/data/brand/voice.md` (approved vs banned verbs for preventive positioning) exist as single sources of truth
  5. Axe/Lighthouse accessibility audit on baseline page scaffolds returns zero critical findings for contrast, focus-visible, and keyboard navigation
**Plans:** 4 plans
Plans:
- [x] 02-01-PLAN.md -- Install @fontsource packages, wire font imports, apply Konvoi HSL colour palette to CustomStyles.astro (BRAND-01, BRAND-02, BRAND-04)
- [x] 02-02-PLAN.md -- Extract Konvoi favicon and logo assets from live site, sanitize SVGs, update Logo.astro (BRAND-03)
- [x] 02-03-PLAN.md -- Create src/data/brand/canonical.yaml and voice.md brand data files (BRAND-05, BRAND-06)
- [x] 02-04-PLAN.md -- Lighthouse + Axe accessibility audit, fix any critical findings, declare Phase 2 complete (BRAND-07)
**UI hint**: yes

### Phase 3: i18n & Content Collections
**Goal**: Astro native i18n is wired end-to-end (DE default at `/`, EN at `/en/`), all 7 content collections are registered with locale-aware schemas, and CI catches translation drift before it ships
**Depends on**: Phase 2
**Requirements**: I18N-01, I18N-02, I18N-03, I18N-04, I18N-05, I18N-06, I18N-07, I18N-08
**Success Criteria** (what must be TRUE):
  1. DE content serves at `/` and EN at `/en/` via Astro native `i18n` config (`defaultLocale: 'de'`, `prefixDefaultLocale: false`); no `[locale]/` dynamic segments exist; missing EN pages return 404 (no silent fallback to DE)
  2. `LanguageSwitcher.astro` in the header preserves the current route via `routeMap.ts` -- clicking DE/EN on any page navigates to its translated equivalent without auto-redirecting
  3. All 7 content collections (`post`, `caseStudy`, `useCase`, `industry`, `event`, `job`, `team`) are registered in `src/content.config.ts` with long-form collections using `de/` + `en/` subdirectories + `locale` Zod enum + `translationKey` + `canonicalKey`, and short-form collections (`event`, `team`) using `{de, en}` sibling fields
  4. CI translation-parity check fails the build when a long-form entry has a DE sibling without an EN sibling (or vice versa) sharing the same `translationKey`
**Plans:** 4 plans
Plans:
- [x] 03-01-PLAN.md -- Add i18n config to astro.config.ts, create routeMap.ts and translations.ts (I18N-01, I18N-02, I18N-03)
- [x] 03-02-PLAN.md -- Expand content.config.ts to 7 collections, scaffold src/content/ directory tree (I18N-05, I18N-06, I18N-07)
- [x] 03-03-PLAN.md -- Create translation parity check script, add tsx, wire into pnpm build (I18N-08)
- [x] 03-04-PLAN.md -- Wire Layout.astro lang attribute and LanguageSwitcher.astro with routeMap (I18N-01, I18N-04)

### Phase 4: Core Marketing Pages
**Goal**: A visitor landing on the homepage can navigate through the product story, any of 7 theft-type use cases with interactive sensor-data visualization, or any of 4 industry verticals -- all in DE and EN with consistent Konvoi narrative
**Depends on**: Phase 3
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, HOME-08, PROD-01, PROD-02, PROD-03, PROD-04, PROD-05, UC-01, UC-02, UC-03, UC-04, UC-05, VERT-01, VERT-02, VERT-03, VERT-04
**Success Criteria** (what must be TRUE):
  1. DE + EN homepages render the full trust/conversion stack: hero with "Security Tech Made in Germany" + preventive-vs-reactive tagline + primary CTA, customer logo wall, 3 testimonials (Schumacher, JJX, Greilmeier), preventive-vs-reactive explainer, press-mentions strip, partners/investors strip, and end-of-page consult CTA
  2. DE + EN product pages cover hardware spec, sensor-positions-on-trailer visual, Detection-Classification-Measures flow, Camera Module + Logbook add-ons, and the 120-minute install promise
  3. All 7 use-case pages exist in both locales at locked slugs (DE `/anwendungen/...`, EN `/en/use-cases/...`), each with problem framing + cost anchor + Konvoi approach + CTA, and each embedding the shared `SensorDataViz` Preact island reading per-scenario fixtures from `src/data/sensor-scenarios/*.json`
  4. 4 DE + EN industry landings (high-value, cooling, intermodal, other) each frame the vertical's unique risk profile, cross-link into 2-3 relevant use cases, and end with the consult CTA
  5. All cross-links work: use-case pages link to relevant verticals and vice versa; homepage teasers link through to use cases and case studies
**Plans:** 7 plans
Plans:
- [x] 04-01-PLAN.md -- Install Preact + uPlot, wire Preact integration, populate navigation.ts, add Phase 4 UI strings to translations.ts (HOME-01, HOME-08, UC-01, VERT-01)
- [x] 04-02-PLAN.md -- Build DE + EN homepages with 8-section D-03 order, extend Hero.astro for video background (HOME-01 through HOME-08)
- [x] 04-03-PLAN.md -- Build DE + EN product pages with hardware spec, steps flow, add-ons, install promise (PROD-01 through PROD-05)
- [x] 04-04-PLAN.md -- Build SensorDataViz Preact island with uPlot, create 7 sensor scenario fixture JSON files (UC-03, UC-04)
- [x] 04-05-PLAN.md -- Write 14 use-case markdown entries + dynamic page templates with SensorDataViz island (UC-01 through UC-05)
- [x] 04-06-PLAN.md -- Write 8 industry vertical markdown entries + dynamic page templates with use-case cross-links (VERT-01 through VERT-04)
- [x] 04-07-PLAN.md -- Build cross-link validation script, wire into pnpm build, run full phase gate + human verification (all Phase 4 requirements)
**UI hint**: yes

### Phase 5: Conversion Funnel
**Goal**: A visitor can understand pricing, calculate their fleet's ROI including the 80% de-minimis subsidy, and submit a consult request or funding pre-qualification -- with a live lead landing in Formspree end-to-end
**Depends on**: Phase 4
**Requirements**: PRICE-01, PRICE-02, PRICE-03, PRICE-04, ROI-01, ROI-02, ROI-03, ROI-04, ROI-05, FUND-01, FUND-02, FUND-03, FUND-04, FORMS-01, FORMS-02, FORMS-03, FORMS-04, FORMS-05, FORMS-06, FORMS-07
**Success Criteria** (what must be TRUE):
  1. DE `/preise/` + EN `/en/pricing/` display three tiers (Standard, + Camera Module, + Logbook) with "ab X EUR / Monat" prices sourced from `src/data/pricing.ts`, ending with the consult CTA
  2. The `RoiCalculator` Preact island on `/roi/` + `/en/roi/` (and embedded on pricing pages) accepts fleet size + vertical + parking frequency and outputs estimated annual theft cost, Konvoi savings, de-minimis reimbursement, and payback period
  3. Clicking "Book a consult" from the ROI result pre-fills `ConsultForm` via URL query params (fleet size, vertical, estimated savings) -- the cross-component contract works end-to-end in both locales
  4. DE `/foerderung/` + EN `/en/funding/` explain the 80% de-minimis subsidy with `FundingQualifierForm` capturing company details via Formspree with DSGVO consent, and cross-link to the ROI calculator
  5. Both forms validate client-side with Zod, include `_gotcha` honeypot + Cloudflare Turnstile, require an unchecked DSGVO consent checkbox linking to `/datenschutz`, redirect to `/danke` or `/en/thanks/` on success, and preserve all field values with clear inline error on failure. **Gate: at least one lead captured end-to-end through Formspree.**
**Plans**: TBD
**UI hint**: yes

### Phase 6: Depth & Credibility Pages
**Goal**: A visitor can validate Konvoi's legitimacy -- read customer outcomes, scan the team's faces, find two named humans with direct phones, browse the blog, see upcoming events, and check open roles -- completing the trust layer that supports the conversion decision
**Depends on**: Phase 5
**Requirements**: CASE-01, CASE-02, CASE-03, CASE-04, BLOG-01, BLOG-02, BLOG-03, BLOG-04, TEAM-01, TEAM-02, TEAM-03, CAREER-01, CAREER-02, CAREER-03, CONT-01, CONT-02, CONT-03, CONT-04
**Success Criteria** (what must be TRUE):
  1. Case-studies index + individual DE + EN detail pages for Schumacher, JJX, and Greilmeier display customer/vertical/problem/approach/outcome/quote/logo per the `caseStudy` schema, each ending with the consult CTA
  2. Blog at `/aktuelles/` (DE) and `/en/news/` (EN) renders migrated Jimdo posts with pagination, tag pages, and per-locale RSS feeds at `/aktuelles/rss.xml` + `/en/news/rss.xml`
  3. Team page displays all 9 members (Alexander, Heinz, Rami, Trinh, Harsha, Jonas, Sushmita, Eric, Justus) from the `team` collection with photos, names, titles, and bios in both locales
  4. Careers page at `/karriere/` lists 8 open roles; "Apply" opens `mailto:applications@konvoi.eu` with prefilled per-role subject; EN shell redirects to DE for v1
  5. Contact page shows Justus (customer advisor) and Heinz (investors/marketing) with photos + direct phone + email, office address with click-to-load Google Maps (no iframe before consent), upcoming events from `event` collection with past events auto-hidden by `endDate`, and consult CTA
**Plans**: TBD
**UI hint**: yes

### Phase 7: SEO, Consent & Launch
**Goal**: The site is legally shippable in the German market, search engines correctly index the bilingual structure, and DNS cutover from Jimdo to Netlify preserves every old URL's link equity
**Depends on**: Phase 6 (every content page must exist before sitemap/consent/redirect work)
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, SEO-09, DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04, DEPLOY-05
**Success Criteria** (what must be TRUE):
  1. Every page emits per-page `<link rel="canonical">` + three `<link rel="alternate" hreflang>` entries (de, en, x-default pointing to DE); `@astrojs/sitemap` emits `<xhtml:link>` locale alternates in `dist/sitemap-*.xml`
  2. Plausible Cloud EU analytics loads on every page without a consent banner (cookieless); `vanilla-cookieconsent` v3 with DE + EN translations gates only Google Maps and YouTube embeds -- not Plausible, not self-hosted fonts, not Formspree
  3. Per-locale Open Graph + Twitter card images render correctly for homepage + key landing pages; Schema.org structured data (`Organization`, `LocalBusiness`, `Product`, `FAQPage`) validates via Rich Results Test
  4. `/impressum/` (German slug on both locales) discloses legal entity per SS 5 TMG; `/datenschutz/` covers processing per DSGVO Art. 13 + TTDSG/TDDDG; `public/_headers` ships CSP allowing only Plausible, Formspree, Turnstile, and self-hosted fonts
  5. `netlify.toml` / `_redirects` covers every old Jimdo URL with a 301 to its Konvoi equivalent; DNS for `konvoi.eu` + `www.konvoi.eu` is cut over to Netlify; Search Console International Targeting is verified for DE + EN; `site:netlify.app konvoi` returns zero indexed pages
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation Scrub | 3/3 | Complete | 2026-04-22 |
| 2. Brand & Design System | 4/4 | Complete | 2026-04-22 |
| 3. i18n & Content Collections | 0/? | Not started | - |
| 4. Core Marketing Pages | 0/7 | Planned | - |
| 5. Conversion Funnel | 0/? | Not started | - |
| 6. Depth & Credibility Pages | 0/? | Not started | - |
| 7. SEO, Consent & Launch | 0/? | Not started | - |
