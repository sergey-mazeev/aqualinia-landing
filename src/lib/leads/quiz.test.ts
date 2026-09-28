import { describe, expect, it } from "vitest";
import { getProduct } from "@/data/products";
import { recommend } from "./quiz";

describe("recommend", () => {
  it("returns two SKUs", () => {
    const skus = recommend({ format: "unsure", problem: "unsure", people: "3-4", budget: "any" });
    expect(skus).toHaveLength(2);
    skus.forEach((sku) => expect(getProduct(sku)).toBeDefined());
  });

  it("respects the chosen format", () => {
    const pitchers = recommend({ format: "pitcher", problem: "hardness", people: "1-2", budget: "any" });
    pitchers.forEach((sku) => expect(getProduct(sku)?.category).toBe("pitcher"));
    const flows = recommend({ format: "flow", problem: "rust", people: "3-4", budget: "any" });
    flows.forEach((sku) => expect(getProduct(sku)?.category).toBe("flow"));
  });

  it("puts a matching product first", () => {
    const [first] = recommend({ format: "flow", problem: "rust", people: "3-4", budget: "mid" });
    expect(getProduct(first)?.problems).toContain("rust");
    expect(getProduct(first)!.price).toBeLessThanOrEqual(8000);
  });

  it("recommends kid-safe filters for kids", () => {
    const skus = recommend({ format: "flow", problem: "kids", people: "3-4", budget: "any" });
    skus.forEach((sku) => expect(getProduct(sku)?.forKids).toBe(true));
  });

  it("stays within a low budget when possible", () => {
    const [first] = recommend({ format: "unsure", problem: "chlorine", people: "1-2", budget: "low" });
    expect(getProduct(first)!.price).toBeLessThanOrEqual(2000);
  });
});
