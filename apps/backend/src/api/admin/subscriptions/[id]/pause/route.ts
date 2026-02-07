import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const subscriptionService = req.scope.resolve("subscriptionModuleService") as any
  const { id } = req.params
  const { reason, resume_date } = req.body as {
    reason?: string
    resume_date?: string
  }
  
  const { data: [subscription] } = await query.graph({
    entity: "subscription",
    fields: ["*"],
    filters: { id },
  })
  
  if (!subscription) {
    return res.status(404).json({ message: "Subscription not found" })
  }
  
  if (subscription.status !== "active") {
    return res.status(400).json({ message: "Can only pause active subscriptions" })
  }
  
  const updated = await subscriptionService.updateSubscriptions({
    id,
    status: "paused",
    paused_at: new Date(),
    metadata: {
      ...subscription.metadata,
      pause_reason: reason || "Paused by admin",
      paused_by: "admin",
      scheduled_resume_date: resume_date,
    },
  })
  
  res.json({
    subscription: updated,
    message: "Subscription paused",
  })
}
