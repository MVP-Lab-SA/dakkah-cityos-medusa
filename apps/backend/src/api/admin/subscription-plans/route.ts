import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  
  const { data: plans } = await query.graph({
    entity: "subscription_plan",
    fields: [
      "id",
      "name",
      "handle",
      "description",
      "billing_interval",
      "billing_interval_count",
      "price",
      "currency_code",
      "trial_days",
      "setup_fee",
      "is_active",
      "sort_order",
      "features",
      "metadata",
      "created_at",
    ],
  })
  
  res.json({ plans })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const subscriptionModuleService = req.scope.resolve("subscriptionModuleService") as any
  
  const plan = await subscriptionModuleService.createSubscriptionPlans(req.body)
  
  res.status(201).json({ plan })
}
