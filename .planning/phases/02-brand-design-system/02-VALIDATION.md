---
phase: 2
slug: brand-design-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-22
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | pnpm build + grep gates (no unit test framework — marketing site) |
| **Config file** | astro.config.ts |
| **Quick run command** | `pnpm build` |
| **Full suite command** | `pnpm build && grep -rn "fonts.googleapis.com" dist/ && echo "FAIL: Google Fonts detected" || echo "PASS"` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build`
- **After every plan wave:** Run full suite command (build + grep checks)
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | BRAND-01 | — | N/A | build+grep | `pnpm build && ! grep -rn "fonts.googleapis.com" dist/` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | BRAND-02 | — | N/A | build | `pnpm build` | ✅ | ⬜ pending |
| 02-01-03 | 01 | 1 | BRAND-04 | — | N/A | grep | `grep -n "@custom-variant dark" src/assets/styles/tailwind.css` | ✅ | ⬜ pending |
| 02-02-01 | 02 | 1 | BRAND-03 | — | N/A | file-check | `test -f src/assets/favicons/favicon.svg && test -f src/assets/favicons/favicon.ico` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 2 | BRAND-05 | — | N/A | file-check | `test -f src/data/brand/canonical.yaml` | ❌ W0 | ⬜ pending |
| 02-03-02 | 03 | 2 | BRAND-06 | — | N/A | file-check | `test -f src/data/brand/voice.md` | ❌ W0 | ⬜ pending |
| 02-04-01 | 04 | 2 | BRAND-07 | — | N/A | manual | Lighthouse + Axe audit | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements (pnpm build + grep + file checks).
- No additional test framework needed for Phase 2.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Montserrat + PT Serif render visually correct | BRAND-01 | Font rendering requires visual inspection | Open dev server, inspect h1-h6 font-family in DevTools |
| Dark mode toggle produces correct theming without flicker | BRAND-02, BRAND-04 | Flicker is a visual artifact | Toggle light/dark/system in browser, observe transition |
| Favicon displays Konvoi mark in browser tab | BRAND-03 | Browser tab rendering is visual | Open site in Chrome/Firefox, check tab icon |
| Colour contrast passes WCAG AA | BRAND-07 | Requires Axe/Lighthouse tool run | Run Lighthouse accessibility audit, check contrast findings |
| Focus-visible and keyboard nav work | BRAND-07 | Requires interactive testing | Tab through page elements, verify focus rings visible |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
