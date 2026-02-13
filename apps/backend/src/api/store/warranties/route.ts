import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("warranty") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      coverage_type,
      is_active,
      duration,
      search,
      product_id,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (coverage_type) filters.coverage_type = coverage_type
    if (is_active) filters.is_active = is_active === "true"
    if (duration) filters.duration = Number(duration)
    if (product_id) filters.product_id = product_id
    if (search) filters.search = search

    const items = await mod.listWarrantyPlans(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({
      items,
      count: Array.isArray(items) ? items.length : 0,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch warranty plans",
      error: error.message,
    })
  }
}
