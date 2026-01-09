import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

// GET /store/subscriptions/me - List customer's subscriptions
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionModule = req.scope.resolve("subscription");
  const customerId = req.auth?.actor_id;
  
  if (!customerId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const { offset = 0, limit = 20, status } = req.query;
  
  const filters: any = { customer_id: customerId };
  if (status) filters.status = status;
  
  const [subscriptions, count] = await subscriptionModule.listAndCountSubscriptions(filters, {
    skip: Number(offset),
    take: Number(limit),
    relations: ["subscription_items"],
    order: { created_at: "DESC" },
  });
  
  res.json({
    subscriptions,
    count,
    offset: Number(offset),
    limit: Number(limit),
  });
}
