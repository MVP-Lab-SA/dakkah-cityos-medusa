// @ts-nocheck
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const tenantModule = req.scope.resolve("tenant") as any

  try {
    const {
      tenant_id,
      country_code,
      poi_type,
      is_active,
      lat,
      lng,
      radius_km,
      limit = "20",
      offset = "0",
      q,
    } = req.query as Record<string, string>

    const filters: Record<string, any> = {}

    if (tenant_id) filters.tenant_id = tenant_id
    if (country_code) filters.country_code = country_code
    if (poi_type) filters.poi_type = poi_type
    if (is_active !== undefined) filters.is_active = is_active === "true"

    let pois = await tenantModule.listTenantPois(filters, {
      take: parseInt(limit),
      skip: parseInt(offset),
      order: { is_primary: "DESC", name: "ASC" },
    })

    pois = Array.isArray(pois) ? pois : [pois].filter(Boolean)

    if (q) {
      const query = q.toLowerCase()
      pois = pois.filter(
        (poi: any) =>
          poi.name?.toLowerCase().includes(query) ||
          poi.city?.toLowerCase().includes(query) ||
          poi.address_line1?.toLowerCase().includes(query)
      )
    }

    const normalized = pois.map((poi: any) => ({
      ...poi,
      lat: poi.latitude,
      lng: poi.longitude,
    }))

    res.json({
      pois: normalized,
      count: normalized.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
    })
  } catch (error: any) {
    handleApiError(res, error, "STORE-CONTENT-POIS")}
}

