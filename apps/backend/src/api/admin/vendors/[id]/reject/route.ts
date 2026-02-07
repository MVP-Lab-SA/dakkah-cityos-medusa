import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const vendorModuleService = req.scope.resolve("vendorModuleService") as any
  const { id } = req.params
  const body = req.body as { reason?: string }
  const reason = body.reason || "No reason provided"
  
  const vendor = await vendorModuleService.rejectVendor(id, reason)
  
  res.json({ vendor })
}
