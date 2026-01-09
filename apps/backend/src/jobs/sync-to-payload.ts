import { MedusaContainer } from "@medusajs/framework/types";
import { MedusaToPayloadSync } from "../integrations/payload-sync";
import { logger } from "../observability";

export default async function syncToPayloadJob(container: MedusaContainer) {
  const startTime = Date.now();
  logger.info("Starting Medusa → Payload sync job");

  const syncService = new MedusaToPayloadSync(container, {
    payloadUrl: process.env.PAYLOAD_URL!,
    payloadApiKey: process.env.PAYLOAD_API_KEY!,
  });

  try {
    // Sync all products
    const productResult = await syncService.syncAllProducts();
    logger.info("Product sync complete", {
      success: productResult.success,
      failed: productResult.failed,
    });

    if (productResult.errors.length > 0) {
      logger.warn("Product sync errors", {
        errors: productResult.errors.slice(0, 10), // Log first 10 errors
      });
    }

    const duration = (Date.now() - startTime) / 1000;
    logger.info("Medusa → Payload sync job complete", { duration });
  } catch (error) {
    logger.error("Medusa → Payload sync job failed", error as Error);
    throw error;
  }
}
