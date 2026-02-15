import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const financialProductService = req.scope.resolve("financialProduct") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      insurance_type,
      coverage_type,
      provider_id,
      is_active,
      min_premium,
      max_premium,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (insurance_type) filters.insurance_type = insurance_type
    if (coverage_type) filters.coverage_type = coverage_type
    if (provider_id) filters.provider_id = provider_id
    if (is_active !== undefined) {
      filters.is_active = is_active === "true"
    } else {
      filters.is_active = true
    }
    if (min_premium) filters.min_premium = { $gte: Number(min_premium) }
    if (max_premium) filters.max_premium = { $lte: Number(max_premium) }
    if (search) filters.name = { $like: `%${search}%` }

    const items = await financialProductService.listInsuranceProducts(filters, {
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
    return handleApiError(res, error, "STORE-INSURANCE")}
}

