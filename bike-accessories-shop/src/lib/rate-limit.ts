import type { NextRequest } from "next/server";

type Bucket = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Bucket>();

const MAX_BUCKETS = 10_000;

export function getClientIp(request: NextRequest): string {
  const headerIp =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for");
  if (headerIp) {
    const first = headerIp.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

export function rateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: true } | { ok: false; retryAfterSeconds: number; message: string } {
  const now = Date.now();
  const existing = store.get(options.key);

  if (!existing || now >= existing.resetAt) {
    if (store.size >= MAX_BUCKETS) {
      for (const [key, bucket] of store) {
        if (now >= bucket.resetAt) {
          store.delete(key);
        }
      }
      if (store.size >= MAX_BUCKETS) {
        store.clear();
      }
    }
    store.set(options.key, { count: 1, resetAt: now + options.windowMs });
    return { ok: true };
  }

  if (existing.count < options.limit) {
    existing.count += 1;
    return { ok: true };
  }

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((existing.resetAt - now) / 1000)
  );
  return {
    ok: false,
    retryAfterSeconds,
    message: `Too many attempts. Please try again in ${retryAfterSeconds} seconds.`,
  };
}