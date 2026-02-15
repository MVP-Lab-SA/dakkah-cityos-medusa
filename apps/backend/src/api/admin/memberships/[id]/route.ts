import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { handleApiError } from "../../../../lib/api-error-handler"

const updateSchema = z.object({
  tier_id: z.string().optional(),
  status: z.enum(["active", "expired", "suspended", "cancelled"]).optional(),
  expires_at: z.string().nullable().optional(),
  renewed_at: z.string().nullable().optional(),
  auto_renew: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const moduleService = req.scope.resolve("membership") as any
    const { id } = req.params
    const [item] = await moduleService.listMemberships({ id }, { take: 1 })
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })

  } catch (error: any) {
    handleApiError(res, error, "GET admin memberships id")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const moduleService = req.scope.resolve("membership") as any
    const { id } = req.params
    const validation = updateSchema.safeParse(req.body)
    if (!validation.success) return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
    const item = await moduleService.updateMemberships({ id, ...validation.data })
    return res.json({ item })

  } catch (error: any) {
    handleApiError(res, error, "POST admin memberships id")}
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const moduleService = req.scope.resolve("membership") as any
    const { id } = req.params
    await moduleService.deleteMemberships([id])
    return res.status(204).send()

  } catch (error: any) {
    handleApiError(res, error, "DELETE admin memberships id")}
}

