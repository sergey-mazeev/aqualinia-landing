import { describe, expect, it } from "vitest";
import { formatPhone, normalizePhone } from "./phone";

describe("normalizePhone", () => {
  it.each([
    ["8 (999) 123-45-67", "+79991234567"],
    ["89991234567", "+79991234567"],
    ["7 999 123 45 67", "+79991234567"],
    ["+7 (999) 123-45-67", "+79991234567"],
    ["9991234567", "+79991234567"],
    ["+44 20 7946 0958", "+442079460958"],
    ["0044 20 7946 0958", "+442079460958"],
    ["+86 138 0013 8000", "+8613800138000"],
  ])("%s → %s", (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
  });

  it.each(["", "12345", "+7 999 123", "8 999 123 45 678", "abc 999 123 45 67", "+1234567", "1234567890"])(
    "rejects %j",
    (input) => {
      expect(normalizePhone(input)).toBeNull();
    },
  );
});

describe("formatPhone", () => {
  it("formats Russian numbers", () => {
    expect(formatPhone("+79991234567")).toBe("+7 999 123-45-67");
  });
  it("leaves other numbers as is", () => {
    expect(formatPhone("+442079460958")).toBe("+442079460958");
  });
});
