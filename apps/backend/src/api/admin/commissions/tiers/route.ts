import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET - List commission tiers
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve("query")

  const { data: tiers } = await query.graph({
    entity: "commission_tier",
    fields: ["id", "name", "min_revenue", "max_revenue", "rate", "created_at"],
    filters: {}
  })

  res.json({ tiers })
}

// POST - Create commission tier
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { name, min_revenue, max_revenue, rate } = req.body as {
    name: string
    min_revenue: number
    max_revenue?: number
    rate: number
  }

  const commissionService = req.scope.resolve("commissionModuleService")

  // Validate rate is between 0 and 100
  if (rate < 0 || rate > 100) {
    return res.status(400).json({ message: "Rate must be between 0 and 100" })
  }

  // Check for overlapping tiers
  const query = req.scope.resolve("query")
  const { data: existingTiers } = await query.graph({
    entity: "commission_tier",
    fields: ["id", "min_revenue", "max_revenue"],
    filters: {}
  })

  for (const tier of existingTiers) {
    const tierMax = tier.max_revenue || Infinity
    const newMax = max_revenue || Infinity
    
    if (
      (min_revenue >= tier.min_revenue && min_revenue < tierMax) ||
      (newMax > tier.min_revenue && newMax <= tierMax) ||
      (min_revenue <= tier.min_revenue && newMax >= tierMax)
    ) {
      return res.status(400).json({ 
        message: "Revenue range overlaps with existing tier" 
      })
    }
  }

  const tier = await commissionService.createCommissionTiers({
    name,
    min_revenue,
    max_revenue,
    rate
  })

  res.status(201).json({ tier })
}
