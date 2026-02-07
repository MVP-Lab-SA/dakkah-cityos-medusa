import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    const { data: reviews } = await query.graph({
      entity: "review",
      fields: ["*", "customer.*", "product.*", "vendor.*"],
      filters: { id }
    })
    
    if (!reviews?.[0]) {
      return res.status(404).json({ message: "Review not found" })
    }
    
    res.json({ review: reviews[0] })
  } catch (error: any) {
    console.error("[Admin Review GET] Error:", error)
    res.status(500).json({ message: error.message || "Failed to fetch review" })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const reviewService = req.scope.resolve("review")
  
  try {
    await reviewService.deleteReviews(id)
    res.status(200).json({ id, deleted: true })
  } catch (error: any) {
    console.error("[Admin Review DELETE] Error:", error)
    res.status(500).json({ message: error.message || "Failed to delete review" })
  }
}
