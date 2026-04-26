---
phase: 07-seo-consent-launch
plan: 01
subsystem: legal-pages
tags: [legal, impressum, datenschutz, gdpr, dsgvo, tdddg, i18n]
dependency_graph:
  requires: []
  provides: [legal-pages, impressum-de, impressum-en, datenschutz-de, datenschutz-en, routemap-legal-keys]
  affects: [language-switcher, sitemap, footer-links]
tech_stack:
  added: []
  patterns: [prose-typography-container, PageLayout-astro]
key_files:
  created:
    - src/pages/impressum.astro
    - src/pages/en/impressum.astro
    - src/pages/datenschutz.astro
    - src/pages/en/datenschutz.astro
  modified:
    - src/i18n/routeMap.ts
decisions:
  - "Legal pages use PageLayout.astro (with Header/Footer) matching existing simple content pages like kontakt.astro"
  - "routeMap impressum/datenschutz keys added at top of object for visibility"
  - "Cal.eu documented as external link only — no embedding, no data transfer on our domain"
  - "Rybbit legal basis cites § 25 Abs. 2 Nr. 2 TDDDG (not TTDSG) per D-02 requirement"
metrics:
  duration: 4 minutes
  completed_date: "2026-04-26T12:52:01Z"
  tasks_completed: 2
  files_created: 4
  files_modified: 1
---

# Phase 07 Plan 01: Legal Pages (Impressum + Datenschutz) Summary

Bilingual §5 TMG Impressum and DSGVO/TDDDG Datenschutz pages created at German slugs for both DE and EN locales, removing all Jimdo-era processor references and adding all actual processors used in the rebuilt site.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create DE and EN Impressum pages | 0eb1099 | src/pages/impressum.astro, src/pages/en/impressum.astro, src/i18n/routeMap.ts |
| 2 | Create DE and EN Datenschutz pages | 514d334 | src/pages/datenschutz.astro, src/pages/en/datenschutz.astro |

## Verification Results

All success criteria met:

- `dist/impressum/index.html` contains: KONVOI GmbH, HRB 168019, USt-IdNr.: DE347608487, Heinz Luckhardt, Universalschlichtungsstelle, Bildnachweise
- `dist/en/impressum/index.html` contains: Legal Notice, HRB 168019
- `dist/datenschutz/index.html` contains: Netlify, Web3Forms, Cloudflare Turnstile, Rybbit, TDDDG, vanilla-cookieconsent, Betroffenenrechte
- `dist/en/datenschutz/index.html` contains: Privacy Policy, Netlify
- Neither page contains: Plausible, Formspree, Jimdo (all 0 matches confirmed)
- `src/i18n/routeMap.ts` has both `impressum` and `datenschutz` keys
- Build: 97 pages built cleanly (up from 95)
- Both pages: `robots: { index: true, follow: true }`

## Decisions Made

- **PageLayout.astro pattern** used (same as kontakt.astro) — includes Header and Footer components
- **routeMap keys** added at top of object with comment "Legal pages (Phase 7)" for visibility
- **Cal.eu** documented as external link only (no embed, no data) per CONTEXT.md D-02
- **Rybbit legal basis** cites § 25 Abs. 2 Nr. 2 TDDDG i.V.m. Art. 6 Abs. 1 lit. f DSGVO — cookieless analytics exemption
- **Turnstile cookie** documented under § 25 Abs. 2 Nr. 2 TDDDG technical necessity exemption
- **vanilla-cookieconsent v3** referenced in both DE and EN Datenschutz pages

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all legal content is fully authored and wired. No placeholder text or empty data sources.

## Threat Flags

None — legal pages are static HTML with no new network endpoints, auth paths, or user-supplied input. Trust boundaries as specified in threat model (browser→Netlify CDN only).

## Self-Check: PASSED

- [x] `dist/impressum/index.html` exists
- [x] `dist/en/impressum/index.html` exists
- [x] `dist/datenschutz/index.html` exists
- [x] `dist/en/datenschutz/index.html` exists
- [x] Commit 0eb1099 exists (Task 1)
- [x] Commit 514d334 exists (Task 2)
- [x] No new files left untracked
