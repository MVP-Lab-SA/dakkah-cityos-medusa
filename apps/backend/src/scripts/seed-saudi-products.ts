import { ExecArgs } from "@medusajs/framework/types"
import { ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow, linkProductsToSalesChannelWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Seed Saudi Arabian Products with Images
 * This script creates Saudi-themed products with generated images
 */

export default async function ({ container }: ExecArgs) {
  console.log("Starting Saudi product seeding with images...")

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
    console.log("No Saudi region found. Please create one first.")
    return
  }
  
  console.log(`Found Saudi region: ${saudiRegion.name}`)
  console.log(`Found ${categories.length} categories`)
  console.log(`Found ${salesChannels.length} sales channels`)
  
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
        { url: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&q=80" }
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
        { url: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80" }
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
        { url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80" }
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
        { url: "https://images.unsplash.com/photo-1594035910387-fea081acb591?w=800&q=80" }
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
        { url: "https://images.unsplash.com/photo-1563699743-35a41d15c232?w=800&q=80" }
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
        { url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80" }
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
  console.log(`\nCreating ${saudiProducts.length} Saudi products...`)
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
      console.log(`  Created: ${product.title}`)
    } catch (error: any) {
      if (error.message?.includes("already exists")) {
        console.log(`  Skipped (exists): ${product.title}`)
      } else {
        console.log(`  Error creating ${product.title}:`, error.message)
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
      console.log(`Linked ${createdProductIds.length} products to ${defaultChannel.name}`)
    } catch (error: any) {
      console.log(`Error linking products to sales channel:`, error.message)
    }
  }
  
  console.log(`\nSaudi product seeding completed!`)
  console.log(`Summary:`)
  console.log(`  - Products created: ${createdCount}`)
  console.log(`  - All products have professional images`)
  console.log(`  - Prices in SAR (Saudi Riyal)`)
}
