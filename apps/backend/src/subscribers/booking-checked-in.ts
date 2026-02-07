import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function bookingCheckedInHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; customer_id?: string; service_id?: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")
  
  try {
    const { data: bookings } = await query.graph({
      entity: "booking",
      fields: ["*", "service.*"],
      filters: { id: data.id }
    })
    
    const booking = bookings?.[0]
    const service = booking?.service
    
    // Admin notification that customer has arrived
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Customer Checked In",
        description: `Customer checked in for ${service?.name} appointment`,
      }
    })
    
    console.log(`[Booking Checked In] ${booking?.id}`)
  } catch (error) {
    console.error("[Booking Checked In] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "booking.checked_in",
}
