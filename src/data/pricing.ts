// src/data/pricing.ts
// Single source of truth for tier data and ROI formula assumptions.
// Per PRICE-03: shared between pricing pages and RoiCalculator island.
// SALES TEAM: update priceDisplay values and roiFormulas.monthlyPriceEur before launch.

export interface PricingTier {
  slug: 'standard' | 'camera-module' | 'logbook';
  de: {
    name: string;
    priceDisplay: string; // e.g. "auf Anfrage" — placeholder, user updates before launch
    pricePeriod: string;  // "pro Trailer / Monat"
    features: { text: string; included: boolean }[];
    badge?: string;       // "Empfohlen" — only on camera-module
  };
  en: {
    name: string;
    priceDisplay: string;
    pricePeriod: string;  // "per trailer / month"
    features: { text: string; included: boolean }[];
    badge?: string;       // "Recommended" — only on camera-module
  };
  highlighted: boolean;  // true only for camera-module (D-02)
}

export const pricingTiers: PricingTier[] = [
  {
    slug: 'standard',
    highlighted: false,
    de: {
      name: 'KONVOI Standard',
      priceDisplay: 'auf Anfrage',
      pricePeriod: 'pro Trailer / Monat',
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
      priceDisplay: 'on request',
      pricePeriod: 'per trailer / month',
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
    slug: 'camera-module',
    highlighted: true,
    de: {
      name: '+ KONVOI Camera Module',
      priceDisplay: 'auf Anfrage',
      pricePeriod: 'pro Trailer / Monat',
      badge: 'Empfohlen',
      features: [
        { text: 'GPS + LTE Tracking', included: true },
        { text: 'Schock- und Bewegungssensoren', included: true },
        { text: 'KI-Klassifizierung', included: true },
        { text: 'Alarmkette (Push, SMS, Anruf)', included: true },
        { text: '7-Tage-Akku', included: true },
        { text: 'Cloud-Clips bei Ereignissen', included: true },
        { text: 'PDF-Logbuch je Fahrt', included: false },
      ],
    },
    en: {
      name: '+ KONVOI Camera Module',
      priceDisplay: 'on request',
      pricePeriod: 'per trailer / month',
      badge: 'Recommended',
      features: [
        { text: 'GPS + LTE tracking', included: true },
        { text: 'Shock and motion sensors', included: true },
        { text: 'AI classification', included: true },
        { text: 'Alarm chain (push, SMS, call)', included: true },
        { text: '7-day battery', included: true },
        { text: 'Cloud clips on security events', included: true },
        { text: 'PDF logbook per trip', included: false },
      ],
    },
  },
  {
    slug: 'logbook',
    highlighted: false,
    de: {
      name: '+ KONVOI Logbook',
      priceDisplay: 'auf Anfrage',
      pricePeriod: 'pro Trailer / Monat',
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
      name: '+ KONVOI Logbook',
      priceDisplay: 'on request',
      pricePeriod: 'per trailer / month',
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
];

export interface RoiVerticalFormula {
  /** Annual theft cost per vehicle in EUR — TAPA €8B/yr extrapolated by vertical share */
  annualTheftCostPerVehicle: number;
  /** Estimated % reduction in theft losses achievable with Konvoi */
  savingsRate: number;
}

export interface RoiFormulas {
  /** Monthly price per vehicle in EUR — placeholder, update before launch */
  monthlyPriceEur: number;
  /** De-minimis subsidy rate (0.8 = 80%) */
  deMinimisRate: number;
  /** Max subsidy per vehicle in EUR (BALM 2026: €2,000) */
  deMinimisMaxPerVehicle: number;
  /** Max subsidy per company per year in EUR (BALM 2026: €33,000) */
  deMinimisMaxPerCompany: number;
  /** Formula assumptions per vertical */
  byVertical: Record<'high_value' | 'cooling' | 'intermodal' | 'other', RoiVerticalFormula>;
}

/**
 * ROI formula assumptions — industry averages from TAPA (€8B/yr cargo theft globally).
 * SALES TEAM: update monthlyPriceEur and byVertical values before launch.
 * These figures are conservative placeholders for the calculator.
 */
export const roiFormulas: RoiFormulas = {
  monthlyPriceEur: 150,        // placeholder — update before launch
  deMinimisRate: 0.8,          // 80% (BALM 2026 — Förderprogramm Umweltschutz und Sicherheit)
  deMinimisMaxPerVehicle: 2000, // €2,000 per vehicle (BALM 2026)
  deMinimisMaxPerCompany: 33000, // €33,000 per company per year (BALM 2026)
  byVertical: {
    high_value:  { annualTheftCostPerVehicle: 12000, savingsRate: 0.35 },
    cooling:     { annualTheftCostPerVehicle: 8000,  savingsRate: 0.30 },
    intermodal:  { annualTheftCostPerVehicle: 6000,  savingsRate: 0.25 },
    other:       { annualTheftCostPerVehicle: 4000,  savingsRate: 0.20 },
  },
};
