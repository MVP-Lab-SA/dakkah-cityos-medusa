import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { subdomain } = req.params
  const storeModuleService = req.scope.resolve("cityosStoreService")

  try {
    const stores = await storeModuleService.listStores({
      subdomain,
      is_active: true,
    })

    if (!stores || stores.length === 0) {
      return res.status(404).json({
        message: `Store with subdomain '${subdomain}' not found`,
      })
    }

    res.json({ store: stores[0] })
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch store by subdomain",
      error: error.message,
    })
  }
}
