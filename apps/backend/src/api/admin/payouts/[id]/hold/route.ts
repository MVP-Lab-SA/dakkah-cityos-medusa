import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const payoutService = req.scope.resolve("payoutModuleService") as any
  const { id } = req.params
  const { reason } = req.body as { reason?: string }
  
  const { data: [payout] } = await query.graph({
    entity: "payout",
    fields: ["*"],
    filters: { id },
  })
  
  if (!payout) {
    return res.status(404).json({ message: "Payout not found" })
  }
  
  if (payout.status !== "pending") {
    return res.status(400).json({ message: "Can only hold pending payouts" })
  }
  
  const updated = await payoutService.updatePayouts({
    id,
    status: "on_hold",
    notes: reason || "Put on hold by admin",
  })
  
  res.json({ 
    payout: updated,
    message: "Payout placed on hold" 
  })
}
