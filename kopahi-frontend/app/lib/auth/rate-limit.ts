// In-memory rate limiter, keyed by an arbitrary string (typically `route:ip`).
//
// This is a single-process bucket. For multi-replica deploys, swap the
// Map for Redis (Upstash) — same interface. The `setInterval` cleanup is
// `unref`'d so it doesn't keep the process alive in serverless contexts.

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: max - 1, resetAt: now + windowMs };
  }

  if (bucket.count >= max) {
    return { success: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count++;
  return { success: true, remaining: max - bucket.count, resetAt: bucket.resetAt };
}

// Sweep expired buckets every minute so the Map doesn't grow unbounded.
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store.entries()) {
      if (bucket.resetAt < now) store.delete(key);
    }
  }, 60 * 1000);
  // unref() lets Node exit even if this timer is pending.
  if (typeof timer === "object" && timer && "unref" in timer) {
    (timer as { unref?: () => void }).unref?.();
  }
}
