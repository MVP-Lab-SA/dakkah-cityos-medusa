import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function subscriptionResumedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; customer_id: string; new_billing_date?: Date }>) {
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
        template: "subscription-resumed",
        data: {
          subscription_id: subscription.id,
          customer_name: customer.first_name || "Customer",
          plan_name: subscription.plan?.name || "Subscription",
          next_billing_date: data.new_billing_date || subscription.next_billing_date,
          manage_url: `${process.env.STOREFRONT_URL || ""}/account/subscriptions/${subscription.id}`,
        }
      })
    }
    
    console.log(`[Subscription Resumed] ${subscription?.id}`)
  } catch (error) {
    console.error("[Subscription Resumed] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "subscription.resumed",
}
