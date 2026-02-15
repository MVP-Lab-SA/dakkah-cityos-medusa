import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const legalService = req.scope.resolve("legal") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      specialization,
      practice_area,
      consultation_available,
      is_active,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (specialization) filters.specialization = specialization
    if (practice_area) filters.practice_area = practice_area
    if (consultation_available !== undefined) {
      filters.consultation_available = consultation_available === "true"
    }
    if (is_active !== undefined) filters.is_active = is_active === "true"
    if (search) filters.name = { $like: `%${search}%` }

    const items = await legalService.listAttorneyProfiles(filters, {
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
    return handleApiError(res, error, "STORE-LEGAL")
  }
}
