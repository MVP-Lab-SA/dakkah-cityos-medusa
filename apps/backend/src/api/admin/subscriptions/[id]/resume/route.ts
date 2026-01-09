import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

// POST /admin/subscriptions/:id/resume - Resume paused subscription
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionModule = req.scope.resolve("subscription");
  const tenantId = req.tenant?.id;
  const { id } = req.params;
  
  if (!tenantId) {
    return res.status(403).json({ message: "Tenant context required" });
  }
  
  const subscription = await subscriptionModule.retrieveSubscription(id);
  
  if (!subscription || subscription.tenant_id !== tenantId) {
    return res.status(404).json({ message: "Subscription not found" });
  }
  
  if (subscription.status !== "paused") {
    return res.status(400).json({ message: "Can only resume paused subscriptions" });
  }
  
  const updated = await subscriptionModule.updateSubscriptions(id, {
    status: "active",
  });
  
  res.json({ subscription: updated });
}
