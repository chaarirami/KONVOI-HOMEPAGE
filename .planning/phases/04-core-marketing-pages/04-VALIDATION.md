---
phase: 04
slug: core-marketing-pages
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-24
---

# Phase 04 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | pnpm check (astro-check + eslint + prettier) + pnpm build |
| **Config file** | astro.config.ts, eslint.config.js, .prettierrc |
| **Quick run command** | `pnpm check` |
| **Full suite command** | `pnpm build` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm check`
- **After every plan wave:** Run `pnpm build`
- **Before `/gsd-verify-work`:** Full build must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | HOME-01..08 | — | N/A | build | `pnpm build` | ✅ | ⬜ pending |
| 04-02-01 | 02 | 1 | PROD-01..05 | — | N/A | build | `pnpm build` | ✅ | ⬜ pending |
| 04-03-01 | 03 | 2 | UC-01..05 | — | N/A | build | `pnpm build` | ✅ | ⬜ pending |
| 04-04-01 | 04 | 2 | VERT-01..04 | — | N/A | build | `pnpm build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No additional test framework needed per PROJECT.md constraint: "Tests beyond `pnpm check` + grep + link-check — marketing site; unit tests not worth the maintenance cost at v1."

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Homepage sections render in correct order | HOME-01..08 | Visual layout verification | Open DE + EN homepage, verify 8 sections present in order |
| Background video plays | HOME-02 | Browser media behavior | Open homepage, confirm muted autoplay video in hero |
| Scroll-driven trailer callouts | PROD-02 | Scroll interaction | Scroll product page, verify sensor callouts appear |
| Animated 3-step flow | PROD-03 | Scroll animation | Scroll product page, verify Detection→Classification→Measures animates |
| Video placeholders load | UC-03 | Media element | Open each use-case page, verify video element renders |
| Cross-links between pages | UC-05, VERT-03 | Navigation flows | Click through use-case → vertical and vertical → use-case links |
| DE/EN route pairs work | I18N-03 | Bilingual navigation | Toggle language on each page type, verify correct route |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
