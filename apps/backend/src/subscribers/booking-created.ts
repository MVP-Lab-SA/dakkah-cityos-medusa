import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function bookingCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const bookingService = container.resolve("booking")

  try {
    // Fetch booking details
    const booking = await bookingService.retrieveBooking(data.id)
    
    if (!booking || !booking.customer_email) {
      console.log("[booking-created] Booking not found or no email:", data.id)
      return
    }

    // Send booking confirmation email
    await notificationModuleService.createNotifications({
      to: booking.customer_email,
      channel: "email",
      template: "booking-confirmation",
      data: {
        booking_id: booking.id,
        service_name: booking.service?.name || "Service",
        provider_name: booking.provider?.name || "Provider",
        start_time: booking.start_time,
        end_time: booking.end_time,
        location: booking.location,
        customer_name: booking.customer_name,
        notes: booking.notes,
      },
    })

    console.log("[booking-created] Confirmation sent to:", booking.customer_email)

    // Send admin notification
    await notificationModuleService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "New Booking",
        description: `New booking for ${booking.service?.name || "service"} on ${new Date(booking.start_time).toLocaleDateString()}`,
      },
    })
  } catch (error) {
    console.error("[booking-created] Failed to send notification:", error)
  }
}

export const config: SubscriberConfig = {
  event: "booking.created",
}
