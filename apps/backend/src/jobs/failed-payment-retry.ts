import { MedusaContainer } from "@medusajs/framework/types"

export default async function failedPaymentRetryJob(container: MedusaContainer) {
  const query = container.resolve("query")
  const subscriptionService = container.resolve("subscription")
  const eventBus = container.resolve("event_bus")
  
  console.log("[Payment Retry] Starting retry job...")
  
  try {
    // Get subscriptions with failed payments (retry up to 3 times)
    const { data: failedSubscriptions } = await query.graph({
      entity: "subscription",
      fields: ["*", "customer.*", "plan.*"],
      filters: {
        status: "active",
        payment_status: "failed"
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
      const retryCount = subscription.metadata?.retry_count || 0
      
      // Check if max retries exceeded
      if (retryCount >= 3) {
        // Cancel subscription
        await subscriptionService.updateSubscriptions({
          id: subscription.id,
          status: "cancelled",
          cancelled_at: new Date(),
          cancellation_reason: "payment_failed_max_retries"
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
        // Attempt to charge with Stripe
        if (process.env.STRIPE_SECRET_KEY && subscription.payment_method_id) {
          const Stripe = require("stripe")
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
          
          // Get customer's Stripe customer ID
          const stripeCustomerId = subscription.customer?.metadata?.stripe_customer_id
          
          if (stripeCustomerId) {
            const paymentIntent = await stripe.paymentIntents.create({
              amount: Math.round(Number(subscription.price) * 100),
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
              // Update subscription
              await subscriptionService.updateSubscriptions({
                id: subscription.id,
                payment_status: "paid",
                metadata: {
                  ...subscription.metadata,
                  retry_count: 0,
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
        
        // Payment failed or no Stripe configured
        throw new Error("Payment could not be processed")
      } catch (error: any) {
        // Update retry count
        await subscriptionService.updateSubscriptions({
          id: subscription.id,
          metadata: {
            ...subscription.metadata,
            retry_count: retryCount + 1,
            last_retry_at: new Date().toISOString(),
            last_retry_error: error.message
          }
        })
        
        // Emit payment failed event
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
