import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderShippedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; fulfillment_id: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")

  // Fetch order details
  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "customer.first_name",
      "fulfillments.tracking_links.*",
      "fulfillments.shipped_at",
    ],
    filters: { id: data.id },
  })

  const order = orders[0]
  if (!order || !order.email) {
    console.log("[order-shipped] Order not found or no email:", data.id)
    return
  }

  // Find the fulfillment that was just shipped
  const fulfillment = order.fulfillments?.find(
    (f: any) => f.id === data.fulfillment_id
  )

  try {
    await notificationModuleService.createNotifications({
      to: order.email,
      channel: "email",
      template: "order-shipped",
      data: {
        order_id: order.id,
        display_id: order.display_id,
        customer_name: order.customer?.first_name || "Customer",
        tracking_links: fulfillment?.tracking_links || [],
        shipped_at: fulfillment?.shipped_at,
      },
    })

    console.log("[order-shipped] Shipping notification sent to:", order.email)
  } catch (error) {
    console.error("[order-shipped] Failed to send notification:", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
}
