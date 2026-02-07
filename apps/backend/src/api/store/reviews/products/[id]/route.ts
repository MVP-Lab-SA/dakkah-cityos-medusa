import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET /store/reviews/products/:id - Get reviews for a product
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const reviewService = req.scope.resolve("review")
  const { id } = req.params
  const { limit = "10", offset = "0" } = req.query as {
    limit?: string
    offset?: string
  }

  try {
    const reviews = await reviewService.listProductReviews(id, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      approved_only: true,
    })

    const summary = await reviewService.getProductRatingSummary(id)

    res.json({
      reviews,
      summary,
      count: reviews.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
