# Coding Conventions

**Analysis Date:** 2026-04-20

## Naming Patterns

**Files:**
- Astro components: `PascalCase.astro` — e.g. `src/components/widgets/Header.astro`, `src/components/ui/Button.astro`, `src/components/ui/WidgetWrapper.astro`, `src/components/common/Image.astro`
- Utilities and scripts: `camelCase.ts` — e.g. `src/utils/permalinks.ts`, `src/utils/blog.ts`
- Page routes: lowercase / kebab-case matching the URL segment — e.g. `src/pages/404.astro`, `src/pages/[...blog]/[...page].astro` (Astro file-based routing => filename is the URL)
- Config files: lowercase with standard tool extensions — `eslint.config.js`, `.prettierrc.cjs`, `tsconfig.json`, `astro.config.ts`

**Functions:**
- `camelCase`, typically exported as arrow-function consts — e.g. `export const getPermalink = (slug = '', type = 'page'): string => { ... }` (`src/utils/permalinks.ts:42`), `export const fetchPosts = async (): Promise<Array<Post>> => { ... }` (`src/utils/blog.ts:132`)
- Async helpers are defined with arrow syntax; a `function` declaration is used when exporting a top-level async that could be hoisted — `export async function getRelatedPosts(...)` (`src/utils/blog.ts:247`)
- Private module-level helpers use a leading underscore when shadowing a param — see `_image`, `_count`, `_posts` in `src/utils/blog.ts` and `src/components/common/Image.astro:40`

**Variables:**
- `camelCase` for locals and exports: `currentPath`, `normalizedPosts`, `blogPostsPerPage`
- `SCREAMING_SNAKE_CASE` for derived module-level constants coming from config: `BLOG_BASE`, `CATEGORY_BASE`, `TAG_BASE`, `POST_PERMALINK_PATTERN`, `BASE_PATHNAME` (`src/utils/permalinks.ts:16-28`)
- Unused parameters MUST be prefixed with `_` — enforced by ESLint `argsIgnorePattern: '^_'` and `destructuredArrayIgnorePattern: '^_'` (`eslint.config.js:46-52`)

**Types / Interfaces:**
- `PascalCase` TS interfaces / types — `interface Link`, `interface MenuLink extends Link`, `export interface Props` (`src/components/widgets/Header.astro:12-33`)
- Public component prop types are exposed via `export interface Props` or a re-aliased import: `import type { CallToAction as Props } from '~/types'` (`src/components/ui/Button.astro:4`), `import type { Hero as Props } from '~/types'` (`src/components/widgets/Hero.astro:5`)
- Shared types live in `src/types.d.ts` (single central declaration file)

## Code Style

**Formatting (Prettier):**
- Config: `.prettierrc.cjs`
- `printWidth: 120`
- `semi: true`
- `singleQuote: true` (JS/TS single quotes; Astro attribute quoting follows the Astro plugin)
- `tabWidth: 2`, `useTabs: false`
- `trailingComma: 'es5'` — trailing commas in arrays/objects, not in function params
- Astro files are formatted via `prettier-plugin-astro` with `parser: 'astro'` (`.prettierrc.cjs:10-12`)
- Prettier ignores: `dist`, `node_modules`, `.github`, `.changeset`, `.omc` (`.prettierignore`)
- Editor defaults via `.editorconfig`: UTF-8, LF line endings, 2-space indent, final newline on save, trailing whitespace NOT trimmed

**Linting (ESLint flat config):**
- Config: `eslint.config.js` (flat config, ESM `export default [ ... ]`)
- Base configs (spread in order): `js.configs.recommended` → `eslintPluginAstro.configs['flat/recommended']` → `tseslint.configs.recommended`
- Globals: `globals.browser` + `globals.node` merged on every file
- Astro block: parser `astro-eslint-parser` with `parserOptions.parser = '@typescript-eslint/parser'` and `extraFileExtensions: ['.astro']` (`eslint.config.js:20-29`)
- TS/TSX block: parser `@typescript-eslint/parser`; disables the base `no-unused-vars` and enables `@typescript-eslint/no-unused-vars` with `^_` ignore patterns; `@typescript-eslint/no-non-null-assertion` is `off` (non-null assertion `!` is allowed)
- `no-mixed-spaces-and-tabs: ['error', 'smart-tabs']` for `.js`, `.jsx`, `.astro`
- Ignore list: `dist`, `node_modules`, `.github`, `types.generated.d.ts`, `.astro` (`eslint.config.js:57`)

**TypeScript:**
- `tsconfig.json` extends `astro/tsconfigs/base`
- `strictNullChecks: true` (full `strict` is inherited from the Astro base)
- `allowJs: true` — mixed JS/TS is permitted
- Path alias: `"~/*": ["src/*"]` with `baseUrl: "."` — ALL internal imports MUST use `~/` (see Import Organization below)
- `include`: `.astro/types.d.ts` (generated Astro types) + `**/*`; excludes `dist/`
- TypeScript version: `^6.0.3` (devDependency in `package.json:64`)

## Import Organization

**Order** (observed consistently in `src/components/widgets/Header.astro:2-10`, `src/components/widgets/Hero.astro:1-5`, `src/utils/blog.ts:1-6`):
1. External packages (bare specifiers): `astro-icon/components`, `tailwind-merge`, `slugify`, `astro:content`
2. Blank line
3. Virtual / framework modules: `astrowind:config` (Astro integration-exposed virtual module)
4. Internal modules via `~/` alias: `~/components/...`, `~/utils/...`, `~/layouts/...`
5. Relative imports: `./permalinks` (only used within the same directory)
6. Type-only imports grouped last inside each group or at the end: `import type { CallToAction } from '~/types';` (`src/components/widgets/Header.astro:10`), `import type { PaginateFunction } from 'astro'` (`src/utils/blog.ts:1`)

**Path Aliases:**
- `~/*` → `src/*` — this is the ONLY alias. Never use long relative paths (`../../..`) to cross directory boundaries; always use `~/`.
- Examples: `~/components/ui/Button.astro`, `~/utils/permalinks`, `~/types`, `~/layouts/Layout.astro`

## Error Handling

**No custom error boundaries exist.** The project relies on Astro defaults.
- Build-time / content errors are surfaced by `astro check` + the `@astrojs/check` integration (`package.json:38`)
- HTTP 404 is handled by `src/pages/404.astro` — plain Astro page, no try/catch, no error logger. Renders inside the shared `src/layouts/Layout.astro` with a link back to the home permalink.
- No global 500 / error page exists — defer to Astro's default behaviour.
- The only imperative `throw` in the component tree guards a required prop: `if (props.alt === undefined || props.alt === null) { throw new Error(); }` (`src/components/common/Image.astro:20-22`). Pattern: validate required inputs and throw a bare `Error` at render time so `astro build` / `astro check` fails loudly.
- Server-side helpers return empty arrays / `undefined` rather than throwing — e.g. `findPostsBySlugs` returns `[]` on invalid input (`src/utils/blog.ts:142`), `getStaticPathsBlog*` returns `[]` when disabled.

## Logging

**Framework:** None. No logger library is installed.

**Patterns:**
- Do not add `console.log` to committed code. Diagnostics come from `astro build` / `astro check` output during CI.

## Comments

**When to Comment:**
- Sparse. The codebase prefers self-documenting names over comments.
- Each exported utility in `src/utils/permalinks.ts` is prefixed with an empty JSDoc marker `/** */` (lines 30, 41, 89, 92, 95, 103, 109) — a marker that the function is part of the public API of the module. Preserve this convention when adding new exports.
- Inline notes are used only to flag non-obvious migration baggage, e.g. `// cleanSlug(rawSlug.split('/').pop());` (`src/utils/blog.ts:60`) and `// or 'content' in case you consume from API` (`src/utils/blog.ts:97`).

**JSDoc/TSDoc:**
- Not used for type annotations (TypeScript covers that). One typed JSDoc is used on the Prettier config because it is a plain `.cjs` file: `/** @type {import('prettier').Config} */` (`.prettierrc.cjs:1`).

## Function Design

**Size:** Short functions. `src/utils/permalinks.ts` and `src/utils/blog.ts` top out around 40-line functions; anything longer is a `getStaticPaths*` helper that composes smaller utilities.

**Parameters:**
- Prefer a single object parameter with destructuring + defaults for optional configuration: `generatePermalink({ id, slug, publishDate, category }: { id: string; slug: string; publishDate: Date; category: string | undefined })` (`src/utils/blog.ts:8-18`)
- Provide sensible defaults at the destructure site: `const getPermalink = (slug = '', type = 'page'): string => ...` (`src/utils/permalinks.ts:42`)
- For Astro components, destructure `Astro.props` at the top of the frontmatter with all defaults inline — see `Header.astro:35-45`, `Button.astro:6-14`, `WidgetWrapper.astro:12`

**Return Values:**
- Always annotate the return type on exported functions: `: string`, `: Promise<Array<Post>>`, `: string | URL`
- Prefer `Array<T>` over `T[]` in public signatures (see `src/utils/blog.ts` — `Promise<Array<Post>>`, `Array<string>`). `T[]` is used only for internal locals (`Post[]` in `getRelatedPosts`).

## Module Design

**Exports:**
- `export const` + arrow function for utilities (`src/utils/permalinks.ts`, most of `src/utils/blog.ts`)
- Named exports only — no `export default` in utility modules
- Astro components are default-exported implicitly by the `.astro` file; consumers import them by the file name (`import Button from '~/components/ui/Button.astro'`)
- Type re-exports: `export type { ImageProps }` from `src/utils/images-optimization` is re-exported inline via `import { ..., type ImageProps } from '~/utils/images-optimization'` (`src/components/common/Image.astro:4-10`)

**Barrel Files:**
- Not used. Each module is imported by its full path (e.g. `~/components/ui/Button.astro`, not `~/components/ui`). Do not introduce `index.ts` re-export files.

## Astro Component Conventions

**Frontmatter structure** (in order):
1. `import` statements (grouped per "Import Organization")
2. Local `interface` / `type` declarations (if not pulled from `~/types`)
3. `export interface Props` or `type Props = ...` — prop contract
4. `const { ... } = Astro.props;` with defaults inline
5. Any derived values needed by the template (e.g. `const currentPath = ...` in `Header.astro:47`)

**Widget props contract** (`src/types.d.ts` exposes a `Widget` base type):
- Every layout section component wraps its content in `WidgetWrapper` (`src/components/ui/WidgetWrapper.astro`)
- `WidgetWrapper` props: `id?`, `isDark?: boolean`, `containerClass?: string`, `bg?` (slot fallback), `as?: HTMLTag` (defaults to `'section'`)
- Widgets in `src/components/widgets/*.astro` all extend this contract. Confirmed usage in 15 widgets via grep: `Testimonials`, `Steps`, `Steps2`, `Stats`, `Pricing`, `Features`, `Features2`, `Features3`, `FAQs`, `Content`, `Contact`, `CallToAction`, `Brands`, `BlogLatestPosts`, `BlogHighlightedPosts`.
- `Hero.astro` is the exception — it renders its own `<section>` directly because it must escape the standard max-width container.

**Conditional attributes** use the spread-object idiom to omit the attribute entirely when falsy:
```astro
<header {...isSticky ? { 'data-aw-sticky-header': true } : {}} {...id ? { id } : {}}>
```
(`src/components/widgets/Header.astro:55-56`, also `Hero.astro:21`, `WidgetWrapper.astro:17`). Do NOT emit `id={undefined}` — always guard with `... ? { id } : {}`.

**Class composition:**
- Static + conditional classes: use Astro's built-in `class:list={[ ... , { 'foo': cond } ]}` directive (`Header.astro:51`, `:60`, `:104`, `:133`)
- Merging a consumer-passed `class` with component defaults: use `tailwind-merge`'s `twMerge` — `class={twMerge(variants[variant] || '', className)}` (`src/components/ui/Button.astro:26,32`), `twMerge('relative mx-auto max-w-7xl ...', containerClass)` (`WidgetWrapper.astro:25-28`)
- Consumer-supplied class is always captured as `class: className = ''` in destructuring (can't use `class` as an identifier) — see `Button.astro:11`

**Slot rendering patterns:**
- Rich-content props default to `await Astro.slots.render('<slot-name>')` so the prop can be either a string passed from a parent or named slot content: `title = await Astro.slots.render('title')` (`Hero.astro:8-18`)
- Rendering trusted HTML from a slot/prop: `<Fragment set:html={content} />` (`Hero.astro:66, 72, 81`, `Button.astro:27, 36`)
- Default slot rendering: `<slot />` (`WidgetWrapper.astro:32`)

**Dynamic tag name:**
- Assign the tag to a `PascalCase` local, then use it as the JSX element: `const WrapperTag = as; ... <WrapperTag>` (`WidgetWrapper.astro:14-17`). This is required because Astro/JSX treats lowercase identifiers as HTML tags.

## Tailwind CSS v4 Conventions

**CSS-first config** — there is NO `tailwind.config.js` / `tailwind.config.ts`. Configuration lives in `src/assets/styles/tailwind.css`:
- `@import 'tailwindcss';` (v4 entry, replaces the v3 `@tailwind base/components/utilities` triplet)
- `@plugin '@tailwindcss/typography';` (v4 plugin directive, replaces `plugins: [...]` in JS config)
- Theme tokens declared with `@theme { ... }` — colors, fonts, animation, keyframes. Tokens are exposed as CSS variables (e.g. `--color-primary`) AND automatically generate matching utilities (`bg-primary`, `text-primary`, ...).

**`@custom-variant` — use instead of `darkMode: 'class'`:**
```css
@custom-variant dark (&:where(.dark, .dark *));
@custom-variant intersect (&:not([no-intersect]));
```
(`src/assets/styles/tailwind.css:5-6`)
- Dark mode is class-triggered on an ancestor `.dark` — do NOT add `darkMode: 'class'` to a JS config; that API does not exist in v4. Enabling dark styles still uses `dark:` variants in markup.
- `intersect:` is a project-specific variant used for scroll-triggered animations (e.g. `motion-safe:md:intersect:animate-fade` in `Hero.astro:34`).

**`@utility` — use instead of `@layer components`:**
```css
@utility btn { @apply inline-flex items-center ...; }
@utility btn-primary { @apply btn font-semibold bg-primary ...; }
@utility bg-page { background-color: var(--aw-color-bg-page); }
```
(`src/assets/styles/tailwind.css:37-67`)
- NEW reusable classes MUST be declared with `@utility <name> { ... }`. Do NOT use `@layer components { .foo { ... } }` — that was v3 syntax.
- `@utility` classes participate in Tailwind's variant system (so `md:btn-primary`, `hover:btn-primary`, etc. work automatically), unlike `@layer components` which did not.
- Variants of project utilities (`btn-primary`, `btn-secondary`, `btn-tertiary`) are composed with `@apply btn ...` so the base shape stays in one place.

**Button variant map pattern** (`src/components/ui/Button.astro:16-21`):
```ts
const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  tertiary: 'btn btn-tertiary',
  link: 'cursor-pointer hover:text-primary',
};
```
Component maps a `variant` prop to utility class names; `twMerge` lets consumers override with `class="..."`.

**Raw CSS (non-utility) rules** live at the bottom of `tailwind.css` and use attribute/id selectors for DOM-driven state (`#header.scroll`, `[data-aw-toggle-menu].expanded`, `.dropdown:hover .dropdown-menu`). Pair with `@apply` inside the rule body where possible (`tailwind.css:69-111`).

## Scripts & Quality Gates

**From `package.json:16-22`:**
```bash
pnpm check            # astro check + eslint + prettier --check (CI gate)
pnpm check:astro      # astro check   — type + content schema
pnpm check:eslint     # eslint .
pnpm check:prettier   # prettier --check .
pnpm fix              # eslint --fix + prettier -w
pnpm fix:eslint       # eslint --fix .
pnpm fix:prettier     # prettier -w .
```

- `pnpm check` is the sole automated quality gate. It must pass before merging.
- Package manager: `pnpm` (v10, per project brief). `onlyBuiltDependencies: ['esbuild', 'sharp']` is pinned in `package.json:68-73` — do not change without reason.
- Node: `"engines": { "node": "^22.0.0 || >=24.0.0" }` (`package.json:7-9`).

---

*Convention analysis: 2026-04-20*
