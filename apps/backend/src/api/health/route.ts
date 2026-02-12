// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

const ENV_CHECKS = {
  temporal: {
    name: "Temporal Cloud",
    vars: ["TEMPORAL_API_KEY", "TEMPORAL_NAMESPACE"],
  },
  stripe: {
    name: "Stripe",
    vars: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
  },
  erpnext: {
    name: "ERPNext",
    vars: ["ERPNEXT_URL", "ERPNEXT_API_KEY", "ERPNEXT_WEBHOOK_SECRET"],
  },
  fleetbase: {
    name: "Fleetbase",
    vars: ["FLEETBASE_URL", "FLEETBASE_API_KEY", "FLEETBASE_WEBHOOK_SECRET"],
  },
  "payload-cms": {
    name: "Payload CMS",
    vars: ["PAYLOAD_CMS_URL", "PAYLOAD_API_KEY", "PAYLOAD_CMS_WEBHOOK_SECRET"],
  },
  waltid: {
    name: "Walt.id",
    vars: ["WALTID_URL", "WALTID_API_KEY"],
  },
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const startTime = Date.now()
  let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy"
  const services: Record<string, any> = {}

  let dbStatus = "healthy"
  try {
    const query = req.scope.resolve("query")
    await query.graph({
      entity: "region",
      fields: ["id"],
      pagination: { take: 1 },
    })
    services.database = { status: "healthy" }
  } catch (error: any) {
    dbStatus = "unhealthy"
    overallStatus = "degraded"
    services.database = {
      status: "unhealthy",
      error: error.message,
    }
  }

  for (const [systemId, config] of Object.entries(ENV_CHECKS)) {
    const configuredVars: Record<string, boolean> = {}
    let allConfigured = true
    let anyConfigured = false

    for (const varName of config.vars) {
      const isSet = !!process.env[varName]
      configuredVars[varName] = isSet
      if (!isSet) allConfigured = false
      if (isSet) anyConfigured = true
    }

    services[systemId] = {
      name: config.name,
      configured: allConfigured,
      partially_configured: anyConfigured && !allConfigured,
      env_vars: configuredVars,
    }
  }

  let circuitBreakerStates: Record<string, any> = {}
  try {
    const { getCircuitBreakerStates } = await import("../../lib/platform/outbox-processor.js")
    circuitBreakerStates = getCircuitBreakerStates()
  } catch {
    circuitBreakerStates = { error: "Outbox processor not available" }
  }

  let temporalStatus: any = { connected: false, error: "Not checked" }
  try {
    const { checkTemporalHealth } = await import("../../lib/temporal-client.js")
    temporalStatus = await checkTemporalHealth()
  } catch (err: any) {
    temporalStatus = { connected: false, error: err.message }
  }

  if (!temporalStatus.connected && services.temporal?.configured) {
    overallStatus = "degraded"
  }

  const configuredCount = Object.values(services).filter((s: any) => s.configured === true).length
  const totalSystems = Object.keys(ENV_CHECKS).length

  if (dbStatus === "unhealthy") {
    overallStatus = "unhealthy"
  }

  return res.status(overallStatus === "unhealthy" ? 503 : 200).json({
    status: overallStatus,
    services,
    circuit_breakers: circuitBreakerStates,
    temporal: temporalStatus,
    summary: {
      configured_systems: configuredCount,
      total_systems: totalSystems,
      database: dbStatus,
    },
    timestamp: new Date().toISOString(),
    response_time_ms: Date.now() - startTime,
  })
}
