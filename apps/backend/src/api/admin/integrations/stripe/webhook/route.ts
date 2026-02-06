import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { StripeConnectService } from "../../../../../integrations/stripe-connect/index.js";
import Stripe from "stripe";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return res.status(400).json({ error: "Missing signature" });
  }

  const stripeService = new StripeConnectService({
    secretKey: process.env.STRIPE_SECRET_KEY!,
    clientId: process.env.STRIPE_CLIENT_ID!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  });

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripeService.verifyWebhookSignature(
      req.body as Buffer,
      signature
    );
  } catch (error) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Handle events
  try {
    switch (event.type) {
      case "account.updated":
        await handleAccountUpdated(event.data.object as Stripe.Account, req);
        break;

      case "transfer.created":
        await handleTransferCreated(event.data.object as Stripe.Transfer, req);
        break;

      case "transfer.reversed":
        // Handle transfer failures via reversed event
        await handleTransferFailed(event.data.object as Stripe.Transfer, req);
        break;

      case "payout.paid":
        await handlePayoutPaid(event.data.object as Stripe.Payout, req);
        break;

      case "payout.failed":
        await handlePayoutFailed(event.data.object as Stripe.Payout, req);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    res.status(500).json({ error: "Handler failed" });
  }
}

async function handleAccountUpdated(
  account: Stripe.Account,
  req: MedusaRequest
) {
  const vendorModuleService = req.scope.resolve("vendorModuleService") as any;

  // Find vendor by stripe_account_id
  const vendors = await vendorModuleService.listVendors({
    stripe_account_id: account.id,
  });

  if (vendors.length === 0) {
    console.log(`No vendor found for account ${account.id}`);
    return;
  }

  const vendor = vendors[0];

  // Check if fully onboarded
  const isOnboarded =
    account.charges_enabled &&
    account.payouts_enabled &&
    account.details_submitted;

  if (isOnboarded && vendor.status === "pending") {
    await vendorModuleService.updateVendors({
      id: vendor.id,
      status: "approved",
      stripe_onboarding_completed: true,
    });
  }
}

async function handleTransferCreated(
  transfer: Stripe.Transfer,
  req: MedusaRequest
) {
  const payoutModuleService = req.scope.resolve("payoutModuleService") as any;

  // Update payout with transfer ID
  if (transfer.metadata?.payout_id) {
    await payoutModuleService.updatePayouts({
      id: transfer.metadata.payout_id,
      stripe_transfer_id: transfer.id,
      status: "completed",
      processed_at: new Date(),
    });
  }
}

async function handleTransferFailed(
  transfer: Stripe.Transfer,
  req: MedusaRequest
) {
  const payoutModuleService = req.scope.resolve("payoutModuleService") as any;

  if (transfer.metadata?.payout_id) {
    await payoutModuleService.updatePayouts({
      id: transfer.metadata.payout_id,
      status: "failed",
      failure_reason: (transfer as any).failure_message || "Transfer failed",
    });
  }
}

async function handlePayoutPaid(payout: Stripe.Payout, req: MedusaRequest) {
  const payoutModuleService = req.scope.resolve("payoutModuleService") as any;

  // Find payout by stripe_payout_id
  const payouts = await payoutModuleService.listPayouts({
    stripe_payout_id: payout.id,
  });

  if (payouts.length > 0) {
    await payoutModuleService.updatePayouts({
      id: payouts[0].id,
      status: "completed",
      processed_at: new Date(),
    });
  }
}

async function handlePayoutFailed(payout: Stripe.Payout, req: MedusaRequest) {
  const payoutModuleService = req.scope.resolve("payoutModuleService") as any;

  const payouts = await payoutModuleService.listPayouts({
    stripe_payout_id: payout.id,
  });

  if (payouts.length > 0) {
    await payoutModuleService.updatePayouts({
      id: payouts[0].id,
      status: "failed",
      failure_reason: payout.failure_message || "Payout failed",
    });
  }
}
