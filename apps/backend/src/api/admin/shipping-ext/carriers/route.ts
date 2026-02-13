import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("shippingExtension") as any
    const filters: Record<string, any> = {}
    if (req.query.is_active !== undefined) filters.is_active = req.query.is_active === "true"
    const carriers = await service.listCarrierConfigs(filters)
    res.json({ carriers: Array.isArray(carriers) ? carriers : [carriers].filter(Boolean) })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("shippingExtension") as any
    const carrier = await service.createCarrierConfigs(req.body)
    res.status(201).json({ carrier })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
