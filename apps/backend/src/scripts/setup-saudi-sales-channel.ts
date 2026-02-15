import { ExecArgs } from "@medusajs/framework/types";
import { 
  createSalesChannelsWorkflow,
  createApiKeysWorkflow,
  linkSalesChannelsToApiKeyWorkflow 
} from "@medusajs/medusa/core-flows";
import { createLogger } from "../lib/logger"
const logger = createLogger("scripts:setup-saudi-sales-channel")

export default async function({ container }: ExecArgs) {
  const query = container.resolve("query")
  
  logger.info("Creating Saudi Arabia sales channel...")
  
  // Step 1: Create Saudi Arabia Sales Channel
  const { result: channels } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [{
        name: "Saudi Arabia Store",
        description: "Sales channel for Saudi Arabian market with SAR pricing",
      }],
    },
  })
  
  logger.info(String("✅ Created sales channel:", channels[0].id, channels[0].name))
  
  // Step 2: Create Publishable API Key for Saudi Store
  const { result: apiKeys } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [{
        title: "Saudi Arabia Storefront",
        type: "publishable",
        created_by: "system",
      }],
    },
  })
  
  
  // Step 3: Link API Key to Sales Channel
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: apiKeys[0].id,
      add: [channels[0].id],
    },
  })
  
  logger.info("✅ Linked API key to sales channel")
  
  // Step 4: Get all Saudi products and assign to new channel
  const { data: saudiProducts } = await query.graph({
    entity: "product",
    fields: ["id", "title"],
    filters: {
      handle: {
        $in: [
          "classic-white-thobe",
          "elegant-black-abaya", 
          "royal-oud-oil",
          "arabian-bakhoor",
          "islamic-calligraphy-wall-art",
          "premium-prayer-mat"
        ]
      }
    }
  })
  
  logger.info(`\n📦 Found ${saudiProducts.length} Saudi products to link`)
  
  // Note: You would link products to the sales channel using batchLinkProductsToSalesChannelWorkflow
  // For now, this needs to be done in admin UI or via another workflow
  
  logger.info("\n✅ Setup complete!")
  logger.info("\n📋 NEXT STEPS:")
  logger.info("1. Go to Admin > Settings > Developer > Publishable API Keys")
  logger.info("2. Copy the Saudi Arabia Storefront key from the admin panel")
  logger.info("3. Go to Admin > Products")
  logger.info("4. Edit each Saudi product and add 'Saudi Arabia Store' sales channel")
  logger.info("5. Create a new storefront with this publishable key")
  logger.info("\n💡 TIP: You can have multiple storefronts (one for SA, one for US)")
  logger.info("   Each storefront uses a different publishable key and shows different products!")
}
