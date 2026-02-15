import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("petService") as any
    const { id } = req.params
    const item = await mod.retrievePetProfile(id)
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return res.status(404).json({ message: "Pet profile not found" })
    }
    handleApiError(res, error, "STORE-PET-SERVICES-ID")
  }
}
