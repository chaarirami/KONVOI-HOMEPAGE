# Phase 7: SEO, Consent & Launch — Research

**Researched:** 2026-04-26
**Domain:** SEO infrastructure, DSGVO consent, analytics, legal pages, Netlify deployment
**Confidence:** HIGH (all key library APIs verified; CSP domains verified from official sources)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** `/impressum/` uses German slug for both locales. Company: KONVOI GmbH, Harburger Schlossstrasse 6-12, 21079 Hamburg. GF: Alexander Jagielo + Heinz Luckhardt. HRB 168019. USt-IdNr DE347608487. Verantwortlich: Heinz Luckhardt. Includes Universalschlichtungsstelle + Bildnachweise sections.
- **D-02:** `/datenschutz/` uses German slug for both locales. Adapt existing Jimdo Datenschutz: remove Jimdo/GA/e-commerce sections; add Netlify, Web3Forms, Cloudflare Turnstile, Rybbit (self-hosted cookieless), Cal.eu. Replace consent tool reference with vanilla-cookieconsent v3. Keep DSGVO framework, Betroffenenrechte, LinkedIn.
- **D-03:** No Datenschutzbeauftragter required (< 20 employees).
- **D-04:** vanilla-cookieconsent v3 with DE + EN translations. Two categories only: Essential (Cloudflare/Turnstile — always on) and Functional (Google Maps, YouTube embeds — consent-gated). No Performance or Marketing categories.
- **D-05:** Rybbit is cookieless — NOT in consent banner, loads unconditionally.
- **D-06:** Contact page Maps uses click-to-load pattern; cookie consent gates actual Maps script/iframe. Banner appears sitewide.
- **D-07:** Use Rybbit (https://github.com/rybbit-io/rybbit) self-hosted. Cookieless, privacy-first — no consent banner needed. CSP must allow the self-hosted Rybbit domain (TBD).
- **D-08:** Rybbit script snippet goes in Layout.astro head, loads on every page.
- **D-09:** Metadata.astro already handles hreflang/canonical. Verify and fix if needed — must emit per-page `<link rel="canonical">` + three `<link rel="alternate" hreflang>` (de, en, x-default → DE).
- **D-10:** Configure @astrojs/sitemap with i18n block for `<xhtml:link>` locale alternates.
- **D-11:** Schema.org structured data: Organization, LocalBusiness, Product, FAQPage where applicable. Use JSON-LD in head.
- **D-12:** Per-locale OG + Twitter card images for homepage + key landing pages.
- **D-13:** Fresh Netlify setup — configure netlify.toml. User connects konvoi.eu domain in dashboard.
- **D-14:** Minimal Jimdo redirect mapping only. Catch obvious paths (homepage, /die-loesung, /kontakt, etc.) with 301s — no exhaustive crawl.
- **D-15:** CSP must allow: Web3Forms (api.web3forms.com), Cloudflare Turnstile (challenges.cloudflare.com), Cal.eu (cal.eu), Rybbit (self-hosted domain TBD), self-hosted fonts. Remove Formspree allowance.
- **D-16:** Post-launch: Search Console International Targeting for DE + EN. Verify site:netlify.app returns zero indexed pages.

### Claude's Discretion

- OG image generation approach (static assets vs dynamic generation)
- Schema.org structured data placement (per-page vs global)
- Exact CSP directives (script-src, connect-src, etc.)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | Metadata.astro emits per-page canonical + three hreflang alternates (de, en, x-default → DE) | Section: Architecture Patterns / Hreflang |
| SEO-02 | @astrojs/sitemap configured with i18n block for xhtml:link locale alternates | Section: Standard Stack / Sitemap i18n |
| SEO-03 | Per-locale OG + Twitter card images for homepage + key landing pages | Section: Architecture Patterns / OG Images |
| SEO-04 | Schema.org JSON-LD: Organization, LocalBusiness, Product, FAQPage | Section: Architecture Patterns / Schema.org |
| SEO-05 | Rybbit analytics snippet in Layout.astro (cookieless, no banner) | Section: Standard Stack / Rybbit |
| SEO-06 | vanilla-cookieconsent v3 with DE+EN translations gating Maps + YouTube | Section: Standard Stack / Cookie Consent |
| SEO-07 | /impressum/ (German slug both locales) per §5 TMG | Section: Architecture Patterns / Legal Pages |
| SEO-08 | /datenschutz/ (German slug both locales) per DSGVO Art. 13 + TTDSG/TDDDG | Section: Architecture Patterns / Legal Pages |
| SEO-09 | CSP in public/_headers allowing only whitelisted third parties | Section: Architecture Patterns / CSP |
| DEPLOY-01 | netlify.toml with build command, publish dir, headers | Section: Architecture Patterns / Netlify |
| DEPLOY-02 | _redirects covers every old Jimdo URL with 301 | Section: Architecture Patterns / Redirects |
| DEPLOY-03 | DNS cutover konvoi.eu + www.konvoi.eu to Netlify | Section: Architecture Patterns / DNS |
| DEPLOY-04 | Search Console International Targeting verified DE + EN | Section: Common Pitfalls |
| DEPLOY-05 | site:netlify.app konvoi returns zero indexed pages | Section: Common Pitfalls |

</phase_requirements>

---

## Summary

Phase 7 is the launch gate for konvoi.eu. It has four distinct technical tracks that must all ship together: (1) SEO infrastructure — hreflang, sitemap, Schema.org JSON-LD, OG images; (2) DSGVO consent — vanilla-cookieconsent v3 gating only Google Maps and YouTube, with Rybbit loading unconditionally as a cookieless tracker; (3) legal pages — Impressum and Datenschutz at German slugs for both locales; and (4) deployment — Netlify headers, CSP hardening, Jimdo redirect mapping, DNS cutover.

The biggest implementation risk is vanilla-cookieconsent v3 with Astro's `<ClientRouter>` (View Transitions). The library appends its banner to `document.body`, which Astro swaps on client-side navigation — causing the banner to disappear or become unresponsive after the first page transition. The solution is to use `is:inline` script loading with the `astro:after-swap` event to reinitialize on each swap, or to use `transition:persist` on the consent element. Both approaches are documented in community StackBlitz examples.

The second track-specific risk is the sitemap i18n configuration. `@astrojs/sitemap` v3.7.2 auto-generates `<xhtml:link>` alternates when the `i18n` block is present, but it does NOT emit `x-default` — that must be handled in `Metadata.astro` via a manually emitted `<link>` tag. The existing `Metadata.astro` uses `@astrolib/seo` which does not emit hreflang tags at all — this component must be rewritten or supplemented with direct `<link>` tag emission.

**Primary recommendation:** Replace the `@astrolib/seo` wrapper in `Metadata.astro` with direct `<link>` and `<meta>` tag emission. This gives full control over canonical, hreflang, OG, and Twitter card output without a dependency that abstracts away the exact markup needed.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `vanilla-cookieconsent` | 3.1.0 | DSGVO consent banner, category gating | Industry standard for lightweight self-hosted consent; 3.x rewrites the API cleanly; no CMP vendor lock-in |
| `@astrojs/sitemap` | 3.7.2 (already installed) | Sitemap with xhtml:link hreflang alternates | Official Astro integration; native i18n block in v3+ |
| Rybbit script tag | n/a (self-hosted) | Cookieless pageview analytics | Self-hosted, AGPL, no cookies/localStorage — legally clean for DE market |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@astrolib/seo` | 1.0.0-beta.8 (already installed) | Currently used in Metadata.astro | Already installed but insufficient for hreflang — supplement with raw `<link>` tags |
| `sharp` | 0.34.5 (already installed) | Static OG image generation | Use with Astro's `getImage()` for pre-generating OG images at build time |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `vanilla-cookieconsent` | `@jop-software/astro-cookieconsent` | The Astro wrapper doesn't support JS callbacks, which are needed for conditional Maps loading. Use vanilla-cookieconsent directly. |
| Static OG images | Dynamic `@vercel/og` / Satori | Satori requires an SSR endpoint; this is a static site. Pre-generated PNGs in `public/` are simpler and faster to build. |
| Raw `<link>` hreflang tags | `astro-seo` package | astro-seo v2 adds hreflang support, but adds a dependency. Direct `<link>` emission in Metadata.astro is zero-dependency and explicit. |

**Installation:**
```bash
pnpm add vanilla-cookieconsent
```

`@astrojs/sitemap` and `sharp` are already in `package.json`. No other new packages are required.

**Version verification:**
- `vanilla-cookieconsent`: 3.1.0 — published 2025-02-04 [VERIFIED: npm registry]
- `@astrojs/sitemap`: 3.7.2 — confirmed [VERIFIED: npm registry]

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/common/
│   ├── Metadata.astro          # Rewrite: emit canonical + hreflang + OG + Twitter tags directly
│   ├── Analytics.astro         # Add Rybbit script tag (is:inline, async)
│   └── CookieConsent.astro     # New: vanilla-cookieconsent v3 init + DE/EN translations
├── layouts/
│   └── Layout.astro            # Add <CookieConsent /> in <head>
├── pages/
│   ├── impressum.astro         # DE Impressum (serves both locales per D-01)
│   ├── datenschutz.astro       # DE Datenschutz (serves both locales per D-02)
│   ├── en/
│   │   ├── impressum.astro     # EN — renders same content, canonical → /impressum/
│   │   └── datenschutz.astro   # EN — renders same content, canonical → /datenschutz/
│   └── [...all other pages]
├── data/brand/
│   └── canonical.yaml          # Already exists — used for Schema.org JSON-LD
└── public/
    ├── _headers                # CSP + cache headers (Netlify)
    ├── _redirects              # Jimdo → Konvoi 301 mapping
    └── og/
        ├── home-de.png         # 1200×630 OG image (DE homepage)
        ├── home-en.png         # 1200×630 OG image (EN homepage)
        └── [key-page]-[locale].png
```

---

### Pattern 1: Hreflang + Canonical in Metadata.astro

**What:** Replace `@astrolib/seo` hreflang handling with explicit `<link>` tags emitted directly. The current `Metadata.astro` uses `AstroSeo` which does not emit `<link rel="alternate" hreflang>` tags at all — it only covers `og:locale`.

**When to use:** Every page. The three tags are always required: `rel="canonical"`, `hreflang="de"`, `hreflang="en"`, `hreflang="x-default"` (pointing to DE URL).

**Pattern:**
```astro
---
// In Metadata.astro — new hreflang block
// Props: canonicalDE (string), canonicalEN (string), canonical (string)
const siteBase = 'https://www.konvoi.eu';
---
<link rel="canonical" href={canonical} />
<link rel="alternate" hreflang="de" href={`${siteBase}${canonicalDE}`} />
<link rel="alternate" hreflang="en" href={`${siteBase}${canonicalEN}`} />
<link rel="alternate" hreflang="x-default" href={`${siteBase}${canonicalDE}`} />
```

Pages pass their DE/EN paths from `routeMap.ts` to resolve the counterpart URL. For pages not in the route map (e.g., blog posts with dynamic slugs), use the Astro `Astro.url.pathname` + a `/en/` prefix convention.

**Source:** [CITED: https://docs.astro.build/en/guides/internationalization/]

---

### Pattern 2: @astrojs/sitemap i18n Configuration

**What:** The `i18n` block in sitemap config causes the integration to emit `<xhtml:link rel="alternate">` entries inside each `<url>` block. The `defaultLocale` must match a key in `locales`.

**When to use:** Required for SEO-02. Configure once in `astro.config.ts`.

**Example:**
```typescript
// astro.config.ts
sitemap({
  i18n: {
    defaultLocale: 'de',
    locales: {
      de: 'de-DE',
      en: 'en-US',
    },
  },
}),
```

**Resulting sitemap output:**
```xml
<url>
  <loc>https://www.konvoi.eu/</loc>
  <xhtml:link rel="alternate" hreflang="de-DE" href="https://www.konvoi.eu/"/>
  <xhtml:link rel="alternate" hreflang="en-US" href="https://www.konvoi.eu/en/"/>
</url>
```

**Critical caveat:** `@astrojs/sitemap` does NOT emit `hreflang="x-default"`. That must be in the `<head>` of each page (Pattern 1 above), not in the sitemap. Sitemap hreflang alternates are a supplementary signal — the `<head>` tags are the primary signal Google uses.

**Also required:** The `site` property must be set in `astro.config.ts` (e.g., `site: 'https://www.konvoi.eu'`) — without it, sitemap generation fails or uses localhost.

**Source:** [CITED: https://docs.astro.build/en/guides/integrations-guide/sitemap/]

---

### Pattern 3: vanilla-cookieconsent v3 Integration

**What:** Self-hosted cookie consent banner with DE+EN translations. Two categories: `necessary` (always enabled, readOnly) and `functional` (opt-in, gates Maps + YouTube). Initialized once in a `CookieConsent.astro` component loaded from `Layout.astro`.

**View Transitions pitfall (CRITICAL):** Astro's `<ClientRouter>` swaps `document.body` on navigation. Because vanilla-cookieconsent appends its DOM to `document.body`, the banner disappears after the first client-side navigation. The fix is to use `is:inline` with an `astro:after-swap` listener.

**Pattern:**
```astro
<!-- src/components/common/CookieConsent.astro -->
<link rel="stylesheet" href="/cc.css" />
<script is:inline>
  // Loaded once; re-runs after each Astro View Transition swap
  function initCC() {
    if (typeof CookieConsent === 'undefined') return;
    CookieConsent.run({
      categories: {
        necessary: { enabled: true, readOnly: true },
        functional: { enabled: false },
      },
      language: {
        default: document.documentElement.lang === 'de' ? 'de' : 'en',
        autoDetect: 'document',
        translations: {
          de: {
            consentModal: {
              title: 'Wir nutzen Cookies',
              description: 'Wir verwenden nur technisch notwendige Cookies. Optionale Cookies laden Google Maps für unsere Kontaktseite.',
              acceptAllBtn: 'Alle akzeptieren',
              acceptNecessaryBtn: 'Nur notwendige',
              showPreferencesBtn: 'Einstellungen',
            },
            preferencesModal: {
              title: 'Cookie-Einstellungen',
              acceptAllBtn: 'Alle akzeptieren',
              acceptNecessaryBtn: 'Nur notwendige',
              savePreferencesBtn: 'Speichern',
              sections: [
                {
                  title: 'Notwendige Cookies',
                  description: 'Cloudflare Turnstile (Bot-Schutz bei Formularen). Immer aktiv.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Funktionale Cookies',
                  description: 'Google Maps auf unserer Kontaktseite. Nur nach Ihrer Zustimmung.',
                  linkedCategory: 'functional',
                },
              ],
            },
          },
          en: {
            consentModal: {
              title: 'We use cookies',
              description: 'We only use technically necessary cookies. Optional cookies load Google Maps on our contact page.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Necessary only',
              showPreferencesBtn: 'Manage preferences',
            },
            preferencesModal: {
              title: 'Cookie Preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Necessary only',
              savePreferencesBtn: 'Save preferences',
              sections: [
                {
                  title: 'Necessary Cookies',
                  description: 'Cloudflare Turnstile (bot protection on forms). Always active.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Functional Cookies',
                  description: 'Google Maps on our contact page. Only with your consent.',
                  linkedCategory: 'functional',
                },
              ],
            },
          },
        },
      },
    });
  }
  document.addEventListener('astro:after-swap', initCC);
</script>
<script src="/cookieconsent.umd.js" is:inline onload="initCC()"></script>
```

**Recommended self-hosting approach:** Copy `node_modules/vanilla-cookieconsent/dist/cookieconsent.umd.js` and `cookieconsent.css` to `public/` during build (via a small `package.json` postbuild script or by referencing them from `node_modules` path). Alternatively import directly in a `<script>` tag referencing the npm package — Astro will bundle it. Using ESM import (`import * as CookieConsent from 'vanilla-cookieconsent'`) in an Astro component script block is the cleanest approach but requires careful handling of the `is:inline` requirement for the `astro:after-swap` listener.

**Cleanest approach for this project:**
```astro
<script>
  import * as CookieConsent from 'vanilla-cookieconsent';
  import 'vanilla-cookieconsent/dist/cookieconsent.css';

  function init() {
    CookieConsent.run({ /* config */ });
  }
  // Re-init after View Transition swaps
  document.addEventListener('astro:after-swap', init);
  init();
</script>
```
This lets Astro bundle the script. The `astro:after-swap` handler re-runs `run()` — vanilla-cookieconsent v3 is idempotent on re-run if consent was already given (it restores state from the cookie).

**Source:** [CITED: https://github.com/orestbida/cookieconsent/issues/814], [CITED: https://cookieconsent.orestbida.com/essential/getting-started.html]

---

### Pattern 4: Conditional Maps Loading via Cookie Consent

**What:** The contact page already uses click-to-load Maps (Phase 6). Cookie consent adds a second gate: the "Load map" button should only be active if functional cookies are accepted, OR clicking it triggers the consent modal first.

**Pattern:**
```typescript
// In the contact page Maps island / component
import * as CookieConsent from 'vanilla-cookieconsent';

function loadMap() {
  if (CookieConsent.acceptedCategory('functional')) {
    // inject iframe / load Maps API
    initGoogleMaps();
  } else {
    // Show consent modal, then load map after acceptance
    CookieConsent.showPreferencesModal();
    document.addEventListener('cc:onChange', (e: any) => {
      if (e.detail.changedCategories.includes('functional') &&
          CookieConsent.acceptedCategory('functional')) {
        initGoogleMaps();
      }
    }, { once: true });
  }
}
```

**Source:** [CITED: https://cookieconsent.orestbida.com/reference/configuration-reference.html]

---

### Pattern 5: Rybbit Analytics Script

**What:** Self-hosted Rybbit instance. The tracking snippet is a single async `<script>` tag with `data-site-id`. No cookies, no localStorage — fingerprinting-based. Loads unconditionally on every page (D-05, D-08).

**Snippet:**
```html
<!-- Replace app.rybbit.io with your self-hosted Rybbit domain -->
<script
  src="https://YOUR_RYBBIT_DOMAIN/api/script.js"
  async
  data-site-id="YOUR_SITE_ID"
></script>
```

Place this in `Analytics.astro` (already loaded from `Layout.astro` head). Since the Rybbit domain is TBD (self-hosted instance not yet deployed), the planner should note this as a configuration step during execution.

**CSP:** Add `script-src` and `connect-src` entries for `https://YOUR_RYBBIT_DOMAIN`. Since domain is TBD, use a placeholder comment in `_headers` with instruction to fill in before launch.

**Source:** [CITED: https://rybbit.com/docs/script]

---

### Pattern 6: Schema.org JSON-LD

**What:** Structured data injected into `<head>` via `<script type="application/ld+json">`. Place in `Metadata.astro` or as a slot in `Layout.astro`. Different schema types for different page types.

**Organization (global — all pages via Layout.astro):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "KONVOI GmbH",
  "url": "https://www.konvoi.eu",
  "logo": "https://www.konvoi.eu/images/logo.svg",
  "telephone": "+49 40 766293660",
  "email": "info@konvoi.eu",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Harburger Schlossstraße 6-12",
    "addressLocality": "Hamburg",
    "postalCode": "21079",
    "addressCountry": "DE"
  },
  "sameAs": [
    "https://www.linkedin.com/company/konvoi-gmbh"
  ]
}
```

**LocalBusiness (homepage + contact page):** Extends Organization with `geo`, `openingHoursSpecification`, `areaServed: "DE"`.

**Product (product page):** `@type: "Product"`, `name`, `description`, `brand`, `offers`.

**FAQPage (use-case pages or FAQ sections):** Only use where there are actual Q&A pairs with single answers. Each `Question` has one `acceptedAnswer`.

**Placement strategy:** Emit Organization JSON-LD globally in `Layout.astro`. Emit page-specific schemas (Product, FAQPage) via a `schema` prop passed down to `Metadata.astro`, serialized with `JSON.stringify`.

```astro
<!-- In Metadata.astro -->
{schema && (
  <script type="application/ld+json" set:html={JSON.stringify(schema)} />
)}
```

**Source:** [CITED: https://developers.google.com/search/docs/appearance/structured-data/organization]

---

### Pattern 7: OG + Twitter Card Meta Tags

**What:** Per-locale static OG images at 1200×630px. The `og:locale` tag signals which language version is being served. Twitter (X) cards use `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.

**Recommendation (Claude's discretion — static assets):** Pre-generate locale-specific OG images as PNG files in `public/og/`. This is simpler than Satori/dynamic generation for a static site and works with zero server runtime.

```astro
<!-- In Metadata.astro — OG block -->
<meta property="og:type" content="website" />
<meta property="og:url" content={canonical} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />
<meta property="og:locale" content={lang === 'de' ? 'de_DE' : 'en_US'} />
<meta property="og:site_name" content="KONVOI" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />
```

`ogImage` defaults to `/og/default-{lang}.png` and can be overridden per page. Pages that need custom OG images (homepage, product, pricing) pass the override via page frontmatter.

---

### Pattern 8: Legal Pages (Impressum + Datenschutz)

**What:** Both slugs use German (`/impressum/`, `/datenschutz/`) for both locales per D-01 and D-02. The EN pages at `/en/impressum/` and `/en/datenschutz/` should render an English-language version of the same content (or redirect to DE if the content is German-only for v1). Both pages must have `<link rel="canonical">` pointing to their own URL (not cross-locale canonical).

**Key legal content for Impressum** (from D-01 and canonical.yaml):
- Angaben gemäß § 5 TMG
- KONVOI GmbH, Harburger Schlossstraße 6-12, 21079 Hamburg
- HRB 168019 (Amtsgericht Hamburg)
- USt-IdNr: DE347608487
- Geschäftsführer: Alexander Jagielo, Heinz Luckhardt
- Verantwortlich gemäß § 18 MStV: Heinz Luckhardt
- Universalschlichtungsstelle des Bundes section
- Bildnachweise section

**Key legal content for Datenschutz** (from D-02):
- Processors to document: Netlify (hosting/CDN), Web3Forms (form submission), Cloudflare Turnstile (bot protection), Rybbit (self-hosted, cookieless analytics — no data transferred to third parties), Cal.eu (external booking link — user navigates away, not embedded)
- Consent tool: vanilla-cookieconsent v3
- Remove: Jimdo Consent Manager, Jimdo Tracking, Google Analytics, Versandabwicklung, Zahlungsabwicklung
- Retain: DSGVO Betroffenenrechte, social media (LinkedIn only)
- Reference: TDDDG (formerly TTDSG) for cookieless tracking legal basis

---

### Pattern 9: CSP Headers in public/_headers

**What:** Netlify reads `public/_headers` and serves those headers. This file is copied to `dist/` by Astro's static build. The CSP must allow all third-party domains and block everything else.

**Verified CSP directives per third party:**

| Service | Directive | Domain |
|---------|-----------|--------|
| Cloudflare Turnstile | `script-src` | `https://challenges.cloudflare.com` |
| Cloudflare Turnstile | `frame-src` | `https://challenges.cloudflare.com` |
| Web3Forms | `connect-src` | `https://api.web3forms.com` |
| Google Maps (functional, gated) | `script-src` | `https://maps.googleapis.com` |
| Google Maps (functional, gated) | `frame-src` | `https://www.google.com` |
| Google Maps (functional, gated) | `img-src` | `https://maps.gstatic.com https://*.googleapis.com` |
| Cal.eu (external link only, no embed) | none needed | — |
| Rybbit (self-hosted) | `script-src`, `connect-src` | `https://YOUR_RYBBIT_DOMAIN` |
| Self-hosted fonts | `font-src` | `'self'` |

**Recommended _headers template:**
```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://YOUR_RYBBIT_DOMAIN; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://maps.gstatic.com https://*.googleapis.com; font-src 'self'; connect-src 'self' https://api.web3forms.com https://YOUR_RYBBIT_DOMAIN; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'self';
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

**Note on `'unsafe-inline'`:** vanilla-cookieconsent v3 injects inline styles for the banner. `style-src 'unsafe-inline'` is needed unless a nonce-based approach is used. For a static Astro site without SSR, nonces are not practical — `'unsafe-inline'` for style-src is acceptable. For `script-src`, avoid `'unsafe-inline'` — all scripts should be bundled by Astro or referenced with explicit src URLs.

**Note on Google Maps:** Google Maps is a functional/consent-gated feature. The CSP must allow it even though it only loads post-consent. If Google Maps is never loaded (no functional consent), the browser never evaluates those CSP entries anyway — but they must be present for when consent is given.

**Note on Cal.eu:** The context mentions Cal.eu as a booking link on thank-you pages (an `<a href>` link, not an embed). Therefore `frame-src` for cal.eu is NOT needed — only the external link exists, which requires no CSP entry.

**Source:** [VERIFIED: https://developers.cloudflare.com/turnstile/reference/content-security-policy/]

---

### Pattern 10: Netlify Redirects for Jimdo URLs

**What:** `public/_redirects` file (copied to `dist/` by Astro). Processed before `netlify.toml` redirects. One rule per line: `FROM TO STATUS`.

**Format:**
```
/old-path    /new-path    301
```

**Known Jimdo URL patterns to map** (from ROADMAP.md description and site overview — D-14 minimal mapping):

| Old Jimdo URL | New Konvoi URL | Notes |
|---------------|----------------|-------|
| `/die-loesung` | `/produkt/` | Product page |
| `/die-loesung/` | `/produkt/` | Trailing slash variant |
| `/kontakt` | `/kontakt/` | Contact (same slug) |
| `/ueber-uns` | `/team/` | Team |
| `/karriere` | `/karriere/` | Careers (same slug) |
| `/aktuelles` | `/aktuelles/` | Blog (same slug) |
| `/en` | `/en/` | EN homepage |
| `/en/die-loesung` | `/en/product/` | EN product |
| `/en/contact` | `/en/contact/` | EN contact |

**Wildcard for unmapped paths** (catch-all to avoid 404 loops):
```
# Catch-all: send unknown DE paths to homepage
# (commented out unless needed — can cause over-aggressive redirects)
# /*    /    302
```

**Astro static build behavior:** Files in `public/` are copied verbatim to `dist/`. The `_redirects` file does NOT start with `_` in a way that Astro strips — it is copied as-is. Confirmed: Astro static builds copy `public/_redirects` to `dist/_redirects`, which Netlify then reads.

**Source:** [CITED: https://docs.netlify.com/manage/routing/redirects/overview/]

---

### Pattern 11: netlify.toml Build + Headers

**What:** Current `netlify.toml` has build + `_astro/*` cache header. Needs: `site` setting (for absolute URL generation in sitemap), production context headers, and the CSP block.

The CSP is better placed in `public/_headers` (per-path granularity) rather than `netlify.toml` headers (which apply globally and are harder to scope). Keep `netlify.toml` for build config + cache only; put CSP in `_headers`.

**Recommended additions to netlify.toml:**
```toml
[build]
  publish = "dist"
  command = "pnpm run build"

[build.environment]
  NODE_VERSION = "24"

[build.processing.html]
  pretty_urls = false

# Noindex on deploy previews (already handled by Layout.astro isNonProduction check)
[context.deploy-preview.environment]
  CONTEXT = "deploy-preview"

[context.branch-deploy]
  command = "echo 'Branch deploy disabled — open a PR for a Deploy Preview'"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**Source:** [CITED: https://docs.netlify.com/manage/routing/redirects/overview/]

---

### Anti-Patterns to Avoid

- **Do not use `@astrolib/seo` for hreflang.** It does not emit `<link rel="alternate" hreflang>` tags. The current `Metadata.astro` must be supplemented.
- **Do not load vanilla-cookieconsent without the `astro:after-swap` listener.** The banner will disappear after the first client-side navigation.
- **Do not put the consent banner in the `<body>` slot.** It must be initialized in a script that persists across View Transitions.
- **Do not use `x-default` in the sitemap.** `@astrojs/sitemap` does not support it and Google does not require it in sitemaps — only in `<head>` link tags.
- **Do not emit hreflang without a `site` property in `astro.config.ts`.** Relative URLs in sitemap break Google's hreflang parsing.
- **Do not rely on Netlify adapter for `_redirects` placement.** This is a static-only build (no Netlify adapter). `public/_redirects` is the correct approach and is copied to `dist/` by Astro's static build.
- **Do not put Google Maps in `script-src` without also adding `frame-src` and `img-src`.** Maps requires all three.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cookie consent UI | Custom banner component with cookie read/write logic | `vanilla-cookieconsent` v3 | Handles WCAG, keyboard nav, DSGVO storage, re-consent logic, i18n |
| Sitemap with hreflang | Custom sitemap.xml template | `@astrojs/sitemap` v3.7.2 with i18n block | Already installed; handles xhtml namespace, URL collection |
| Schema.org validation | Testing JSON-LD by hand | Google Rich Results Test | Real-time validation against Google's parser |
| OG image sizing | Manual Photoshop export | Any image editor to 1200×630; `sharp` already installed if scripted | OG spec requires exact dimensions |
| CSP nonce-based approach | Server-side nonce injection | `'unsafe-inline'` for style-src only | Static site has no request-time nonce generation |

**Key insight:** The consent and sitemap problems have edge cases (re-consent flow, multi-locale URL collection, WCAG-compliant modal) that would take days to hand-roll correctly. The existing packages handle them.

---

## Common Pitfalls

### Pitfall 1: hreflang Without Absolute URLs
**What goes wrong:** Relative URLs in hreflang (`href="/en/"`) are ignored by Google.
**Why it happens:** Forgetting to prepend `Astro.site` or the hardcoded domain.
**How to avoid:** Always use `https://www.konvoi.eu` + path in every hreflang `href`. Set `site: 'https://www.konvoi.eu'` in `astro.config.ts`.
**Warning signs:** Google Search Console "hreflang errors" or "Return tag missing" after launch.

### Pitfall 2: Sitemap Not Including All Pages
**What goes wrong:** Dynamic pages (blog posts, use-case pages, case studies) may not appear in sitemap if they use `getStaticPaths` incorrectly.
**Why it happens:** `@astrojs/sitemap` crawls the static output — it picks up all pages Astro generates. If `getStaticPaths` returns no paths (empty collection), those pages won't be in the sitemap.
**How to avoid:** Verify `pnpm build` output shows all expected pages in `dist/`; run `grep -r "<url>" dist/sitemap*.xml | wc -l` post-build.
**Warning signs:** Sitemap has fewer entries than total page count.

### Pitfall 3: Cookie Consent Banner Disappearing After Navigation
**What goes wrong:** After clicking any internal link with `<ClientRouter>`, the vanilla-cookieconsent banner vanishes and the preferences modal no longer opens.
**Why it happens:** Astro swaps `document.body` content; the library's appended DOM is destroyed.
**How to avoid:** Always include `document.addEventListener('astro:after-swap', initCC)` alongside the initial `initCC()` call.
**Warning signs:** Banner shows on first page load but not on navigated pages.

### Pitfall 4: CSP Blocking Astro's Inline Scripts
**What goes wrong:** Astro emits some inline scripts (e.g., `ApplyColorMode.astro` for dark mode, `BasicScripts.astro`) that are blocked by a strict `script-src` without `'unsafe-inline'`.
**Why it happens:** `script-src 'self'` alone blocks inline `<script>` tags.
**How to avoid:** Either use `'unsafe-inline'` (acceptable for this site's threat model) or audit every inline script Astro emits and add SHA-256 hashes. Given the static marketing site context, `'unsafe-inline'` in `script-src` is the pragmatic choice.
**Warning signs:** Browser console CSP violation errors; dark mode toggle broken; cookie consent not initializing.

### Pitfall 5: site:netlify.app Returning Indexed Pages
**What goes wrong:** The Netlify preview subdomain (`konvoi-homepage.netlify.app`) gets indexed by Google before launch.
**Why it happens:** Robots meta tag only applies to the Netlify deploy-preview/branch-deploy contexts, not the production Netlify app subdomain.
**How to avoid:** The `netlify.app` subdomain is a production alias until the custom domain is connected. Add `noindex` to the Netlify app domain by checking `DEPLOY_URL` environment variable contains `netlify.app`. The existing `Layout.astro` `isNonProduction` check covers deploy-preview but not the app URL. Add `public/_headers` rule for the netlify.app domain explicitly, or rely on Google Search Console to remove the netlify.app subdomain post-launch. Fastest fix: add `X-Robots-Tag: noindex` header for `/*.netlify.app/*` in `_headers`.
**Warning signs:** `site:netlify.app konvoi` returns results in Search Console.

### Pitfall 6: @astrojs/sitemap Missing `site` Config
**What goes wrong:** Sitemap generates with `undefined` or `localhost` URLs.
**Why it happens:** `astro.config.ts` has no `site` property (current state — it's missing from the file).
**How to avoid:** Add `site: 'https://www.konvoi.eu'` to `astro.config.ts` as the very first fix in this phase.
**Warning signs:** Build warning "An error occurred while building the sitemap" or sitemap entries show `http://localhost:4321/`.

### Pitfall 7: Legal Pages Missing from Sitemap
**What goes wrong:** `/impressum/` and `/datenschutz/` appear in the sitemap and get hreflang alternates. Typically legal pages should be excluded from sitemap hreflang (they're the same content for both locales) or at minimum not have `x-default` confusion.
**Why it happens:** Automatic sitemap inclusion of all pages.
**How to avoid:** Consider adding `customPages` exclusion or just accept that legal pages in the sitemap is harmless. More important: do NOT set `noindex` on legal pages — they need to be indexable for compliance transparency.
**Warning signs:** Not a blocking issue; monitor for Google "hreflang return tag" errors.

---

## Code Examples

### Verified: sitemap i18n config

```typescript
// astro.config.ts
// Source: https://docs.astro.build/en/guides/integrations-guide/sitemap/
export default defineConfig({
  site: 'https://www.konvoi.eu',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'de',
        locales: {
          de: 'de-DE',
          en: 'en-US',
        },
      },
    }),
    // ... other integrations
  ],
});
```

### Verified: vanilla-cookieconsent v3 footer trigger

```html
<!-- Footer "Cookie-Einstellungen" button -->
<!-- Source: https://cookieconsent.orestbida.com/ -->
<button
  type="button"
  data-cc="show-preferencesModal"
  class="text-sm text-muted hover:underline"
>
  Cookie-Einstellungen
</button>
```

The `data-cc="show-preferencesModal"` attribute is the v3 declarative API — no JS needed on the element itself.

### Verified: Rybbit script tag pattern

```html
<!-- Source: https://rybbit.com/docs/script -->
<!-- Replace placeholders before launch -->
<script
  src="https://RYBBIT_DOMAIN/api/script.js"
  async
  data-site-id="SITE_ID"
></script>
```

### Verified: Netlify _redirects format

```
# Source: https://docs.netlify.com/manage/routing/redirects/overview/
# Jimdo → Konvoi 301 redirect mapping
/die-loesung        /produkt/       301
/die-loesung/       /produkt/       301
/ueber-uns          /team/          301
/ueber-uns/         /team/          301
/en/die-loesung     /en/product/    301
/en/die-loesung/    /en/product/    301
```

### Verified: Organization JSON-LD for Konvoi

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "KONVOI GmbH",
  "url": "https://www.konvoi.eu",
  "logo": "https://www.konvoi.eu/images/logo.svg",
  "telephone": "+49 40 766293660",
  "email": "info@konvoi.eu",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Harburger Schlossstraße 6-12",
    "addressLocality": "Hamburg",
    "postalCode": "21079",
    "addressCountry": "DE"
  },
  "foundingDate": "2020",
  "sameAs": [
    "https://www.linkedin.com/company/konvoi-gmbh"
  ]
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| TTDSG (Telekommunikations-Telemedien-Datenschutz-Gesetz) | TDDDG (Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz) | Dec 2024 | Datenschutz must reference TDDDG, not TTDSG |
| Plausible analytics (Phase 5 plan) | Rybbit (self-hosted) | D-07 overrides ROADMAP.md | Analytics.astro is currently a placeholder — implement Rybbit |
| `@astrolib/seo` for all meta | Supplement with direct `<link>` tags for hreflang | Phase 7 | Metadata.astro rewrite needed |
| `formspree.io` for forms | `api.web3forms.com` | Phase 5 | CSP must reference web3forms, not formspree |

**Deprecated/outdated:**
- ROADMAP.md mentions "Plausible Cloud EU analytics" in Phase 7 success criteria — overridden by CONTEXT.md D-07 (Rybbit). The planner must use Rybbit.
- REQUIREMENTS.md SEO-05 says "Plausible" — overridden by CONTEXT.md D-07. Treat as Rybbit.
- REQUIREMENTS.md SEO-09 says "Formspree" in the allowlist — overridden by CONTEXT.md D-15. Use Web3Forms domains.
- `@astrolib/seo` AstroSeo component in Metadata.astro was appropriate for Phase 1-6 scaffolding, but is insufficient for Phase 7's hreflang requirements.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Cal.eu is used only as an external link (href), not as an iframe embed on the site | CSP Pattern, Legal Pages | If Cal.eu is embedded as an iframe, CSP needs `frame-src https://cal.eu` and the Datenschutz must document Cal.eu as a data processor |
| A2 | The Rybbit self-hosted domain will be known before launch and can be filled into CSP/script at plan execution time | Analytics Pattern, CSP Pattern | If Rybbit domain is unknown, the analytics step is blocked; CSP placeholder must be documented |
| A3 | `public/_redirects` in Astro static build (no adapter) is copied correctly to `dist/` | Redirects Pattern | If Astro changes this behavior, redirects silently fail; verified via build output check |
| A4 | Google Maps is the only consent-gated third-party embed (no YouTube embeds exist in current pages) | Cookie Consent Pattern | If YouTube is embedded on any page, those iframes must also be gated via the functional category |
| A5 | LinkedIn is the only social media platform to document in Datenschutz (no Facebook/Instagram pixels) | Legal Pages | If other social pixels are added, Datenschutz must be updated |

---

## Open Questions (RESOLVED)

1. **Rybbit self-hosted domain** — RESOLVED: Treated as `RYBBIT_DOMAIN` placeholder in Analytics.astro and _headers; user fills in before DNS cutover per user_setup frontmatter in 07-02.

2. **OG images — design ownership** — RESOLVED: Plan generates placeholder OG images with Konvoi brand colors. User replaces with final assets before DNS cutover.

3. **YouTube embeds** — RESOLVED: Executor greps for `youtube.com` iframes during execution. If found, adds YouTube to functional category and CSP. Currently no live YouTube embeds exist (Phase 4 uses IncidentVideo placeholders).

4. **x-default for /en/impressum/ and /en/datenschutz/** — RESOLVED: Serve bilingual content at both URLs. EN version has English text. Canonical points to own URL (no cross-locale redirect).

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `pnpm` | Build | ✓ | 10.32.1 | — |
| Node.js | Build | ✓ | 24.x | — |
| `@astrojs/sitemap` | SEO-02 | ✓ | 3.7.2 (in package.json) | — |
| `sharp` | OG image generation | ✓ | 0.34.5 (in devDependencies) | — |
| `vanilla-cookieconsent` | SEO-06 | ✗ — not yet installed | 3.1.0 | — |
| Rybbit self-hosted instance | SEO-05 | ✗ — domain TBD | n/a | Skip analytics wave until provisioned |
| Google Search Console access | DEPLOY-04 | ✗ — user must configure | n/a | Manual step; cannot be automated |
| DNS access (konvoi.eu registrar) | DEPLOY-03 | ✗ — user must configure | n/a | Manual step; cannot be automated |

**Missing dependencies with no fallback:**
- `vanilla-cookieconsent` — must be installed before consent plan executes: `pnpm add vanilla-cookieconsent`
- Google Search Console + DNS access — manual user actions; plan must include explicit instructions

**Missing dependencies with fallback:**
- Rybbit domain — analytics script can be added as a placeholder with a `TODO` comment; functional for all other phase work

---

## Validation Architecture

> `workflow.nyquist_validation` not explicitly set to false — validation section included.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `pnpm check` (astro check + eslint + prettier) — no unit test framework |
| Config file | `package.json` scripts |
| Quick run command | `pnpm check` |
| Full suite command | `pnpm build` (includes sitemap generation + grep gate) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| SEO-01 | hreflang + canonical in `<head>` | smoke | `pnpm build && grep -l 'hreflang' dist/*.html dist/**/*.html` | Manual inspection of built HTML |
| SEO-02 | Sitemap has xhtml:link alternates | smoke | `pnpm build && grep -c 'xhtml:link' dist/sitemap-0.xml` | Should be > 0 |
| SEO-03 | OG images exist and referenced | smoke | `ls dist/og/*.png` + grep `og:image` in built HTML | Manual |
| SEO-04 | JSON-LD validates | manual | Google Rich Results Test — cannot automate | [ASSUMED] |
| SEO-05 | Rybbit script in `<head>` | smoke | `pnpm build && grep 'rybbit' dist/index.html` | |
| SEO-06 | Cookie consent banner initializes | manual | Browser test — cannot automate in static CI | |
| SEO-07 | /impressum/ exists and has TMG content | smoke | `pnpm build && ls dist/impressum/index.html` | |
| SEO-08 | /datenschutz/ exists | smoke | `pnpm build && ls dist/datenschutz/index.html` | |
| SEO-09 | CSP header present | smoke | `pnpm build && grep 'Content-Security-Policy' dist/_headers` | |
| DEPLOY-01 | netlify.toml valid | smoke | `pnpm build` succeeds | |
| DEPLOY-02 | _redirects file in dist | smoke | `pnpm build && ls dist/_redirects` | |
| DEPLOY-03 | DNS cutover | manual | User action — cannot automate | |
| DEPLOY-04 | Search Console verified | manual | User action — cannot automate | |
| DEPLOY-05 | site:netlify.app returns zero | manual | Google search query — post-launch check | |

### Wave 0 Gaps
- None for test infrastructure — `pnpm check` and build smoke tests use existing tooling.

*(The consent, DNS, and Search Console requirements are inherently manual — plan must include explicit human verification steps.)*

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | n/a — no auth on marketing site |
| V3 Session Management | no | n/a |
| V4 Access Control | no | n/a |
| V5 Input Validation | yes (forms exist from Phase 5) | Zod (already implemented) + Turnstile |
| V6 Cryptography | no | n/a |
| V7 Error Handling | partial | No stack traces in prod HTML — standard Astro behavior |
| V14 Configuration | yes | CSP headers, X-Frame-Options, HSTS |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Clickjacking | Tampering | `X-Frame-Options: DENY` in `_headers` |
| Inline script injection | Tampering | CSP `script-src` without `unsafe-eval`; bundled scripts only |
| Third-party script supply chain | Tampering | Self-host vanilla-cookieconsent via npm (pinned version); Rybbit self-hosted |
| MIME sniffing | Info Disclosure | `X-Content-Type-Options: nosniff` in `_headers` |
| Referrer leakage | Info Disclosure | `Referrer-Policy: strict-origin-when-cross-origin` |
| Cookie without Secure/SameSite | Tampering | vanilla-cookieconsent v3 sets `cc_cookie` with SameSite=Lax by default [ASSUMED — verify in browser DevTools] |

### DSGVO-Specific

| Obligation | Implementation |
|------------|---------------|
| TDDDG § 25 (cookie consent) | vanilla-cookieconsent v3 with explicit opt-in for functional category |
| DSGVO Art. 13 (transparency) | Datenschutz page documenting all processors |
| Impressumspflicht § 5 TMG | /impressum/ page with all required fields |
| Cookieless analytics (no TDDDG trigger) | Rybbit fingerprinting-based — no consent required under TDDDG § 25 Abs. 2 Nr. 2 [CITED: TDDDG wording; [ASSUMED] that Rybbit's fingerprinting qualifies as "unbedingt erforderlich" or falls outside § 25 scope — user should verify with legal counsel] |

---

## Sources

### Primary (HIGH confidence)
- `https://docs.astro.build/en/guides/integrations-guide/sitemap/` — @astrojs/sitemap i18n config, xhtml:link output, version 3.7.2
- `https://cookieconsent.orestbida.com/essential/getting-started.html` — vanilla-cookieconsent v3 package name, version 3.1.0, ESM import, CSS path
- `https://developers.cloudflare.com/turnstile/reference/content-security-policy/` — Turnstile CSP directives (script-src, frame-src)
- `https://rybbit.com/docs/script` — Rybbit script tag syntax, data-site-id attribute, self-hosted domain substitution
- `https://developers.google.com/search/docs/appearance/structured-data/organization` — Organization schema properties
- `https://docs.netlify.com/manage/routing/redirects/overview/` — _redirects syntax, 301 format, file placement
- npm registry: `vanilla-cookieconsent` 3.1.0 (2025-02-04), `@astrojs/sitemap` 3.7.2

### Secondary (MEDIUM confidence)
- `https://github.com/orestbida/cookieconsent/issues/814` — Astro View Transitions + cookieconsent incompatibility; `astro:after-swap` workaround (community-found, not officially documented)
- Web3Forms: form endpoint `https://api.web3forms.com/submit`; `connect-src` needed for `api.web3forms.com` — verified from multiple usage guides

### Tertiary (LOW confidence / Assumed)
- Cal.eu CSP: treated as external link only (no iframe embed) based on CONTEXT.md language about "Cal.eu booking link" — if it becomes an embed, CSP must be updated
- Rybbit cookieless legal basis under TDDDG — assumed cookieless = no consent required; legal verification recommended before DNS cutover

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all library versions verified against npm registry and official docs
- Architecture patterns: HIGH — sitemap/hreflang from official Astro docs; cookieconsent from official docs + GitHub issue
- CSP directives: HIGH for Turnstile (official CF docs); MEDIUM for Web3Forms (community sources); LOW for Rybbit (domain TBD)
- Legal content: MEDIUM — D-01/D-02 decisions from CONTEXT.md; specific TDDDG clause interpretation is ASSUMED

**Research date:** 2026-04-26
**Valid until:** 2026-05-26 (30 days — stable stack)
