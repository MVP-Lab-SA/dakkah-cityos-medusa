import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const companyModuleService = req.scope.resolve("companyModuleService") as any
  const { id } = req.params
  const userId = (req as any).auth_context?.actor_id || "system"
  
  const purchase_order = await companyModuleService.approvePurchaseOrder(id, userId)
  
  res.json({ purchase_order })
}
