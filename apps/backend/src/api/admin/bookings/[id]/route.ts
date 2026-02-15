import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve("query")
    const { id } = req.params
  
    const { data: [booking] } = await query.graph({
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
        "updated_at",
        "provider.*",
        "service_product.*",
        "items.*",
        "reminders.*",
      ],
      filters: { id },
    })
  
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }
  
    res.json({ booking })

  } catch (error: any) {
    handleApiError(res, error, "GET admin bookings id")}
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  try {
    const bookingModuleService = req.scope.resolve("bookingModuleService") as any
    const { id } = req.params
    const body = req.body as Record<string, unknown>
  
    const booking = await bookingModuleService.updateBookings({ id, ...body })
  
    res.json({ booking })

  } catch (error: any) {
    handleApiError(res, error, "PUT admin bookings id")}
}

