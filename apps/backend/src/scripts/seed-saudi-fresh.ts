import { ExecArgs } from "@medusajs/framework/types"
import { ProductStatus } from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createProductTagsWorkflow,
  createCollectionsWorkflow,
  linkProductsToSalesChannelWorkflow,
  updateInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows"
import { createLogger } from "../lib/logger"
const logger = createLogger("scripts:seed-saudi-fresh")

export default async function ({ container }: ExecArgs) {
  logger.info("Starting Saudi Arabia fresh data seeding...")

  const query = container.resolve("query")

  // 1. Get sales channel
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
    filters: {},
  })
  const defaultChannel = salesChannels[0]
  logger.info(`\n1. Using sales channel: ${defaultChannel.name}`)

  // 2. Create Product Categories
  logger.info("\n2. Creating Product Categories...")
  
  const { result: parentCategories } = await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        {
          name: "Saudi Traditional Wear",
          handle: "saudi-traditional-wear",
          is_active: true,
        },
        {
          name: "Fragrances",
          handle: "fragrances",
          is_active: true,
        },
        {
          name: "Home Decor",
          handle: "home-decor-sa",
          is_active: true,
        },
      ],
    },
  })

  const traditionalWearId = parentCategories.find((c) => c.handle === "saudi-traditional-wear")?.id
  const fragrancesId = parentCategories.find((c) => c.handle === "fragrances")?.id
  const homeDecorId = parentCategories.find((c) => c.handle === "home-decor-sa")?.id

  logger.info(`✓ Created ${parentCategories.length} categories`)

  // 3. Create Collections
  logger.info("\n3. Creating Collections...")
  const { result: collections } = await createCollectionsWorkflow(container).run({
    input: {
      collections: [
        {
          title: "Ramadan Essentials",
          handle: "ramadan-essentials",
        },
        {
          title: "Eid Collection",
          handle: "eid-collection-sa",
        },
      ],
    },
  })
  const ramadanCollectionId = collections.find((c) => c.handle === "ramadan-essentials")?.id
  const eidCollectionId = collections.find((c) => c.handle === "eid-collection-sa")?.id
  logger.info(`✓ Created ${collections.length} collections`)

  // 4. Create Product Tags
  logger.info("\n4. Creating Product Tags...")
  const { result: tags } = await createProductTagsWorkflow(container).run({
    input: {
      product_tags: [
        { value: "bestseller" },
        { value: "new-arrival" },
      ],
    },
  })
  const bestsellerTagId = tags.find((t) => t.value === "bestseller")?.id
  const newArrivalTagId = tags.find((t) => t.value === "new-arrival")?.id
  logger.info(`✓ Created ${tags.length} tags`)

  // 5. Create Products
  logger.info("\n5. Creating Products...")

  const { result: products } = await createProductsWorkflow(container).run({
    input: {
      products: [
        // Thobes
        {
          title: "Classic White Thobe",
          handle: "classic-white-thobe-sa",
          description: "Premium cotton thobe perfect for daily wear and special occasions.",
          status: ProductStatus.PUBLISHED,
          options: [
            {
              title: "Size",
              values: ["54", "56", "58", "60"],
            },
          ],
          variants: [
            {
              title: "54",
              sku: "THOBE-WHT-SA-54",
              options: { Size: "54" },
              prices: [{ amount: 250, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "56",
              sku: "THOBE-WHT-SA-56",
              options: { Size: "56" },
              prices: [{ amount: 250, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "58",
              sku: "THOBE-WHT-SA-58",
              options: { Size: "58" },
              prices: [{ amount: 250, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "60",
              sku: "THOBE-WHT-SA-60",
              options: { Size: "60" },
              prices: [{ amount: 250, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          category_ids: traditionalWearId ? [traditionalWearId] : [],
          collection_id: eidCollectionId,
          // Tags handled via product tags workflow
        },
        {
          title: "Elegant Black Abaya",
          handle: "elegant-black-abaya-sa",
          description: "Beautiful black abaya with elegant design.",
          status: ProductStatus.PUBLISHED,
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
          ],
          variants: [
            {
              title: "S",
              sku: "ABAYA-BLK-SA-S",
              options: { Size: "S" },
              prices: [{ amount: 320, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "M",
              sku: "ABAYA-BLK-SA-M",
              options: { Size: "M" },
              prices: [{ amount: 320, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "L",
              sku: "ABAYA-BLK-SA-L",
              options: { Size: "L" },
              prices: [{ amount: 320, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "XL",
              sku: "ABAYA-BLK-SA-XL",
              options: { Size: "XL" },
              prices: [{ amount: 320, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          category_ids: traditionalWearId ? [traditionalWearId] : [],
          // Tags handled via product tags workflow
        },
        // Fragrances
        {
          title: "Royal Oud Oil",
          handle: "royal-oud-oil-sa",
          description: "Premium aged oud oil with rich, complex aroma.",
          status: ProductStatus.PUBLISHED,
          options: [
            {
              title: "Size",
              values: ["3ml", "6ml", "12ml"],
            },
          ],
          variants: [
            {
              title: "3ml",
              sku: "OUD-SA-3",
              options: { Size: "3ml" },
              prices: [{ amount: 450, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "6ml",
              sku: "OUD-SA-6",
              options: { Size: "6ml" },
              prices: [{ amount: 850, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "12ml",
              sku: "OUD-SA-12",
              options: { Size: "12ml" },
              prices: [{ amount: 1500, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          category_ids: fragrancesId ? [fragrancesId] : [],
          // Tags handled via product tags workflow
        },
        {
          title: "Arabian Bakhoor",
          handle: "arabian-bakhoor-sa",
          description: "Traditional incense blend made from natural wood and oud.",
          status: ProductStatus.PUBLISHED,
          options: [
            {
              title: "Default option",
              values: ["Default option value"],
            },
          ],
          variants: [
            {
              title: "Default",
              sku: "BAKHOOR-SA",
              options: { "Default option": "Default option value" },
              prices: [{ amount: 95, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          category_ids: fragrancesId ? [fragrancesId] : [],
          collection_id: ramadanCollectionId,
          // Tags handled via product tags workflow
        },
        // Home Decor
        {
          title: "Islamic Calligraphy Wall Art",
          handle: "islamic-wall-art-sa",
          description: "Beautiful Arabic calligraphy canvas print.",
          status: ProductStatus.PUBLISHED,
          options: [
            {
              title: "Size",
              values: ["60x80cm", "80x100cm"],
            },
          ],
          variants: [
            {
              title: "60x80cm",
              sku: "WALL-SA-60",
              options: { Size: "60x80cm" },
              prices: [{ amount: 280, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "80x100cm",
              sku: "WALL-SA-80",
              options: { Size: "80x100cm" },
              prices: [{ amount: 420, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          category_ids: homeDecorId ? [homeDecorId] : [],
          // Tags handled via product tags workflow
        },
        {
          title: "Premium Prayer Mat",
          handle: "premium-prayer-mat-sa",
          description: "Memory foam prayer mat with beautiful Islamic pattern.",
          status: ProductStatus.PUBLISHED,
          options: [
            {
              title: "Color",
              values: ["Burgundy", "Navy Blue", "Green"],
            },
          ],
          variants: [
            {
              title: "Burgundy",
              sku: "PRAYER-SA-BURG",
              options: { Color: "Burgundy" },
              prices: [{ amount: 180, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Navy Blue",
              sku: "PRAYER-SA-NAVY",
              options: { Color: "Navy Blue" },
              prices: [{ amount: 180, currency_code: "sar" }],
              manage_inventory: true,
            },
            {
              title: "Green",
              sku: "PRAYER-SA-GREEN",
              options: { Color: "Green" },
              prices: [{ amount: 180, currency_code: "sar" }],
              manage_inventory: true,
            },
          ],
          category_ids: homeDecorId ? [homeDecorId] : [],
          collection_id: ramadanCollectionId,
          // Tags handled via product tags workflow
        },
      ],
    },
  })

  logger.info(`✓ Created ${products.length} products`)

  // 6. Link products to sales channel
  logger.info("\n6. Linking products to sales channel...")
  await linkProductsToSalesChannelWorkflow(container).run({
    input: {
      id: defaultChannel.id,
      add: products.map((p) => p.id),
    },
  })
  logger.info(`✓ Linked ${products.length} products`)

  logger.info("\n7. Inventory is managed automatically for products")

  logger.info(`\n${String("=".repeat(60)}`))
  logger.info("✓ SEEDING COMPLETE!")
  logger.info(String("=".repeat(60)))
  logger.info(`
Categories: ${parentCategories.length}
Collections: ${collections.length}
Products: ${products.length}
All products are published and priced in Saudi Riyals (SAR)
  `)
}
