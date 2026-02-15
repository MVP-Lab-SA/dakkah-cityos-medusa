import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../../lib/api-error-handler"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const vendorModuleService = req.scope.resolve("vendorModuleService") as any
    const { id } = req.params
    const body = req.body as { reason?: string }
    const reason = body.reason || "No reason provided"
  
    const vendor = await vendorModuleService.rejectVendor(id, reason)
  
    res.json({ vendor })

  } catch (error: any) {
    handleApiError(res, error, "POST admin vendors id reject")}
}

