import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderReturnedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; return_id?: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")
  
  try {
    const { data: orders } = await query.graph({
      entity: "order",
      fields: ["*", "customer.*"],
      filters: { id: data.id }
    })
    
    const order = orders?.[0]
    const customer = order?.customer
    
    if (customer?.email) {
      await notificationService.createNotifications({
        to: customer.email,
        channel: "email",
        template: "order-return-received",
        data: {
          order_id: order.id,
          order_display_id: order.display_id,
          customer_name: customer.first_name || "Customer",
          return_id: data.return_id,
          refund_info: "Your refund will be processed within 5-10 business days",
        }
      })
    }
    
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Return Received",
        description: `Return received for order #${order?.display_id}`,
      }
    })
    
    console.log(`[Order Returned] Order ${order?.id}`)
  } catch (error) {
    console.error("[Order Returned] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.return_received",
}
