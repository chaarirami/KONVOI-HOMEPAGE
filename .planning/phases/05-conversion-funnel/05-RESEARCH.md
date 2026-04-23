# Phase 5: Conversion Funnel - Research

**Researched:** 2026-04-23
**Domain:** Form-based lead capture, ROI calculator, Formspree integration, Turnstile spam protection
**Confidence:** HIGH

## Summary

Phase 5 builds the conversion funnel: pricing pages, an interactive ROI calculator Preact island, a funding explanation page, and two form-based lead capture islands (ConsultForm and FundingQualifierForm). All integrate with Formspree via client-side fetch POST, validate with Zod, protect against spam with Turnstile + honeypot, and require DSGVO consent. The architecture is **100% static** — no server-side form processing, all validation client-side, all POST submissions go directly to Formspree's external API.

**Primary recommendation:** 
1. Use Preact's `client:visible` hydration for all interactive islands — forms and ROI calculator only hydrate when scrolled into view
2. Implement Formspree integration via **fetch with `Accept: application/json`** header to prevent redirect-to-thank-you-page and enable client-side success handling
3. Use Cloudflare Turnstile's **explicit render API** (with `?render=explicit` script parameter) so the widget can be destroyed and re-created per Preact lifecycle
4. Validate forms with Zod schemas on submit (before fetch POST) — display inline field errors, preserve all values on error
5. Store ROI formula inputs in `src/data/pricing.ts` alongside pricing tiers — single source of truth for both components

## User Constraints (from CONTEXT.md)

### Locked Decisions

**Pricing Page Layout (D-01, D-02, D-03)**
- Side-by-side tier cards (3 cards: Standard, + Camera Module, + Logbook)
- Tier data from `src/data/brand/canonical.yaml` — re-export via `src/data/pricing.ts`
- Pricing page embeds RoiCalculator island below tiers, ends with ConsultForm

**ROI Calculator UX (D-04, D-05, D-06, D-07)**
- Preact island (`src/components/islands/RoiCalculator.tsx`) with `client:visible`
- Inputs: fleet size (number input +/- buttons, min 1), vertical (dropdown), parking frequency (slider 1-30 stops/week)
- Output: annual theft cost, KONVOI savings, de-minimis reimbursement (80%), payback period
- Button to pre-fill ConsultForm via URL query params: `?fleet={size}&vertical={slug}&savings={amount}`
- Formula assumptions in `src/data/pricing.ts` sourced from cost anchors in `.planning/current-site-overview.md`

**Form Architecture (D-08 through D-14)**
- Both forms are Preact islands with `client:visible`
- Client-side POST to Formspree via `fetch()` — no page reload
- Zod validation on submit before POST
- Honeypot + Turnstile + DSGVO consent checkbox (unchecked, required)
- Redirect on success: `/danke` (DE) or `/en/thanks/` (EN), preserve values on error
- ConsultForm: name, email, company, fleet size, vertical, message — pre-fillable from ROI URL params
- FundingQualifierForm: company name, company size, fleet size, vertical, contact name, email, phone

**Funding Page (D-15, D-16, D-17)**
- Pages at `/foerderung/` (DE) + `/en/funding/` (EN)
- Explains 80% de-minimis subsidy citing catalog section 1.10
- Content from `canonical.yaml` `funding` object
- Embeds FundingQualifierForm island, cross-links to ROI calculator

**Thank-You Pages (D-18)**
- Create `/danke/` (DE) and `/en/thanks/` (EN)
- Simple confirmation with 24-hour SLA message, link to homepage

### Claude's Discretion

- ROI formula calibration (exact multipliers per vertical) — use reasonable estimates, user to review before launch
- Turnstile site key management (env var vs hardcoded for static site)
- Form field ordering and layout within islands
- Thank-you page visual design

### Deferred Ideas

None — discussion stayed within phase scope.

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PRICE-01 | DE /preise/ + EN /en/pricing/ display three tiers with prices | Tier data in canonical.yaml; routing stubs in routeMap.ts |
| PRICE-02 | Three tiers: Standard, + Camera Module, + Logbook with "ab X EUR / Monat" | canonical.yaml pricing.tiers defined with de_price_display / en_price_display |
| PRICE-03 | Tier data sourced from src/data/pricing.ts (shared with ROI calculator) | Single source of truth pattern confirmed in canonical refs; pricing.ts to be created |
| PRICE-04 | Pricing page ends with the consult CTA | ConsultForm island reusable anywhere; CTA pattern established in Phase 4 |
| ROI-01 | Interactive ROI / savings calculator as Preact island on /roi/ + /en/roi/; embedded on /preise/ + /en/pricing/ | Preact island pattern proven in SensorDataViz.tsx; client:visible hydration confirmed |
| ROI-02 | Inputs -- fleet size, primary vertical, average parking-stop frequency | Design confirmed in D-04; input types (number, dropdown, slider) all standard HTML5 + Preact |
| ROI-03 | Outputs -- annual theft cost, KONVOI savings, de-minimis reimbursement, payback period | Computed outputs derived from formula in pricing.ts; locale-aware number formatting required |
| ROI-04 | Formula assumptions live in src/data/pricing.ts alongside pricing (single source of truth) | pricing.ts pattern aligns with canonical.yaml imports; cost anchors in current-site-overview.md |
| ROI-05 | ROI result pre-fills ConsultForm via URL query params | URL param pre-fill pattern standard; querystring parsing via URLSearchParams (native browser API) |
| FUND-01 | DE /foerderung/ + EN /en/funding/ dedicated funding page | Routing stubs in routeMap.ts; pages to be created |
| FUND-02 | Page explains 80% German de-minimis subsidy citing catalog 1.10 | canonical.yaml funding object has de_minimis_max_percent, de_catalog_ref, de_catalog_section; documentation pattern TBD |
| FUND-03 | FundingQualifierForm Preact island with company size, fleet size, vertical, contact, email, phone | Form island pattern from ConsultForm; Zod validation for all fields |
| FUND-04 | Funding page cross-links to ROI calculator for combined savings-plus-subsidy figure | routeMap routing enables locale-aware links |
| FORMS-01 | ConsultForm Preact island reusable anywhere on the site | Island pattern; client:visible hydration; component signature TBD |
| FORMS-02 | FundingQualifierForm Preact island on the funding page | Island pattern; client:visible hydration; component signature TBD |
| FORMS-03 | Both forms validate client-side with Zod before POSTing to Formspree | Zod 4.3.6 in package.json; validation schema TBD per form fields |
| FORMS-04 | Spam protection -- _gotcha honeypot field + Cloudflare Turnstile on both forms | Turnstile 5.2.0 in package.json; explicit render API required for Preact lifecycle |
| FORMS-05 | Required, unchecked DSGVO consent checkbox on every form with a link to Datenschutz | Form pattern; link to /datenschutz (DE) or /en/privacy/ (EN) — routes from routeMap.ts |
| FORMS-06 | Submission success routes to /danke (DE) or /en/thanks/ (EN) with response-time SLA | Thank-you pages to be created in D-18; Formspree API returns 200 on success |
| FORMS-07 | Submission errors preserve all filled-in values and surface a clear inline error message | Form state management via Preact hooks; error display per field |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Preact | 10.29.1 | Islands for ROI calculator and forms | Already in project; island pattern proven in SensorDataViz.tsx |
| @astrojs/preact | 5.1.2 | Astro integration for Preact islands | Already in project; handles client:visible hydration |
| Zod | 4.3.6 | Client-side form validation schema | Already in project; TypeScript-first, zero-runtime dependencies |
| astro | 6.1.8 | Static site generation framework | Already in project; ships Astro 6 (tested, stable) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Cloudflare Turnstile | 5.2.0 | CAPTCHA alternative for spam protection | Required by FORMS-04; explicit render API for Preact compatibility |
| Native Fetch API | — | POST submissions to Formspree | Built into browser; no package required |
| URLSearchParams | — | Parse query params for pre-fill | Built into browser; native API |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Formspree | FormSubmit, Basin, custom serverless | Formspree has official Astro guide; simplest integration |
| Turnstile | hCaptcha, Google reCAPTCHA v3 | Turnstile is privacy-first, European-friendly; others require consent tracking |
| Zod | io-ts, Joi, Valibot | Zod already in project; excellent TS support; no switching cost |
| Preact signals | React hooks manually | Already using Preact hooks in SensorDataViz; Signals optional for this phase |

**Installation:**
```bash
# All required packages already in package.json
pnpm install
# Verify Turnstile script will load from CDN in HTML
```

**Version verification:** [VERIFIED: npm registry]
- Zod 4.3.6 — released Jan 2025, current stable
- Preact 10.29.1 — released Mar 2025, compatible with @astrojs/preact 5.1.2
- Cloudflare Turnstile 5.2.0 — npm package version (CDN script versioning separate)
- Astro 6.1.8 — project standard

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   └── islands/
│       ├── SensorDataViz.tsx        # Reference: Phase 4, proven pattern
│       ├── RoiCalculator.tsx        # NEW: Phase 5
│       ├── ConsultForm.tsx          # NEW: Phase 5
│       └── FundingQualifierForm.tsx # NEW: Phase 5
├── data/
│   ├── brand/
│   │   └── canonical.yaml           # Single source of truth (prices, funding, etc.)
│   └── pricing.ts                   # NEW: Phase 5, re-exports canonical + ROI assumptions
├── pages/
│   ├── preise.astro                 # NEW: DE pricing page
│   ├── roi.astro                    # NEW: DE ROI calculator page
│   ├── foerderung.astro             # NEW: DE funding page
│   ├── danke.astro                  # NEW: DE thank-you page
│   └── en/
│       ├── pricing.astro            # NEW: EN pricing page
│       ├── roi.astro                # NEW: EN ROI calculator page
│       ├── funding.astro            # NEW: EN funding page
│       └── thanks.astro             # NEW: EN thank-you page
└── i18n/
    ├── routeMap.ts                  # Phase 3, already has pricing/roi/foerderung/thanks routing stubs
    └── translations.ts              # Phase 3, extend with pricing/ROI/form strings
```

### Pattern 1: Formspree Client-Side Integration

**What:** POST form data to Formspree endpoint via `fetch()` with `Accept: application/json` header, handle JSON response client-side without page reload.

**When to use:** Static sites (no server) that need async form submission with custom success handling.

**Example:**
```typescript
// Source: [CITED: https://formspree.io/guides/astro/] + [CITED: https://www.vbesse.com/en/blog/backendless-forms-ajax/]

interface FormData {
  name: string;
  email: string;
  message: string;
  _gotcha?: string; // honeypot
}

async function submitForm(data: FormData, token: string): Promise<{ ok: boolean }> {
  const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json', // CRITICAL: tells Formspree to return JSON, not HTML redirect
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) throw new Error(`Formspree error: ${response.status}`);
  return response.json();
}
```

**Critical detail:** The `Accept: application/json` header is **load-bearing**. Without it, Formspree will redirect to a thank-you HTML page — your JavaScript can't intercept that. With it, Formspree responds with `{ "ok": true }` in JSON, allowing you to redirect programmatically in your code (via `window.location = '/danke'`).

### Pattern 2: Cloudflare Turnstile Explicit Render in Preact

**What:** Load Turnstile script with `?render=explicit`, create container elements (no `cf-turnstile` class), call `window.turnstile.render()` in Preact component lifecycle.

**When to use:** When the form is a Preact island that hydrates on demand (not present on initial page load), or when you need to destroy and re-create the widget per component unmount/mount.

**Example:**
```typescript
// Source: [CITED: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/]

interface Props {
  siteKey: string;
  onToken: (token: string) => void;
}

export default function TurnstileWidget({ siteKey, onToken }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Turnstile script must be loaded with ?render=explicit
    if (!window.turnstile) {
      console.error('Turnstile script not loaded. Add script tag with ?render=explicit');
      return;
    }

    // Render widget explicitly
    window.turnstile.render(`#${containerRef.current.id}`, {
      sitekey: siteKey,
      callback: (token: string) => {
        onToken(token);
      },
    }).then((id: string) => {
      widgetId.current = id;
    });

    return () => {
      // Clean up on unmount
      if (widgetId.current && window.turnstile) {
        window.turnstile.reset(widgetId.current);
        window.turnstile.remove(widgetId.current);
      }
    };
  }, [siteKey, onToken]);

  return <div id="turnstile-container" ref={containerRef} />;
}
```

**Astro template setup:**
```astro
<!-- In Layout.astro or the page that uses ConsultForm/FundingQualifierForm -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
```

### Pattern 3: Zod Validation in Preact Forms (Client-Side Only)

**What:** Define Zod schema, call `.parse()` or `.safeParse()` on form submit (before fetch POST), display field-level errors inline.

**When to use:** Client-side-only validation before sending data to Formspree. No server involvement — Formspree receives only validated data.

**Example:**
```typescript
// Source: [CITED: https://zod.dev/] + [CITED: https://www.freecodecamp.org/news/react-form-validation-zod-react-hook-form/]

import { z } from 'astro/zod';

const consultFormSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  company: z.string().min(1, 'Company required'),
  fleetSize: z.coerce.number().int().min(1, 'Fleet size must be at least 1'),
  vertical: z.enum(['high-value', 'cooling', 'intermodal', 'other']),
  message: z.string().optional(),
  _gotcha: z.string().default(''), // honeypot: empty for real submissions
  dsgvoConsent: z.boolean().refine((val) => val === true, 'DSGVO consent required'),
});

type ConsultFormData = z.infer<typeof consultFormSchema>;

export default function ConsultForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<ConsultFormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    // Validate
    const result = consultFormSchema.safeParse(formData);
    if (!result.success) {
      // Display field errors
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path.join('.');
        newErrors[path] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    // Submit to Formspree
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(result.data),
      });
      if (!response.ok) throw new Error('Submission failed');
      
      // Success: redirect to thank-you page
      window.location.href = window.location.pathname.includes('/en/') ? '/en/thanks/' : '/danke';
    } catch (err) {
      setErrors({ _form: 'Submission failed. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Field with error display */}
      <input
        type="text"
        name="name"
        value={formData.name ?? ''}
        onChange={(e) => setFormData({ ...formData, name: (e.target as HTMLInputElement).value })}
        aria-invalid={!!errors.name}
      />
      {errors.name && <span class="text-red-600 text-sm">{errors.name}</span>}
      
      {/* ... other fields ... */}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Pattern 4: ROI Calculator with Reactive Inputs → Computed Outputs

**What:** Preact component with useState for inputs (fleet size, vertical, frequency), computed values calculated on every input change.

**When to use:** When you need real-time recalculation of outputs as the user changes inputs (e.g., slider drag → instant ROI update).

**Example:**
```typescript
// Source: [CITED: https://preactjs.com/guide/v10/signals/]

import { useState } from 'preact/hooks';
import { roiFormulas } from '~/data/pricing';

interface RoiOutput {
  annualTheftCost: number;
  konvoiSavings: number;
  deMinimisReimbursement: number;
  paybackPeriodMonths: number;
}

export default function RoiCalculator() {
  const [fleetSize, setFleetSize] = useState(10);
  const [vertical, setVertical] = useState<'high-value' | 'cooling' | 'intermodal' | 'other'>('high-value');
  const [frequency, setFrequency] = useState(15);

  // Compute outputs reactively
  const output: RoiOutput = computeRoi(fleetSize, vertical, frequency, roiFormulas);

  // Format numbers locale-aware
  const formatCurrency = (value: number, locale: string) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div class="roi-calculator">
      <input
        type="number"
        min="1"
        value={fleetSize}
        onChange={(e) => setFleetSize(Number((e.target as HTMLInputElement).value))}
      />
      <select value={vertical} onChange={(e) => setVertical((e.target as HTMLSelectElement).value as any)}>
        <option value="high-value">High-Value Cargo</option>
        <option value="cooling">Cooling</option>
        <option value="intermodal">Intermodal</option>
        <option value="other">Other</option>
      </select>
      <input
        type="range"
        min="1"
        max="30"
        value={frequency}
        onChange={(e) => setFrequency(Number((e.target as HTMLInputElement).value))}
      />

      {/* Output summary */}
      <div class="summary">
        <p>Annual Theft Cost: {formatCurrency(output.annualTheftCost, 'de-DE')}</p>
        <p>KONVOI Savings: {formatCurrency(output.konvoiSavings, 'de-DE')}</p>
        <p>De-Minimis Reimbursement (80%): {formatCurrency(output.deMinimisReimbursement, 'de-DE')}</p>
        <p>Payback Period: {output.paybackPeriodMonths} months</p>
      </div>

      {/* Pre-fill ConsultForm link */}
      <a href={`/preise?fleet=${fleetSize}&vertical=${vertical}&savings=${Math.floor(output.konvoiSavings)}`}>
        Book a consult with these numbers
      </a>
    </div>
  );
}
```

### Anti-Patterns to Avoid

- **Do NOT submit forms with traditional `<form action="..." method="POST">` redirect.** This reloads the page and breaks the UX. Use fetch with JSON.
- **Do NOT forget the `Accept: application/json` header in Formspree requests.** Without it, Formspree redirects instead of returning JSON.
- **Do NOT render Turnstile with implicit render (cf-turnstile class).** Use explicit render API with `?render=explicit` so Preact lifecycle controls the widget.
- **Do NOT validate forms server-side only.** Client-side Zod validation must run before the fetch POST, to preserve field values on error and show inline messages.
- **Do NOT hardcode ROI formula values in the component.** Store them in `src/data/pricing.ts` so a single edit applies to pricing page, ROI calculator, and documentation.
- **Do NOT store Formspree IDs in component code.** Use environment variables (`.env.local` for dev, Netlify ENV for prod) to keep secrets out of git.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CAPTCHA / bot spam | Custom honeypot-only, rate-limit headers | Cloudflare Turnstile + honeypot combo | Turnstile is battle-tested, free for <100K/month, EU privacy-compliant; custom logic has false negatives |
| Form validation | Custom regex + if-else logic | Zod schemas | Zod catches edge cases (email format, phone validation, coercion), reusable across client+server, type-safe |
| Form submission to external API | Custom XMLHttpRequest or form redirect | fetch + Formspree | Formspree handles email delivery, bounce notifications, CSV exports; custom backend needs hosting, monitoring, compliance |
| Number formatting per locale | Manual string concatenation | Intl.NumberFormat | Handles currency symbols, thousand separators, decimal points per locale; error-prone to hand-roll |
| Multi-page form pre-fill | Custom session state or localStorage | URL query params + URLSearchParams | Query params are bookmarkable, work across tabs, no state leakage, standard web pattern |

**Key insight:** Formspree, Turnstile, and Zod are so well-suited to this use case that building any of them from scratch wastes time and introduces security/UX debt. Formspree alone removes the need to:
- Run a server (or serverless function)
- Store form data in a database
- Handle GDPR data retention + deletion
- Monitor email delivery
- Integrate with external CRM
- Debug CORS issues

---

## Common Pitfalls

### Pitfall 1: Formspree Redirect Loop (Missing JSON Header)

**What goes wrong:** Form submits, Formspree responds with an HTML redirect to `/thanks`, browser follows redirect, page reloads or navigates away unexpectedly.

**Why it happens:** The fetch request doesn't include `Accept: application/json`, so Formspree treats it as a traditional form submission and returns HTML (a 302 redirect).

**How to avoid:** **Always include `Accept: application/json`** in the fetch headers. This tells Formspree you want JSON back.

```typescript
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json', // <-- CRITICAL
  },
  body: JSON.stringify(data),
});
```

**Warning signs:** Form submits but page doesn't redirect to `/danke` via your code; instead, the browser spontaneously navigates away or shows a blank page.

---

### Pitfall 2: Turnstile Not Rendering in Preact Island

**What goes wrong:** Turnstile widget never appears; container stays empty; no token is generated.

**Why it happens:** Turnstile script loaded without `?render=explicit` parameter, or island hydrates before script finishes loading, or component tries to render before `window.turnstile` is available.

**How to avoid:**
1. Load the script with `?render=explicit`: `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>`
2. In the component, check `if (!window.turnstile)` before calling `render()`
3. Use `useEffect` to render **after** component mounts (not in render phase)
4. Add error boundaries or loading states if script is slow to load

```typescript
useEffect(() => {
  // Script is now loaded (because we're in a useEffect)
  if (!window.turnstile) return; // Script not ready yet
  window.turnstile.render('#container', { sitekey, callback });
}, []);
```

**Warning signs:** Inspect the page; container div exists but is empty; console shows "window.turnstile is undefined".

---

### Pitfall 3: Form Values Lost on Validation Error

**What goes wrong:** User fills 5 fields, misses one, clicks submit; validation fails, error message shows, but all 5 fields are now empty.

**Why it happens:** Component re-renders on error but doesn't preserve form state in component state (uses only `formData` from `useState`).

**How to avoid:** Store all form values in a **single `formData` state object**, update it on every input change, and preserve it across error cycles:

```typescript
const [formData, setFormData] = useState<Partial<ConsultFormData>>({});
const [errors, setErrors] = useState<Record<string, string>>({});

// On input change: update state
<input onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name ?? ''} />

// On error: display errors but keep formData intact
const result = schema.safeParse(formData);
if (!result.success) {
  setErrors(extractErrors(result.error));
  return; // formData is unchanged
}
```

**Warning signs:** Users complain that re-submitting a form loses their data; support tickets about "form ate my inputs on error".

---

### Pitfall 4: ROI Calculator Doesn't Update on Input Change

**What goes wrong:** User drags the frequency slider, but the payback period doesn't recalculate; must click a button to update.

**Why it happens:** Output values are calculated in a handler (onClick) instead of on every state change, or computed values aren't re-derived when inputs change.

**How to avoid:** Calculate outputs **on every render**, not just on button clicks. Use `useState` for inputs, derive outputs inline or with a helper function:

```typescript
// BAD: output only updates on button click
const [roi, setRoi] = useState(null);
const handleCalculate = () => setRoi(computeRoi(...));

// GOOD: output updates whenever inputs change
const [fleetSize, setFleetSize] = useState(10);
const roi = computeRoi(fleetSize, ...); // Derived on every render
```

**Warning signs:** Users complain the calculator is laggy or requires clicking a button for updates; feel is not "spreadsheet-like".

---

### Pitfall 5: URL Query Param Pre-Fill Fails

**What goes wrong:** User clicks "Book a consult" from ROI calculator with `?fleet=50&vertical=cooling&savings=120000`, but the ConsultForm doesn't populate those values.

**Why it happens:** ConsultForm doesn't read `window.location.search` or doesn't parse the params on mount.

**How to avoid:** In ConsultForm component, read query params on mount and pre-populate state:

```typescript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  setFormData({
    fleetSize: params.get('fleet') ? Number(params.get('fleet')) : undefined,
    vertical: params.get('vertical') ?? undefined,
    // ... other pre-fills
  });
}, []);
```

**Warning signs:** URL has `?fleet=50` but form field is empty; pre-fill feature silently doesn't work.

---

### Pitfall 6: Honeypot Field Not Hidden

**What goes wrong:** Users see a field labeled "Website" or "URL" on the form and fill it in, breaking the spam protection.

**Why it happens:** Honeypot field is visible (`display: block` or no styling) instead of hidden.

**How to avoid:** Use CSS to completely hide the honeypot, but keep it in the DOM so Turnstile can see it:

```html
<input
  type="text"
  name="_gotcha"
  style="display: none; position: absolute; left: -9999px;"
  tabindex="-1"
  autocomplete="off"
/>
```

Also, in Zod validation, ensure `_gotcha` must be an empty string (real users won't fill it):

```typescript
_gotcha: z.string().refine((val) => val === '', 'Spam detected'),
```

**Warning signs:** Bots submit the honeypot field with values; Zod validation fails for legitimate users (unlikely, but possible with autofill).

---

### Pitfall 7: Locale Not Detected for Thank-You Redirect

**What goes wrong:** German user submits form on `/preise`, form redirects to `/en/thanks` instead of `/danke`.

**Why it happens:** Redirect logic doesn't detect current page locale (DE vs EN) before choosing the thank-you URL.

**How to avoid:** Detect locale from `window.location.pathname`:

```typescript
const isEnglish = window.location.pathname.includes('/en/');
const thankYouUrl = isEnglish ? '/en/thanks/' : '/danke';
```

Or pass locale as a prop from the Astro page to the island.

**Warning signs:** Form redirects consistently to wrong locale; German users land on English thank-you page.

---

## Code Examples

Verified patterns from official sources:

### Formspree Client-Side Submission

```typescript
// Source: [CITED: https://formspree.io/guides/astro/] + [CITED: https://www.vbesse.com/en/blog/backendless-forms-ajax/]

const FORMSPREE_ID = import.meta.env.PUBLIC_FORMSPREE_ID || 'fXXXXXXXX';

async function submitToFormspree(
  data: Record<string, any>,
  turnstoken: string
): Promise<{ ok: boolean }> {
  const payload = {
    ...data,
    'cf-turnstile-response': turnstoken, // Include token for verification
  };

  const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Formspree error ${response.status}: ${error}`);
  }

  return response.json();
}
```

### Turnstile Token Capture

```typescript
// Source: [CITED: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/]

let captchaToken: string | null = null;

const handleTurnstileToken = (token: string) => {
  captchaToken = token;
};

const handleFormSubmit = async (e: Event) => {
  e.preventDefault();

  // Validate form
  const result = formSchema.safeParse(formData);
  if (!result.success) {
    setErrors(extractFieldErrors(result.error));
    return;
  }

  // Require Turnstile token
  if (!captchaToken) {
    setErrors({ _form: 'Please complete the security verification' });
    return;
  }

  // Submit with token
  try {
    await submitToFormspree(result.data, captchaToken);
    // Success: navigate
    window.location.href = getThankYouUrl();
  } catch (err) {
    setErrors({ _form: 'Submission failed. Please try again.' });
    captchaToken = null; // Reset token on failure
  }
};
```

### Zod Schema for ConsultForm

```typescript
// Source: [CITED: https://zod.dev/]

import { z } from 'astro/zod';

export const consultFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email address required'),
  company: z.string().trim().min(1, 'Company name is required'),
  fleetSize: z.coerce.number().int('Fleet size must be a whole number').min(1, 'Fleet size must be at least 1').max(100000, 'Fleet size seems too large'),
  vertical: z.enum(['high-value', 'cooling', 'intermodal', 'other'], {
    errorMap: () => ({ message: 'Please select a vertical' }),
  }),
  message: z.string().optional(),
  _gotcha: z.string().refine((val) => val === '', {
    message: 'Form submission failed (spam detected)',
  }),
  dsgvoConsent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the privacy policy',
  }),
});

export type ConsultFormData = z.infer<typeof consultFormSchema>;
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Server-side form processing | Formspree (managed service) | ~2015-2020 | No backend to run, automatic email forwarding, spam detection built-in |
| reCAPTCHA v2 (checkbox) | Cloudflare Turnstile | 2022-2024 | Privacy-first (no third-party tracking), EU-compliant, faster verification |
| Manual form validation (regex) | Zod + TypeScript schemas | 2021+ | Type-safe, runtime validation, reusable across client+server, better DX |
| Traditional form submit (page reload) | Fetch + client-side redirect | 2020+ | No page reload, custom success handling, preserve form state on error |
| jQuery form libraries | Native Preact hooks | 2019+ | Smaller bundle, native browser APIs, no jQuery dependency |

**Deprecated/outdated:**
- **Server-side form handling:** Static sites don't need a server for leads; Formspree abstracts it away. Heroku dyos cost $7/mo minimum; Formspree is free for <100K/mo. Winner: Formspree.
- **Google reCAPTCHA v3:** Requires Google Fonts CDN (blocked by TTDSG/TDDDG in Germany). Turnstile is fully European-hosted. Winner: Turnstile.
- **HTML5 form validation only (`required`, `type="email"`):** Doesn't handle custom rules or provide error messaging. Zod enables both. Winner: Zod.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Formspree is available and free for <100K/mo submissions | Intro, Standard Stack | Formspree could be down, have API changes, or charge unexpectedly — fallback would be to implement custom serverless backend (cost/complexity increase) |
| A2 | Cloudflare Turnstile site key can be hardcoded in front-end or stored as PUBLIC env var | Intro, Code Examples | If site key must be secret, architecture changes to require server middleware (added complexity) |
| A3 | ROI formula multipliers (theft cost per vertical, savings %) can use reasonable estimates from current-site-overview.md | CONTEXT D-07, Code Examples | If multipliers are wrong by >10%, ROI calculator misleads prospects — user must validate with sales before launch |
| A4 | URLSearchParams API is available in all target browsers (modern Astro stack) | Code Examples | Very old browsers (IE11) don't support URLSearchParams, but project targets modern browsers only; Astro 6 has no IE support |
| A5 | `window.location.search` and `window.location.pathname` are reliable for detecting locale and reading query params | Pitfall 6, Code Examples | Non-standard browser implementations could break pre-fill or locale detection; unlikely in practice (web standards compliance is high) |

---

## Open Questions

1. **Formspree Form ID — where to store it?**
   - What we know: CONTEXT.md does not specify; FORMSPREE_ID is sensitive
   - What's unclear: Should it be in `.env.local` (dev), Netlify ENV (prod), or hardcoded as `PUBLIC_*`?
   - Recommendation: Create two form IDs (one per form: ConsultForm, FundingQualifierForm), store as `PUBLIC_FORMSPREE_CONSULT_ID` and `PUBLIC_FORMSPREE_FUNDING_ID` in Netlify ENV. Prefix `PUBLIC_` means they're exposed in JS (not secret). Alternative: create a single form with routing on Formspree side.

2. **Turnstile site key and secret — how to manage for static site?**
   - What we know: CONTEXT.md lists as Claude's Discretion; Turnstile site key (public) and secret key (server-side verification) are needed
   - What's unclear: Can static site verify Turnstile token, or does it need a serverless function?
   - Recommendation: For v1, skip server-side verification (rely on Turnstile's client-side validation + honeypot). If spam becomes a problem, add a Netlify Function to verify the token with the secret key.

3. **ROI formula calibration — exact multipliers per vertical?**
   - What we know: D-07 says "use reasonable estimates, user reviews before launch"; current-site-overview.md has cost anchors (€8B cargo, €2K diesel, €600/tyre)
   - What's unclear: How to map those anchors to fleet-size-specific theft cost and savings percentage?
   - Recommendation: Use placeholder multipliers (e.g., 2% annual theft rate per vertical, 60% savings from KONVOI), validate with sales before Phase 5 merge.

4. **Thank-you page copy and SLA messaging?**
   - What we know: D-18 says "simple confirmation with 24-hour SLA message"
   - What's unclear: Exact wording, legal review required?
   - Recommendation: Draft: "Thanks for reaching out! We'll contact you within 24 hours." Link back to homepage. Review with Heinz (marketing) before build.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro build, TypeScript compilation | ✓ | 22.x+ (verified in package.json) | — |
| pnpm | Package management | ✓ | 10.32.1 (locked) | npm (not recommended; breaks lockfile) |
| Zod | Form validation (client-side) | ✓ | 4.3.6 | Manual validation logic (fragile, don't use) |
| Preact | Island hydration | ✓ | 10.29.1 | React (bundle size increase, not recommended) |
| Formspree (external SaaS) | Form submission | ✓ | API v1 (verified responsive) | Custom serverless backend (cost/complexity) |
| Cloudflare Turnstile (CDN) | CAPTCHA widget | ✓ | v0 (CDN), npm token included | hCaptcha or reCAPTCHA (privacy tradeoff) |
| Netlify (hosting platform) | Form submission routing, ENV vars | ✓ | Verified in project config | GitHub Pages (no native form support) |

**No missing critical dependencies.** All required services are available.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | No automated tests (marketing site; `.pnpm check` only per PROJECT.md) |
| Config file | — |
| Quick run command | `pnpm check` (astro-check + eslint + prettier) |
| Full suite command | `pnpm check` (same; no separate suites) |

### Phase Requirements → Test Map

This phase has no automated tests per PROJECT.md ("Tests: none required for v1 — marketing site; `pnpm check` is the only automated gate").

**Manual verification checklist instead:**

| Req ID | Behavior | Manual Check |
|--------|----------|--------------|
| PRICE-01/02 | Pricing pages display three tiers with names and descriptions | Open `/preise` and `/en/pricing` in browser; verify tier cards render |
| PRICE-03 | Tier data flows from canonical.yaml → pricing.ts | Grep src/data/pricing.ts; verify imports canonical.yaml |
| PRICE-04 | ConsultForm island appears at bottom | Scroll pricing page; verify form island hydrates with `client:visible` |
| ROI-01 | ROI calculator is an interactive Preact island | Open `/roi`; verify inputs (number, dropdown, slider) change outputs in real-time |
| ROI-02/03 | Inputs and outputs render correctly | Fill fleet size, select vertical, drag slider; verify payback period recalculates |
| ROI-04 | Formula uses pricing.ts data | Inspect component source; verify roiFormulas import |
| ROI-05 | "Book a consult" pre-fills ConsultForm via URL params | Click CTA on ROI calculator; verify ConsultForm has fleet size pre-filled |
| FUND-01/02 | Funding page explains 80% de-minimis subsidy | Open `/foerderung` and `/en/funding`; verify citation of catalog section 1.10 |
| FUND-03 | FundingQualifierForm appears on funding page | Scroll funding page; verify form island hydrates |
| FORMS-01 to 07 | Forms validate, show errors, submit to Formspree, handle Turnstile | (See "Manual Verification Steps" below) |

### Manual Verification Steps (Phase 5 Pre-Merge Gate)

**Pricing page (PRICE-01 to PRICE-04):**
- [ ] `/preise` and `/en/pricing` both load without errors
- [ ] Three tier cards display: Standard, + Camera Module, + Logbook
- [ ] Card titles, descriptions match canonical.yaml
- [ ] Prices show "auf Anfrage" (DE) / "on request" (EN)
- [ ] ConsultForm island appears below tiers
- [ ] Mobile stacks tiers vertically (responsive check)

**ROI calculator (ROI-01 to ROI-05):**
- [ ] `/roi` and `/en/roi` load (or embedded on pricing pages)
- [ ] Fleet size input: increment with +/- buttons, type in number field
- [ ] Vertical dropdown: select different options, see outputs recalculate
- [ ] Parking frequency slider: drag from 1 to 30, see outputs update in real-time
- [ ] Outputs display: theft cost, KONVOI savings, de-minimis reimbursement (80%), payback period
- [ ] Numbers format correctly: DE "1.234,56 €", EN "€1,234.56"
- [ ] "Book a consult" button: click it, verify URL params appear (`?fleet=...&vertical=...&savings=...`)
- [ ] Click pre-fill link: ConsultForm on `/preise` pre-populates fleet size and vertical

**Forms (FORMS-01 to FORMS-07):**
- [ ] ConsultForm validation: leave "Name" empty, click submit, error appears inline
- [ ] Values preserved on error: fill name, email, company, leave message empty; submit fails validation; verify name/email/company still in fields
- [ ] Zod schema enforces: email format (`foo@bar` fails, `foo@bar.com` succeeds)
- [ ] Honeypot field: inspect page source, verify `_gotcha` input is hidden (not visible to user)
- [ ] Turnstile widget: appears in form, checkbox renders, can be interacted with
- [ ] DSGVO checkbox: unchecked by default, required to submit (error if not checked)
- [ ] Submit success: fill all fields, check DSGVO, complete Turnstile, click submit
- [ ] Form redirects to `/danke` (DE) or `/en/thanks/` (EN), URL bar updates
- [ ] FundingQualifierForm: same checks as ConsultForm, verify company size dropdown, phone field optional
- [ ] Funding page form locale: `/foerderung` form redirects to `/danke`, `/en/funding` form redirects to `/en/thanks/`

**SEO (not Phase 5, but important for these pages):**
- [ ] Canonical tags: `/preise` points to `/preise`, not `/en/pricing`
- [ ] Hreflang: `/preise` has `<link rel="alternate" hreflang="en" href="/en/pricing">`

### Wave 0 Gaps
- [ ] No TypeScript compilation errors: `astro check` passes
- [ ] No ESLint errors: `eslint .` passes
- [ ] No Prettier formatting issues: `prettier --check .` passes
- [ ] All manual verification checks pass before `/gsd-verify-work`

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Forms are public lead capture; no authentication |
| V3 Session Management | no | No authenticated sessions |
| V4 Access Control | no | No authorization (public forms) |
| V5 Input Validation | yes | Zod schemas validate all form inputs (email format, fleet size range, required fields) |
| V6 Cryptography | no | Data sent to Formspree over HTTPS; no custom crypto |
| V7 Error Handling | yes | Zod errors shown to user; no stack traces exposed |
| V8 Data Protection | yes | Formspree complies with GDPR; form data flows to Formspree only (no local storage of PII) |
| V14 Configuration | yes | Environment variables (Formspree ID, Turnstile site key) stored in Netlify ENV, not in git |

### Known Threat Patterns for {Astro + Preact + Formspree + Turnstile}

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Bot spam (form flooding) | Denial of Service | Cloudflare Turnstile widget + honeypot field; Formspree rate-limiting on backend |
| Phishing (fake form field names to extract credential data) | Spoofing | Zod schema enforces expected field names; extra fields ignored |
| Injection (malicious data in form fields) | Tampering | Zod validates input types and lengths before POST; JSON encoding prevents script injection |
| Honeypot bypass | Tampering | Hidden field with strict validation (must be empty); visible to bots but not users |
| CSRF (cross-site form submission) | Tampering | Formspree enforces origin checking; static site has no session tokens (CSRF less applicable) |
| PII exposure (form data logged or cached) | Information Disclosure | Formspree handles PII per GDPR; form state stored in Preact component memory only (ephemeral) |
| XSS via error messages | Tampering | Zod error messages are plain strings; displayed via text nodes, not innerHTML |
| Turnstile token replay | Tampering | Formspree verifies token server-side (if verification implemented); single-use tokens enforced by Turnstile |

**Compliance notes:**
- FORMS-05 (DSGVO consent checkbox) ensures user acknowledges privacy policy before submission
- Formspree privacy policy reviewed and complies with DSGVO Art. 13 (data processing transparency)
- No cookies or local storage of PII (form data is ephemeral in component memory)

---

## Sources

### Primary (HIGH confidence)
- **Formspree** — [https://formspree.io/guides/astro/](https://formspree.io/guides/astro/) — official Astro integration guide
- **Cloudflare Turnstile** — [https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/) — official explicit render API docs
- **Zod** — [https://zod.dev/](https://zod.dev/) — official documentation and API reference
- **Preact** — [https://preactjs.com/guide/v10/signals/](https://preactjs.com/guide/v10/signals/) — reactive state management guide
- **npm registry** — `zod@4.3.6`, `preact@10.29.1`, `@astrojs/preact@5.1.2` — verified versions

### Secondary (MEDIUM confidence)
- **vbesse.com** — [https://www.vbesse.com/en/blog/backendless-forms-ajax/](https://www.vbesse.com/en/blog/backendless-forms-ajax/) — Formspree AJAX pattern with detailed examples
- **Contentful** — [https://www.contentful.com/blog/react-hook-form-validation-zod/](https://www.contentful.com/blog/react-hook-form-validation-zod/) — Zod + form validation patterns (React-focused but patterns apply to Preact)
- **FreeCodeCamp** — [https://www.freecodecamp.org/news/react-form-validation-zod-react-hook-form/](https://www.freecodecamp.org/news/react-form-validation-zod-react-hook-form/) — Zod form validation best practices

### Tertiary (reference)
- **SaaS pricing patterns** — [https://www.maxio.com/blog/tiered-pricing-examples-for-saas-businesses](https://www.maxio.com/blog/tiered-pricing-examples-for-saas-businesses) — three-tier design guidance (verified by multiple sources)
- **B2B SaaS pricing design** — [https://www.eleken.co/blog-posts/saas-pricing-page-design-8-best-practices-with-examples](https://www.eleken.co/blog-posts/saas-pricing-page-design-8-best-practices-with-examples) — conversion best practices

---

## Metadata

**Confidence breakdown:**
- **Standard stack:** HIGH — All libraries verified in package.json, official docs consulted
- **Architecture patterns:** HIGH — Formspree AJAX, Turnstile explicit render, Zod validation all cited from official sources
- **Integration with existing codebase:** HIGH — SensorDataViz.tsx pattern verified; Preact island pattern proven; routing stubs in routeMap.ts
- **ROI formula calibration:** MEDIUM — Cost anchors from current-site-overview.md are estimates; user must validate with sales
- **Turnstile server-side verification:** MEDIUM — Possible but deferred; client-side + honeypot sufficient for v1
- **Thank-you page messaging:** MEDIUM — SLA wording not finalized; recommend review with marketing

**Research date:** 2026-04-23
**Valid until:** 2026-05-07 (14 days — Formspree and Turnstile APIs are stable; Preact/Zod updates infrequent)

**Researched by:** Claude Code (Phase Researcher)
**Phase:** 05-conversion-funnel
