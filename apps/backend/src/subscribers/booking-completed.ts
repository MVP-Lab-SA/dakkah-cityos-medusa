import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function bookingCompletedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; customer_id?: string }>) {
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
        template: "booking-completed",
        data: {
          customer_name: customer.first_name || "Customer",
          service_name: service?.name || "Service",
          booking_date: booking.scheduled_at,
          review_url: `${process.env.STOREFRONT_URL || ""}/account/bookings/${booking.id}/review`,
          rebook_url: `${process.env.STOREFRONT_URL || ""}/book/${service?.handle}`,
        }
      })
    }
    
    console.log(`[Booking Completed] ${booking?.id}`)
  } catch (error) {
    console.error("[Booking Completed] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "booking.completed",
}
