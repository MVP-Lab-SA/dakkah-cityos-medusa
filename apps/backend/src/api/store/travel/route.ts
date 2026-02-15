import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("travel") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      city,
      property_type,
      destination,
      duration,
      min_price,
      max_price,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (city) filters.city = city
    if (property_type) filters.property_type = property_type
    if (destination) filters.destination = destination
    if (duration) filters.duration = Number(duration)
    if (min_price) filters.min_price = Number(min_price)
    if (max_price) filters.max_price = Number(max_price)
    if (search) filters.search = search
    filters.is_active = true

    const items = await mod.listTravelProperties(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({
      items,
      count: Array.isArray(items) ? items.length : 0,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    handleApiError(res, error, "STORE-TRAVEL")}
}

