import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

const updateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  points_per_currency: z.number().optional(),
  currency_code: z.string().optional(),
  tier_config: z.any().optional(),
  is_active: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("promotionExt") as any
  const { id } = req.params
  const [item] = await mod.listLoyaltyPrograms({ id }, { take: 1 })
  if (!item) return res.status(404).json({ message: "Not found" })
  return res.json({ item })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("promotionExt") as any
  const { id } = req.params
  const validation = updateSchema.safeParse(req.body)
  if (!validation.success) return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
  const item = await mod.updateLoyaltyPrograms({ id, ...validation.data })
  return res.json({ item })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("promotionExt") as any
  const { id } = req.params
  await mod.deleteLoyaltyPrograms([id])
  return res.status(204).send()
}
