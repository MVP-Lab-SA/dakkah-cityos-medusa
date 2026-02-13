import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("freelance") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      category,
      min_price,
      max_price,
      delivery_time,
      skill,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (category) filters.category = category
    if (min_price) filters.min_price = Number(min_price)
    if (max_price) filters.max_price = Number(max_price)
    if (delivery_time) filters.delivery_time = Number(delivery_time)
    if (skill) filters.skill = skill
    if (search) filters.search = search
    filters.status = "active"

    const items = await mod.listGigListings(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({
      items,
      count: Array.isArray(items) ? items.length : 0,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch gig listings",
      error: error.message,
    })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("freelance") as any
    const item = await mod.createGigListings(req.body)
    res.status(201).json({ item })
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Failed to create gig listing" })
  }
}
