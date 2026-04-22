---
phase: 02-brand-design-system
plan: "01"
subsystem: design-tokens
tags: [typography, colour, tailwind, fontsource]
key-files:
  created: []
  modified:
    - package.json
    - src/assets/styles/tailwind.css
    - src/components/CustomStyles.astro
metrics:
  tasks: 2
  commits: 2
  files_changed: 3
---

# Plan 02-01 Summary: Fonts & Colour Tokens

## What was built

Installed Montserrat (400/500/600/700) and PT Serif (400/700) as self-hosted @fontsource packages. Wired six CSS @import statements into tailwind.css before the Tailwind core import. Pinned the `@custom-variant dark` line with a LOAD-BEARING comment block (BRAND-04). Replaced all AstroWind RGB colour values in CustomStyles.astro with Konvoi HSL palette from dashboard (D-02 light, D-03 dark) and set font family vars to Montserrat/PT Serif.

## Commits

| # | Hash | Description |
|---|------|-------------|
| 1 | 16e9247 | feat(02-01): install Montserrat + PT Serif, wire font imports, pin dark variant |
| 2 | e12fd2f | feat(02-01): apply Konvoi HSL colour palette and font vars to CustomStyles.astro |

## Deviations

None — plan executed as written.

## Self-Check: PASSED

- [x] package.json contains @fontsource/montserrat and @fontsource/pt-serif
- [x] tailwind.css has 6 @fontsource @import lines before @import 'tailwindcss'
- [x] tailwind.css has LOAD-BEARING comment above @custom-variant dark
- [x] CustomStyles.astro :root has hsl(214.48 38.33% 55.49%) primary
- [x] CustomStyles.astro .dark has hsl(217 60% 70%) primary
- [x] No rgb(1 97 239) or rgb(109 40 217) remain (AstroWind colours gone)
- [x] Montserrat and PT Serif font vars set in both :root and .dark
- [x] pnpm build exits 0
