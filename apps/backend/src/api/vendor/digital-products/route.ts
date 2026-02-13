import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

const createSchema = z.object({
  product_id: z.string().min(1),
  title: z.string().min(1),
  file_url: z.string().min(1),
  file_type: z.enum(["pdf", "video", "audio", "image", "archive", "ebook", "software", "other"]),
  file_size_bytes: z.number().nullable().optional(),
  preview_url: z.string().nullable().optional(),
  version: z.string().optional(),
  max_downloads: z.number().optional(),
  is_active: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorId = (req as any).vendor_id
  if (!vendorId) {
    return res.status(401).json({ message: "Vendor authentication required" })
  }

  const mod = req.scope.resolve("digitalProduct") as any
  const { limit = "20", offset = "0" } = req.query as Record<string, string | undefined>

  const filters: Record<string, any> = { vendor_id: vendorId }

  const items = await mod.listDigitalAssets(filters, {
    skip: Number(offset),
    take: Number(limit),
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

  const mod = req.scope.resolve("digitalProduct") as any
  const validation = createSchema.safeParse(req.body)
  if (!validation.success) {
    return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
  }

  const item = await mod.createDigitalAssets({
    ...validation.data,
    vendor_id: vendorId,
  })

  return res.status(201).json({ item })
}
