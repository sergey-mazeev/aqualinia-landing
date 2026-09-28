import { describe, expect, it } from "vitest";
import { calculateSavings } from "./savings";

describe("calculateSavings", () => {
  const product = { price: 4990, resourceL: 7000, cartridgePrice: 1690 };

  it("computes yearly costs for a family of three", () => {
    const r = calculateSavings({ people: 3, bottledPricePerLiter: 25, product });
    expect(r.litersPerYear).toBe(2190);
    expect(r.bottledPerYear).toBe(54750);
    expect(r.cartridgesPerYear).toBe(1);
    expect(r.filterFirstYear).toBe(4990);
    expect(r.filterNextYears).toBe(1690);
    expect(r.savingsFirstYear).toBe(49760);
  });

  it("adds replacement cartridges when the resource runs out", () => {
    const pitcher = { price: 690, resourceL: 200, cartridgePrice: 290 };
    const r = calculateSavings({ people: 2, bottledPricePerLiter: 25, product: pitcher });
    expect(r.cartridgesPerYear).toBe(8); // 1460 L / 200 L
    expect(r.filterFirstYear).toBe(690 + 7 * 290);
  });
});
