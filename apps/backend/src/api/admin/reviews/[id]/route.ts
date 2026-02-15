import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { handleApiError } from "../../../lib/api-error-handler"

// GET /admin/reviews/:id
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { id } = req.params
  
    const { data: reviews } = await query.graph({
      entity: "review",
      fields: ["*"],
      filters: { id },
    })
  
    if (!reviews.length) {
      return res.status(404).json({ message: "Review not found" })
    }
  
    res.json({ review: reviews[0] })

  } catch (error) {
    handleApiError(res, error, "GET admin reviews id")
  }
}

// DELETE /admin/reviews/:id
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const reviewModule = req.scope.resolve("review")
    const { id } = req.params
  
    await reviewModule.deleteReviews(id)
  
    res.json({ success: true })

  } catch (error) {
    handleApiError(res, error, "DELETE admin reviews id")
  }
}
