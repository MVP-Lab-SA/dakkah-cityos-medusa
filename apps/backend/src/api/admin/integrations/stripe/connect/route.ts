import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import { StripeConnectService } from "../../../../../integrations/stripe-connect";

const createConnectAccountSchema = z.object({
  vendor_id: z.string(),
  email: z.string().email(),
  country: z.string().length(2),
  business_type: z.enum(["individual", "company"]),
  business_name: z.string().optional(),
  refresh_url: z.string().url(),
  return_url: z.string().url(),
});

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const validated = createConnectAccountSchema.parse(req.body);

  const stripeService = new StripeConnectService({
    secretKey: process.env.STRIPE_SECRET_KEY!,
    clientId: process.env.STRIPE_CLIENT_ID!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  });

  // Create connected account
  const account = await stripeService.createConnectedAccount({
    vendor_id: validated.vendor_id,
    email: validated.email,
    country: validated.country,
    business_type: validated.business_type,
    business_name: validated.business_name,
  });

  // Generate onboarding link
  const accountLink = await stripeService.generateAccountLink(
    account.id,
    validated.refresh_url,
    validated.return_url
  );

  // Update vendor with Stripe account ID
  const vendorModuleService = req.scope.resolve("vendorModuleService");
  await vendorModuleService.updateVendors(validated.vendor_id, {
    stripe_account_id: account.id,
  });

  res.json({
    account_id: account.id,
    onboarding_url: accountLink.url,
  });
}
