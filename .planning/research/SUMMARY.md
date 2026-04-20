# Project Research Summary

**Project:** konvoi-homepage (konvoi.eu rebuild)
**Domain:** Bilingual (DE/EN) B2B corporate marketing site for a German security-tech company — direct-sales motion, DSGVO-regulated, Astro 6 static + Netlify
**Researched:** 2026-04-20
**Confidence:** HIGH

## Executive Summary

Konvoi is a 9-person Hamburg B2B security-tech company selling preventive trailer-security hardware + AI to transport/logistics operators. The rebuild replaces a Jimdo marketing site with an Astro 6 + Tailwind 4 fork of AstroWind that today ships ~0% Konvoi content. Every page decision must serve one conversion goal — a booked consult call — in two locales (DE primary at `/`, EN at `/en/`), under German DSGVO/UWG enforcement that since March 2025 allows competitor Abmahnungen without proof of harm.

The research picture is unusually consistent across the four documents: the tech choices are small, opinionated, and closed; the table-stakes feature set is large but well-understood; the architecture is a standard Astro static + islands layering; and the risk surface is almost entirely about German legal posture, content discipline, and avoiding AstroWind debris leaking into production.

The recommended build is **native Astro 6 i18n (DE default, `/en/` overlay) + markdown-in-repo content collections + Preact islands for the four genuinely interactive surfaces (ROI calculator, consult form, funding pre-qual form, shared sensor-data viz) + Formspree for lead capture + Plausible EU + vanilla-cookieconsent + Motion One**. No CMS, no custom backend, no chatbot, no auto-redirect, no Google Fonts CDN, no Google Maps iframe pre-consent. The content model is one collection per type (`post`, `caseStudy`, `useCase`, `industry`, `event`, `job`, `team`) with a `locale` discriminator for long-form and `{de, en}` sibling fields for short-form metadata.

The three biggest risks are interrelated: (1) AstroWind template debris leaking into production — hardcoded canonicals, `@arthelokyo` Twitter handles, the `astrowind.vercel.app` site URL, Unsplash/pixabay/shields.io image whitelists, Decap CMS admin surface, MIT licence — all catalogued in CONCERNS.md and requiring an explicit Phase 0 cleanup with a post-build grep CI gate; (2) DSGVO/UWG exposure from naïve embeds (Google Fonts CDN, Google Maps iframe, YouTube without `-nocookie`, analytics pre-consent) that invites a Munich-style ruling or competitor warning; (3) content drift between DE and EN after launch because markdown + PR provides no CMS-level parity enforcement. All three are cheap to prevent at the phase boundaries where they belong, and expensive to recover from post-launch.

## Key Findings

### Recommended Stack

Already locked: Astro `^6.1.8`, Tailwind CSS `^4.2.2`, TypeScript `^6.0.3`, pnpm 10, Node 22/24, static output, Netlify hosting. The research layer adds the smallest possible set of additions.

**Core technologies (new additions):**

- **Astro native `i18n`** (built into 6.1.8) — DE default + `/en/` prefix; `astro-i18next` is archived, `paraglide-astro` is overkill for 2 locales.
- **Plausible Cloud EU** — hosted in Falkenstein/Germany on Hetzner, cookieless, no banner required, ~1 KB. Replaces the installed `@astrolib/analytics` GA wiring (removed in Phase 0).
- **vanilla-cookieconsent v3** (`^3.1.0`) — free/MIT, DSGVO + TDDDG-compliant, DE/EN translations, zero third-party calls; gates Maps / YouTube / LinkedIn pixels, not Plausible.
- **Formspree** via `@formspree/react` in a Preact island + **Zod** client-side validation — consult form + funding pre-qual form. Honeypot + Cloudflare Turnstile for spam. Netlify Forms is a documented fallback only.
- **Preact island** (`@astrojs/preact@^5.1.1` + `preact@^10.x`) — used for exactly four components: `ConsultForm`, `FundingQualifierForm`, `RoiCalculator`, `SensorDataViz`. React-compat ecosystem, ~10 KB transferred vs ~40 KB for React.
- **Motion One** (`motion@^12.x`) — scroll / reveal animations; Tailwind v4 `@theme` `@keyframes` for trivial cases. Not AOS (SSR hydration bugs), not GSAP (overkill + plugin licensing).
- **`@fontsource/montserrat` + `@fontsource/pt-serif`** — self-hosted brand fonts; never `fonts.googleapis.com` (Munich ruling).
- **sharp + unpic + Netlify Image CDN** — kept as-is; no Cloudinary / ImageKit.

**Removed in Phase 0:** `@astrolib/analytics`, `@astrojs/partytown`, `@fontsource-variable/inter`.

### Expected Features

**Must-have (table stakes) — v1, non-negotiable**

*Conversion:* single "Beratung anfragen" / "Book a consult" CTA on every page (sticky header + end-of-page), 3–5 field lead form, form-adjacent logo + testimonial, thank-you / confirmation state with response-time SLA, two-contact split on Contact page (Justus for customers, Heinz for investors / applicants), click-to-load Maps, Impressum, Datenschutz, scoped DSGVO cookie banner.

*Content:* homepage (hero → logo wall → preventive-vs-reactive → 3 testimonials → press → partners → final CTA), product page (hardware + data-service + alarm chain + install), 7 use-case pages sharing sensor-data viz, 4 industry verticals (high-value, cooling, intermodal, other), case-studies index + per-customer details (Schumacher, JJX, Greilmeier), pricing page (Standard / + Camera / + Logbook with "starting at" prices), 80% de-minimis funding eligibility page + pre-qual form, blog ported from Jimdo at `/aktuelles` (DE) + `/en/news` (EN).

*Company:* team page (9-person roster + photos + bios), DE-only careers page (markdown + mailto), events calendar (auto-hide past).

*Technical:* DE + EN parity, explicit switcher (never auto-redirect), flattened nav, responsive mobile, SEO hygiene with hreflang + sitemap xhtml:link alternates + per-locale OG, Plausible EU analytics, trust / compliance page honest about cert state.

**Should-have (differentiators) — v1 where feasible**

Shared motion / shock / GPS sensor-data viz (single strongest proof point); ROI / savings calculator (fleet size + vertical + parking freq → annual theft savings + de-minimis reimbursement); preventive-vs-reactive as a recurring section, not just a tagline; "Security Tech Made in Germany" proof points (Hamburg map, German-speaking support SLA, TUHH spin-off, 1750 Ventures); published pricing; distinct DE / EN keyword-targeted slugs; Schema.org structured data.

**Defer to v2+:** video case studies; on-demand demo; interactive product sandbox; case-study filter (only useful at ≥ 6 studies); ungated one-pagers; competitor comparison pages; standalone FAQ page; press / media kit; LinkedIn Insight Tag (only if ads go active); additional locales (NL / FR / IT / PL); webinar registration; live trust-center dashboard.

**Never build:** self-serve signup, customer portal, Decap CMS admin, chatbot, live chat, language auto-redirect, exit-intent popups, generic gated whitepapers, social-media wall, full-text search, autoplay-with-sound hero video, AI "Hello $visitor_company" personalisation, heavy CMP (Cookiebot / Usercentrics).

### Architecture Approach

Layered SSG: Astro 6 static output, file-based routing with `src/pages/en/` overlay (NOT a `[locale]/` dynamic tree), content collections bucketed by locale subdirectory, widgets composed by pages, four Preact islands for interactivity. No runtime server; all client paths terminate at Formspree or local JSON fixtures.

**Major components:**

1. **`src/i18n/`** — `useTranslations(locale)`, `getLocalizedPath`, `alternateLinks`, `routeMap.ts` with explicit DE ↔ EN slug pairs (`/anwendungen/` ↔ `/en/use-cases/`, `/branchen/` ↔ `/en/industries/`, `/preise/` ↔ `/en/pricing/`; `/impressum/` + `/datenschutz/` German slug on both locales).
2. **Content collections** — 7 collections: `post`, `caseStudy`, `useCase`, `industry`, `event`, `job`, `team`. Long-form uses `de/` + `en/` subdirectories with a `locale` Zod enum; short-form uses `{de, en}` sibling fields in one file. `useCase` and `industry` carry a `canonicalKey` enum for cross-locale twin tracking.
3. **Widgets** — keep AstroWind generics (Hero, Features, Pricing, Testimonials, Brands, CTA, Content); add `widgets/konvoi/`: `PreventiveVsReactive`, `FundingEligibility`, `UseCaseGrid`, `IndustryHero`, `CaseStudyTeaser`, `PressStrip`, `TeamGrid`, `EventsList`, `ConsultCtaBanner`.
4. **Islands (`src/components/islands/*.tsx`)** — exactly four Preact components: `RoiCalculator` (`client:visible`, reads `src/data/pricing.ts`), `ConsultForm`, `FundingQualifierForm`, `SensorDataViz` (shared across 7 use-case pages, reads `src/data/sensor-scenarios/*.json`).
5. **Layouts** — `Layout.astro` owns HTML shell + hreflang alternates + context-aware robots meta (noindex on Netlify preview / branch deploys); `PageLayout.astro` picks per-locale Header / Footer / Announcement from `navigation/{de,en}.ts`.
6. **Single sources of truth** — `src/data/pricing.ts` (plain TS) feeds both pricing page and ROI calc; `src/data/brand/canonical.yaml` holds legal entity, phone, address, contacts, tier prices.

### Critical Pitfalls

**Phase 0:** (1) **AstroWind debris** — hardcoded canonicals in 4 demo posts, `astrowind.vercel.app` in `site.site`, `@arthelokyo` Twitter handle, `googleSiteVerificationId`, MIT licence, Decap admin at `/decapcms/`, Unsplash / pixabay / shields.io in `image.domains`. Prevention: delete everything CONCERNS.md `[CRITICAL]` / `[HIGH]` lists, add permanent post-build grep CI gate (`grep -rE "astrowind|arthelokyo|onwidget|Unsplash|Cupertino" dist/`). (2) **Netlify preview / branch deploys indexed by Google** — `X-Robots-Tag: noindex` is auto-added for Deploy Previews but NOT for recent Branch Deploys. Prevention: context-aware robots meta, `DEPLOY_PRIME_URL` / `URL`-derived `site.site`, restrict branch deploys to `main` only.

**Phase 2 (design system):** (3) **Tailwind v4 dark-mode variant silently breaks** — `@custom-variant dark (&:where(.dark, .dark *));` in `src/assets/styles/tailwind.css:5-6` is load-bearing; simplifying to `&:is(.dark *)` or deleting it inverts every `dark:*` utility site-wide. Prevention: pin a comment block linking PR #646, add to `CONVENTIONS.md`, visual smoke test. (4) **Google Fonts CDN** — Munich 2022 ruling; competitor Abmahnungen post-March-2025 need no proof of harm. Prevention: self-host via `@fontsource/*`; grep check for `fonts.googleapis.com`.

**Phase 3 (i18n):** (5) **Default-locale canonical / hreflang missing** — `prefixDefaultLocale: false` is correct, but canonical + reciprocal hreflang tags are NOT auto-emitted. Prevention: `Metadata.astro` emits canonical + three `<link rel="alternate" hreflang>` (de, en, x-default → DE); build-time sibling check. (6) **Content drift DE vs EN post-launch** — git PRs don't enforce parity. Prevention: `translationKey` + `locale` fields, CI parity script, PR template checkbox, `canonical.yaml` for invariants.

**Phase 4+ (content):** (7) **Preventive-vs-reactive positioning drifts** to "alert / notify / react" over review cycles, killing the only differentiator. Prevention: `src/data/brand/voice.md` with approved ("prevent", "deter", "before damage") + banned ("react to", "alert after", "respond") verbs; H1 glossary check. (8) **Trust-ask content dropped** for "cleanness" — German B2B conversion collapses. Prevention: codify required trust sections (logo wall, testimonials, press, partners, named contacts with phone + photo, address); pre-launch "skeptical German buyer finds legal entity + address + humans in < 10s" checklist.

**Phase 5 (forms):** (9) **Forms without DSGVO consent / honeypot / Turnstile / double-opt-in / error UI** — spam floods, DSGVO complaint, sales distrust. Prevention: unchecked DSGVO consent checkbox required, `_gotcha` honeypot + Turnstile, AJAX submission preserving field values on error, redirect to `/danke` or `/en/thanks`.

**Phase 6 / 7:** (10) **Google Maps iframe pre-consent** — naïve `<iframe src="google.com/maps/embed?…">` leaks IP before banner paints (same class as Google Fonts). Prevention: static screenshot + "Open in Google Maps" link OR click-to-load placeholder mounting iframe only after explicit "Show map" click.

## Implications for Roadmap

### Phase 0 / P1: Foundation scrub & brand reset

**Rationale:** Nothing ships until AstroWind debris is gone. CONCERNS.md CRITICAL + HIGH + Pitfalls 7, 8 all block. Earns the right to deploy at all.
**Delivers:** Clean repo; Konvoi `config.yaml` + favicon + logo + brand tokens in `tailwind.css`; Decap + `public/decapcms/` gone; demo homes / landings / posts deleted; MIT licence replaced; `image.domains` trimmed to `konvoi.eu`; `@astrolib/analytics` + `@astrojs/partytown` removed; `@fontsource/montserrat` + `@fontsource/pt-serif` installed; post-build grep CI gate permanent; Netlify context-aware robots meta; branch-deploy policy locked to `main`.
**Avoids:** Pitfalls 7, 8.

### Phase 1 / P2: Design system + layout primitives

**Rationale:** Layouts + brand-token system must exist before content pages. Tailwind v4 dark-mode invariant + self-hosted fonts + color-contrast audits land here.
**Delivers:** Stable `Layout.astro` + `PageLayout.astro`, Konvoi color tokens + typography in Tailwind v4 `@theme`, `@custom-variant dark` pinned with comment, fonts preloaded, visual smoke test (light / dark / system), Axe audit pass on baseline pages.
**Avoids:** Pitfalls 2, 3; UX pitfalls on keyboard nav, focus-visible, contrast.

### Phase 2 / P3: i18n routing + content collections

**Rationale:** Every subsequent content phase consumes this. Single placeholder pair (`/` + `/en/`) ships first to validate the chain before pouring in real content.
**Delivers:** Native Astro i18n config, `src/i18n/` + `src/navigation/{de,en}.ts`, `LanguageSwitcher.astro` preserving current route via `routeMap`, updated `content.config.ts` with 7 collections, CI translation-parity check, hreflang emission validated.
**Avoids:** Pitfalls 1, 9, partial 10.
**Locked:** single `/` + `/en/` overlay (not `[locale]/`), localized slugs, `/impressum/` + `/datenschutz/` German on both locales, NO silent fallback — missing EN routes 404 during review.

### Phase 3 / P4: Homepage + product + use-cases + verticals (with shared sensor viz)

**Rationale:** Homepage is the single highest-leverage page; product is the "understand the artefact" stop; use cases carry SEO per theft-type. `SensorDataViz` island is the single most reused custom component (7 pages), so it's built once here.
**Delivers:** DE + EN homepage, DE + EN product page, 7 DE + EN use-case pages each embedding `SensorDataViz`, 4 DE + EN industry landings cross-linking into use cases, Konvoi widgets (`PreventiveVsReactive`, `UseCaseGrid`, `IndustryHero`, `CaseStudyTeaser`, `PressStrip`, `ConsultCtaBanner`), `SensorDataViz` Preact island.
**Avoids:** Pitfalls 4, 5; perf traps (shared viz deduped, `client:visible`, image optimization).

### Phase 4 / P5: Pricing + ROI + Funding + Forms

**Rationale:** The pages that push visitors over the line belong together. Concentrating form work in one phase gets every form reviewed together (DSGVO consent, honeypot, Turnstile).
**Delivers:** DE + EN pricing sourced from `src/data/pricing.ts`, DE + EN funding page, ROI calculator island on `/preise/` + `/roi/`, `ConsultForm` + `FundingQualifierForm` Preact islands, Zod schemas, Formspree wiring with honeypot + Turnstile, DSGVO consent checkbox required + unchecked, `/danke` + `/en/thanks` pages, ROI → consult pre-fill via URL params.
**Avoids:** Pitfall 6; anti-pattern "server endpoints for forms" (stays `output: 'static'`).
**Gate:** first lead captured end-to-end through Formspree.

### Phase 5 / P6: Case Studies + Blog + Team / Careers + Contact / Events

**Rationale:** Depth and credibility pages. Maps click-to-load lands here (not P7) since it ships with the Contact page.
**Delivers:** Case-studies index + 3 customer detail pages DE + EN, blog ported from Jimdo at `/aktuelles` + `/en/news` with per-locale RSS, team page (9-person), DE-only careers + EN shell, contact page (two named contacts + office + click-to-load Maps placeholder + events list), Impressum + Datenschutz shells.
**Avoids:** Pitfall 3 (Maps pre-consent); customer licence-plate leaks in imagery.

### Phase 6 / P7: SEO + Analytics + Consent + DSGVO hardening

**Rationale:** Launch gates, not content.
**Delivers:** `@astrojs/sitemap` configured with `i18n` block emitting `<xhtml:link>` hreflang siblings, Plausible inline script in `Layout.astro`, vanilla-cookieconsent v3 with DE + EN translation JSONs in `public/locales/`, per-locale OG images, CSP in `public/_headers`, DSGVO processing register linked, Search Console verified with Konvoi's token.
**Avoids:** Pitfalls 1 (final verification), 10 (sitemap locale alternates).

### Phase 7 / P8: Launch

**Delivers:** `netlify.toml` / `_redirects` covering every old Jimdo URL → Konvoi equivalent, DNS cutover at `konvoi.eu`, sitemap submitted, Search Console International Targeting verified, `site:netlify.app konvoi` returns zero results.

### Phase Ordering Rationale

- **Dependencies from ARCHITECTURE.md:** P1 (i18n) strictly unblocks P2 (schemas need `locale`); P2 unblocks P3 (homepage needs `useCase` + `caseStudy` for teasers); `SensorDataViz` can start in parallel with content writing as soon as sensor-scenario JSON fixtures exist.
- **Grouping from FEATURES.md:** homepage + product + use-cases + verticals share widgets; pricing + ROI + funding + forms all terminate at Formspree islands; legal + consent + sitemap + analytics are launch gates, not content.
- **Pitfall avoidance:** P0 runs first because every later phase risks carrying debris forward; P2 before content because every page needs hreflang / canonical / parity in place; P5 (forms) after P4 (pricing + ROI) because ROI → consult pre-fill is a cross-component contract; P7 (consent + SEO) last because it depends on every page being authored.

### Research Flags

**Needs deeper research during planning:**

- **P1:** Font licensing — Konvoi brand licence for Montserrat + PT Serif must be verified before Phase 2 self-hosts them; licensing PDF should land in `docs/licensing/`.
- **P4:** `SensorDataViz` implementation — chart library choice (uPlot vs raw SVG + Preact signals) needs a spike; sensor-data fixture schema + realism-vs-confidentiality decisions before use-case copy is written.
- **P5:** ROI calculator formula — sales-team input required on assumption knobs (avgCargoValue per vertical, theftProbabilityPerParkingNight, konvoiPreventionRate, pricePerSensorPerMonth).
- **P6:** Trust page cert claims — TISAX vs ISO 27001 vs SOC 2 status needs legal + security-officer sign-off.

**Standard patterns (skip research-phase):**

- **P2:** Design system — AstroWind + Tailwind v4 well-documented.
- **P3:** i18n routing — Astro native docs authoritative.
- **P7:** SEO + consent — off-the-shelf patterns.
- **P8:** Launch — standard Netlify cutover; Jimdo URL inventory already in `.planning/current-site-overview.md`.

## Locked Decisions (Do Not Re-Open)

1. Astro native i18n, DE at `/`, EN at `/en/`, `prefixDefaultLocale: false`, file-tree-per-locale (NOT `[locale]/`).
2. Localized URL slugs (`/anwendungen/ladungsdiebstahl/` vs `/en/use-cases/cargo-theft/`).
3. `/impressum/` + `/datenschutz/` kept German on both locales.
4. Plausible Cloud EU as sole analytics provider; GA4 rejected.
5. vanilla-cookieconsent v3 self-configured; Cookiebot / Usercentrics / iubenda rejected.
6. Formspree primary, Netlify Forms documented fallback only.
7. Preact for every island; no Svelte / Solid / React / Vue mixing.
8. Zod for client-side form validation.
9. Motion One for animations + Tailwind v4 `@theme` `@keyframes` for trivial reveals; no AOS / GSAP / framer-motion.
10. sharp + unpic + Netlify Image CDN kept as-is; no Cloudinary / ImageKit.
11. Markdown-in-repo + PR authoring; `public/decapcms/` deleted in P0.
12. `output: 'static'` forever for v1; no `hybrid`, no server endpoints.
13. Self-hosted Montserrat + PT Serif via `@fontsource/*`; Google Fonts CDN banned.
14. Google Maps via click-to-load placeholder; never a naïve pre-consent iframe.
15. Content collections: long-form split by `{de,en}/` subdirs with `locale` + `canonicalKey`; short-form (events, team) uses `{de, en}` sibling fields.
16. `src/data/pricing.ts` plain TS module is the single source of truth for pricing page + ROI calc.
17. `src/data/brand/canonical.yaml` for legal entity, contacts, addresses, tier prices.
18. `src/data/brand/voice.md` with approved / banned verb glossary.
19. Netlify production-only branch deploys; no long-lived `develop` / `staging`.
20. Post-build grep CI gate permanent (`astrowind|arthelokyo|onwidget|Unsplash|Cupertino`).
21. No tests for v1 beyond `pnpm check` + post-build grep + link-check.

## Open Questions for Roadmap Planning

1. **ROI formula inputs and assumptions** — who on Konvoi owns the numbers in `src/data/pricing.ts`?
2. **Plausible vs Pirsch** — both EU-hosted, both cookieless; Pirsch is a German company. Pick before P7 wires the script.
3. **Sensor data fixture format** — shape of motion / shock / GPS trace JSON; which real traces can be shown publicly vs need synthetic regeneration.
4. **Trust page cert claims** — TISAX / ISO 27001 / SOC 2 status needs legal + security-officer sign-off.
5. **Font licensing documentation** — does Konvoi have a current Monotype / MyFonts web-use licence for Montserrat + PT Serif?
6. **Newsletter scope** — kept out of v1 by FEATURES.md; if reintroduced later, double-opt-in is mandatory under German BGH jurisprudence.
7. **Case-study customer approvals** — Schumacher, JJX, Greilmeier quotes + logos approved in writing for the new site?
8. **Jimdo URL redirect inventory** — mapping every old URL → Konvoi equivalent needs roadmap-level signoff before P8 wires `netlify.toml`.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Astro 6 native i18n, Plausible EU, vanilla-cookieconsent, Formspree, Preact, Motion One verified against 2026 official docs; already-locked base stack is green-building. |
| Features | HIGH | Benchmarked against Phillips Connect, Samsara, Geotab, Bringg, 2026 B2B SaaS conversion research. Konvoi-specific differentiators well-grounded in PROJECT.md + current-site-overview.md. |
| Architecture | HIGH | Layered SSG + islands is canonical Astro; i18n strategy verified against Astro 6 docs; content-collection schema backed by Astro maintainer discussion. |
| Pitfalls | HIGH | Framework / DSGVO specifics verified against Astro v6 upgrade guide, Tailwind v4 migration issues (GitHub #16171, #16517), Munich ruling sources, Netlify docs, Formspree docs. MEDIUM on Konvoi-specific UX drift (extrapolated from site snapshot, not user research). |

**Overall confidence:** HIGH.

### Gaps to Address

- No user research or conversion analytics from current Jimdo site (acknowledged in PROJECT.md). IA redesign is informed-opinion-driven; revisit post-launch with real Plausible data.
- ROI calculator formula numbers (Open Q1).
- Sensor-data fixture format (Open Q3).
- Trust page cert state (Open Q4).
- Font licensing paperwork (Open Q5).
- Case-study customer approvals (Open Q7).

None block Phases 0–2. All must resolve before their respective phase enters active development.

## Sources

### Primary (HIGH confidence)

- Astro i18n docs, Astro v6 upgrade guide, Astro islands architecture
- `@astrojs/preact` v5.1.1 docs
- Tailwind CSS v4 upgrade guide + discussion #16517 + issue #16171
- Plausible EU hosting + Made-in-EU blog
- vanilla-cookieconsent v3 GitHub + docs
- Formspree privacy + SCCs + Astro integration guide
- motion.dev
- unpic Netlify CDN provider
- Project-internal: `.planning/PROJECT.md`, `.planning/current-site-overview.md`, `.planning/codebase/CONCERNS.md`, `.planning/codebase/STACK.md`, `.planning/codebase/CONVENTIONS.md`

### Secondary (MEDIUM confidence)

Mavik Labs Astro i18n 2026 guide; FormGrid Netlify Forms 2026 alternatives; Pirsch Analytics (DE runner-up); Kukie.io Cookie Consent Germany TDDDG; DSGVO-Vergleich 2026; Usercentrics Google Fonts GDPR; PrivacyChecker Munich District Court context; SecurityToday BGH rulings 2026; SaaS Hero / Growthspree / Directive / Webstacks 2026 B2B SaaS benchmarks; Phillips Connect / Samsara / Geotab / Bringg feature pages; Joost.blog Astro SEO guide; LinkGraph 2026 hreflang guide.

### Tertiary (LOW confidence, validate later)

- Formspree "EU data residency" (SCCs + DPA but no explicit EU-residency claim — flag for v1.5 revisit if sales pushback).
- Chart library choice for `SensorDataViz` (uPlot vs raw SVG + Preact signals) — decide empirically in first P4 spike.
- Exact ROI assumption numbers — business input required.

---

*Research completed: 2026-04-20*
*Ready for roadmap: yes*
