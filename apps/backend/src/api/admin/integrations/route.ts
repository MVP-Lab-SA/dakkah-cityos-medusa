import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createLogger } from "../../../lib/logger"
import { handleApiError } from "../../../lib/api-error-handler"
const logger = createLogger("api:admin/integrations")

const INTEGRATION_SYSTEMS = [
  { name: "payload", envVar: "PAYLOAD_CMS_URL_DEV" },
  { name: "erpnext", envVar: "ERPNEXT_URL_DEV" },
  { name: "fleetbase", envVar: "FLEETBASE_URL_DEV" },
  { name: "waltid", envVar: "WALTID_URL_DEV" },
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
    logger.error(`[Integrations] fetching integration overview: ${error.message}`)
    return handleApiError(res, error, "ADMIN-INTEGRATIONS")}
}

