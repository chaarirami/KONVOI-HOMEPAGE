# Testing Patterns

**Analysis Date:** 2026-04-20

## Test Framework

**None installed.**

Evidence:
- `package.json` contains NO test runner in `dependencies` or `devDependencies`. A grep for `test|spec|vitest|jest|playwright` against `package.json` returns no matches.
- No `vitest.config.*`, `jest.config.*`, `playwright.config.*`, `cypress.config.*`, or `.mocharc.*` file exists at the repo root.
- No `test`, `test:unit`, `test:e2e`, `test:watch`, or `coverage` script in `package.json:10-23`. The only scripts are `dev`, `start`, `build`, `preview`, `astro`, `check`, `check:astro`, `check:eslint`, `check:prettier`, `fix`, `fix:eslint`, `fix:prettier`.
- No `*.test.ts`, `*.test.tsx`, `*.spec.ts`, or `*.spec.tsx` files exist in `src/`. (The matches that surface under `node_modules/.pnpm/...` are third-party package sources — not this project's tests.)
- No `__tests__`, `tests/`, `e2e/`, `spec/`, or `cypress/` directory exists in the repo.

**Assertion Library:**
- Not applicable (no runner).

**Run Commands:**
```bash
# There is NO test command. The project does not have runtime tests.
# The only automated correctness gate is:
pnpm check              # astro check + eslint + prettier --check
```

## Test File Organization

**Location:** N/A — no tests exist.

**Naming:** N/A.

**Structure:** N/A.

## Test Structure

**Suite Organization:** Not applicable.

**Patterns:** Not applicable.

## Mocking

**Framework:** Not applicable.

**Patterns:** Not applicable.

**What to Mock:** Not applicable.

**What NOT to Mock:** Not applicable.

## Fixtures and Factories

**Test Data:** Not applicable.

**Location:** Not applicable.

## Coverage

**Requirements:** None enforced. No coverage tool is installed.

**View Coverage:**
```bash
# Not available — no coverage tooling configured.
```

## Test Types

**Unit Tests:** None.

**Integration Tests:** None.

**E2E Tests:** None — Playwright / Cypress / WebdriverIO are NOT installed.

## Current Quality Gates (what DOES run today)

The only automated checks against this codebase are the three commands composed by `pnpm check` (`package.json:16-19`):

1. **`astro check`** — runs the `@astrojs/check` language server (`devDependencies: "@astrojs/check": "^0.9.8"`). Validates:
   - TypeScript types in `.ts`, `.tsx`, and `.astro` frontmatter/scripts
   - Astro content-collection schemas (Zod) defined in `src/content.config.ts` / `src/content/config.ts` (whichever is present)
   - Prop types on Astro components
2. **`eslint .`** — see `.planning/codebase/CONVENTIONS.md` (ESLint flat config with `@eslint/js`, `eslint-plugin-astro`, `typescript-eslint`).
3. **`prettier --check .`** — formatting conformance.

There is no runtime behaviour verification. A broken data-fetching helper or a regression in a marketing-site CTA would only be caught manually in `pnpm dev` or after `pnpm build`.

## Common Patterns

**Async Testing:** N/A.

**Error Testing:** N/A.

## Recommendations (when testing is added)

These are recommendations, not current practice. Do not act on them without an explicit phase planning them in.

**For a marketing / content-first Astro site, Playwright e2e is the canonical choice:**
- `@playwright/test` runs against the built site (`pnpm build && pnpm preview`) or against `pnpm dev`.
- Provides real-browser coverage of the things that actually matter on a marketing site: nav, CTAs, form submissions, dark-mode toggle, 404 page, SEO `<head>` metadata, sitemap/RSS generation.
- Works well with Astro's fully-static output — no mocking of backend services needed for most flows.
- Suggested layout (when introduced): `tests/e2e/*.spec.ts`, config at `playwright.config.ts`, add a `test:e2e` script that runs `playwright test`, wire into `pnpm check` (or a new `pnpm verify` umbrella) so CI still has a single entry point.

**For pure TypeScript utilities in `src/utils/*` (non-Astro, non-DOM):**
- Vitest is the lightest fit — zero-config with the project's existing Vite toolchain (Astro 6 already uses Vite under the hood). Alternatively, Node's built-in `node --test` is a dependency-free option.
- Natural first targets (pure functions, easy to test): `src/utils/permalinks.ts` (`trimSlash`, `cleanSlug`, `getPermalink`, `getAsset`), `src/utils/utils.ts`, slug/date helpers inside `src/utils/blog.ts`.

**Unit tests on `.astro` components are NOT recommended** as a first investment. Astro component-testing tooling is immature relative to Playwright against the rendered output; e2e covers the same surface more reliably.

**Do NOT add a test runner speculatively.** Introduce one only when a concrete phase plans specific tests to write — otherwise `pnpm check` remains the single source of truth and adding unused tooling creates drift.

---

*Testing analysis: 2026-04-20*
