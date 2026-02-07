import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * POST /store/bookings/:id/cancel
 * Cancel a booking
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const bookingModule = req.scope.resolve("booking") as any
  const { id } = req.params
  
  if (!req.auth_context?.actor_id) {
    return res.status(401).json({ message: "Authentication required" })
  }
  
  const customerId = req.auth_context.actor_id
  const { reason } = req.body as Record<string, any>
  
  try {
    const booking = await bookingModule.retrieveBooking(id)
    
    // Verify ownership
    if (booking.customer_id !== customerId) {
      return res.status(403).json({ message: "Access denied" })
    }
    
    // Cancel the booking
    const cancelledBooking = await bookingModule.cancelBooking(id, "customer", reason)
    
    res.json({
      booking: cancelledBooking,
      message: "Booking cancelled successfully",
    })
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to cancel booking",
    })
  }
}
