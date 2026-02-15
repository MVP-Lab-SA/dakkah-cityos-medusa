import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

// POST /admin/reviews/:id/approve
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const reviewModule = req.scope.resolve("review")
    const { id } = req.params
  
    const review = await reviewModule.updateReviews({
      id,
      is_approved: true,
    })
  
    res.json({ review })

  } catch (error) {
    handleApiError(res, error, "POST admin reviews id approve")
  }
}
