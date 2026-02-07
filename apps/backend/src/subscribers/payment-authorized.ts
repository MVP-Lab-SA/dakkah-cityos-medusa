import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function paymentAuthorizedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")
  
  try {
    const { data: payments } = await query.graph({
      entity: "payment",
      fields: ["*", "payment_collection.order.*"],
      filters: { id: data.id }
    })
    
    const payment = payments?.[0]
    const order = payment?.payment_collection?.order
    
    // Admin notification for manual capture workflows
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Payment Authorized",
        description: `Payment of ${payment?.amount} ${payment?.currency_code} authorized for order #${order?.display_id}. Ready for capture.`,
      }
    })
    
    console.log(`[Payment Authorized] Order ${order?.id} - ${payment?.amount} ${payment?.currency_code}`)
  } catch (error) {
    console.error("[Payment Authorized] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "payment.authorized",
}
