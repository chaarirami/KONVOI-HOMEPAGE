# www.konvoi.eu — Current Site Overview

Snapshot of the live Jimdo-hosted site as of 2026-04-20, captured for the Astro rebuild.

## 1. Company

- **Legal entity:** KONVOI GmbH
- **Address:** Harburger Schlossstraße 6-12, 21079 Hamburg, Germany
- **Phone:** +49 40 766293660
- **Founders:** Heinz Luckhardt (CEO/Managing Director), Alexander Jagielo, Divya Settimali (only Heinz + Alexander present on team page)
- **Origin:** 2020 spin-off from Hamburg University of Technology (TUHH); backed by Startup Port
- **Funding:** seed 06/2022; seven-figure round 01/2025 led by 1750 Ventures (VGH Versicherungen investment arm)
- **Tagline (homepage meta):** "SECURITY TECH MADE IN GERMANY"
- **Positioning:** "The first preventive solution for your fleet — against cargo & diesel theft, sabotage & driver assaults"

## 2. Product

**KONVOI Security** — a full-service, sensor-based security system for truck trailers.

- B2B Security-as-a-Service: hardware rented + software + maintenance bundled at a single annual price
- Hardware: compact hidden casings, GPS + LTE, shock + motion sensors, 7-day self-sufficient battery
- Software: AI classifies motion/shock/GPS patterns as threat vs non-threat; triggers alarm chain + action plan
- Add-ons: **KONVOI Camera Module** (cloud clips on events), **KONVOI Logbook** (PDF summary of stops/anomalies per trip, customer-shareable)
- Funding eligibility: included in German de-minimis "Zuwendung für Maßnahmen zur Vermeidung von Diebstählen" — up to 80% reimbursement
- Installation: own team, ≤120 min per trailer

## 3. Target market

B2B — German/EU transport & logistics companies with fleets of trailers. Vertical emphasis on:

- High-value transports (pharma, precious metals, cosmetics, medical tech, tobacco, electronics)
- Cooling / temperature-controlled transports
- Intermodal transports
- "Weitere Transporte" (other transports — catch-all)

## 4. Use cases (core value props)

1. Cargo theft — €8 B/yr in Europe (TAPA 2024); €1.2M for a single pharma shipment
2. Diesel theft — up to €2,000 per incident + tank damage + op delays
3. Equipment theft — €600/tire, €3,600/trailer
4. Damaged trailers — incident reconstruction for insurance
5. Driver assaults — preventive deterrence + measures
6. Stationary time optimization
7. Transparency of all operations (esp. externally executed coupling processes)

## 5. Information architecture (current nav)

Primary nav (EN):

1. **KONVOI Security** (product / "the solution") — with sub:
   - Hardware
   - Data Services
   - FAQ
2. **Team**
3. **Contact**

Vertical nav (industries):
- High-Value Transports
- Cooling Transports
- Intermodal Transports
- Weitere Transporte (other)

Language toggle: EN / DE (default DE). English site lives under `/en/`. Some pages (team jobs, `/aktuelles` blog) stay German-only.

## 6. Homepage sections (EN, in order)

1. Hero — "The first preventive solution for your fleet" + sub "We secure against cargo & diesel theft, sabotage & driver assaults" + 90s autoplay video w/ sound
2. **KONVOI is unique in three areas** — 3 columns: **Preventive / Learning / Independent** (each 1-sentence explainer)
3. Customer logos row — "Our solution is among others already in use at" (unspecified logos)
4. Testimonials — 3 quotes:
   - Schumacher Group (Katrin Sophie Schumacher) — 1-week install story
   - JJX Logistics — high-value transports
   - Greilmeier Spedition & Logistik — compliance + damage tracking
5. "Known from" — press logos
6. "Supported by" — partners/investors logos
7. Contact CTA — email + phone, "individual exchange"
8. Footer — Impressum / Datenschutz / Cookie-Einstellungen

## 7. Subpage summaries

- **/the-solution/** — product overview: sensors, how-it-works (Detection → Classification → Measures), range of services (standard + camera add-on + logbook), funding eligibility
- **/the-solution/hardware/** — specs, install process, install video, full-service pitch
- **/the-solution/data-services/** — the 7 use-cases deep-dive with motion/shock/GPS data breakdowns
- **/the-solution/faq/** — grouped FAQ: General / Alarm System / Technical Details
- **/en/high-value-transports/** — vertical landing: cargo theft + driver assaults + operations transparency
- **/en/cooling-transports/** — vertical landing: damaged trailers + diesel theft + transparency
- **/en/intermodal-transports/** — vertical landing: damaged trailers + transparency + equipment theft
- **/en/team/** — team bios (currently 9 people: Alexander, Heinz, Rami, Trinh, Harsha, Jonas, Sushmita, Eric, Justus) + job openings (Founder's Associate, B2B Sales AE, Full-stack Eng Internship, IoT/Embedded Eng Internship, Embedded Systems Internship, Data Scientist Internship, Data Scientist FT, Initiative Application)
- **/en/contact/** — two contacts (Justus Männinghoff — customer advisor; Heinz Luckhardt — investors/marketing/applicants) + upcoming events (LogiMAT, TAPA, Transfrigoroute, IAA Transportation, Translogistica, HubDay 2026) + Google Maps embed
- **/aktuelles** — blog / news (German only)

## 8. Contacts (surfaced on the live site)

- Customer inquiries: Justus Männinghoff (Customer Advisor) — +49 157 51959636
- Investors / marketing / applications: Heinz Luckhardt (MD) — +49 163 9067060
- Main line: +49 40 766293660

## 9. Current tech & constraints

- Hosted on **Jimdo Dolphin** (proprietary builder — this is what we're replacing)
- Fonts: Montserrat (sans) + PT Serif (serif)
- Only `/en/` is bot-reachable; DE root blocks anonymous bots (403) — rebuild should fix crawlability
- Heavy use of cookie banners for YouTube + Google Maps embeds
- Blog (`/aktuelles`) is German-only
- No pricing page, no self-serve signup, no demo-request form — all conversions funnel through direct phone/email contact

## 10. Implications for the Astro rebuild

- **Primary CTA pattern:** "Request individual exchange" / book a consult (not sign up, not try free)
- **Social proof:** customer logos + 3 testimonials + press logos + partner logos — existing component (Brands widget) maps directly
- **Core vertical landings:** 3-4 industry pages with shared structure (hero → problem → 3-sensor-data proof → CTA)
- **Job board:** team page doubles as careers page; 7+ positions with PDF attachments
- **Events calendar:** upcoming trade shows — currently static list, candidate for content collection
- **i18n:** DE/EN parity required from day 1; DE is default for the German market
- **Data-services explainer:** 7 use-cases × (motion / shock / GPS) visualisations — probably the heaviest custom component to design
- **Funding eligibility blurb** (80% de-minimis) is a strong German market hook — surface prominently
- **No blog migration yet:** `/aktuelles` content is German, template has blog — keep as placeholder, decide migration later
