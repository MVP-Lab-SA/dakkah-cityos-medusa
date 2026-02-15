import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const promotionExtService = req.scope.resolve("promotionExt") as any
    const { limit = "20", offset = "0", category, tenant_id } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {
      is_active: true,
    }

    if (tenant_id) {
      filters.tenant_id = tenant_id
    }

    if (category) {
      filters.category = category
    }

    const now = new Date()
    filters.expires_at = { $gte: now }

    const promotions = await promotionExtService.listGiftCardExts(filters, {
      take: Number(limit),
      skip: Number(offset),
      order: { created_at: "DESC" },
    })

    const items = Array.isArray(promotions) ? promotions : [promotions].filter(Boolean)

    return res.json({
      items,
      count: items.length,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    handleApiError(res, error, "STORE-PROMOTIONS")}
}

