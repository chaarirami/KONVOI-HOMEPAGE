# Technology Stack

**Project:** konvoi-homepage (konvoi.eu rebuild)
**Researched:** 2026-04-20
**Scope:** Fill-in libraries and patterns on top of the already-locked Astro 6 + Tailwind 4 + TypeScript 6 + pnpm 10 + Netlify stack. Locked choices are restated but not re-debated; everything below is the *new* 2026 ecosystem research.

---

## TL;DR — Recommended Stack Additions

| Concern | Recommendation | Confidence |
|---|---|---|
| i18n (DE default + `/en/` prefix) | **Astro built-in `i18n` only.** No add-on library. | HIGH |
| Forms (v1) | **Formspree** (EU workspace if the sales team creates the account from an EU login; otherwise standard US Formspree is still GDPR-lawful with SCCs). | MEDIUM |
| Forms (if on Netlify already, v1.5+) | **Netlify Forms** as a fallback only; do NOT lead with it (Akismet spam filter is US-based, no EU residency option, credit-based billing is volatile). | MEDIUM |
| Cookie consent / DSGVO banner | **`vanilla-cookieconsent` v3** (open source, EU-aware, free, DE/EN built-in). | HIGH |
| Analytics | **Plausible Cloud** (hosted in Falkenstein/Germany on Hetzner, cookie-less, no banner needed). Replace the currently installed `@astrolib/analytics` GA wiring. | HIGH |
| Image pipeline | **Keep `sharp` + `unpic` as-is**; do NOT add Cloudinary/ImageKit. Enable **Netlify Image CDN** for remote images in production. | HIGH |
| Client framework for ROI calculator + sensor viz | **Preact via `@astrojs/preact`**, `client:visible` / `client:idle` hydration. Not Svelte, not Solid, not vanilla-only. | HIGH |
| Motion / scroll animations | **Motion One (`motion`)** as the primary library; Tailwind v4 `@keyframes` in `@theme` for trivial cases; skip AOS and GSAP. | HIGH |
| Email / contact handoff | **Formspree wins over Netlify Forms even when hosted on Netlify.** | MEDIUM |

**One sentence:** Keep the current Astro-native image + SEO stack untouched, add Preact + Motion for the three or four genuinely interactive widgets, use Plausible EU + vanilla-cookieconsent + Formspree for the compliance layer, and rely on Astro's built-in i18n instead of reaching for paraglide or astro-i18next.

---

## Recommended Stack

### Already Locked (do not change, just restated for completeness)

| Technology | Version | Purpose | Notes |
|---|---|---|---|
| Astro | `^6.1.8` | SSG framework, static output | Node `^22 \|\| >=24` |
| Tailwind CSS | `^4.2.2` | Styling, CSS-first config | Via `@tailwindcss/vite`, no `tailwind.config.*` |
| TypeScript | `^6.0.3` | Types | `strictNullChecks: true` |
| pnpm | `10.x` | Package manager | `onlyBuiltDependencies: ["esbuild","sharp"]` |
| Node.js | `22 \|\| 24+` | Runtime | Astro 6 dropped Node 18 / 20 |
| `@astrojs/sitemap` | `^3.7.2` | Build-time sitemap | Keep |
| `@astrojs/rss` | `^4.0.18` | Blog RSS | Keep |
| `@astrojs/mdx` | `^5.0.3` | MDX content | Keep |
| `@astrolib/seo` | `^1.0.0-beta.8` | OG / Twitter / canonical | Keep |
| `astro-icon` | `^1.1.5` | Iconify wrapper | Keep (trim the tabler `*` include post-launch) |
| `astro-embed` | `^0.13.0` | Video / tweet embeds | Keep |
| `astro-compress` | `^2.4.1` | Post-build minify | Keep |
| `unpic` | `^4.2.2` | Multi-CDN image optimizer | Keep |
| `sharp` | `^0.34.5` | Local image processing | Keep |

### New Additions

#### 1. Internationalization — Astro Built-In Only

| Tech | Version | Why |
|---|---|---|
| `astro:i18n` (module) | Built into Astro 6.1.8 | Native, zero-dep, SSG-friendly, handles DE-default + `/en/` prefix out of the box. |

**Install:** None needed — already part of `astro@^6.1.8`.

**Config (paste into `astro.config.ts`):**

```ts
export default defineConfig({
  // ...existing config...
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: false,   // DE stays on /, EN goes to /en/
      redirectToDefaultLocale: false, // don't force /de redirect on landing on /
    },
  },
});
```

**Content collection pattern (matches the existing `src/data/` convention):**

```
src/data/
  post/
    de/                      # German posts (canonical)
    en/                      # English posts
  use-case/
    de/
    en/
  team/
    de/
    en/
```

Then in `src/content.config.ts`, add a `locale` discriminator via Zod or encode it in the collection path. Pages under `src/pages/` mirror that: `src/pages/index.astro` (DE), `src/pages/aktuelles/index.astro` (DE blog), `src/pages/en/index.astro` (EN), `src/pages/en/news/index.astro` (EN blog).

**Helpers to use:**

- `Astro.currentLocale` — current page locale
- `getRelativeLocaleUrl(locale, path)` from `astro:i18n` — for the language switcher
- `getAbsoluteLocaleUrl(...)` — for canonical + alternate `<link>` tags

**Known gotchas (Astro 6-specific):**

1. **Astro 6 changed defaults for `redirectToDefaultLocale` and `prefixDefaultLocale`** — you MUST set both explicitly, as shown above. If you don't, you risk `/` silently redirecting to `/de/` (which conflicts with the "DE without prefix" requirement).
2. **Content collections are locale-agnostic.** Astro does NOT automatically bucket entries by locale — you have to filter in your page with `collection.filter(e => e.data.locale === Astro.currentLocale)` or split into sibling collections.
3. **`hreflang` alternates are manual.** Astro's i18n module doesn't emit `<link rel="alternate" hreflang="..."/>` for you — add them in `src/components/common/Metadata.astro` for every page that has a translation sibling.
4. **No string-catalog helper is included.** For UI labels ("Book a consult", "Read more"), create a simple `src/i18n/ui.ts` record keyed by locale — do NOT pull in `astro-i18next` (archived, not Astro 5/6 compatible) or `paraglide-js` (overkill here; see below).

**What NOT to use and why:**

- `astro-i18next` — archived, incompatible with Astro 5+, last meaningful commit >12 months ago.
- `@inlang/paraglide-astro` (paraglide-js v2) — a great tool for big multi-locale apps with complex message formatting, but overkill for a 2-locale static marketing site. Its tree-shakable compiled messages matter when you have hundreds of keys and multiple client islands — Konvoi has neither. Reserve it as a post-v1 upgrade if the string count explodes (>200 keys) or if a third locale is added.
- `astro-i18n` (the community package, not the built-in module) — abandoned.

**Confidence: HIGH.** Verified against [Astro i18n docs](https://docs.astro.build/en/guides/internationalization/), [Astro 6 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v6/), and multiple 2026 tutorials.

---

#### 2. Form Backend — Formspree (Primary), Netlify Forms (Fallback)

| Tech | Version | Why |
|---|---|---|
| Formspree (service) | 2026 pricing — free: 50 submissions/mo, $10/mo "Basic" = 200 submissions/mo | Reliable since 2013, DPA available, signs SCCs as an EU-data processor, works from plain HTML `<form action="https://formspree.io/f/...">`, no JS required. |

**Install:** No package — it's a hosted service. Point the form `action` at the endpoint:

```html
<form action="https://formspree.io/f/xxxyyy" method="POST">
  <input type="email" name="email" required />
  <input type="hidden" name="_subject" value="Konvoi consult request" />
  <input type="hidden" name="_gotcha" style="display:none" /><!-- honeypot -->
  <input type="hidden" name="_language" value="de" /><!-- localised error pages -->
  <button type="submit">Termin anfragen</button>
</form>
```

**Why Formspree over the alternatives:**

| Criterion | Formspree | Netlify Forms | Basin | Getform | FormSubmit |
|---|---|---|---|---|---|
| Portability (not tied to host) | ✅ works anywhere | ❌ Netlify-only | ✅ | ✅ | ✅ |
| Free tier | 50/mo | 100/mo but credit-shared | 50/mo | 50/mo | Unlimited but unreliable |
| DPA available | ✅ | ✅ | ⚠️ limited | ✅ | ❌ |
| EU data residency | ⚠️ US default, SCCs in place | ❌ US-only | ❌ | ⚠️ | ❌ |
| Spam protection | Akismet + honeypot + reCAPTCHA opt-in | Akismet + honeypot | Honeypot only | Honeypot + reCAPTCHA | Captcha |
| Astro DX | Excellent — HTML-native | Requires `data-netlify="true"` + Netlify-only build step | Good | Good | Basic |
| Price at 1k submissions/mo | $10/mo (Basic tier) | Consumes credits — pricing opaque post-2025 | $8/mo | $8/mo | Free (limited) |

**GDPR / DSGVO posture:**
- Formspree is a US processor but publishes [SCCs in its privacy policy](https://formspree.io/legal/privacy-policy/) and signs a DPA on request. That meets Schrems II minimum for a B2B lead form capturing business contact data.
- For maximum German-residency optics (useful as a sales talking point — Konvoi's whole pitch is "Security Tech Made in Germany"), plan a **v1.5 migration to a German form processor** like [Formcarry EU](https://formcarry.com/) or self-hosting via a Netlify Function + Resend-EU, but treat this as post-launch polish, not a launch blocker.

**Spam protection pattern (apply on every form):**
1. Honeypot field: `<input type="hidden" name="_gotcha" style="display:none">` (Formspree respects this).
2. Cloudflare Turnstile (free, EU-friendly, no Google cookies) client-side — trigger only when the form is focused, not on page load, so it doesn't trip the cookie banner.
3. Optional client-side rate-limit (1 submit per 5 s) in a tiny Preact island.

**What NOT to use and why:**

- **FormSubmit** — exposes recipient email in page source; GDPR liability (scrapers harvest it). Confirmed in multiple 2026 reviews.
- **Basin** — minimal integrations, US-only, no meaningful advantage over Formspree.
- **Getform** — US-based, no EU-residency story; roughly feature-equivalent to Formspree but less well known.
- **HubSpot forms** — out of scope per PROJECT.md (no CRM in v1).
- **Typeform / Tally** — these are form *builders*, not form *backends*; they own the UX of the form, which kills design control.

**Confidence: MEDIUM.** Formspree is verifiably GDPR-capable (DPA + SCCs) but does not publish explicit "EU data residency" language the way Plausible or Pirsch do. The recommendation is correct for v1; plan to revisit for v1.5 if the sales team gets pushback on "where is the lead data stored".

---

#### 3. Cookie Consent / DSGVO Banner — vanilla-cookieconsent v3

| Tech | Version | Why |
|---|---|---|
| `vanilla-cookieconsent` | `^3.1.0` | Free, open source, DSGVO/TDDDG-compliant out of the box, zero vendor dependency, 6 kB gzipped, supports DE + EN translations via external JSON, a11y-clean (keyboard + screen readers). |

**Install:**
```bash
pnpm add vanilla-cookieconsent
```

**Wire-up in `src/layouts/Layout.astro` (before `</body>`):**

```astro
---
// ...
---
<script>
  import 'vanilla-cookieconsent/dist/cookieconsent.css';
  import * as CookieConsent from 'vanilla-cookieconsent';

  CookieConsent.run({
    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: {},
    },
    language: {
      default: 'de',
      translations: {
        de: '/locales/de/cookie-consent.json',
        en: '/locales/en/cookie-consent.json',
      },
    },
    guiOptions: {
      consentModal: { layout: 'box inline', position: 'bottom left' },
      preferencesModal: { layout: 'box' },
    },
  });
</script>
```

**Then gate Plausible (or any analytics) with the `analytics` category:**

```ts
CookieConsent.onConsent(() => {
  if (CookieConsent.acceptedCategory('analytics')) {
    // load Plausible script here (or set data-cc="analytics" on the script tag)
  }
});
```

**Why vanilla-cookieconsent over the commercial options:**

| Criterion | vanilla-cookieconsent | Cookiebot | Usercentrics | iubenda | Klaro! |
|---|---|---|---|---|---|
| Price | Free | €9–€30/mo per domain | €40+/mo | €27+/mo | Free |
| DSGVO / TDDDG legal defensibility | High (if configured correctly — no pre-ticked boxes, equal-prominence reject button) | High (certified, automated scanning) | High | High | High |
| German hosting of config | N/A (runs entirely client-side, no 3rd-party calls) | DE/EU | DE/EU | EU | N/A (static) |
| Google Consent Mode v2 | Manual wiring | Built-in | Built-in | Built-in | Manual |
| Dev ownership | Full — it's just a JS lib | Opaque (hosted service) | Opaque | Opaque | Full |
| Plausible-friendly (no consent needed) | Trivial | Possible but UX encourages categorization | Same | Same | Trivial |

**Pinning the legal angle:**
- For a B2B site using **only Plausible Cloud EU + hosted fonts + Google-Maps-on-click + Formspree**, cookie consent is technically only required for the Google Maps embed (which sets cookies). Plausible is cookie-less and explicitly [does not require a consent banner](https://plausible.io/privacy-focused-web-analytics).
- **Strategy:** Show the banner on pages with the Maps embed (contact page) and on pages with embedded YouTube (if any), but allow the site to render without forcing the banner globally. vanilla-cookieconsent's category-gating makes this trivial.
- Embed Google Maps via a **click-to-load** placeholder — show a static preview until the user clicks, then load the real iframe. This eliminates cookies on first load and is the canonical DSGVO-safe pattern.

**What NOT to use and why:**

- **Cookiebot / Usercentrics** — overkill. Pay €9–€40/mo for a CMP when Konvoi's actual tracking surface is near-zero. Justified only if Konvoi later adds Meta Pixel, LinkedIn Insight Tag, HubSpot, Hotjar, etc. — flag for v2 if marketing starts adding trackers.
- **iubenda** — Italian legal service; good but pricier and opinionated.
- **Klaro!** — solid German-origin alternative; smaller community than vanilla-cookieconsent and less polished docs. Valid fallback if vanilla-cookieconsent hits a wall.
- **Custom rolled banner** — don't. Legal defensibility requires specific button prominence, granular category toggles, preference-recall UI — solved problems that a bespoke banner tends to get wrong.

**Confidence: HIGH.** Verified [orestbida/cookieconsent on GitHub](https://github.com/orestbida/cookieconsent/) is on v3.1.0, actively maintained, MIT-licensed, and has shipped translations DE and EN for years. TDDDG + DSGVO compliance confirmed by multiple 2026 German legal tech sources.

---

#### 4. Analytics — Plausible Cloud (EU / Germany)

| Tech | Version | Why |
|---|---|---|
| Plausible (cloud) | N/A (hosted service) | **Hosted in Falkenstein, Germany on Hetzner.** Cookie-less by design — no consent banner required. 1 KB script. GDPR + Schrems II compliant with no data transfers outside the EEA. |

**Install:** No npm package. Add the script to `src/layouts/Layout.astro`:

```astro
<script
  defer
  data-domain="konvoi.eu"
  src="https://plausible.io/js/script.js"
></script>
```

For EU-only variant:
```astro
<script
  defer
  data-domain="konvoi.eu"
  src="https://plausible.io/js/script.outbound-links.tagged-events.js"
></script>
```

**Handling Astro view transitions (`ClientRouter`):**

Plausible's script auto-rebinds via its own `pageview` event on history navigation, so the current `ClientRouter` setup works without extra wiring. If any issue appears, re-trigger manually:

```ts
document.addEventListener('astro:page-load', () => {
  // @ts-ignore
  window.plausible?.('pageview');
});
```

**Does `@astrolib/analytics@^0.6.1` (already installed) help?**

**No, not meaningfully.** `@astrolib/analytics` is an AstroWind-era helper that wraps Google Analytics (GA4 gtag.js) injection. Inspecting the package: it exports a `GoogleAnalytics` component and expects a GA ID; it does not ship a Plausible provider. Some forks (e.g. `astro-analytics`) cover Plausible/Fathom/Umami, but **that is a different package** (`astro-analytics`, not `@astrolib/analytics`).

**Recommendation:**
- **Remove `@astrolib/analytics` from `package.json` as part of v1 cleanup.** The whole `src/components/common/Analytics.astro` component can be replaced with a tiny 4-line Plausible script tag inside `Layout.astro`. Fewer moving parts, one less dependency.
- If the team wants the abstraction layer (e.g. to A/B compare analytics providers later), swap to [`astro-analytics`](https://www.npmjs.com/package/astro-analytics) which has Plausible, Fathom, Umami, GA, Matomo providers in one package. Low priority — the direct script approach is cleaner for one provider.

**Why Plausible over the alternatives:**

| Criterion | Plausible Cloud | Pirsch | Fathom | Umami (cloud) | Matomo Cloud | Google Analytics 4 |
|---|---|---|---|---|---|---|
| Hosted in Germany | ✅ (Hetzner Falkenstein) | ✅ (Hetzner) | ❌ EU-option routes via EU but HQ is Canada | ❌ US | ✅ EU | ❌ US |
| Cookie-less | ✅ | ✅ | ✅ | ✅ | Optional | ❌ |
| Consent banner required | ❌ | ❌ | ❌ | ❌ | Depends on config | ✅ always |
| Script size | ~1 KB | <1 KB | ~1 KB | ~2 KB | ~23 KB | ~50 KB |
| Price (≤100k pageviews/mo) | $9/mo or €9/mo | €6/mo | $15/mo | Free (10k) / $20 | €23/mo | Free |
| DSGVO / Schrems II clean | ✅ | ✅ | ✅ (with EU Isolation addon) | ⚠️ (US cloud) | ✅ | ❌ historically contested |
| Open source (can self-host) | ✅ (CE edition) | ❌ (open SDK only) | ❌ | ✅ | ✅ | ❌ |
| Ease of embed in Astro | Trivial | Trivial | Trivial | Trivial | Moderate | Moderate |

**Primary pick: Plausible Cloud EU** — the "German-hosted, no-banner-needed, 1 KB" combo is ideal for the marketing claim Konvoi wants to make ("Security Tech Made in Germany" should extend to the site's own privacy posture). Pirsch is a close runner-up and slightly cheaper — pick it instead if the team wants a German company (Pirsch is DE-based, Plausible is registered in Estonia/EU but hosted in Germany).

**Confidence: HIGH.** Plausible's German hosting and privacy posture are explicitly documented at [plausible.io/eu-hosted-web-analytics](https://plausible.io/eu-hosted-web-analytics) and [plausible.io/blog/made-in-eu](https://plausible.io/blog/made-in-eu).

---

#### 5. Image CDN — Keep sharp + unpic; enable Netlify Image CDN

| Tech | Version | Why |
|---|---|---|
| `sharp` | `^0.34.5` (already installed) | Local image optimization at build time — works great for the entire existing image pipeline. |
| `unpic` | `^4.2.2` (already installed) | Multi-provider URL rewriter; auto-detects the hosting CDN. Pairs natively with Netlify's Image CDN. |
| Netlify Image CDN | N/A (platform feature) | Zero-config runtime image transforms once deployed. `unpic` auto-rewrites URLs to `/.netlify/images?url=...` when hosted on Netlify. |

**Install:** Nothing new. The existing stack is optimal.

**Astro config to turn it on:**
```ts
// astro.config.ts
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify'; // only if switching to server output later

export default defineConfig({
  output: 'static',
  image: {
    // keep sharp as the build-time service; unpic handles runtime CDN rewrites
    service: { entrypoint: 'astro/assets/services/sharp' },
    domains: ['konvoi.eu'], // trim AstroWind demo hosts (pixabay, unsplash)
  },
});
```

**Why NOT add Cloudinary or ImageKit:**

| Criterion | sharp + unpic + Netlify CDN | Cloudinary | ImageKit |
|---|---|---|---|
| Already installed | ✅ | ❌ | ❌ |
| Free tier | Unlimited (Netlify free has 1k transforms/mo) | 25 GB bandwidth + 25k transforms | 20 GB bandwidth |
| Price at scale | Netlify bandwidth only | $99/mo | $49/mo |
| AVIF / WebP | ✅ | ✅ | ✅ |
| AI features (background removal, auto-crop) | ❌ | ✅ | ⚠️ |
| Vendor lock-in | None | High | Medium |
| DSGVO / EU data residency | ✅ (Netlify has EU regions, sharp runs at build) | ⚠️ US-origin; EU region is enterprise-tier only | Lives on AWS, pick EU region manually |

**Recommendation rationale:** The existing pipeline ships AVIF/WebP, lazy-loads, and does responsive `srcset` via `Image.astro`. A marketing site of ~40–60 pages and maybe 200 images doesn't need Cloudinary's AI features. Adding an external CDN now would add cost, add a GDPR surface (every image request logs visitor IP to a third party), and add a vendor to audit — all for zero visitor-facing benefit. If Konvoi later wants dynamic crops, AI removal of product backgrounds, or a DAM, revisit Cloudinary's free tier.

**What to TRIM from the current setup:**
- `astro.config.ts > image.domains` — drop `cdn.pixabay.com`, `images.unsplash.com`, `plus.unsplash.com`, `img.shields.io`. Add whatever asset CDNs Konvoi actually uses (likely none beyond `konvoi.eu`).

**Confidence: HIGH.** Verified [unpic Netlify provider docs](https://unpic.pics/providers/netlify/).

---

#### 6. Client Framework for Interactive Widgets — Preact

| Tech | Version | Why |
|---|---|---|
| `@astrojs/preact` | `^5.1.1` | Smallest React-compatible framework (3 kB runtime), works with the React mental model most devs already know, hydrates per-island via `client:visible` / `client:idle`. |
| `preact` | `^10.x` | Peer dep of `@astrojs/preact`, pulled automatically by `pnpm astro add preact`. |

**Install:**
```bash
pnpm astro add preact
# or explicitly
pnpm add @astrojs/preact preact
```

**When to use Preact islands (and when not to):**

| Widget | Use Preact? | Rationale |
|---|---|---|
| ROI / savings calculator (fleet size → savings output) | ✅ YES | Real reactive state (inputs, derived values, chart re-render). Preact shines here. |
| Shared motion / shock / GPS data-viz widget | ✅ YES | Canvas / SVG animation with state; Preact + a charting primitive is far easier than hand-rolled DOM. |
| Customer logo wall | ❌ NO | Pure static list — plain `.astro`. |
| Rotating testimonials | ⚠️ MAYBE | If it's just a CSS-crossfade carousel, plain `.astro` + tiny vanilla JS in a `<script>` tag wins. If it has pause-on-hover, swipe, keyboard nav, use Preact. |
| Language switcher | ❌ NO | Plain `<a>` tags using `getRelativeLocaleUrl()`. |
| Nav flyouts / mobile menu | ❌ NO | Vanilla JS in a single `<script>` tag; already solved in `BasicScripts.astro`. |
| Contact form | ❌ NO | Native HTML form submit to Formspree — don't hydrate. Only add Preact if you need live client-side validation beyond `required` / `pattern`. |
| Pre-qualification form (80% funding eligibility) | ⚠️ MAYBE | If it's a single-step form: vanilla + HTML. If it's a multi-step wizard: Preact. |

**Why Preact over the alternatives:**

| Criterion | Preact | Svelte | Solid | React | Vue |
|---|---|---|---|---|---|
| Runtime size | 3 kB | 2 kB (compile-time) | 7 kB | 45 kB | 35 kB |
| Dev familiarity in the team | High (React-like) | Low | Low | High | Medium |
| Astro integration maturity | Gold tier (official) | Gold tier | Official | Official | Official |
| Ecosystem (charts, form libs) | Full React compat via `preact/compat` | Smaller | Smaller | Largest | Medium |
| TypeScript | ✅ | ✅ | ✅ | ✅ | ✅ |

Preact gives 95 % of React's ecosystem (including `recharts`, `nivo`, `react-hook-form`, `zod` resolvers) for 1/15th the bundle. Svelte compiles smaller, but the team doesn't have Svelte experience — pay the byte tax to keep the hiring pool wide. Solid is technically superior but still niche; not worth the context switch for a marketing site's handful of widgets.

**Vanilla JS alone is NOT enough** for the ROI calculator and the motion/shock/GPS visualization because (a) you'd re-implement reactive state, (b) SVG/Canvas charts are painful without a component model, (c) the 7 use-case pages all share the same widget — Preact gives you one component to maintain, not seven copies.

**Hydration guidance:**
- Above-the-fold widget? `client:load`.
- Below-the-fold? `client:visible`. Defaults for Konvoi — the ROI calculator is likely in the middle of the pricing page, the sensor viz is below the hero on each use-case page.
- Idle-loaded enhancement (e.g., a copy-share button)? `client:idle`.

**Chart library (inside Preact islands):**
- For the motion/shock/GPS sensor viz: **`uplot`** (lightweight, fast, TypeScript) or **`visx`** primitives (React-compat via `preact/compat`).
- For the ROI calculator output bar: plain CSS + percentage bars — no chart library needed.
- Avoid **Chart.js** (large, imperative, awkward inside Preact).

**Confidence: HIGH.** Verified [@astrojs/preact docs](https://docs.astro.build/en/guides/integrations-guide/preact/), currently 5.1.1, Astro 6 compatible.

---

#### 7. Motion / Visual Animation — Motion One + Tailwind v4 `@theme` keyframes

| Tech | Version | Why |
|---|---|---|
| `motion` | `^12.x` (formerly "motion one" / now just `motion`) | Modern successor to Framer Motion; 2.3 kB mini `animate()`, 5.1 kB `scroll()` using the ScrollTimeline API; works with vanilla DOM **or** with a framework (including Preact via `motion/react`). |
| Tailwind v4 `@theme` keyframes | Built-in | For trivial animations (fade-up, fade-in, slight transform) define `@keyframes` + `--animate-*` tokens directly in `src/assets/styles/tailwind.css`. Zero dependencies. |

**Install:**
```bash
pnpm add motion
```

**Pattern:**

```astro
<!-- src/components/widgets/AnimatedSection.astro -->
<section id="hero" data-animate>
  <slot />
</section>

<script>
  import { animate, inView } from 'motion';
  inView('[data-animate]', ({ target }) => {
    animate(target, { opacity: [0, 1], y: [16, 0] }, { duration: 0.6, easing: 'ease-out' });
  }, { margin: '-10%' });
</script>
```

**For trivial reveals (e.g. list items fading in):** skip Motion entirely — use a `@keyframes` + `.animate-fade-up` utility defined in Tailwind v4's `@theme`:

```css
/* src/assets/styles/tailwind.css */
@theme {
  --animate-fade-up: fade-up 600ms ease-out both;
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
Then in markup: `<div class="animate-fade-up">…</div>`.

**Handling view transitions (`ClientRouter`):**
Motion scripts are bundled modules — they execute once on first load. To re-run on page transitions:
```ts
document.addEventListener('astro:page-load', () => {
  inView('[data-animate]', /* ... */);
});
```
Always prefer `astro:page-load` over `astro:after-swap` (the former fires on both fresh loads AND transitions; the latter only on transitions).

**Why Motion over the alternatives:**

| Criterion | Motion | GSAP | AOS | Framer Motion (Preact) | Tailwind @keyframes |
|---|---|---|---|---|---|
| Bundle (tree-shaken, typical use) | 2.3–5 kB | 23 kB core + plugins | 8 kB | 32 kB (React-only) | 0 kB |
| ScrollTimeline (hardware-accelerated scroll) | ✅ | ❌ (ScrollTrigger is JS-driven) | ❌ | ✅ | ❌ (CSS-only) |
| SSR / Astro islands safe | ✅ | ✅ | ❌ (known hydration crashes in meta-frameworks in 2026) | ✅ | ✅ |
| License | MIT | ⚠️ Free for commercial with GSAP 4 (2025+) but historically restrictive plugins (ScrollTrigger Pro $99) | MIT | MIT | — |
| Vanilla JS API | ✅ | ✅ | ✅ (declarative only) | ❌ (React-only) | CSS only |
| DX | Modern, imperative | Powerful but opinionated | Declarative but limited | Modern | CSS-native |

**Recommendation tree:**
1. **Can CSS + `@keyframes` do it?** Yes → use Tailwind v4 `@theme` animations. No JS cost.
2. **Need scroll-linked or stagger animations?** Yes → Motion's `animate()` + `inView()` + `stagger()`.
3. **Complex cinematic timeline with scrub + pin?** That's GSAP ScrollTrigger territory — but Konvoi has no such requirement in `PROJECT.md`. Do not add GSAP speculatively.

**What NOT to use and why:**

- **AOS (Animate on Scroll)** — 2026 SSR hydration bugs in meta-frameworks are well-documented; known to crash on first paint in Astro islands.
- **GSAP** — overkill for a conversion-focused marketing site. Reserve for a future landing-page project if ever needed.
- **Framer Motion** — now just called "Motion"; the React-specific wrapper adds 32 kB vs 2.3 kB for the vanilla/Preact route. Use `motion` (not `framer-motion`, the old package).

**Confidence: HIGH.** Verified [motion.dev docs](https://motion.dev/) and [Motion with Astro guide on Netlify Developers](https://developers.netlify.com/guides/motion-animation-library-with-astro/).

---

#### 8. Email / Contact Handoff on Netlify — Still Formspree

**Can Netlify Forms replace Formspree once deployed on Netlify?** Yes, technically. **Should it?** Only as a fallback.

**Prefer Formspree on Netlify because:**

1. **Portability.** If Konvoi ever migrates off Netlify (Cloudflare Pages, Vercel, self-hosted), Netlify Forms break silently. Formspree endpoints keep working.
2. **Billing predictability.** Netlify migrated to credit-based billing in 2025. Form submissions consume credits shared with build minutes, bandwidth, and function invocations. If another Netlify project bursts, Konvoi's forms pause. Formspree's submission allowance is isolated.
3. **Sales-team UX.** Formspree has a full inbox UI, reply-from-dashboard, Slack/email forwarding, archives, submission search. Netlify Forms has a spartan dashboard and email notifications only.
4. **Spam defense.** Both use Akismet. Formspree additionally supports reCAPTCHA / hCaptcha / Turnstile with first-class toggles; Netlify requires more wiring.
5. **Multi-recipient routing.** Formspree lets the Konvoi team route "customer advisor" submissions to Justus and "investor / press" submissions to Heinz with a single config. Netlify Forms needs a custom function for that.

**Use Netlify Forms only if:**
- Formspree's $10/mo tier becomes a blocker (doubtful — 200 submissions/mo is well above the current contact volume).
- Konvoi wants a truly zero-external-dependency stack for privacy optics. In that case Netlify Forms data sits inside Netlify's infra — still a US processor with EU regions, still needs a DPA, so it's not a clean DSGVO win over Formspree.

**Astro wiring for Netlify Forms (reference only — not the primary recommendation):**

```html
<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contact" />
  <p hidden><input name="bot-field" /></p>
  <input type="email" name="email" required />
  <button type="submit">Send</button>
</form>
```
Netlify detects the `data-netlify` attribute at build time and auto-generates the endpoint.

**Confidence: MEDIUM.** The portability + billing argument is solid; the DSGVO argument is neutral (both are US-based processors with SCCs).

---

## Alternatives Considered — Summary Table

| Category | Recommended | Alternative | Why Not |
|---|---|---|---|
| i18n | Astro built-in | `astro-i18next` | Archived, Astro 5+ incompatible |
| i18n | Astro built-in | `@inlang/paraglide-astro` | Overkill for 2 locales + static content |
| Forms | Formspree | Netlify Forms | Host lock-in, credit billing volatility |
| Forms | Formspree | FormSubmit | Leaks recipient email in page source |
| Forms | Formspree | Basin / Getform | No meaningful differentiation, no EU residency edge |
| Cookie banner | vanilla-cookieconsent | Cookiebot / Usercentrics | Paid CMP overkill for a near-zero-tracker site |
| Cookie banner | vanilla-cookieconsent | Klaro! | Valid alternative, smaller community, less polished docs |
| Cookie banner | vanilla-cookieconsent | Custom-rolled | Legal defensibility risk — do not DIY |
| Analytics | Plausible Cloud EU | Google Analytics 4 | Requires cookie banner, US transfers, 50 kB script, DSGVO-contested |
| Analytics | Plausible Cloud EU | Pirsch | Close runner-up (German company) — pick if team prefers DE-HQ over EE-HQ |
| Analytics | Plausible Cloud EU | Fathom | Canadian company, EU Isolation is an addon |
| Analytics | Plausible Cloud EU | Matomo Cloud | Heavier (23 kB script), cookies on by default |
| Analytics | Plausible Cloud EU | Umami Cloud | US-hosted cloud — loses the EU-residency story |
| Image CDN | sharp + unpic + Netlify CDN | Cloudinary | Cost, vendor lock-in, no visitor-facing benefit at this scale |
| Image CDN | sharp + unpic + Netlify CDN | ImageKit | Same — no incremental value |
| Client framework | Preact | Svelte | Team has no Svelte experience; Preact's React-compat ecosystem is larger |
| Client framework | Preact | Solid | Superior DX in theory but smaller ecosystem, niche talent pool |
| Client framework | Preact | Vanilla JS | Not enough for shared reactive widgets (ROI calc, sensor viz) |
| Motion | Motion | GSAP | Overkill; plugin licensing historically tricky |
| Motion | Motion | AOS | SSR hydration bugs in 2026 meta-frameworks |
| Motion | Motion | Framer Motion (old) | Replaced by `motion` — don't install `framer-motion` |

---

## Installation — Single pnpm Command Summary

```bash
# Core additions
pnpm astro add preact                          # adds @astrojs/preact + preact

# Direct installs
pnpm add vanilla-cookieconsent                 # cookie banner
pnpm add motion                                # animation library

# Removals (v1 cleanup)
pnpm remove @astrolib/analytics                # replace with inline Plausible script
pnpm remove @astrojs/partytown                 # not needed once GA is dropped
```

**No package install required for:** Astro i18n (built-in), Formspree (hosted), Plausible (hosted script), Netlify Image CDN (platform feature).

---

## Configuration Checklist

- [ ] `astro.config.ts` — add `i18n` block, remove `partytown`, trim `image.domains` to `konvoi.eu` only
- [ ] `src/config.yaml` — remove or repurpose the `analytics.vendors.googleAnalytics.id` field (it'll be unused once we drop GA)
- [ ] `src/layouts/Layout.astro` — add Plausible script tag + vanilla-cookieconsent init
- [ ] `src/content.config.ts` — add `locale` to each collection's schema
- [ ] `src/pages/` — mirror every DE page under `src/pages/en/`
- [ ] `src/components/common/Metadata.astro` — emit `<link rel="alternate" hreflang>` for DE/EN pairs
- [ ] `src/data/` — restructure into `de/` and `en/` subfolders per collection
- [ ] `public/locales/de/cookie-consent.json` and `public/locales/en/cookie-consent.json` — translation files for the banner
- [ ] Remove `src/components/common/SplitbeeAnalytics.astro` (dead code)
- [ ] Remove `public/decapcms/` (not used, per PROJECT.md)

---

## Sources

- [Astro i18n routing docs](https://docs.astro.build/en/guides/internationalization/) — HIGH confidence
- [Astro v6 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v6/) — HIGH confidence
- [Astro 6 release blog](https://astro.build/blog/astro-6/) — HIGH confidence
- [Astro Internationalization 2026 guide (Mavik Labs)](https://www.maviklabs.com/blog/internationalization-astro-2026/) — MEDIUM, confirms Astro 6 behavior
- [paraglide-js Astro docs](https://inlang.com/m/gerre34r/library-inlang-paraglideJs/astro) — HIGH (official inlang)
- [Formspree Privacy Policy + SCCs](https://formspree.io/legal/privacy-policy/) — HIGH
- [Formspree pricing 2026](https://formspree.io/plans) — HIGH
- [Netlify Forms 2026 alternatives breakdown (FormGrid)](https://formgrid.dev/blog/netlify-forms-is-getting-expensive-here-are-the-best-alternatives-in-2026) — MEDIUM, confirms credit-billing pain points
- [orestbida/cookieconsent v3 GitHub](https://github.com/orestbida/cookieconsent/) — HIGH, v3.1.0 verified
- [vanilla-cookieconsent docs](https://cookieconsent.orestbida.com/) — HIGH
- [Kukie.io: Cookie Consent Germany TDDDG](https://kukie.io/blog/cookie-consent-germany-ttdsg-dsgvo) — MEDIUM, 2026 German legal angle
- [DSGVO-Vergleich: Cookie-Banner rechtssicher 2026](https://dsgvo-vergleich.de/cookie-banner-rechtssicher-2026/) — MEDIUM
- [Plausible — EU-hosted web analytics](https://plausible.io/eu-hosted-web-analytics) — HIGH
- [Plausible — Made in EU, hosted in Germany](https://plausible.io/blog/made-in-eu) — HIGH
- [Plausible privacy-focused analytics](https://plausible.io/privacy-focused-web-analytics) — HIGH
- [Plausible + Astro integration guide](https://santychuy.com/blog/plausible-astro-simplified-web-analytics-guide) — MEDIUM
- [Pirsch Analytics](https://pirsch.io/for-developers) — HIGH, German alternative to Plausible
- [astro-pirsch-proxy](https://github.com/freshcodes/astro-pirsch-proxy) — MEDIUM
- [Privacy-First Analytics Compared (Nuxt Scripts)](https://scripts.nuxt.com/learn/privacy-first-analytics-compared) — MEDIUM
- [unpic-img Astro service](https://unpic.pics/img/astro/) — HIGH
- [unpic Netlify CDN provider](https://unpic.pics/providers/netlify/) — HIGH
- [Astro islands architecture](https://docs.astro.build/en/concepts/islands/) — HIGH
- [@astrojs/preact integration docs](https://docs.astro.build/en/guides/integrations-guide/preact/) — HIGH, v5.1.1
- [motion.dev — JavaScript & React animation library](https://motion.dev) — HIGH
- [Motion with Astro guide (Netlify Developers)](https://developers.netlify.com/guides/motion-animation-library-with-astro/) — HIGH
- [Motion vs GSAP comparison](https://motion.dev/docs/gsap-vs-motion) — MEDIUM (vendor-published, useful for API mapping)
- [Best JS scroll animation libraries 2026](https://cssauthor.com/best-javascript-scroll-animation-scrollytelling-libraries/) — MEDIUM
- [CSS Author — Scroll Animation Tools 2026](https://cssauthor.com/scroll-animation-tools/) — MEDIUM, confirms AOS hydration bugs
- [Astro view transitions with scripts](https://docs.astro.build/en/guides/view-transitions/) — HIGH
- [Headless Form Backend Comparison 2026 (CustomJS)](https://www.customjs.space/blog/headless-form-backend-comparison/) — MEDIUM
- [Klaro! Consent Manager](https://www.klaro.org/) — HIGH (open-source German alternative)

---

*STACK.md — generated 2026-04-20 for the konvoi.eu Astro rebuild.*
