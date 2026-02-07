import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function subscriptionCancelledHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const subscriptionService = container.resolve("subscription")

  try {
    // Fetch subscription details
    const subscription = await subscriptionService.retrieveSubscription(data.id)
    
    if (!subscription) {
      console.log("[subscription-cancelled] Subscription not found:", data.id)
      return
    }

    const customerEmail = subscription.customer?.email || subscription.metadata?.email
    
    if (!customerEmail) {
      console.log("[subscription-cancelled] No customer email found")
      return
    }

    // Send cancellation confirmation email
    await notificationModuleService.createNotifications({
      to: customerEmail,
      channel: "email",
      template: "subscription-cancelled",
      data: {
        subscription_id: subscription.id,
        plan_name: subscription.plan?.name || "Subscription Plan",
        end_date: subscription.cancelled_at || new Date(),
        customer_name: subscription.customer?.first_name || "Customer",
      },
    })

    console.log("[subscription-cancelled] Cancellation email sent to:", customerEmail)
  } catch (error) {
    console.error("[subscription-cancelled] Failed to send notification:", error)
  }
}

export const config: SubscriberConfig = {
  event: "subscription.cancelled",
}
