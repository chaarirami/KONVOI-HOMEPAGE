import { useState } from 'preact/hooks';
import { pricingTiers, contractBonuses, calculatePrice } from '~/data/pricing';
import { t } from '~/i18n/translations';

interface PricingCalculatorProps {
  locale: 'de' | 'en';
}

function formatCurrency(amount: number, locale: 'de' | 'en'): string {
  return new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

const CONTRACT_OPTIONS = contractBonuses.map((cb) => cb.months);

export default function PricingCalculator({ locale }: PricingCalculatorProps) {
  const [fleetSize, setFleetSize] = useState(10);
  const [contractMonths, setContractMonths] = useState(12);

  return (
    <div class="w-full">
      {/* Input controls */}
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
        {/* Fleet size */}
        <div class="flex-1">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t('pricing.fleet_size_label', locale)}
          </label>
          <div class="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={500}
              value={fleetSize}
              class="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-slate-800 dark:text-slate-100"
              onInput={(e: Event) => {
                const val = parseInt((e.target as HTMLInputElement).value, 10);
                if (!isNaN(val)) setFleetSize(Math.max(1, Math.min(500, val)));
              }}
            />
            <span class="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {t('pricing.fleet_size_unit', locale)}
            </span>
          </div>
        </div>

        {/* Contract length */}
        <div class="flex-1">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t('pricing.contract_label', locale)}
          </label>
          <div class="flex rounded-lg border border-slate-300 dark:border-slate-600 p-1">
            {CONTRACT_OPTIONS.map((m) => (
              <button
                type="button"
                key={m}
                class={`flex-1 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                  contractMonths === m
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                onClick={() => setContractMonths(m)}
              >
                {m} {t('pricing.months_abbrev', locale)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing cards grid */}
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pricingTiers.map((tier) => {
          const loc = tier[locale];
          const pricing =
            tier.baseMonthlyPrice !== null && tier.discountSchedule !== null
              ? calculatePrice(tier.baseMonthlyPrice, fleetSize, contractMonths, tier.discountSchedule)
              : null;

          return (
            <div
              key={tier.slug}
              class={[
                'flex flex-col rounded-2xl border p-6',
                tier.highlighted
                  ? 'border-primary border-2 relative shadow-lg'
                  : 'border-slate-200 dark:border-slate-700',
              ].join(' ')}
            >
              {loc.badge && (
                <span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-white">
                  {loc.badge}
                </span>
              )}

              <h3 class="text-lg font-bold font-heading mb-3">{loc.name}</h3>

              {/* Price block */}
              {pricing ? (
                <div class="mb-4">
                  {pricing.totalDiscount > 0 ? (
                    <>
                      <p class="text-sm text-slate-400 line-through">
                        {formatCurrency(pricing.basePrice, locale)}
                      </p>
                      <span class="inline-block rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2.5 py-0.5 text-xs font-semibold mb-1">
                        -{Math.round(pricing.totalDiscount * 100)}%
                      </span>
                    </>
                  ) : null}
                  <p class="text-3xl font-bold font-heading">
                    {formatCurrency(pricing.finalMonthly, locale)}
                  </p>
                  <p class="text-sm text-slate-500 dark:text-slate-400">
                    {t('pricing.per_system_month', locale)}
                  </p>
                  <p class="text-xs text-slate-400 mt-1">
                    {formatCurrency(pricing.finalYearly, locale)} {t('pricing.per_system_year', locale)}
                  </p>
                  <p class="text-xs text-slate-400">
                    {t('pricing.fleet_total', locale)}: {formatCurrency(pricing.totalFleetMonthly, locale)}/{locale === 'de' ? 'Mon.' : 'mo.'}
                  </p>
                </div>
              ) : (
                <div class="mb-4">
                  <p class="text-3xl font-bold font-heading">{loc.priceDisplay}</p>
                  <p class="text-sm text-slate-500 dark:text-slate-400">{loc.pricePeriod}</p>
                </div>
              )}

              {/* Features */}
              <ul class="flex-1 space-y-2.5 mb-6">
                {loc.features.map((f, i) => (
                  <li key={i} class="flex items-start gap-2 text-sm">
                    <span
                      class={f.included ? 'text-green-600 font-bold' : 'text-slate-400'}
                      aria-hidden="true"
                    >
                      {f.included ? '✓' : '—'}
                    </span>
                    <span class={f.included ? '' : 'text-slate-400'}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#consult-form"
                class="block w-full rounded-lg bg-primary px-6 py-3 text-center text-white font-semibold hover:bg-primary/90 transition-colors"
              >
                {t('cta.book_consult', locale)}
              </a>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p class="mt-6 text-center text-xs text-slate-400">
        {t('pricing.net_disclaimer', locale)}
      </p>
    </div>
  );
}
