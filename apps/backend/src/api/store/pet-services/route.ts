import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const petServiceMod = req.scope.resolve("petService") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      service_type,
      species,
      pet_type,
      is_active,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (service_type) filters.service_type = service_type
    if (species) filters.species = species
    if (pet_type) filters.pet_type = pet_type
    if (is_active !== undefined) filters.is_active = is_active === "true"
    if (search) filters.name = { $like: `%${search}%` }

    const items = await petServiceMod.listPetProfiles(filters, {
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
      message: "Failed to fetch pet services",
      error: error.message,
    })
  }
}
