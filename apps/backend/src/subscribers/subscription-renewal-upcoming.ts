import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function subscriptionRenewalUpcomingHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; days_until_renewal: number }>) {
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
    
    if (!customer?.email) return
    
    await notificationService.createNotifications({
      to: customer.email,
      channel: "email",
      template: "subscription-renewal-reminder",
      data: {
        customer_name: customer.first_name || "Customer",
        plan_name: subscription.plan?.name || "Subscription",
        renewal_date: subscription.next_billing_date,
        amount: subscription.price,
        currency: subscription.currency_code || "usd",
        days_until_renewal: data.days_until_renewal,
        manage_url: `${process.env.STOREFRONT_URL || ""}/account/subscriptions/${subscription.id}`,
        cancel_url: `${process.env.STOREFRONT_URL || ""}/account/subscriptions/${subscription.id}?action=cancel`,
      }
    })
    
    console.log(`[Subscription Renewal Upcoming] ${subscription?.id} - ${data.days_until_renewal} days`)
  } catch (error) {
    console.error("[Subscription Renewal Upcoming] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "subscription.renewal_upcoming",
}
