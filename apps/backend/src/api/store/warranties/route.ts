import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("warranty") as any
  const { limit = "20", offset = "0", tenant_id, coverage_type, is_active } = req.query as Record<string, string | undefined>
  const filters: Record<string, any> = {}
  if (tenant_id) filters.tenant_id = tenant_id
  if (coverage_type) filters.coverage_type = coverage_type
  if (is_active) filters.is_active = is_active === "true"
  const items = await mod.listWarrantyPlans(filters, { skip: Number(offset), take: Number(limit) })
  return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })
}
