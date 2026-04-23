---
phase: 6
slug: depth-credibility-pages
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-23
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | pnpm check (astro check + eslint + prettier) — no unit test framework per project constraints |
| **Config file** | package.json scripts, eslint.config.js, .prettierrc.cjs |
| **Quick run command** | `pnpm check:astro` |
| **Full suite command** | `pnpm check && pnpm build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm check:astro`
- **After every plan wave:** Run `pnpm check && pnpm build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | CASE-01..04 | — | N/A | build | `pnpm build` | ✅ | ⬜ pending |
| 06-02-01 | 02 | 1 | BLOG-01..04 | — | N/A | build | `pnpm build` | ✅ | ⬜ pending |
| 06-03-01 | 03 | 2 | TEAM-01..03 | — | N/A | build | `pnpm build` | ✅ | ⬜ pending |
| 06-04-01 | 04 | 2 | CAREER-01..03 | — | N/A | build | `pnpm build` | ✅ | ⬜ pending |
| 06-05-01 | 05 | 2 | CONT-01..04 | T-06-01 | Click-to-load Maps (no iframe before consent) | manual | visual inspection | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. `pnpm check` and `pnpm build` are the automated gates. No additional test framework needed per project constraints.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Click-to-load Google Maps | CONT-02 | DSGVO consent interaction requires browser | 1. Load /kontakt/ 2. Verify static screenshot visible 3. Click "Karte laden" 4. Verify iframe loads 5. Verify no iframe in page source before click |
| Events auto-hide past dates | CONT-03 | Date comparison at build time; verify no past events render | 1. Add test event with past endDate 2. Run pnpm build 3. Verify event not in dist/ output |
| Mailto prefilled subject | CAREER-02 | mailto: link behavior requires email client | 1. Click "Bewerben" on each role 2. Verify email client opens with correct prefilled subject |
| Blog pagination | BLOG-03 | Visual page navigation behavior | 1. Visit /aktuelles/ 2. Verify pagination renders when posts exceed page size |
| RSS feed validity | BLOG-02 | Feed XML structure validation | 1. Fetch /aktuelles/rss.xml 2. Validate XML structure contains items with title, link, pubDate |

*All other behaviors are verified by successful `pnpm build` (Astro check validates content schemas, routes, and TypeScript types).*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
