import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

/**
 * GET /store/bookings/:id
 * Get booking details
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const bookingModule = req.scope.resolve("booking") as any
  const { id } = req.params
  
  if (!req.auth_context?.actor_id) {
    return res.status(401).json({ message: "Authentication required" })
  }
  
  const customerId = req.auth_context.actor_id
  
  try {
    const booking = await bookingModule.retrieveBooking(id)
    
    // Verify ownership
    if (booking.customer_id !== customerId) {
      return res.status(403).json({ message: "Access denied" })
    }
    
    // Enrich with service and provider details
    let service = null
    let provider = null
    
    try {
      service = await bookingModule.retrieveServiceProduct(booking.service_product_id)
    } catch {}
    
    if (booking.provider_id) {
      try {
        provider = await bookingModule.retrieveServiceProvider(booking.provider_id)
      } catch {}
    }
    
    // Get booking items
    const items = await bookingModule.listBookingItems({ booking_id: id })
    const itemList = Array.isArray(items) ? items : [items].filter(Boolean)
    
    res.json({
      booking: {
        ...booking,
        service,
        provider,
        items: itemList,
      },
    })
  } catch (error: any) {
    res.status(404).json({
      message: "Booking not found",
      error: error.message,
    })
  }
}
