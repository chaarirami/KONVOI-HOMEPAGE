# Requirements: konvoi-homepage

**Defined:** 2026-04-20
**Core Value:** Turn visitors into booked consult calls.

## v1 Requirements

### Foundation & cleanup

- [ ] **FND-01**: Delete all AstroWind demo scaffolding -- `src/pages/homes/*`, `src/pages/landing/*`, `src/data/post/*`, demo placeholders in `about.astro`, `contact.astro`, `pricing.astro`, `services.astro`
- [ ] **FND-02**: Remove AstroWind branding from `src/config.yaml` (site URL, Twitter handle, google verification id) and replace with Konvoi values
- [ ] **FND-03**: Remove `public/decapcms/` and drop Decap CMS scaffolding entirely
- [ ] **FND-04**: Remove `@astrolib/analytics`, `@astrojs/partytown`, `@fontsource-variable/inter` from `package.json`
- [ ] **FND-05**: Replace `LICENSE.md` with a Konvoi-owned private notice (no MIT)
- [ ] **FND-06**: Trim `astro.config.ts` `image.domains` -- remove `cdn.pixabay.com`, `images.unsplash.com`, `plus.unsplash.com`, `img.shields.io`; keep only hosts Konvoi actually uses
- [x] **FND-07
**: Replace `.github/workflows/actions.yaml` to use pnpm instead of `npm ci`
- [x] **FND-08
**: Post-build grep CI gate fails the build if `astrowind|arthelokyo|onwidget|Unsplash|Cupertino` appears anywhere in `dist/`
- [x] **FND-09
**: Netlify context-aware `<meta name="robots">` -- `noindex` on Deploy Preview and Branch Deploy URLs; production only indexes
- [x] **FND-10
**: Branch deploy policy -- only `main` triggers branch deploys; PR branches render as Deploy Previews

### Brand & design system

- [ ] **BRAND-01**: Apply existing Konvoi visual identity -- Montserrat (sans / heading) + PT Serif (serif) via `@fontsource/*` self-hosted packages; never `fonts.googleapis.com`
- [ ] **BRAND-02**: Port Konvoi brand colours into Tailwind v4 `@theme` tokens in `src/assets/styles/tailwind.css`
- [ ] **BRAND-03**: Replace favicon and logo assets with Konvoi artwork
- [ ] **BRAND-04**: Keep `@custom-variant dark (&:where(.dark, .dark *))` in `src/assets/styles/tailwind.css` pinned with a comment -- load-bearing invariant for dark mode
- [ ] **BRAND-05**: `src/data/brand/canonical.yaml` holds legal entity, address, phone, contact emails, and tier prices -- single source of truth
- [ ] **BRAND-06**: `src/data/brand/voice.md` codifies approved vs banned verbs for the preventive-vs-reactive positioning
- [x] **BRAND-07
**: Baseline Axe / Lighthouse accessibility audit passes with no critical findings (contrast, focus-visible, keyboard nav) on the design-system primitives

### i18n & content collections

- [ ] **I18N-01**: Astro native `i18n` config -- `defaultLocale: 'de'`, `locales: ['de', 'en']`, `prefixDefaultLocale: false`, no silent fallback
- [ ] **I18N-02**: File-tree layout -- DE pages at `src/pages/**` and EN pages at `src/pages/en/**`, no `[locale]/` dynamic tree
- [ ] **I18N-03**: `src/i18n/routeMap.ts` maps every DE / EN slug pair (e.g. `/anwendungen/ladungsdiebstahl/` / `/en/use-cases/cargo-theft/`)
- [ ] **I18N-04**: `LanguageSwitcher.astro` preserves current route via `routeMap` -- never auto-redirects
- [ ] **I18N-05**: 7 content collections registered in `src/content.config.ts` -- `post`, `caseStudy`, `useCase`, `industry`, `event`, `job`, `team`
- [ ] **I18N-06**: Long-form collections (`post`, `caseStudy`, `useCase`, `industry`, `job`) use `de/` + `en/` subdirectories with a `locale` Zod enum + `translationKey` + `canonicalKey` fields
- [ ] **I18N-07**: Short-form collections (`event`, `team`) use `{de, en}` sibling fields in a single file
- [ ] **I18N-08**: CI translation-parity check -- every long-form entry has both a DE and EN sibling with matching `translationKey`

### Homepage

- [x] **HOME-01**: DE + EN homepage at `/` and `/en/`
- [x] **HOME-02**: Hero with "Security Tech Made in Germany" positioning, preventive-vs-reactive tagline, primary "Beratung anfragen" / "Book a consult" CTA
- [x] **HOME-03**: Customer logo wall
- [x] **HOME-04**: 3-testimonial section (Schumacher, JJX, Greilmeier) sourced from `caseStudy` collection
- [x] **HOME-05**: Preventive-vs-reactive explainer section surfacing the Konvoi category framing
- [x] **HOME-06**: "Known from" press-mentions strip
- [x] **HOME-07**: "Supported by" partners / investors strip
- [x] **HOME-08**: End-of-page conversion block repeating the consult CTA

### Product page

- [x] **PROD-01**: DE + EN product page covering hardware spec, data services, alarm chain, installation process
- [x] **PROD-02**: Hardware system diagram / visual for the sensor positions on a trailer
- [x] **PROD-03**: Step-by-step "how it works" (Detection / Classification / Measures)
- [x] **PROD-04**: Add-on modules section -- KONVOI Camera Module, KONVOI Logbook
- [x] **PROD-05**: Installation section including the 120-minute install promise + video

### Use cases

- [x] **UC-01**: Individual DE + EN page per use case: `/anwendungen/ladungsdiebstahl/`, `/dieseldiebstahl/`, `/equipmentdiebstahl/`, `/transparenz-der-operationen/`, `/trailerschaeden/`, `/fahrerangriffe/`, `/standzeit-optimierung/` (EN: `/en/use-cases/cargo-theft/`, `/diesel-theft/`, `/equipment-theft/`, `/operations-transparency/`, `/trailer-damage/`, `/driver-assaults/`, `/stationary-time-optimization/`)
- [x] **UC-02**: Each page surfaces problem framing + cost anchor (e.g. 8B EUR/yr cargo theft) + Konvoi approach + CTA
- [x] **UC-03**: Shared `SensorDataViz` Preact island renders motion / shock / GPS traces per-use-case on every use-case page
- [x] **UC-04**: `SensorDataViz` reads scenario fixtures from `src/data/sensor-scenarios/*.json` with a documented schema
- [x] **UC-05**: Each use-case page cross-links to relevant industry landing pages

### Industry verticals

- [x] **VERT-01**: 4 DE + EN industry landings -- high-value, cooling, intermodal, other
- [x] **VERT-02**: Each vertical hero frames the vertical's unique risk profile
- [x] **VERT-03**: Each vertical cross-links into the 2-3 use cases most relevant to it
- [x] **VERT-04**: Each vertical ends with the consult CTA

### Case studies

- [ ] **CASE-01**: `/case-studies/` index page DE + EN listing every customer study
- [ ] **CASE-02**: Individual DE + EN detail page per customer (launch with Schumacher, JJX, Greilmeier)
- [ ] **CASE-03**: Case-study schema captures: customer, vertical, problem, Konvoi approach, outcome (measurable where possible), quote + attribution, logo
- [ ] **CASE-04**: Each case-study page ends with the consult CTA

### Pricing

- [x] **PRICE-01**: DE + EN pricing page at `/preise/` + `/en/pricing/`
- [x] **PRICE-02**: Three tiers -- Standard, + Camera Module, + Logbook -- with "ab X EUR / Monat" (starting-at) prices
- [x] **PRICE-03**: Tier data sourced from `src/data/pricing.ts` (shared with ROI calculator)
- [x] **PRICE-04**: Pricing page ends with the consult CTA

### ROI calculator

- [x] **ROI-01**: Interactive ROI / savings calculator as Preact island on `/roi/` + `/en/roi/`; embedded on `/preise/` + `/en/pricing/`
- [x] **ROI-02**: Inputs -- fleet size, primary vertical, average parking-stop frequency
- [x] **ROI-03**: Outputs -- estimated annual theft cost, estimated Konvoi savings, estimated de-minimis reimbursement, payback period
- [x] **ROI-04**: Formula assumptions live in `src/data/pricing.ts` alongside pricing (single source of truth)
- [x] **ROI-05**: ROI result pre-fills `ConsultForm` via URL query params when the user clicks "Book a consult"

### Funding eligibility

- [ ] **FUND-01**: DE + EN dedicated funding page at `/foerderung/` + `/en/funding/`
- [ ] **FUND-02**: Page explains the 80% German de-minimis subsidy for theft-prevention investments (cites the catalog 1.10 "Aufwendungen fuer Massnahmen zur Vermeidung von Diebstaehlen")
- [ ] **FUND-03**: `FundingQualifierForm` Preact island captures company size, fleet size, vertical, and contact -- posts to Formspree with DSGVO consent
- [ ] **FUND-04**: Funding page cross-links to the ROI calculator for a combined savings-plus-subsidy figure

### Team

- [ ] **TEAM-01**: DE + EN team page sourced from `team` content collection with `{de, en}` bio fields
- [ ] **TEAM-02**: 9-person starter roster (Alexander, Heinz, Rami, Trinh, Harsha, Jonas, Sushmita, Eric, Justus)
- [ ] **TEAM-03**: Each team entry has a photo, name, title, and short bio

### Careers

- [ ] **CAREER-01**: DE-only careers page at `/karriere/` for v1 (EN shell page redirects to DE content for v1); renders open roles from the `job` collection
- [ ] **CAREER-02**: Apply CTA opens `mailto:applications@konvoi.eu` with a prefilled subject per role
- [ ] **CAREER-03**: Careers page ships with the current 8 open roles from the live site (Founder's Associate, B2B Sales AE, Full-stack Eng Internship, IoT / Embedded Eng Internship, Embedded Systems Internship, Data Scientist Internship, Data Scientist FT, Initiative Application)

### Contact & events

- [ ] **CONT-01**: DE + EN contact page with two named contacts -- Justus Maenninghoff (customer advisor) and Heinz Luckhardt (investors / marketing / applicants) -- photos + direct phone + email
- [ ] **CONT-02**: Office address block with static-screenshot Google Maps placeholder -- click-to-load interactive iframe only after explicit consent
- [ ] **CONT-03**: Upcoming events list sourced from `event` content collection; past events auto-hide based on `endDate`
- [ ] **CONT-04**: Contact page ends with the consult CTA

### Blog

- [ ] **BLOG-01**: DE blog at `/aktuelles/` + EN blog at `/en/news/` ported from the current Jimdo blog
- [ ] **BLOG-02**: Per-locale RSS feed -- `/aktuelles/rss.xml` + `/en/news/rss.xml`
- [ ] **BLOG-03**: Per-locale blog index with pagination + tag pages
- [ ] **BLOG-04**: All existing Jimdo posts migrated to markdown in `src/content/post/` with frontmatter metadata preserved

### Forms

- [ ] **FORMS-01**: `ConsultForm` Preact island reusable anywhere on the site (homepage, pricing, use-case pages, etc.)
- [ ] **FORMS-02**: `FundingQualifierForm` Preact island on the funding page
- [ ] **FORMS-03**: Both forms validate client-side with Zod before POSTing to Formspree
- [ ] **FORMS-04**: Spam protection -- `_gotcha` honeypot field + Cloudflare Turnstile on both forms
- [ ] **FORMS-05**: Required, unchecked DSGVO consent checkbox on every form with a link to Datenschutz
- [ ] **FORMS-06**: Submission success routes to `/danke` (DE) or `/en/thanks/` (EN) with response-time SLA
- [ ] **FORMS-07**: Submission errors preserve all filled-in values and surface a clear inline error message

### SEO, analytics, consent, DSGVO

- [ ] **SEO-01**: `Metadata.astro` emits per-page `<link rel="canonical">` + three `<link rel="alternate" hreflang>` entries (de, en, x-default pointing to DE)
- [ ] **SEO-02**: `@astrojs/sitemap` configured with the `i18n` block so sitemap entries include `<xhtml:link>` locale alternates
- [ ] **SEO-03**: Per-locale Open Graph and Twitter card images for homepage + key landing pages
- [ ] **SEO-04**: Schema.org structured data -- `Organization`, `LocalBusiness`, `Product`, `FAQPage` where applicable
- [ ] **SEO-05**: Plausible Cloud EU analytics snippet embedded in `Layout.astro` (cookieless, no banner required)
- [ ] **SEO-06**: `vanilla-cookieconsent` v3 banner with DE + EN translations gating Google Maps and YouTube embeds (not Plausible)
- [ ] **SEO-07**: Impressum (`/impressum/` -- German slug on both locales) with legal entity per SS 5 TMG
- [ ] **SEO-08**: Datenschutz (`/datenschutz/` -- German slug on both locales) covering processing per DSGVO Art. 13 + TTDSG / TDDDG references
- [ ] **SEO-09**: CSP headers in `public/_headers` tuned to allow only whitelisted third parties (Plausible, Formspree, Turnstile, self-hosted fonts)

### Deploy & redirects

- [ ] **DEPLOY-01**: Netlify deployment configured with `netlify.toml` for build command, publish directory, and headers
- [ ] **DEPLOY-02**: `netlify.toml` / `_redirects` covers every old Jimdo URL to new Konvoi equivalent (301)
- [ ] **DEPLOY-03**: DNS cutover for `konvoi.eu` + `www.konvoi.eu` to Netlify
- [ ] **DEPLOY-04**: Post-launch Search Console International Targeting verified for DE + EN
- [ ] **DEPLOY-05**: `site:netlify.app konvoi` returns zero indexed pages after launch

## v2 Requirements

### Analytics & marketing

- **V2-AN-01**: HubSpot / Pipedrive CRM integration for lead sync
- **V2-AN-02**: LinkedIn Insight Tag + Meta Pixel if paid ads go active
- **V2-AN-03**: Full-text site search

### Content

- **V2-CT-01**: EN-language blog posts (v1 only ports existing German posts)
- **V2-CT-02**: Additional locales -- NL, FR, IT, PL if sales validates demand
- **V2-CT-03**: Video case studies
- **V2-CT-04**: Competitor comparison pages
- **V2-CT-05**: Webinar registration page

### Lead capture

- **V2-LC-01**: Newsletter subscription with DOI (double-opt-in) per BGH jurisprudence
- **V2-LC-02**: Gated whitepapers / resources library
- **V2-LC-03**: On-demand product demo flow
- **V2-LC-04**: Interactive product sandbox

### Trust

- **V2-TR-01**: Live trust-center dashboard (uptime, compliance cert states)
- **V2-TR-02**: Press / media kit page

## Out of Scope

| Feature | Reason |
|---------|--------|
| Self-serve signup / trial flow | Konvoi sells direct; no self-service motion fits their GTM |
| Customer portal / authenticated area | Marketing site only; belongs in a separate product app |
| Custom form backend / bespoke serverless API | Formspree-class service is sufficient for the lead volume |
| Decap CMS / any headless CMS | Markdown-in-repo + PR is the chosen authoring workflow |
| Keeping AstroWind demo scaffolding | 0% of demos will ship; leaving them invites drift |
| Keeping AstroWind MIT licence | Site is a private corporate asset, not an OSS template |
| Building the trailer-security product itself | Separate codebase; this repo is marketing only |
| 1:1 IA parity with current site | The redesign deliberately restructures navigation |
| Chatbot / live chat widget | 9-person team can't staff it; trust cost > conversion gain |
| Language auto-redirect | Always an explicit toggle -- locale URLs must be respected |
| Exit-intent popups | Anti-feature for B2B; hurts trust more than converts |
| Google Fonts CDN | Munich 2022 ruling; competitor Abmahnung risk |
| Naive pre-consent Google Maps iframe | DSGVO violation -- click-to-load only |
| Multiple island frameworks (React + Svelte + Solid mix) | Preact only -- one runtime, smaller bundle |
| Tests beyond `pnpm check` + grep + link-check | Marketing site; unit tests not worth the maintenance cost at v1 |

## Traceability

Every v1 requirement is mapped to exactly one phase. See `.planning/ROADMAP.md` for phase details.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FND-01 | Phase 1 | Pending |
| FND-02 | Phase 1 | Pending |
| FND-03 | Phase 1 | Pending |
| FND-04 | Phase 1 | Pending |
| FND-05 | Phase 1 | Pending |
| FND-06 | Phase 1 | Pending |
| FND-07 | Phase 1 | Pending |
| FND-08 | Phase 1 | Pending |
| FND-09 | Phase 1 | Pending |
| FND-10 | Phase 1 | Pending |
| BRAND-01 | Phase 2 | Pending |
| BRAND-02 | Phase 2 | Pending |
| BRAND-03 | Phase 2 | Pending |
| BRAND-04 | Phase 2 | Pending |
| BRAND-05 | Phase 2 | Pending |
| BRAND-06 | Phase 2 | Pending |
| BRAND-07 | Phase 2 | Pending |
| I18N-01 | Phase 3 | Pending |
| I18N-02 | Phase 3 | Pending |
| I18N-03 | Phase 3 | Pending |
| I18N-04 | Phase 3 | Pending |
| I18N-05 | Phase 3 | Pending |
| I18N-06 | Phase 3 | Pending |
| I18N-07 | Phase 3 | Pending |
| I18N-08 | Phase 3 | Pending |
| HOME-01 | Phase 4 | Complete |
| HOME-02 | Phase 4 | Complete |
| HOME-03 | Phase 4 | Complete |
| HOME-04 | Phase 4 | Complete |
| HOME-05 | Phase 4 | Complete |
| HOME-06 | Phase 4 | Complete |
| HOME-07 | Phase 4 | Complete |
| HOME-08 | Phase 4 | Complete |
| PROD-01 | Phase 4 | Complete |
| PROD-02 | Phase 4 | Complete |
| PROD-03 | Phase 4 | Complete |
| PROD-04 | Phase 4 | Complete |
| PROD-05 | Phase 4 | Complete |
| UC-01 | Phase 4 | Complete |
| UC-02 | Phase 4 | Complete |
| UC-03 | Phase 4 | Complete |
| UC-04 | Phase 4 | Complete |
| UC-05 | Phase 4 | Complete |
| VERT-01 | Phase 4 | Complete |
| VERT-02 | Phase 4 | Complete |
| VERT-03 | Phase 4 | Complete |
| VERT-04 | Phase 4 | Complete |
| CASE-01 | Phase 6 | Pending |
| CASE-02 | Phase 6 | Pending |
| CASE-03 | Phase 6 | Pending |
| CASE-04 | Phase 6 | Pending |
| PRICE-01 | Phase 5 | Complete |
| PRICE-02 | Phase 5 | Complete |
| PRICE-03 | Phase 5 | Complete |
| PRICE-04 | Phase 5 | Complete |
| ROI-01 | Phase 5 | Complete |
| ROI-02 | Phase 5 | Complete |
| ROI-03 | Phase 5 | Complete |
| ROI-04 | Phase 5 | Complete |
| ROI-05 | Phase 5 | Complete |
| FUND-01 | Phase 5 | Pending |
| FUND-02 | Phase 5 | Pending |
| FUND-03 | Phase 5 | Pending |
| FUND-04 | Phase 5 | Pending |
| TEAM-01 | Phase 6 | Pending |
| TEAM-02 | Phase 6 | Pending |
| TEAM-03 | Phase 6 | Pending |
| CAREER-01 | Phase 6 | Pending |
| CAREER-02 | Phase 6 | Pending |
| CAREER-03 | Phase 6 | Pending |
| CONT-01 | Phase 6 | Pending |
| CONT-02 | Phase 6 | Pending |
| CONT-03 | Phase 6 | Pending |
| CONT-04 | Phase 6 | Pending |
| BLOG-01 | Phase 6 | Pending |
| BLOG-02 | Phase 6 | Pending |
| BLOG-03 | Phase 6 | Pending |
| BLOG-04 | Phase 6 | Pending |
| FORMS-01 | Phase 5 | Pending |
| FORMS-02 | Phase 5 | Pending |
| FORMS-03 | Phase 5 | Pending |
| FORMS-04 | Phase 5 | Pending |
| FORMS-05 | Phase 5 | Pending |
| FORMS-06 | Phase 5 | Pending |
| FORMS-07 | Phase 5 | Pending |
| SEO-01 | Phase 7 | Pending |
| SEO-02 | Phase 7 | Pending |
| SEO-03 | Phase 7 | Pending |
| SEO-04 | Phase 7 | Pending |
| SEO-05 | Phase 7 | Pending |
| SEO-06 | Phase 7 | Pending |
| SEO-07 | Phase 7 | Pending |
| SEO-08 | Phase 7 | Pending |
| SEO-09 | Phase 7 | Pending |
| DEPLOY-01 | Phase 7 | Pending |
| DEPLOY-02 | Phase 7 | Pending |
| DEPLOY-03 | Phase 7 | Pending |
| DEPLOY-04 | Phase 7 | Pending |
| DEPLOY-05 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 99 total
- Mapped to phases: 99
- Unmapped: 0

**Per-phase counts:**
- Phase 1 (Foundation Scrub): 10 requirements (FND-01..10)
- Phase 2 (Brand & Design System): 7 requirements (BRAND-01..07)
- Phase 3 (i18n & Content Collections): 8 requirements (I18N-01..08)
- Phase 4 (Core Marketing Pages): 22 requirements (HOME-01..08, PROD-01..05, UC-01..05, VERT-01..04)
- Phase 5 (Conversion Funnel): 20 requirements (PRICE-01..04, ROI-01..05, FUND-01..04, FORMS-01..07)
- Phase 6 (Depth & Credibility Pages): 18 requirements (CASE-01..04, BLOG-01..04, TEAM-01..03, CAREER-01..03, CONT-01..04)
- Phase 7 (SEO, Consent & Launch): 14 requirements (SEO-01..09, DEPLOY-01..05)

Total: 10 + 7 + 8 + 22 + 20 + 18 + 14 = **99**

---
*Requirements defined: 2026-04-20*
*Last updated: 2026-04-22 after roadmap creation (Phase 1-7 traceability populated)*
