import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderCancelledHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")
  
  try {
    const { data: orders } = await query.graph({
      entity: "order",
      fields: ["*", "customer.*", "items.*"],
      filters: { id: data.id }
    })
    
    const order = orders?.[0]
    const customer = order?.customer
    
    if (customer?.email) {
      await notificationService.createNotifications({
        to: customer.email,
        channel: "email",
        template: "order-cancelled",
        data: {
          order_id: order.id,
          order_display_id: order.display_id,
          customer_name: customer.first_name || "Customer",
          cancellation_reason: order.metadata?.cancellation_reason || "Order was cancelled",
          refund_info: "Any payments will be refunded within 5-10 business days",
        }
      })
    }
    
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Order Cancelled",
        description: `Order #${order?.display_id} has been cancelled`,
      }
    })
    
    console.log(`[Order Cancelled] Order ${order?.id}`)
  } catch (error) {
    console.error("[Order Cancelled] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.canceled",
}
