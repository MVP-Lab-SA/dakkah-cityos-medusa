// @ts-nocheck
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

// GET - List subscription discount codes
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { status, plan_id, limit = 50 } = req.query as {
      status?: string
      plan_id?: string
      limit?: number
    }

    const query = req.scope.resolve("query")

    const filters: Record<string, any> = {}
    if (status) filters.status = status
    if (plan_id) filters.plan_id = plan_id

    const { data: discounts } = await query.graph({
      entity: "subscription_discount",
      fields: [
        "id",
        "code",
        "type",
        "value",
        "plan_id",
        "plan.name",
        "usage_limit",
        "usage_count",
        "valid_from",
        "valid_until",
        "status",
        "created_at"
      ],
      filters,
      pagination: { take: Number(limit) }
    })

    res.json({ discounts })

  } catch (error) {
    handleApiError(res, error, "GET admin subscriptions discounts")
  }
}

// POST - Create subscription discount code
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const {
      code,
      type,
      value,
      plan_id,
      usage_limit,
      valid_from,
      valid_until,
      first_payment_only,
      duration_months
    } = req.body as {
      code: string
      type: "percentage" | "fixed" | "trial_days"
      value: number
      plan_id?: string
      usage_limit?: number
      valid_from?: string
      valid_until?: string
      first_payment_only?: boolean
      duration_months?: number
    }

    const subscriptionService = req.scope.resolve("subscriptionModuleService")
    const query = req.scope.resolve("query")

    // Check if code already exists
    const { data: existing } = await query.graph({
      entity: "subscription_discount",
      fields: ["id"],
      filters: { code: code.toUpperCase() }
    })

    if (existing.length > 0) {
      return res.status(400).json({ message: "Discount code already exists" })
    }

    // Validate discount value
    if (type === "percentage" && (value < 0 || value > 100)) {
      return res.status(400).json({ message: "Percentage must be between 0 and 100" })
    }

    if (type === "trial_days" && value < 1) {
      return res.status(400).json({ message: "Trial days must be at least 1" })
    }

    const discount = await subscriptionService.createSubscriptionDiscounts({
      code: code.toUpperCase(),
      type,
      value,
      plan_id,
      usage_limit,
      usage_count: 0,
      valid_from: valid_from ? new Date(valid_from) : null,
      valid_until: valid_until ? new Date(valid_until) : null,
      first_payment_only: first_payment_only || false,
      duration_months,
      status: "active"
    })

    res.status(201).json({ discount })

  } catch (error) {
    handleApiError(res, error, "POST admin subscriptions discounts")
  }
}
