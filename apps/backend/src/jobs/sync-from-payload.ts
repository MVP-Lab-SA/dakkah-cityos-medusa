import { MedusaContainer } from "@medusajs/framework/types";
import { PayloadToMedusaSync } from "../integrations/payload-sync";
import { logger } from "../observability";

export default async function syncFromPayloadJob(container: MedusaContainer) {
  const startTime = Date.now();
  logger.info("Starting Payload → Medusa sync job");

  const syncService = new PayloadToMedusaSync(container, {
    payloadUrl: process.env.PAYLOAD_URL!,
    payloadApiKey: process.env.PAYLOAD_API_KEY!,
  });

  try {
    // Sync pending product content
    const result = await syncService.syncPendingProductContent();
    logger.info("Product content sync complete", {
      success: result.success,
      failed: result.failed,
    });

    if (result.errors.length > 0) {
      logger.warn("Product content sync errors", {
        errors: result.errors.slice(0, 10),
      });
    }

    const duration = (Date.now() - startTime) / 1000;
    logger.info("Payload → Medusa sync job complete", { duration });
  } catch (error) {
    logger.error("Payload → Medusa sync job failed", error as Error);
    throw error;
  }
}
