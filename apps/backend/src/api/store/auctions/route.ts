import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("auction") as any
  const { limit = "20", offset = "0", tenant_id, auction_type } = req.query as Record<string, string | undefined>
  const filters: Record<string, any> = {}
  if (tenant_id) filters.tenant_id = tenant_id
  if (auction_type) filters.auction_type = auction_type
  filters.status = "active"
  const items = await mod.listAuctionListings(filters, { skip: Number(offset), take: Number(limit) })
  return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })
}
