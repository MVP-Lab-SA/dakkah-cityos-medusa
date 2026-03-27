import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { createLogger } from "../lib/logger"

const logger = createLogger("scripts:seed-storefront-test-products")

const DEMO_HANDLES = [
  "cityos-demo-wireless-headphones",
  "cityos-demo-cotton-tote-bag",
  "cityos-demo-arabica-coffee",
] as const

/**
 * Idempotent: creates a few published products with images, priced in the first
 * region's currency, linked to the first sales channel. Safe to re-run.
 *
 * Usage (local): pnpm --filter=backend seed:storefront-demo
 * Usage (Docker): docker exec kashif-medusa-backend pnpm exec medusa exec ./src/scripts/seed-storefront-test-products.ts
 */
export default async function seedStorefrontTestProducts({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })

  if (!salesChannels?.length) {
    logger.error("No sales channel found. Run pnpm --filter=backend exec medusa exec ./src/scripts/seed-core.ts (or full seed) first.")
    return
  }

  const channel = salesChannels[0]

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "currency_code"],
  })
  const currency = (regions?.[0] as { currency_code?: string })?.currency_code || "usd"

  logger.info(`Sales channel: ${channel.name} (${channel.id})`)
  logger.info(`Pricing currency: ${currency}`)

  const toCreate: Record<string, unknown>[] = []

  for (const handle of DEMO_HANDLES) {
    const { data: existing } = await query.graph({
      entity: "product",
      fields: ["id"],
      filters: { handle },
    })

    if (existing?.length) {
      logger.info(`Skip (exists): ${handle}`)
      continue
    }

    if (handle === "cityos-demo-wireless-headphones") {
      toCreate.push({
        title: "Demo — Wireless Headphones",
        handle,
        description:
          "CityOS demo product. Over-ear wireless headphones with active noise cancellation.",
        status: ProductStatus.PUBLISHED,
        thumbnail:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        images: [
          {
            url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
          },
        ],
        sales_channels: [{ id: channel.id }],
        options: [{ title: "Color", values: ["Black", "Silver"] }],
        variants: [
          {
            title: "Black",
            sku: "DEMO-HP-BLK",
            options: { Color: "Black" },
            prices: [{ amount: 12900, currency_code: currency }],
            manage_inventory: false,
          },
          {
            title: "Silver",
            sku: "DEMO-HP-SLV",
            options: { Color: "Silver" },
            prices: [{ amount: 12900, currency_code: currency }],
            manage_inventory: false,
          },
        ],
      })
    } else if (handle === "cityos-demo-cotton-tote-bag") {
      toCreate.push({
        title: "Demo — Cotton Tote Bag",
        handle,
        description: "CityOS demo product. Heavy cotton tote for shopping or work.",
        status: ProductStatus.PUBLISHED,
        thumbnail:
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
        images: [
          {
            url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&q=80",
          },
        ],
        sales_channels: [{ id: channel.id }],
        options: [
          { title: "Size", values: ["Medium", "Large"] },
        ],
        variants: [
          {
            title: "Medium",
            sku: "DEMO-TOTE-MD",
            options: { Size: "Medium" },
            prices: [{ amount: 3500, currency_code: currency }],
            manage_inventory: false,
          },
          {
            title: "Large",
            sku: "DEMO-TOTE-LG",
            options: { Size: "Large" },
            prices: [{ amount: 4200, currency_code: currency }],
            manage_inventory: false,
          },
        ],
      })
    } else if (handle === "cityos-demo-arabica-coffee") {
      toCreate.push({
        title: "Demo — Arabica Coffee Beans",
        handle,
        description: "CityOS demo product. Medium roast whole beans, 500g.",
        status: ProductStatus.PUBLISHED,
        thumbnail:
          "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
        images: [
          {
            url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&q=80",
          },
        ],
        sales_channels: [{ id: channel.id }],
        options: [
          { title: "Grind", values: ["Whole bean", "Espresso"] },
        ],
        variants: [
          {
            title: "Whole bean",
            sku: "DEMO-COF-WB",
            options: { Grind: "Whole bean" },
            prices: [{ amount: 4800, currency_code: currency }],
            manage_inventory: false,
          },
          {
            title: "Espresso grind",
            sku: "DEMO-COF-ESP",
            options: { Grind: "Espresso" },
            prices: [{ amount: 4800, currency_code: currency }],
            manage_inventory: false,
          },
        ],
      })
    }
  }

  if (toCreate.length === 0) {
    logger.info("All demo products already present. Nothing to do.")
    return
  }

  const { result: products } = await createProductsWorkflow(container).run({
    input: { products: toCreate as never },
  })

  logger.info(
    `Created ${products.length} demo product(s): ${products.map((p) => p.handle).join(", ")}`,
  )
  logger.info(
    `They are on sales channel "${channel.name}" — open the storefront and search or browse by handle.`,
  )
}
