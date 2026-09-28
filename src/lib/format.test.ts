import { describe, expect, it } from "vitest";
import { formatRub } from "./format";

describe("formatRub", () => {
  it("formats rubles per locale", () => {
    expect(formatRub(12990, "ru")).toBe("12 990 ₽");
    expect(formatRub(690, "ru")).toBe("690 ₽");
    expect(formatRub(1234567, "en")).toBe("₽1,234,567");
    expect(formatRub(-1500, "ru")).toBe("-1 500 ₽");
  });
});
