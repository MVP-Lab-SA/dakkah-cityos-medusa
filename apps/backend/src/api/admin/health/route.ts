import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getCache } from "../../../lib/cache/redis-cache"
import { metrics } from "../../../lib/monitoring/metrics"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const startTime = Date.now()
  const checks: Record<string, unknown> = {}
  let overallStatus = "healthy"

  try {
    const query = req.scope.resolve("query")
    await query.graph({
      entity: "region",
      fields: ["id"],
      pagination: { take: 1 },
    })
    checks.database = { status: "healthy" }
  } catch (error) {
    checks.database = {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Connection failed",
    }
    overallStatus = "degraded"
  }

  const cache = getCache()
  const cacheHealthy = await cache.healthCheck()
  const cacheStats = await cache.getStats()
  checks.cache = {
    status: cacheHealthy ? "healthy" : "disabled",
    stats: cacheStats,
  }

  checks.integrations = {
    stripe: {
      status: process.env.STRIPE_API_KEY ? "configured" : "not_configured",
      configured: !!process.env.STRIPE_API_KEY,
    },
    temporal: {
      status: process.env.TEMPORAL_ENDPOINT ? "configured" : "not_configured",
      configured: !!process.env.TEMPORAL_ENDPOINT,
      namespace: process.env.TEMPORAL_NAMESPACE || "not_set",
    },
    payload_cms: {
      status: process.env.PAYLOAD_CMS_URL_DEV ? "configured" : "not_configured",
      configured: !!process.env.PAYLOAD_CMS_URL_DEV,
    },
    erpnext: {
      status: process.env.ERPNEXT_URL_DEV ? "configured" : "not_configured",
      configured: !!process.env.ERPNEXT_URL_DEV,
    },
    fleetbase: {
      status: process.env.FLEETBASE_URL_DEV ? "configured" : "not_configured",
      configured: !!process.env.FLEETBASE_URL_DEV,
    },
    waltid: {
      status: process.env.WALTID_URL_DEV ? "configured" : "not_configured",
      configured: !!process.env.WALTID_URL_DEV,
    },
    sendgrid: {
      status: process.env.SENDGRID_API_KEY ? "configured" : "not_configured",
      configured: !!process.env.SENDGRID_API_KEY,
    },
    meilisearch: {
      status: process.env.MEILISEARCH_HOST ? "configured" : "not_configured",
      configured: !!process.env.MEILISEARCH_HOST,
    },
  }

  const memUsage = process.memoryUsage()
  const systemInfo = {
    uptime_seconds: Math.floor(process.uptime()),
    memory: {
      rss_mb: Math.round(memUsage.rss / 1024 / 1024),
      heap_used_mb: Math.round(memUsage.heapUsed / 1024 / 1024),
      heap_total_mb: Math.round(memUsage.heapTotal / 1024 / 1024),
      external_mb: Math.round(memUsage.external / 1024 / 1024),
    },
    node_version: process.version,
    platform: process.platform,
    pid: process.pid,
  }

  const responseTimeMs = Date.now() - startTime
  metrics.trackRequest("GET", "/admin/health", 200, responseTimeMs)

  const health = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    checks,
    system: systemInfo,
    metrics: metrics.getSummary(),
    response_time_ms: responseTimeMs,
  }

  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
  const statusCode = overallStatus === "healthy" ? 200 : 503
  return res.status(statusCode).json(health)
}
