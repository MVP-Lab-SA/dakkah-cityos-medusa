import { ExecArgs } from "@medusajs/framework/types";
import { createCustomerGroupsWorkflow } from "@medusajs/medusa/core-flows";
import { createSalesChannelsWorkflow } from "@medusajs/medusa/core-flows";
import { createLogger } from "../lib/logger"
const logger = createLogger("scripts:setup-defaults")

export default async function({ container }: ExecArgs) {
  logger.info("Setting up default configurations...\n");

  // Create Customer Groups
  logger.info("Creating customer groups...");
  try {
    const { result: customerGroups } = await createCustomerGroupsWorkflow(container).run({
      input: {
        customersData: [
          {
            name: "VIP",
            metadata: {
              description: "VIP customers with special pricing and perks"
            }
          },
          {
            name: "Wholesale",
            metadata: {
              description: "Wholesale customers with bulk pricing"
            }
          },
          {
            name: "B2B",
            metadata: {
              description: "Business customers"
            }
          }
        ]
      }
    });
    logger.info(`✓ Created ${customerGroups.length} customer groups`);
  } catch (error) {
    logger.info(String("Customer groups may already exist or error occurred:", error.message));
  }

  // Create Additional Sales Channels
  logger.info("\nCreating additional sales channels...");
  try {
    const { result: salesChannels } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [
          {
            name: "Mobile App",
            description: "Sales from mobile application",
            is_disabled: false
          },
          {
            name: "B2B Portal",
            description: "Dedicated portal for business customers",
            is_disabled: false
          },
          {
            name: "Wholesale",
            description: "Wholesale orders channel",
            is_disabled: false
          }
        ]
      }
    });
    logger.info(`✓ Created ${salesChannels.length} sales channels`);
  } catch (error) {
    logger.info(String("Sales channels may already exist or error occurred:", error.message));
  }

  logger.info("\n✓ Default setup complete!");
  logger.info("\nYou can now:");
  logger.info("1. Go to Admin → Settings → Customer Groups to manage groups");
  logger.info("2. Go to Admin → Settings → Sales Channels to manage channels");
  logger.info("3. Assign products to specific sales channels");
  logger.info("4. Create promotions targeting specific customer groups");
}
