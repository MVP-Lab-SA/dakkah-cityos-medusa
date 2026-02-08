import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

const updateSchema = z.object({
  utility_type: z.enum(["electricity", "water", "gas", "internet", "phone", "cable", "waste"]).optional(),
  provider_name: z.string().optional(),
  account_number: z.string().optional(),
  meter_number: z.string().optional(),
  address: z.any().optional(),
  status: z.enum(["active", "suspended", "closed"]).optional(),
  auto_pay: z.boolean().optional(),
  payment_method_id: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("utilities") as any
  const { id } = req.params
  const [item] = await mod.listUtilityAccounts({ id }, { take: 1 })
  if (!item) return res.status(404).json({ message: "Not found" })
  return res.json({ item })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("utilities") as any
  const { id } = req.params
  const validation = updateSchema.safeParse(req.body)
  if (!validation.success) return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
  const item = await mod.updateUtilityAccounts({ id, ...validation.data })
  return res.json({ item })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("utilities") as any
  const { id } = req.params
  await mod.deleteUtilityAccounts([id])
  return res.status(204).send()
}
