import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("parking") as any
  const { limit = "20", offset = "0", tenant_id, status, zone_type } = req.query as Record<string, string | undefined>
  const filters: Record<string, any> = {}
  if (tenant_id) filters.tenant_id = tenant_id
  if (status) filters.status = status
  if (zone_type) filters.zone_type = zone_type
  const items = await mod.listParkingZones(filters, { skip: Number(offset), take: Number(limit) })
  return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })
}
