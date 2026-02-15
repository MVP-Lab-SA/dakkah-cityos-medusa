import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const notifService = req.scope.resolve("notificationPreferences") as any
    const { id } = req.params
    const item = await notifService.retrievePreference(id)
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return res.status(404).json({ message: "Newsletter subscription not found" })
    }
    handleApiError(res, error, "STORE-NEWSLETTER-ID")
  }
}
