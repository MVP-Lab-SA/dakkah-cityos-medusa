import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const moduleService = req.scope.resolve("realEstate") as any
  const { limit = "20", offset = "0", tenant_id, city, property_type, listing_type } = req.query as Record<string, string | undefined>
  const filters: Record<string, any> = {}
  if (tenant_id) filters.tenant_id = tenant_id
  if (city) filters.city = city
  if (property_type) filters.property_type = property_type
  if (listing_type) filters.listing_type = listing_type
  filters.status = "active"
  const items = await moduleService.listPropertyListings(filters, { skip: Number(offset), take: Number(limit) })
  return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })
}
