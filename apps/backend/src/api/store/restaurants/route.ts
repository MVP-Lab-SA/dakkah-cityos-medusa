import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const moduleService = req.scope.resolve("restaurant") as any
    const { limit = "20", offset = "0", tenant_id, city, cuisine_type } = req.query as Record<string, string | undefined>
    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (city) filters.city = city
    if (cuisine_type) filters.cuisine_types = cuisine_type
    filters.is_active = true
    const items = await moduleService.listRestaurants(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch restaurants", error: error.message })
  }
}
