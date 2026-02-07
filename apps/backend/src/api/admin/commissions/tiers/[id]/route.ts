import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET - Get commission tier by ID
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const query = req.scope.resolve("query")

  const { data: tiers } = await query.graph({
    entity: "commission_tier",
    fields: ["id", "name", "min_revenue", "max_revenue", "rate", "created_at", "updated_at"],
    filters: { id }
  })

  if (!tiers.length) {
    return res.status(404).json({ message: "Commission tier not found" })
  }

  res.json({ tier: tiers[0] })
}

// PUT - Update commission tier
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const { name, min_revenue, max_revenue, rate } = req.body as {
    name?: string
    min_revenue?: number
    max_revenue?: number
    rate?: number
  }

  const commissionService = req.scope.resolve("commissionModuleService") as any

  if (rate !== undefined && (rate < 0 || rate > 100)) {
    return res.status(400).json({ message: "Rate must be between 0 and 100" })
  }

  await commissionService.updateCommissionTiers({
    selector: { id },
    data: {
      ...(name && { name }),
      ...(min_revenue !== undefined && { min_revenue }),
      ...(max_revenue !== undefined && { max_revenue }),
      ...(rate !== undefined && { rate })
    }
  })

  const query = req.scope.resolve("query")
  const { data: tiers } = await query.graph({
    entity: "commission_tier",
    fields: ["id", "name", "min_revenue", "max_revenue", "rate"],
    filters: { id }
  })

  res.json({ tier: tiers[0] })
}

// DELETE - Delete commission tier
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const commissionService = req.scope.resolve("commissionModuleService") as any

  await commissionService.deleteCommissionTiers(id)

  res.json({ message: "Commission tier deleted", id })
}
