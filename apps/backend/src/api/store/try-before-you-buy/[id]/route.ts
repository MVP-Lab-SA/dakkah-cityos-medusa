import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const vendorService = req.scope.resolve("vendor") as any
    const { id } = req.params
    const item = await vendorService.retrieveVendorProduct(id)
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return handleApiError(res, error, "STORE-TRY-BEFORE-YOU-BUY-ID")}
    handleApiError(res, error, "STORE-TRY-BEFORE-YOU-BUY-ID")
  }
}

