# Phase 1: Foundation Scrub - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-22
**Phase:** 01-foundation-scrub
**Areas discussed:** Scrubbed pages fate, License wording, Nav & component cleanup

---

## Scrubbed Pages Fate

| Option | Description | Selected |
|--------|-------------|----------|
| Delete entirely (Recommended) | Remove index.astro, about.astro, contact.astro, pricing.astro. Site shows 404 until Phase 4+ rebuilds them. | ✓ |
| Minimal Konvoi stubs | Replace content with 'Konvoi — Coming soon' placeholder per page. | |
| Bare layout shells | Keep files but strip all widget imports and content. Empty body, no 404s. | |

**User's choice:** Delete entirely
**Notes:** Cleanest scrub — no risk of AstroWind debris leaking.

### services.astro sub-question

| Option | Description | Selected |
|--------|-------------|----------|
| Delete permanently (Recommended) | No Konvoi phase needs a services page. Product page (Phase 4) covers offerings. | ✓ |
| Keep as empty shell | Keep route alive in case needed later. | |

**User's choice:** Delete permanently
**Notes:** No matching requirement in any phase.

---

## License Wording

| Option | Description | Selected |
|--------|-------------|----------|
| Short proprietary (Recommended) | One-liner: Copyright © 2025-2026 Konvoi GmbH. All rights reserved. Unauthorized copying/distribution prohibited. | ✓ |
| Detailed proprietary | Multi-paragraph with usage restrictions, no-warranty, confidentiality clause. | |
| I'll provide the text | User has specific wording from Konvoi legal. | |

**User's choice:** Short proprietary
**Notes:** Standard for private corporate repos.

---

## Nav & Component Cleanup

### Announcement.astro

| Option | Description | Selected |
|--------|-------------|----------|
| Delete component (Recommended) | Remove entirely. No Konvoi requirement references an announcement bar. | ✓ |
| Strip and keep empty | Remove AstroWind content, keep component shell for future use. | |
| Strip and hide | Empty content and disable in layout. | |

**User's choice:** Delete component
**Notes:** Can always recreate later if needed.

### Footer Navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Strip to bare minimum (Recommended) | Remove all '#' placeholder sections. Keep Konvoi credit + legal link slots. Header stripped to logo only. | ✓ |
| Replace with Konvoi structure | Write Konvoi footer nav now pointing to '#' or '/'. Head start on IA but 404s. | |
| Delete navigation.ts entirely | Remove all nav data. Zero links. Rebuild from scratch in Phase 4. | |

**User's choice:** Strip to bare minimum
**Notes:** None.

### Header Navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Logo only (Recommended) | Konvoi logo linking to '/' with no nav links until Phase 4. | |
| Logo + language switcher shell | Logo plus non-functional DE/EN toggle placeholder. Gets positioning early. | ✓ |
| You decide | Claude picks best approach. | |

**User's choice:** Logo + language switcher shell
**Notes:** Gets the switcher positioned early even though i18n routing (Phase 3) doesn't exist yet.

---

## Claude's Discretion

- CI grep gate implementation approach (FND-08)
- Netlify context detection for noindex (FND-09)
- image.domains cleanup (FND-06)
- config.yaml replacement values
- Package removal (FND-04)
- GitHub Actions pnpm rewrite (FND-07)
- privacy.md and terms.md deletion
- vendor/integration naming (leave as-is)

## Deferred Ideas

None — discussion stayed within phase scope.
