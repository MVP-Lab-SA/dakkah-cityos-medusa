import { ExecArgs } from "@medusajs/framework/types"
import { createLogger } from "../lib/logger"
const logger = createLogger("scripts:seed-volume-pricing")

export default async function seedVolumePricing({ container }: ExecArgs) {
  const volumePricingModule = container.resolve("volumePricing") as any
  const tenantService = container.resolve("tenant") as any
  const query = container.resolve("query")

  let tenantId = "ten_default"
  try {
    const tenants = await tenantService.listTenants({ handle: "dakkah" })
    const list = Array.isArray(tenants) ? tenants : [tenants].filter(Boolean)
    if (list.length > 0 && list[0]?.id) {
      tenantId = list[0].id
      logger.info(`Using Dakkah tenant: ${tenantId}`)
    } else {
      const allTenants = await tenantService.listTenants()
      const allList = Array.isArray(allTenants) ? allTenants : [allTenants].filter(Boolean)
      if (allList.length > 0 && allList[0]?.id) {
        tenantId = allList[0].id
        logger.info(`Dakkah not found, using first tenant: ${tenantId}`)
      }
    }
  } catch (err: any) {
    logger.info(`Could not fetch tenants: ${err.message}. Using placeholder: ${tenantId}`)
  }

  logger.info("Seeding volume pricing tiers...")

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle"],
    filters: { status: "published" },
  })

  if (!products || products.length === 0) {
    logger.info("  - No products found, skipping volume pricing")
    return
  }

  const tiers = [
    { min_quantity: 5, max_quantity: 9, discount_type: "percentage", discount_value: "5", label: "5% off 5+" },
    { min_quantity: 10, max_quantity: 24, discount_type: "percentage", discount_value: "10", label: "10% off 10+" },
    { min_quantity: 25, max_quantity: 49, discount_type: "percentage", discount_value: "15", label: "15% off 25+" },
    { min_quantity: 50, max_quantity: null, discount_type: "percentage", discount_value: "20", label: "20% off 50+" },
  ]

  const productsToPrice = products.slice(0, 10)

  for (const product of productsToPrice) {
    try {
      const existing = await volumePricingModule.listVolumePricingRules({ product_id: product.id })
      const existingList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

      if (existingList.length > 0) {
        logger.info(`  - Volume pricing for ${product.handle} already exists, skipping`)
        continue
      }

      const rule = await volumePricingModule.createVolumePricingRules({
        product_id: product.id,
        tenant_id: tenantId,
        name: `Volume pricing for ${product.title}`,
        is_active: true,
        priority: 1,
      })

      for (const tier of tiers) {
        await volumePricingModule.createVolumePricingTiers({
          rule_id: rule.id,
          tenant_id: tenantId,
          min_quantity: tier.min_quantity,
          max_quantity: tier.max_quantity,
          discount_type: tier.discount_type,
          discount_value: tier.discount_value,
        })
      }

      logger.info(`  - Created volume pricing for: ${product.title}`)
    } catch (error: any) {
      logger.error(`  - Failed to create volume pricing for ${product.handle}: ${error.message}`)
    }
  }

  logger.info(`Seeded volume pricing for ${productsToPrice.length} products`)
}
