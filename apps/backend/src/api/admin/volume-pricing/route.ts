import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /admin/volume-pricing - List all volume pricing rules
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  const { status, applies_to, company_id } = req.query
  
  const filters: Record<string, unknown> = {}
  if (status) filters.status = status
  if (applies_to) filters.applies_to = applies_to
  if (company_id) filters.company_id = company_id
  
  const { data: rules } = await query.graph({
    entity: "volume_pricing",
    fields: [
      "id", "name", "description", "applies_to", "target_id",
      "pricing_type", "company_id", "company_tier", "priority",
      "status", "starts_at", "ends_at", "metadata", "created_at", "updated_at"
    ],
    filters,
  })
  
  // Fetch tiers for each rule
  const enrichedRules = await Promise.all(rules.map(async (rule: Record<string, unknown>) => {
    const { data: tiers } = await query.graph({
      entity: "volume_pricing_tier",
      fields: [
        "id", "volume_pricing_id", "min_quantity", "max_quantity",
        "discount_percentage", "discount_amount", "fixed_price", "currency_code"
      ],
      filters: { volume_pricing_id: rule.id },
    })
    
    // Fetch target info if applicable
    let target = null
    if (rule.target_id) {
      if (rule.applies_to === "product") {
        const { data: products } = await query.graph({
          entity: "product",
          fields: ["id", "title", "thumbnail"],
          filters: { id: rule.target_id },
        })
        target = products[0] || null
      } else if (rule.applies_to === "collection") {
        const { data: collections } = await query.graph({
          entity: "product_collection",
          fields: ["id", "title"],
          filters: { id: rule.target_id },
        })
        target = collections[0] || null
      } else if (rule.applies_to === "category") {
        const { data: categories } = await query.graph({
          entity: "product_category",
          fields: ["id", "name"],
          filters: { id: rule.target_id },
        })
        target = categories[0] || null
      }
    }
    
    return { ...rule, tiers, target }
  }))
  
  res.json({ rules: enrichedRules })
}

// POST /admin/volume-pricing - Create a new volume pricing rule
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const volumePricingModule = req.scope.resolve("volumePricing")
  
  const {
    name,
    description,
    applies_to,
    target_id,
    pricing_type,
    company_id,
    company_tier,
    priority,
    status,
    starts_at,
    ends_at,
    tiers,
    metadata,
  } = req.body as {
    name: string
    description?: string
    applies_to: string
    target_id?: string
    pricing_type: string
    company_id?: string
    company_tier?: string
    priority?: number
    status?: string
    starts_at?: string
    ends_at?: string
    tiers: Array<{
      min_quantity: number
      max_quantity?: number
      discount_percentage?: number
      discount_amount?: number
      fixed_price?: number
      currency_code?: string
    }>
    metadata?: Record<string, unknown>
  }
  
  // Create the rule
  const rule = await volumePricingModule.createVolumePricings({
    name,
    description,
    applies_to,
    target_id,
    pricing_type,
    company_id,
    company_tier,
    priority: priority || 0,
    status: status || "active",
    starts_at: starts_at ? new Date(starts_at) : null,
    ends_at: ends_at ? new Date(ends_at) : null,
    tenant_id: "default",
    metadata,
  })
  
  // Create tiers
  const createdTiers = await Promise.all(
    tiers.map((tier) =>
      volumePricingModule.createVolumePricingTiers({
        volume_pricing_id: rule.id,
        ...tier,
      })
    )
  )
  
  res.status(201).json({ rule: { ...rule, tiers: createdTiers } })
}
