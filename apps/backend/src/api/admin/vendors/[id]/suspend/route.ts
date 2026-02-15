// @ts-nocheck
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { handleApiError } from "../../../../../lib/api-error-handler"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const { reason } = req.body
  const vendorService = req.scope.resolve("vendor")
  const eventBus = req.scope.resolve("event_bus")
  
  try {
    const vendor = await vendorService.updateVendors({
      id,
      status: "suspended",
      suspended_at: new Date(),
      suspended_by: req.auth_context?.actor_id,
      suspension_reason: reason,
      metadata: {
        suspension_reason: reason,
        suspended_at: new Date().toISOString()
      }
    })
    
    await eventBus.emit("vendor.suspended", { id, reason })
    
    res.json({ vendor })
  } catch (error: any) {
    handleApiError(res, error, "ADMIN-VENDORS-ID-SUSPEND")
  }
}
