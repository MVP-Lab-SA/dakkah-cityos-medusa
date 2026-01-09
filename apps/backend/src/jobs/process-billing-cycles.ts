import { MedusaContainer } from "@medusajs/framework/types";
import { processBillingCycleWorkflow } from "../workflows/subscription/process-billing-cycle-workflow";

export default async function processBillingCycles(container: MedusaContainer) {
  const subscriptionModule = container.resolve("subscription");
  const logger = container.resolve("logger");
  
  logger.info("Starting billing cycle processor job");
  
  try {
    // Find all upcoming billing cycles that are due
    const now = new Date();
    const { data: dueCycles } = await container.resolve("query").graph({
      entity: "billing_cycle",
      fields: ["id", "subscription_id", "billing_date"],
      filters: {
        status: "upcoming",
        billing_date: { $lte: now.toISOString() },
      },
    });
    
    logger.info(`Found ${dueCycles?.length || 0} billing cycles to process`);
    
    // Process each cycle
    for (const cycle of dueCycles || []) {
      try {
        logger.info(`Processing billing cycle ${cycle.id}`);
        
        await processBillingCycleWorkflow(container).run({
          input: { billing_cycle_id: cycle.id },
        });
        
        logger.info(`Successfully processed billing cycle ${cycle.id}`);
      } catch (error) {
        logger.error(`Failed to process billing cycle ${cycle.id}:`, error);
        // Continue with next cycle
      }
    }
    
    logger.info("Billing cycle processor job completed");
  } catch (error) {
    logger.error("Billing cycle processor job failed:", error);
    throw error;
  }
}

// Schedule: Run every hour
export const config = {
  name: "process-billing-cycles",
  schedule: "0 * * * *", // Every hour
};
