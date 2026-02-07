import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const companyModuleService = req.scope.resolve("companyModuleService") as any
  const { id } = req.params
  const body = req.body as { reason?: string }
  const reason = body.reason || "No reason provided"
  const userId = (req as any).auth_context?.actor_id || "system"
  
  const purchase_order = await companyModuleService.rejectPurchaseOrder(id, userId, reason)
  
  res.json({ purchase_order })
}
