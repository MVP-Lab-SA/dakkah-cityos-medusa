import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  code: z.string().nullable().optional(),
  location: z.any().nullable().optional(),
  status: z.enum(["active", "inactive", "maintenance"]).optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const moduleService = req.scope.resolve("node") as any
  const { id } = req.params
  const [item] = await moduleService.listNodes({ id }, { take: 1 })
  if (!item) return res.status(404).json({ message: "Not found" })
  return res.json({ item })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const moduleService = req.scope.resolve("node") as any
  const { id } = req.params
  const validation = updateSchema.safeParse(req.body)
  if (!validation.success) return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
  const item = await moduleService.updateNodes({ id, ...validation.data })
  return res.json({ item })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const moduleService = req.scope.resolve("node") as any
  const { id } = req.params
  await moduleService.deleteNodes([id])
  return res.status(204).send()
}
