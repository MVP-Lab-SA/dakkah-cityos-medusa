import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("socialCommerce") as any
  const { limit = "20", offset = "0", tenant_id, type } = req.query as Record<string, string | undefined>
  const filters: Record<string, any> = {}
  if (tenant_id) filters.tenant_id = tenant_id

  if (type === "group_buy") {
    filters.status = "active"
    const items = await mod.listGroupBuys(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })
  }

  filters.status = "live"
  const items = await mod.listLiveStreams(filters, { skip: Number(offset), take: Number(limit) })
  return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })
}
