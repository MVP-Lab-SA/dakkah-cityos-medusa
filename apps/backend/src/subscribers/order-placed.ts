import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")

  // Fetch order details
  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "total",
      "currency_code",
      "items.*",
      "shipping_address.*",
      "customer.first_name",
      "customer.last_name",
    ],
    filters: { id: data.id },
  })

  const order = orders[0]
  if (!order || !order.email) {
    console.log("[order-placed] Order not found or no email:", data.id)
    return
  }

  try {
    // Send order confirmation email
    await notificationModuleService.createNotifications({
      to: order.email,
      channel: "email",
      template: "order-confirmation",
      data: {
        order_id: order.id,
        display_id: order.display_id,
        customer_name: order.customer?.first_name || "Customer",
        total: order.total,
        currency_code: order.currency_code,
        items: order.items,
        shipping_address: order.shipping_address,
      },
    })

    console.log("[order-placed] Confirmation email sent to:", order.email)

    // Also send admin notification
    await notificationModuleService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "New Order Received",
        description: `Order #${order.display_id} placed for ${order.currency_code?.toUpperCase()} ${(order.total / 100).toFixed(2)}`,
      },
    })
  } catch (error) {
    console.error("[order-placed] Failed to send notification:", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
