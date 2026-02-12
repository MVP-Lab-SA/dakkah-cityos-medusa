// @ts-nocheck
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const tenantModule = req.scope.resolve("tenant") as any
  const { id } = req.params

  try {
    const [poi] = await tenantModule.listTenantPois({ id }, { take: 1 })

    if (!poi) {
      return res.status(404).json({ message: "POI not found" })
    }

    const normalized = {
      ...poi,
      lat: poi.latitude,
      lng: poi.longitude,
    }

    res.json({ poi: normalized })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch POI", error: error.message })
  }
}
