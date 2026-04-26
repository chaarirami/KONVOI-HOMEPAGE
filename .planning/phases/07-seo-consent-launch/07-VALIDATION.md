## Validation Architecture

> `workflow.nyquist_validation` not explicitly set to false — validation section included.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `pnpm check` (astro check + eslint + prettier) — no unit test framework |
| Config file | `package.json` scripts |
| Quick run command | `pnpm check` |
| Full suite command | `pnpm build` (includes sitemap generation + grep gate) |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| SEO-01 | hreflang + canonical in `<head>` | smoke | `pnpm build && grep -l 'hreflang' dist/*.html dist/**/*.html` | Manual inspection of built HTML |
| SEO-02 | Sitemap has xhtml:link alternates | smoke | `pnpm build && grep -c 'xhtml:link' dist/sitemap-0.xml` | Should be > 0 |
| SEO-03 | OG images exist and referenced | smoke | `ls dist/og/*.png` + grep `og:image` in built HTML | Manual |
| SEO-04 | JSON-LD validates | manual | Google Rich Results Test — cannot automate | [ASSUMED] |
| SEO-05 | Rybbit script in `<head>` | smoke | `pnpm build && grep 'rybbit' dist/index.html` | |
| SEO-06 | Cookie consent banner initializes | manual | Browser test — cannot automate in static CI | |
| SEO-07 | /impressum/ exists and has TMG content | smoke | `pnpm build && ls dist/impressum/index.html` | |
| SEO-08 | /datenschutz/ exists | smoke | `pnpm build && ls dist/datenschutz/index.html` | |
| SEO-09 | CSP header present | smoke | `pnpm build && grep 'Content-Security-Policy' dist/_headers` | |
| DEPLOY-01 | netlify.toml valid | smoke | `pnpm build` succeeds | |
| DEPLOY-02 | _redirects file in dist | smoke | `pnpm build && ls dist/_redirects` | |
| DEPLOY-03 | DNS cutover | manual | User action — cannot automate | |
| DEPLOY-04 | Search Console verified | manual | User action — cannot automate | |
| DEPLOY-05 | site:netlify.app returns zero | manual | Google search query — post-launch check | |

### Wave 0 Gaps
- None for test infrastructure — `pnpm check` and build smoke tests use existing tooling.
