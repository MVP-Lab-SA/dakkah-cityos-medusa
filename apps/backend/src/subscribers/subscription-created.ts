import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function subscriptionCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const subscriptionService = container.resolve("subscription")

  try {
    // Fetch subscription details
    const subscription = await subscriptionService.retrieveSubscription(data.id)
    
    if (!subscription) {
      console.log("[subscription-created] Subscription not found:", data.id)
      return
    }

    // Get customer email from the subscription or related customer
    const customerEmail = subscription.customer?.email || subscription.metadata?.email
    
    if (!customerEmail) {
      console.log("[subscription-created] No customer email found")
      return
    }

    // Send welcome email
    await notificationModuleService.createNotifications({
      to: customerEmail,
      channel: "email",
      template: "subscription-welcome",
      data: {
        subscription_id: subscription.id,
        plan_name: subscription.plan?.name || "Subscription Plan",
        price: subscription.plan?.price,
        billing_interval: subscription.billing_interval,
        next_billing_date: subscription.next_billing_date,
        customer_name: subscription.customer?.first_name || "Customer",
      },
    })

    console.log("[subscription-created] Welcome email sent to:", customerEmail)

    // Send admin notification
    await notificationModuleService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "New Subscription",
        description: `New subscription to ${subscription.plan?.name || "plan"} created`,
      },
    })
  } catch (error) {
    console.error("[subscription-created] Failed to send notification:", error)
  }
}

export const config: SubscriberConfig = {
  event: "subscription.created",
}
