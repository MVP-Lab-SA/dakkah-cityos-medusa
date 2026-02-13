import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("inventoryExtension") as any
    const filters: Record<string, any> = {}
    if (req.query.status) filters.status = req.query.status
    if (req.query.product_id) filters.product_id = req.query.product_id
    const reservations = await service.listReservationHolds(filters)
    res.json({ reservations: Array.isArray(reservations) ? reservations : [reservations].filter(Boolean) })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
