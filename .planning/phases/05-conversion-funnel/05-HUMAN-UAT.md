---
status: complete
phase: 05-conversion-funnel
source: [05-VERIFICATION.md]
started: 2026-04-26T20:00:00Z
updated: 2026-04-26T21:10:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Visual Layout and Badge Rendering
expected: /preise/ and /en/pricing/ show 3 tier cards, Camera Module highlighted with badge
result: pass

### 2. ROI Calculator End-to-End Flow
expected: Enter fleet data on /roi/, Calculate shows 4 outputs, "Book consult" pre-fills ConsultForm via URL params
result: pass

### 3. Form Validation Behavior
expected: Empty submit shows inline Zod errors; unchecked DSGVO shows specific error
result: pass

### 4. End-to-End Lead Capture (PHASE 5 GATE)
expected: Configure env vars, submit form, lead arrives via Web3Forms
result: pass

### 5. Funding Page Content
expected: /foerderung/ and /en/funding/ show BALM 2026 details, FundingQualifierForm, ROI cross-links
result: pass

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps
