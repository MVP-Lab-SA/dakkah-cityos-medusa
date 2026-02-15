import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("classified") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      category,
      location,
      min_price,
      max_price,
      condition,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (category) filters.category = category
    if (location) filters.location = location
    if (min_price) filters.min_price = Number(min_price)
    if (max_price) filters.max_price = Number(max_price)
    if (condition) filters.condition = condition
    if (search) filters.search = search
    filters.status = "active"

    const items = await mod.listClassifiedListings(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({
      items,
      count: Array.isArray(items) ? items.length : 0,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    handleApiError(res, error, "STORE-CLASSIFIEDS")
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("classified") as any
    const item = await mod.createClassifiedListings(req.body)
    res.status(201).json({ item })
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Failed to create classified listing" })
  }
}
