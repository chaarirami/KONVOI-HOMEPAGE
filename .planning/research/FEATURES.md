# Feature Landscape

**Domain:** B2B security-tech / trailer-telematics corporate marketing site (konvoi.eu rebuild)
**Researched:** 2026-04-20
**Downstream consumer:** requirements definition → roadmap phases
**Primary conversion goal:** booked consult call (direct-sales motion, no self-serve, DE + EN markets)

---

## Orientation

This research categorises features into four buckets:

- **TABLE STAKES** — If these are missing, a buyer in the Konvoi ICP (transport/logistics ops decision-maker evaluating a €X00k/yr security-tech commitment) loses trust or bounces. Competitors all ship these.
- **DIFFERENTIATORS** — Features that let Konvoi win against Phillips Connect, Samsara, Geotab, CargoSafe, Starcom, etc. Most of these exploit Konvoi-specific angles (German market, preventive-vs-reactive, 80% de-minimis, sensor-data storytelling).
- **ANTI-FEATURES** — Explicitly do not build. Either wrong for the direct-sales motion, hostile to the ICP, or expensive bloat with no conversion lift for this stage.
- **V2 CANDIDATES** — Valuable but not required for launch parity + uplift vs the Jimdo original.

Complexity sizing: **S** = <1 phase (a few days content + one component), **M** = 1 phase (new page type + form / content collection), **L** = 2+ phases (custom interactive widget, major component family).

Benchmarks drawn from: Phillips Connect (closest direct competitor — US trailer-security with sensor suite), Samsara / Motive / Geotab (fleet-telematics category leaders — sets buyer expectations for UX polish), Bringg (B2B logistics-tech, strong platform-page pattern), plus 2026 B2B SaaS marketing-site benchmarks from Directive, Webstacks, Poweredbysearch, Wisepops.

---

## TABLE STAKES

These are the features a trailer-telematics buyer has seen on every competitor site. Ship all of these or the rebuild does not beat the Jimdo baseline.

### Conversion infrastructure

| Feature | Why expected | Complexity | v1? | Notes |
|---------|--------------|------------|-----|-------|
| **Primary "Book a consult" CTA** on every page (hero + sticky top-nav + end-of-page) | Single-goal landing pages convert 13.5% vs 10.5% for multi-CTA; every competitor leads with "Request a demo" / "Book a consult" | S | v1 | CTA copy in DE (`Beratung anfragen`) + EN (`Book a consult`). Must survive scroll — sticky header keeps it one click away. |
| **Short lead-capture form** (3–5 fields: name, company, email, phone, optional message) | 3–5 fields is the B2B conversion sweet spot; moving from 4→3 fields lifts conversion by ~50%; >5 fields drops conversion ~30% | S | v1 | Hard cap at 5 fields. Phone is optional (prefill nothing). No "job title" (we can enrich). Honeypot + Turnstile for spam. |
| **Form-adjacent social proof** (customer logo bar or 1 testimonial next to form) | Trust signals at the conversion point lift forms; every high-converting B2B demo page ships them | S | v1 | Re-use Brands widget next to the form. |
| **Contact page with named human + direct channels** (phone, email, office, map) | B2B buyers cross-check "is there a real person answering" before booking; current Konvoi pattern (Justus + Heinz with photos and direct numbers) is already strong | S | v1 | Carry the two-contact split: customer advisor vs MD/investor. Google Maps embed gated behind cookie-consent (DSGVO). |
| **Thank-you / confirmation state** after form submit (in-page message + what happens next + expected response time) | Buyers in long sales cycles want to know "did it send, who's calling me, when?" Reduces follow-up ticket volume | S | v1 | "Justus will call you within 1 business day" — sets the expectation the direct-sales motion relies on. |
| **Cookie consent banner** (opt-in, granular for analytics / embedded YouTube / Maps) | DSGVO / TTDSG legal requirement in Germany; fines up to €20M; Jimdo original already ships this | S | v1 | Use a lightweight cookieless-first stack: Plausible (no banner needed) + explicit per-embed consent for YouTube/Maps. Avoid Cookiebot/Usercentrics-class CMPs — they're overkill and slow. |
| **Impressum** (legal notice — managing directors, commercial register, VAT, Berufshaftpflicht if applicable) | §5 TMG / §18 MStV requirement. "Easily identifiable, directly accessible" on every page footer | S | v1 | Carry current konvoi.eu Impressum. |
| **Datenschutzerklärung** (privacy policy — data processing register, third-party processors, user rights) | DSGVO requirement. Missing / stale = legal risk + buyer due-diligence fail | S | v1 | Needs per-embed paragraphs (YouTube, Maps, Plausible, form processor, LinkedIn Insight Tag if used). |
| **Footer with full nav + legal** (product / use-cases / pricing / company / legal) | Buyer navigation convention. Current Jimdo has almost nothing here — real upgrade target. | S | v1 | No more `#` placeholder links (known bug from CONCERNS.md). |

### Content pages

| Feature | Why expected | Complexity | v1? | Notes |
|---------|--------------|------------|-----|-------|
| **Homepage** with hero → social proof → problem → solution → outcomes → final CTA | Canonical B2B SaaS homepage structure. Every competitor follows this. | M | v1 | Map: Hero (`Security Tech Made in Germany` + book-a-consult) → Customer logos → Preventive-vs-reactive narrative → 3 rotating testimonials → Press strip → Partners/investors → Final CTA. |
| **Product / "How it works" page** explaining hardware + software + alarm chain + installation | Buyers need to understand the artefact before booking a call. Phillips Connect, Samsara all have a dedicated product page. | M | v1 | Maps to current `/the-solution/` + `/the-solution/hardware/`. Include install-video embed (YouTube + consent-gated). |
| **Use-case pages** (cargo theft, diesel theft, equipment theft, damaged trailers, driver assaults, stationary-time, transparency) | SEO: one page per theft-type ranks independently; sales: the visitor self-selects their problem. | L (7 pages × shared widget) | v1 | REQ-UC-01. All share the motion/shock/GPS data-viz widget. |
| **Industry / vertical landing pages** (high-value, cooling, intermodal, other) | Vertical self-selection; each vertical has different theft-type mix (high-value → cargo; cooling → diesel + damage; intermodal → equipment + transparency) | M | v1 | REQ-VERT-01. Cross-link into the relevant use-case pages. |
| **Case-studies index + individual case study pages** | Social proof is the #1 thing B2B buyers read before booking; existing Schumacher / JJX / Greilmeier quotes are underused in current site | M | v1 | REQ-CASE-01. Structure: Result headline → Snapshot box (industry, fleet size, which theft types) → Situation → Solution → Outcome (with numbers where possible) → Quote → CTA. |
| **Team page** (bios + photos) | B2B buyers for a 9-person seed-stage company want to see the faces; founder credibility is part of the sale | S | v1 | REQ-COMPANY-01. Carry current 9-person roster. |
| **Careers / open-positions page** | Team page doubles as careers. Listing roles is a recruiting channel + a signal of momentum. | S | v1 | REQ-COMPANY-02. Markdown-per-role, mailto apply link. No ATS integration v1. |
| **Blog / news** (`/aktuelles` DE, `/en/news` EN) | SEO equity from existing posts; content for outbound nurture; investor/press-mention archive | M | v1 | REQ-BLOG-01. Port existing German posts; EN posts accumulate over time. |
| **Events / trade-show calendar** | Konvoi attends LogiMAT, TAPA, Transfrigoroute, IAA Transportation, Translogistica, HubDay. Existing "upcoming events" on contact page maps here. | S | v1 | REQ-EVENTS-01. Content collection, auto-hide past events. |

### Technical / UX

| Feature | Why expected | Complexity | v1? | Notes |
|---------|--------------|------------|-----|-------|
| **DE + EN parity from launch** | German company, German primary market, EN for EU / investor traffic. Current site already bilingual. | L | v1 | REQ-I18N-01. Astro i18n, `/` = DE, `/en/` = EN. hreflang pairs. |
| **Explicit language switcher** (top-right nav, persists choice in cookie) | Users expect explicit toggle; auto-redirect on Accept-Language is hostile when user explicitly landed on a locale URL | S | v1 | REQ-NAV-02. Label each option in its own language (`DE` / `EN`, not "German" / "English"). Never auto-redirect away from a prefixed URL. Store choice in a cookie to avoid bouncing the user between locales on each navigation. |
| **Responsive mobile layout** (hamburger nav, 44×44px tap targets, <3s mobile load) | 68%+ of B2B buyers research on mobile; bad mobile = instant bounce | M | v1 | AstroWind template already responsive; audit against Konvoi content. |
| **SEO hygiene** (unique titles, meta descriptions, OG images, XML sitemap, robots.txt, canonicals) | Basic search visibility; currently broken (AstroWind canonicals + config). | S | v1 | Fix all items in CONCERNS.md `[HIGH]` RSS/OG/canonical section. |
| **Analytics** (privacy-first: Plausible or Matomo) | Measure what's working post-launch; GA4 is DSGVO-hostile for a German company. | S | v1 | Prefer Plausible (cookieless, EU-hosted, no banner needed). |
| **OG social-share images** (1200×628, per-page override possible) | LinkedIn, Slack, X previews — Konvoi shares a lot on LinkedIn; default OG image matters | S | v1 | Replace AstroWind default OG image (see CONCERNS.md). |
| **Sticky header nav** with primary CTA always visible | Every modern B2B SaaS site ships this; conversions correlate with "CTA always one click away" | S | v1 | Already present in AstroWind Header widget; rebrand + rewire links. |
| **Flattened primary nav** (Product / Use Cases / Case Studies / Pricing / Company / Contact) | Current Jimdo nav is deep and buries Use Cases under "Data Services" sub of Product | S | v1 | REQ-NAV-01. |

---

## DIFFERENTIATORS

Features that let Konvoi stand out. Most exploit Konvoi-specific hooks that competitors can't easily replicate.

### High-value differentiators (ship in v1 if possible)

| Feature | Value proposition | Complexity | v1? | Notes |
|---------|-------------------|------------|-----|-------|
| **Motion / shock / GPS sensor-data visualisation widget** (reused across 7 use-case pages) | Visualising actual sensor traces classifying threat vs non-threat is the single most compelling proof the product works. Competitors show marketing copy; Konvoi can show the thing. | L | v1 | REQ-UC-01 shared widget. Each use-case page gets a canned dataset showing "diesel theft event", "cargo theft event", "shock during driving (non-threat)", etc. Technical bar: needs to work with keyboard + reduced motion + be crawlable (SSR'd labels). |
| **80% de-minimis funding-eligibility page with pre-qualification form** | Uniquely German hook — up to 80% reimbursement via the federal de-minimis programme for anti-theft measures. Functions as a free-money CTA: "Check if you qualify" converts better than "Book a consult" for cold traffic. Competitors (esp. US-based Phillips Connect, Samsara) literally cannot offer this. | M | v1 | REQ-FUND-01. Short form: fleet size, vertical, country. Manual qualification follow-up by Konvoi team. Strong SEO target: `de-minimis Förderung Diebstahlschutz`. |
| **Preventive-vs-reactive positioning** (explicit page or narrative section) | Category framing — most competitors (CargoSafe, Starcom, Samsara trailer solutions) are *reactive*: alert after the event. Konvoi prevents. Own this comparison. | S | v1 | A section on the homepage + a dedicated sub-section on the product page. Visual: "Without Konvoi: incident → damage → €€€ loss → insurance + police. With Konvoi: anomaly detected → alarm chain → deterrence → no damage." |
| **ROI / savings calculator** (interactive: fleet size + vertical + parking frequency → estimated annual theft savings) | Converts visitors who are actively evaluating into hand-raisers; ROI calcs lift lead capture on B2B sites (Innovaxis, ClearDigital, Vizion patterns). Exploits the TAPA €8B/yr stat with a personalised number. | L | v1 | REQ-ROI-01. Output: "Your fleet could save €XXk/year — €YYk of that is funded by de-minimis. Book a consult to confirm." Pre-fills the consult form with the calc inputs. |
| **Customer-visible "German-made" trust signals** (hardware designed + assembled in Germany; support in German; TUHH spin-off; Hamburg office) | `Security Tech Made in Germany` is the tagline. Reinforce with specific proof points: Hamburg office map, hardware photos from German facility, German-speaking support SLA. German ICPs deeply care about data-residency + hardware provenance. | S | v1 | Scatter across homepage hero, product page, about page, trust page. |
| **Press & funding strip** (1750 Ventures, VGH, TUHH, Startup Port, press mentions) | Konvoi has seed + 7-figure Jan-2025 round + recognisable press mentions. Competitors in the trailer-telematics space are often private family-owned or giant-Cos — a well-funded scale-up at human scale is a real differentiator. | S | v1 | Carry current "known from" + "supported by" strips with updated logos. |
| **Dedicated trust / compliance page** (DSGVO, hardware certification, data-residency, ISO-progress roadmap) | Enterprise security buyers demand this — Samsara, Geotab, Bringg all ship a trust center. Even without full SOC2/ISO yet, a transparent page stating "what we do, what we're working towards, how data is handled" lifts credibility. | M | v1 | Don't claim certs you don't have. If working towards TISAX (automotive-relevant) or ISO 27001, say so with a target date. Include: data-residency (EU hosting), sub-processor list, security-contact email, DSGVO processing register link. |
| **Published pricing (Standard / +Camera / +Logbook)** | Most trailer-telematics competitors hide all pricing behind `Contact Sales`. Publishing it — even as "from €X per trailer per month" — is a trust differentiator and qualifies out unserious inquiries. Konvoi has well-defined tiers (existing site has them in prose). | S | v1 | REQ-PRICE-01. Publish "starting at €X/trailer/year" for each tier with "Book a consult for a custom quote." Don't publish precise enterprise-discount ladders. |

### Moderate differentiators

| Feature | Value proposition | Complexity | v1? | Notes |
|---------|-------------------|------------|-----|-------|
| **Multilingual SEO strategy** (not just parity — distinct DE-market + EN-market keyword targets) | German buyers search `Ladungsdiebstahl verhindern`, `LKW-Diebstahlschutz`, `Kühltrailer Sicherheit`; EN audience searches `cargo theft prevention`, `trailer security system`. Page slugs + meta should target these independently. | S | v1 | DE and EN URL slugs can differ. E.g., `/anwendungsfaelle/ladungsdiebstahl` and `/en/use-cases/cargo-theft`. |
| **Installation-time proof point** ("≤120 min per trailer, our team, anywhere in DE") | Reduces the biggest enterprise-buyer objection for hardware rollout: "how painful is the deployment?" Call out on product page + in case studies. | S | v1 | Already in current site copy; surface it more prominently. |
| **Short video content** (90-second hero video, 60-second install video, 30-second product-explainer) | Current Jimdo site uses autoplay hero video with sound — noisy but signals product confidence. Modern pattern: muted autoplay + captions + play-with-sound affordance. | M | v2 | Autoplay muted + captions for accessibility + DSGVO (YouTube embed consent-gated, or self-host MP4 to avoid consent entirely). |
| **Case-study filter by vertical / theft-type** | When prospects visit case-studies, they want "like my business." Small filter at the top (`High-value`, `Cooling`, `Intermodal`) increases page depth. | S | v2 | Only useful once there are ≥6 case studies; v1 likely has ≤4. |
| **Downloadable one-pager PDF per use-case / vertical** (ungated) | Sales team asks for "something to leave behind after a call." Ungated = trust-building, discoverable in search. | S | v2 | Generated from the use-case page content, linked from the page. |
| **LinkedIn Insight Tag / retargeting pixel** | LinkedIn is where transport/logistics-ops people live. Tag allows retargeting campaigns + conversion tracking for outbound. | S | v1 if LinkedIn ads are active, else v2 | DSGVO-sensitive — cookie consent gating required. |
| **Structured data (Schema.org)** — Organization, LocalBusiness, Product, BreadcrumbList, FAQPage | Rich results in Google search (logo, breadcrumbs, FAQ expanders, reviews). Competitors largely miss this. | S | v1 | AstroWind has some built-in; audit + extend. |

---

## ANTI-FEATURES

Explicitly **do not build**. Each has a specific reason.

| Anti-feature | Why avoid | What to do instead |
|--------------|-----------|--------------------|
| **Self-serve signup / free trial / "Try it free"** | Konvoi sells via direct sales; there is no self-serve product. Offering a fake "Start free trial" CTA would deceive visitors + waste their time. (Already in PROJECT.md Out of Scope.) | Single primary CTA: "Book a consult." Never use "Start free," "Sign up," "Get started." |
| **Customer portal / authenticated area on marketing site** | Marketing site ≠ product. Any customer-facing operational tooling belongs in a separate app. (Already in PROJECT.md Out of Scope.) Mixing them explodes the security surface + DSGVO liability. | Keep marketing static; customer ops lives in the (separate) product. |
| **Decap CMS admin at `/decapcms/`** | Currently scaffolded but broken (wrong content folder, no backend). Authoring workflow is markdown + PR. Leaving the admin route exposed = supply-chain + auth risk. | Delete `public/decapcms/`. Authors ship content via PR (REQ-CONTENT-01). |
| **Full ATS integration (Greenhouse / Lever / Personio)** | 7 open roles, ~2 hires/quarter at 9-person seed stage. A mailto link is sufficient and has higher apply-completion than a 4-page ATS form. | Markdown role pages + `mailto:bewerbung@konvoi.eu`. |
| **HubSpot / Pipedrive CRM auto-forward at launch** | Adds a vendor dependency, a cost, and DSGVO review. v1 forms should email the two sales contacts (Justus + Heinz) directly via Formspree. | Formspree → named-contact email. CRM wiring is a later milestone (PROJECT.md Out of Scope). |
| **Chatbot / conversational AI widget (Drift, Intercom, ZoomInfo Chat)** | Strong research evidence chatbots work for high-traffic mid-market SaaS (Drift ROI stats), but Konvoi is a 9-person direct-sales company — no one is staffing the chat queue, and bot-only qualification adds friction without human follow-through. Visitors prefer "Book a call with Justus" to "Chat with a bot." | Sticky "Book a consult" CTA. Email + phone prominently. Reconsider chatbot only if traffic grows past ~5k uniques/mo and there's a dedicated SDR. |
| **Live-chat widget (Tawk, Crisp, Intercom Messenger)** | Same reason as chatbot + guaranteed under-staffing for a 9-person team means visitors sit in a queue that never responds. Worse than no chat. | Phone + email + calendar-booking (Calendly-style). |
| **Language auto-redirect on Accept-Language** | Hostile UX: a buyer sends a DE URL to an English-speaking colleague → colleague gets auto-redirected to EN and loses context. Best-practice guidance (i18next, Next.js i18n docs) is explicit-toggle-only; never override an explicit URL choice. | Visible language switcher; persist choice in cookie after first click; never redirect from a locale-prefixed URL. |
| **Aggressive exit-intent popup offering newsletter / discount** | Exit-intent works in ecommerce B2C. For enterprise B2B security-tech, an interrupting popup screams "we have nothing to say" and damages trust. 2026 research (Clearbit, Directive) explicitly flags exit-intent-newsletter as "overdone in B2B SaaS." | None. If exit-intent is attempted later, only offer high-value content ("download our 12-page cargo-theft 2026 report") — never discounts. |
| **Generic gated whitepapers / eBooks behind lead form** | 73% of B2B buyers actively avoid gated content (Scalarly 2026); generic thought-leadership converts poorly at the Konvoi stage. A buyer landing on a Konvoi page wants to evaluate Konvoi, not hand over their email for a generic report. | Ungated resources (one-pagers, TAPA-data explainers). If anything is gated, it should be product-adjacent (e.g., "de-minimis funding application checklist" — practical). |
| **Customer / partner / reseller portal** | Not a category Konvoi plays in at this stage. No reseller program yet. | Out of scope. If reseller motion matures, build in a separate app. |
| **Social-media wall / embedded Twitter / LinkedIn feed** | Noisy, third-party JS, DSGVO-liable, updates unpredictably, looks like a startup trying to pad the page. Nobody converts via "look at our tweets." | Link to LinkedIn in the footer. Let LinkedIn be LinkedIn. |
| **Full-text site search** | <100 pages of content. Site search is expensive (Algolia / Pagefind / Typesense) for near-zero buyer utility at this size. Blog-specific search is also unnecessary at <20 posts. | Flat nav + good IA replaces search. Blog category/tag filters if post count grows. |
| **Auto-playing hero video with sound** | Current Jimdo pattern. 2026 accessibility + "autoplay with sound" browser restrictions + mobile data considerations make this hostile. | Muted autoplay with captions + play-with-sound affordance, or click-to-play with a strong poster frame. |
| **AI-generated content / auto-personalised hero ("Hello $visitor_company")** | Creepy at the Konvoi-stage buyer persona. Research shows AI-personalisation lifts ~25% in some contexts — but those contexts are SMB / self-serve SaaS, not a €X00k direct-sales security-tech deal. Personalisation here reads as "we scraped you from LinkedIn." | Segment-level personalisation via distinct vertical landing pages is sufficient. |
| **Cookiebot / Usercentrics heavy CMP** | Large JS bundle, slows the site, requires ongoing config. For a cookieless-first stack (Plausible + per-embed consent toggles), overkill. | Lightweight self-hosted consent banner or none-needed-if-cookieless. |
| **Keeping AstroWind demo pages / Decap CMS / MIT licence / Unsplash imagery** | All called out in CONCERNS.md — these are technical debt, not anti-features per se, but they cannot ship to konvoi.eu. | Delete per CONCERNS.md `[CRITICAL]` and `[HIGH]` items. |

---

## V2 CANDIDATES (post-launch iteration)

These are valuable but deliberately deferred to keep v1 shippable. Order loosely by expected impact.

| Feature | Why v2 not v1 | Complexity | Trigger for building |
|---------|--------------|------------|----------------------|
| **Interactive ROI calculator refinements** (vertical-specific defaults, shareable URL, per-vertical outputs) | v1 ship the basic calculator; iterate based on which inputs visitors actually touch | M | After 2-3 months of usage analytics |
| **Video case studies** (60–90s customer quotes from Schumacher / JJX / Greilmeier) | Requires customer time + video production; text quotes are the v1 baseline | M | When one customer agrees to film |
| **Webinar / on-demand demo library** | Needs one good recording first; gated with form | M | After first live webinar run |
| **Interactive product demo / sandbox** (click-through of the dashboard) | Requires product-team integration + design work. Phillips Connect-style interactive demos are high-effort. | L | When inbound volume justifies the build |
| **Blog taxonomy / topic clustering for SEO** | v1 is simple chronological list; clusters once there are ≥20 posts | S | At ≥20 posts |
| **Customer comparison pages** (Konvoi vs Phillips Connect, Konvoi vs Samsara trailer) | High-intent SEO but requires fair, accurate competitor claims + legal review | M | When cost-per-lead on branded search gets expensive |
| **FAQ page / schema.org FAQPage** | Current site has grouped FAQ under product. Standalone page + rich-results schema. | S | Once the top 20 sales-call questions are documented |
| **Press page / media kit / logo-downloads** | Investor and press traffic grows with funding announcements | S | After next funding round or major PR |
| **Integrations page** | Only relevant if Konvoi has documented integrations with TMS / WMS / fleet platforms. Current product is stand-alone; integrations page is premature. | M | Once ≥3 partner integrations exist |
| **Developer / API docs** | Only if Konvoi exposes a customer-facing API. Current product doesn't. | L | When an API is a product feature |
| **Trust center with live SOC2 / ISO status dashboard** (via Drata, Vanta, SafeBase) | v1 trust page is a hand-written page. Once certifications are live, a dynamic dashboard is warranted. | M | After first SOC2 / ISO 27001 / TISAX cert completes |
| **Multi-locale expansion (NL, FR, IT, PL)** | v1 is DE + EN. Expand when sales picks a next market. | L | When a new country has sales momentum |
| **Webinar / events registration** (instead of mailto to Heinz for an event slot) | v1 is a static events list. Registration flow only worth building for Konvoi-hosted events (webinars, workshops), not trade-show attendance. | M | When Konvoi runs its own webinars |

---

## Feature Dependencies

```
                                 ┌──────────────────────────────┐
                                 │ REQ-I18N-01 (Astro i18n)     │
                                 │ REQ-CONTENT-01 (md+PR)        │
                                 │ REQ-FORMS-01 (Formspree)      │
                                 │ REQ-BRAND-01 (brand applied)  │
                                 └───────────────┬──────────────┘
                                                 │ (foundation: every page depends on these)
                                                 ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Homepage        │ ←── │ Customer logos  │ ←── │ Case studies    │ ←── │ Testimonials    │
│ (REQ-HOME-01/02)│     │ + press strip   │     │ (REQ-CASE-01)   │     │ (component)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
         │
         ├── references ──▶ Product page (REQ-PRODUCT-01)
         │                        │
         │                        └── references ──▶ Use-case pages (REQ-UC-01) ◀── shared sensor-data widget
         │                                                    ▲
         ├── references ──▶ Vertical landings (REQ-VERT-01) ──┘
         │
         ├── references ──▶ Pricing page (REQ-PRICE-01) ──────┐
         │                                                     │
         ├── references ──▶ Funding page (REQ-FUND-01) ────────┤
         │                                                     ▼
         └── references ──▶ ROI calculator (REQ-ROI-01) ──▶ consult form (REQ-FORMS-01)
                                                                ▲
                Contact page (REQ-CONTACT-01) ──▶ two-contact split + events (REQ-EVENTS-01)
                Team page (REQ-COMPANY-01) ──▶ open positions (REQ-COMPANY-02) ──▶ mailto apply
                Blog (REQ-BLOG-01) ──▶ RSS + content-collection schema with locale field
```

**Critical path (must unblock first):**

1. `REQ-I18N-01` + `REQ-CONTENT-01` + `REQ-FORMS-01` + `REQ-BRAND-01` — foundational plumbing; every page needs them.
2. Cleanup from CONCERNS.md `[CRITICAL]` / `[HIGH]` — demo-pages deletion, config.yaml rewrite, canonical fix, OG image, analytics pick, cookie-consent decision.
3. Shared components — Brands widget rewire, Hero with CTA, Header with sticky nav + language switcher, Footer with real links, Metadata with hreflang.
4. Content pages in priority order: Homepage → Product → Use-cases (shared widget blocks these) → Verticals → Case-studies → Pricing → Funding → Contact/Events → Team/Careers → Blog.
5. Post-content: ROI calculator, Trust page, SEO polish, analytics wire-up.

---

## MVP Recommendation

**Ship to replace Jimdo with these features in v1:**

Table stakes (non-negotiable):
1. Homepage with hero + social proof + preventive narrative + final CTA
2. Product / how-it-works page
3. All 7 use-case pages with shared motion/shock/GPS widget
4. 4 vertical landing pages
5. Case-studies index + 3 customer stories
6. Pricing page (3 tiers, published starting prices)
7. Team + careers page
8. Contact page (two-contact split + events calendar)
9. Blog with DE posts ported + EN started
10. Consult-booking form (Formspree-backed)
11. Impressum + Datenschutz + cookie banner
12. DE/EN parity with explicit switcher
13. Primary CTA sticky in header, repeated in footer
14. SEO hygiene + OG images + sitemap + analytics (Plausible)

Differentiators (v1 for launch impact):
15. Shared motion/shock/GPS sensor-data visualisation widget
16. 80% de-minimis funding-eligibility page + pre-qual form
17. Preventive-vs-reactive positioning throughout
18. ROI / savings calculator
19. Published pricing with "starting at" numbers
20. Trust / compliance page (honest about what's certified now vs in-progress)
21. Distinct DE + EN keyword-targeted slugs

**Defer to v2:**
- Video case studies, on-demand demo, interactive product sandbox, competitor comparisons, integrations page, trust-center live dashboard, FAQ page as standalone, press kit, additional locales

**Explicitly not ever:**
- Self-serve signup, customer portal on marketing site, Decap CMS admin, chatbot, live chat, language auto-redirect, exit-intent popups, social-media walls, generic gated whitepapers

---

## Sources

2026 benchmark research:

- [2026 B2B SaaS Conversion Rate Benchmarks - SaaS Hero](https://www.saashero.net/content/2026-b2b-saas-conversion-benchmarks/)
- [B2B SaaS Conversion Rate Benchmarks 2026 - Growthspree](https://www.growthspreeofficial.com/blogs/b2b-saas-conversion-rate-benchmarks-2026-funnel-stage-vertical)
- [Lead Forms in B2B: Balancing Data Depth and Conversion - Brixon](https://brixongroup.com/en/lead-forms-in-b2b-the-perfect-balancing-act-between-data-depth-and-conversion-rate)
- [Lead Generation Forms Best Practices - Monday.com](https://monday.com/blog/crm-and-sales/lead-generation-forms/)
- [What's the Best Number of Form Fields - REM Web Solutions](https://www.remwebsolutions.com/blog/best-form-fields-number)
- [The Best CTA Placement Strategies For 2026 - LandingPageFlow](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages)
- [Must Have Components for Demo Request Pages 2026 - Genesys Growth](https://genesysgrowth.com/blog/components-demo-request-pages)
- [15 B2B Website Best Practices for 2026 - Directive](https://directiveconsulting.com/blog/15-b2b-website-best-practices-for-2026-built-for-buyers-not-just-browsers/)
- [B2B Web Design Best Practices That Convert in 2026 - Intuitia](https://www.intuitia.tech/blog/b2b-website-design)
- [Top B2B SaaS Website Examples 2026 - Veza Digital](https://www.vezadigital.com/post/best-b2b-saas-websites-2026)
- [25 Best B2B SaaS Websites 2025 - Webstacks](https://www.webstacks.com/blog/best-b2b-saas-websites)
- [Why B2B SaaS Companies Add Enterprise Pricing Tiers - Monetizely](https://www.getmonetizely.com/articles/why-b2b-saas-companies-add-enterprise-pricing-tiers-strategic-benefits-and-revenue-impact)
- [The Future of SaaS Pricing in 2026 - Medium](https://medium.com/@aymane.bt/the-future-of-saas-pricing-in-2026-an-expert-guide-for-founders-and-leaders-a8d996892876)
- [20 Best SaaS Integrations Pages - Powered By Search](https://www.poweredbysearch.com/learn/best-saas-integrations-pages/)
- [Exit-Intent Popup A/B Tests for B2B SaaS - Atticus Li](https://blog.atticusli.com/exit-intent-popup-a-b-tests-for-b2b-saas-discount-thresholds-animation-speed-and-headline-formulas-that-save-abandoning-visitors/)
- [Growth experiment: least spammy exit intent popup - Clearbit](https://clearbit.com/blog/growth-experiment-3-a-quest-for-the-least-spammy-exit-intent-popup-on-the-internet)
- [B2B Case Study Template 2025 - Logonaut](https://www.thelogonaut.com/post/b2b-case-study-template-10-examples-2025-best-practices)
- [Anatomy of a High Converting Case Study - Motarme](https://motarme.com/anatomy-of-a-high-converting-case-study/)
- [Content Marketing for B2B Lead Gen 2026 - Scalarly](https://scalarly.com/blog/content-marketing-b2b-lead-generation-2026/)
- [B2B Chatbot ROI 2026 - MarketBetter](https://marketbetter.ai/blog/best-ai-sales-chatbots-2026/)
- [i18n Locale Detection Best to Worst - Lingo.dev](https://dev.to/lingodotdev/every-way-to-detect-a-users-locale-from-best-to-worst-369i)
- [Next.js Internationalization Guide](https://nextjs.org/docs/pages/guides/internationalization)
- [How to Run a Website in Germany - All About Berlin](https://allaboutberlin.com/guides/website-compliance-germany)
- [DSGVO-konforme Formulare & Leadgenerierung - Park Sieben](https://www.park-sieben.com/blog/dsgvo-formulare-lead-generierung-inbound-marketing)
- [Trust Center Solutions - Secfix](https://www.secfix.com/product/trust-center)
- [B2B Lead Gen ROI Calculator How-to - ClearDigital](https://www.cleardigital.com/insights/roi-calculator-tools-for-b2b-lead-generation)

Competitor benchmarks (IA + feature references):

- [Phillips Connect - Fleet Theft Prevention](https://www.phillips-connect.com/solutions/asset-protection/fleet-theft-prevention)
- [Phillips Connect - Trailer Cargo Security](https://www.phillips-connect.com/solutions/asset-protection/trailer-cargo-security)
- [Geotab - One Platform Total Fleet Management](https://www.geotab.com/)
- [Samsara vs Geotab comparison](https://www.samsara.com/resources/samsara-vs-geotab)
- [Samsara vs Motive comparison](https://www.samsara.com/resources/samsara-vs-motive)
- [Bringg Platform](https://www.bringg.com/platform)
- [CargoNet - Cargo Theft Prevention Network](https://www.cargonet.com/)
- [CargoSafe - Concept Nova](https://www.concept-nova.com/solutions/cargosafe)
- [Starcom GPS Global](http://www.starcomgpsglobal.com/)

---

*Research complete: 2026-04-20. Next step: requirements definition consumer reads this file.*
