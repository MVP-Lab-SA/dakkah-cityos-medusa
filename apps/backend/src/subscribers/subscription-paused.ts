import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function subscriptionPausedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; customer_id: string; reason?: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")
  
  try {
    const { data: subscriptions } = await query.graph({
      entity: "subscription",
      fields: ["*", "customer.*", "plan.*"],
      filters: { id: data.id }
    })
    
    const subscription = subscriptions?.[0]
    const customer = subscription?.customer
    
    if (customer?.email) {
      await notificationService.createNotifications({
        to: customer.email,
        channel: "email",
        template: "subscription-paused",
        data: {
          subscription_id: subscription.id,
          customer_name: customer.first_name || "Customer",
          plan_name: subscription.plan?.name || "Subscription",
          pause_reason: data.reason || "At your request",
          resume_url: `${process.env.STOREFRONT_URL || ""}/account/subscriptions/${subscription.id}`,
        }
      })
    }
    
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Subscription Paused",
        description: `Subscription for ${customer?.email} has been paused`,
      }
    })
    
    console.log(`[Subscription Paused] ${subscription?.id}`)
  } catch (error) {
    console.error("[Subscription Paused] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "subscription.paused",
}
