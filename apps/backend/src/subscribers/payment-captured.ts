import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function paymentCapturedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")
  
  try {
    // Get payment with order details
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
        template: "payment-confirmed",
        data: {
          order_id: order.id,
          order_display_id: order.display_id,
          amount: payment.amount,
          currency: payment.currency_code,
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
        title: "Payment Captured",
        description: `Payment of ${payment.amount} ${payment.currency_code} captured for order #${order?.display_id}`,
      }
    })
    
    console.log(`[Payment Captured] Order ${order?.id} - ${payment.amount} ${payment.currency_code}`)
  } catch (error) {
    console.error("[Payment Captured] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "payment.captured",
}
