// Lightweight in-memory rate limiter (no external deps).
// Good enough for a single-instance deployment behind nginx.
const hits = new Map();

export function rateLimit({ windowMs = 60_000, max = 120 } = {}) {
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket?.remoteAddress || "unknown";

    let entry = hits.get(key);
    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;

    // Occasional sweep to keep the map bounded.
    if (hits.size > 10_000) {
      for (const [k, v] of hits) {
        if (now >= v.resetAt) hits.delete(k);
      }
    }

    if (entry.count > max) {
      return res.status(429).json({
        success: false,
        error: "Too many requests, please try again later",
      });
    }

    next();
  };
}
