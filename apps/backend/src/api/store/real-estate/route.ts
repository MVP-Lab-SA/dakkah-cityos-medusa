import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const realEstateService = req.scope.resolve("realEstate") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      city,
      property_type,
      listing_type,
      min_price,
      max_price,
      bedrooms,
      status,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (city) filters.city = city
    if (property_type) filters.property_type = property_type
    if (listing_type) filters.listing_type = listing_type
    if (min_price) filters.price = { ...(filters.price || {}), $gte: Number(min_price) }
    if (max_price) filters.price = { ...(filters.price || {}), $lte: Number(max_price) }
    if (bedrooms) filters.bedrooms = Number(bedrooms)
    if (status) {
      filters.status = status
    } else {
      filters.status = "active"
    }
    if (search) filters.title = { $like: `%${search}%` }

    const items = await realEstateService.listPropertyListings(filters, {
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
    return handleApiError(res, error, "STORE-REAL-ESTATE")
  }
}
