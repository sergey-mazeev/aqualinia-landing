import { describe, expect, it } from "vitest";
import { issuesToFieldErrors, leadPayloadSchema } from "./schema";

const base = {
  name: "Анна",
  phone: "8 (999) 123-45-67",
  contactMethod: "call",
  consent: true,
  source: "final",
  locale: "ru",
  startedAt: Date.now() - 5000,
  clientSubmissionId: "3f1c2b7e-8a1d-4a5e-9f0b-6c2d1e4a7b90",
};

describe("leadPayloadSchema", () => {
  it("accepts a valid final-form lead", () => {
    expect(leadPayloadSchema.safeParse(base).success).toBe(true);
  });

  it("requires consent", () => {
    const result = leadPayloadSchema.safeParse({ ...base, consent: false });
    expect(result.success).toBe(false);
    if (!result.success) expect(issuesToFieldErrors(result.error).consent).toBe("consent_required");
  });

  it("rejects an invalid phone with a code", () => {
    const result = leadPayloadSchema.safeParse({ ...base, phone: "12345" });
    expect(result.success).toBe(false);
    if (!result.success) expect(issuesToFieldErrors(result.error).phone).toBe("phone_invalid");
  });

  it("rejects a too short name", () => {
    const result = leadPayloadSchema.safeParse({ ...base, name: " А " });
    expect(result.success).toBe(false);
    if (!result.success) expect(issuesToFieldErrors(result.error).name).toBe("name_short");
  });

  it("requires a product for product orders", () => {
    const result = leadPayloadSchema.safeParse({ ...base, source: "product" });
    expect(result.success).toBe(false);
    if (!result.success) expect(issuesToFieldErrors(result.error).productSku).toBe("product_required");
  });

  it("requires quiz answers for quiz leads", () => {
    const bad = leadPayloadSchema.safeParse({ ...base, source: "quiz" });
    expect(bad.success).toBe(false);
    const good = leadPayloadSchema.safeParse({
      ...base,
      source: "quiz",
      quizAnswers: { format: "flow", problem: "hardness", people: "3-4", budget: "mid" },
    });
    expect(good.success).toBe(true);
  });

  it("rejects unknown sources and locales", () => {
    expect(leadPayloadSchema.safeParse({ ...base, source: "spam" }).success).toBe(false);
    expect(leadPayloadSchema.safeParse({ ...base, locale: "de" }).success).toBe(false);
  });
});
