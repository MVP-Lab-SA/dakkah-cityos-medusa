import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    return res.json({
      items: [
        { id: "nl_1", title: "Weekly Deals & Offers", description: "Get exclusive deals delivered every week", frequency: "weekly", subscriber_count: 12500, category: "deals" },
        { id: "nl_2", title: "New Arrivals", description: "Be first to know about new products", frequency: "weekly", subscriber_count: 8300, category: "products" },
        { id: "nl_3", title: "Community Events", description: "Stay updated on events near you", frequency: "monthly", subscriber_count: 5200, category: "events" },
      ],
      count: 3,
    })

  } catch (error) {
    handleApiError(res, error, "GET store newsletters")
  }
}
