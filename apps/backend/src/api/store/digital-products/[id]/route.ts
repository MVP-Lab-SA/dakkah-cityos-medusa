import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("digitalProduct") as any
    const { id } = req.params
    const item = await mod.retrieveDigitalAsset(id)
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return handleApiError(res, error, "STORE-DIGITAL-PRODUCTS-ID")}
    handleApiError(res, error, "STORE-DIGITAL-PRODUCTS-ID")
  }
}

