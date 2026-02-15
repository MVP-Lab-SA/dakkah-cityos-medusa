// @ts-nocheck
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

// GET - Get subscription discount by ID
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { id } = req.params
    const query = req.scope.resolve("query")

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
        "first_payment_only",
        "duration_months",
        "status",
        "created_at",
        "updated_at"
      ],
      filters: { id }
    })

    if (!discounts.length) {
      return res.status(404).json({ message: "Discount not found" })
    }

    res.json({ discount: discounts[0] })

  } catch (error) {
    handleApiError(res, error, "GET admin subscriptions discounts id")
  }
}

// PUT - Update subscription discount
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { id } = req.params
    const {
      usage_limit,
      valid_from,
      valid_until,
      status
    } = req.body as {
      usage_limit?: number
      valid_from?: string
      valid_until?: string
      status?: "active" | "disabled"
    }

    const subscriptionService = req.scope.resolve("subscriptionModuleService")

    await subscriptionService.updateSubscriptionDiscounts({
      selector: { id },
      data: {
        ...(usage_limit !== undefined && { usage_limit }),
        ...(valid_from && { valid_from: new Date(valid_from) }),
        ...(valid_until && { valid_until: new Date(valid_until) }),
        ...(status && { status })
      }
    })

    const query = req.scope.resolve("query")
    const { data: discounts } = await query.graph({
      entity: "subscription_discount",
      fields: ["id", "code", "type", "value", "usage_limit", "usage_count", "status"],
      filters: { id }
    })

    res.json({ discount: discounts[0] })

  } catch (error) {
    handleApiError(res, error, "PUT admin subscriptions discounts id")
  }
}

// DELETE - Delete subscription discount
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { id } = req.params
    const subscriptionService = req.scope.resolve("subscriptionModuleService")

    await subscriptionService.deleteSubscriptionDiscounts(id)

    res.json({ message: "Discount deleted", id })

  } catch (error) {
    handleApiError(res, error, "DELETE admin subscriptions discounts id")
  }
}
