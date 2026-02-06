import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { linkProductsToSalesChannelWorkflow } from "@medusajs/medusa/core-flows";

/**
 * Seed script for multi-tenant multi-store setup
 * Creates:
 * - 1 Main tenant (Dakkah Marketplace)
 * - 3 Stores (Saudi Traditional, Modern Fashion, Home Decor)
 * - Sales channels for each store
 * - Links products to stores via sales channels
 */
export default async function({ container }: ExecArgs) {
  console.log("Starting multi-tenant seed...\n");
  
  const tenantModuleService = container.resolve("tenant") as any;
  const storeModuleService = container.resolve("cityosStore") as any;
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL) as any;
  const query = container.resolve("query");
  
  // Step 1: Create or Retrieve Main Tenant
  console.log("=== STEP 1: Creating/Retrieving Tenant ===");
  const [existingTenants] = await tenantModuleService.listTenants({ handle: "dakkah-marketplace" });
  
  let tenant;
  if (existingTenants.length > 0) {
    tenant = existingTenants[0];
    console.log(`Found existing tenant: ${tenant.name} (ID: ${tenant.id})`);
  } else {
    tenant = await tenantModuleService.createTenants({
      handle: "dakkah-marketplace",
      name: "Dakkah Marketplace",
      country_id: "sa",
      scope_type: "theme",
      scope_id: "saudi-traditional",
      category_id: "retail",
      subcategory_id: "fashion",
      status: "active",
      subscription_tier: "enterprise",
      billing_email: "admin@mvplab.sa",
      subdomain: "dakkah",
      brand_colors: {
        primary: "#D97706",
        secondary: "#92400E",
        accent: "#F59E0B"
      },
      settings: {
        multi_store_enabled: true,
        marketplace_enabled: true
      }
    });
    console.log(`Created tenant: ${tenant.name} (ID: ${tenant.id})`);
  }
  
  // Step 2: Create Sales Channels for each store
  console.log("\n=== STEP 2: Creating Sales Channels ===");
  
  const saudiChannel = await salesChannelModule.createSalesChannels({
    name: "Saudi Traditional Store",
    description: "Saudi Traditional Wear & Cultural Products",
    is_disabled: false
  });
  console.log(`Created sales channel: ${saudiChannel.name}`);
  
  const modernChannel = await salesChannelModule.createSalesChannels({
    name: "Modern Fashion Store",
    description: "Contemporary Fashion & Accessories",
    is_disabled: false
  });
  console.log(`Created sales channel: ${modernChannel.name}`);
  
  const homeChannel = await salesChannelModule.createSalesChannels({
    name: "Home Decor Store",
    description: "Home Decor & Living Essentials",
    is_disabled: false
  });
  console.log(`Created sales channel: ${homeChannel.name}`);
  
  // Step 3: Create Stores
  console.log("\n=== STEP 3: Creating Stores ===");
  
  const saudiStore = await storeModuleService.createStores({
    tenant_id: tenant.id,
    handle: "saudi-traditional",
    name: "Saudi Traditional Wear",
    sales_channel_id: saudiChannel.id,
    subdomain: "saudi",
    status: "active",
    store_type: "retail",
    theme_config: {
      primary_color: "#D97706",
      secondary_color: "#92400E",
      font_family: "Inter"
    },
    seo_title: "Saudi Traditional Wear - Authentic Cultural Fashion",
    seo_description: "Discover authentic Saudi traditional wear, abayas, thobes, and cultural fashion",
    storefront_url: "https://saudi.dakkah.com"
  });
  console.log(`Created store: ${saudiStore.name} (subdomain: ${saudiStore.subdomain})`);
  
  const modernStore = await storeModuleService.createStores({
    tenant_id: tenant.id,
    handle: "modern-fashion",
    name: "Modern Fashion",
    sales_channel_id: modernChannel.id,
    subdomain: "modern",
    status: "active",
    store_type: "retail",
    theme_config: {
      primary_color: "#3B82F6",
      secondary_color: "#1E40AF",
      font_family: "Inter"
    },
    seo_title: "Modern Fashion - Contemporary Style & Trends",
    seo_description: "Shop the latest in contemporary fashion and accessories",
    storefront_url: "https://modern.dakkah.com"
  });
  console.log(`Created store: ${modernStore.name} (subdomain: ${modernStore.subdomain})`);
  
  const homeStore = await storeModuleService.createStores({
    tenant_id: tenant.id,
    handle: "home-decor",
    name: "Home Decor",
    sales_channel_id: homeChannel.id,
    subdomain: "home",
    status: "active",
    store_type: "retail",
    theme_config: {
      primary_color: "#10B981",
      secondary_color: "#047857",
      font_family: "Inter"
    },
    seo_title: "Home Decor - Transform Your Living Space",
    seo_description: "Beautiful home decor and living essentials for your space",
    storefront_url: "https://home.dakkah.com"
  });
  console.log(`Created store: ${homeStore.name} (subdomain: ${homeStore.subdomain})`);
  
  // Step 4: Link Products to Stores via Sales Channels
  console.log("\n=== STEP 4: Linking Products to Stores ===");
  
  // Get products by category/collection
  const products = await query.graph({
    entity: "product",
    fields: ["id", "title", "collection_id", "tags.*"],
  });
  
  console.log(`Found ${products.data.length} products to distribute`);
  
  // Collect products for each channel
  const saudiProducts: string[] = [];
  const modernProducts: string[] = [];
  const homeProducts: string[] = [];
  
  // Distribute products to stores based on tags/collections
  for (const product of products.data) {
    const productTitle = (product.title || "").toLowerCase();
    const tags = product.tags?.map((t: any) => t.value?.toLowerCase() || "") || [];
    
    // Saudi Traditional Store: traditional wear, abayas, cultural items
    if (
      tags.some((t: string) => t.includes("traditional") || t.includes("saudi") || t.includes("cultural")) ||
      productTitle.includes("abaya") ||
      productTitle.includes("thobe") ||
      productTitle.includes("traditional")
    ) {
      saudiProducts.push(product.id);
      console.log(`  - Will link "${product.title}" to Saudi Traditional Store`);
    }
    
    // Modern Fashion Store: contemporary fashion
    if (
      tags.some((t: string) => t.includes("modern") || t.includes("fashion") || t.includes("contemporary")) ||
      productTitle.includes("dress") ||
      productTitle.includes("shirt") ||
      productTitle.includes("casual")
    ) {
      modernProducts.push(product.id);
      console.log(`  - Will link "${product.title}" to Modern Fashion Store`);
    }
    
    // Home Decor Store: home items, decor
    if (
      tags.some((t: string) => t.includes("home") || t.includes("decor") || t.includes("living")) ||
      productTitle.includes("lamp") ||
      productTitle.includes("vase") ||
      productTitle.includes("cushion") ||
      productTitle.includes("decor")
    ) {
      homeProducts.push(product.id);
      console.log(`  - Will link "${product.title}" to Home Decor Store`);
    }
  }

  // Link products using workflow
  if (saudiProducts.length > 0) {
    await linkProductsToSalesChannelWorkflow(container).run({
      input: { id: saudiChannel.id, add: saudiProducts }
    });
    console.log(`Linked ${saudiProducts.length} products to Saudi Traditional Store`);
  }

  if (modernProducts.length > 0) {
    await linkProductsToSalesChannelWorkflow(container).run({
      input: { id: modernChannel.id, add: modernProducts }
    });
    console.log(`Linked ${modernProducts.length} products to Modern Fashion Store`);
  }

  if (homeProducts.length > 0) {
    await linkProductsToSalesChannelWorkflow(container).run({
      input: { id: homeChannel.id, add: homeProducts }
    });
    console.log(`Linked ${homeProducts.length} products to Home Decor Store`);
  }
  
  // Summary
  console.log("\n=== SEED COMPLETE ===");
  console.log(`Tenant: ${tenant.name}`);
  console.log(`Stores: 3`);
  console.log(`  - Saudi Traditional (${saudiStore.subdomain}.dakkah.com)`);
  console.log(`  - Modern Fashion (${modernStore.subdomain}.dakkah.com)`);
  console.log(`  - Home Decor (${homeStore.subdomain}.dakkah.com)`);
  console.log(`Sales Channels: 3`);
  console.log(`Products distributed across stores based on categories`);
}
