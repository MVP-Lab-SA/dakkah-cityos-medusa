import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../../lib/api-error-handler"

// POST /admin/quotes/:id/reject
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const quoteModule = req.scope.resolve("quote")
    const { id } = req.params
  
    const { rejection_reason, internal_notes } = req.body as {
      rejection_reason?: string
      internal_notes?: string
    }
  
    const quote = await quoteModule.updateQuotes({
      id,
      status: "rejected",
      reviewed_at: new Date(),
      rejection_reason,
      internal_notes,
    })
  
    res.json({ quote })

  } catch (error) {
    handleApiError(res, error, "POST admin quotes id reject")
  }
}
