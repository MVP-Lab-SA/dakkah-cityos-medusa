import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const vendorService = req.scope.resolve("vendor")
  const eventBus = req.scope.resolve("event_bus")
  
  try {
    const vendor = await vendorService.updateVendors({
      id,
      status: "active",
      suspended_at: null,
      suspended_by: null,
      suspension_reason: null,
      metadata: {
        reinstated_at: new Date().toISOString(),
        reinstated_by: req.auth_context?.actor_id
      }
    })
    
    await eventBus.emit("vendor.reinstated", { id })
    
    res.json({ vendor })
  } catch (error: any) {
    console.error("[Admin Vendor Reinstate] Error:", error)
    res.status(500).json({ message: error.message || "Failed to reinstate vendor" })
  }
}
