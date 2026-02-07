import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * POST /store/bookings/:id/reschedule
 * Reschedule a booking
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const bookingModule = req.scope.resolve("booking") as any
  const { id } = req.params
  
  if (!req.auth_context?.actor_id) {
    return res.status(401).json({ message: "Authentication required" })
  }
  
  const customerId = req.auth_context.actor_id
  const { new_start_time, new_provider_id } = req.body as Record<string, any>
  
  if (!new_start_time) {
    return res.status(400).json({ message: "new_start_time is required" })
  }
  
  try {
    const booking = await bookingModule.retrieveBooking(id)
    
    // Verify ownership
    if (booking.customer_id !== customerId) {
      return res.status(403).json({ message: "Access denied" })
    }
    
    // Reschedule the booking
    const newBooking = await bookingModule.rescheduleBooking(
      id,
      new Date(new_start_time),
      new_provider_id
    )
    
    // Enrich with service details
    const service = await bookingModule.retrieveServiceProduct(newBooking.service_product_id)
    
    res.json({
      booking: { ...newBooking, service },
      message: "Booking rescheduled successfully",
    })
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to reschedule booking",
    })
  }
}
