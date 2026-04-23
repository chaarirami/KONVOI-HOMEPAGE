# Phase 6: Depth & Credibility Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-04-23
**Phase:** 06-depth-credibility-pages
**Mode:** --auto (all decisions auto-selected)
**Areas discussed:** Case study presentation, Blog migration & routing, Team page layout, Contact page structure, Careers page design

---

## Case Study Presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Card-based index + structured detail | Cards on index, quote-first detail pages | ✓ |
| List-based index | Simple list with excerpts | |
| Grid gallery | Visual-heavy thumbnail grid | |

**User's choice:** [auto] Card-based index + structured detail pages (recommended default)
**Notes:** Cards match existing component patterns (Brands, Features widgets). Detail page follows use-case template pattern from Phase 4.

| Option | Description | Selected |
|--------|-------------|----------|
| Quote-first hero | Customer quote anchors credibility at top | ✓ |
| Problem-first | Lead with the business problem | |
| Metrics-first | Lead with measurable outcome | |

**User's choice:** [auto] Quote-first hero with customer logo (recommended default)
**Notes:** Quote is strongest trust signal; problem/approach/outcome follow naturally below.

---

## Blog Migration & Routing

| Option | Description | Selected |
|--------|-------------|----------|
| Locale-specific static routes | /aktuelles/ (DE) + /en/news/ (EN), replace [...blog] | ✓ |
| Adapt [...blog] for i18n | Keep dynamic routing, add locale parameter | |
| Parallel blog instances | Two independent blog setups | |

**User's choice:** [auto] Locale-specific static routes (recommended default)
**Notes:** Aligns with I18N-02 file-tree routing. No [locale]/ dynamic segments.

| Option | Description | Selected |
|--------|-------------|----------|
| Generate from current-site-overview | Placeholder MD entries matching Jimdo posts | ✓ |
| Manual migration later | Empty blog, migrate separately | |

**User's choice:** [auto] Generate placeholder markdown entries (recommended default)
**Notes:** Same approach as Phase 4 copy generation. Preserves original publish dates.

---

## Team Page Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Photo grid with cards | Responsive grid, photo + name + title + bio | ✓ |
| List with side photos | Horizontal cards, photo left, text right | |
| Minimal name grid | Small photos, name only, expand on click | |

**User's choice:** [auto] Photo grid with cards (recommended default)
**Notes:** Standard team page pattern. Maps directly to team collection schema fields.

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit order field | Use `order` field from schema | ✓ |
| Alphabetical | Sort by name | |
| By role/department | Group by function | |

**User's choice:** [auto] Explicit order field (recommended default)
**Notes:** `order` field already defined in team collection schema from Phase 3.

---

## Contact Page Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Side-by-side contact cards | Two cards with photo + details, stacked on mobile | ✓ |
| Single contact block | Combined contact info in one section | |
| Tabbed contacts | Tab per contact person | |

**User's choice:** [auto] Side-by-side contact cards (recommended default)
**Notes:** Matches CONT-01 requirement exactly. Mirrors current Jimdo site structure.

| Option | Description | Selected |
|--------|-------------|----------|
| Static screenshot + click-to-load | Screenshot placeholder, iframe after click | ✓ |
| No map | Address text only | |
| Always-loaded with consent banner | Cookie consent gates the iframe | |

**User's choice:** [auto] Static screenshot + click-to-load (recommended default)
**Notes:** DSGVO compliant per CONT-02. No iframe before explicit user consent.

| Option | Description | Selected |
|--------|-------------|----------|
| Below contacts, above CTA | Chronological list, auto-hide by endDate | ✓ |
| Sidebar | Events in sidebar next to contacts | |
| Separate section page | Events on their own page | |

**User's choice:** [auto] Below contacts, above CTA (recommended default)
**Notes:** Events support trust narrative. CTA closes the page.

---

## Careers Page Design

| Option | Description | Selected |
|--------|-------------|----------|
| Simple list with apply buttons | Title, department, type badge, mailto button | ✓ |
| Card grid | Visual cards per role | |
| Accordion | Expandable role descriptions | |

**User's choice:** [auto] Simple list with apply buttons (recommended default)
**Notes:** Clean presentation for 8-role roster. No ATS integration needed.

| Option | Description | Selected |
|--------|-------------|----------|
| EN shell with link to DE | Explicit message + link, no silent redirect | ✓ |
| 302 redirect | Automatic redirect EN -> DE | |
| Bilingual listings | Full EN translations | |

**User's choice:** [auto] EN shell with link to DE (recommended default)
**Notes:** Explicit user action per i18n principles. No silent redirect.

---

## Claude's Discretion

- Blog pagination page size
- Case study card visual details
- Team photo placeholders for dev
- Maps screenshot source/dimensions
- Blog tag URL structure
- Events visual treatment
- RSS feed metadata
- blog.ts refactoring scope

## Deferred Ideas

None -- all discussion stayed within phase scope.
