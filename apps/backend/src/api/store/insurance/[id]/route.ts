import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const financialProductService = req.scope.resolve("financialProduct") as any
    const { id } = req.params

    const item = await financialProductService.retrieveInsuranceProduct(id)
    if (!item) return res.status(404).json({ message: "Insurance item not found" })
    return res.json({ item })
  } catch (error: any) {
    return handleApiError(res, error, "STORE-INSURANCE-ID")
  }
}
