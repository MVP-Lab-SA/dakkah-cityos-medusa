import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { handleApiError } from "../../../lib/api-error-handler"

const createSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  product_id: z.string(),
  customer_id: z.string(),
  trial_duration_days: z.number(),
  deposit_amount: z.number().optional(),
  status: z.enum(["active", "returned", "purchased", "overdue"]).optional(),
  tenant_id: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("tryBeforeYouBuy") as any
    const { limit = "20", offset = "0" } = req.query as Record<string, string | undefined>
    const items = await mod.listTrials({}, { skip: Number(offset), take: Number(limit) })
    return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })

  } catch (error: any) {
    handleApiError(res, error, "GET admin try-before-you-buy")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("tryBeforeYouBuy") as any
    const validation = createSchema.safeParse(req.body)
    if (!validation.success) return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
    const item = await mod.createTrials(validation.data)
    return res.status(201).json({ item })

  } catch (error: any) {
    handleApiError(res, error, "POST admin try-before-you-buy")}
}
