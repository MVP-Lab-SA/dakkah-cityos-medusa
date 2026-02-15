import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { id } = req.params

    const { data: rules } = await query.graph({
      entity: "volume_pricing",
      fields: ["id", "name", "description", "applies_to", "target_id", "pricing_type", "priority", "status", "starts_at", "ends_at", "created_at"],
      filters: { id },
    })

    const rule = Array.isArray(rules) ? rules[0] : rules
    if (!rule) return res.status(404).json({ message: "Not found" })

    const { data: tiers } = await query.graph({
      entity: "volume_pricing_tier",
      fields: ["id", "volume_pricing_id", "min_quantity", "max_quantity", "discount_percentage", "discount_amount", "fixed_price", "currency_code"],
      filters: { volume_pricing_id: rule.id },
    })

    return res.json({ item: { ...rule, tiers } })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return res.status(404).json({ message: "Volume pricing rule not found" })
    }
    handleApiError(res, error, "STORE-VOLUME-PRICING-ID")
  }
}
