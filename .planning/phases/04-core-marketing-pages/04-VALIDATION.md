---
phase: 4
slug: core-marketing-pages
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-23
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | No test framework (marketing site — `pnpm check` is sole gate) |
| **Config file** | `package.json` scripts section |
| **Quick run command** | `pnpm check` |
| **Full suite command** | `pnpm build && pnpm check` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm check`
- **After every plan wave:** Run `pnpm build`
- **Before `/gsd-verify-work`:** Full build must be green + manual page review
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | HOME-01..08 | — | N/A (static pages) | build | `pnpm build` | ✅ | ⬜ pending |
| 04-02-01 | 02 | 1 | PROD-01..05 | — | N/A (static pages) | build | `pnpm build` | ✅ | ⬜ pending |
| 04-03-01 | 03 | 2 | UC-01..05 | — | N/A (static pages) | build | `pnpm build` | ✅ | ⬜ pending |
| 04-04-01 | 04 | 2 | VERT-01..04 | — | N/A (static pages) | build | `pnpm build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `preact` + `@astrojs/preact` — required for SensorDataViz island (UC-03)
- [ ] `uplot` (or chosen chart library) — required for SensorDataViz (UC-03, UC-04)
- [ ] `src/data/sensor-scenarios/` — fixture directory for JSON scenario files

*No test framework install needed — `pnpm check` (astro-check + eslint + prettier) is the project's automated gate.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Video hero renders with poster fallback | HOME-02 | Visual rendering, no video asset yet | Load `/` in browser, confirm poster image displays in hero section |
| SensorDataViz animates on scroll | UC-03 | Scroll-triggered animation requires browser interaction | Open any use-case page, scroll to viz section, confirm animation plays |
| Language switcher navigates correctly | HOME-01 | Route-specific navigation requires manual click-through | Click DE/EN toggle on every Phase 4 page, confirm correct target |
| Cross-links between use cases and verticals | UC-05, VERT-03 | Link integrity across 11 pages | Click every cross-link on use-case and industry pages |
| Mobile nav dropdown works | REQ-NAV-01 | Responsive behavior requires device/viewport testing | Resize to mobile viewport, test hamburger menu + Use Cases dropdown |
| DE + EN copy quality | All | Content review is subjective | Read through all pages in both locales, verify voice.md compliance |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
