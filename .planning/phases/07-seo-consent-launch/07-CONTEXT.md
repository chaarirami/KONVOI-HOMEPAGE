# Phase 7: SEO, Consent & Launch - Context

**Gathered:** 2026-04-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the site legally shippable in Germany, SEO-correct for bilingual indexing, and deploy to Netlify with DNS cutover from Jimdo. No new features — infrastructure, legal, and deployment only.

</domain>

<decisions>
## Implementation Decisions

### Legal Pages
- **D-01:** `/impressum/` uses German slug for both DE and EN locales. Full company data provided: KONVOI GmbH, Harburger Schlossstrase 6-12, 21079 Hamburg, Geschaeftsfuehrer Alexander Jagielo + Heinz Luckhardt, HRB 168019, USt-IdNr DE347608487, Verantwortlich gemas SS 18 MStV: Heinz Luckhardt. Include Universalschlichtungsstelle and Bildnachweise sections.
- **D-02:** `/datenschutz/` uses German slug for both locales. Adapt existing Jimdo Datenschutz text with these changes: remove Jimdo Consent Manager, Jimdo Tracking, Google Analytics, Versandabwicklung, Zahlungsabwicklung sections (no e-commerce). Add processors: Netlify (hosting/CDN), Web3Forms (form submission), Cloudflare Turnstile (bot protection), Rybbit (self-hosted cookieless analytics), Cal.eu (external booking link). Replace consent tool reference with vanilla-cookieconsent v3. Keep general DSGVO framework, Betroffenenrechte, social media section (LinkedIn only).
- **D-03:** No Datenschutzbeauftragter required (< 20 employees).

### Cookie Consent
- **D-04:** Use vanilla-cookieconsent v3 with DE + EN translations. Two categories only: Essential (Cloudflare/Turnstile — always on) and Functional (Google Maps, YouTube embeds — consent-gated). No Performance or Marketing categories.
- **D-05:** Rybbit analytics is cookieless — NOT in consent banner, loads unconditionally.
- **D-06:** Contact page Maps already uses click-to-load pattern — cookie consent gates the actual Google Maps script/iframe loading. Banner appears sitewide but Functional category only matters on pages with Maps/YouTube.

### Analytics
- **D-07:** Use Rybbit (https://github.com/rybbit-io/rybbit) instead of Plausible. Self-hosted. Cookieless, privacy-first — no consent banner needed. CSP must allow the self-hosted Rybbit domain.
- **D-08:** Rybbit script snippet goes in Layout.astro head, loads on every page.

### SEO Infrastructure
- **D-09:** Metadata.astro already handles hreflang/canonical. Verify and fix if needed — must emit per-page `<link rel="canonical">` + three `<link rel="alternate" hreflang>` (de, en, x-default → DE).
- **D-10:** Configure @astrojs/sitemap with i18n block for `<xhtml:link>` locale alternates.
- **D-11:** Schema.org structured data: Organization, LocalBusiness, Product, FAQPage where applicable. Use JSON-LD in head.
- **D-12:** Per-locale OG + Twitter card images for homepage + key landing pages.

### Deployment & DNS
- **D-13:** Fresh Netlify setup — configure netlify.toml (build command, publish dir, headers). User connects konvoi.eu domain in Netlify dashboard during execution.
- **D-14:** Minimal Jimdo redirect mapping only — old site has minimal SEO value. Catch obvious paths (homepage, /die-loesung, /kontakt, etc.) with 301s but no exhaustive crawl.
- **D-15:** CSP in public/_headers must allow: Web3Forms (api.web3forms.com), Cloudflare Turnstile (challenges.cloudflare.com), Cal.eu (cal.eu), Rybbit (self-hosted domain TBD), self-hosted fonts. Remove Formspree allowance.
- **D-16:** Post-launch: Search Console International Targeting for DE + EN. Verify site:netlify.app returns zero indexed pages.

### Claude's Discretion
- OG image generation approach (static assets vs dynamic generation)
- Schema.org structured data placement (per-page vs global)
- Exact CSP directives (script-src, connect-src, etc.)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Legal
- `src/data/brand/canonical.yaml` — Company identity data
- Impressum text provided verbatim in 07-CONTEXT.md discussion (D-01)
- Existing Datenschutz text from Jimdo provided in discussion (D-02)

### SEO
- `src/components/common/Metadata.astro` — Current hreflang/canonical implementation
- `src/i18n/routeMap.ts` — Route mapping for locale alternates
- `astro.config.ts` — Sitemap integration (line 7, 26)

### Deployment
- `netlify.toml` — Existing Netlify config
- `public/_headers` — Existing CSP headers

### Analytics
- `https://github.com/rybbit-io/rybbit` — Rybbit analytics (self-hosted)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Metadata.astro` — Already handles hreflang, canonical, OG meta. Needs i18n verification.
- `PageLayout.astro` — Standard layout, analytics snippet goes here.
- `vanilla-cookieconsent` — Not yet installed, needs npm add.
- `netlify.toml` — Already exists with basic config.
- `public/_headers` — Already exists, needs CSP tuning.

### Established Patterns
- i18n: DE at `/`, EN at `/en/` (Phase 3)
- Forms use Web3Forms + Turnstile (Phase 5) — CSP must reflect this
- Cal.eu booking link on thank-you pages (Phase 5)
- Click-to-load Maps on contact page (Phase 6)

### Integration Points
- Layout.astro head: Rybbit script, cookie consent script
- PageLayout.astro: OG meta, Schema.org JSON-LD
- netlify.toml: redirects, headers, build config
- public/_headers: CSP directives
- Footer: cookie settings link for vanilla-cookieconsent

</code_context>

<specifics>
## Specific Ideas

- Impressum and Datenschutz verbatim text provided by user — use as-is with adaptations noted in D-01 and D-02
- Bildnachweise section from Impressum may need updating if stock images changed since Jimdo
- Cookie consent banner should have a "Cookie-Einstellungen" link in footer per existing Jimdo pattern

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-seo-consent-launch*
*Context gathered: 2026-04-26*
