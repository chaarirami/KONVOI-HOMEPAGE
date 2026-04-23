# konvoi-homepage

## What This Is

A full rebuild of www.konvoi.eu — the corporate marketing site for **KONVOI GmbH** (Hamburg), a B2B security-tech company that sells a preventive sensor + AI platform for truck trailers. The new site targets German and English-speaking transport and logistics operators who need to prevent cargo theft, diesel theft, equipment theft, trailer damage and driver assaults, with the 80% de-minimis German subsidy hook as a unique conversion lever. The rebuild replaces the current Jimdo-hosted site with an Astro 6 + Tailwind 4 stack owned by the Konvoi team.

## Core Value

**Turn visitors into booked consult calls** with sales. Every page, CTA, and content decision must serve that one conversion — the "book a consult" action on the current site is the only way Konvoi closes deals, and the rebuild must convert at a higher rate than the Jimdo original.

## Requirements

### Validated

<!-- Shipped and confirmed valuable in the existing production site at konvoi.eu or validated in rebuild phases -->

- ✓ Static marketing site with SEO meta, sitemap, OG images — existing
- ✓ Bilingual DE / EN content (DE primary) — existing
- ✓ Industry vertical landings (high-value, cooling, intermodal, other) — existing
- ✓ Use-case deep-dives with motion/shock/GPS data visualisations — existing
- ✓ Team page with bios + open-positions list — existing
- ✓ Customer / press / partner logo walls — existing
- ✓ Customer testimonials (Schumacher, JJX, Greilmeier) — existing
- ✓ Contact page with two-contact split (customer vs investor) + upcoming events — existing
- ✓ German-language blog at `/aktuelles` — existing
- ✓ Funding-eligibility narrative (80% de-minimis) — existing

### Active

<!-- v1 scope for the rebuild. Hypotheses until shipped. -->

- [ ] **REQ-NAV-01** Flatten primary nav — surface Product / Use Cases / Case Studies / Pricing / Company / Contact at top level
- [ ] **REQ-NAV-02** Top-level DE ↔ EN language switcher with per-route locale persistence
- [ ] **REQ-HOME-01** Homepage with new hero, preventive-vs-reactive narrative, Security-Tech-Made-in-Germany tagline, primary "Book a consult" CTA
- [ ] **REQ-HOME-02** Customer logo wall, 3 rotating testimonials, press-mentions strip, partners/investors row on homepage
- [ ] **REQ-PRODUCT-01** Product page covering hardware spec, data-service layers, alarm chain, installation process
- [ ] **REQ-UC-01** 7 individual use-case pages (cargo theft, diesel theft, equipment theft, damaged trailers, driver assaults, stationary-time optimization, operations transparency), each with shared motion / shock / GPS data-viz widget
- [ ] **REQ-VERT-01** 4 industry landings (high-value, cooling, intermodal, other) that cross-link into the relevant use-case deep-dives
- [ ] **REQ-CASE-01** Dedicated case-studies index + individual case study pages per customer (Schumacher, JJX, Greilmeier, more as they come)
- [ ] **REQ-PRICE-01** Public pricing page with Standard / + Camera Module / + Logbook package tiers and "Book a consult" CTA
- [ ] **REQ-ROI-01** Interactive ROI / savings calculator (inputs: fleet size, vertical, parking frequency → estimated annual theft savings)
- [ ] **REQ-FUND-01** Dedicated funding-eligibility page explaining the 80% de-minimis subsidy with a pre-qualification form
- [ ] **REQ-COMPANY-01** Team page (bios + photos) pulled from content collection
- [ ] **REQ-COMPANY-02** Careers page listing open roles sourced from markdown; "apply" links open mailto to applications inbox
- [ ] **REQ-CONTACT-01** Contact page with two named contacts (customer advisor + MD) + office address + Google-Maps embed
- [ ] **REQ-EVENTS-01** Upcoming-events list on Contact page, sourced from content collection; past events auto-hide by end date
- [ ] **REQ-BLOG-01** Blog at `/aktuelles` (DE) and `/en/news` (EN) ported from current Jimdo blog, plus ability to publish new posts via markdown + PR
- [ ] **REQ-FORMS-01** Lead-capture form (consult booking + funding pre-qual) backed by Formspree / FormSubmit / equivalent — no custom backend
- [ ] **REQ-LEGAL-01** Impressum, Datenschutz, cookie-consent banner, Konvoi licence (private, remove AstroWind MIT licence)
- [ ] **REQ-DEPLOY-01** Deploy to Netlify on a custom domain (`konvoi.eu` DNS cutover is the final launch step)
- [x] **REQ-I18N-01** Astro i18n routing with DE default + `/en/` prefix, locale-aware URLs, and i18n-ready content collections — Validated in Phase 3
- [ ] **REQ-CONTENT-01** Markdown-based content-authoring workflow in `src/data/**` — editors ship copy via pull requests, no CMS
- [ ] **REQ-BRAND-01** Apply existing Konvoi brand (Montserrat + PT Serif, current colour palette) and strip AstroWind template scaffolding

### Out of Scope

<!-- Explicit boundaries. Reasoning attached so decisions don't quietly reopen. -->

- Self-serve signup / trial — Konvoi sells via direct sales; no self-service funnel fits the motion
- Customer portal / authenticated area — marketing site only; any customer-facing tooling belongs in a separate app
- Custom form backend / bespoke serverless API — Formspree-class service is enough for v1
- HubSpot / Pipedrive CRM integration — forward form submissions via email; CRM wiring is a later milestone
- Full ATS (Greenhouse / Lever) integration — mailto-based application flow is enough for v1
- Decap CMS / headless CMS — markdown-in-repo + PR is the chosen authoring workflow; existing `public/decapcms/` scaffolding will be removed
- Keeping AstroWind demo pages — `src/pages/homes/*`, `src/pages/landing/*`, AstroWind blog posts and imagery get deleted
- Keeping AstroWind attribution / licence — replaced with Konvoi-owned private licence; README and component-level comments scrubbed
- Building the trailer-security product itself — this repo is marketing only; the product is a separate codebase
- 1:1 parity with current IA — the redesign deliberately restructures navigation, so literal parity is rejected

## Context

**Business context.** KONVOI GmbH is a 2020 TUHH spin-off in Hamburg, seed-funded in 2022 and 7-figure-funded in Jan 2025 by 1750 Ventures. 9-person team. Two sales contacts (Justus Männinghoff as Customer Advisor, Heinz Luckhardt as MD for investors/marketing/applicants). Primary market is Germany; secondary is EU transport/logistics operators. Current site converts exclusively via direct phone / email — no self-serve funnel exists and none is planned.

**Narrative hooks that must land.** "Security Tech Made in Germany" (hero) and the preventive-vs-reactive positioning (the product prevents incidents before damage; competitors alert after damage). The TAPA €8B/yr cargo-theft figure and the 80% de-minimis funding hook are supporting evidence, surfaced on deeper pages rather than the hero.

**Codebase state.** AstroWind template fork just migrated to Astro 6.1.8, Tailwind 4.2.2, TypeScript 6.0.3, pnpm 10.32.1, Node 24. Build is green (36 pages). ~0% of the content is Konvoi's — the fork still ships demo homes (`personal`, `saas`, `startup`, `mobile-app`), demo landings (`click-through`, `lead-generation`, `pre-launch`, `product`, `sales`, `subscription`), AstroWind blog posts, Unsplash stock imagery, and placeholder copy on `about`, `contact`, `pricing`, `services`. All of this gets replaced. See `.planning/codebase/CONCERNS.md` for the severity-ranked debt list.

**Existing site captured.** See `.planning/current-site-overview.md` for a structured snapshot of the live Jimdo site captured 2026-04-20: full navigation, every section on every page, testimonials, use-case copy, team roster, job openings, events, contact details. That snapshot is the source of truth for "what must be migrated or regenerated".

**Research gaps.** No user research or conversion analytics from the current site has been provided — the IA redesign is informed-opinion-driven rather than data-driven. Acceptable for v1 but should be revisited post-launch with real analytics.

## Constraints

- **Tech stack**: Astro 6 + Tailwind 4 + TypeScript 6 + pnpm 10 — locked by migration already done
- **Node runtime**: ^22.0.0 || >=24.0.0 — Astro 6 floor
- **Package manager**: pnpm only — npm is never used in this repo (see `feedback_package_manager` memory)
- **Hosting**: Netlify — chosen over Vercel / self-hosted for this project
- **Languages**: DE + EN parity from v1 — Konvoi is primarily a German-market company
- **Authoring workflow**: markdown + git PRs — no external CMS service
- **Form backend**: Formspree / FormSubmit / equivalent — no custom server
- **Brand**: existing Konvoi brand (Montserrat / PT Serif / current palette) — no redesign budget in this project
- **Timeline**: no hard deadline — ship when it's better than the Jimdo site; optimise for quality over speed
- **Tests**: none required for v1 — marketing site; `pnpm check` (astro-check + eslint + prettier) is the only automated gate
- **Licence**: private — Konvoi-owned, not MIT; AstroWind licence gets replaced

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Redesign IA rather than rebuild 1:1 | Current nav is deep/confusing, industry pages compete with main CTA, no clear primary conversion | — Pending |
| DE + EN parity from day 1 | DE is the primary market; shipping EN-only would delay German launch for a flagship redesign | — Pending |
| Regenerate all copy fresh | Existing copy is Jimdo-era and pre-preventive-positioning refresh; rebuild is the right moment to rewrite | — Pending |
| Port existing blog posts | SEO equity + content depth worth preserving; also validates the i18n content-collection plumbing | — Pending |
| Individual use-case pages + shared widget | Dedicated URLs help SEO per theft-type; shared motion/shock/GPS widget keeps the data-viz consistent | — Pending |
| Markdown-in-repo + PR for content | Small content-editing team all technical; avoids CMS vendor lock-in + extra service cost | — Pending |
| Formspree-class service for forms | No need for custom backend for a handful of lead forms; cheapest path to compliant submission | — Pending |
| Deploy to Netlify | `netlify.toml` already present; Netlify forms as a fallback for the form backend if needed | — Pending |
| Keep existing Konvoi brand assets | No rebrand budget; Montserrat + PT Serif already drive the current brand recognition | — Pending |
| Drop AstroWind demo scaffolding | 0% of demo pages / posts / imagery will ship publicly; leaving them in the repo invites drift | — Pending |
| Remove Decap CMS scaffolding | `public/decapcms/` points at the wrong content folder and is not the chosen authoring path | — Pending |
| Replace AstroWind MIT licence | Site is a private corporate asset, not an OSS template | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-23 after Phase 4 completion (Core Marketing Pages — homepage, product, 7 use-cases, 4 industry verticals, all DE+EN)*
