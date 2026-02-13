import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const healthcareService = req.scope.resolve("healthcare") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      specialization,
      specialty,
      accepting_patients,
      is_active,
      city,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (specialization) filters.specialization = specialization
    if (specialty) filters.specialty = specialty
    if (accepting_patients !== undefined) {
      filters.is_accepting_patients = accepting_patients === "true"
    } else {
      filters.is_accepting_patients = true
    }
    if (is_active !== undefined) filters.is_active = is_active === "true"
    if (city) filters.city = city
    if (search) filters.name = { $like: `%${search}%` }

    const items = await healthcareService.listPractitioners(filters, {
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
      message: "Failed to fetch healthcare practitioners",
      error: error.message,
    })
  }
}
