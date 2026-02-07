import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const { verification_code } = req.body
  
  const bookingService = req.scope.resolve("booking")
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    const { data: bookings } = await query.graph({
      entity: "booking",
      fields: ["*", "service.*", "customer.*"],
      filters: { id }
    })
    
    const booking = bookings?.[0]
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }
    
    if (booking.status !== "confirmed") {
      return res.status(400).json({ 
        message: "Booking must be confirmed before check-in" 
      })
    }
    
    // Verify booking is within check-in window
    const bookingTime = new Date(booking.scheduled_at)
    const now = new Date()
    
    // Check-in window: 30 minutes before to 15 minutes after appointment
    const checkInWindowStart = new Date(bookingTime.getTime() - 30 * 60 * 1000)
    const checkInWindowEnd = new Date(bookingTime.getTime() + 15 * 60 * 1000)
    
    if (now < checkInWindowStart) {
      const minutesUntilWindow = Math.ceil((checkInWindowStart.getTime() - now.getTime()) / (60 * 1000))
      return res.status(400).json({ 
        message: `Check-in opens ${minutesUntilWindow} minutes before your appointment`,
        check_in_opens_at: checkInWindowStart.toISOString()
      })
    }
    
    if (now > checkInWindowEnd) {
      return res.status(400).json({ 
        message: "Check-in window has closed. Please contact support.",
        check_in_closed_at: checkInWindowEnd.toISOString()
      })
    }
    
    // Optionally verify code if provided
    if (verification_code && booking.verification_code) {
      if (verification_code !== booking.verification_code) {
        return res.status(400).json({ message: "Invalid verification code" })
      }
    }
    
    const updated = await bookingService.updateBookings({
      id,
      status: "checked_in",
      checked_in_at: new Date(),
      metadata: {
        ...booking.metadata,
        check_in_time: new Date().toISOString(),
      }
    })
    
    const eventBus = req.scope.resolve("event_bus")
    await eventBus.emit("booking.checked_in", { 
      id,
      customer_id: booking.customer_id,
      service_id: booking.service_id
    })
    
    res.json({ 
      booking: updated,
      message: "Successfully checked in"
    })
  } catch (error: any) {
    console.error("[Booking Check-in] Error:", error)
    res.status(500).json({ message: error.message || "Failed to check in" })
  }
}
