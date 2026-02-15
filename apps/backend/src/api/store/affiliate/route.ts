import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("affiliate") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      status,
      category,
      commission_type,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (status) filters.status = status
    if (category) filters.category = category
    if (commission_type) filters.commission_type = commission_type
    if (search) filters.search = search

    const items = await mod.listAffiliates(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({
      items,
      count: Array.isArray(items) ? items.length : 0,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    handleApiError(res, error, "STORE-AFFILIATE")
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("affiliate") as any
    const item = await mod.createAffiliates(req.body)
    res.status(201).json({ item })
  } catch (error: any) {
    return handleApiError(res, error, "STORE-AFFILIATE")
  }
}
