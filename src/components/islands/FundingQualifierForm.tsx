// src/components/islands/FundingQualifierForm.tsx
// Preact island — hydrated client:visible.
// Per D-08: FundingQualifierForm Preact island (FORMS-02).
// Per D-14: fields: companyName, companySize, fleetSize, vertical, contactName, email, phone (optional).
// Per D-09: client-side POST to Formspree via fetch, no page reload.
// Per D-10: Zod validation before POST; inline field errors (FORMS-03, FORMS-07).
// Per D-11: _gotcha honeypot + Cloudflare Turnstile explicit render (FORMS-04).
// Per D-12: DSGVO consent checkbox, unchecked, links to /datenschutz (FORMS-05).

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
  (import.meta.env.PUBLIC_FORMSPREE_FUNDING_ID as string | undefined) ??
  'REPLACE_WITH_FORMSPREE_FUNDING_ID';

const TURNSTILE_SITE_KEY =
  (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined) ??
  '1x00000000000000000000AA'; // Cloudflare test key (always passes) for dev

const VERTICALS: { value: Vertical; de: string; en: string }[] = [
  { value: 'high-value',  de: 'Hochwertige Güter',  en: 'High-Value Cargo' },
  { value: 'cooling',     de: 'Kühltransport',       en: 'Refrigerated Transport' },
  { value: 'intermodal',  de: 'Intermodal',          en: 'Intermodal' },
  { value: 'other',       de: 'Sonstiges',           en: 'Other' },
];

const COMPANY_SIZES: { value: string; de: string; en: string }[] = [
  { value: '1_10',     de: '1–10 Mitarbeiter',   en: '1–10 employees' },
  { value: '11_50',    de: '11–50 Mitarbeiter',  en: '11–50 employees' },
  { value: '51_200',   de: '51–200 Mitarbeiter', en: '51–200 employees' },
  { value: '201_plus', de: '201+ Mitarbeiter',   en: '201+ employees' },
];

// Zod schema per D-10, D-14
const fundingFormSchema = z.object({
  companyName:  z.string().trim().min(1, 'required'),
  companySize:  z.enum(['1_10', '11_50', '51_200', '201_plus'], {
                  errorMap: () => ({ message: 'required' }),
                }),
  fleetSize:    z.coerce.number().int().min(1, 'min1'),
  vertical:     z.enum(['high-value', 'cooling', 'intermodal', 'other'], {
                  errorMap: () => ({ message: 'required' }),
                }),
  contactName:  z.string().trim().min(2, 'min2'),
  email:        z.string().email('email'),
  phone:        z.string().optional(),
  _gotcha:      z.string().refine((v) => v === '', { message: 'spam' }),
  dsgvoConsent: z.boolean().refine((v) => v === true, { message: 'required' }),
});

type FormData = {
  companyName: string;
  companySize: string;
  fleetSize: string;
  vertical: string;
  contactName: string;
  email: string;
  phone: string;
  _gotcha: string;
  dsgvoConsent: boolean;
};

interface Props {
  locale?: string;
}

export default function FundingQualifierForm({ locale = 'de' }: Props) {
  const isDE = locale !== 'en';

  // RESEARCH.md Pitfall 3: single formData state — values preserved on validation error
  const [formData, setFormData] = useState<FormData>({
    companyName: '', companySize: '1_10', fleetSize: '',
    vertical: 'high-value', contactName: '', email: '', phone: '',
    _gotcha: '', dsgvoConsent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | undefined>(undefined);
  const captchaToken = useRef<string | null>(null);

  // Turnstile explicit render per D-11
  // RESEARCH.md Pitfall 2: check window.turnstile before calling render
  useEffect(() => {
    if (!turnstileContainerRef.current) return;
    const tryRender = () => {
      if (!window.turnstile) return;
      turnstileWidgetId.current = window.turnstile.render(
        turnstileContainerRef.current!,
        {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => { captchaToken.current = token; },
          'expired-callback': () => { captchaToken.current = null; },
        }
      );
    };
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

  const errLabel = (code: string): string => {
    const map: Record<string, { de: string; en: string }> = {
      required: { de: 'Pflichtfeld.',                      en: 'Required field.' },
      min2:     { de: 'Mindestens 2 Zeichen.',             en: 'At least 2 characters.' },
      email:    { de: 'Gültige E-Mail erforderlich.',      en: 'Valid email required.' },
      min1:     { de: 'Mindestgröße: 1 Trailer.',          en: 'Minimum: 1 trailer.' },
      spam:     { de: 'Spam erkannt.',                     en: 'Spam detected.' },
      captcha:  { de: 'Bitte Sicherheitscheck abschließen.', en: 'Please complete the security check.' },
      submit:   { de: 'Fehler beim Senden. Bitte erneut versuchen.', en: 'Submission failed. Please try again.' },
    };
    return (isDE ? map[code]?.de : map[code]?.en) ?? code;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    // Step 1: Zod validation (D-10, FORMS-03)
    const result = fundingFormSchema.safeParse(formData);
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
    // CRITICAL: Accept: application/json is LOAD-BEARING (RESEARCH.md Pitfall 1)
    try {
      const payload = {
        ...result.data,
        _gotcha: undefined,
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

      // Step 4: Redirect per D-09 / FORMS-06
      // RESEARCH.md Pitfall 7: use locale prop, not pathname sniffing
      const thankYouUrl = locale === 'en' ? '/en/thanks/' : '/danke';
      window.location.href = thankYouUrl;
    } catch {
      // FORMS-07: preserve formData, show inline error
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
        {isDE ? 'Förder-Vorqualifizierung' : 'Funding Pre-Qualification'}
      </h2>
      <p class="mb-6 text-slate-500 dark:text-slate-400">
        {isDE
          ? 'Kostenlose Prüfung Ihrer BG-Förderberechtigung. Wir melden uns innerhalb von 24 Stunden.'
          : 'Free check of your BG subsidy eligibility. We will be in touch within 24 hours.'}
      </p>

      {errors._form && (
        <div role="alert" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {errLabel(errors._form)}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Honeypot — hidden per D-11, RESEARCH.md Pitfall 6 */}
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
          {/* Company name */}
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {isDE ? 'Unternehmen' : 'Company'} <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onInput={(e) => set('companyName', (e.target as HTMLInputElement).value)}
              aria-invalid={!!errors.companyName}
              class={`w-full rounded-lg border px-4 py-2.5 text-sm ${errors.companyName ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'} dark:border-slate-600 dark:bg-slate-800`}
            />
            {errors.companyName && <p class="mt-1 text-xs text-red-600">{errLabel(errors.companyName)}</p>}
          </div>

          {/* Company size + Fleet size — two columns */}
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {isDE ? 'Unternehmensgröße' : 'Company Size'} <span class="text-red-500">*</span>
              </label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={(e) => set('companySize', (e.target as HTMLSelectElement).value)}
                aria-invalid={!!errors.companySize}
                class={`w-full rounded-lg border px-4 py-2.5 text-sm ${errors.companySize ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'} dark:border-slate-600 dark:bg-slate-800`}
              >
                {COMPANY_SIZES.map((s) => (
                  <option key={s.value} value={s.value}>{isDE ? s.de : s.en}</option>
                ))}
              </select>
              {errors.companySize && <p class="mt-1 text-xs text-red-600">{errLabel(errors.companySize)}</p>}
            </div>
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
          </div>

          {/* Vertical */}
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

          {/* Contact name + Email — two columns */}
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {isDE ? 'Ansprechpartner' : 'Contact Name'} <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onInput={(e) => set('contactName', (e.target as HTMLInputElement).value)}
                aria-invalid={!!errors.contactName}
                class={`w-full rounded-lg border px-4 py-2.5 text-sm ${errors.contactName ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'} dark:border-slate-600 dark:bg-slate-800`}
              />
              {errors.contactName && <p class="mt-1 text-xs text-red-600">{errLabel(errors.contactName)}</p>}
            </div>
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
                class={`w-full rounded-lg border px-4 py-2.5 text-sm ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'} dark:border-slate-600 dark:bg-slate-800`}
              />
              {errors.email && <p class="mt-1 text-xs text-red-600">{errLabel(errors.email)}</p>}
            </div>
          </div>

          {/* Phone (optional) */}
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {isDE ? 'Telefon (optional)' : 'Phone (optional)'}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onInput={(e) => set('phone', (e.target as HTMLInputElement).value)}
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
          </div>

          {/* Turnstile widget container (D-11) — different id from ConsultForm */}
          <div ref={turnstileContainerRef} id="turnstile-funding" />

          {/* DSGVO consent per D-12, FORMS-05 — unchecked by default */}
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
              : (isDE ? 'Vorqualifizierung anfragen' : 'Apply for pre-qualification')}
          </button>
        </div>
      </form>
    </div>
  );
}
