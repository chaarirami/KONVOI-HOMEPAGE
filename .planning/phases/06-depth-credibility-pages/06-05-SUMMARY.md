---
phase: 06-depth-credibility-pages
plan: "05"
subsystem: contact-page
tags: [contact, events, maps, dsgvo, i18n]
dependency_graph:
  requires: [src/content.config.ts, src/layouts/PageLayout.astro, src/components/widgets/CallToAction.astro]
  provides: [src/pages/kontakt.astro, src/pages/en/contact.astro, src/content/event/*.md]
  affects: [sitemap, contact-conversion-funnel]
tech_stack:
  added: []
  patterns:
    - "Short-form I18N-07 event collection with bilingual name/description fields"
    - "DSGVO click-to-load Maps: iframe data-src only, JS copies to src on explicit click"
    - "Build-time event filtering: endDate + T23:59:59Z >= now at build time"
key_files:
  created:
    - src/content/event/logimat-2026.md
    - src/content/event/tapa-emea-2026.md
    - src/content/event/transfrigoroute-2026.md
    - src/content/event/iaa-transportation-2026.md
    - src/content/event/translogistica-2026.md
    - src/content/event/hubday-2026.md
    - src/pages/kontakt.astro
    - src/pages/en/contact.astro
  modified: []
decisions:
  - "iframe uses data-src (never src) in initial HTML — satisfies CONT-02 and DSGVO Telemediengesetz; Maps URL only loaded after explicit user click"
  - "Build-time event filter uses endDate + T23:59:59Z to hide events the day after they end; events without endDate always shown"
  - "Contact phone numbers hardcoded in pages (public business numbers already on live Jimdo site)"
  - "Initials-only avatar (JM / HL) used in contact cards — no photo assets available yet"
metrics:
  duration: "~8 min"
  completed_date: "2026-04-23"
  tasks: 2
  files: 8
---

# Phase 06 Plan 05: Contact Page (Events + Click-to-Load Maps + Contact Cards) Summary

**One-liner:** DSGVO-compliant contact page with two named contact cards, click-to-load Google Maps (iframe never loads until user clicks), build-time-filtered upcoming events list (6 entries), and consult CTA — in both DE and EN.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create 6 event content entries | 08f4ae9 | src/content/event/*.md (6 files) |
| 2 | DE and EN contact pages | ea3440e | src/pages/kontakt.astro, src/pages/en/contact.astro |

## What Was Built

### Task 1: 6 Event Content Entries

Six event markdown files created in `src/content/event/` using the short-form I18N-07 schema (bilingual name/description fields, shared startDate/endDate/location/url):

| Event | Dates | Location |
|-------|-------|----------|
| LogiMAT 2026 | 10–13 Mar 2026 | Messe Stuttgart |
| TAPA EMEA Conference 2026 | 12–14 May 2026 | Amsterdam |
| Transfrigoroute International 2026 | 9–11 Jun 2026 | Barcelona |
| IAA Transportation 2026 | 22–27 Sep 2026 | Hannover |
| TransLogistica 2026 | 6–8 Oct 2026 | Krakau |
| HubDay 2026 | 17 Nov 2026 | Hamburg |

All 6 entries include `endDate` for build-time filtering.

### Task 2: Contact Pages (DE + EN)

**`src/pages/kontakt.astro`** and **`src/pages/en/contact.astro`** built with:

- **CONT-01 D-14:** Two named contact cards (Justus Maenninghoff + Heinz Luckhardt) with initials avatar, role, clickable `tel:` link, clickable `mailto:` link
- **CONT-02 D-15:** Google Maps click-to-load pattern — iframe has `data-src` only in initial HTML; inline JS copies `data-src` to `src` only on "Karte laden" / "Load map" button click. No Maps network request until explicit consent.
- **CONT-03 D-16:** Upcoming events list from `getCollection('event')`, filtered at build time: `endDate + T23:59:59Z >= now`. Events without endDate always shown. Sorted ascending by startDate.
- **CONT-04 D-17:** `<CallToAction>` at end of each page — DE: "Bereit fur ein Gesprach?" / EN: "Ready to talk?"

EN page mirrors DE with: English copy, `event.data.name.en` / `event.data.description?.en`, `en-GB` date formatting, "Load map" / "Hide map" toggle labels.

## Threat Model Mitigations Applied

| Threat | Mitigation | Verified |
|--------|-----------|---------|
| T-06-05-01: Pre-consent Maps iframe load | iframe has NO src attribute; data-src only. JS on click copies data-src to src. | grep confirms no `<iframe ... src=` in initial HTML |
| T-06-05-03: Inline script data flow | Script reads only `dataset.src` (server-rendered static string) — no user-controlled data flows to iframe.src | Code review |
| T-06-05-04: Stale past events | endDate + T23:59:59Z >= build-time now — events hidden day-after-end | Filter logic in both pages |

## Deviations from Plan

None — plan executed exactly as written.

Note: `pnpm build` in the main repo directory fails due to pre-existing translation parity errors in `src/content/post/de/` (4 DE blog posts without EN siblings, staged by a parallel wave agent). These errors are outside the scope of this plan. The new `event` collection (short-form I18N-07) is explicitly excluded from the parity check by `scripts/check-translation-parity.ts`. No errors from the new files were found in `pnpm check:astro`.

## Known Stubs

- Contact card avatars show initials (JM / HL) inside a coloured circle. No actual photos are wired. These will be replaced when team photos are available (tracked in team page plan or future asset delivery).

## Self-Check

- [x] `src/content/event/logimat-2026.md` — FOUND
- [x] `src/content/event/tapa-emea-2026.md` — FOUND
- [x] `src/content/event/transfrigoroute-2026.md` — FOUND
- [x] `src/content/event/iaa-transportation-2026.md` — FOUND
- [x] `src/content/event/translogistica-2026.md` — FOUND
- [x] `src/content/event/hubday-2026.md` — FOUND
- [x] `src/pages/kontakt.astro` — FOUND
- [x] `src/pages/en/contact.astro` — FOUND
- [x] Commit 08f4ae9 — FOUND
- [x] Commit ea3440e — FOUND

## Self-Check: PASSED
