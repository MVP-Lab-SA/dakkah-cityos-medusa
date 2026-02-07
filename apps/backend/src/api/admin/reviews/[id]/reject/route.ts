import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST /admin/reviews/:id/reject
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const reviewModule = req.scope.resolve("review")
  const { id } = req.params
  
  const review = await reviewModule.updateReviews({
    id,
    is_approved: false,
  })
  
  res.json({ review })
}
