# Phase 7: SEO, Consent & Launch - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-26
**Phase:** 07-seo-consent-launch
**Areas discussed:** Legal page content, Cookie consent scope, Jimdo redirect mapping, Analytics & DNS

---

## Legal Page Content

| Option | Description | Selected |
|--------|-------------|----------|
| Existing text | Adapt Jimdo Impressum/Datenschutz | ✓ |
| Draft from scratch | Write new legal text | |

**User's choice:** Provided verbatim Impressum and Datenschutz text from existing Jimdo site. Adapt for new processors (Web3Forms, Turnstile, Rybbit, Cal.eu, Netlify) and remove Jimdo/Google Analytics/e-commerce sections.
**Notes:** No Datenschutzbeauftragter required. Verantwortlich gemas SS 18 MStV: Heinz Luckhardt.

---

## Cookie Consent Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal (Maps/YouTube only) | Gate only third-party embeds | ✓ |
| Comprehensive (all cookies) | Gate all non-essential cookies | |

**User's choice:** Provided existing Jimdo cookie policy showing categories. New site much simpler — only Essential (Cloudflare/Turnstile) and Functional (Maps/YouTube). No Performance or Marketing categories needed.
**Notes:** Rybbit cookieless, not in banner. vanilla-cookieconsent v3 replaces Jimdo Consent Manager.

---

## Jimdo Redirect Mapping

| Option | Description | Selected |
|--------|-------------|----------|
| Exhaustive crawl | Map every old Jimdo URL | |
| Minimal redirects | Catch obvious paths only | ✓ |
| Skip entirely | No redirects | |

**User's choice:** Minimal — old site has minimal SEO value. No exhaustive crawl needed.
**Notes:** User confirmed low SEO equity on Jimdo site.

---

## Analytics & DNS

| Option | Description | Selected |
|--------|-------------|----------|
| Plausible Cloud EU | Managed, cookieless | |
| Rybbit (self-hosted) | Open-source, cookieless, self-hosted | ✓ |
| No analytics | Skip analytics | |

**User's choice:** Rybbit self-hosted instead of Plausible. Netlify is fresh setup — DNS cutover during execution.
**Notes:** User provided GitHub repo: https://github.com/rybbit-io/rybbit

---

## Claude's Discretion

- OG image generation approach
- Schema.org structured data placement
- Exact CSP directives

## Deferred Ideas

None
