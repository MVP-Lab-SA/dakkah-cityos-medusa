import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

// GET /store/subscriptions/me - List customer's subscriptions
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionModule = req.scope.resolve("subscription") as any;
  const customerId = req.auth_context?.actor_id;
  
  if (!customerId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const { offset = 0, limit = 20, status } = req.query;
  
  const filters: any = { customer_id: customerId };
  if (status) filters.status = status;
  
  const subscriptions = await subscriptionModule.listSubscriptions(filters, {
    skip: Number(offset),
    take: Number(limit),
    order: { created_at: "DESC" },
  });
  
  res.json({
    subscriptions,
    count: Array.isArray(subscriptions) ? subscriptions.length : 0,
    offset: Number(offset),
    limit: Number(limit),
  });
}
