import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET - Check and update Stripe Connect onboarding status
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const query = req.scope.resolve("query")
  const vendorService = req.scope.resolve("vendorModuleService")

  const { data: vendors } = await query.graph({
    entity: "vendors",
    fields: ["id", "stripe_account_id"],
    filters: { id }
  })

  if (!vendors.length) {
    return res.status(404).json({ message: "Vendor not found" })
  }

  const vendor = vendors[0]

  if (!vendor.stripe_account_id) {
    return res.json({
      status: "not_started",
      onboarding_complete: false,
      payouts_enabled: false,
      charges_enabled: false
    })
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    return res.status(400).json({ message: "Stripe is not configured" })
  }

  try {
    const stripe = require("stripe")(stripeSecretKey)
    const account = await stripe.accounts.retrieve(vendor.stripe_account_id)

    // Update vendor with latest status
    await vendorService.updateVendors({
      selector: { id },
      data: {
        stripe_onboarding_complete: account.details_submitted,
        stripe_payouts_enabled: account.payouts_enabled,
        stripe_charges_enabled: account.charges_enabled
      }
    })

    res.json({
      status: account.details_submitted ? "complete" : "pending",
      onboarding_complete: account.details_submitted,
      payouts_enabled: account.payouts_enabled,
      charges_enabled: account.charges_enabled,
      requirements: account.requirements
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
