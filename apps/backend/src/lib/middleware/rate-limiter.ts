import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message: string
  keyPrefix: string
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

let cleanupInterval: ReturnType<typeof setInterval> | null = null

function startCleanup() {
  if (cleanupInterval) return
  cleanupInterval = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) {
        store.delete(key)
      }
    }
  }, 60_000)
  if (cleanupInterval.unref) cleanupInterval.unref()
}

function getClientIp(req: MedusaRequest): string {
  const forwarded = req.headers["x-forwarded-for"]
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim()
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0]
  }
  return req.socket?.remoteAddress || "unknown"
}

function createRateLimiter(config: RateLimitConfig) {
  startCleanup()

  return function rateLimitMiddleware(
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) {
    const ip = getClientIp(req)
    const key = `${config.keyPrefix}:${ip}`
    const now = Date.now()

    let entry = store.get(key)

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + config.windowMs }
      store.set(key, entry)
    }

    entry.count++

    const remaining = Math.max(0, config.maxRequests - entry.count)
    const resetSeconds = Math.ceil((entry.resetAt - now) / 1000)

    res.setHeader("X-RateLimit-Limit", config.maxRequests.toString())
    res.setHeader("X-RateLimit-Remaining", remaining.toString())
    res.setHeader("X-RateLimit-Reset", resetSeconds.toString())

    if (entry.count > config.maxRequests) {
      res.setHeader("Retry-After", resetSeconds.toString())
      return res.status(429).json({
        type: "rate_limit_exceeded",
        message: config.message,
        retry_after_seconds: resetSeconds,
      })
    }

    return next()
  }
}

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: "Too many authentication attempts. Please try again later.",
  keyPrefix: "rl:auth",
})

export const storeApiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 120,
  message: "Too many requests. Please slow down.",
  keyPrefix: "rl:store",
})

export const adminApiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 200,
  message: "Too many admin requests. Please slow down.",
  keyPrefix: "rl:admin",
})

export const webhookRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 500,
  message: "Too many webhook requests.",
  keyPrefix: "rl:webhook",
})

export const healthCheckRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
  message: "Too many health check requests.",
  keyPrefix: "rl:health",
})
