---
phase: 3
slug: i18n-content-collections
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-22
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | pnpm check (astro check) + pnpm build |
| **Config file** | astro.config.ts, tsconfig.json |
| **Quick run command** | `pnpm check` |
| **Full suite command** | `pnpm build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm check`
- **After every plan wave:** Run `pnpm build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | I18N-01 | — | N/A | build | `pnpm check` | ✅ | ⬜ pending |
| 03-01-02 | 01 | 1 | I18N-02 | — | N/A | build | `pnpm check` | ✅ | ⬜ pending |
| 03-02-01 | 02 | 1 | I18N-03 | — | N/A | build | `pnpm check` | ✅ | ⬜ pending |
| 03-02-02 | 02 | 1 | I18N-04 | — | N/A | build | `pnpm check` | ✅ | ⬜ pending |
| 03-03-01 | 03 | 2 | I18N-05 | — | N/A | build | `pnpm check` | ✅ | ⬜ pending |
| 03-03-02 | 03 | 2 | I18N-06 | — | N/A | build | `pnpm check` | ✅ | ⬜ pending |
| 03-03-03 | 03 | 2 | I18N-07 | — | N/A | build | `pnpm check` | ✅ | ⬜ pending |
| 03-04-01 | 04 | 3 | I18N-08 | — | N/A | build+script | `pnpm build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/check-translation-parity.ts` — stub for I18N-08 parity check
- [ ] `src/content/` directory structure — de/en subdirectories for long-form collections

*Existing infrastructure covers type checking (pnpm check) and build validation (pnpm build).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Language switcher preserves route | I18N-04 | Requires browser navigation | Navigate to a page, click DE/EN toggle, verify URL changes to translated equivalent |
| Missing EN page returns 404 | I18N-01 | Requires dev server request | Start dev server, navigate to `/en/nonexistent/`, verify 404 response |
| `<html lang>` attribute correct | I18N-01 | Requires rendered HTML inspection | Build, inspect dist HTML files for correct `lang="de"` and `lang="en"` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
