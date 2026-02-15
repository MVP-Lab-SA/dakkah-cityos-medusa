import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
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

  } catch (error) {
    handleApiError(res, error, "GET admin subscription-plans")
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const subscriptionModuleService = req.scope.resolve("subscriptionModuleService") as any
  
    const plan = await subscriptionModuleService.createSubscriptionPlans(req.body)
  
    res.status(201).json({ plan })

  } catch (error) {
    handleApiError(res, error, "POST admin subscription-plans")
  }
}
