import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("automotive") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      make,
      model,
      year,
      condition,
      min_price,
      max_price,
      fuel_type,
      transmission,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (make) filters.make = make
    if (model) filters.model = model
    if (year) filters.year = Number(year)
    if (condition) filters.condition = condition
    if (min_price) filters.min_price = Number(min_price)
    if (max_price) filters.max_price = Number(max_price)
    if (fuel_type) filters.fuel_type = fuel_type
    if (transmission) filters.transmission = transmission
    if (search) filters.search = search

    const items = await mod.listVehicleListings(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({
      items,
      count: Array.isArray(items) ? items.length : 0,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch vehicle listings",
      error: error.message,
    })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("automotive") as any
    const item = await mod.createVehicleListings(req.body)
    res.status(201).json({ item })
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Failed to create vehicle listing" })
  }
}
