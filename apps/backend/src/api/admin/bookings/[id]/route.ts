import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
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
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const bookingModuleService = req.scope.resolve("bookingModuleService") as any
  const { id } = req.params
  const body = req.body as Record<string, unknown>
  
  const booking = await bookingModuleService.updateBookings({ id, ...body })
  
  res.json({ booking })
}
