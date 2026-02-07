import { ExecArgs } from "@medusajs/framework/types"

export default async function seedVolumePricing({ container }: ExecArgs) {
  const volumePricingModule = container.resolve("volumePricing") as any
  const query = container.resolve("query")

  console.log("Seeding volume pricing tiers...")

  // Get all products
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle"],
    filters: { status: "published" },
  })

  if (!products || products.length === 0) {
    console.log("  - No products found, skipping volume pricing")
    return
  }

  // Volume pricing tiers to apply
  const tiers = [
    { min_quantity: 5, max_quantity: 9, discount_type: "percentage", discount_value: "5", label: "5% off 5+" },
    { min_quantity: 10, max_quantity: 24, discount_type: "percentage", discount_value: "10", label: "10% off 10+" },
    { min_quantity: 25, max_quantity: 49, discount_type: "percentage", discount_value: "15", label: "15% off 25+" },
    { min_quantity: 50, max_quantity: null, discount_type: "percentage", discount_value: "20", label: "20% off 50+" },
  ]

  // Apply to first 10 products as an example
  const productsToPrice = products.slice(0, 10)

  for (const product of productsToPrice) {
    try {
      // Check if volume pricing already exists
      const existing = await volumePricingModule.listVolumePricingRules({ product_id: product.id })
      const existingList = Array.isArray(existing) ? existing : [existing].filter(Boolean)

      if (existingList.length > 0) {
        console.log(`  - Volume pricing for ${product.handle} already exists, skipping`)
        continue
      }

      // Create volume pricing rule
      const rule = await volumePricingModule.createVolumePricingRules({
        product_id: product.id,
        name: `Volume pricing for ${product.title}`,
        is_active: true,
        priority: 1,
      })

      // Create tiers for this rule
      for (const tier of tiers) {
        await volumePricingModule.createVolumePricingTiers({
          rule_id: rule.id,
          min_quantity: tier.min_quantity,
          max_quantity: tier.max_quantity,
          discount_type: tier.discount_type,
          discount_value: tier.discount_value,
        })
      }

      console.log(`  - Created volume pricing for: ${product.title}`)
    } catch (error: any) {
      console.error(`  - Failed to create volume pricing for ${product.handle}: ${error.message}`)
    }
  }

  console.log(`Seeded volume pricing for ${productsToPrice.length} products`)
}
