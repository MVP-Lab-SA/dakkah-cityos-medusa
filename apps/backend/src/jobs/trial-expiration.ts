// @ts-nocheck
import { MedusaContainer } from "@medusajs/framework/types"

export default async function trialExpirationJob(container: MedusaContainer) {
  const query = container.resolve("query")
  const subscriptionService = container.resolve("subscription")
  const eventBus = container.resolve("event_bus")
  
  console.log("[Trial Expiration] Checking for expiring trials...")
  
  try {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    const { data: expiringTrials } = await query.graph({
      entity: "subscription",
      fields: ["*"],
      filters: {
        status: "active",
        trial_end: {
          $gte: now.toISOString(),
          $lt: tomorrow.toISOString()
        }
      }
    })
    
    console.log(`[Trial Expiration] Found ${expiringTrials?.length || 0} trials expiring soon`)
    
    for (const subscription of expiringTrials || []) {
      await eventBus.emit("subscription.trial_ending", {
        id: subscription.id,
        customer_id: subscription.customer_id,
        trial_end: subscription.trial_end,
        has_payment_method: !!subscription.payment_method_id
      })
    }
    
    const { data: expiredTrials } = await query.graph({
      entity: "subscription",
      fields: ["*"],
      filters: {
        status: "active",
        trial_end: { $lt: now.toISOString() }
      }
    })
    
    console.log(`[Trial Expiration] Found ${expiredTrials?.length || 0} expired trials`)
    
    let convertedCount = 0
    let expiredCount = 0
    
    for (const subscription of expiredTrials || []) {
      if (subscription.payment_method_id) {
        await subscriptionService.updateSubscriptions({
          id: subscription.id,
          status: "active",
          trial_end: null,
          current_period_start: new Date(),
          current_period_end: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        })
        
        await eventBus.emit("subscription.trial_converted", {
          id: subscription.id,
          customer_id: subscription.customer_id
        })
        
        convertedCount++
        console.log(`[Trial Expiration] Converted trial to active: ${subscription.id}`)
      } else {
        await subscriptionService.updateSubscriptions({
          id: subscription.id,
          status: "expired",
          metadata: {
            ...subscription.metadata,
            expiration_reason: "trial_ended_no_payment_method",
            expired_at: new Date().toISOString()
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
