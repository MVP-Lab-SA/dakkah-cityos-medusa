import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function subscriptionPlanChangedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ 
  id: string
  customer_id: string
  old_plan_id: string
  new_plan_id: string
  prorated_amount?: number
  prorated_credit?: number
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
    const newPlan = subscription?.plan
    
    // Get old plan details
    const { data: oldPlans } = await query.graph({
      entity: "subscription_plan",
      fields: ["name", "price"],
      filters: { id: data.old_plan_id }
    })
    const oldPlan = oldPlans?.[0]
    
    if (customer?.email) {
      const isUpgrade = (newPlan?.price || 0) > (oldPlan?.price || 0)
      
      await notificationService.createNotifications({
        to: customer.email,
        channel: "email",
        template: "subscription-plan-changed",
        data: {
          subscription_id: subscription.id,
          customer_name: customer.first_name || "Customer",
          old_plan_name: oldPlan?.name || "Previous Plan",
          new_plan_name: newPlan?.name || "New Plan",
          is_upgrade: isUpgrade,
          prorated_amount: data.prorated_amount || 0,
          prorated_credit: data.prorated_credit || 0,
          new_price: newPlan?.price,
          effective_date: new Date().toISOString(),
          manage_url: `${process.env.STOREFRONT_URL || ""}/account/subscriptions/${subscription.id}`,
        }
      })
    }
    
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Plan Changed",
        description: `${customer?.email} changed from ${oldPlan?.name} to ${newPlan?.name}`,
      }
    })
    
    console.log(`[Subscription Plan Changed] ${subscription?.id}: ${oldPlan?.name} -> ${newPlan?.name}`)
  } catch (error) {
    console.error("[Subscription Plan Changed] Error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "subscription.plan_changed",
}
