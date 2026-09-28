type Bucket = number[];

export type RateLimiter = {
  /** Records a hit and reports whether it is within the limit. */
  hit(key: string, now?: number): { ok: boolean; retryAfterMs: number };
  reset(key?: string): void;
};

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter {
  const buckets = new Map<string, Bucket>();

  function prune(now: number) {
    if (buckets.size < 1000) return;
    for (const [key, hits] of buckets) {
      if (!hits.length || now - hits[hits.length - 1] >= windowMs) buckets.delete(key);
    }
  }

  return {
    hit(key, now = Date.now()) {
      prune(now);
      const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
      if (hits.length >= limit) {
        buckets.set(key, hits);
        return { ok: false, retryAfterMs: windowMs - (now - hits[0]) };
      }
      hits.push(now);
      buckets.set(key, hits);
      return { ok: true, retryAfterMs: 0 };
    },
    reset(key) {
      if (key) buckets.delete(key);
      else buckets.clear();
    },
  };
}

const registry = globalThis as typeof globalThis & { __rateLimiters?: Map<string, RateLimiter> };

/** Process-wide named limiter (survives dev hot reloads). Single-process only. */
export function getRateLimiter(name: string, options: { limit: number; windowMs: number }): RateLimiter {
  registry.__rateLimiters ??= new Map();
  let limiter = registry.__rateLimiters.get(name);
  if (!limiter) {
    limiter = createRateLimiter(options);
    registry.__rateLimiters.set(name, limiter);
  }
  return limiter;
}
