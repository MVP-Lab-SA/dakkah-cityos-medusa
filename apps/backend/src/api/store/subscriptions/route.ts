import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("subscription") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      status,
      billing_interval,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (status) filters.status = status
    if (billing_interval) filters.billing_interval = billing_interval
    if (search) filters.search = search

    const customerId = req.auth_context?.actor_id
    if (customerId) {
      filters.customer_id = customerId
    }

    const [items, count] = await mod.listAndCountSubscriptions(filters, { skip: Number(offset), take: Number(limit) }).catch(() => [
      mod.listSubscriptions(filters, { skip: Number(offset), take: Number(limit) }).then((r: any) => [r, Array.isArray(r) ? r.length : 0]),
    ].flat())
    return res.json({
      items: Array.isArray(items) ? items : [],
      count: typeof count === "number" ? count : 0,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    handleApiError(res, error, "STORE-SUBSCRIPTIONS")}
}

