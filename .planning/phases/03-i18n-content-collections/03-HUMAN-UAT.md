---
status: partial
phase: 03-i18n-content-collections
source: [03-VERIFICATION.md]
started: 2026-04-23T00:00:00Z
updated: 2026-04-23T00:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. DE page lang attribute
expected: Visit http://localhost:4321/, view page source — `<html lang="de"` present
result: [pending]

### 2. EN page lang attribute
expected: Visit http://localhost:4321/en/, view page source — `<html lang="en"` present
result: [pending]

### 3. Switcher DE-to-EN navigation
expected: On DE homepage, click EN in language switcher — navigates to /en/
result: [pending]

### 4. Switcher EN-to-DE navigation
expected: On EN homepage, click DE in language switcher — navigates to /
result: [pending]

### 5. 404 on missing EN page
expected: Visit /en/nonexistent — returns 404, does NOT silently serve DE content
result: [pending]

### 6. Parity check in build pipeline
expected: Run `pnpm build` — `[parity]` message appears before Astro build output
result: [pending]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0
blocked: 0

## Gaps
