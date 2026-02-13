import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { product_id } = req.query as Record<string, string | undefined>
    if (!product_id) {
      return res.status(400).json({ message: "product_id is required" })
    }
    const filters: Record<string, any> = { target_id: product_id, applies_to: "product", status: "active" }
    const { data: rules } = await query.graph({
      entity: "volume_pricing",
      fields: ["id", "name", "description", "applies_to", "target_id", "pricing_type", "priority", "status", "starts_at", "ends_at", "created_at"],
      filters,
    })
    const enrichedRules = await Promise.all(rules.map(async (rule: Record<string, unknown>) => {
      const { data: tiers } = await query.graph({
        entity: "volume_pricing_tier",
        fields: ["id", "volume_pricing_id", "min_quantity", "max_quantity", "discount_percentage", "discount_amount", "fixed_price", "currency_code"],
        filters: { volume_pricing_id: rule.id },
      })
      return { ...rule, tiers }
    }))
    res.json({ rules: enrichedRules })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
