import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

// POST /admin/quotes/:id/approve
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const quoteModule = req.scope.resolve("quote")
    const { id } = req.params
  
    const { 
      quoted_price,
      custom_discount_percentage,
      custom_discount_amount,
      discount_reason,
      valid_until,
      internal_notes,
    } = req.body as {
      quoted_price?: number
      custom_discount_percentage?: number
      custom_discount_amount?: number
      discount_reason?: string
      valid_until?: string
      internal_notes?: string
    }
  
    // Set default validity of 30 days if not provided
    const defaultValidUntil = new Date()
    defaultValidUntil.setDate(defaultValidUntil.getDate() + 30)
  
    const quote = await quoteModule.updateQuotes({
      id,
      status: "approved",
      reviewed_at: new Date(),
      valid_from: new Date(),
      valid_until: valid_until ? new Date(valid_until) : defaultValidUntil,
      custom_discount_percentage,
      custom_discount_amount: custom_discount_amount || quoted_price,
      discount_reason,
      internal_notes,
    })
  
    res.json({ quote })

  } catch (error) {
    handleApiError(res, error, "POST admin quotes id approve")
  }
}
