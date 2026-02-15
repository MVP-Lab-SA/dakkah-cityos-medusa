import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("shippingExtension") as any
    const filters: Record<string, any> = {}
    if (req.query.is_active !== undefined) filters.is_active = req.query.is_active === "true"
    const carriers = await service.listCarrierConfigs(filters)
    res.json({ carriers: Array.isArray(carriers) ? carriers : [carriers].filter(Boolean) })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-SHIPPING-EXT-CARRIERS")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("shippingExtension") as any
    const carrier = await service.createCarrierConfigs(req.body)
    res.status(201).json({ carrier })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-SHIPPING-EXT-CARRIERS")}
}

