// src/data/pricing.ts
// Single source of truth for tier data, discount tables, and ROI formula assumptions.
// Shared between pricing pages, PricingCalculator island, and RoiCalculator island.

export interface PricingTier {
  slug: 'damage' | 'security' | 'security-camera' | 'enterprise';
  de: {
    name: string;
    priceDisplay: string;
    pricePeriod: string;
    features: { text: string; included: boolean }[];
    badge?: string;
  };
  en: {
    name: string;
    priceDisplay: string;
    pricePeriod: string;
    features: { text: string; included: boolean }[];
    badge?: string;
  };
  highlighted: boolean;
  /** Base monthly price in EUR per system (netto). null = "auf Anfrage" */
  baseMonthlyPrice: number | null;
  /** Which volume discount schedule applies. null = no calculator pricing */
  discountSchedule: 'standard' | 'camera' | null;
}

export const pricingTiers: PricingTier[] = [
  {
    slug: 'damage',
    highlighted: false,
    baseMonthlyPrice: 75,
    discountSchedule: 'standard',
    de: {
      name: 'KONVOI Damage',
      priceDisplay: '75 €',
      pricePeriod: 'pro Fahrzeug / Monat',
      features: [
        { text: 'Schadenerkennung + Video-Clips', included: true },
        { text: 'Rampen- & Kupplungsalarme', included: true },
        { text: 'Be-/Entladeerkennung', included: true },
        { text: 'Intelligente Modalitätsanalyse', included: true },
        { text: 'KONVOI Dashboard (Live-Tracking)', included: true },
        { text: 'Licht- / Akustikalarm', included: true },
        { text: 'Ladungs- & Dieseldiebstahlschutz', included: false },
        { text: 'Schutz vor illegalen Mitfahrern', included: false },
        { text: 'Diebstahl-spezifische Video-Clips', included: false },
        { text: 'Unbegrenzte KONVOI Logbooks', included: false },
      ],
    },
    en: {
      name: 'KONVOI Damage',
      priceDisplay: '€75',
      pricePeriod: 'per vehicle / month',
      features: [
        { text: 'Damage detection + video clips', included: true },
        { text: 'Ramping & coupling alerts', included: true },
        { text: 'Un-/loading recognition', included: true },
        { text: 'Intelligent modality analysis', included: true },
        { text: 'KONVOI Dashboard (live tracking)', included: true },
        { text: 'Light / acoustic alarm', included: true },
        { text: 'Cargo & diesel theft prevention', included: false },
        { text: 'Illegal onboarder prevention', included: false },
        { text: 'Theft-specific video clips', included: false },
        { text: 'Unlimited KONVOI Logbooks', included: false },
      ],
    },
  },
  {
    slug: 'security',
    highlighted: false,
    baseMonthlyPrice: 100,
    discountSchedule: 'standard',
    de: {
      name: 'KONVOI Security',
      priceDisplay: '100 €',
      pricePeriod: 'pro Fahrzeug / Monat',
      features: [
        { text: 'Automatische Schadenerkennung', included: true },
        { text: 'Rampen- & Kupplungsalarme', included: true },
        { text: 'Be-/Entladeerkennung', included: true },
        { text: 'Intelligente Modalitätsanalyse', included: true },
        { text: 'Ladungs- & Dieseldiebstahlschutz', included: true },
        { text: 'Schutz vor illegalen Mitfahrern', included: true },
        { text: 'KONVOI Dashboard (Live-Tracking)', included: true },
        { text: 'Licht- / Akustikalarm', included: true },
        { text: 'Diebstahl-spezifische Video-Clips', included: false },
        { text: 'Unbegrenzte KONVOI Logbooks', included: false },
      ],
    },
    en: {
      name: 'KONVOI Security',
      priceDisplay: '€100',
      pricePeriod: 'per vehicle / month',
      features: [
        { text: 'Automated damage detection', included: true },
        { text: 'Ramping & coupling alerts', included: true },
        { text: 'Un-/loading recognition', included: true },
        { text: 'Intelligent modality analysis', included: true },
        { text: 'Cargo & diesel theft prevention', included: true },
        { text: 'Illegal onboarder prevention', included: true },
        { text: 'KONVOI Dashboard (live tracking)', included: true },
        { text: 'Light / acoustic alarm', included: true },
        { text: 'Theft-specific video clips', included: false },
        { text: 'Unlimited KONVOI Logbooks', included: false },
      ],
    },
  },
  {
    slug: 'security-camera',
    highlighted: true,
    baseMonthlyPrice: 150,
    discountSchedule: 'camera',
    de: {
      name: 'KONVOI Security + Camera',
      priceDisplay: '150 €',
      pricePeriod: 'pro Fahrzeug / Monat',
      badge: 'Empfohlen',
      features: [
        { text: 'Schadenerkennung + Video-Clips', included: true },
        { text: 'Rampen- & Kupplungsalarme', included: true },
        { text: 'Be-/Entladeerkennung', included: true },
        { text: 'Intelligente Modalitätsanalyse', included: true },
        { text: 'Ladungs- & Dieseldiebstahlschutz', included: true },
        { text: 'Schutz vor illegalen Mitfahrern', included: true },
        { text: 'Diebstahl-spezifische Video-Clips', included: true },
        { text: 'Unbegrenzte KONVOI Logbooks', included: true },
        { text: 'KONVOI Dashboard (Live-Tracking)', included: true },
        { text: 'Licht- / Akustikalarm', included: true },
      ],
    },
    en: {
      name: 'KONVOI Security + Camera',
      priceDisplay: '€150',
      pricePeriod: 'per vehicle / month',
      badge: 'Recommended',
      features: [
        { text: 'Damage detection + video clips', included: true },
        { text: 'Ramping & coupling alerts', included: true },
        { text: 'Un-/loading recognition', included: true },
        { text: 'Intelligent modality analysis', included: true },
        { text: 'Cargo & diesel theft prevention', included: true },
        { text: 'Illegal onboarder prevention', included: true },
        { text: 'Theft-specific video clips', included: true },
        { text: 'Unlimited KONVOI Logbooks', included: true },
        { text: 'KONVOI Dashboard (live tracking)', included: true },
        { text: 'Light / acoustic alarm', included: true },
      ],
    },
  },
  {
    slug: 'enterprise',
    highlighted: false,
    baseMonthlyPrice: null,
    discountSchedule: null,
    de: {
      name: 'KONVOI Enterprise',
      priceDisplay: 'auf Anfrage',
      pricePeriod: 'individuell',
      features: [
        { text: 'Alles aus Security + Camera', included: true },
        { text: '24/7 SLA', included: true },
        { text: 'Integration zu Monitoring Center', included: true },
        { text: 'Dedizierter Ansprechpartner', included: true },
      ],
    },
    en: {
      name: 'KONVOI Enterprise',
      priceDisplay: 'on request',
      pricePeriod: 'custom',
      features: [
        { text: 'Everything in Security + Camera', included: true },
        { text: '24/7 SLA', included: true },
        { text: 'Monitoring center integration', included: true },
        { text: 'Dedicated account manager', included: true },
      ],
    },
  },
];

// --- Discount tables ---

export interface VolumeBreakpoint {
  minUnits: number;
  discount: number;
}

export const volumeDiscountSchedules: Record<'standard' | 'camera', VolumeBreakpoint[]> = {
  standard: [
    { minUnits: 0,   discount: 0 },
    { minUnits: 50,  discount: 0.10 },
    { minUnits: 100, discount: 0.12 },
    { minUnits: 150, discount: 0.14 },
    { minUnits: 200, discount: 0.16 },
    { minUnits: 250, discount: 0.18 },
    { minUnits: 300, discount: 0.20 },
  ],
  camera: [
    { minUnits: 0,   discount: 0 },
    { minUnits: 50,  discount: 0.10 },
    { minUnits: 100, discount: 0.13 },
    { minUnits: 150, discount: 0.16 },
    { minUnits: 200, discount: 0.19 },
    { minUnits: 250, discount: 0.22 },
    { minUnits: 300, discount: 0.25 },
  ],
};

export interface ContractBonus {
  months: number;
  bonus: number;
}

export const contractBonuses: ContractBonus[] = [
  { months: 12, bonus: 0 },
  { months: 24, bonus: 0.10 },
  { months: 36, bonus: 0.15 },
  { months: 48, bonus: 0.20 },
  { months: 60, bonus: 0.25 },
];

// --- Calculation functions ---

export function getVolumeDiscount(fleetSize: number, schedule: 'standard' | 'camera'): number {
  const breakpoints = volumeDiscountSchedules[schedule];
  let discount = 0;
  for (const bp of breakpoints) {
    if (fleetSize >= bp.minUnits) discount = bp.discount;
    else break;
  }
  return discount;
}

export function getContractBonus(months: number): number {
  for (const cb of contractBonuses) {
    if (cb.months === months) return cb.bonus;
  }
  return 0;
}

export interface PriceCalculation {
  basePrice: number;
  volumeDiscount: number;
  contractBonus: number;
  totalDiscount: number;
  finalMonthly: number;
  finalYearly: number;
  totalFleetMonthly: number;
  totalFleetYearly: number;
}

export function calculatePrice(
  basePrice: number,
  fleetSize: number,
  contractMonths: number,
  schedule: 'standard' | 'camera',
): PriceCalculation {
  const volumeDiscount = getVolumeDiscount(fleetSize, schedule);
  const contractBonus = getContractBonus(contractMonths);
  const totalDiscount = Math.min(volumeDiscount + contractBonus, 1);
  const finalMonthly = basePrice * (1 - totalDiscount);
  return {
    basePrice,
    volumeDiscount,
    contractBonus,
    totalDiscount,
    finalMonthly: Math.round(finalMonthly * 100) / 100,
    finalYearly: Math.round(finalMonthly * 12 * 100) / 100,
    totalFleetMonthly: Math.round(finalMonthly * fleetSize * 100) / 100,
    totalFleetYearly: Math.round(finalMonthly * 12 * fleetSize * 100) / 100,
  };
}

// --- ROI formulas (unchanged) ---

export interface RoiVerticalFormula {
  annualTheftCostPerVehicle: number;
  savingsRate: number;
}

export interface RoiFormulas {
  monthlyPriceEur: number;
  deMinimisRate: number;
  deMinimisMaxPerVehicle: number;
  deMinimisMaxPerCompany: number;
  byVertical: Record<'high_value' | 'cooling' | 'intermodal' | 'other', RoiVerticalFormula>;
}

export const roiFormulas: RoiFormulas = {
  monthlyPriceEur: 150,
  deMinimisRate: 0.8,
  deMinimisMaxPerVehicle: 2000,
  deMinimisMaxPerCompany: 33000,
  byVertical: {
    high_value:  { annualTheftCostPerVehicle: 12000, savingsRate: 0.35 },
    cooling:     { annualTheftCostPerVehicle: 8000,  savingsRate: 0.30 },
    intermodal:  { annualTheftCostPerVehicle: 6000,  savingsRate: 0.25 },
    other:       { annualTheftCostPerVehicle: 4000,  savingsRate: 0.20 },
  },
};
