import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function paymentRefundedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; refund_id?: string; amount?: number }>) {
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
    
    const refundAmount = data.amount || payment?.amount
    
    if (customer?.email) {
      await notificationService.createNotifications({
        to: customer.email,
        channel: "email",
        template: "payment-refunded",
        data: {
          order_id: order?.id,
          order_display_id: order?.display_id,
          refund_amount: refundAmount,
          currency: payment?.currency_code,
          customer_name: customer.first_name || "Customer",
          refund_reason: "Your refund has been processed",
        }
      })
    }
    
    // Admin notification
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Payment Refunded",
        description: `Refund of ${refundAmount} ${payment?.currency_code} processed for order #${order?.display_id}`,
      }
    })
    
    console.log(`[Payment Refunded] Order ${order?.id} - ${refundAmount} ${payment?.currency_code}`)
  } catch (error) {
    console.error("[Payment Refunded] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "payment.refunded",
}
