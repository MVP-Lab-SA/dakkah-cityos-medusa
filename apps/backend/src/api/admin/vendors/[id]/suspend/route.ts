import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

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
    console.error("[Admin Vendor Suspend] Error:", error)
    res.status(500).json({ message: error.message || "Failed to suspend vendor" })
  }
}
