// @ts-nocheck
import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Scheduled job to process vendor payouts
 * Runs weekly on Mondays to calculate and initiate vendor payouts
 */
export default async function vendorPayoutsJob(container: MedusaContainer) {
  const payoutService = container.resolve("payout")
  const vendorService = container.resolve("vendor")
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const logger = container.resolve("logger")

  logger.info("[vendor-payouts] Starting vendor payouts job")

  try {
    // Get all active vendors
    const vendors = await vendorService.listVendors({
      status: "active",
    })

    logger.info(`[vendor-payouts] Processing payouts for ${vendors.length} vendors`)

    let processedCount = 0
    let totalPayout = 0

    for (const vendor of vendors) {
      try {
        // Get pending payout amount for vendor
        const pendingPayouts = await payoutService.listPayouts({
          vendor_id: vendor.id,
          status: "pending",
        })

        if (pendingPayouts.length === 0) {
          continue
        }

        const payoutAmount = pendingPayouts.reduce(
          (sum: number, p: any) => sum + (p.amount || 0),
          0
        )

        if (payoutAmount <= 0) {
          continue
        }

        // Create payout record
        await payoutService.createPayouts({
          vendor_id: vendor.id,
          amount: payoutAmount,
          currency_code: vendor.currency_code || "usd",
          status: "processing",
          payout_date: new Date(),
          metadata: {
            payout_count: pendingPayouts.length,
          },
        })

        // Mark individual payouts as processed
        for (const payout of pendingPayouts) {
          await payoutService.updatePayouts(
            { id: payout.id },
            { status: "processed" }
          )
        }

        // Send notification to vendor
        if (vendor.email) {
          await notificationService.createNotifications({
            to: vendor.email,
            channel: "email",
            template: "vendor-payout-processed",
            data: {
              vendor_name: vendor.name,
              amount: payoutAmount,
              currency_code: vendor.currency_code || "usd",
            },
          })
        }

        processedCount++
        totalPayout += payoutAmount
        logger.info(`[vendor-payouts] Processed payout for vendor ${vendor.id}: ${payoutAmount}`)
      } catch (error: any) {
        logger.error(`[vendor-payouts] Failed to process payout for vendor ${vendor.id}:`, error)
      }
    }

    logger.info(`[vendor-payouts] Completed: ${processedCount} vendors, total payout: ${totalPayout}`)

    // Send admin notification
    await notificationService.createNotifications({
      to: "",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: "Weekly Vendor Payouts Processed",
        description: `Processed ${processedCount} vendor payouts totaling ${totalPayout}`,
      },
    })
  } catch (error) {
    logger.error("[vendor-payouts] Job failed:", error)
  }
}

export const config = {
  name: "vendor-payouts",
  schedule: "0 0 * * 1", // Every Monday at midnight
}
