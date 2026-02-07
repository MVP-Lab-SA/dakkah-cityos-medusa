import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function bookingCancelledHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; customer_id?: string; reason?: string }>) {
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
        template: "booking-cancelled",
        data: {
          customer_name: customer.first_name || "Customer",
          service_name: service?.name || "Service",
          booking_date: booking.scheduled_at,
          cancellation_reason: data.reason || "Booking was cancelled",
          refund_info: "If you made a payment, it will be refunded within 5-10 business days",
          rebook_url: `${process.env.STOREFRONT_URL || ""}/book/${service?.handle}`,
        }
      })
    }
    
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Booking Cancelled",
        description: `Booking for ${service?.name} cancelled: ${data.reason || "No reason provided"}`,
      }
    })
    
    console.log(`[Booking Cancelled] ${booking?.id}`)
  } catch (error) {
    console.error("[Booking Cancelled] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "booking.cancelled",
}
