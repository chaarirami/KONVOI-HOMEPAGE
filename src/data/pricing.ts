// src/data/pricing.ts
// Single source of truth for tier data, discount tables, and ROI formula assumptions.
// Shared between pricing pages, PricingCalculator island, and RoiCalculator island.

export interface PricingTier {
  slug: 'damage' | 'standard' | 'camera' | 'enterprise';
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
      pricePeriod: 'pro System / Monat',
      features: [
        { text: 'GPS-Tracking', included: true },
        { text: 'Schadenerkennung & Dokumentation', included: true },
        { text: 'Schock- und Bewegungssensoren', included: false },
        { text: 'KI-Klassifizierung', included: false },
        { text: 'Alarmkette (Push, SMS, Anruf)', included: false },
        { text: 'Cloud-Clips bei Ereignissen', included: false },
        { text: 'PDF-Logbuch je Fahrt', included: false },
      ],
    },
    en: {
      name: 'KONVOI Damage',
      priceDisplay: '€75',
      pricePeriod: 'per system / month',
      features: [
        { text: 'GPS tracking', included: true },
        { text: 'Damage detection & documentation', included: true },
        { text: 'Shock and motion sensors', included: false },
        { text: 'AI classification', included: false },
        { text: 'Alarm chain (push, SMS, call)', included: false },
        { text: 'Cloud clips on security events', included: false },
        { text: 'PDF logbook per trip', included: false },
      ],
    },
  },
  {
    slug: 'standard',
    highlighted: false,
    baseMonthlyPrice: 100,
    discountSchedule: 'standard',
    de: {
      name: 'KONVOI Standard',
      priceDisplay: '100 €',
      pricePeriod: 'pro System / Monat',
      features: [
        { text: 'GPS + LTE Tracking', included: true },
        { text: 'Schock- und Bewegungssensoren', included: true },
        { text: 'KI-Klassifizierung', included: true },
        { text: 'Alarmkette (Push, SMS, Anruf)', included: true },
        { text: '7-Tage-Akku', included: true },
        { text: 'Cloud-Clips bei Ereignissen', included: false },
        { text: 'PDF-Logbuch je Fahrt', included: false },
      ],
    },
    en: {
      name: 'KONVOI Standard',
      priceDisplay: '€100',
      pricePeriod: 'per system / month',
      features: [
        { text: 'GPS + LTE tracking', included: true },
        { text: 'Shock and motion sensors', included: true },
        { text: 'AI classification', included: true },
        { text: 'Alarm chain (push, SMS, call)', included: true },
        { text: '7-day battery', included: true },
        { text: 'Cloud clips on security events', included: false },
        { text: 'PDF logbook per trip', included: false },
      ],
    },
  },
  {
    slug: 'camera',
    highlighted: true,
    baseMonthlyPrice: 150,
    discountSchedule: 'camera',
    de: {
      name: 'KONVOI Camera + Logbook',
      priceDisplay: '150 €',
      pricePeriod: 'pro System / Monat',
      badge: 'Empfohlen',
      features: [
        { text: 'GPS + LTE Tracking', included: true },
        { text: 'Schock- und Bewegungssensoren', included: true },
        { text: 'KI-Klassifizierung', included: true },
        { text: 'Alarmkette (Push, SMS, Anruf)', included: true },
        { text: '7-Tage-Akku', included: true },
        { text: 'Cloud-Clips bei Ereignissen', included: true },
        { text: 'PDF-Logbuch je Fahrt', included: true },
      ],
    },
    en: {
      name: 'KONVOI Camera + Logbook',
      priceDisplay: '€150',
      pricePeriod: 'per system / month',
      badge: 'Recommended',
      features: [
        { text: 'GPS + LTE tracking', included: true },
        { text: 'Shock and motion sensors', included: true },
        { text: 'AI classification', included: true },
        { text: 'Alarm chain (push, SMS, call)', included: true },
        { text: '7-day battery', included: true },
        { text: 'Cloud clips on security events', included: true },
        { text: 'PDF logbook per trip', included: true },
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
        { text: 'GPS + LTE Tracking', included: true },
        { text: 'Schock- und Bewegungssensoren', included: true },
        { text: 'KI-Klassifizierung', included: true },
        { text: 'Alarmkette (Push, SMS, Anruf)', included: true },
        { text: 'Cloud-Clips bei Ereignissen', included: true },
        { text: 'PDF-Logbuch je Fahrt', included: true },
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
        { text: 'GPS + LTE tracking', included: true },
        { text: 'Shock and motion sensors', included: true },
        { text: 'AI classification', included: true },
        { text: 'Alarm chain (push, SMS, call)', included: true },
        { text: 'Cloud clips on security events', included: true },
        { text: 'PDF logbook per trip', included: true },
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
