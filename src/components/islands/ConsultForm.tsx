// src/components/islands/ConsultForm.tsx
// Preact island: reusable consult request form.
// Zod client-side validation, _gotcha honeypot, Cloudflare Turnstile,
// DSGVO consent, Formspree submission, ROI pre-fill from URL params.
// Per FORMS-01, FORMS-03–07 and threat model T-05-03-01 to T-05-03-07.

import { useState, useEffect } from 'preact/hooks';
import { z } from 'zod';
import { t } from '~/i18n/translations';

interface ConsultFormProps {
  locale: 'de' | 'en';
}

const buildConsultSchema = () =>
  z.object({
    name:          z.string().min(1, 'form.error_required'),
    email:         z.string().min(1, 'form.error_required').email('form.error_email'),
    phone:         z.string().optional(),
    company:       z.string().min(1, 'form.error_required'),
    fleet_size:    z.coerce.number().min(1, 'form.error_fleet_min'),
    message:       z.string().optional(),
    dsgvo_consent: z.literal(true, { errorMap: () => ({ message: 'form.error_dsgvo' }) }),
  });

export default function ConsultForm({ locale }: ConsultFormProps) {
  const [fields, setFields] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    fleet_size: '',
    message: '',
    dsgvo_consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Pre-fill from URL params on mount (fleet_size and estimated_savings from ROI calculator)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fleetSize = params.get('fleet_size');
    const savings = params.get('estimated_savings');
    setFields((prev) => ({
      ...prev,
      ...(fleetSize ? { fleet_size: fleetSize } : {}),
      ...(savings
        ? {
            message: `${locale === 'de' ? 'Geschätztes Einsparpotenzial' : 'Estimated savings'}: €${parseInt(savings, 10).toLocaleString('de-DE')}`,
          }
        : {}),
    }));
  }, []);

  // Load Turnstile script on mount
  useEffect(() => {
    if (document.querySelector('script[src*="turnstile"]')) return; // already loaded
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const value =
      target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setFields((prev) => ({ ...prev, [target.name]: value }));
    // Clear error for this field on edit
    if (errors[target.name]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[target.name];
        return n;
      });
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setErrors({});

    // 1. Zod validation
    const schema = buildConsultSchema();
    const result = schema.safeParse({
      ...fields,
      fleet_size: fields.fleet_size === '' ? undefined : fields.fleet_size,
      dsgvo_consent: fields.dsgvo_consent,
    });
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!newErrors[key]) newErrors[key] = t(issue.message, locale);
      }
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // 2. Build FormData for Formspree
    const formData = new FormData();
    formData.append('name', fields.name);
    formData.append('email', fields.email);
    formData.append('phone', fields.phone || '');
    formData.append('company', fields.company);
    formData.append('fleet_size', String(fields.fleet_size));
    formData.append('message', fields.message || '');
    // Honeypot — always empty; bots fill this and Formspree silently rejects (T-05-03-03)
    formData.append('_gotcha', '');
    // Get Turnstile token from rendered widget field
    const turnstileInput = document.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]');
    if (turnstileInput?.value) formData.append('cf-turnstile-response', turnstileInput.value);
    formData.append('_next', locale === 'de' ? '/danke' : '/en/thanks');

    // 3. POST to Formspree
    try {
      const response = await fetch(
        `https://formspree.io/f/${import.meta.env.PUBLIC_FORMSPREE_CONSULT_ID}`,
        { method: 'POST', headers: { Accept: 'application/json' }, body: formData }
      );
      if (response.ok) {
        window.location.href = locale === 'de' ? '/danke' : '/en/thanks';
      } else {
        setSubmitError(t('form.error_submit', locale));
      }
    } catch {
      setSubmitError(t('form.error_submit', locale));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate class="space-y-4 w-full max-w-lg mx-auto">

      {/* Name */}
      <div class="space-y-1">
        <label for="name" class="block text-sm font-medium">
          {t('form.name_label', locale)}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={fields.name}
          onInput={handleChange}
          placeholder={t('form.name_placeholder', locale)}
          class={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          } dark:bg-slate-800 dark:text-slate-100`}
          required
        />
        {errors.name && (
          <p class="text-sm text-red-500 mt-1" role="alert">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div class="space-y-1">
        <label for="email" class="block text-sm font-medium">
          {t('form.email_label', locale)}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={fields.email}
          onInput={handleChange}
          placeholder={t('form.email_placeholder', locale)}
          class={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          } dark:bg-slate-800 dark:text-slate-100`}
          required
        />
        {errors.email && (
          <p class="text-sm text-red-500 mt-1" role="alert">{errors.email}</p>
        )}
      </div>

      {/* Phone (optional) */}
      <div class="space-y-1">
        <label for="phone" class="block text-sm font-medium">
          {t('form.phone_label', locale)}{' '}
          <span class="text-slate-400 font-normal text-xs">(optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={fields.phone}
          onInput={handleChange}
          placeholder={t('form.phone_placeholder', locale)}
          class="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      {/* Company */}
      <div class="space-y-1">
        <label for="company" class="block text-sm font-medium">
          {t('form.company_label', locale)}
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={fields.company}
          onInput={handleChange}
          placeholder={t('form.company_placeholder', locale)}
          class={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.company ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          } dark:bg-slate-800 dark:text-slate-100`}
          required
        />
        {errors.company && (
          <p class="text-sm text-red-500 mt-1" role="alert">{errors.company}</p>
        )}
      </div>

      {/* Fleet size */}
      <div class="space-y-1">
        <label for="fleet_size" class="block text-sm font-medium">
          {t('form.fleet_label', locale)}
        </label>
        <div class="flex items-center gap-2">
          <input
            type="number"
            id="fleet_size"
            name="fleet_size"
            min={1}
            value={fields.fleet_size}
            onInput={handleChange}
            placeholder={t('form.fleet_placeholder', locale)}
            class={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.fleet_size ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
            } dark:bg-slate-800 dark:text-slate-100`}
            required
          />
          <span class="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {t('form.fleet_unit', locale)}
          </span>
        </div>
        {errors.fleet_size && (
          <p class="text-sm text-red-500 mt-1" role="alert">{errors.fleet_size}</p>
        )}
      </div>

      {/* Message (optional) */}
      <div class="space-y-1">
        <label for="message" class="block text-sm font-medium">
          {t('form.message_label', locale)}{' '}
          <span class="text-slate-400 font-normal text-xs">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={fields.message}
          onInput={handleChange}
          placeholder={t('form.message_placeholder', locale)}
          class="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      {/* Honeypot — hidden from users; bots fill this (T-05-03-03) */}
      <input type="text" name="_gotcha" style="display:none" tabindex={-1} autocomplete="off" />

      {/* Cloudflare Turnstile widget — implicit rendering (T-05-03-04) */}
      <div class="cf-turnstile" data-sitekey={import.meta.env.PUBLIC_TURNSTILE_SITEKEY}></div>

      {/* DSGVO consent (T-05-03-05) */}
      <div class="space-y-1">
        <div class="flex items-start gap-2">
          <input
            type="checkbox"
            id="dsgvo_consent"
            name="dsgvo_consent"
            checked={fields.dsgvo_consent}
            onChange={handleChange}
            class="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
          />
          <label for="dsgvo_consent" class="text-sm text-slate-600 dark:text-slate-400">
            {t('form.dsgvo_label', locale)}
            <a
              href="/datenschutz"
              class="text-primary underline underline-offset-2 hover:no-underline"
            >
              {t('form.dsgvo_link_text', locale)}
            </a>
          </label>
        </div>
        {errors.dsgvo_consent && (
          <p class="text-sm text-red-500 mt-1" role="alert">{errors.dsgvo_consent}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        class="w-full rounded-lg bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? t('form.submitting', locale) : t('form.submit_consult', locale)}
      </button>

      {submitError && (
        <p class="text-sm text-red-500 text-center mt-2" role="alert">{submitError}</p>
      )}
    </form>
  );
}
