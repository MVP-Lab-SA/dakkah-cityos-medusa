import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

const updateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  plan_type: z.enum(["standard", "extended", "premium", "accidental"]).optional(),
  duration_months: z.number().optional(),
  price: z.number().optional(),
  currency_code: z.string().optional(),
  coverage: z.any().optional(),
  exclusions: z.any().optional(),
  is_active: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("warranty") as any
  const { id } = req.params
  const [item] = await mod.listWarrantyPlans({ id }, { take: 1 })
  if (!item) return res.status(404).json({ message: "Not found" })
  return res.json({ item })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("warranty") as any
  const { id } = req.params
  const validation = updateSchema.safeParse(req.body)
  if (!validation.success) return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
  const item = await mod.updateWarrantyPlans({ id, ...validation.data })
  return res.json({ item })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("warranty") as any
  const { id } = req.params
  await mod.deleteWarrantyPlans([id])
  return res.status(204).send()
}
