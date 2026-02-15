import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { handleApiError } from "../../../lib/api-error-handler"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const storeModuleService = req.scope.resolve("cityosStoreService") as any

  try {
    const stores = await storeModuleService.listStores({
      is_active: true,
    })

    res.json({ stores })
  } catch (error: any) {
    handleApiError(res, error, "STORE-STORES")
  }
}
