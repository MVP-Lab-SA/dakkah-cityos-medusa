// @ts-nocheck
import { MedusaContainer } from "@medusajs/framework/types"

export default async function failedPaymentRetryJob(container: MedusaContainer) {
  const query = container.resolve("query")
  const subscriptionService = container.resolve("subscription")
  const eventBus = container.resolve("event_bus")
  
  console.log("[Payment Retry] Starting retry job...")
  
  try {
    const { data: failedSubscriptions } = await query.graph({
      entity: "subscription",
      fields: ["*"],
      filters: {
        status: "past_due"
      }
    })
    
    if (!failedSubscriptions || failedSubscriptions.length === 0) {
      console.log("[Payment Retry] No failed payments to retry")
      return
    }
    
    let successCount = 0
    let failCount = 0
    let cancelledCount = 0
    
    for (const subscription of failedSubscriptions) {
      const retryCount = subscription.retry_count || 0
      
      if (retryCount >= subscription.max_retry_attempts) {
        await subscriptionService.updateSubscriptions({
          id: subscription.id,
          status: "canceled",
          canceled_at: new Date(),
          metadata: {
            ...subscription.metadata,
            cancellation_reason: "payment_failed_max_retries"
          }
        })
        
        await eventBus.emit("subscription.cancelled", {
          id: subscription.id,
          reason: "payment_failed_max_retries"
        })
        
        cancelledCount++
        console.log(`[Payment Retry] Cancelled subscription ${subscription.id} - max retries exceeded`)
        continue
      }
      
      try {
        if (process.env.STRIPE_SECRET_KEY && subscription.payment_method_id) {
          const Stripe = require("stripe")
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
          
          const stripeCustomerId = subscription.metadata?.stripe_customer_id
          
          if (stripeCustomerId) {
            const paymentIntent = await stripe.paymentIntents.create({
              amount: Math.round(Number(subscription.total) * 100),
              currency: subscription.currency_code || "usd",
              customer: stripeCustomerId,
              payment_method: subscription.payment_method_id,
              confirm: true,
              off_session: true,
              metadata: {
                subscription_id: subscription.id,
                retry_attempt: retryCount + 1
              }
            })
            
            if (paymentIntent.status === "succeeded") {
              await subscriptionService.updateSubscriptions({
                id: subscription.id,
                status: "active",
                retry_count: 0,
                last_retry_at: new Date(),
                metadata: {
                  ...subscription.metadata,
                  last_payment_date: new Date().toISOString(),
                  last_payment_intent_id: paymentIntent.id
                }
              })
              
              successCount++
              console.log(`[Payment Retry] Success for subscription ${subscription.id}`)
              continue
            }
          }
        }
        
        throw new Error("Payment could not be processed")
      } catch (error: any) {
        await subscriptionService.updateSubscriptions({
          id: subscription.id,
          retry_count: retryCount + 1,
          last_retry_at: new Date(),
          metadata: {
            ...subscription.metadata,
            last_retry_error: error.message
          }
        })
        
        await eventBus.emit("subscription.payment_failed", {
          id: subscription.id,
          customer_id: subscription.customer_id,
          error: error.message,
          retry_count: retryCount + 1
        })
        
        failCount++
        console.log(`[Payment Retry] Failed for subscription ${subscription.id}: ${error.message}`)
      }
    }
    
    console.log(`[Payment Retry] Completed - Success: ${successCount}, Failed: ${failCount}, Cancelled: ${cancelledCount}`)
  } catch (error) {
    console.error("[Payment Retry] Job failed:", error)
  }
}

export const config = {
  name: "failed-payment-retry",
  schedule: "0 */6 * * *", // Every 6 hours
}
