import { MedusaContainer } from "@medusajs/framework/types";
import { StripeConnectService } from "../integrations/stripe-connect";
import { logger, metrics } from "../observability";

export default async function processVendorPayoutsJob(
  container: MedusaContainer
) {
  const startTime = Date.now();
  logger.info("Starting vendor payout processing job");

  const payoutModuleService = container.resolve("payoutModuleService");
  const vendorModuleService = container.resolve("vendorModuleService");

  const stripeService = new StripeConnectService({
    secretKey: process.env.STRIPE_SECRET_KEY!,
    clientId: process.env.STRIPE_CLIENT_ID!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  });

  try {
    // Get pending payouts
    const payouts = await payoutModuleService.listPayouts({
      status: "pending",
    });

    let processed = 0;
    let failed = 0;

    for (const payout of payouts) {
      try {
        // Get vendor details
        const vendor = await vendorModuleService.retrieveVendor(payout.vendor_id);

        if (!vendor.stripe_account_id) {
          logger.warn("Vendor has no Stripe account", {
            vendor_id: vendor.id,
          });
          continue;
        }

        // Check if vendor is fully onboarded
        const isOnboarded = await stripeService.isAccountOnboarded(
          vendor.stripe_account_id
        );

        if (!isOnboarded) {
          logger.warn("Vendor not fully onboarded", {
            vendor_id: vendor.id,
          });
          continue;
        }

        // Create transfer
        const transfer = await stripeService.createTransfer({
          amount: payout.amount,
          currency: payout.currency_code,
          destination_account: vendor.stripe_account_id,
          description: `Payout for period ${payout.period_start} - ${payout.period_end}`,
          metadata: {
            payout_id: payout.id,
            vendor_id: vendor.id,
          },
        });

        // Update payout
        await payoutModuleService.updatePayouts(payout.id, {
          status: "processing",
          stripe_transfer_id: transfer.id,
        });

        processed++;
        logger.info("Payout processed", {
          payout_id: payout.id,
          vendor_id: vendor.id,
          amount: payout.amount,
        });
      } catch (error) {
        failed++;
        logger.error("Failed to process payout", error as Error, {
          payout_id: payout.id,
        });

        await payoutModuleService.updatePayouts(payout.id, {
          status: "failed",
          failure_reason: (error as Error).message,
        });
      }
    }

    const duration = (Date.now() - startTime) / 1000;
    logger.info("Vendor payout processing complete", {
      processed,
      failed,
      duration,
    });
  } catch (error) {
    logger.error("Vendor payout processing job failed", error as Error);
    throw error;
  }
}
