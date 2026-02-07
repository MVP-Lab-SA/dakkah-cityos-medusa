import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function subscriptionPaymentFailedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ 
  id: string
  customer_id?: string
  error?: string
  retry_count?: number
}>) {
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
    const retryCount = data.retry_count || 0
    
    if (customer?.email) {
      // Different messaging based on retry count
      let urgency = "low"
      let message = "We were unable to process your subscription payment."
      
      if (retryCount >= 2) {
        urgency = "high"
        message = "This is your final notice. Your subscription will be cancelled if payment is not received."
      } else if (retryCount >= 1) {
        urgency = "medium"
        message = "We've tried to process your payment multiple times without success."
      }
      
      await notificationService.createNotifications({
        to: customer.email,
        channel: "email",
        template: "subscription-payment-failed",
        data: {
          subscription_id: subscription.id,
          customer_name: customer.first_name || "Customer",
          plan_name: subscription.plan?.name || "Subscription",
          error_message: data.error || "Payment could not be processed",
          retry_count: retryCount,
          urgency,
          message,
          update_payment_url: `${process.env.STOREFRONT_URL || ""}/account/subscriptions/${subscription.id}/payment`,
          will_retry: retryCount < 3,
          next_retry_date: retryCount < 3 ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null,
        }
      })
    }
    
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Subscription Payment Failed",
        description: `Payment failed for ${customer?.email} (Attempt ${retryCount + 1})`,
      }
    })
    
    console.log(`[Subscription Payment Failed] ${subscription?.id} - Attempt ${retryCount + 1}`)
  } catch (error) {
    console.error("[Subscription Payment Failed] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "subscription.payment_failed",
}
