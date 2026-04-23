// src/data/pricing.ts
// Single source of truth for pricing tiers (PRICE-03) and ROI formula assumptions (ROI-04).
// Tier data re-exported from src/data/brand/canonical.yaml.
// ROI formula assumptions: estimates from .planning/current-site-overview.md cost anchors.
// USER REVIEW REQUIRED: ROI multipliers are estimates — validate with sales before launch.

import brand from '~/data/brand/canonical.yaml';

// ── Pricing tiers ────────────────────────────────────────────────────────────

export interface PricingTier {
  slug: string;
  de_name: string;
  en_name: string;
  de_price_display: string;
  en_price_display: string;
  de_description: string;
  en_description: string;
}

export const pricingTiers: PricingTier[] = brand.pricing.tiers;

// ── ROI formula assumptions ──────────────────────────────────────────────────
// Vertical slugs match canonical.yaml pricing tiers and routeMap.ts industry keys.

export type Vertical = 'high-value' | 'cooling' | 'intermodal' | 'other';

export interface VerticalAssumptions {
  /** Estimated annual theft cost per trailer (EUR) for this vertical */
  annualTheftCostPerTrailer: number;
  /** Fraction of theft cost KONVOI prevents (0–1) */
  savingsFactor: number;
  /** Approximate monthly KONVOI cost per trailer (EUR) — placeholder for payback calc */
  monthlyKonvoiCostPerTrailer: number;
}

export const roiFormulas: Record<Vertical, VerticalAssumptions> = {
  'high-value': {
    // High-value cargo: industry avg €8B/yr across ~4M trailers → ~€2,000/trailer/yr
    // KONVOI prevents ~70% via deterrence chain
    annualTheftCostPerTrailer: 2000,
    savingsFactor: 0.70,
    monthlyKonvoiCostPerTrailer: 49,
  },
  cooling: {
    // Refrigerated cargo: spoilage + theft risk — estimated €1,200/trailer/yr
    // KONVOI prevents ~60% (temperature-sensitive cargo, faster deterrence response)
    annualTheftCostPerTrailer: 1200,
    savingsFactor: 0.60,
    monthlyKonvoiCostPerTrailer: 49,
  },
  intermodal: {
    // Intermodal: multi-modal handoff risk — estimated €800/trailer/yr
    // KONVOI prevents ~55% (GPS anomaly detection at depot handoffs)
    annualTheftCostPerTrailer: 800,
    savingsFactor: 0.55,
    monthlyKonvoiCostPerTrailer: 49,
  },
  other: {
    // General transport: estimated €600/trailer/yr (lower-value cargo, fewer incidents)
    // KONVOI prevents ~50%
    annualTheftCostPerTrailer: 600,
    savingsFactor: 0.50,
    monthlyKonvoiCostPerTrailer: 49,
  },
};

/** De-minimis reimbursement percentage (from canonical.yaml funding object) */
export const DE_MINIMIS_PERCENT: number = brand.funding.de_minimis_max_percent; // 80

/**
 * Compute ROI outputs for a given fleet configuration.
 * Called on every render in RoiCalculator — keep pure (no side effects).
 */
export function computeRoi(
  fleetSize: number,
  vertical: Vertical,
  parkingFrequency: number, // stops per week, 1–30
): {
  annualTheftCost: number;
  konvoiSavings: number;
  deMinimisReimbursement: number;
  paybackPeriodMonths: number;
} {
  const formula = roiFormulas[vertical];

  // Parking frequency amplifies exposure: base cost × (frequency / 15) factor
  // 15 stops/week is the midpoint (scale: 0.07× at 1 stop, 2× at 30 stops)
  const frequencyFactor = parkingFrequency / 15;

  const annualTheftCost = Math.round(
    fleetSize * formula.annualTheftCostPerTrailer * frequencyFactor,
  );
  const konvoiSavings = Math.round(annualTheftCost * formula.savingsFactor);

  // De-minimis covers 80% of the annual KONVOI subscription cost
  const annualKonvoiCost = fleetSize * formula.monthlyKonvoiCostPerTrailer * 12;
  const deMinimisReimbursement = Math.round(
    annualKonvoiCost * (DE_MINIMIS_PERCENT / 100),
  );

  // Payback = months until cumulative savings exceed net KONVOI cost (after subsidy)
  const netAnnualKonvoiCost = annualKonvoiCost - deMinimisReimbursement;
  const monthlySavings = konvoiSavings / 12;
  const paybackPeriodMonths =
    monthlySavings > 0 ? Math.ceil(netAnnualKonvoiCost / monthlySavings) : 0;

  return {
    annualTheftCost,
    konvoiSavings,
    deMinimisReimbursement,
    paybackPeriodMonths,
  };
}
