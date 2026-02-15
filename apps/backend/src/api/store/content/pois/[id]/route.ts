// @ts-nocheck
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../../lib/api-error-handler"

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
    handleApiError(res, error, "STORE-CONTENT-POIS-ID")}
}

