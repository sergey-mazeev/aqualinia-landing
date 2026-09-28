import { beforeAll, describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "./session";

describe("session tokens", () => {
  beforeAll(() => {
    process.env.SESSION_SECRET = "x".repeat(40);
  });

  it("round-trips", async () => {
    const token = await createSessionToken();
    expect(await verifySessionToken(token)).toBe(true);
  });

  it("rejects tampered or missing tokens", async () => {
    const token = await createSessionToken();
    expect(await verifySessionToken(token.slice(0, -2) + "xx")).toBe(false);
    expect(await verifySessionToken(undefined)).toBe(false);
    expect(await verifySessionToken("garbage")).toBe(false);
  });

  it("rejects tokens signed with another secret", async () => {
    const token = await createSessionToken();
    process.env.SESSION_SECRET = "y".repeat(40);
    expect(await verifySessionToken(token)).toBe(false);
  });
});
