import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { domain } = req.params
  const storeModuleService = req.scope.resolve("cityosStoreService") as any

  try {
    const stores = await storeModuleService.listStores({
      custom_domain: domain,
      is_active: true,
    })

    if (!stores || stores.length === 0) {
      return res.status(404).json({
        message: `Store with domain '${domain}' not found`,
      })
    }

    res.json({ store: stores[0] })
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch store by domain",
      error: error.message,
    })
  }
}
