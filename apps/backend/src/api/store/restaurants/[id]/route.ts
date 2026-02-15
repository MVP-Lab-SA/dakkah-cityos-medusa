import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("restaurant") as any
    const { id } = req.params
    const restaurant = await mod.retrieveRestaurant(id)
    if (!restaurant) return res.status(404).json({ message: "Not found" })
    const menus = await mod.listMenus({ restaurant_id: id }, { take: 10 })
    return res.json({ item: { ...restaurant, menus } })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return handleApiError(res, error, "STORE-RESTAURANTS-ID")}
    handleApiError(res, error, "STORE-RESTAURANTS-ID")
  }
}

