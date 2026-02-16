import { ExecArgs } from "@medusajs/framework/types"
import { ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow, linkProductsToSalesChannelWorkflow } from "@medusajs/medusa/core-flows"
import { createLogger } from "../lib/logger"
const logger = createLogger("scripts:seed-saudi-products")

/**
 * Seed Saudi Arabian Products with Images
 * This script creates Saudi-themed products with generated images
 */

export default async function ({ container }: ExecArgs) {
  logger.info("Starting Saudi product seeding with images...")

  const query = container.resolve("query")
  
  // Get existing data
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  })
  
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle", "name"],
  })
  
  const saudiRegion = regions.find((r: any) => r.currency_code === "sar")
  const defaultChannel = salesChannels.find((sc: any) => sc.name === "Default Sales Channel")
  
  if (!saudiRegion) {
    logger.info("No Saudi region found. Please create one first.")
    return
  }
  
  logger.info(`Found Saudi region: ${saudiRegion.name}`)
  logger.info(`Found ${categories.length} categories`)
  logger.info(`Found ${salesChannels.length} sales channels`)
  
  const getCategoryId = (handle: string): string | undefined => {
    const category = categories.find((c: any) => c.handle === handle)
    return category?.id
  }
  
  // Saudi Products with Generated Images
  const saudiProducts = [
    {
      title: "Classic White Thobe",
      subtitle: "Traditional Saudi men's thobe",
      description: "Premium quality white thobe made from finest cotton. Perfect for daily wear and special occasions. Features traditional Saudi cut with modern comfort.",
      handle: "classic-white-thobe",
      status: ProductStatus.PUBLISHED,
      images: [
        { url: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1591047990795-ec42a0f36e29?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80" }
      ],
      category_ids: getCategoryId("mens-thobes") ? [getCategoryId("mens-thobes")!] : [],
      variants: [
        {
          title: "Small",
          sku: "THOBE-WH-SM",
          prices: [
            { amount: 200, currency_code: "sar" },
            { amount: 53, currency_code: "usd" }
          ],
          manage_inventory: true,
        },
        {
          title: "Medium",
          sku: "THOBE-WH-MD",
          prices: [
            { amount: 200, currency_code: "sar" },
            { amount: 53, currency_code: "usd" }
          ],
          manage_inventory: true,
        },
        {
          title: "Large",
          sku: "THOBE-WH-LG",
          prices: [
            { amount: 200, currency_code: "sar" },
            { amount: 53, currency_code: "usd" }
          ],
          manage_inventory: true,
        },
      ],
    },
    {
      title: "Classic Black Abaya",
      subtitle: "Traditional women's abaya",
      description: "Elegant black abaya made from premium fabric. Features flowing design with comfortable fit. Perfect for daily wear and special occasions.",
      handle: "classic-black-abaya",
      status: ProductStatus.PUBLISHED,
      images: [
        { url: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1595777707802-c9b1fcf46264?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&q=80" }
      ],
      category_ids: getCategoryId("womens-abayas") ? [getCategoryId("womens-abayas")!] : [],
      variants: [
        {
          title: "Size 54",
          sku: "ABAYA-BK-54",
          prices: [
            { amount: 250, currency_code: "sar" },
            { amount: 67, currency_code: "usd" }
          ],
          manage_inventory: true,
        },
        {
          title: "Size 56",
          sku: "ABAYA-BK-56",
          prices: [
            { amount: 250, currency_code: "sar" },
            { amount: 67, currency_code: "usd" }
          ],
          manage_inventory: true,
        },
        {
          title: "Size 58",
          sku: "ABAYA-BK-58",
          prices: [
            { amount: 250, currency_code: "sar" },
            { amount: 67, currency_code: "usd" }
          ],
          manage_inventory: true,
        },
      ],
    },
    {
      title: "Red & White Shemagh",
      subtitle: "Traditional Saudi headwear",
      description: "Authentic red and white checkered shemagh. Made from premium cotton for comfort and style. A traditional symbol of Saudi Arabian heritage.",
      handle: "red-white-shemagh",
      status: ProductStatus.PUBLISHED,
      images: [
        { url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1554895917-82f97b32fd86?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80" }
      ],
      category_ids: getCategoryId("shemagh-ghutra") ? [getCategoryId("shemagh-ghutra")!] : [],
      variants: [
        {
          title: "Standard",
          sku: "SHMGH-RW-STD",
          prices: [
            { amount: 80, currency_code: "sar" },
            { amount: 21, currency_code: "usd" }
          ],
          manage_inventory: true,
        },
      ],
    },
    {
      title: "Premium Cambodian Oud Oil",
      subtitle: "Luxury oud fragrance",
      description: "Rare Cambodian oud oil aged for 10 years. Rich, complex aroma perfect for special occasions. Comes in elegant crystal bottle with gold accents. 10ml.",
      handle: "cambodian-oud-oil",
      status: ProductStatus.PUBLISHED,
      images: [
        { url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1590080876-a370317a9e70?w=800&q=80" }
      ],
      category_ids: getCategoryId("oud-oil") ? [getCategoryId("oud-oil")!] : getCategoryId("fragrances-oud") ? [getCategoryId("fragrances-oud")!] : [],
      variants: [
        {
          title: "10ml",
          sku: "OUD-CAM-10ML",
          prices: [
            { amount: 1200, currency_code: "sar" },
            { amount: 320, currency_code: "usd" }
          ],
          manage_inventory: true,
        },
        {
          title: "20ml",
          sku: "OUD-CAM-20ML",
          prices: [
            { amount: 2200, currency_code: "sar" },
            { amount: 587, currency_code: "usd" }
          ],
          manage_inventory: true,
        },
      ],
    },
    {
      title: "Ajwa Dates - Madinah",
      subtitle: "Premium dates from Madinah",
      description: "Authentic Ajwa dates from Al-Madinah. Known for their health benefits and spiritual significance. Soft, sweet, and delicious. Perfect gift for Ramadan.",
      handle: "ajwa-dates-madinah",
      status: ProductStatus.PUBLISHED,
      images: [
        { url: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1488477807830-63789f68bb65?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1599599810694-b5ac4dd19b90?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1599599810991-eb3c14e4159f?w=800&q=80" }
      ],
      category_ids: getCategoryId("premium-dates") ? [getCategoryId("premium-dates")!] : getCategoryId("dates-sweets") ? [getCategoryId("dates-sweets")!] : [],
      variants: [
        {
          title: "500g",
          sku: "DATE-AJWA-500G",
          prices: [
            { amount: 80, currency_code: "sar" },
            { amount: 21, currency_code: "usd" }
          ],
          manage_inventory: true,
        },
        {
          title: "1kg",
          sku: "DATE-AJWA-1KG",
          prices: [
            { amount: 150, currency_code: "sar" },
            { amount: 40, currency_code: "usd" }
          ],
          manage_inventory: true,
        },
      ],
    },
    {
      title: "Saudi Khawlani Coffee",
      subtitle: "Premium Arabic coffee beans",
      description: "Finest Khawlani coffee beans from the mountains of Saudi Arabia. Traditionally ground with cardamom. Perfect for serving guests in the traditional Arabian hospitality style.",
      handle: "saudi-khawlani-coffee",
      status: ProductStatus.PUBLISHED,
      images: [
        { url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1559056199-641a0ac8b8d5?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1582514959869-ea8c16ceb1f1?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80" }
      ],
      category_ids: getCategoryId("arabic-coffee") ? [getCategoryId("arabic-coffee")!] : getCategoryId("coffee-tea") ? [getCategoryId("coffee-tea")!] : [],
      variants: [
        {
          title: "250g",
          sku: "COFF-KHAW-250G",
          prices: [
            { amount: 45, currency_code: "sar" },
            { amount: 12, currency_code: "usd" }
          ],
          manage_inventory: true,
        },
        {
          title: "500g",
          sku: "COFF-KHAW-500G",
          prices: [
            { amount: 85, currency_code: "sar" },
            { amount: 23, currency_code: "usd" }
          ],
          manage_inventory: true,
        },
        {
          title: "1kg",
          sku: "COFF-KHAW-1KG",
          prices: [
            { amount: 160, currency_code: "sar" },
            { amount: 43, currency_code: "usd" }
          ],
          manage_inventory: true,
        },
      ],
    },
  ]
  
  // Create products
  logger.info(`\nCreating ${saudiProducts.length} Saudi products...`)
  let createdCount = 0
  const createdProductIds: string[] = []
  
  for (const product of saudiProducts) {
    try {
      const { result } = await createProductsWorkflow(container).run({
        input: { products: [product as any] },
      })
      createdCount++
      if (result[0]?.id) {
        createdProductIds.push(result[0].id)
      }
      logger.info(`  Created: ${product.title}`)
    } catch (error: any) {
      if (error.message?.includes("already exists")) {
        logger.info(`  Skipped (exists): ${product.title}`)
      } else {
        logger.info(`  Error creating ${product.title}: ${error.message}`)
      }
    }
  }

  // Link products to sales channel
  if (defaultChannel && createdProductIds.length > 0) {
    try {
      await linkProductsToSalesChannelWorkflow(container).run({
        input: {
          id: defaultChannel.id,
          add: createdProductIds,
        },
      })
      logger.info(`Linked ${createdProductIds.length} products to ${defaultChannel.name}`)
    } catch (error: any) {
      logger.info(`Error linking products to sales channel: ${error.message}`)
    }
  }
  
  logger.info(`\nSaudi product seeding completed!`)
  logger.info(`Summary:`)
  logger.info(`  - Products created: ${createdCount}`)
  logger.info(`  - All products have professional images`)
  logger.info(`  - Prices in SAR (Saudi Riyal)`)
}
