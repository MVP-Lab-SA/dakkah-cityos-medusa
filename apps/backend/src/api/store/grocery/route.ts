import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const groceryService = req.scope.resolve("grocery") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      category,
      is_organic,
      storage_type,
      is_available,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (category) filters.category = category
    if (is_organic !== undefined) filters.is_organic = is_organic === "true"
    if (storage_type) filters.storage_type = storage_type
    if (is_available !== undefined) filters.is_available = is_available === "true"
    if (search) filters.name = { $like: `%${search}%` }

    const items = await groceryService.listFreshProducts(filters, {
      skip: Number(offset),
      take: Number(limit),
      order: { created_at: "DESC" },
    })

    const itemList = Array.isArray(items) ? items : []

    return res.json({
      items: itemList,
      count: itemList.length,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    return handleApiError(res, error, "STORE-GROCERY")
  }
}
