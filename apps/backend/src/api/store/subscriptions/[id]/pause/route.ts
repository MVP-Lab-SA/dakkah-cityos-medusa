import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const customerId = req.auth_context?.actor_id
  
  if (!customerId) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const subscriptionService = req.scope.resolve("subscription")
  
  try {
    // Verify ownership
    const { data: subscriptions } = await query.graph({
      entity: "subscription",
      fields: ["*"],
      filters: { id, customer_id: customerId }
    })
    
    const subscription = subscriptions?.[0]
    
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" })
    }
    
    if (subscription.status !== "active") {
      return res.status(400).json({ message: "Only active subscriptions can be paused" })
    }
    
    const updated = await subscriptionService.updateSubscriptions({
      id,
      status: "paused",
      paused_at: new Date(),
      metadata: {
        ...subscription.metadata,
        pause_reason: req.body.reason || "customer_requested",
        paused_by: customerId,
      }
    })
    
    // Emit event for notifications
    const eventBus = req.scope.resolve("event_bus")
    await eventBus.emit("subscription.paused", { 
      id, 
      customer_id: customerId,
      reason: req.body.reason 
    })
    
    res.json({ subscription: updated })
  } catch (error: any) {
    console.error("[Subscription Pause] Error:", error)
    res.status(500).json({ message: error.message || "Failed to pause subscription" })
  }
}
