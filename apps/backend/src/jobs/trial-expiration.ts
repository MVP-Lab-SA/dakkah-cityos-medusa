import { MedusaContainer } from "@medusajs/framework/types"

export default async function trialExpirationJob(container: MedusaContainer) {
  const query = container.resolve("query")
  const subscriptionService = container.resolve("subscription")
  const eventBus = container.resolve("event_bus")
  
  console.log("[Trial Expiration] Checking for expiring trials...")
  
  try {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    // Get trials expiring in next 24 hours (send reminder)
    const { data: expiringTrials } = await query.graph({
      entity: "subscription",
      fields: ["*", "customer.*", "plan.*"],
      filters: {
        status: "trialing",
        trial_ends_at: {
          $gte: now.toISOString(),
          $lt: tomorrow.toISOString()
        }
      }
    })
    
    console.log(`[Trial Expiration] Found ${expiringTrials?.length || 0} trials expiring soon`)
    
    for (const subscription of expiringTrials || []) {
      // Send reminder email
      await eventBus.emit("subscription.trial_ending", {
        id: subscription.id,
        customer_id: subscription.customer_id,
        trial_ends_at: subscription.trial_ends_at,
        has_payment_method: !!subscription.payment_method_id
      })
    }
    
    // Get already expired trials
    const { data: expiredTrials } = await query.graph({
      entity: "subscription",
      fields: ["*", "customer.*"],
      filters: {
        status: "trialing",
        trial_ends_at: { $lt: now.toISOString() }
      }
    })
    
    console.log(`[Trial Expiration] Found ${expiredTrials?.length || 0} expired trials`)
    
    let convertedCount = 0
    let expiredCount = 0
    
    for (const subscription of expiredTrials || []) {
      if (subscription.payment_method_id) {
        // Has payment method - convert to active and charge
        await subscriptionService.updateSubscriptions({
          id: subscription.id,
          status: "active",
          trial_ends_at: null,
          next_billing_date: new Date() // Bill immediately
        })
        
        await eventBus.emit("subscription.trial_converted", {
          id: subscription.id,
          customer_id: subscription.customer_id
        })
        
        convertedCount++
        console.log(`[Trial Expiration] Converted trial to active: ${subscription.id}`)
      } else {
        // No payment method - expire the subscription
        await subscriptionService.updateSubscriptions({
          id: subscription.id,
          status: "expired",
          expired_at: new Date(),
          metadata: {
            ...subscription.metadata,
            expiration_reason: "trial_ended_no_payment_method"
          }
        })
        
        await eventBus.emit("subscription.trial_expired", {
          id: subscription.id,
          customer_id: subscription.customer_id
        })
        
        expiredCount++
        console.log(`[Trial Expiration] Expired trial (no payment): ${subscription.id}`)
      }
    }
    
    console.log(`[Trial Expiration] Completed - Reminders: ${expiringTrials?.length || 0}, Converted: ${convertedCount}, Expired: ${expiredCount}`)
  } catch (error) {
    console.error("[Trial Expiration] Job failed:", error)
  }
}

export const config = {
  name: "trial-expiration",
  schedule: "0 8 * * *", // Daily at 8 AM
}
