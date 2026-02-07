import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST - Admin reschedule booking
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const { 
    new_scheduled_at, 
    new_provider_id,
    notify_customer,
    reason 
  } = req.body as { 
    new_scheduled_at: string
    new_provider_id?: string
    notify_customer?: boolean
    reason?: string
  }

  const query = req.scope.resolve("query")
  const bookingService = req.scope.resolve("bookingModuleService")

  const { data: bookings } = await query.graph({
    entity: "booking",
    fields: ["id", "status", "scheduled_at", "provider_id", "customer_id", "service_id"],
    filters: { id }
  })

  if (!bookings.length) {
    return res.status(404).json({ message: "Booking not found" })
  }

  const booking = bookings[0]

  // Validate booking can be rescheduled
  if (["completed", "cancelled", "no_show"].includes(booking.status)) {
    return res.status(400).json({ 
      message: `Cannot reschedule a ${booking.status} booking` 
    })
  }

  // Validate new time is in the future
  const newTime = new Date(new_scheduled_at)
  if (newTime <= new Date()) {
    return res.status(400).json({ 
      message: "New scheduled time must be in the future" 
    })
  }

  // Check provider availability if changing provider or time
  const providerId = new_provider_id || booking.provider_id
  
  // TODO: Add availability check logic here
  // For now, just update the booking

  const previousScheduledAt = booking.scheduled_at

  // Update booking
  await bookingService.updateBookings({
    selector: { id },
    data: {
      scheduled_at: newTime,
      provider_id: providerId,
      rescheduled_at: new Date(),
      reschedule_reason: reason,
      reschedule_count: (booking.reschedule_count || 0) + 1
    }
  })

  // Log the reschedule
  // TODO: Add booking history/audit log entry

  // Send notification if requested
  if (notify_customer) {
    // TODO: Send notification to customer about reschedule
  }

  res.json({
    message: "Booking rescheduled successfully",
    booking_id: id,
    previous_time: previousScheduledAt,
    new_time: newTime,
    provider_id: providerId
  })
}
