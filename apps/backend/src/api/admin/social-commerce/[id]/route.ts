import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { handleApiError } from "../../../lib/api-error-handler"

const updateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["scheduled", "live", "ended", "cancelled"]).optional(),
  stream_url: z.string().optional(),
  platform: z.enum(["internal", "instagram", "tiktok", "youtube", "facebook"]).optional(),
  scheduled_at: z.string().optional(),
  thumbnail_url: z.string().optional(),
  recording_url: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("socialCommerce") as any
    const { id } = req.params
    const [item] = await mod.listLiveStreams({ id }, { take: 1 })
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })

  } catch (error) {
    handleApiError(res, error, "GET admin social-commerce id")
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("socialCommerce") as any
    const { id } = req.params
    const validation = updateSchema.safeParse(req.body)
    if (!validation.success) return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
    const item = await mod.updateLiveStreams({ id, ...validation.data })
    return res.json({ item })

  } catch (error) {
    handleApiError(res, error, "POST admin social-commerce id")
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("socialCommerce") as any
    const { id } = req.params
    await mod.deleteLiveStreams([id])
    return res.status(204).send()

  } catch (error) {
    handleApiError(res, error, "DELETE admin social-commerce id")
  }
}
