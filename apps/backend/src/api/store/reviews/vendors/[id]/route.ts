import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../../lib/api-error-handler"

// GET /store/reviews/vendors/:id - Get reviews for a vendor
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const reviewService = req.scope.resolve("review")
  const { id } = req.params
  const { limit = "10", offset = "0" } = req.query as {
    limit?: string
    offset?: string
  }

  try {
    const reviews = await reviewService.listVendorReviews(id, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      approved_only: true,
    })

    res.json({
      reviews,
      count: reviews.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
    })
  } catch (error: any) {
    handleApiError(res, error, "STORE-REVIEWS-VENDORS-ID")}
}

