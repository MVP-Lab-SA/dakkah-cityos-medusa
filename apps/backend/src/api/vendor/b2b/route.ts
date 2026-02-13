import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

const createSchema = z.object({
  company_id: z.string().optional(),
  customer_id: z.string().optional(),
  currency_code: z.string().min(1),
  customer_notes: z.string().optional(),
  internal_notes: z.string().optional(),
  valid_from: z.string().optional(),
  valid_until: z.string().optional(),
  custom_discount_percentage: z.number().optional(),
  custom_discount_amount: z.number().optional(),
  discount_reason: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorId = (req as any).vendor_id
  if (!vendorId) {
    return res.status(401).json({ message: "Vendor authentication required" })
  }

  const mod = req.scope.resolve("quote") as any
  const { limit = "20", offset = "0", status } = req.query as Record<string, string | undefined>

  const filters: Record<string, any> = { supplier_id: vendorId }
  if (status) filters.status = status

  const items = await mod.listQuotes(filters, {
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

  const mod = req.scope.resolve("quote") as any
  const validation = createSchema.safeParse(req.body)
  if (!validation.success) {
    return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
  }

  const quoteNumber = await mod.generateQuoteNumber()

  const item = await mod.createQuotes({
    ...validation.data,
    supplier_id: vendorId,
    quote_number: quoteNumber,
    status: "draft",
  })

  return res.status(201).json({ item })
}
