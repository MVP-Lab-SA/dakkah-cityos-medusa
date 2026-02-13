import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  goal_amount: z.number().nullable().optional(),
  currency_code: z.string().min(1),
  status: z.enum(["draft", "active", "completed", "cancelled"]).optional(),
  campaign_type: z.enum(["one_time", "recurring", "emergency", "matching"]),
  starts_at: z.string().nullable().optional(),
  ends_at: z.string().nullable().optional(),
  images: z.any().nullable().optional(),
  updates: z.any().nullable().optional(),
  is_featured: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorId = (req as any).vendor_id
  if (!vendorId) {
    return res.status(401).json({ message: "Vendor authentication required" })
  }

  const mod = req.scope.resolve("charity") as any
  const { limit = "20", offset = "0", status } = req.query as Record<string, string | undefined>

  const filters: Record<string, any> = { charity_id: vendorId }
  if (status) filters.status = status

  const items = await mod.listDonationCampaigns(filters, {
    skip: Number(offset),
    take: Number(limit),
    order: { created_at: "DESC" },
  })

  return res.json({
    items,
    count: Array.isArray(items) ? items.length : 0,
    limit: Number(limit),
    offset: Number(offset),
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const vendorId = (req as any).vendor_id
  if (!vendorId) {
    return res.status(401).json({ message: "Vendor authentication required" })
  }

  const mod = req.scope.resolve("charity") as any
  const validation = createSchema.safeParse(req.body)
  if (!validation.success) {
    return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
  }

  const item = await mod.createDonationCampaigns({
    ...validation.data,
    charity_id: vendorId,
  })

  return res.status(201).json({ item })
}
