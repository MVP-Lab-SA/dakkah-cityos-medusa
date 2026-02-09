import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("grocery") as any
  const { limit = "20", offset = "0", tenant_id, category, is_organic } = req.query as Record<string, string | undefined>
  const filters: Record<string, any> = {}
  if (tenant_id) filters.tenant_id = tenant_id
  if (category) filters.category = category
  if (is_organic) filters.is_organic = is_organic === "true"
  const items = await mod.listFreshProducts(filters, { skip: Number(offset), take: Number(limit) })
  return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })
}
