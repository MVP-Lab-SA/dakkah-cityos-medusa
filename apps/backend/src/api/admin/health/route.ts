import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getCache } from "../../../lib/cache/redis-cache"
import { metrics } from "../../../lib/monitoring/metrics"

/**
 * Health check endpoint for CityOS Commerce
 * 
 * Returns:
 * - Database connectivity status
 * - Redis cache status
 * - System metrics
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const startTime = Date.now()
  const health: Record<string, unknown> = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || "unknown",
    environment: process.env.NODE_ENV || "development",
    checks: {},
  }

  // Check database
  try {
    const query = req.scope.resolve("query")
    await query.graph({
      entity: "region",
      fields: ["id"],
      pagination: { take: 1 },
    })
    health.checks = {
      ...health.checks as Record<string, unknown>,
      database: { status: "healthy" },
    }
  } catch (error) {
    health.checks = {
      ...health.checks as Record<string, unknown>,
      database: {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    }
    health.status = "degraded"
  }

  // Check Redis cache
  const cache = getCache()
  const cacheHealthy = await cache.healthCheck()
  const cacheStats = await cache.getStats()
  health.checks = {
    ...health.checks as Record<string, unknown>,
    cache: {
      status: cacheHealthy ? "healthy" : "disabled",
      stats: cacheStats,
    },
  }

  // Add metrics summary
  health.metrics = metrics.getSummary()

  // Calculate response time
  health.response_time_ms = Date.now() - startTime

  // Track this health check
  metrics.trackRequest("GET", "/admin/health", 200, health.response_time_ms as number)

  const statusCode = health.status === "healthy" ? 200 : 503
  return res.status(statusCode).json(health)
}
