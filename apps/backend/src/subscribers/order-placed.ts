import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { subscriberLogger } from "../lib/logger"
import { config } from "../lib/config"

const logger = subscriberLogger

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")

  try {
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
      logger.warn("Order not found or no email", { orderId: data.id })
      return
    }

    if (config.features.enableEmailNotifications) {
      await notificationService.createNotifications({
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
    }

    if (config.features.enableAdminNotifications) {
      await notificationService.createNotifications({
        to: "",
        channel: "feed",
        template: "admin-ui",
        data: {
          title: "New Order Received",
          description: `Order #${order.display_id} placed for ${order.currency_code?.toUpperCase()} ${(order.total / 100).toFixed(2)}`,
        },
      })
    }

    logger.info("Order placed notification sent", { 
      orderId: order.id, 
      displayId: order.display_id,
      email: order.email 
    })
  } catch (error) {
    logger.error("Order placed handler error", error, { orderId: data.id })
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
