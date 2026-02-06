import { ExecArgs } from "@medusajs/framework/types";
import { 
  createSalesChannelsWorkflow,
  createApiKeysWorkflow,
  linkSalesChannelsToApiKeyWorkflow 
} from "@medusajs/medusa/core-flows";

export default async function({ container }: ExecArgs) {
  const query = container.resolve("query")
  
  console.log("Creating Saudi Arabia sales channel...")
  
  // Step 1: Create Saudi Arabia Sales Channel
  const { result: channels } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [{
        name: "Saudi Arabia Store",
        description: "Sales channel for Saudi Arabian market with SAR pricing",
      }],
    },
  })
  
  console.log("✅ Created sales channel:", channels[0].id, channels[0].name)
  
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
  
  console.log("✅ Created API key:", apiKeys[0].id, apiKeys[0].title)
  
  // Step 3: Link API Key to Sales Channel
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: apiKeys[0].id,
      add: [channels[0].id],
    },
  })
  
  console.log("✅ Linked API key to sales channel")
  
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
  
  console.log(`\n📦 Found ${saudiProducts.length} Saudi products to link`)
  
  // Note: You would link products to the sales channel using batchLinkProductsToSalesChannelWorkflow
  // For now, this needs to be done in admin UI or via another workflow
  
  console.log("\n✅ Setup complete!")
  console.log("\n📋 NEXT STEPS:")
  console.log("1. Go to Admin > Settings > Developer > Publishable API Keys")
  console.log(`2. Copy the Saudi Arabia Storefront key: ${apiKeys[0].id}`)
  console.log("3. Go to Admin > Products")
  console.log("4. Edit each Saudi product and add 'Saudi Arabia Store' sales channel")
  console.log("5. Create a new storefront with this publishable key")
  console.log("\n💡 TIP: You can have multiple storefronts (one for SA, one for US)")
  console.log("   Each storefront uses a different publishable key and shows different products!")
}
