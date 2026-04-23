// src/components/islands/RoiCalculator.tsx
// Preact island — hydrated client:visible (scroll-into-view).
// Per D-04: fleet size (+/- buttons), vertical dropdown, frequency slider.
// Per D-05: summary card with theft cost, KONVOI savings, de-minimis, payback.
// Per D-06: "Book a consult" CTA pre-fills ConsultForm via URL query params.
// Per ROI-04: imports computeRoi and roiFormulas from ~/data/pricing.
// PITFALL GUARD: outputs are DERIVED on every render — no separate calculate button.

import { useState } from 'preact/hooks';
import { computeRoi } from '~/data/pricing';
import type { Vertical } from '~/data/pricing';

interface Props {
  locale?: string;
}

const VERTICALS: { value: Vertical; de: string; en: string }[] = [
  { value: 'high-value',  de: 'Hochwertige Güter',   en: 'High-Value Cargo' },
  { value: 'cooling',     de: 'Kühltransport',        en: 'Refrigerated Transport' },
  { value: 'intermodal',  de: 'Intermodal',           en: 'Intermodal' },
  { value: 'other',       de: 'Sonstiges',            en: 'Other' },
];

function formatCurrency(value: number, locale: string): string {
  // Per D-05: DE uses de-DE (1.234 €), EN uses en-GB (€1,234) per voice.md British EN
  const intlLocale = locale === 'en' ? 'en-GB' : 'de-DE';
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RoiCalculator({ locale = 'de' }: Props) {
  const [fleetSize, setFleetSize] = useState<number>(10);
  const [vertical, setVertical] = useState<Vertical>('high-value');
  const [frequency, setFrequency] = useState<number>(15);

  // PITFALL GUARD (RESEARCH.md §Pitfall 4): derive outputs on every render, never in state
  const result = computeRoi(fleetSize, vertical, frequency);

  const isDE = locale !== 'en';
  const consultHref =
    (isDE ? '/preise#consult' : '/en/pricing#consult') +
    `?fleet=${fleetSize}&vertical=${encodeURIComponent(vertical)}&savings=${result.konvoiSavings}`;

  const paybackLabel =
    result.paybackPeriodMonths <= 0
      ? isDE ? '< 1 Monat' : '< 1 month'
      : `${result.paybackPeriodMonths} ${isDE ? 'Monate' : 'months'}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* ── Inputs ─────────────────────────────────────────── */}
      <div class="grid gap-6 sm:grid-cols-3">

        {/* Fleet size — number input with +/- buttons per D-04 */}
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {isDE ? 'Flottengröße (Trailer)' : 'Fleet Size (Trailers)'}
          </label>
          <div class="flex items-center gap-2">
            <button
              type="button"
              aria-label={isDE ? 'Verringern' : 'Decrease'}
              onClick={() => setFleetSize((n) => Math.max(1, n - 1))}
              class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              value={fleetSize}
              onInput={(e) => {
                const v = parseInt((e.target as HTMLInputElement).value, 10);
                if (!isNaN(v) && v >= 1) setFleetSize(v);
              }}
              class="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-center text-sm font-semibold dark:border-slate-600 dark:bg-slate-800"
            />
            <button
              type="button"
              aria-label={isDE ? 'Erhöhen' : 'Increase'}
              onClick={() => setFleetSize((n) => n + 1)}
              class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              +
            </button>
          </div>
        </div>

        {/* Vertical dropdown per D-04 */}
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {isDE ? 'Hauptbranche' : 'Primary Vertical'}
          </label>
          <select
            value={vertical}
            onChange={(e) => setVertical((e.target as HTMLSelectElement).value as Vertical)}
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          >
            {VERTICALS.map((v) => (
              <option key={v.value} value={v.value}>
                {isDE ? v.de : v.en}
              </option>
            ))}
          </select>
        </div>

        {/* Parking frequency slider per D-04, range 1–30 stops/week */}
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {isDE ? 'Ø Parkhäufigkeit' : 'Avg Parking Frequency'}
            <span class="ml-1 font-semibold text-konvoi-primary">{frequency}</span>
            <span class="ml-1 text-xs text-slate-500">{isDE ? 'Stopps/Wo' : 'stops/wk'}</span>
          </label>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={frequency}
            onInput={(e) => setFrequency(Number((e.target as HTMLInputElement).value))}
            class="w-full accent-konvoi-primary"
          />
          <div class="mt-1 flex justify-between text-xs text-slate-400">
            <span>1</span>
            <span>30</span>
          </div>
        </div>
      </div>

      {/* ── Output summary card per D-05 ───────────────────── */}
      <div class="mt-8 grid gap-4 rounded-xl bg-slate-50 p-6 sm:grid-cols-2 dark:bg-slate-800">
        <div>
          <p class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {isDE ? 'Jährl. Diebstahlkosten' : 'Annual Theft Cost'}
          </p>
          <p class="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(result.annualTheftCost, locale)}
          </p>
        </div>
        <div>
          <p class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {isDE ? 'KONVOI-Einsparungen' : 'KONVOI Savings'}
          </p>
          <p class="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(result.konvoiSavings, locale)}
          </p>
        </div>
        <div>
          <p class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {isDE ? 'De-minimis-Förderung (80 %)' : 'De-minimis Subsidy (80%)'}
          </p>
          <p class="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(result.deMinimisReimbursement, locale)}
          </p>
        </div>
        <div>
          <p class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {isDE ? 'Amortisationszeit' : 'Payback Period'}
          </p>
          <p class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {paybackLabel}
          </p>
        </div>
      </div>

      {/* ── CTA per D-06: pre-fills ConsultForm via URL params ── */}
      <div class="mt-6 text-center">
        <a
          href={consultHref}
          class="inline-block rounded-lg bg-konvoi-primary px-6 py-3 font-semibold text-white transition hover:bg-konvoi-primary/90"
        >
          {isDE ? 'Beratung mit diesen Zahlen anfragen' : 'Book a consult with these numbers'}
        </a>
        <p class="mt-2 text-xs text-slate-400">
          {isDE
            ? 'Schätzwerte auf Basis von Branchendaten. Bitte mit unserem Team validieren.'
            : 'Estimates based on industry data. Please validate with our team.'}
        </p>
      </div>
    </div>
  );
}
