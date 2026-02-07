import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const payoutService = req.scope.resolve("payoutModuleService") as any
  const { id } = req.params
  
  const { data: [payout] } = await query.graph({
    entity: "payout",
    fields: ["*"],
    filters: { id },
  })
  
  if (!payout) {
    return res.status(404).json({ message: "Payout not found" })
  }
  
  if (payout.status !== "on_hold") {
    return res.status(400).json({ message: "Can only release payouts that are on hold" })
  }
  
  const updated = await payoutService.updatePayouts({
    id,
    status: "pending",
    notes: `Released from hold at ${new Date().toISOString()}`,
  })
  
  res.json({ 
    payout: updated,
    message: "Payout released and queued for processing" 
  })
}
