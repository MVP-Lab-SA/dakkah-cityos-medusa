import { ExecArgs } from "@medusajs/framework/types"
import {
  createRegionsWorkflow,
  createTaxRegionsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createCollectionsWorkflow,
  createSalesChannelsWorkflow,
  createProductTagsWorkflow,
  linkProductsToSalesChannelWorkflow,
  updateInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function ({ container }: ExecArgs) {
  console.log("Starting Saudi Arabia data seeding...")

  const query = container.resolve("query")

  // 1. Check for or create Saudi Arabia Region
  console.log("\n1. Setting up Saudi Arabia Region...")
  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
    filters: { currency_code: "sar" },
  })

  let saudiRegion
  if (existingRegions.length > 0) {
    saudiRegion = existingRegions[0]
    console.log(`✓ Found existing region: ${saudiRegion.name} (${saudiRegion.id})`)
  } else {
    const { result: regions } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Saudi Arabia",
            currency_code: "sar",
            countries: ["sa"],
            is_tax_inclusive: true,
            automatic_taxes: true,
          },
        ],
      },
    })
    saudiRegion = regions[0]
    console.log(`✓ Created region: ${saudiRegion.name} (${saudiRegion.id})`)
  }

  // 2. Check for or create Tax Region
  console.log("\n2. Setting up Tax Region...")
  const { data: existingTaxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code"],
    filters: { country_code: "sa" },
  })

  if (existingTaxRegions.length > 0) {
    console.log(`✓ Found existing tax region for Saudi Arabia`)
  } else {
    const { result: taxRegions } = await createTaxRegionsWorkflow(container).run({
      input: [
        {
          country_code: "sa",
          default_tax_rate: {
            code: "VAT",
            name: "Value Added Tax",
            rate: 15,
          },
        },
      ],
    })
    console.log(`✓ Created tax region with 15% VAT for Saudi Arabia`)
  }

  // 3. Get default sales channel
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
    filters: {},
  })
  const defaultChannel = salesChannels[0]
  console.log(`\n3. Using sales channel: ${defaultChannel.name} (${defaultChannel.id})`)

  // 4. Create Product Categories (relevant to Saudi market)
  console.log("\n4. Creating Product Categories...")
  
  // Create parent categories first
  const { result: parentCategories } = await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        {
          name: "Traditional Clothing",
          handle: "traditional-clothing",
          is_active: true,
          description: "Traditional Saudi and Middle Eastern attire",
        },
        {
          name: "Modern Fashion",
          handle: "modern-fashion",
          is_active: true,
          description: "Contemporary fashion and accessories",
        },
        {
          name: "Home & Decor",
          handle: "home-decor",
          is_active: true,
          description: "Home furnishings and decorative items",
        },
        {
          name: "Fragrances & Oud",
          handle: "fragrances-oud",
          is_active: true,
          description: "Premium fragrances, oud, and bakhoor",
        },
        {
          name: "Electronics",
          handle: "electronics",
          is_active: true,
          description: "Consumer electronics and gadgets",
        },
      ],
    },
  })

  const traditionalClothingId = parentCategories.find((c) => c.handle === "traditional-clothing")?.id
  const modernFashionId = parentCategories.find((c) => c.handle === "modern-fashion")?.id
  const homeDecorId = parentCategories.find((c) => c.handle === "home-decor")?.id
  const fragrancesId = parentCategories.find((c) => c.handle === "fragrances-oud")?.id

  console.log(`✓ Created ${parentCategories.length} parent categories`)

  // Create child categories
  const { result: childCategories } = await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        // Traditional Clothing subcategories
        {
          name: "Men's Thobes",
          handle: "mens-thobes",
          parent_category_id: traditionalClothingId,
          is_active: true,
        },
        {
          name: "Women's Abayas",
          handle: "womens-abayas",
          parent_category_id: traditionalClothingId,
          is_active: true,
        },
        {
          name: "Shemagh & Ghutra",
          handle: "shemagh-ghutra",
          parent_category_id: traditionalClothingId,
          is_active: true,
        },
        // Modern Fashion subcategories
        {
          name: "Modest Fashion",
          handle: "modest-fashion",
          parent_category_id: modernFashionId,
          is_active: true,
        },
        {
          name: "Accessories",
          handle: "accessories",
          parent_category_id: modernFashionId,
          is_active: true,
        },
        // Home & Decor subcategories
        {
          name: "Islamic Wall Art",
          handle: "islamic-wall-art",
          parent_category_id: homeDecorId,
          is_active: true,
        },
        {
          name: "Prayer Items",
          handle: "prayer-items",
          parent_category_id: homeDecorId,
          is_active: true,
        },
        // Fragrances subcategories
        {
          name: "Oud Oil",
          handle: "oud-oil",
          parent_category_id: fragrancesId,
          is_active: true,
        },
        {
          name: "Bakhoor & Incense",
          handle: "bakhoor-incense",
          parent_category_id: fragrancesId,
          is_active: true,
        },
      ],
    },
  })

  console.log(`✓ Created ${childCategories.length} child categories`)

  // Get category IDs for products
  const mensThobeCategoryId = childCategories.find((c) => c.handle === "mens-thobes")?.id
  const womensAbayaCategoryId = childCategories.find((c) => c.handle === "womens-abayas")?.id
  const shemaghCategoryId = childCategories.find((c) => c.handle === "shemagh-ghutra")?.id
  const oudOilCategoryId = childCategories.find((c) => c.handle === "oud-oil")?.id
  const bakhoorCategoryId = childCategories.find((c) => c.handle === "bakhoor-incense")?.id
  const islamicArtCategoryId = childCategories.find((c) => c.handle === "islamic-wall-art")?.id
  const prayerItemsCategoryId = childCategories.find((c) => c.handle === "prayer-items")?.id

  // 5. Create Collections
  console.log("\n5. Creating Collections...")
  const { result: collections } = await createCollectionsWorkflow(container).run({
    input: {
      collections: [
        {
          title: "Ramadan Collection",
          handle: "ramadan-collection",
        },
        {
          title: "Eid Special",
          handle: "eid-special",
        },
        {
          title: "Premium Selection",
          handle: "premium-selection",
        },
        {
          title: "Best Sellers",
          handle: "best-sellers",
        },
      ],
    },
  })
  console.log(`✓ Created ${collections.length} collections`)

  const ramadanCollectionId = collections.find((c) => c.handle === "ramadan-collection")?.id
  const eidCollectionId = collections.find((c) => c.handle === "eid-special")?.id
  const premiumCollectionId = collections.find((c) => c.handle === "premium-selection")?.id

  // 6. Create Product Tags
  console.log("\n6. Creating Product Tags...")
  const { result: tags } = await createProductTagsWorkflow(container).run({
    input: {
      product_tags: [
        { value: "featured" },
        { value: "premium" },
      ],
    },
  })
  console.log(`✓ Created ${tags.length} tags`)
  
  const featuredTagId = tags.find((t) => t.value === "featured")?.id
  const premiumTagId = tags.find((t) => t.value === "premium")?.id

  // 7. Create Products
  console.log("\n7. Creating Products...")

  const { result: products } = await createProductsWorkflow(container).run({
    input: {
      products: [
        // Men's Thobes
        {
          title: "Premium White Thobe",
          subtitle: "Classic Saudi style with modern comfort",
          handle: "premium-white-thobe",
          description: "Elegant white thobe crafted from premium cotton fabric. Perfect for daily wear and special occasions.",
          status: "published",
          options: [
            {
              title: "Size",
              values: ["54", "56", "58", "60", "62"],
            },
          ],
          variants: [
            {
              title: "Size 54",
              sku: "THOBE-WHT-54",
              options: { Size: "54" },
              prices: [{ amount: 250, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Size 56",
              sku: "THOBE-WHT-56",
              options: { Size: "56" },
              prices: [{ amount: 250, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Size 58",
              sku: "THOBE-WHT-58",
              options: { Size: "58" },
              prices: [{ amount: 250, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Size 60",
              sku: "THOBE-WHT-60",
              options: { Size: "60" },
              prices: [{ amount: 250, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Size 62",
              sku: "THOBE-WHT-62",
              options: { Size: "62" },
              prices: [{ amount: 250, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          categories: [{ id: mensThobeCategoryId }],
          collection_id: eidCollectionId,
          tags: [{ id: featuredTagId }],
        },
        {
          title: "Luxury Bisht",
          subtitle: "Traditional ceremonial cloak",
          handle: "luxury-bisht",
          description: "Handcrafted bisht with golden embroidery. Perfect for weddings and formal occasions.",
          status: "published",
          options: [
            {
              title: "Size",
              values: ["M", "L", "XL"],
            },
          ],
          variants: [
            {
              title: "Medium",
              sku: "BISHT-BLK-M",
              options: { Size: "M" },
              prices: [{ amount: 850, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Large",
              sku: "BISHT-BLK-L",
              options: { Size: "L" },
              prices: [{ amount: 850, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Extra Large",
              sku: "BISHT-BLK-XL",
              options: { Size: "XL" },
              prices: [{ amount: 850, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          categories: [{ id: mensThobeCategoryId }],
          collection_id: premiumCollectionId,
          tags: [{ id: premiumTagId }, { id: featuredTagId }],
        },
        // Women's Abayas
        {
          title: "Elegant Black Abaya",
          subtitle: "Classic design with modern touch",
          handle: "elegant-black-abaya",
          description: "Beautiful black abaya with subtle embellishments. Comfortable and stylish for everyday wear.",
          status: "published",
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
          ],
          variants: [
            {
              title: "Small",
              sku: "ABAYA-BLK-S",
              options: { Size: "S" },
              prices: [{ amount: 320, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Medium",
              sku: "ABAYA-BLK-M",
              options: { Size: "M" },
              prices: [{ amount: 320, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Large",
              sku: "ABAYA-BLK-L",
              options: { Size: "L" },
              prices: [{ amount: 320, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Extra Large",
              sku: "ABAYA-BLK-XL",
              options: { Size: "XL" },
              prices: [{ amount: 320, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          categories: [{ id: womensAbayaCategoryId }],
          tags: [{ id: featuredTagId }],
        },
        {
          title: "Designer Abaya with Pearl Details",
          subtitle: "Luxurious handcrafted design",
          handle: "designer-pearl-abaya",
          description: "Premium abaya featuring delicate pearl embellishments. Perfect for special occasions.",
          status: "published",
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
          ],
          variants: [
            {
              title: "Small",
              sku: "ABAYA-PEARL-S",
              options: { Size: "S" },
              prices: [{ amount: 650, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Medium",
              sku: "ABAYA-PEARL-M",
              options: { Size: "M" },
              prices: [{ amount: 650, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Large",
              sku: "ABAYA-PEARL-L",
              options: { Size: "L" },
              prices: [{ amount: 650, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Extra Large",
              sku: "ABAYA-PEARL-XL",
              options: { Size: "XL" },
              prices: [{ amount: 650, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          categories: [{ id: womensAbayaCategoryId }],
          collection_id: premiumCollectionId,
          tags: [{ id: premiumTagId }, { id: featuredTagId }],
        },
        // Shemagh & Ghutra
        {
          title: "Red & White Shemagh",
          subtitle: "Traditional Saudi headwear",
          handle: "red-white-shemagh",
          description: "Authentic red and white checkered shemagh. High-quality cotton fabric.",
          status: "published",
          options: [
            {
              title: "Default option",
              values: ["Default option value"],
            },
          ],
          variants: [
            {
              title: "Default variant",
              sku: "SHEMAGH-RW",
              options: { "Default option": "Default option value" },
              prices: [{ amount: 85, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          categories: [{ id: shemaghCategoryId }],
          tags: [{ id: featuredTagId }],
        },
        {
          title: "White Ghutra",
          subtitle: "Pure white traditional headscarf",
          handle: "white-ghutra",
          description: "Classic white ghutra made from premium cotton. Essential for traditional attire.",
          status: "published",
          options: [
            {
              title: "Default option",
              values: ["Default option value"],
            },
          ],
          variants: [
            {
              title: "Default variant",
              sku: "GHUTRA-WHT",
              options: { "Default option": "Default option value" },
              prices: [{ amount: 75, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          categories: [{ id: shemaghCategoryId }],
        },
        // Fragrances & Oud
        {
          title: "Royal Oud Oil 12ml",
          subtitle: "Premium aged oud from Southeast Asia",
          handle: "royal-oud-oil-12ml",
          description: "Exquisite oud oil aged for years. Rich, complex aroma perfect for special occasions.",
          status: "published",
          options: [
            {
              title: "Size",
              values: ["3ml", "6ml", "12ml"],
            },
          ],
          variants: [
            {
              title: "3ml",
              sku: "OUD-ROYAL-3",
              options: { Size: "3ml" },
              prices: [{ amount: 450, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "6ml",
              sku: "OUD-ROYAL-6",
              options: { Size: "6ml" },
              prices: [{ amount: 850, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "12ml",
              sku: "OUD-ROYAL-12",
              options: { Size: "12ml" },
              prices: [{ amount: 1500, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          categories: [{ id: oudOilCategoryId }],
          collection_id: premiumCollectionId,
          tags: [{ id: premiumTagId }, { id: featuredTagId }],
        },
        {
          title: "Arabian Bakhoor Box",
          subtitle: "Traditional incense blend",
          handle: "arabian-bakhoor-box",
          description: "Premium bakhoor made from natural wood, oud, and essential oils. Creates a warm, inviting atmosphere.",
          status: "published",
          options: [
            {
              title: "Default option",
              values: ["Default option value"],
            },
          ],
          variants: [
            {
              title: "Default variant",
              sku: "BAKHOOR-ARA",
              options: { "Default option": "Default option value" },
              prices: [{ amount: 95, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          categories: [{ id: bakhoorCategoryId }],
          collection_id: ramadanCollectionId,
          tags: [{ id: featuredTagId }],
        },
        {
          title: "Musk Al Tahara",
          subtitle: "Traditional white musk",
          handle: "musk-al-tahara",
          description: "Pure white musk, traditionally used after ablution. Light, clean fragrance.",
          status: "published",
          options: [
            {
              title: "Default option",
              values: ["Default option value"],
            },
          ],
          variants: [
            {
              title: "Default variant",
              sku: "MUSK-TAHARA",
              options: { "Default option": "Default option value" },
              prices: [{ amount: 45, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          categories: [{ id: oudOilCategoryId }],
          collection_id: ramadanCollectionId,
        },
        // Home & Decor
        {
          title: "Ayat Al-Kursi Wall Art",
          subtitle: "Islamic calligraphy canvas print",
          handle: "ayat-al-kursi-wall-art",
          description: "Beautiful Arabic calligraphy featuring Ayat Al-Kursi. Premium canvas print with wooden frame.",
          status: "published",
          options: [
            {
              title: "Size",
              values: ["60x80cm", "80x100cm", "100x120cm"],
            },
          ],
          variants: [
            {
              title: "60x80cm",
              sku: "WALL-AK-60",
              options: { Size: "60x80cm" },
              prices: [{ amount: 280, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "80x100cm",
              sku: "WALL-AK-80",
              options: { Size: "80x100cm" },
              prices: [{ amount: 420, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "100x120cm",
              sku: "WALL-AK-100",
              options: { Size: "100x120cm" },
              prices: [{ amount: 580, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          categories: [{ id: islamicArtCategoryId }],
          tags: [{ id: featuredTagId }],
        },
        {
          title: "Luxury Prayer Mat",
          subtitle: "Memory foam prayer rug",
          handle: "luxury-prayer-mat",
          description: "Premium prayer mat with memory foam cushioning. Beautiful Islamic pattern design.",
          status: "published",
          options: [
            {
              title: "Color",
              values: ["Burgundy", "Navy Blue", "Emerald Green"],
            },
          ],
          variants: [
            {
              title: "Burgundy",
              sku: "PRAYER-MAT-BURG",
              options: { Color: "Burgundy" },
              prices: [{ amount: 180, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Navy Blue",
              sku: "PRAYER-MAT-NAVY",
              options: { Color: "Navy Blue" },
              prices: [{ amount: 180, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Emerald Green",
              sku: "PRAYER-MAT-EMER",
              options: { Color: "Emerald Green" },
              prices: [{ amount: 180, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          categories: [{ id: prayerItemsCategoryId }],
          collection_id: ramadanCollectionId,
          tags: [{ id: featuredTagId }],
        },
        {
          title: "Electronic Tasbih Counter",
          subtitle: "Digital dhikr counter",
          handle: "electronic-tasbih-counter",
          description: "Convenient digital tasbih counter with LED display. Perfect for daily dhikr.",
          status: "published",
          options: [
            {
              title: "Default option",
              values: ["Default option value"],
            },
          ],
          variants: [
            {
              title: "Default variant",
              sku: "TASBIH-ELEC",
              options: { "Default option": "Default option value" },
              prices: [{ amount: 35, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          categories: [{ id: prayerItemsCategoryId }],
          collection_id: ramadanCollectionId,
        },
      ],
    },
  })

  console.log(`✓ Created ${products.length} products with variants`)

  // 8. Link products to sales channel
  console.log("\n8. Linking products to sales channel...")
  const productIds = products.map((p) => p.id)
  
  await linkProductsToSalesChannelWorkflow(container).run({
    input: {
      id: defaultChannel.id,
      add: productIds,
    },
  })
  console.log(`✓ Linked ${products.length} products to ${defaultChannel.name}`)

  // 9. Set inventory levels
  console.log("\n9. Setting inventory levels...")
  
  // Get all inventory items
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
    filters: {},
  })

  // Get default stock location
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
    filters: {},
  })
  const defaultLocation = stockLocations[0]

  // Update inventory for each item
  for (const item of inventoryItems) {
    await updateInventoryLevelsWorkflow(container).run({
      input: {
        updates: [
          {
            inventory_item_id: item.id,
            location_id: defaultLocation.id,
            stocked_quantity: 50, // Set decent stock for each variant
          },
        ],
      },
    })
  }

  console.log(`✓ Set inventory levels for ${inventoryItems.length} items`)

  // Summary
  console.log("\n" + "=".repeat(60))
  console.log("✓ SEEDING COMPLETE!")
  console.log("=".repeat(60))
  console.log(`
Region: ${saudiRegion.name} (${saudiRegion.currency_code.toUpperCase()})
Tax: 15% VAT
Categories: ${parentCategories.length + childCategories.length} total
Collections: ${collections.length}
Products: ${products.length}
Sales Channel: ${defaultChannel.name}
Stock Location: ${defaultLocation.name}

All products are:
- Published and ready for sale
- Linked to the default sales channel
- Priced in Saudi Riyals (SAR)
- Stocked with 50 units per variant
  `)
}
