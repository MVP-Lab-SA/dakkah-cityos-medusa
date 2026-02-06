import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const storeModuleService = req.scope.resolve("cityosStoreService") as any

  try {
    const stores = await storeModuleService.listStores({
      is_active: true,
    })

    res.json({ stores })
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch stores",
      error: error.message,
    })
  }
}
