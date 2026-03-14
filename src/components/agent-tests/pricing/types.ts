/**
 * Shared types and constants for the Pricing Agent test UI.
 * Use the same storage key and shape when integrating with the main app.
 */

export const PRICING_ESTIMATE_STORAGE_KEY = "pawdispatch-estimate";

export interface PricingEstimateResult {
  estimateId: string;
  basePrice: number;
  adjustments: Array<{ reason: string; amount: number }>;
  totalPrice: number;
  sizeCategory: string;
  explanation: string;
  imageUrl: string;
}

export function getStoredEstimate(estimateId: string): PricingEstimateResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`${PRICING_ESTIMATE_STORAGE_KEY}-${estimateId}`);
    return raw ? (JSON.parse(raw) as PricingEstimateResult) : null;
  } catch {
    return null;
  }
}

export function setStoredEstimate(result: PricingEstimateResult): void {
  try {
    sessionStorage.setItem(
      `${PRICING_ESTIMATE_STORAGE_KEY}-${result.estimateId}`,
      JSON.stringify(result)
    );
  } catch {
    // ignore
  }
}
