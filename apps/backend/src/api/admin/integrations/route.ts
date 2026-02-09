import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

const INTEGRATION_SYSTEMS = [
  { name: "payload", envVar: "PAYLOAD_API_URL" },
  { name: "erpnext", envVar: "ERPNEXT_SITE_URL" },
  { name: "fleetbase", envVar: "FLEETBASE_API_URL" },
  { name: "waltid", envVar: "WALTID_API_URL" },
  { name: "stripe", envVar: "STRIPE_SECRET_KEY" },
  { name: "temporal", envVar: "TEMPORAL_API_KEY" },
]

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const systems = INTEGRATION_SYSTEMS.map((system) => {
      const configured = !!process.env[system.envVar]
      return {
        name: system.name,
        configured,
        last_sync_time: null,
        status: configured ? "active" : "not_configured",
      }
    })

    return res.json({
      systems,
      total: systems.length,
      configured_count: systems.filter((s) => s.configured).length,
    })
  } catch (error: any) {
    console.log(`[Integrations] Error fetching integration overview: ${error.message}`)
    return res.status(500).json({ error: error.message })
  }
}
