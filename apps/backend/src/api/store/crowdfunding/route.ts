import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("crowdfunding") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      status,
      category,
      min_goal,
      max_goal,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (status) filters.status = status
    if (category) filters.category = category
    if (min_goal) filters.min_goal = Number(min_goal)
    if (max_goal) filters.max_goal = Number(max_goal)
    if (search) filters.search = search

    const items = await mod.listCrowdfundCampaigns(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({
      items,
      count: Array.isArray(items) ? items.length : 0,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch crowdfunding campaigns",
      error: error.message,
    })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("crowdfunding") as any
    const item = await mod.createCrowdfundCampaigns(req.body)
    res.status(201).json({ item })
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Failed to create crowdfunding campaign" })
  }
}
