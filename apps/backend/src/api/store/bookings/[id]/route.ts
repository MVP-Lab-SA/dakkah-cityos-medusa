import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

/**
 * GET /store/bookings/:id
 * Get booking details
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const bookingModule = req.scope.resolve("booking") as any
  const { id } = req.params
  
  try {
    const booking = await bookingModule.retrieveBooking(id)
    
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
    return handleApiError(res, error, "STORE-BOOKINGS-ID")
  }
}

