import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const restaurantService = req.scope.resolve("restaurant") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      city,
      cuisine_type,
      delivery_available,
      price_range,
      is_active,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (city) filters.city = city
    if (cuisine_type) filters.cuisine_types = cuisine_type
    if (delivery_available !== undefined) {
      filters.delivery_available = delivery_available === "true"
    }
    if (price_range) filters.price_range = price_range
    if (is_active !== undefined) {
      filters.is_active = is_active === "true"
    } else {
      filters.is_active = true
    }
    if (search) filters.name = { $like: `%${search}%` }

    const items = await restaurantService.listRestaurants(filters, {
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
    return handleApiError(res, error, "STORE-RESTAURANTS")}
}

