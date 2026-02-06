import { ExecArgs } from "@medusajs/framework/types";
import { createCustomerGroupsWorkflow } from "@medusajs/medusa/core-flows";
import { createSalesChannelsWorkflow } from "@medusajs/medusa/core-flows";

export default async function({ container }: ExecArgs) {
  console.log("Setting up default configurations...\n");

  // Create Customer Groups
  console.log("Creating customer groups...");
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
    console.log(`✓ Created ${customerGroups.length} customer groups`);
  } catch (error) {
    console.log("Customer groups may already exist or error occurred:", error.message);
  }

  // Create Additional Sales Channels
  console.log("\nCreating additional sales channels...");
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
    console.log(`✓ Created ${salesChannels.length} sales channels`);
  } catch (error) {
    console.log("Sales channels may already exist or error occurred:", error.message);
  }

  console.log("\n✓ Default setup complete!");
  console.log("\nYou can now:");
  console.log("1. Go to Admin → Settings → Customer Groups to manage groups");
  console.log("2. Go to Admin → Settings → Sales Channels to manage channels");
  console.log("3. Assign products to specific sales channels");
  console.log("4. Create promotions targeting specific customer groups");
}
