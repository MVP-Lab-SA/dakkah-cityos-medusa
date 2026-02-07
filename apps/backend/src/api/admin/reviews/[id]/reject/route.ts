import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const { reason } = req.body
  const reviewService = req.scope.resolve("review")
  const eventBus = req.scope.resolve("event_bus")
  
  try {
    const review = await reviewService.updateReviews({
      id,
      is_approved: false,
      rejected_at: new Date(),
      rejected_by: req.auth_context?.actor_id,
      rejection_reason: reason
    })
    
    await eventBus.emit("review.rejected", { id, reason })
    
    res.json({ review })
  } catch (error: any) {
    console.error("[Admin Review Reject] Error:", error)
    res.status(500).json({ message: error.message || "Failed to reject review" })
  }
}
