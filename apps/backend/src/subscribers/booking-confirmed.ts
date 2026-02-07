import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function bookingConfirmedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; customer_id?: string; service_id?: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")
  
  try {
    const { data: bookings } = await query.graph({
      entity: "booking",
      fields: ["*", "customer.*", "service.*"],
      filters: { id: data.id }
    })
    
    const booking = bookings?.[0]
    const customer = booking?.customer
    const service = booking?.service
    
    if (customer?.email) {
      await notificationService.createNotifications({
        to: customer.email,
        channel: "email",
        template: "booking-confirmed",
        data: {
          customer_name: customer.first_name || "Customer",
          service_name: service?.name || "Service",
          booking_date: booking.scheduled_at,
          duration: service?.duration_minutes || 60,
          location: booking.location || "Our wellness center",
          preparation_notes: service?.metadata?.preparation || "Please arrive 10 minutes early",
          manage_url: `${process.env.STOREFRONT_URL || ""}/account/bookings/${booking.id}`,
          calendar_link: `${process.env.STOREFRONT_URL || ""}/api/bookings/${booking.id}/calendar`,
        }
      })
    }
    
    console.log(`[Booking Confirmed] ${booking?.id}`)
  } catch (error) {
    console.error("[Booking Confirmed] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "booking.confirmed",
}
