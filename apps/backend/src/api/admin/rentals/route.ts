import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

const createSchema = z.object({
  tenant_id: z.string(),
  product_id: z.string(),
  rental_type: z.enum(["daily", "weekly", "monthly", "hourly", "custom"]),
  base_price: z.number(),
  currency_code: z.string(),
  deposit_amount: z.number().optional(),
  late_fee_per_day: z.number().optional(),
  min_duration: z.number().optional(),
  max_duration: z.number().optional(),
  is_available: z.boolean().optional(),
  condition_on_listing: z.enum(["new", "like_new", "good", "fair"]).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("rental") as any
  const { limit = "20", offset = "0" } = req.query as Record<string, string | undefined>
  const items = await mod.listRentalProducts({}, { skip: Number(offset), take: Number(limit) })
  return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("rental") as any
  const validation = createSchema.safeParse(req.body)
  if (!validation.success) return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
  const item = await mod.createRentalProducts(validation.data)
  return res.status(201).json({ item })
}
