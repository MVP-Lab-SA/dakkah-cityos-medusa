// @ts-nocheck
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const payoutService = req.scope.resolve("payout")
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const eventBus = req.scope.resolve("event_bus")
  
  try {
    // Get payout with vendor details
    const { data: payouts } = await query.graph({
      entity: "payout",
      fields: ["*", "vendor.*"],
      filters: { id }
    })
    
    const payout = payouts?.[0]
    
    if (!payout) {
      return res.status(404).json({ message: "Payout not found" })
    }
    
    if (!["pending", "on_hold"].includes(payout.status)) {
      return res.status(400).json({ message: `Cannot process payout in ${payout.status} status` })
    }
    
    const vendor = payout.vendor
    
    if (!vendor?.stripe_account_id) {
      return res.status(400).json({ message: "Vendor has no connected Stripe account" })
    }
    
    // Process the payout
    const processedPayout = await payoutService.processStripeConnectPayout(
      id, 
      vendor.stripe_account_id
    )
    
    await eventBus.emit("payout.completed", {
      id,
      vendor_id: payout.vendor_id,
      amount: payout.net_amount
    })
    
    res.json({ payout: processedPayout })
  } catch (error: any) {
    console.error("[Admin Payout Process] Error:", error)
    res.status(500).json({ message: error.message || "Failed to process payout" })
  }
}
