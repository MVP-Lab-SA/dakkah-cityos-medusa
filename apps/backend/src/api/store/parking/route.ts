import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const parkingService = req.scope.resolve("parking") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      status,
      zone_type,
      location,
      city,
      is_available,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (status) filters.status = status
    if (zone_type) filters.zone_type = zone_type
    if (location) filters.location = location
    if (city) filters.city = city
    if (is_available !== undefined) filters.is_available = is_available === "true"
    if (search) filters.name = { $like: `%${search}%` }

    const [items, count] = await Promise.all([
      parkingService.listParkingZones(filters, {
        skip: Number(offset),
        take: Number(limit),
        order: { created_at: "DESC" },
      }),
      parkingService.listParkingZones(filters, { skip: 0, take: 0 }).then(
        (r: any) => (Array.isArray(r) ? r.length : 0)
      ).catch(() => 0),
    ])

    const itemList = Array.isArray(items) ? items : []

    return res.json({
      items: itemList,
      count: itemList.length,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch parking zones",
      error: error.message,
    })
  }
}
