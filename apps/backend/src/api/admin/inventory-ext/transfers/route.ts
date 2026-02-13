import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("inventoryExtension") as any
    const filters: Record<string, any> = {}
    if (req.query.status) filters.status = req.query.status
    const transfers = await service.listWarehouseTransfers(filters)
    res.json({ transfers: Array.isArray(transfers) ? transfers : [transfers].filter(Boolean) })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
