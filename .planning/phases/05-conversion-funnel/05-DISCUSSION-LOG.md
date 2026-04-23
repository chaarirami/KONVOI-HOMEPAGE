# Phase 5: Conversion Funnel - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-23
**Phase:** 05-conversion-funnel
**Mode:** --auto (all decisions auto-selected)
**Areas discussed:** Pricing layout, ROI calculator UX, Form architecture, Funding page, Cross-component data flow

---

## Pricing Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Side-by-side cards | 3 tier cards, mobile stacks vertically | ✓ |
| Comparison table | Feature matrix with checkmarks | |
| Accordion | Expandable tier sections | |

**User's choice:** Side-by-side cards (auto-selected — standard SaaS pricing pattern)
**Notes:** Canonical.yaml already has tier data structured for card display

---

## ROI Calculator UX

| Option | Description | Selected |
|--------|-------------|----------|
| Sliders with number inputs | Visual, mobile-friendly, immediate feedback | ✓ |
| Form-style inputs only | Traditional, keyboard-friendly | |

**User's choice:** Sliders with number inputs (auto-selected)

| Option | Description | Selected |
|--------|-------------|----------|
| Summary card with breakdown | Clear sections for each output metric | ✓ |
| Inline results | Numbers update in-place next to inputs | |

**User's choice:** Summary card with breakdown (auto-selected)
**Notes:** ROI-05 locks the ConsultForm pre-fill via URL params

---

## Form Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Client-side fetch POST | No reload, preserves state on error | ✓ |
| Standard form submit | Page reload, simpler but loses state | |

**User's choice:** Client-side fetch (auto-selected — matches FORMS-07 requirement)

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit Turnstile render | Works in Preact island lifecycle | ✓ |
| Implicit Turnstile | Simpler but may not work with islands | |

**User's choice:** Explicit render (auto-selected)

---

## Funding Page

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal qualifier form | Company + fleet + contact per FUND-03 | ✓ |
| Extended qualifier | Add revenue, subsidy history | |

**User's choice:** Minimal (auto-selected — matches FUND-03 scope)

---

## Cross-Component Data Flow

| Option | Description | Selected |
|--------|-------------|----------|
| URL query params | ROI → ConsultForm via ?fleet=&vertical=&savings= | ✓ |

**User's choice:** URL query params (locked by ROI-05 requirement — no alternatives)

---

## Claude's Discretion

- ROI formula calibration
- Turnstile site key management
- Form field ordering
- Thank-you page design

## Deferred Ideas

None
