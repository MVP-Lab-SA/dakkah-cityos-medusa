import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Scheduled job to process subscription renewals
 * Runs daily at midnight to check for subscriptions due for billing
 */
export default async function subscriptionBillingJob(container: MedusaContainer) {
  const subscriptionService = container.resolve("subscription")
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const logger = container.resolve("logger")

  logger.info("[subscription-billing] Starting subscription billing job")

  try {
    // Get subscriptions due for renewal (next_billing_date <= today)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const subscriptions = await subscriptionService.listSubscriptions({
      status: "active",
      next_billing_date: { $lte: today.toISOString() },
    })

    logger.info(`[subscription-billing] Found ${subscriptions.length} subscriptions due for billing`)

    let successCount = 0
    let failedCount = 0

    for (const subscription of subscriptions) {
      try {
        // Process billing for this subscription
        // In a real implementation, this would:
        // 1. Charge the customer's saved payment method
        // 2. Create a new order for the subscription
        // 3. Update next_billing_date

        // For now, just update the next billing date
        const nextBillingDate = new Date(subscription.next_billing_date)
        
        // Calculate next billing based on interval
        switch (subscription.billing_interval) {
          case "month":
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
            break
          case "quarter":
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 3)
            break
          case "year":
            nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
            break
          default:
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
        }

        await subscriptionService.updateSubscriptions(
          { id: subscription.id },
          { 
            next_billing_date: nextBillingDate,
            last_billing_date: today,
          }
        )

        // Send renewal confirmation
        if (subscription.customer?.email) {
          await notificationService.createNotifications({
            to: subscription.customer.email,
            channel: "email",
            template: "subscription-renewed",
            data: {
              subscription_id: subscription.id,
              plan_name: subscription.plan?.name,
              next_billing_date: nextBillingDate,
            },
          })
        }

        successCount++
        logger.info(`[subscription-billing] Processed subscription ${subscription.id}`)
      } catch (error: any) {
        failedCount++
        logger.error(`[subscription-billing] Failed to process subscription ${subscription.id}:`, error)

        // Send payment failure notification
        if (subscription.customer?.email) {
          try {
            await notificationService.createNotifications({
              to: subscription.customer.email,
              channel: "email",
              template: "subscription-payment-failed",
              data: {
                subscription_id: subscription.id,
                plan_name: subscription.plan?.name,
              },
            })
          } catch (notifError) {
            logger.error(`[subscription-billing] Failed to send failure notification:`, notifError)
          }
        }
      }
    }

    logger.info(`[subscription-billing] Completed: ${successCount} successful, ${failedCount} failed`)
  } catch (error) {
    logger.error("[subscription-billing] Job failed:", error)
  }
}

export const config = {
  name: "subscription-billing",
  schedule: "0 0 * * *", // Daily at midnight
}
