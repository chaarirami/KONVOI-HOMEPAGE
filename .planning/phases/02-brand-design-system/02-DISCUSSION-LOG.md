# Phase 2: Brand & Design System - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-04-22
**Phase:** 02-brand-design-system
**Areas discussed:** Colour palette, Font weights, Dark mode, Brand voice, Logo assets, Brand data source

---

## Colour Palette

User offered their Konvoi dashboard CSS (Next.js + shadcn + Tailwind project) as the brand source. Full HSL palette extracted from `:root` and `.dark` blocks.

| Option | Description | Selected |
|--------|-------------|----------|
| Exact match | Same HSL values as dashboard. Brand consistency. Researcher fine-tunes for accessibility only. | ✓ |
| Bolder for marketing | Bump saturation/contrast on primary + CTA for stronger hero punch. | |
| Let Claude decide | Start with dashboard, adjust if Lighthouse flags issues. | |

**User's choice:** Exact match (Recommended)
**Notes:** User proactively shared dashboard CSS file before area selection, signalling strong preference for brand consistency.

---

## Font Weight Selection (Montserrat)

| Option | Description | Selected |
|--------|-------------|----------|
| Standard set (400/500/600/700) | Covers headings, nav, body, CTAs. ~120KB. | ✓ |
| Minimal (400/700) | Smallest bundle ~60KB. Limits to regular + bold. | |
| Full range (300-900) | Maximum flexibility. ~240KB. | |

**User's choice:** Standard set (Recommended)
**Notes:** None

---

## Font Weight Selection (PT Serif)

| Option | Description | Selected |
|--------|-------------|----------|
| 400 + 700 | Regular + bold. PT Serif only ships these two anyway. | ✓ |
| 400 + 700 + italics | Add italic variants. Useful for quotes/blog. ~80KB extra. | |
| 400 only | Smallest bundle. Bold emphasis uses Montserrat. | |

**User's choice:** 400 + 700 (Recommended)
**Notes:** None

---

## Dark Mode Palette

Resolved implicitly by the dashboard CSS provision -- dark mode values were included in the shared CSS file. No separate question needed.

**User's choice:** Dashboard dark palette (hsl(220 35% 10%) background, hsl(217 60% 70%) primary)
**Notes:** Full dark mode token set extracted from `.dark` block of dashboard CSS.

---

## Brand Voice

| Option | Description | Selected |
|--------|-------------|----------|
| Draft from current site | Extract patterns from live konvoi.eu + dashboard. Claude drafts, user reviews. | ✓ |
| I'll provide guidelines | User supplies internal brand docs. | |
| Let Claude decide | Claude drafts from PROJECT.md framing. User approves after. | |

**User's choice:** Draft from current site
**Notes:** None

---

## Logo & Favicon Assets

| Option | Description | Selected |
|--------|-------------|----------|
| I'll provide files | User has SVG/PNG ready. | |
| Extract from current site | Pull from live konvoi.eu. Researcher downloads and optimises. | ✓ |
| Not ready yet | Use placeholders, swap later. | |

**User's choice:** Extract from current site
**Notes:** None

---

## Brand Data Source (canonical.yaml)

| Option | Description | Selected |
|--------|-------------|----------|
| Current site snapshot | Pull from .planning/current-site-overview.md. User verifies after. | ✓ |
| I'll provide values | User supplies exact legal text, phones, emails, pricing. | |
| Mix: snapshot + corrections | Start from snapshot, user corrects changes. | |

**User's choice:** Current site snapshot (Recommended)
**Notes:** None

---

## Claude's Discretion

- Accessibility audit approach (Axe vs Lighthouse vs both)
- CSS custom property prefix migration (`--aw-*` vs rename)
- Shadow tokens (port from dashboard or keep current)
- Border radius tokens
- Chart colours (skip for marketing site)

## Deferred Ideas

None -- discussion stayed within phase scope.
