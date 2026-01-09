import { MedusaContainer } from "@medusajs/framework/types";
import { retryFailedPaymentWorkflow } from "../workflows/subscription/retry-failed-payment-workflow";

export default async function retryFailedPayments(container: MedusaContainer) {
  const subscriptionModule = container.resolve("subscription");
  const logger = container.resolve("logger");
  
  logger.info("Starting failed payment retry job");
  
  try {
    // Find subscriptions that are past_due and due for retry
    const now = new Date();
    const { data: subscriptions } = await container.resolve("query").graph({
      entity: "subscription",
      fields: ["id", "customer_id", "retry_count", "max_retry_attempts"],
      filters: {
        status: "past_due",
        next_retry_at: { $lte: now.toISOString() },
      },
    });
    
    logger.info(`Found ${subscriptions?.length || 0} subscriptions to retry`);
    
    // Retry each subscription
    for (const subscription of subscriptions || []) {
      try {
        logger.info(`Retrying payment for subscription ${subscription.id}`);
        
        const { result } = await retryFailedPaymentWorkflow(container).run({
          input: { subscription_id: subscription.id },
        });
        
        logger.info(
          `Payment retry for subscription ${subscription.id}: ${result.status} - ${result.message}`
        );
      } catch (error) {
        logger.error(`Failed to retry payment for subscription ${subscription.id}:`, error);
        // Continue with next subscription
      }
    }
    
    logger.info("Failed payment retry job completed");
  } catch (error) {
    logger.error("Failed payment retry job failed:", error);
    throw error;
  }
}

// Schedule: Run twice daily at 9am and 5pm
export const config = {
  name: "retry-failed-payments",
  schedule: "0 9,17 * * *",
};
