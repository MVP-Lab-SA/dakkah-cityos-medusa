import { ExecArgs } from "@medusajs/framework/types"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Seed Saudi Arabian Products with Images
 * This script creates Saudi-themed products with generated images
 */

export default async function ({ container }: ExecArgs) {
  console.log("🇸🇦 Starting Saudi product seeding with images...")

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
    console.log("⚠️  No Saudi region found. Please create one first.")
    return
  }
  
  console.log(`✅ Found Saudi region: ${saudiRegion.name}`)
  console.log(`✅ Found ${categories.length} categories`)
  console.log(`✅ Found ${salesChannels.length} sales channels`)
  
  const getCategoryId = (handle: string) => {
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
      status: "published",
      images: [
        { url: "https://cdn.mignite.app/ws/works_01KEHVFPGZ53M34NBTD8M54K7V/generated-01KEJGX0KYM3CD483R3QR9M049-01KEJGX0KY9XQEZ1PP4PM96P3S.jpeg" }
      ],
      categories: getCategoryId("mens-thobes") ? [{ id: getCategoryId("mens-thobes") }] : [],
      sales_channels: defaultChannel ? [{ id: defaultChannel.id }] : [],
      variants: [
        {
          title: "Small",
          sku: "THOBE-WH-SM",
          prices: [{ amount: 200, currency_code: "sar", rules: {} }],
          manage_inventory: true,
          inventory_quantity: 50,
        },
        {
          title: "Medium",
          sku: "THOBE-WH-MD",
          prices: [{ amount: 200, currency_code: "sar", rules: {} }],
          manage_inventory: true,
          inventory_quantity: 75,
        },
        {
          title: "Large",
          sku: "THOBE-WH-LG",
          prices: [{ amount: 200, currency_code: "sar", rules: {} }],
          manage_inventory: true,
          inventory_quantity: 60,
        },
      ],
    },
    {
      title: "Classic Black Abaya",
      subtitle: "Traditional women's abaya",
      description: "Elegant black abaya made from premium fabric. Features flowing design with comfortable fit. Perfect for daily wear and special occasions.",
      handle: "classic-black-abaya",
      status: "published",
      images: [
        { url: "https://cdn.mignite.app/ws/works_01KEHVFPGZ53M34NBTD8M54K7V/generated-01KEJGX213JHEZF9TB8M1E47JS-01KEJGX2136WY9QFAFKBPMPXMM.jpeg" }
      ],
      categories: getCategoryId("womens-abayas") ? [{ id: getCategoryId("womens-abayas") }] : [],
      sales_channels: defaultChannel ? [{ id: defaultChannel.id }] : [],
      variants: [
        {
          title: "Size 54",
          sku: "ABAYA-BK-54",
          prices: [{ amount: 250, currency_code: "sar", rules: {} }],
          manage_inventory: true,
          inventory_quantity: 40,
        },
        {
          title: "Size 56",
          sku: "ABAYA-BK-56",
          prices: [{ amount: 250, currency_code: "sar", rules: {} }],
          manage_inventory: true,
          inventory_quantity: 50,
        },
        {
          title: "Size 58",
          sku: "ABAYA-BK-58",
          prices: [{ amount: 250, currency_code: "sar", rules: {} }],
          manage_inventory: true,
          inventory_quantity: 35,
        },
      ],
    },
    {
      title: "Red & White Shemagh",
      subtitle: "Traditional Saudi headwear",
      description: "Authentic red and white checkered shemagh. Made from premium cotton for comfort and style. A traditional symbol of Saudi Arabian heritage.",
      handle: "red-white-shemagh",
      status: "published",
      images: [
        { url: "https://cdn.mignite.app/ws/works_01KEHVFPGZ53M34NBTD8M54K7V/generated-01KEJGX19YJXMMF4F32P1Q4E2V-01KEJGX19Y8Q76PJZ5E21ZS8N2.jpeg" }
      ],
      categories: getCategoryId("shemagh-ghutra") ? [{ id: getCategoryId("shemagh-ghutra") }] : [],
      sales_channels: defaultChannel ? [{ id: defaultChannel.id }] : [],
      variants: [
        {
          title: "Standard",
          sku: "SHMGH-RW-STD",
          prices: [{ amount: 80, currency_code: "sar", rules: {} }],
          manage_inventory: true,
          inventory_quantity: 100,
        },
      ],
    },
    {
      title: "Premium Cambodian Oud Oil",
      subtitle: "Luxury oud fragrance",
      description: "Rare Cambodian oud oil aged for 10 years. Rich, complex aroma perfect for special occasions. Comes in elegant crystal bottle with gold accents. 10ml.",
      handle: "cambodian-oud-oil",
      status: "published",
      images: [
        { url: "https://cdn.mignite.app/ws/works_01KEHVFPGZ53M34NBTD8M54K7V/generated-01KEJGX5QAF048VC3HSFS3YTP7-01KEJGX5QAGXEQ31SAKCTHGXZN.jpeg" }
      ],
      categories: getCategoryId("oud-oil") ? [{ id: getCategoryId("oud-oil") }] : getCategoryId("fragrances-oud") ? [{ id: getCategoryId("fragrances-oud") }] : [],
      sales_channels: defaultChannel ? [{ id: defaultChannel.id }] : [],
      variants: [
        {
          title: "10ml",
          sku: "OUD-CAM-10ML",
          prices: [{ amount: 1200, currency_code: "sar", rules: {} }],
          manage_inventory: true,
          inventory_quantity: 25,
        },
        {
          title: "20ml",
          sku: "OUD-CAM-20ML",
          prices: [{ amount: 2200, currency_code: "sar", rules: {} }],
          manage_inventory: true,
          inventory_quantity: 15,
        },
      ],
    },
    {
      title: "Ajwa Dates - Madinah",
      subtitle: "Premium dates from Madinah",
      description: "Authentic Ajwa dates from Al-Madinah. Known for their health benefits and spiritual significance. Soft, sweet, and delicious. Perfect gift for Ramadan.",
      handle: "ajwa-dates-madinah",
      status: "published",
      images: [
        { url: "https://cdn.mignite.app/ws/works_01KEHVFPGZ53M34NBTD8M54K7V/generated-01KEJGX58DY6KC26GNFSK5J948-01KEJGX58DVAR84GVERJJXNT5Z.jpeg" }
      ],
      categories: getCategoryId("premium-dates") ? [{ id: getCategoryId("premium-dates") }] : getCategoryId("dates-sweets") ? [{ id: getCategoryId("dates-sweets") }] : [],
      sales_channels: defaultChannel ? [{ id: defaultChannel.id }] : [],
      variants: [
        {
          title: "500g",
          sku: "DATE-AJWA-500G",
          prices: [{ amount: 80, currency_code: "sar", rules: {} }],
          manage_inventory: true,
          inventory_quantity: 200,
        },
        {
          title: "1kg",
          sku: "DATE-AJWA-1KG",
          prices: [{ amount: 150, currency_code: "sar", rules: {} }],
          manage_inventory: true,
          inventory_quantity: 100,
        },
      ],
    },
    {
      title: "Saudi Khawlani Coffee",
      subtitle: "Premium Arabic coffee beans",
      description: "Finest Khawlani coffee beans from the mountains of Saudi Arabia. Traditionally ground with cardamom. Perfect for serving guests in the traditional Arabian hospitality style.",
      handle: "saudi-khawlani-coffee",
      status: "published",
      images: [
        { url: "https://cdn.mignite.app/ws/works_01KEHVFPGZ53M34NBTD8M54K7V/generated-01KEJGX741M5A77WXZ8M1DBQHJ-01KEJGX74159WAX1489J5D9A3G.jpeg" }
      ],
      categories: getCategoryId("arabic-coffee") ? [{ id: getCategoryId("arabic-coffee") }] : getCategoryId("coffee-tea") ? [{ id: getCategoryId("coffee-tea") }] : [],
      sales_channels: defaultChannel ? [{ id: defaultChannel.id }] : [],
      variants: [
        {
          title: "250g",
          sku: "COFF-KHAW-250G",
          prices: [
            { amount: 45, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 200,
        },
        {
          title: "500g",
          sku: "COFF-KHAW-500G",
          prices: [
            { amount: 85, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 150,
        },
        {
          title: "1kg",
          sku: "COFF-KHAW-1KG",
          prices: [
            { amount: 160, currency_code: "sar", rules: {} },
          ],
          manage_inventory: true,
          inventory_quantity: 80,
        },
      ],
    },
  ]
  
  // Create products
  console.log(`\n🛍️  Creating ${saudiProducts.length} Saudi products...`)
  let createdCount = 0
  
  for (const product of saudiProducts) {
    try {
      const { result } = await createProductsWorkflow(container).run({
        input: { products: [product] },
      })
      createdCount++
      console.log(`  ✅ Created: ${product.title}`)
    } catch (error: any) {
      if (error.message?.includes("already exists")) {
        console.log(`  ⚠️  Skipped (exists): ${product.title}`)
      } else {
        console.log(`  ❌ Error creating ${product.title}:`, error.message)
      }
    }
  }
  
  console.log(`\n✨ Saudi product seeding completed!`)
  console.log(`📊 Summary:`)
  console.log(`  - Products created: ${createdCount}`)
  console.log(`  - All products have professional images`)
  console.log(`  - Prices in SAR (Saudi Riyal)`)
  console.log(`\n📝 Next steps:`)
  console.log(`  1. View products in Admin dashboard`)
  console.log(`  2. Enable Stripe payment in Saudi Arabia region`)
  console.log(`  3. Configure SendGrid for email notifications`)
  console.log(`  4. Set up Meilisearch for product search`)
}
