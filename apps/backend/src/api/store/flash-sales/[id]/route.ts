import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { id } = req.params

    const { data: promos } = await query.graph({
      entity: "promotion",
      fields: [
        "id",
        "code",
        "is_automatic",
        "type",
        "status",
        "starts_at",
        "ends_at",
        "campaign_id",
        "application_method.type",
        "application_method.value",
        "application_method.target_type",
      ],
      filters: { id },
    })

    const item = Array.isArray(promos) ? promos[0] : promos
    if (!item) return res.status(404).json({ message: "Not found" })

    return res.json({ item })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return res.status(404).json({ message: "Flash sale not found" })
    }
    res.status(500).json({ message: "Failed to fetch flash sale", error: error.message })
  }
}
