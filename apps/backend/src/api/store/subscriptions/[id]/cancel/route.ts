import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { handleApiError } from "../../../../../lib/api-error-handler"

// POST /store/subscriptions/:id/cancel - Customer cancels their subscription
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const subscriptionModule = req.scope.resolve("subscription") as any;
    const customerId = req.auth_context?.actor_id;
    const { id } = req.params;
  
    if (!customerId) {
      return res.status(401).json({ message: "Authentication required" });
    }
  
    const subscription = await subscriptionModule.retrieveSubscription(id);
  
    if (!subscription || subscription.customer_id !== customerId) {
      return res.status(404).json({ message: "Subscription not found" });
    }
  
    if (subscription.status === "canceled") {
      return res.status(400).json({ message: "Subscription already canceled" });
    }
  
    const updated = await subscriptionModule.updateSubscriptions({
      id,
      status: "canceled",
      canceled_at: new Date(),
    });
  
    res.json({ subscription: updated });

  } catch (error: any) {
    handleApiError(res, error, "POST store subscriptions id cancel")}
}

