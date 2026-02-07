import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST /store/reviews/:id/helpful - Mark a review as helpful
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const reviewService = req.scope.resolve("review")
  const { id } = req.params

  try {
    await reviewService.markHelpful(id)
    res.json({ success: true })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
