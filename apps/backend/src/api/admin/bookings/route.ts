import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve("query")
  
    const { limit = 20, offset = 0, status, provider_id, from, to } = req.query as {
      limit?: number
      offset?: number
      status?: string
      provider_id?: string
      from?: string
      to?: string
    }
  
    const filters: Record<string, any> = {}
    if (status) filters.status = status
    if (provider_id) filters.provider_id = provider_id
    if (from) filters.starts_at = { $gte: from }
    if (to) filters.ends_at = { $lte: to }
  
    const { data: bookings, metadata } = await query.graph({
      entity: "booking",
      fields: [
        "id",
        "customer_id",
        "provider_id",
        "service_product_id",
        "order_id",
        "status",
        "starts_at",
        "ends_at",
        "timezone",
        "customer_name",
        "customer_email",
        "customer_phone",
        "notes",
        "internal_notes",
        "cancelled_at",
        "cancellation_reason",
        "confirmed_at",
        "completed_at",
        "created_at",
        "provider.name",
        "service_product.product_id",
      ],
      filters,
      pagination: { skip: Number(offset), take: Number(limit) },
    })
  
    res.json({
      bookings,
      count: metadata?.count || bookings.length,
      offset: Number(offset),
      limit: Number(limit),
    })

  } catch (error) {
    handleApiError(res, error, "GET admin bookings")
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const bookingModuleService = req.scope.resolve("bookingModuleService") as any
  
    const booking = await bookingModuleService.createBookings(req.body)
  
    res.status(201).json({ booking })

  } catch (error) {
    handleApiError(res, error, "POST admin bookings")
  }
}
