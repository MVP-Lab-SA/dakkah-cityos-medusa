import { ExecArgs } from "@medusajs/framework/types"
import seedVendors from "./seed-vendors.js"
import seedServices from "./seed-services.js"
import seedSubscriptions from "./seed-subscriptions.js"
import seedCompanies from "./seed-companies.js"
import seedVolumePricing from "./seed-volume-pricing.js"
import { createLogger } from "../lib/logger"
const logger = createLogger("scripts:seed-all")

/**
 * Master seed script - seeds all custom data
 * 
 * Run with: npx medusa exec src/scripts/seed-all.ts
 */
export default async function seedAll(args: ExecArgs) {
  logger.info("========================================")
  logger.info("Starting comprehensive data seeding...")
  logger.info("========================================\n")

  try {
    // Seed vendors (marketplace)
    logger.info("\n[1/5] VENDORS")
    logger.info("----------------------------------------")
    await seedVendors(args)

    // Seed bookable services
    logger.info("\n[2/5] BOOKABLE SERVICES")
    logger.info("----------------------------------------")
    await seedServices(args)

    // Seed subscription plans
    logger.info("\n[3/5] SUBSCRIPTION PLANS")
    logger.info("----------------------------------------")
    await seedSubscriptions(args)

    // Seed B2B companies
    logger.info("\n[4/5] B2B COMPANIES")
    logger.info("----------------------------------------")
    await seedCompanies(args)

    // Seed volume pricing
    logger.info("\n[5/5] VOLUME PRICING")
    logger.info("----------------------------------------")
    await seedVolumePricing(args)

    logger.info("\n========================================")
    logger.info("Data seeding completed successfully!")
    logger.info("========================================")
  } catch (error: any) {
    console.error("\n========================================")
    console.error("Data seeding failed!")
    console.error("Error:", error.message)
    console.error("========================================")
    throw error
  }
}
