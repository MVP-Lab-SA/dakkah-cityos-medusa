import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("utilities") as any
    const { limit = "20", offset = "0", tenant_id, status, utility_type } = req.query as Record<string, string | undefined>
    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (status) filters.status = status
    if (utility_type) filters.utility_type = utility_type
    const items = await mod.listUtilityAccounts(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch utility accounts"
    return handleApiError(res, error, "STORE-UTILITIES")
  }
}
