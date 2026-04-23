---
status: partial
phase: 05-conversion-funnel
source: [05-VERIFICATION.md]
started: 2026-04-23T16:30:00Z
updated: 2026-04-23T16:30:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. End-to-end Formspree submission
expected: Fill ConsultForm on /preise, submit, see redirect to /danke, confirm lead appears in Formspree dashboard
result: [pending]

### 2. URL pre-fill cross-component contract
expected: On /roi set fleet=50, select Kühltransport, click CTA → /preise#consult?fleet=50&vertical=cooling → ConsultForm shows 50 and Kühltransport
result: [pending]

### 3. Locale-aware redirect from EN forms
expected: Submit ConsultForm on /en/pricing → redirects to /en/thanks/ (not /danke)
result: [pending]

### 4. Turnstile widget rendering
expected: Turnstile challenge/verified widget visible on both ConsultForm and FundingQualifierForm
result: [pending]

### 5. Currency formatting
expected: /roi shows "1.234 €" (DE period thousands), /en/roi shows "€1,234" (EN comma thousands)
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0
blocked: 0

## Gaps
