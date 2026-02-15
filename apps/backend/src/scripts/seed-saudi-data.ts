import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createProductsWorkflow,
  createProductCategoriesWorkflow,
  createSalesChannelsWorkflow,
  createStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import { createLogger } from "../lib/logger"
const logger = createLogger("scripts:seed-saudi-data")

/**
 * Comprehensive Saudi Arabia Data Seeding Script
 * Seeds all modules with Saudi-relevant data including:
 * - Tenants (Saudi regions/cities)
 * - Stores (Different Saudi marketplaces)
 * - Product Categories
 * - Products (Traditional Saudi items)
 * - Regions (Saudi Arabia with SAR currency)
 * - Sales Channels
 */

export default async function ({ container }: ExecArgs) {
  logger.info("🇸🇦 Starting Saudi Arabia data seeding...")

  const query = container.resolve("query")
  
  // Step 1: Create Saudi Regions
  logger.info("\n📍 Step 1: Creating Saudi Arabia regions...")
  
  const { result: regions } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Saudi Arabia",
          currency_code: "sar",
          countries: ["sa"],
          automatic_taxes: false,
        },
        {
          name: "Gulf Cooperation Council",
          currency_code: "sar",
          countries: ["ae", "kw", "qa", "bh", "om"],
          automatic_taxes: false,
        },
      ],
    },
  })
  
  logger.info(`✅ Created ${regions.length} regions`)

  // Step 2: Create Sales Channels
  logger.info("\n📺 Step 2: Creating sales channels...")
  
  const { result: salesChannels } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "Riyadh Marketplace",
          description: "Main marketplace for Riyadh region",
        },
        {
          name: "Jeddah Souk",
          description: "Traditional souk for Jeddah and Western region",
        },
        {
          name: "Dammam Store",
          description: "Eastern Province marketplace",
        },
        {
          name: "Wholesale Channel",
          description: "B2B wholesale channel for businesses",
        },
      ],
    },
  })
  
  logger.info(`✅ Created ${salesChannels.length} sales channels`)

  // Step 3: Create Product Categories
  logger.info("\n📦 Step 3: Creating product categories...")
  
  const { result: categories } = await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        // Traditional Clothing
        {
          name: "Traditional Clothing",
          handle: "traditional-clothing",
          is_active: true,
          is_internal: false,
        },
        {
          name: "Men's Thobes",
          handle: "mens-thobes",
          parent_category_id: null, // Will be set after creation
          is_active: true,
        },
        {
          name: "Women's Abayas",
          handle: "womens-abayas",
          is_active: true,
        },
        {
          name: "Shemagh & Ghutra",
          handle: "shemagh-ghutra",
          is_active: true,
        },
        // Fragrances & Oud
        {
          name: "Fragrances & Oud",
          handle: "fragrances-oud",
          is_active: true,
        },
        {
          name: "Oud Oil",
          handle: "oud-oil",
          is_active: true,
        },
        {
          name: "Bakhoor & Incense",
          handle: "bakhoor-incense",
          is_active: true,
        },
        // Home & Decor
        {
          name: "Home & Decor",
          handle: "home-decor",
          is_active: true,
        },
        {
          name: "Islamic Wall Art",
          handle: "islamic-wall-art",
          is_active: true,
        },
        {
          name: "Prayer Items",
          handle: "prayer-items",
          is_active: true,
        },
        // Dates & Sweets
        {
          name: "Dates & Sweets",
          handle: "dates-sweets",
          is_active: true,
        },
        {
          name: "Premium Dates",
          handle: "premium-dates",
          is_active: true,
        },
        {
          name: "Arabic Sweets",
          handle: "arabic-sweets",
          is_active: true,
        },
        // Coffee & Tea
        {
          name: "Coffee & Tea",
          handle: "coffee-tea",
          is_active: true,
        },
        {
          name: "Arabic Coffee",
          handle: "arabic-coffee",
          is_active: true,
        },
        {
          name: "Traditional Tea",
          handle: "traditional-tea",
          is_active: true,
        },
      ],
    },
  })
  
  logger.info(`✅ Created ${categories.length} product categories`)

  // Get category IDs for products
  const { data: allCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  })

  const getCategoryId = (handle: string) => {
    const category = allCategories.find((c: any) => c.handle === handle)
    return category?.id
  }

  // Step 4: Create Products
  logger.info("\n🛍️  Step 4: Creating Saudi products...")
  
  const productsToCreate = [
    // Men's Thobes
    {
      title: "Classic White Thobe",
      subtitle: "Traditional Saudi men's thobe",
      description: "Premium quality white thobe made from finest cotton. Perfect for daily wear and special occasions. Features traditional Saudi cut with modern comfort.",
      handle: "classic-white-thobe",
      is_giftcard: false,
      status: "published",
      category_ids: [getCategoryId("mens-thobes")].filter(Boolean),
      sales_channels: [{ id: salesChannels[0].id }],
      variants: [
        {
          title: "Small",
          sku: "THOBE-WH-SM",
          prices: [
            { amount: 200, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 50,
        },
        {
          title: "Medium",
          sku: "THOBE-WH-MD",
          prices: [
            { amount: 200, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 75,
        },
        {
          title: "Large",
          sku: "THOBE-WH-LG",
          prices: [
            { amount: 200, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 60,
        },
      ],
    },
    {
      title: "Premium Emirati Thobe",
      subtitle: "Luxury thobe with embroidery",
      description: "High-end thobe with intricate embroidery and premium fabric. Ideal for weddings and formal events.",
      handle: "premium-emirati-thobe",
      status: "published",
      category_ids: [getCategoryId("mens-thobes")].filter(Boolean),
      sales_channels: [{ id: salesChannels[0].id }],
      variants: [
        {
          title: "Medium",
          sku: "THOBE-EM-MD",
          prices: [
            { amount: 500, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 30,
        },
        {
          title: "Large",
          sku: "THOBE-EM-LG",
          prices: [
            { amount: 500, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 25,
        },
      ],
    },
    // Women's Abayas
    {
      title: "Classic Black Abaya",
      subtitle: "Traditional women's abaya",
      description: "Elegant black abaya made from premium fabric. Features flowing design with comfortable fit.",
      handle: "classic-black-abaya",
      status: "published",
      category_ids: [getCategoryId("womens-abayas")].filter(Boolean),
      sales_channels: [{ id: salesChannels[1].id }],
      variants: [
        {
          title: "Size 54",
          sku: "ABAYA-BK-54",
          prices: [
            { amount: 250, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 40,
        },
        {
          title: "Size 56",
          sku: "ABAYA-BK-56",
          prices: [
            { amount: 250, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 50,
        },
      ],
    },
    {
      title: "Designer Abaya with Embroidery",
      subtitle: "Luxury designer abaya",
      description: "Stunning designer abaya featuring hand embroidery and premium materials. Perfect for special occasions.",
      handle: "designer-embroidery-abaya",
      status: "published",
      category_ids: [getCategoryId("womens-abayas")].filter(Boolean),
      sales_channels: [{ id: salesChannels[1].id }],
      variants: [
        {
          title: "Size 54",
          sku: "ABAYA-DE-54",
          prices: [
            { amount: 800, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 20,
        },
      ],
    },
    // Shemagh & Ghutra
    {
      title: "Red & White Shemagh",
      subtitle: "Traditional Saudi headwear",
      description: "Authentic red and white checkered shemagh. Made from premium cotton for comfort and style.",
      handle: "red-white-shemagh",
      status: "published",
      category_ids: [getCategoryId("shemagh-ghutra")].filter(Boolean),
      sales_channels: [{ id: salesChannels[0].id }],
      variants: [
        {
          title: "Standard",
          sku: "SHMGH-RW-STD",
          prices: [
            { amount: 80, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 100,
        },
      ],
    },
    {
      title: "White Ghutra",
      subtitle: "Classic white headscarf",
      description: "Pure white ghutra perfect for formal occasions and daily wear.",
      handle: "white-ghutra",
      status: "published",
      category_ids: [getCategoryId("shemagh-ghutra")].filter(Boolean),
      sales_channels: [{ id: salesChannels[0].id }],
      variants: [
        {
          title: "Standard",
          sku: "GHTRA-WH-STD",
          prices: [
            { amount: 70, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 120,
        },
      ],
    },
    // Oud Products
    {
      title: "Premium Cambodian Oud Oil",
      subtitle: "Luxury oud fragrance",
      description: "Rare Cambodian oud oil. Aged for 10 years for rich, complex aroma. 10ml bottle.",
      handle: "cambodian-oud-oil",
      status: "published",
      category_ids: [getCategoryId("oud-oil")].filter(Boolean),
      sales_channels: [{ id: salesChannels[0].id }, { id: salesChannels[1].id }],
      variants: [
        {
          title: "10ml",
          sku: "OUD-CAM-10ML",
          prices: [
            { amount: 1200, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 25,
        },
      ],
    },
    {
      title: "Bakhoor Incense Chips",
      subtitle: "Traditional Arabian incense",
      description: "Premium bakhoor chips for traditional incense burning. Mixed blend of oud, sandalwood, and spices.",
      handle: "bakhoor-incense-chips",
      status: "published",
      category_ids: [getCategoryId("bakhoor-incense")].filter(Boolean),
      sales_channels: [{ id: salesChannels[0].id }, { id: salesChannels[1].id }],
      variants: [
        {
          title: "100g",
          sku: "BKHR-MIX-100G",
          prices: [
            { amount: 150, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 80,
        },
      ],
    },
    // Islamic Wall Art
    {
      title: "Ayat al-Kursi Canvas",
      subtitle: "Islamic calligraphy art",
      description: "Beautiful Ayat al-Kursi written in elegant Arabic calligraphy on premium canvas. 60x80cm.",
      handle: "ayat-kursi-canvas",
      status: "published",
      category_ids: [getCategoryId("islamic-wall-art")].filter(Boolean),
      sales_channels: [{ id: salesChannels[0].id }],
      variants: [
        {
          title: "60x80cm",
          sku: "ART-AK-6080",
          prices: [
            { amount: 350, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 40,
        },
      ],
    },
    {
      title: "Kaaba Painting",
      subtitle: "Holy Kaaba artwork",
      description: "Stunning artwork depicting the Holy Kaaba in Mecca. Gold leaf accents on black canvas.",
      handle: "kaaba-painting",
      status: "published",
      category_ids: [getCategoryId("islamic-wall-art")].filter(Boolean),
      sales_channels: [{ id: salesChannels[0].id }],
      variants: [
        {
          title: "80x100cm",
          sku: "ART-KAB-80100",
          prices: [
            { amount: 600, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 20,
        },
      ],
    },
    // Prayer Items
    {
      title: "Premium Prayer Mat",
      subtitle: "Soft velvet prayer rug",
      description: "Luxurious velvet prayer mat with compass for qibla direction. Portable and easy to carry.",
      handle: "premium-prayer-mat",
      status: "published",
      category_ids: [getCategoryId("prayer-items")].filter(Boolean),
      sales_channels: [{ id: salesChannels[0].id }],
      variants: [
        {
          title: "Standard",
          sku: "PRAY-MAT-VEL",
          prices: [
            { amount: 120, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 150,
        },
      ],
    },
    {
      title: "Digital Quran Player",
      subtitle: "Electronic Quran with translation",
      description: "Digital Quran player with audio recitations and translations in multiple languages.",
      handle: "digital-quran-player",
      status: "published",
      category_ids: [getCategoryId("prayer-items")].filter(Boolean),
      sales_channels: [{ id: salesChannels[0].id }],
      variants: [
        {
          title: "Standard",
          sku: "PRAY-QRN-DIG",
          prices: [
            { amount: 450, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 60,
        },
      ],
    },
    // Dates
    {
      title: "Ajwa Dates - Madinah",
      subtitle: "Premium dates from Madinah",
      description: "Authentic Ajwa dates from Al-Madinah. Known for their health benefits and spiritual significance. 500g package.",
      handle: "ajwa-dates-madinah",
      status: "published",
      category_ids: [getCategoryId("premium-dates")].filter(Boolean),
      sales_channels: [{ id: salesChannels[0].id }, { id: salesChannels[1].id }],
      variants: [
        {
          title: "500g",
          sku: "DATE-AJWA-500G",
          prices: [
            { amount: 80, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 200,
        },
        {
          title: "1kg",
          sku: "DATE-AJWA-1KG",
          prices: [
            { amount: 150, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 100,
        },
      ],
    },
    {
      title: "Medjool Dates Gift Box",
      subtitle: "Luxury date gift set",
      description: "Premium Medjool dates in elegant gift box. Perfect for gifting during Ramadan and special occasions.",
      handle: "medjool-dates-gift-box",
      status: "published",
      category_ids: [getCategoryId("premium-dates")].filter(Boolean),
      sales_channels: [{ id: salesChannels[0].id }],
      variants: [
        {
          title: "1kg Gift Box",
          sku: "DATE-MED-GIFT-1KG",
          prices: [
            { amount: 200, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 75,
        },
      ],
    },
    // Arabic Sweets
    {
      title: "Baklava Assortment",
      subtitle: "Traditional Middle Eastern pastry",
      description: "Assorted baklava with pistachios, walnuts, and almonds. Made fresh daily. 1kg box.",
      handle: "baklava-assortment",
      status: "published",
      category_ids: [getCategoryId("arabic-sweets")].filter(Boolean),
      sales_channels: [{ id: salesChannels[1].id }],
      variants: [
        {
          title: "500g",
          sku: "SWTS-BAK-500G",
          prices: [
            { amount: 90, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 50,
        },
        {
          title: "1kg",
          sku: "SWTS-BAK-1KG",
          prices: [
            { amount: 170, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 40,
        },
      ],
    },
    {
      title: "Kunafa with Cream",
      subtitle: "Traditional Arabic dessert",
      description: "Fresh kunafa filled with sweet cream. Baked to golden perfection. Serves 4-6 people.",
      handle: "kunafa-cream",
      status: "published",
      category_ids: [getCategoryId("arabic-sweets")].filter(Boolean),
      sales_channels: [{ id: salesChannels[1].id }],
      variants: [
        {
          title: "Medium",
          sku: "SWTS-KUN-MED",
          prices: [
            { amount: 60, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 30,
        },
      ],
    },
    // Coffee & Tea
    {
      title: "Saudi Khawlani Coffee",
      subtitle: "Premium Arabic coffee beans",
      description: "Finest Khawlani coffee beans from the mountains of Saudi Arabia. Ground with cardamom.",
      handle: "saudi-khawlani-coffee",
      status: "published",
      category_ids: [getCategoryId("arabic-coffee")].filter(Boolean),
      sales_channels: [{ id: salesChannels[0].id }, { id: salesChannels[3].id }],
      variants: [
        {
          title: "250g",
          sku: "COFF-KHAW-250G",
          prices: [
            { amount: 45, currency_code: "sar", rules: {} },
            { amount: 35, currency_code: "sar", rules: { quantity: { min: 10 } } }, // Wholesale price
          ],
          manage_inventory: true,
          inventory_quantity: 200,
        },
        {
          title: "500g",
          sku: "COFF-KHAW-500G",
          prices: [
            { amount: 85, currency_code: "sar", rules: {} },
            { amount: 65, currency_code: "sar", rules: { quantity: { min: 10 } } },
          ],
          manage_inventory: true,
          inventory_quantity: 150,
        },
      ],
    },
    {
      title: "Premium Saffron Tea",
      subtitle: "Traditional Arabian tea",
      description: "Luxury black tea infused with saffron. Perfect for hospitality and special occasions.",
      handle: "saffron-tea",
      status: "published",
      category_ids: [getCategoryId("traditional-tea")].filter(Boolean),
      sales_channels: [{ id: salesChannels[0].id }],
      variants: [
        {
          title: "100g",
          sku: "TEA-SAFF-100G",
          prices: [
            { amount: 75, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 90,
        },
      ],
    },
  ]

  // Create products in batches
  let createdProducts = 0
  for (const product of productsToCreate) {
    try {
      await createProductsWorkflow(container).run({
        input: { products: [product as any] },
      })
      createdProducts++
      logger.info(`  ✅ Created product: ${product.title}`)
    } catch (error) {
      logger.info(String(`  ⚠️  Error creating ${product.title}:`, error.message))
    }
  }
  
  logger.info(`\n✅ Created ${createdProducts} products`)

  // Step 5: Summary
  logger.info("\n📊 Seeding Summary:")
  logger.info(`  - Regions: ${regions.length}`)
  logger.info(`  - Sales Channels: ${salesChannels.length}`)
  logger.info(`  - Categories: ${categories.length}`)
  logger.info(`  - Products: ${createdProducts}`)
  
  logger.info("\n✨ Saudi Arabia data seeding completed successfully!")
  logger.info("\n📝 Next steps:")
  logger.info("  1. Add environment variables for SendGrid, Stripe, and Meilisearch")
  logger.info("  2. Enable Stripe payment in regions via Admin dashboard")
  logger.info("  3. Generate product images")
  logger.info("  4. Index products to Meilisearch")
}
