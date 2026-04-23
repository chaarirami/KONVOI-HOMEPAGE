// src/components/islands/ConsultForm.tsx
// Preact island — hydrated client:visible.
// Per D-08: ConsultForm Preact island, reusable anywhere (FORMS-01).
// Per D-09: client-side POST to Formspree via fetch, no page reload.
// Per D-10: Zod validation before POST; inline errors (FORMS-03, FORMS-07).
// Per D-11: _gotcha honeypot + Cloudflare Turnstile explicit render (FORMS-04).
// Per D-12: DSGVO consent checkbox, unchecked, links to /datenschutz (FORMS-05).
// Per D-13: pre-fillable from URL params ?fleet=N&vertical=slug&savings=N (ROI-05).

import { useEffect, useRef, useState } from 'preact/hooks';
import { z } from 'zod';
import type { Vertical } from '~/data/pricing';

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: object) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

const FORMSPREE_ID =
  (import.meta.env.PUBLIC_FORMSPREE_CONSULT_ID as string | undefined) ??
  'REPLACE_WITH_FORMSPREE_ID';

const TURNSTILE_SITE_KEY =
  (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined) ??
  '1x00000000000000000000AA'; // Cloudflare test key (always passes) for dev

const VERTICALS: { value: Vertical; de: string; en: string }[] = [
  { value: 'high-value',  de: 'Hochwertige Güter',  en: 'High-Value Cargo' },
  { value: 'cooling',     de: 'Kühltransport',       en: 'Refrigerated Transport' },
  { value: 'intermodal',  de: 'Intermodal',          en: 'Intermodal' },
  { value: 'other',       de: 'Sonstiges',           en: 'Other' },
];

// Zod schema per D-10 (FORMS-03)
const consultFormSchema = z.object({
  name:         z.string().trim().min(2, 'min2'),
  email:        z.string().email('email'),
  company:      z.string().trim().min(1, 'required'),
  fleetSize:    z.coerce.number().int().min(1, 'min1'),
  vertical:     z.enum(['high-value', 'cooling', 'intermodal', 'other'], {
                  errorMap: () => ({ message: 'required' }),
                }),
  message:      z.string().optional(),
  _gotcha:      z.string().refine((v) => v === '', { message: 'spam' }),
  dsgvoConsent: z.boolean().refine((v) => v === true, { message: 'required' }),
});

type FormData = {
  name: string;
  email: string;
  company: string;
  fleetSize: string;
  vertical: string;
  message: string;
  _gotcha: string;
  dsgvoConsent: boolean;
};

interface Props {
  locale?: string;
}

export default function ConsultForm({ locale = 'de' }: Props) {
  const isDE = locale !== 'en';

  // RESEARCH.md Pitfall 3: single formData state — values preserved on validation error
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', company: '', fleetSize: '',
    vertical: 'high-value', message: '', _gotcha: '', dsgvoConsent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | undefined>(undefined);
  const captchaToken = useRef<string | null>(null);

  // Pre-fill from URL query params per D-13 / ROI-05
  // RESEARCH.md Pitfall 5: use URLSearchParams, check before setting
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fleet = params.get('fleet');
    const vert  = params.get('vertical');
    if (fleet || vert) {
      setFormData((prev) => ({
        ...prev,
        ...(fleet ? { fleetSize: fleet } : {}),
        ...(vert && VERTICALS.some((v) => v.value === vert) ? { vertical: vert } : {}),
      }));
    }
  }, []);

  // Turnstile explicit render per D-11
  // RESEARCH.md Pitfall 2: check window.turnstile before calling render
  useEffect(() => {
    if (!turnstileContainerRef.current) return;

    const tryRender = () => {
      if (!window.turnstile) return; // Script not yet loaded — skip silently
      turnstileWidgetId.current = window.turnstile.render(
        turnstileContainerRef.current!,
        {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => { captchaToken.current = token; },
          'expired-callback': () => { captchaToken.current = null; },
        }
      );
    };

    // Small delay to allow script to initialise after island hydration
    const timer = setTimeout(tryRender, 100);
    return () => {
      clearTimeout(timer);
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = undefined;
        captchaToken.current = null;
      }
    };
  }, []);

  const set = (field: keyof FormData, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // Error label helper (returns localised message from short code)
  const errLabel = (code: string): string => {
    const map: Record<string, { de: string; en: string }> = {
      required: { de: 'Pflichtfeld.',            en: 'Required field.' },
      min2:     { de: 'Mindestens 2 Zeichen.',   en: 'At least 2 characters.' },
      email:    { de: 'Gültige E-Mail erforderlich.', en: 'Valid email required.' },
      min1:     { de: 'Mindestgröße: 1 Trailer.', en: 'Minimum: 1 trailer.' },
      spam:     { de: 'Spam erkannt.',            en: 'Spam detected.' },
      captcha:  { de: 'Bitte Sicherheitscheck abschließen.', en: 'Please complete the security check.' },
      submit:   { de: 'Fehler beim Senden. Bitte erneut versuchen.', en: 'Submission failed. Please try again.' },
    };
    return (isDE ? map[code]?.de : map[code]?.en) ?? code;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    // Step 1: Zod validation (D-10, FORMS-03)
    const result = consultFormSchema.safeParse({
      ...formData,
      fleetSize: formData.fleetSize,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const key = String(err.path[0] ?? '_form');
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return; // PITFALL GUARD: formData untouched — values preserved (FORMS-07)
    }

    // Step 2: Require Turnstile token (D-11, FORMS-04)
    if (!captchaToken.current) {
      setErrors({ _form: 'captcha' });
      return;
    }

    setSubmitting(true);
    setErrors({});

    // Step 3: POST to Formspree (D-09)
    // CRITICAL (RESEARCH.md Pitfall 1): Accept: application/json is LOAD-BEARING
    try {
      const payload = {
        ...result.data,
        _gotcha: undefined, // do not send honeypot value to Formspree
        'cf-turnstile-response': captchaToken.current,
      };
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', // LOAD-BEARING: without this, Formspree returns HTML redirect
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Formspree ${res.status}`);

      // Step 4: Redirect to thank-you page (D-09, FORMS-06)
      // Per D-09 and RESEARCH.md Pitfall 7: use locale prop, not pathname detection
      const thankYouUrl = locale === 'en' ? '/en/thanks/' : '/danke';
      window.location.href = thankYouUrl;
    } catch {
      // FORMS-07: on error, formData preserved; show inline error
      setErrors({ _form: 'submit' });
      setSubmitting(false);
      captchaToken.current = null;
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
    }
  };

  const datenschutzHref = isDE ? '/datenschutz' : '/en/privacy/';

  return (
    <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 class="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
        {isDE ? 'Beratungsgespräch anfragen' : 'Request a Consultation'}
      </h2>
      <p class="mb-6 text-slate-500 dark:text-slate-400">
        {isDE ? 'Wir melden uns innerhalb von 24 Stunden.' : 'We will contact you within 24 hours.'}
      </p>

      {/* Global form error */}
      {errors._form && (
        <div role="alert" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {errLabel(errors._form)}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Honeypot — hidden from users, must be empty for real submissions (D-11, RESEARCH.md Pitfall 6) */}
        <input
          type="text"
          name="_gotcha"
          value={formData._gotcha}
          onInput={(e) => set('_gotcha', (e.target as HTMLInputElement).value)}
          style="display:none;position:absolute;left:-9999px"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div class="grid gap-5">
          {/* Name */}
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {isDE ? 'Name' : 'Name'} <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onInput={(e) => set('name', (e.target as HTMLInputElement).value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'err-name' : undefined}
              class={`w-full rounded-lg border px-4 py-2.5 text-sm ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'} dark:border-slate-600 dark:bg-slate-800`}
            />
            {errors.name && <p id="err-name" class="mt-1 text-xs text-red-600">{errLabel(errors.name)}</p>}
          </div>

          {/* Email */}
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {isDE ? 'E-Mail' : 'Email'} <span class="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onInput={(e) => set('email', (e.target as HTMLInputElement).value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'err-email' : undefined}
              class={`w-full rounded-lg border px-4 py-2.5 text-sm ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'} dark:border-slate-600 dark:bg-slate-800`}
            />
            {errors.email && <p id="err-email" class="mt-1 text-xs text-red-600">{errLabel(errors.email)}</p>}
          </div>

          {/* Company */}
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {isDE ? 'Unternehmen' : 'Company'} <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onInput={(e) => set('company', (e.target as HTMLInputElement).value)}
              aria-invalid={!!errors.company}
              class={`w-full rounded-lg border px-4 py-2.5 text-sm ${errors.company ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'} dark:border-slate-600 dark:bg-slate-800`}
            />
            {errors.company && <p class="mt-1 text-xs text-red-600">{errLabel(errors.company)}</p>}
          </div>

          {/* Fleet size + Vertical — two columns */}
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {isDE ? 'Flottengröße (Trailer)' : 'Fleet Size (Trailers)'} <span class="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="fleetSize"
                min="1"
                value={formData.fleetSize}
                onInput={(e) => set('fleetSize', (e.target as HTMLInputElement).value)}
                aria-invalid={!!errors.fleetSize}
                class={`w-full rounded-lg border px-4 py-2.5 text-sm ${errors.fleetSize ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'} dark:border-slate-600 dark:bg-slate-800`}
              />
              {errors.fleetSize && <p class="mt-1 text-xs text-red-600">{errLabel(errors.fleetSize)}</p>}
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {isDE ? 'Hauptbranche' : 'Primary Vertical'} <span class="text-red-500">*</span>
              </label>
              <select
                name="vertical"
                value={formData.vertical}
                onChange={(e) => set('vertical', (e.target as HTMLSelectElement).value)}
                aria-invalid={!!errors.vertical}
                class={`w-full rounded-lg border px-4 py-2.5 text-sm ${errors.vertical ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'} dark:border-slate-600 dark:bg-slate-800`}
              >
                {VERTICALS.map((v) => (
                  <option key={v.value} value={v.value}>{isDE ? v.de : v.en}</option>
                ))}
              </select>
              {errors.vertical && <p class="mt-1 text-xs text-red-600">{errLabel(errors.vertical)}</p>}
            </div>
          </div>

          {/* Message (optional) */}
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {isDE ? 'Nachricht (optional)' : 'Message (optional)'}
            </label>
            <textarea
              name="message"
              rows={3}
              value={formData.message}
              onInput={(e) => set('message', (e.target as HTMLTextAreaElement).value)}
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
          </div>

          {/* Turnstile widget container (D-11, RESEARCH.md Pattern 2) */}
          <div ref={turnstileContainerRef} id="turnstile-consult" />

          {/* DSGVO consent checkbox (D-12, FORMS-05) — unchecked by default */}
          <div>
            <label class="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                name="dsgvoConsent"
                checked={formData.dsgvoConsent}
                onChange={(e) => set('dsgvoConsent', (e.target as HTMLInputElement).checked)}
                aria-invalid={!!errors.dsgvoConsent}
                class="mt-0.5 h-4 w-4 rounded border-slate-300 accent-konvoi-primary"
              />
              <span>
                {isDE ? 'Ich habe die ' : 'I have read the '}
                <a href={datenschutzHref} class="underline text-konvoi-primary" target="_blank" rel="noopener">
                  {isDE ? 'Datenschutzerklärung' : 'Privacy Policy'}
                </a>
                {isDE ? ' gelesen und stimme zu.' : ' and agree.'}
                <span class="text-red-500 ml-1">*</span>
              </span>
            </label>
            {errors.dsgvoConsent && (
              <p class="mt-1 text-xs text-red-600">{errLabel(errors.dsgvoConsent)}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            class="w-full rounded-lg bg-konvoi-primary px-6 py-3 font-semibold text-white transition hover:bg-konvoi-primary/90 disabled:opacity-60"
          >
            {submitting
              ? (isDE ? 'Wird gesendet…' : 'Sending…')
              : (isDE ? 'Anfrage senden' : 'Send request')}
          </button>
        </div>
      </form>
    </div>
  );
}
