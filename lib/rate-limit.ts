const bucket = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const item = bucket.get(key);
  if (!item || item.reset < now) {
    bucket.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, reset: now + windowMs };
  }
  if (item.count >= limit) {
    return { ok: false, remaining: 0, reset: item.reset };
  }
  item.count += 1;
  return { ok: true, remaining: limit - item.count, reset: item.reset };
}
