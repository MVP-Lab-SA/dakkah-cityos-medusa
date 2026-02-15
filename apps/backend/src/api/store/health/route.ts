import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const startTime = Date.now()

  const health: Record<string, unknown> = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || "1.0.0",
    uptime_seconds: Math.floor(process.uptime()),
    checks: {} as Record<string, unknown>,
  }

  try {
    const query = req.scope.resolve("query")
    await query.graph({
      entity: "region",
      fields: ["id"],
      pagination: { take: 1 },
    })
    ;(health.checks as Record<string, unknown>).database = { status: "healthy" }
  } catch (error: any) {
    ;(health.checks as Record<string, unknown>).database = {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Connection failed",}
    health.status = "degraded"
  }

  const integrations: Record<string, { status: string; configured: boolean }> = {
    stripe: {
      status: process.env.STRIPE_API_KEY ? "configured" : "not_configured",
      configured: !!process.env.STRIPE_API_KEY,
    },
    temporal: {
      status: process.env.TEMPORAL_ENDPOINT ? "configured" : "not_configured",
      configured: !!process.env.TEMPORAL_ENDPOINT,
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
  }

  ;(health.checks as Record<string, unknown>).integrations = integrations

  health.response_time_ms = Date.now() - startTime

  const statusCode = health.status === "healthy" ? 200 : 503
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
  return res.status(statusCode).json(health)
}

