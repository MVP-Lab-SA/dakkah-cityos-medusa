import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { checkTemporalHealth } from "../../../../lib/temporal-client"

interface SystemHealthCheck {
  name: string
  url?: string
  envVar: string
  headers?: Record<string, string>
}

const SYSTEMS: SystemHealthCheck[] = [
  { name: "payload", envVar: "PAYLOAD_API_URL" },
  { name: "erpnext", envVar: "ERPNEXT_SITE_URL" },
  { name: "fleetbase", envVar: "FLEETBASE_API_URL" },
  { name: "waltid", envVar: "WALTID_API_URL" },
  { name: "stripe", envVar: "STRIPE_SECRET_KEY" },
]

async function checkSystemHealth(system: SystemHealthCheck): Promise<{
  name: string
  status: "healthy" | "unhealthy" | "not_configured"
  latency_ms: number
  error?: string
}> {
  const baseUrl = process.env[system.envVar]

  if (!baseUrl) {
    return { name: system.name, status: "not_configured", latency_ms: 0 }
  }

  const start = Date.now()
  try {
    if (system.name === "stripe") {
      const Stripe = (await import("stripe")).default
      const stripe = new Stripe(baseUrl)
      await stripe.balance.retrieve()
      const latency_ms = Date.now() - start
      return { name: system.name, status: "healthy", latency_ms }
    }

    const axios = (await import("axios")).default
    const headers: Record<string, string> = { ...system.headers }

    if (system.name === "payload" && process.env.PAYLOAD_API_KEY) {
      headers["Authorization"] = `Bearer ${process.env.PAYLOAD_API_KEY}`
    } else if (system.name === "erpnext" && process.env.ERPNEXT_API_KEY && process.env.ERPNEXT_API_SECRET) {
      headers["Authorization"] = `token ${process.env.ERPNEXT_API_KEY}:${process.env.ERPNEXT_API_SECRET}`
    } else if (system.name === "fleetbase" && process.env.FLEETBASE_API_KEY) {
      headers["Authorization"] = `Bearer ${process.env.FLEETBASE_API_KEY}`
      if (process.env.FLEETBASE_ORG_ID) {
        headers["Organization-ID"] = process.env.FLEETBASE_ORG_ID
      }
    } else if (system.name === "waltid" && process.env.WALTID_API_KEY) {
      headers["Authorization"] = `Bearer ${process.env.WALTID_API_KEY}`
    }

    await axios.get(baseUrl, {
      timeout: 3000,
      headers,
      validateStatus: () => true,
    })

    const latency_ms = Date.now() - start
    return { name: system.name, status: "healthy", latency_ms }
  } catch (error: any) {
    const latency_ms = Date.now() - start
    return {
      name: system.name,
      status: "unhealthy",
      latency_ms,
      error: error.message,
    }
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const healthChecks = await Promise.all(
      SYSTEMS.map((system) => checkSystemHealth(system))
    )

    let temporalResult: {
      name: string
      status: "healthy" | "unhealthy" | "not_configured"
      latency_ms: number
      error?: string
    }

    if (!process.env.TEMPORAL_API_KEY) {
      temporalResult = { name: "temporal", status: "not_configured", latency_ms: 0 }
    } else {
      const start = Date.now()
      try {
        const health = await checkTemporalHealth()
        const latency_ms = Date.now() - start
        temporalResult = {
          name: "temporal",
          status: health.connected ? "healthy" : "unhealthy",
          latency_ms,
          error: health.error,
        }
      } catch (error: any) {
        temporalResult = {
          name: "temporal",
          status: "unhealthy",
          latency_ms: Date.now() - start,
          error: error.message,
        }
      }
    }

    healthChecks.push(temporalResult)

    return res.json({ systems: healthChecks })
  } catch (error: any) {
    console.log(`[IntegrationHealth] Error checking health: ${error.message}`)
    return res.status(500).json({ error: error.message })
  }
}
