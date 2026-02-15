import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve("query") as any
    const { id } = req.params

    const { data: fulfillments } = await query.graph({
      entity: "fulfillment",
      fields: [
        "id",
        "tracking_links",
        "shipped_at",
        "delivered_at",
        "canceled_at",
        "created_at",
        "items.id",
        "items.title",
        "items.quantity",
      ],
      filters: { id },
    })

    const item = Array.isArray(fulfillments) ? fulfillments[0] : fulfillments
    if (!item) return res.status(404).json({ message: "Not found" })

    return res.json({
      item: {
        ...item,
        status: item.delivered_at
          ? "delivered"
          : item.canceled_at
            ? "canceled"
            : item.shipped_at
              ? "shipped"
              : "processing",
      },
    })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return handleApiError(res, error, "STORE-CONSIGNMENTS-ID")}
    handleApiError(res, error, "STORE-CONSIGNMENTS-ID")
  }
}

