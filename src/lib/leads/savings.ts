import type { Product } from "@/data/products";

/** Litres of drinking and cooking water per person per day. */
export const LITERS_PER_PERSON_PER_DAY = 2;

export type SavingsInput = {
  people: number;
  bottledPricePerLiter: number;
  product: Pick<Product, "price" | "resourceL" | "cartridgePrice">;
};

export type SavingsResult = {
  litersPerYear: number;
  bottledPerYear: number;
  cartridgesPerYear: number;
  /** Filter price + cartridges for the first year. */
  filterFirstYear: number;
  /** Cartridges only, for every following year. */
  filterNextYears: number;
  savingsFirstYear: number;
  savingsNextYears: number;
};

export function calculateSavings({ people, bottledPricePerLiter, product }: SavingsInput): SavingsResult {
  const litersPerYear = Math.max(1, people) * LITERS_PER_PERSON_PER_DAY * 365;
  const bottledPerYear = Math.round(litersPerYear * bottledPricePerLiter);
  // The filter ships with a cartridge; replacements are needed once it is used up (at least yearly).
  const cartridgesUsed = Math.max(1, Math.ceil(litersPerYear / product.resourceL));
  const firstYearReplacements = cartridgesUsed - 1;
  const filterFirstYear = product.price + firstYearReplacements * product.cartridgePrice;
  const filterNextYears = cartridgesUsed * product.cartridgePrice;

  return {
    litersPerYear,
    bottledPerYear,
    cartridgesPerYear: cartridgesUsed,
    filterFirstYear,
    filterNextYears,
    savingsFirstYear: bottledPerYear - filterFirstYear,
    savingsNextYears: bottledPerYear - filterNextYears,
  };
}
