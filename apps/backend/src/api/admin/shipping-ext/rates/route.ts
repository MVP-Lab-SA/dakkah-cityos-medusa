import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("shippingExtension") as any
    const filters: Record<string, any> = {}
    if (req.query.carrier_id) filters.carrier_id = req.query.carrier_id
    if (req.query.is_active !== undefined) filters.is_active = req.query.is_active === "true"
    const rates = await service.listShippingRates(filters)
    res.json({ rates: Array.isArray(rates) ? rates : [rates].filter(Boolean) })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
