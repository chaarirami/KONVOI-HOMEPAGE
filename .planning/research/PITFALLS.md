# Pitfalls Research

**Domain:** Bilingual (DE/EN) B2B marketing site — Astro 6 + Tailwind 4 + TypeScript 6, static deploy on Netlify, Formspree-class form backend, markdown-in-repo authoring, DSGVO-regulated German market.
**Researched:** 2026-04-20
**Confidence:** HIGH on framework/DSGVO specifics (verified against Astro v6 docs, Tailwind v4 docs, German court rulings, Netlify docs). MEDIUM on Konvoi-specific UX traps (extrapolated from the `current-site-overview.md` snapshot and `CONCERNS.md`; not validated against user research, which the project explicitly lacks).

> This file is the pessimist's charter for the rebuild. Each pitfall is attached to the exact file/decision that will cause it and the phase that should guard against it. Phases referenced are the canonical phases proposed in `SUMMARY.md`: **P1 Foundation scrub** · **P2 Design system + layout** · **P3 i18n routing + content collections** · **P4 Core marketing pages (Home, Product, Use Cases, Verticals)** · **P5 Pricing + ROI + Funding + Forms** · **P6 Case Studies + Blog + Team/Careers + Contact** · **P7 SEO/Analytics/Consent + DSGVO hardening** · **P8 Launch (DNS cutover, crawl, Search Console)**. The first mention of each phase spells it out; later references use the P-code.

---

## Critical Pitfalls

### Pitfall 1: Default-locale unprefixed routes are served without canonical/hreflang, splitting SEO authority across `/` and `/en/`

**What goes wrong:**
Astro's `i18n.routing.prefixDefaultLocale: false` is the right choice for Konvoi (DE at `/`, EN at `/en/`), but without explicit `<link rel="canonical">` per locale and reciprocal `<link rel="alternate" hreflang="…">` pairs Google treats DE and EN variants as either duplicates or orphans. The site ends up with two pages competing for the same queries, neither ranking well. A second failure mode: the bare domain `konvoi.eu` with no content at `/` (because DE content is nested under a `de/` collection) returns a thin/empty page that Google indexes over the real landing page.

**Why it happens:**
The Astro docs show the `prefixDefaultLocale: false` flag in the routing chapter but the canonical/hreflang emission is out-of-scope for the router — you ship it yourself in `Metadata.astro`. Teams discover the missing tags only after LinkedIn/Slack/Google render the wrong locale snippet.

**How to avoid:**
- In `src/components/common/Metadata.astro`, emit for every page: `<link rel="canonical" href="{absolute-self-URL}">` plus three `<link rel="alternate" hreflang>` tags — `de`, `en`, and `x-default` pointing at DE.
- hreflang URLs MUST be absolute and MUST return 200 on both sides — missing the return link on the DE side is the #1 hreflang bug Google Search Console reports.
- Decide the `x-default` explicitly: DE is primary market, so `x-default = DE root`. Document the decision in `CONVENTIONS.md`.
- Add a build-time check: fail `pnpm build` if a page has a canonical but no matching hreflang sibling.

**Warning signs:**
- Search Console "International Targeting" report shows "missing return tags" or "no hreflang tags"
- LinkedIn preview of `/en/product` shows the German OG description
- Google index shows two URLs for the same product page competing

**Phase to address:** **P3** (i18n routing) must wire canonical + hreflang into the shared `Metadata.astro`; **P7** (SEO hardening) re-verifies with a site-wide crawl.

---

### Pitfall 2: Tailwind v4 dark-mode variant silently breaks `dark:` utilities site-wide

**What goes wrong:**
The repo already ships `@custom-variant dark (&:where(.dark, .dark *));` in `src/assets/styles/tailwind.css:5-6`. This is the load-bearing line for every `dark:*` class in the codebase. A well-meaning contributor "simplifies" it to `@custom-variant dark (&:is(.dark *));` or deletes it believing Tailwind v4 handles dark mode automatically — in v4 the default is `@media (prefers-color-scheme: dark)`, not class-based. All `dark:*` utilities across the site invert their behavior: the site flashes dark when the OS is set to dark, regardless of the toggle. Combined with the already-fragile color-mode script (`src/components/common/ApplyColorMode.astro` — `// TODO: This code is temporary`, patched in PR #646), this reintroduces the flicker bug.

**Why it happens:**
Tailwind v4 migration guides are inconsistent: some show `@variant dark …`, some show `@custom-variant dark …`, and the v3 pattern `darkMode: 'class'` no longer exists. Devs assume "v4 handles it" and remove the config.

**How to avoid:**
- Pin a comment block above `@custom-variant dark` in `tailwind.css` explaining: (a) this is v4 syntax, (b) don't change without testing `ApplyColorMode.astro` interaction, (c) link to PR #646.
- Keep the existing `&:where(.dark, .dark *)` selector — it matches `.dark` itself AND descendants; `&:is(.dark *)` matches descendants only and breaks elements that have the `.dark` class on themselves.
- Visual smoke test after any `tailwind.css` edit: open home DE, home EN, pricing, and one blog post in light + dark + system modes.

**Warning signs:**
- Theme toggle button visibly "jumps" on first paint
- Dark-mode styles appear on elements that should be light
- Screenshot diffs show color inversions where none were intended

**Phase to address:** **P2** (design system) owns the variant declaration and writes the smoke-test checklist; **P7** verifies via visual regression before launch.

---

### Pitfall 3: Default-disabled DSGVO consent — Google Maps embed, Google Fonts, or analytics fires before consent

**What goes wrong:**
The current Jimdo site embeds Google Maps on `/contact` (see `current-site-overview.md` §8). Naively porting that to Astro with `<iframe src="https://www.google.com/maps/embed?...">` leaks the visitor's IP to Google **before** the cookie banner is even painted. The Munich District Court ruling (2022) established that loading Google Fonts from Google's CDN is a DSGVO violation because IP transfer is not "strictly necessary" — the same logic applies to Google Maps embeds, Google Tag Manager, and YouTube `youtube.com` embeds (use `youtube-nocookie.com` pre-consent, or don't embed at all). Since March 2025 competitors can issue UWG warnings for these violations without proving individual harm; penalties reach €300k (TTDSG) / €20M or 4% of turnover (DSGVO).

**Why it happens:**
- `<iframe>`, `<script src="https://…">`, and `<link href="https://fonts.googleapis.com/">` fire on HTML parse — they do not wait for JS consent logic.
- Cookie banners using "Google Consent Mode v2" let analytics ping Google with `ad_storage=denied` but still contact Google servers; the Hamburg DPA treats the initial request itself as processing.
- `@fontsource-variable/inter` is already in `package.json` — good — but Konvoi's brand fonts are Montserrat + PT Serif (not Inter), so someone will try to add Google Fonts CDN for the brand fonts.

**How to avoid:**
- **Fonts:** Self-host Montserrat + PT Serif via `@fontsource/montserrat` + `@fontsource/pt-serif` (or equivalent). Never `<link href="https://fonts.googleapis.com/…">` and never `@import url('…fonts.googleapis.com…')`. Delete the `@fontsource-variable/inter` import once Konvoi fonts are in.
- **Maps:** Replace the embed with a static image (screenshot) + "Open in Google Maps" link. Or gate the iframe behind a click-to-load placeholder that only mounts the iframe after explicit "Show map" click (not after blanket cookie consent — a two-stage interaction). Document the address as plain text regardless.
- **Analytics:** Choose Plausible (EU-hosted, cookieless) or self-hosted Matomo. `CONCERNS.md` already flags this. Do NOT use GA4 without a full CMP stack; it's a month of compliance work for a 9-person team.
- **YouTube:** If the hero or a use-case page embeds a demo video (the current site autoplays a 90s video, `current-site-overview.md` §6), either host the video locally (Netlify bandwidth permitting) or use `youtube-nocookie.com` and lazy-mount after play-button click.
- Add a build-time check: grep for `fonts.googleapis.com`, `google.com/maps/embed`, `youtube.com/embed` in `dist/**/*.html` — fail the build if any are found.

**Warning signs:**
- Network tab on first page load shows requests to `fonts.googleapis.com`, `maps.googleapis.com`, `google.com`, `doubleclick.net`, `google-analytics.com`
- Legal sends a screenshot of a UWG "Abmahnung" letter
- Search for `<iframe` in `src/**/*.astro` returns more than zero results

**Phase to address:** **P7** (SEO/Analytics/Consent + DSGVO hardening) owns the consent banner decision and the grep check; **P6** (Contact page) makes the Maps decision; **P2** (design system) makes the font-loading decision.

---

### Pitfall 4: Preventive-vs-reactive positioning drifts to "we alert you" — killing Konvoi's only differentiator

**What goes wrong:**
The hero copy drifts across review cycles. What starts as "The first preventive solution for your fleet" (current site) degrades to "Real-time alerts when your trailer is attacked" or "We notify you of incidents instantly." Both sound like every competitor (Webfleet, TomTom, Geotab) and deflate Konvoi's only unique claim. Any page that says "alert", "notify", "react", "respond" in the hero without explicitly pairing it with "prevent" / "before" / "deter" is off-message.

**Why it happens:**
- Copywriters reach for dynamic verbs — "alert" is more active-voice than "prevent".
- "Prevent" is harder to prove, so writers soften to "detect" or "alert" when under review.
- A/B-test temptation: "notify" converts better in isolated test → gets adopted without re-checking strategic positioning.

**How to avoid:**
- Add a copy-review check to `CONVENTIONS.md`: every hero and every H1 on the home, product, and use-case pages must contain one of `preventive|prevent|präventiv|vorbeug|verhinder|before` OR pair an alert claim with an explicit "before damage occurs" clause.
- Maintain a short glossary in `src/data/brand/voice.md` with approved + banned verbs. Banned: "react to", "alert after", "respond to incidents". Approved: "prevent", "deter", "classify threats before…", "AI predicts".
- Show the H1 of every marketing page in a PR-template checklist: "Does this page make the preventive claim?"

**Warning signs:**
- Heuristic review of the site reads like "another telematics vendor"
- Sales team reports prospects asking "how is this different from [competitor]?"
- Analytics show bounce rate on /product or /en/product > 70% from organic

**Phase to address:** **P4** (core marketing pages) must bake the voice into the first drafts; every phase with customer-facing copy (**P4-P6**) re-checks the glossary.

---

### Pitfall 5: Trust-ask content (addresses, phone numbers, team photos) gets dropped to make the site "cleaner" — conversion collapses

**What goes wrong:**
Design iterations remove the office address, the two named contacts (Justus + Heinz), the 9-person team photos, the physical Hamburg address, or the customer-logo wall because they "clutter the page". The site becomes sleeker and B2B conversion drops. German enterprise buyers (transport companies, logistics ops, insurance brokers) specifically look for physical presence, named humans, and legal-entity details to validate they're not talking to a shell company — this is especially true in the German market where Impressum law conditions B2B visitors to expect disclosure.

**Why it happens:**
- Modern B2B SaaS design language optimizes for "minimal, product-led" — which is wrong for a 9-person hardware-selling German security-tech company.
- Design tokens and component libraries implicitly discourage "bio cards with headshots" as old-fashioned.
- Legal (Impressum) and marketing (trust asks) get separated — "the address is already on Impressum, we don't need it on Contact".

**How to avoid:**
- Codify trust asks as required homepage/contact-page sections in the roadmap: customer logo wall, 3+ rotating testimonials, press logos, partner/investor logos, named contacts with phone + photo, office address, Google-Maps-or-equivalent, team-page link.
- The contact page MUST show both contacts (Justus for customers, Heinz for investors/applicants) with names + photos + direct phone — mirroring the current site's structure, which works.
- Team page MUST include bios + photos for the full 9-person team, including Justus's photo on contact and the sales/support names. This is also true for every case study (named customer contact).
- Add a pre-launch checklist item: "Can a skeptical German buyer find our legal entity, physical address, and named humans in < 10 seconds?"

**Warning signs:**
- PR title "simplify contact page" — read it before merging
- Homepage wireframes drop the customer-logo wall "for balance"
- Design review proposes a faceless "Contact us" form as the only contact channel
- Sales reports first-call question "who are you people?"

**Phase to address:** **P4** (homepage) must include logo wall + testimonials + contacts block; **P6** (Contact + Team) must carry the full roster; **P7** (launch review) pre-launch checklist.

---

### Pitfall 6: Forms ship without spam protection, double-opt-in, or DSGVO consent checkbox

**What goes wrong:**
The lead-capture form (consult booking, funding pre-qual) goes live on Formspree with default settings. Within 48 hours the inbox fills with pharma-spam, crypto scams, and SEO outreach — Justus and Heinz stop trusting form submissions and revert to email-only contact. Worse: the form captures the visitor's name + company + phone + fleet details with no DSGVO consent checkbox, no privacy-policy link, and no legal-basis documentation — a complaint-ready DSGVO violation. The consent was not "freely given, specific, informed, unambiguous" (Art. 7 DSGVO).

**Why it happens:**
- Formspree is easy; the DSGVO copy is not.
- Honeypot and Cloudflare Turnstile are opt-in on Formspree's side, not default.
- "It's just a contact form" — actually it's Art. 6(1)(a) consent-based processing.
- Teams forget that newsletter signups need double-opt-in in Germany (BGH jurisprudence, not just DSGVO).

**How to avoid:**
- **Spam:** Enable Formspree's `_gotcha` honeypot (hidden field) AND enable Cloudflare Turnstile on every Formspree form. Both are free and complementary. Log rejected submissions so we see what's blocked.
- **Rate limits:** Formspree's free plan is 50 submissions/month — for a B2B consult form this is probably enough, but upgrade to the Basic/Pro tier before launch so a burst of legitimate interest doesn't get rate-limited after publication or trade-show drop-ins.
- **Consent checkbox:** Every form has an unchecked-by-default checkbox `Ich habe die <a href="/datenschutz">Datenschutzerklärung</a> gelesen und willige in die Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage ein.` (DE) and EN equivalent. Required field.
- **Newsletter (if added):** Double-opt-in mandatory — the form captures the email, Formspree/an ESP sends a confirmation link, only after click does the address enter the mailing list. Single-opt-in is illegal for commercial email in Germany.
- **Error states:** Never blank the form on error. Preserve all field values; show a per-field or top-of-form error banner. Formspree's default redirect behavior loses user input — override with AJAX submission + custom error UI.
- **Acknowledge submissions:** Redirect to a `/danke` (DE) / `/en/thanks` (EN) page, not a stock "Thanks" Formspree page. Include "what happens next" (24h response SLA, who will reply).

**Warning signs:**
- Inbox has > 5 spam submissions per week
- Sales complains "the form says it sent but the submission never arrived" — often the honeypot misconfigured, blocking real users
- DSGVO audit asks "where is your Art. 6 legal basis for this form?"

**Phase to address:** **P5** (forms) owns all of this; **P7** verifies the consent checkbox, honeypot, and Turnstile are live before launch.

---

### Pitfall 7: Netlify deploy previews and branch deploys get indexed by Google — duplicate content, dilution, and leaked pre-launch drafts

**What goes wrong:**
Netlify adds `X-Robots-Tag: noindex` automatically to **Deploy Previews** and **old/unpublished** Branch Deploys, but **recent Branch Deploys** (e.g. a `develop` or `staging` branch kept live) are NOT automatically noindexed. If `develop.konvoi.eu.netlify.app` or `feat-pricing--konvoi-homepage.netlify.app` ever gets linked from a tweet, a Slack, or an internal wiki, Google crawls it and indexes a pre-launch version of the site — either embarrassing (demo copy, unfinished pricing) or duplicate-content-harmful to the production site. The included `@astrojs/sitemap` also emits a `sitemap.xml` with whatever `site.site` is configured as; if the deploy preview was built against production `site.site`, the sitemap URLs point to `konvoi.eu` but from `.netlify.app` — confusing Google.

**Why it happens:**
- The promise "Netlify noindexes previews" is partially true, and devs generalize the promise to all non-production deploys.
- `public/robots.txt` is static — it ships identically to production and every preview.
- `site.site` in `src/config.yaml` is static — it's the same string whether building for prod or preview.

**How to avoid:**
- Emit `<meta name="robots" content="noindex, nofollow">` on every page when `import.meta.env.CONTEXT !== 'production'` (Netlify sets `CONTEXT=production|deploy-preview|branch-deploy`). Do this in `src/layouts/Layout.astro` so it's global.
- Dynamically compute `site.site` in `astro.config.ts` from `process.env.DEPLOY_PRIME_URL` on previews, `process.env.URL` on production, falling back to the config value locally. This keeps the sitemap honest.
- Add a Netlify branch-deploy setting: only deploy `main` (production) and nothing else. Deploy previews are fine (per-PR, auto-noindexed, short-lived). Disable long-lived staging branches unless specifically needed.
- Add `X-Robots-Tag: noindex` via `public/_headers` scoped to known non-production contexts — belt-and-braces in case the meta tag is stripped by a compressor.

**Warning signs:**
- Search `site:netlify.app konvoi` on Google — any result is a leak
- Search Console shows coverage errors on `.netlify.app` hostnames
- Sitemap has mixed-domain URLs

**Phase to address:** **P1** (foundation scrub) sets `src/config.yaml` site correctly and adds the context-aware robots meta; **P8** (launch) re-verifies with a Google site: query.

---

### Pitfall 8: Hardcoded AstroWind canonicals and template debris leak into the production build

**What goes wrong:**
Four demo blog posts in `src/data/post/` hardcode `canonical: https://astrowind.vercel.app/...` in their frontmatter. `src/config.yaml` hardcodes `site.site: 'https://astrowind.vercel.app'`, `openGraph.site_name`, and `twitter.handle: @arthelokyo`. If any build ships without scrubbing all of this, Konvoi's production pages emit `<link rel="canonical" href="https://astrowind.vercel.app/...">` telling Google the canonical version of Konvoi's content lives on AstroWind's demo site, and OG previews render `@arthelokyo`'s Twitter card. This is all already catalogued in `CONCERNS.md` at HIGH severity.

**Why it happens:**
- The fork was done to get a working baseline fast — template debris is a known consequence, but it doesn't block `pnpm build` so it's easy to forget.
- No test asserts "no AstroWind strings in dist/".

**How to avoid:**
- P1 explicitly deletes: `src/pages/homes/**`, `src/pages/landing/**`, demo `src/data/post/*.md[x]` (all six), `src/components/widgets/Announcement.astro`, `public/decapcms/**`, `vendor/integration/` (replace or keep — decide in P1), `LICENSE.md` (replace with Konvoi private), `src/pages/privacy.md` + `src/pages/terms.md` (replace with DE/EN Konvoi Impressum + Datenschutz).
- Add a post-build grep: `grep -rE "astrowind|arthelokyo|onwidget|Unsplash|Cupertino" dist/` — fail the build if any matches. Keep this as a permanent CI gate so regressions can't slip in.
- Replace `src/config.yaml` values: `site.name: Konvoi`, `site.site: https://www.konvoi.eu`, `metadata.title`, `metadata.description` (DE), remove `twitter.handle`, replace `googleSiteVerificationId`.
- Delete `astro.config.ts` `image.domains` whitelist entries for `images.unsplash.com`, `plus.unsplash.com`, `cdn.pixabay.com`, `img.shields.io` once all demo imagery is local.

**Warning signs:**
- `grep -r arthelokyo dist/` returns matches
- View-source of a blog post shows an AstroWind canonical
- OG preview in Slack/LinkedIn shows the AstroWind purple-space image
- Google Search Console verification fails (using onWidget's token)

**Phase to address:** **P1** (foundation scrub) — this is the entire scope of P1; nothing else proceeds until the grep is clean.

---

### Pitfall 9: Content drift between DE and EN (pricing, feature lists, legal entity, contact details) goes live unnoticed

**What goes wrong:**
Pricing gets updated on `/en/pricing` in September; `/preise` (DE) still shows the old tier name or price six months later. The English team page has 9 bios; the German one still has 7 because nobody ported the two new hires. The DE version of `/contact` shows the old mobile number for Justus; EN shows the new one. Trust collapses: a German buyer clicks the language switcher, sees inconsistent info, and walks away assuming the company is chaotic.

**Why it happens:**
- Markdown-in-repo + PR is the chosen authoring flow (`PROJECT.md` key decision). PRs can legitimately touch one locale without the other — git doesn't enforce parity.
- Small technical team; content owner is not separated from engineer; commits are ad-hoc.
- No CMS to surface "missing translation" warnings.

**How to avoid:**
- **Schema-level twin:** Every content collection (`post`, `caseStudy`, `teamMember`, `openPosition`, `event`) has a `locale: z.enum(['de', 'en'])` field and a `translationKey: z.string()` field. The build fails if any `translationKey` has only one of the two locales (configurable for `/aktuelles` blog which is DE-only, but explicit).
- **Pre-commit + CI check:** A script walks `src/data/**` and asserts DE+EN pairs for every translationKey in collections marked bilingual. Report missing translations in the PR checks tab.
- **Copy glossary:** Legal entity ("KONVOI GmbH"), phone numbers, address, contacts (Justus / Heinz), tier prices — all sourced from a single `src/data/brand/canonical.yaml`. Page templates read from this file, not from per-locale markdown. Translating the surrounding prose is fine; translating the entity name is not.
- **PR template:** Add a checkbox "If this changes pricing, contacts, legal entity, or feature lists — did you update both DE and EN?"

**Warning signs:**
- `pnpm check` adds a warning about N untranslated keys (needs tooling)
- Content audit shows different hero copy on `/` vs `/en/`
- Sales reports "the customer saw an old price on the website"

**Phase to address:** **P3** (i18n routing + content collections) defines the schema and the parity check; **P6** (team/careers/events) relies on it; every content-change PR post-launch.

---

### Pitfall 10: Sitemap entries miss locale alternates, breaking multilingual indexing

**What goes wrong:**
`@astrojs/sitemap` by default lists every URL once. For a bilingual site, Google expects each URL to declare its `<xhtml:link rel="alternate" hreflang="…" href="…"/>` siblings **inside the sitemap** — not only in the page `<head>`. Without this, Google discovers `/product` and `/en/product` as separate URLs and cannot connect them. International ranking is poor for both.

**Why it happens:**
- `@astrojs/sitemap` has an `i18n` option for exactly this, but the config is usually defaulted to emit per-URL entries with no `xhtml:link` siblings.
- Teams assume the `<head>` hreflang is enough. Google crawls both, but the sitemap signal is still expected per Google's international SEO docs.

**How to avoid:**
- Configure `@astrojs/sitemap` in `astro.config.ts` with the `i18n` option:
  ```ts
  sitemap({
    i18n: {
      defaultLocale: 'de',
      locales: {
        de: 'de-DE',
        en: 'en',
      },
    },
  })
  ```
- After build, inspect `dist/sitemap-0.xml` for `<xhtml:link>` entries on every bilingual URL.
- Submit both the sitemap index and each language's page set to Search Console; verify the "International Targeting" report shows the correct hreflang clusters.

**Warning signs:**
- `<xhtml:link>` missing in `dist/sitemap-*.xml`
- Search Console International Targeting shows "no tags found"
- Non-default-locale pages never rank for their localized queries

**Phase to address:** **P7** (SEO hardening).

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keep `vendor/integration/` instead of inlining config loading | Zero code to write — `astrowind:config` already works | Any Astro 6.x minor bump risks breaking the virtual-module resolver silently; no upstream means no patches; surface area grows each time someone adds a config key | Acceptable through P1 only if P1 scope is already large; must be replaced by end of P3 (before i18n content-config work gets layered on top) |
| `output: 'static'` + Formspree (no server) | No server cost, no infra, no cold starts | Can't add server logic later (consent-logging, lead-scoring, CRM push) without rewiring; Formspree outage = no form submissions and no dead-letter queue | Acceptable permanently for Konvoi's sales motion; revisit only if form volume > 500/mo or CRM integration becomes hard-required |
| Keep AstroWind `@astrolib/seo` + `@astrolib/analytics` | They compile; no rewrite | Peer-dep range tops out at Astro 5; Astro 6 builds work by accident; any `<head>` regression strips OG/canonical site-wide (`CONCERNS.md` HIGH) | Never acceptable past P2 — replace both with small in-repo helpers in P2 |
| Hand-rolled minimal cookie banner | Fastest path to "we have a banner" | German enforcement is tight (DSK guidelines, EinwV April 2025); a DIY banner that doesn't log consent proof, doesn't offer equal-prominence reject, or loads analytics on page-view fails audit | Acceptable ONLY if paired with cookieless analytics (Plausible) so the banner is purely informational ("we use strictly necessary cookies") — not consent-gating anything |
| Single `post` collection, filter by locale field | One schema, two languages in one folder | Editor confusion: which locale am I editing? Missing translations don't surface. `src/pages/[...blog]/[...page].astro` has to filter at runtime | Acceptable if the translation-parity check (Pitfall 9) is enforced in CI; otherwise split into `post.de` / `post.en` collections |
| Skip tests for v1 marketing site | Delivery speed | During the AstroWind→Konvoi rewrite phase, silent regressions in links, images, and routes are near-certain (`CONCERNS.md` HIGH) | Acceptable for unit/component tests; NOT acceptable to skip link-check and `pnpm check` in CI |
| `img.shields.io` / Unsplash hosts in `astro.config.ts` image domains | Convenience while demo imagery is present | GDPR liability (EU visitor IPs to third parties); availability risk; off-brand | Never acceptable past P1 — remove all four whitelist entries when demo imagery is deleted |
| Inline SVG hero illustrations | One-file component, no asset pipeline | Payload bloat; each DE/EN page pair ships duplicate bytes (see Perf trap #3) | Acceptable for ≤2 KB decorative icons; use `<Image>` for anything larger |

---

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| **Netlify deploys** | Relying on "Netlify auto-noindexes previews" for all non-production URLs | Explicitly emit `<meta name="robots" content="noindex">` in `Layout.astro` when `import.meta.env.CONTEXT !== 'production'`; use `_headers` for `X-Robots-Tag` belt-and-braces (see Pitfall 7) |
| **Netlify redirects** | Mixing `_redirects` file with `netlify.toml` `[[redirects]]` — they both work but precedence isn't obvious, and Astro's i18n may add its own 302s in production that override `_redirects` | Pick ONE place (prefer `netlify.toml` — version-controlled with the rest of config). Document the language-root redirect (`/` → `/` DE vs `/` → `/en/` based on Accept-Language) explicitly; do NOT auto-redirect by Accept-Language header for the initial request (see Pitfall 11) |
| **Netlify Forms** | Form-name collisions between environments; `data-netlify="true"` on a Formspree-pointed form → Netlify tries to handle it too | Pick one backend (Formspree per `PROJECT.md`); never both. If Netlify Forms is a fallback, prefix form names with `konvoi-` and document in `CONVENTIONS.md` |
| **Netlify edge functions** | Trying to use edge functions with `output: 'static'` — they don't fire for prebuilt pages | Stay on `output: 'static'`; if you need request-time logic (geo redirect, consent session), switch to `output: 'hybrid'` AND add `@astrojs/netlify` adapter — a bigger decision than "just add an edge function" |
| **Formspree** | Default redirect-on-submit loses JS state; rate-limit on free tier (50/mo) silently drops submissions post-cap; no dead-letter if Formspree is down | Use AJAX submission with custom success/error UI; upgrade plan before launch; forward submissions to Heinz+Justus email as backup (Formspree supports this); log submission attempts to a second channel if possible |
| **Cloudflare Turnstile** | Embedding the `<script>` tag at page level for all pages — loads 30 KB of JS on home/product/etc where no form exists | Load Turnstile only on pages with a form (Contact, Pricing CTA modal, Funding pre-qual). Lazy-mount on form-focus if possible |
| **Google Maps** | Naive `<iframe>` embed fires pre-consent (see Pitfall 3) | Static screenshot + "Open in Google Maps" link for v1; click-to-load iframe if interactive map is needed later |
| **Plausible analytics** | Self-hosted install forgotten to update, vulnerable; or EU-cloud plan used without DPA | Use Plausible EU-cloud (DSGVO-compliant by default, signed DPA in dashboard); self-host only with a named maintainer |
| **Decap CMS (`public/decapcms/`)** | Leaving the scaffolding live with misconfigured backend (`CONCERNS.md` HIGH) | Delete `public/decapcms/` entirely in P1 — `PROJECT.md` out-of-scope confirms "no CMS" |
| **`@fontsource/*`** | Importing the font in multiple components → duplicate `@font-face` declarations and duplicate woff2 downloads | Import each font family once in `tailwind.css` (via `@import '@fontsource/montserrat/…'`) or in `src/layouts/Layout.astro`; never in individual components |
| **Astro `<Image>`** | Passing external URLs — requires `image.domains` whitelist, which is a DSGVO liability (Pitfall 8) | Import all images as local assets; Astro's `<Image>` handles optimization + self-hosting |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| **Hydrating every island client-side** | Large JS bundle (>100 KB on homepage); CWV INP > 200ms; Lighthouse Performance < 70 | Use `client:visible` / `client:idle` for anything below-the-fold; avoid `client:load` except for the language switcher and nav; prefer pure `.astro` components with zero JS for hero, features, testimonials; the ROI calculator is the one place a real island is justified — scope `client:visible` to that component only | First page with 2-3 `client:load` islands; trade-show month when organic traffic spikes |
| **Google Tag Manager as "temporary catch-all"** | Mobile LCP degrades from ~1.2s to 3s+ overnight; DSGVO audit ticket opened | Prefer Plausible snippet (1 KB, 1 request). If GTM is required (ad-pixel need), load via Partytown (`@astrojs/partytown` is already in deps but disabled in `astro.config.ts`); consent-gate strictly | The first ad campaign that asks for pixel installation |
| **Large SVGs imported inline** | HTML payload bloats (hero SVG of 40 KB inlined means every page-load re-downloads 40 KB); dark-mode variants doubled | For decorative SVGs > 8 KB, use `<Image src={svg}>` (Astro serves as `<img>` reference, cacheable); inline only icons < 2 KB | Hero illustration with gradients/shadows; use-case data-viz |
| **Hero video autoplay (from current site)** | 90s MP4 autoplays on mobile → blown bandwidth, CWV tanks, Safari autoplay policies kick in and some users see a static black frame | Replace with poster image + click-to-play; or 3-5s loop (no audio) < 1 MB; or animation/SVG sequence | Immediately — never ship the 90s autoplay to mobile |
| **Unoptimized hero image** | LCP > 2.5s; Lighthouse flags "largest contentful paint is an image not optimized" | Always wrap in `<Image>`; provide `widths` array matching `src/utils/images-optimization.ts` breakpoints; use `loading="eager"` + `fetchpriority="high"` on the hero only | First production deploy with a real hero photo |
| **15-breakpoint responsive images for all assets** | `src/utils/images-optimization.ts:42-58` defines 15 device sizes → every `<Image>` generates 15 variants at build time → builds slow and CDN bloats | Trim `deviceSizes` to 6-8 breakpoints (640, 828, 1080, 1280, 1920) for a marketing site | Once build time > 3 min on CI or `dist/_astro/` > 500 MB |
| **Blocking font downloads** | FOIT (invisible text) until Montserrat loads → LCP delayed; CLS jumps when fallback swaps | Use `@fontsource/montserrat` with `font-display: swap` (default); preload the main weight in `<head>`: `<link rel="preload" as="font" type="font/woff2" crossorigin href="/fonts/montserrat-400.woff2">` | First page with heading text above the fold |
| **7 use-case pages loading shared motion/shock/GPS data-viz as separate components** | Each page ships its own copy of the chart library → 7× waste | Build the data-viz widget as a single `.astro` component with `client:visible`, imported by all 7 pages — Astro dedupes the JS chunk | Once all 7 use-case pages ship |
| **ROI calculator over-engineered as React island** | ~40 KB React + state library on a page that could run on 200 lines of vanilla JS | Implement ROI calc as `<script>` block in the `.astro` page with plain DOM — no framework needed; inputs are 3-5 numbers, outputs are 2-3 numbers | P5 when the calc is specified |
| **Build time scaling with blog post count** | `pnpm build` goes from 30s to 2 min as posts accumulate (each post = 15 image variants + MDX render) | Batch-optimize post images once and commit optimized versions; prune the deviceSizes list for post imagery | When blog has > 30 posts |

Konvoi scale is small (<200 pages, B2B direct-sales traffic — expect 1k-10k visits/mo, not 1M). Runtime perf at launch is near-zero concern (static site, Netlify CDN). Build-time perf and first-render perf per page are the real targets.

---

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| **Leaving `public/decapcms/` in production** | Publicly accessible CMS admin at `/decapcms/` loading third-party JS from unpkg without SRI; if any auth provider is ever connected, remote code execution in repo-writing context (`CONCERNS.md` HIGH) | Delete `public/decapcms/` in P1 (confirmed out-of-scope in `PROJECT.md`) |
| **`img.shields.io` in image whitelist** | Dynamic SVG rendering from a third party; XSS if URL ever becomes user-controlled; availability risk (`CONCERNS.md` MEDIUM) | Remove `img.shields.io` from `astro.config.ts` `image.domains` when `Announcement.astro` is deleted |
| **Leaked AstroWind Google Search Console token** | `src/config.yaml:7` has onWidget's verification token; deploying with it gives onWidget (not Konvoi) verification of konvoi.eu (`CONCERNS.md` LOW) | Replace with Konvoi's verification token during P8 (launch); verify via Search Console dashboard |
| **MIT license shipped as the repo license** | Implies Konvoi open-sources its marketing site; legally odd for a private corporate asset | Replace `LICENSE.md` with "All rights reserved © KONVOI GmbH" in P1 |
| **Netlify Identity / git-gateway exposed with no auth** | If Decap is kept, misconfigured backends expose write access (`CONCERNS.md` HIGH) | Delete Decap; or if kept, pin to a known-good version with SRI and a real OAuth flow |
| **Contact form accepts arbitrary phone/email without validation** | Spammer dumps 1k submissions with malicious payloads; downstream systems (Heinz's inbox) render HTML in submissions | Server-side validation via Formspree's rules; escape all user input before rendering in notification emails (Formspree handles this; check settings) |
| **Trailer imagery reveals real customer license plates or logos** | Accidental disclosure of customer fleets; breach of NDAs; liability for Konvoi | Review all install-video frames and product imagery for license plates, DOT numbers, customer-logo stickers; blur or regenerate where needed |
| **Content Security Policy absent** | No defense-in-depth against injected scripts | Add `public/_headers` CSP — start with `script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src 'none'` — loosen only when specific needs arise (Turnstile, Plausible self-host) |
| **Open redirect in language switcher** | If the switcher accepts `?redirect=` or similar and doesn't validate, attacker phishes users via konvoi.eu-hosted redirect | Language switcher hard-codes routes by locale; never accepts query-param destinations |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| **Auto-redirect by Accept-Language on `/`** | German visitor on an English OS sees `/en/` — opposite of intent for a German-primary site; power users hate auto-redirects; Google bots see inconsistent content | Never auto-redirect on first visit. Render DE at `/`; offer a language switcher that remembers the choice in a cookie/localStorage. Show a small banner on `/en/` suggesting DE if the browser language is DE, but don't force it |
| **Language switcher hidden in footer** | Users don't find it; bounce on the wrong-locale page | Put the switcher in the primary nav (right-aligned, near the "Book consult" CTA) — `PROJECT.md` REQ-NAV-02 requires this. Use a compact "DE | EN" toggle, not a flag icon (German customers in EU hate flag-for-language) |
| **Language switcher doesn't preserve the current route** | User on `/en/product` clicks DE and lands on `/` home, losing context | Switcher maps `/en/product` ↔ `/produkt` via a route-translation map; fall back to locale root only if no mapping exists |
| **"Book a consult" CTA inconsistent across pages** | Primary conversion unclear; homepage says "Request individual exchange", pricing says "Contact us", contact page says "Send message" | Pick ONE CTA label per locale: DE "Beratung anfragen" / EN "Book a consult" (or "Request consultation") — codify in `src/data/brand/voice.md`. Every CTA button on the site that drives to the lead form uses exactly that label |
| **Form too long** | Consult-booking form asks fleet size + vertical + parking frequency + budget + current solution — user abandons | Minimal form: name, company, email, phone, one free-text "What's on your mind?". Everything else (fleet size, vertical) is qualification data captured on the call. ROI calc can optionally pass its result into the form as a hidden field |
| **Keyboard nav broken on language switcher / ROI calc / modal forms** | Accessibility lawsuits, German BITV 2.0 compliance gap, bad for older-browser users | P2 design system mandates keyboard-test for every interactive widget: Tab cycles through logically, Enter activates, Escape closes modals, focus trap in modal dialogs; language switcher opens with keyboard, arrow-keys navigate options |
| **Color contrast failing in dark mode on brand-color backgrounds** | WCAG 2.1 AA requires 4.5:1 for body, 3:1 for large text; brand primary on dark bg often fails | P2 design system runs Axe/Lighthouse a11y audit on every color pairing; document AA-failing combos in `CONVENTIONS.md` and forbid them |
| **Alt text missing on demo imagery / product diagrams** | Screen-reader users can't understand the motion/shock/GPS viz; Lighthouse a11y score drops | `src/components/common/Image.astro` already throws if `alt` is undefined (`CONVENTIONS.md`). Preserve this; never patch it with `alt=""` except for purely decorative images where explicit decorative-intent is documented |
| **ROI calc: no intermediate feedback** | User enters fleet size, nothing happens until "Calculate" button — feels broken | Update results live as numbers change (debounce 200ms); show "Based on your inputs, Konvoi saves you ~€X/yr" with a breakdown tooltip |
| **Date format inconsistency** (DE: `20.04.2026`, 24h `14:30`; EN: `April 20, 2026`, 12h `2:30 PM`) | Event dates in "Sep 5, 2026 14:00" look wrong to both audiences | Use `Intl.DateTimeFormat` with locale-appropriate options; centralize in `src/utils/i18n-date.ts`; never hand-format dates in components |
| **Currency formatting inconsistency** (DE: `€1.200`, EN: `€1,200`) | Pricing page appears to show different numbers to DE vs EN users | Same pattern: `Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })` vs `'en-DE'`; use `€` for both (Konvoi's market is EU) |
| **Missing focus-visible styles** | Tab key reveals no visible focus ring (removed via `outline: none` in reset) → unusable with keyboard | Keep Tailwind v4's default `focus-visible` styles; do NOT add `outline: none` globally |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Homepage:** hero renders, logos show — BUT verify: OG image is Konvoi (not AstroWind default.png), `<title>` is Konvoi + locale, canonical points at konvoi.eu, hreflang pairs present, preventive verb in H1
- [ ] **Product page:** copy written, imagery placed — BUT verify: no client-side JS unless needed, hero image optimized via `<Image>`, alarm-chain diagram has alt text, installation video uses a local poster or `youtube-nocookie.com`
- [ ] **Pricing page:** three tiers rendered — BUT verify: prices sourced from `canonical.yaml` (not hardcoded twice), DE/EN show identical numbers, "Book consult" CTA is the exact approved label, currency format locale-correct
- [ ] **ROI calculator:** inputs and outputs work — BUT verify: keyboard nav tested, results update live, accessible via screen reader, no external JS framework, passed values integrate with the consult form
- [ ] **Contact page:** form submits, map shows — BUT verify: DSGVO consent checkbox required, honeypot + Turnstile active, map is click-to-load (not naive iframe), two contacts (Justus + Heinz) with photos + direct phones, Impressum link, `/danke` confirmation page exists
- [ ] **Team page:** all bios present — BUT verify: 9 people rendered (not 7), localized bios in DE+EN, images under 200 KB each, photo alt text present, open-positions list filters by closed/open
- [ ] **Careers entries:** roles listed — BUT verify: mailto link opens correct applications inbox (Heinz), closed roles auto-hide by date field in collection
- [ ] **Events list on Contact:** upcoming-events show — BUT verify: past events auto-hide by end-date, dates locale-formatted, `LogiMAT`/`TAPA`/`IAA Transportation` etc. properly capitalized, venue + city + dates visible
- [ ] **Case studies:** customer logos render — BUT verify: quote attribution matches `current-site-overview.md` exactly (Katrin Sophie Schumacher, JJX Logistics, Greilmeier Spedition), customer approval on file for each published case study, no license-plate leaks in imagery
- [ ] **Blog `/aktuelles` (DE) + `/en/news` (EN):** posts render — BUT verify: no AstroWind canonicals, no demo posts left in `src/data/post/`, RSS feed locale-filtered, reading-time accurate, DE-only posts explicitly tagged
- [ ] **Legal pages:** `/impressum` + `/datenschutz` + EN `/imprint` + `/privacy` — BUT verify: Konvoi GmbH legal entity, real address, phone, HRB number, VAT ID, DSGVO officer contact, cookie table accurate (list every cookie the site actually sets), last-updated date current
- [ ] **Cookie banner:** shows on first visit — BUT verify: rejects as prominently as accepts, stores consent proof, does NOT fire analytics/fonts/maps pre-consent, re-opens via footer "Cookie-Einstellungen" link, works in DE+EN
- [ ] **Language switcher:** DE↔EN toggles — BUT verify: preserves current route (`/en/pricing` → `/preise`), works on every page, keyboard-navigable, persists choice
- [ ] **Sitemap:** file exists at `/sitemap-index.xml` — BUT verify: all URLs start with `https://www.konvoi.eu`, `<xhtml:link rel="alternate">` hreflang siblings present, no `.netlify.app` URLs, no demo routes, submitted to Search Console
- [ ] **robots.txt:** exists — BUT verify: points at the right sitemap, doesn't disallow anything important, preview deploys carry a different robots via `_headers`
- [ ] **Search Console:** verification token updated — BUT verify: Konvoi's token (not onWidget's), both DE and EN URL prefixes verified, or the domain property verified via DNS
- [ ] **Analytics:** Plausible/Matomo active — BUT verify: not firing pre-consent (if consent-gated), DPA signed, goal conversions configured (consult-form submit, funding-form submit)
- [ ] **Images:** demo Unsplash replaced — BUT verify: `astro.config.ts` `image.domains` is empty array, no `https://images.unsplash.com` strings in source, all hero/case-study images have license documentation
- [ ] **Fonts:** Montserrat + PT Serif loading — BUT verify: self-hosted (no `fonts.googleapis.com` string anywhere), licensed for web use (check Monotype/MyFonts terms for Konvoi's current brand licence), `font-display: swap` on all weights, preload the main weight
- [ ] **CI:** `pnpm check` green — BUT verify: post-build grep for `astrowind|arthelokyo|onwidget|Unsplash|Cupertino` returns nothing, link-check runs (lychee/linkinator), workflow uses pnpm (not the leftover `npm ci` from `.github/workflows/actions.yaml`)
- [ ] **Deploy:** Netlify preview loads — BUT verify: preview has noindex meta and `X-Robots-Tag: noindex` header, sitemap on preview does not leak prod URLs, Formspree on preview either disabled or points to a test form to avoid polluting the real inbox

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| **AstroWind canonical leaked in posts** | LOW | Fix frontmatter in the four posts; redeploy; in Search Console, submit URL removal for the leaked URLs; update the sitemap; check back in 2 weeks for coverage |
| **Preview URL indexed by Google** | LOW-MEDIUM | Add `noindex` meta + redeploy; submit URL removal in Search Console; add a 301 from the preview URL to production canonical if the preview is on a predictable domain; monitor |
| **DSGVO violation (pre-consent Google Fonts/Maps)** | MEDIUM-HIGH | Immediately remove the offending embed + redeploy; audit the source tree; engage a DSGVO lawyer if an Abmahnung has been issued; document the fix timeline; if fined, the timeline-of-fix matters for penalty reduction |
| **Content drift DE vs EN** | LOW | Audit the delta (diff by translationKey); write missing translations; ship in one PR; add the parity-check script if not yet present |
| **Spam flooding forms** | LOW | Enable Turnstile if not on; rotate honeypot field name; Formspree's Submissions page allows manual blocklisting; upgrade plan if rate-limited |
| **Broken canonical/hreflang site-wide** | MEDIUM | Fix `Metadata.astro`; redeploy; resubmit sitemap; Search Console "Validate fix" on the International Targeting report; expect 4-8 weeks to reindex |
| **Wrong Google Search Console verification token** | LOW | Update `src/config.yaml`; redeploy; re-verify in Search Console; old verification silently expires |
| **Theme flicker reintroduced** | LOW | Revert `ApplyColorMode.astro` changes to PR #646 baseline; document the invariant; do not deduplicate the inline script |
| **Tailwind v4 dark mode broken** | LOW | Restore `@custom-variant dark (&:where(.dark, .dark *))`; run visual smoke test; document the line in `CONVENTIONS.md` |
| **Form submissions silently dropping** | MEDIUM | Check Formspree rate limit and plan; check Turnstile threshold (sometimes rejects real users from privacy-browsers); add a second notification channel (Resend API, email to both contacts); announce incident to sales |
| **Customer logo used without permission (case study)** | HIGH | Remove immediately; internal retrospective on approval process; outreach to the customer with an apology; re-negotiate case-study approval before republishing |
| **Cookie banner fires analytics pre-consent** | HIGH (DSGVO) | Immediately remove analytics loader from base layout; gate behind consent event; redeploy; if an Abmahnung is received, document the 24-48h fix window (mitigates penalty); engage lawyer |
| **Case study quotes reworded without customer sign-off** | HIGH | Pull the page; re-verify wording with the named customer; republish only with written approval |
| **Team member leaves, photo/bio still on page** | LOW | Remove in next PR; add a simple "active: true" field to the team collection so ex-team members can be hidden without deleting the markdown file |
| **Impressum out of date (wrong address, old HRB)** | MEDIUM | Update immediately — stale Impressum is a UWG violation in Germany; in audit logs note the date of correction |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| AstroWind debris in production | P1 Foundation scrub | `grep -rE "astrowind\|arthelokyo\|onwidget\|Unsplash\|Cupertino" dist/` returns nothing; build-time check in CI |
| Tailwind v4 dark-mode variant broken | P2 Design system | Visual smoke test in light/dark/system; `@custom-variant dark` has explicit comment |
| Color contrast failures | P2 Design system | Axe audit on home DE, home EN, pricing, one blog post; all AA |
| Missing focus-visible + keyboard nav | P2 Design system + P5 Forms + P6 Contact | Keyboard-only walkthrough of every page; tab order logical |
| Default-locale canonical/hreflang missing | P3 i18n routing | Post-build sitemap inspection for `<xhtml:link>`; view-source of `/` and `/en/` shows reciprocal hreflang |
| Content drift DE vs EN | P3 i18n + every content PR | Translation-parity check script in CI; PR template checkbox |
| Self-hosted fonts (no Google Fonts CDN) | P2 Design system | `grep -r "fonts.googleapis.com" src/ dist/` returns nothing |
| Preventive-vs-reactive drift | P4 Core marketing pages + every copy PR | H1 glossary check; banned-verb scan |
| Large hero images unoptimized | P4 Core marketing pages | Lighthouse Performance > 90 on home; LCP < 2s on cable |
| Too much client JS (islands overused) | P4 + P5 | No `client:load` outside of language switcher + ROI calc; total transferred JS on home < 100 KB |
| ROI calculator a11y + bundle size | P5 Pricing + ROI | Plain `.astro` + inline script; keyboard test; < 5 KB added |
| Forms without spam protection | P5 Forms | Formspree settings screenshot in PR; honeypot + Turnstile verified live |
| Forms without DSGVO consent | P5 Forms | Consent checkbox required, unchecked by default, links to `/datenschutz` |
| Newsletter without double-opt-in | P5 Forms (if scoped) | Test submit → receives confirmation email → click → subscribed |
| Case-study unauthorized quotes | P6 Case Studies | Written approval archived per customer; PR references approval file |
| Customer imagery leaks license plates | P6 Case Studies | Image review checklist; `exiftool` strip before publish |
| Blog AstroWind canonicals | P1 (delete posts) + P6 (first real posts) | `grep -r "astrowind.vercel.app" src/` returns nothing |
| Events past-date stale | P6 Events | Runtime filter by end date; verified in P8 pre-launch |
| Trust asks dropped (logos, address, contacts) | P4 Home + P6 Contact | Pre-launch checklist + stakeholder review |
| Maps embed pre-consent | P6 Contact + P7 Consent | No `<iframe src="google.com">` in source; click-to-load pattern |
| Cookie banner fires analytics pre-consent | P7 SEO/Analytics/Consent | Network tab on fresh private-window visit shows zero third-party requests until consent |
| CMP equal-prominence reject button | P7 Consent | Legal review; screenshot archived |
| Sitemap missing locale alternates | P7 SEO | `dist/sitemap-0.xml` has `<xhtml:link>` tags |
| Netlify preview indexed | P1 `_headers` + P7 verification + P8 launch | `site:netlify.app konvoi` query returns nothing |
| CI missing link-check + grep | P1 CI setup | Workflow has lychee + grep; both fail on regressions |
| Wrong Google Search Console token | P8 Launch | Verification passes in Konvoi's account |
| Font-licensing (Montserrat + PT Serif) not confirmed | P1 or P2 | Licensing PDF archived in `docs/licensing/` |
| Impressum + Datenschutz outdated | P7 + every quarter post-launch | Legal review; last-updated date rendered |
| DNS cutover leaves old Jimdo content live | P8 Launch | 301 redirects for every Jimdo URL to Konvoi equivalent; crawl both before DNS swap |
| Broken anchor links from old Jimdo URLs | P8 Launch | `src/pages/_redirects` (or `netlify.toml`) covers every old slug; linkcheck against wayback-snapshot URL list |

---

## Sources

- [Upgrade to Astro v6 — official docs](https://docs.astro.build/en/guides/upgrade-to/v6/) — ClientRouter removal, Zod 4 changes, Node 18/20 drop, `Astro.glob()` removed
- [Astro 6 Beta blog post (astro.build)](https://astro.build/blog/astro-6-beta/)
- [Astro Internationalization (i18n) Routing — official docs](https://docs.astro.build/en/guides/internationalization/) — `prefixDefaultLocale`, routing strategies
- [Tailwind CSS v4 Upgrade guide — official docs](https://tailwindcss.com/docs/upgrade-guide) — `@utility`, `@custom-variant`, dark-mode changes, `bg-linear-to-*` rename
- [Tailwindlabs Discussion #16517 — v4 Missing Defaults, Broken Dark Mode, Config Issues](https://github.com/tailwindlabs/tailwindcss/discussions/16517)
- [Tailwindlabs Issue #16171 — v4 upgrade does not work for dark mode variant with media query](https://github.com/tailwindlabs/tailwindcss/issues/16171)
- [Stop search indexing for Netlify Deploy Previews and Branch Deploys — tempertemper.net](https://www.tempertemper.net/blog/stop-search-indexing-for-netlify-deploy-previews-and-branch-deploys)
- [Netlify Deploy overview — X-Robots-Tag noindex on non-production deploys](https://docs.netlify.com/site-deploys/overview/)
- [Netlify Forms spam filters + honeypot](https://docs.netlify.com/manage/forms/spam-filters/)
- [Formspree honeypot spam filtering](https://help.formspree.io/hc/en-us/articles/360013580813-Honeypot-spam-filtering)
- [Formspree Cloudflare Turnstile integration](https://help.formspree.io/hc/en-us/articles/46614263949331-Protecting-your-Forms-with-Cloudflare-Turnstile)
- [Google Fonts GDPR compliance — Usercentrics, risks and solutions](https://usercentrics.com/knowledge-hub/google-fonts-gdpr-compliant/)
- [Munich District Court 2022 ruling context — PrivacyChecker 2026](https://privacychecker.pro/blog/google-fonts-gdpr-compliant)
- [Cookie Consent Germany: TTDSG & DSGVO Rules (Kukie.io)](https://kukie.io/blog/cookie-consent-germany-ttdsg-dsgvo)
- [GDPR Compliance: German DSK Cookie Consent Guidelines (Secure Privacy)](https://secureprivacy.ai/blog/german-dsk-cookie-consent-guidelines)
- [Avoid DSGVO Warnings in 2026: BGH Rulings, Cost Traps (SecurityToday)](https://www.securitytoday.de/en/2026/03/24/avoid-dsgvo-warnings-in-2026-bgh-rulings-cost-traps-and-practical-checklist/)
- [Hreflang Implementation Guide 2026 (Linkgraph)](https://www.linkgraph.com/blog/hreflang-implementation-guide/)
- [i18n SEO: hreflang, locale URLs, multilingual rankings](https://better-i18n.com/en/blog/i18n-seo-hreflang-locale-urls-guide/)
- Project-internal: `.planning/PROJECT.md` — requirements, constraints, key decisions
- Project-internal: `.planning/current-site-overview.md` — Jimdo site snapshot 2026-04-20
- Project-internal: `.planning/codebase/CONCERNS.md` — severity-ranked debt list, authoritative on AstroWind debris and vendor concerns
- Project-internal: `.planning/codebase/STACK.md` — confirmed Astro 6.1.8 / Tailwind 4.2.2 / pnpm 10 / Node 22+24
- Project-internal: `.planning/codebase/CONVENTIONS.md` — Tailwind v4 `@custom-variant dark` usage, image alt-text enforcement, color-mode script invariants

---
*Pitfalls research for: Bilingual B2B marketing site — Astro 6 + Tailwind 4 + Netlify + DSGVO market*
*Researched: 2026-04-20*
