import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function paymentFailedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; error?: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")
  
  try {
    const { data: payments } = await query.graph({
      entity: "payment",
      fields: ["*", "payment_collection.order.*", "payment_collection.order.customer.*"],
      filters: { id: data.id }
    })
    
    const payment = payments?.[0]
    const order = payment?.payment_collection?.order
    const customer = order?.customer
    
    if (customer?.email) {
      await notificationService.createNotifications({
        to: customer.email,
        channel: "email",
        template: "payment-failed",
        data: {
          order_id: order?.id,
          order_display_id: order?.display_id,
          error: data.error || "Payment could not be processed",
          retry_url: `${process.env.STOREFRONT_URL || "http://localhost:8000"}/checkout?retry=true`,
          customer_name: customer.first_name || "Customer",
        }
      })
    }
    
    // Admin notification
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Payment Failed",
        description: `Payment failed for order #${order?.display_id}: ${data.error || "Unknown error"}`,
      }
    })
    
    console.log(`[Payment Failed] Order ${order?.id} - Error: ${data.error}`)
  } catch (error) {
    console.error("[Payment Failed] Handler error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "payment.payment_capture_failed",
}
