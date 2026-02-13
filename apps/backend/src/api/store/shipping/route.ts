import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("shippingExtension") as any
    const filters: Record<string, any> = { is_active: true }
    if (req.query.tenant_id) filters.tenant_id = req.query.tenant_id
    const carriers = await service.listCarrierConfigs(filters)
    res.json({ carriers: Array.isArray(carriers) ? carriers : [carriers].filter(Boolean) })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("shippingExtension") as any
    const { origin, destination, weight } = req.body as { origin: string; destination: string; weight: number }
    if (!origin || !destination || weight === undefined) {
      return res.status(400).json({ message: "origin, destination, and weight are required" })
    }
    const rates = await service.listShippingRates({ is_active: true })
    const rateList = Array.isArray(rates) ? rates : [rates].filter(Boolean)
    res.json({ rates: rateList, origin, destination, weight })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
