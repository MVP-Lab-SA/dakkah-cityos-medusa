import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Scheduled job to send subscription expiry warnings
 * Runs daily to notify customers whose subscriptions are expiring soon
 */
export default async function subscriptionExpiryWarningJob(container: MedusaContainer) {
  const subscriptionService = container.resolve("subscription")
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const logger = container.resolve("logger")

  logger.info("[subscription-expiry] Starting subscription expiry warning job")

  try {
    // Get subscriptions expiring in 7 days
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const expiringSubscriptions = await subscriptionService.listSubscriptions({
      status: "active",
      // Subscriptions that will expire in exactly 7 days
      end_date: {
        $gte: sevenDaysFromNow.toISOString().split("T")[0],
        $lte: sevenDaysFromNow.toISOString().split("T")[0] + "T23:59:59",
      },
    })

    logger.info(`[subscription-expiry] Found ${expiringSubscriptions.length} subscriptions expiring in 7 days`)

    let sentCount = 0

    for (const subscription of expiringSubscriptions) {
      const customerEmail = subscription.customer?.email || subscription.metadata?.email

      if (!customerEmail) {
        continue
      }

      try {
        await notificationService.createNotifications({
          to: customerEmail,
          channel: "email",
          template: "subscription-expiring",
          data: {
            subscription_id: subscription.id,
            plan_name: subscription.plan?.name || "Your subscription",
            end_date: subscription.end_date,
            customer_name: subscription.customer?.first_name || "Customer",
          },
        })

        sentCount++
        logger.info(`[subscription-expiry] Sent warning for subscription ${subscription.id}`)
      } catch (error: any) {
        logger.error(`[subscription-expiry] Failed to send warning for ${subscription.id}:`, error)
      }
    }

    // Also check for subscriptions expiring in 1 day (final warning)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const expiringTomorrow = await subscriptionService.listSubscriptions({
      status: "active",
      end_date: {
        $gte: tomorrow.toISOString().split("T")[0],
        $lte: tomorrow.toISOString().split("T")[0] + "T23:59:59",
      },
    })

    logger.info(`[subscription-expiry] Found ${expiringTomorrow.length} subscriptions expiring tomorrow`)

    for (const subscription of expiringTomorrow) {
      const customerEmail = subscription.customer?.email || subscription.metadata?.email

      if (!customerEmail) {
        continue
      }

      try {
        await notificationService.createNotifications({
          to: customerEmail,
          channel: "email",
          template: "subscription-expiring-final",
          data: {
            subscription_id: subscription.id,
            plan_name: subscription.plan?.name || "Your subscription",
            end_date: subscription.end_date,
            customer_name: subscription.customer?.first_name || "Customer",
          },
        })

        sentCount++
      } catch (error: any) {
        logger.error(`[subscription-expiry] Failed to send final warning for ${subscription.id}:`, error)
      }
    }

    logger.info(`[subscription-expiry] Sent ${sentCount} expiry warnings`)
  } catch (error) {
    logger.error("[subscription-expiry] Job failed:", error)
  }
}

export const config = {
  name: "subscription-expiry-warning",
  schedule: "0 9 * * *", // Daily at 9 AM
}
