import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const reviewService = req.scope.resolve("review")
  const eventBus = req.scope.resolve("event_bus")
  
  try {
    const review = await reviewService.updateReviews({
      id,
      is_approved: true,
      approved_at: new Date(),
      approved_by: req.auth_context?.actor_id
    })
    
    await eventBus.emit("review.approved", { id })
    
    res.json({ review })
  } catch (error: any) {
    console.error("[Admin Review Approve] Error:", error)
    res.status(500).json({ message: error.message || "Failed to approve review" })
  }
}
