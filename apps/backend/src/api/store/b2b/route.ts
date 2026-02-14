import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const companyService = req.scope.resolve("company") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      category,
      min_order,
      status,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (category) filters.category = category
    if (status) {
      filters.status = status
    } else {
      filters.status = "approved"
    }
    if (min_order) filters.min_order_amount = { $gte: Number(min_order) }
    if (search) filters.name = { $like: `%${search}%` }

    const items = await companyService.listCompanies(filters, {
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
    return res.status(500).json({
      message: "Failed to fetch B2B companies",
      error: error.message,
    })
  }
}
