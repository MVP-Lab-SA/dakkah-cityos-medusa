import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("notificationPreferencesModuleService") as any
    const customerId = req.auth_context?.actor_id || (req.query.customer_id as string)
    if (!customerId) {
      return res.status(401).json({ message: "Authentication required" })
    }
    const filters: Record<string, any> = { customer_id: customerId }
    if (req.query.tenant_id) filters.tenant_id = req.query.tenant_id
    const items = await service.listNotificationPreferences(filters)
    res.json({ items, count: Array.isArray(items) ? items.length : 0 })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("notificationPreferencesModuleService") as any
    const customerId = req.auth_context?.actor_id
    if (!customerId) {
      return res.status(401).json({ message: "Authentication required" })
    }
    const item = await service.createNotificationPreferences({ ...req.body, customer_id: customerId })
    res.status(201).json({ item })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
