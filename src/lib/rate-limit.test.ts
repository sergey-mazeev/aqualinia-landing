import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("rate limiter", () => {
  it("allows up to the limit within the window", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000 });
    expect(limiter.hit("a", 0).ok).toBe(true);
    expect(limiter.hit("a", 10).ok).toBe(true);
    expect(limiter.hit("a", 20).ok).toBe(true);
    const blocked = limiter.hit("a", 30);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterMs).toBe(970);
    expect(limiter.hit("b", 30).ok).toBe(true);
  });
  it("frees slots after the window", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.hit("a", 0).ok).toBe(true);
    expect(limiter.hit("a", 999).ok).toBe(false);
    expect(limiter.hit("a", 1000).ok).toBe(true);
  });
});
