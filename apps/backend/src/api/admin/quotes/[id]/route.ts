import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { id } = req.params
  
  const { data: [quote] } = await query.graph({
    entity: "quote",
    fields: [
      "id",
      "customer_id",
      "company_id",
      "status",
      "quote_number",
      "valid_until",
      "sent_at",
      "viewed_at",
      "accepted_at",
      "rejected_at",
      "rejection_reason",
      "converted_order_id",
      "subtotal",
      "tax_total",
      "shipping_total",
      "discount_total",
      "total",
      "currency_code",
      "notes",
      "internal_notes",
      "created_at",
      "updated_at",
      "items.*",
      "company.*",
    ],
    filters: { id },
  })
  
  if (!quote) {
    return res.status(404).json({ message: "Quote not found" })
  }
  
  res.json({ quote })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const quoteModuleService = req.scope.resolve("quoteModuleService") as any
  const { id } = req.params
  const body = req.body as Record<string, unknown>
  
  const quote = await quoteModuleService.updateQuotes({ id, ...body })
  
  res.json({ quote })
}
