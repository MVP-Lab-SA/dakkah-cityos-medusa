import { ExecArgs } from "@medusajs/framework/types"
import seedVendors from "./seed-vendors.js"
import seedServices from "./seed-services.js"
import seedSubscriptions from "./seed-subscriptions.js"
import seedCompanies from "./seed-companies.js"
import seedVolumePricing from "./seed-volume-pricing.js"

/**
 * Master seed script - seeds all custom data
 * 
 * Run with: npx medusa exec src/scripts/seed-all.ts
 */
export default async function seedAll(args: ExecArgs) {
  console.log("========================================")
  console.log("Starting comprehensive data seeding...")
  console.log("========================================\n")

  try {
    // Seed vendors (marketplace)
    console.log("\n[1/5] VENDORS")
    console.log("----------------------------------------")
    await seedVendors(args)

    // Seed bookable services
    console.log("\n[2/5] BOOKABLE SERVICES")
    console.log("----------------------------------------")
    await seedServices(args)

    // Seed subscription plans
    console.log("\n[3/5] SUBSCRIPTION PLANS")
    console.log("----------------------------------------")
    await seedSubscriptions(args)

    // Seed B2B companies
    console.log("\n[4/5] B2B COMPANIES")
    console.log("----------------------------------------")
    await seedCompanies(args)

    // Seed volume pricing
    console.log("\n[5/5] VOLUME PRICING")
    console.log("----------------------------------------")
    await seedVolumePricing(args)

    console.log("\n========================================")
    console.log("Data seeding completed successfully!")
    console.log("========================================")
  } catch (error: any) {
    console.error("\n========================================")
    console.error("Data seeding failed!")
    console.error("Error:", error.message)
    console.error("========================================")
    throw error
  }
}
