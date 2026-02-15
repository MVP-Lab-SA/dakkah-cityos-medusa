import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { handleApiError } from "../../../../lib/api-error-handler"

const updateSchema = z.object({
  title: z.string().optional(),
  subject: z.string().optional(),
  body: z.string().optional(),
  audience_segment: z.string().optional(),
  scheduled_at: z.string().optional(),
  sent_at: z.string().optional(),
  status: z.enum(["draft", "scheduled", "sent", "cancelled"]).optional(),
  tenant_id: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("newsletter") as any
    const { id } = req.params
    const [item] = await mod.listNewsletters({ id }, { take: 1 })
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })

  } catch (error: any) {
    handleApiError(res, error, "GET admin newsletter id")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("newsletter") as any
    const { id } = req.params
    const validation = updateSchema.safeParse(req.body)
    if (!validation.success) return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
    const item = await mod.updateNewsletters({ id, ...validation.data })
    return res.json({ item })

  } catch (error: any) {
    handleApiError(res, error, "POST admin newsletter id")}
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("newsletter") as any
    const { id } = req.params
    await mod.deleteNewsletters([id])
    return res.status(204).send()

  } catch (error: any) {
    handleApiError(res, error, "DELETE admin newsletter id")}
}
