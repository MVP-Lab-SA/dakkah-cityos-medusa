import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { product_id, limit = "20", offset = "0" } = req.query as Record<string, string | undefined>
    const filters: Record<string, any> = { status: "active" }
    if (product_id) {
      filters.target_id = product_id
      filters.applies_to = "product"
    }
    const { data: rules } = await query.graph({
      entity: "volume_pricing",
      fields: ["id", "name", "description", "applies_to", "target_id", "pricing_type", "priority", "status", "starts_at", "ends_at", "created_at"],
      filters,
    })
    const enrichedRules = await Promise.all((rules || []).map(async (rule: Record<string, unknown>) => {
      const { data: tiers } = await query.graph({
        entity: "volume_pricing_tier",
        fields: ["id", "volume_pricing_id", "min_quantity", "max_quantity", "discount_percentage", "discount_amount", "fixed_price", "currency_code"],
        filters: { volume_pricing_id: rule.id },
      })
      return { ...rule, tiers }
    }))
    res.json({ items: enrichedRules, count: enrichedRules.length, limit: Number(limit), offset: Number(offset) })
  } catch (error: any) {
    return handleApiError(res, error, "STORE-VOLUME-DEALS")
  }
}
