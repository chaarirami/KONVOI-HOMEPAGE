---
phase: 5
slug: conversion-funnel
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-24
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (if installed) / pnpm build (static validation) |
| **Config file** | none — Wave 0 installs if needed |
| **Quick run command** | `pnpm build` |
| **Full suite command** | `pnpm build && pnpm check` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build`
- **After every plan wave:** Run `pnpm build && pnpm check`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | PRICE-01..04 | T-05-01 | Pricing data from single source | build | `pnpm build` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 1 | ROI-01..05 | T-05-02 | ROI formula validated | build | `pnpm build` | ❌ W0 | ⬜ pending |
| 05-03-01 | 03 | 2 | FORMS-01..07 | T-05-03 | Zod validation, honeypot, Turnstile | build | `pnpm build` | ❌ W0 | ⬜ pending |
| 05-04-01 | 04 | 2 | FUND-01..04 | T-05-04 | Funding page renders | build | `pnpm build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Zod already available via @astrojs/check — verify import works in Preact islands
- [ ] Formspree endpoint configured (requires user to create form at formspree.io)
- [ ] Cloudflare Turnstile site key configured (requires user to create site at cloudflare.com)

*Formspree and Turnstile keys are external dependencies — executor flags for manual setup.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Form submission reaches Formspree | FORMS-01 | External service | Submit test form, check Formspree dashboard |
| Turnstile challenge renders | FORMS-05 | External widget | Load form page in browser, verify widget appears |
| ROI → ConsultForm pre-fill | ROI-05 | Cross-page navigation | Complete ROI calc, click CTA, verify form fields populated |
| DSGVO consent checkbox blocks submit | FORMS-06 | UI interaction | Try submitting without checking consent box |
| Thank-you redirect works | FORMS-04 | Full flow | Submit valid form, verify redirect to /danke |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
