// src/components/islands/RoiCalculator.tsx
// Preact island: interactive ROI calculator.
// Reads formula assumptions from pricing.ts — no hardcoded values.
// Per UI-SPEC § 5.2, § 6.4, § 7.4 and D-07, D-12.
// Threat model T-05-02-01: user inputs clamped and parsed before formula use.

import { useState } from 'preact/hooks';
import { roiFormulas } from '~/data/pricing';
import { t } from '~/i18n/translations';

type Vertical = 'high_value' | 'cooling' | 'intermodal' | 'other';

interface RoiCalculatorProps {
  locale: 'de' | 'en';
  embedMode?: 'compact' | 'full';
}

interface RoiResult {
  fleetSize: number;
  vertical: Vertical;
  annualTheftCost: number;
  konvoiSavings: number;
  deMinimisReimbursement: number;
  paybackMonths: number;
}

export default function RoiCalculator({ locale, embedMode = 'full' }: RoiCalculatorProps) {
  const [fleetSize, setFleetSize] = useState<number>(10);
  const [vertical, setVertical] = useState<Vertical>('high_value');
  const [frequency, setFrequency] = useState<number>(5);
  const [result, setResult] = useState<RoiResult | null>(null);

  function calculateRoi() {
    // T-05-02-01: clamp inputs before formula use
    const safeFleet = Math.max(1, Math.min(1000, fleetSize));
    const safeFreq = Math.max(1, Math.min(52, frequency));

    const formula = roiFormulas.byVertical[vertical];
    const annualTheftCost = safeFleet * formula.annualTheftCostPerVehicle;
    const konvoiSavings = annualTheftCost * formula.savingsRate;
    const annualKonvoiCost = roiFormulas.monthlyPriceEur * safeFleet * 12;

    // De-minimis: 80% of annual Konvoi cost, capped per vehicle and per company
    const rawSubsidy = annualKonvoiCost * roiFormulas.deMinimisRate;
    const perVehicleCap = safeFleet * roiFormulas.deMinimisMaxPerVehicle;
    const deMinimisReimbursement = Math.min(rawSubsidy, perVehicleCap, roiFormulas.deMinimisMaxPerCompany);

    // Payback: months until savings cover annual Konvoi cost
    const monthlySavings = konvoiSavings / 12;
    const paybackMonths = monthlySavings > 0 ? Math.round(annualKonvoiCost / monthlySavings) : 0;

    // Suppress unused safeFreq warning — frequency is an input but not in formula (per plan spec)
    void safeFreq;

    setResult({
      fleetSize: safeFleet,
      vertical,
      annualTheftCost: Math.round(annualTheftCost),
      konvoiSavings: Math.round(konvoiSavings),
      deMinimisReimbursement: Math.round(deMinimisReimbursement),
      paybackMonths,
    });
  }

  function handleBookConsult() {
    if (!result) return;
    const params = new URLSearchParams({
      fleet_size: String(result.fleetSize),
      vertical: result.vertical,
      estimated_savings: String(Math.round(result.konvoiSavings)),
    });
    window.location.href = `${locale === 'de' ? '/preise' : '/en/pricing'}?${params.toString()}`;
  }

  function clearResult() {
    setResult(null);
  }

  return (
    <div class="w-full">
      {/* Inputs */}
      <div class="space-y-4">
        {/* Fleet size */}
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t('roi.input_fleet_label', locale)}
          </label>
          <div class="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={1000}
              value={fleetSize}
              placeholder={t('roi.input_fleet_placeholder', locale)}
              class="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-slate-800 dark:text-slate-100"
              onChange={(e: Event) => {
                const val = parseInt((e.target as HTMLInputElement).value, 10);
                setFleetSize(isNaN(val) ? 1 : Math.max(1, Math.min(1000, val)));
                clearResult();
              }}
            />
            <span class="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {t('roi.input_fleet_unit', locale)}
            </span>
          </div>
        </div>

        {/* Vertical */}
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t('roi.input_vertical_label', locale)}
          </label>
          <select
            value={vertical}
            class="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-slate-800 dark:text-slate-100"
            onChange={(e: Event) => {
              setVertical((e.target as HTMLSelectElement).value as Vertical);
              clearResult();
            }}
          >
            <option value="" disabled>
              {t('roi.input_vertical_placeholder', locale)}
            </option>
            <option value="high_value">{t('roi.vertical_high_value', locale)}</option>
            <option value="cooling">{t('roi.vertical_cooling', locale)}</option>
            <option value="intermodal">{t('roi.vertical_intermodal', locale)}</option>
            <option value="other">{t('roi.vertical_other', locale)}</option>
          </select>
        </div>

        {/* Parking frequency */}
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t('roi.input_frequency_label', locale)}
          </label>
          <div class="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={52}
              value={frequency}
              class="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-slate-800 dark:text-slate-100"
              onChange={(e: Event) => {
                const val = parseInt((e.target as HTMLInputElement).value, 10);
                setFrequency(isNaN(val) ? 1 : Math.max(1, Math.min(52, val)));
                clearResult();
              }}
            />
            <span class="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {t('roi.input_frequency_unit', locale)}
            </span>
          </div>
        </div>
      </div>

      {/* Calculate button */}
      <button
        type="button"
        class="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        onClick={calculateRoi}
      >
        {t('roi.cta_calculate', locale)}
      </button>

      {/* Results */}
      {result !== null && (
        <div class="mt-6 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-6">
          {/* Annual theft cost */}
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-600 dark:text-slate-400">
              {t('roi.output_theft_cost', locale)}
            </span>
            <span class="text-lg font-bold dark:text-slate-100">
              €{result.annualTheftCost.toLocaleString('de-DE')}
            </span>
          </div>

          {/* Konvoi savings — PRIMARY metric (D-07) */}
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-600 dark:text-slate-400">
              {t('roi.output_savings', locale)}
            </span>
            <span class="text-xl font-bold text-green-600 dark:text-green-400">
              €{result.konvoiSavings.toLocaleString('de-DE')}
            </span>
          </div>

          {/* De-minimis subsidy — SECONDARY metric beneath savings (D-07) */}
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-600 dark:text-slate-400">
              {t('roi.output_deminimis', locale)}
            </span>
            <span class="text-lg font-semibold text-blue-600 dark:text-blue-400">
              €{result.deMinimisReimbursement.toLocaleString('de-DE')}
            </span>
          </div>

          {/* Payback period */}
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-600 dark:text-slate-400">
              {t('roi.output_payback', locale)}
            </span>
            <span class="text-lg font-bold dark:text-slate-100">
              {result.paybackMonths} {t('roi.output_payback_unit', locale)}
            </span>
          </div>

          {/* Disclaimer */}
          <p class="text-xs text-slate-400 pt-2">
            {t('roi.disclaimer', locale)}
          </p>

          {/* Book consult CTA */}
          <button
            type="button"
            class="mt-4 w-full rounded-lg bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
            onClick={handleBookConsult}
          >
            {t('roi.cta_book', locale)}
          </button>
        </div>
      )}
    </div>
  );
}
