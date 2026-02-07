import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /admin/volume-pricing/:id
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = req.params
  
  const { data: rules } = await query.graph({
    entity: "volume_pricing",
    fields: ["*"],
    filters: { id },
  })
  
  if (!rules.length) {
    return res.status(404).json({ message: "Volume pricing rule not found" })
  }
  
  const rule = rules[0]
  
  // Fetch tiers
  const { data: tiers } = await query.graph({
    entity: "volume_pricing_tier",
    fields: ["*"],
    filters: { volume_pricing_id: id },
  })
  
  res.json({ rule: { ...rule, tiers } })
}

// PUT /admin/volume-pricing/:id
export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const volumePricingModule = req.scope.resolve("volumePricing")
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = req.params
  
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
    name?: string
    description?: string
    applies_to?: string
    target_id?: string
    pricing_type?: string
    company_id?: string
    company_tier?: string
    priority?: number
    status?: string
    starts_at?: string
    ends_at?: string
    tiers?: Array<{
      id?: string
      min_quantity: number
      max_quantity?: number
      discount_percentage?: number
      discount_amount?: number
      fixed_price?: number
      currency_code?: string
    }>
    metadata?: Record<string, unknown>
  }
  
  // Update rule
  const updateData: Record<string, unknown> = { id }
  if (name !== undefined) updateData.name = name
  if (description !== undefined) updateData.description = description
  if (applies_to !== undefined) updateData.applies_to = applies_to
  if (target_id !== undefined) updateData.target_id = target_id
  if (pricing_type !== undefined) updateData.pricing_type = pricing_type
  if (company_id !== undefined) updateData.company_id = company_id
  if (company_tier !== undefined) updateData.company_tier = company_tier
  if (priority !== undefined) updateData.priority = priority
  if (status !== undefined) updateData.status = status
  if (starts_at !== undefined) updateData.starts_at = starts_at ? new Date(starts_at) : null
  if (ends_at !== undefined) updateData.ends_at = ends_at ? new Date(ends_at) : null
  if (metadata !== undefined) updateData.metadata = metadata
  
  const rule = await volumePricingModule.updateVolumePricings(updateData)
  
  // Update tiers if provided
  if (tiers) {
    // Delete existing tiers
    const { data: existingTiers } = await query.graph({
      entity: "volume_pricing_tier",
      fields: ["id"],
      filters: { volume_pricing_id: id },
    })
    
    for (const tier of existingTiers) {
      await volumePricingModule.deleteVolumePricingTiers(tier.id)
    }
    
    // Create new tiers
    for (const tier of tiers) {
      await volumePricingModule.createVolumePricingTiers({
        volume_pricing_id: id,
        min_quantity: tier.min_quantity,
        max_quantity: tier.max_quantity,
        discount_percentage: tier.discount_percentage,
        discount_amount: tier.discount_amount,
        fixed_price: tier.fixed_price,
        currency_code: tier.currency_code || "usd",
      })
    }
  }
  
  // Fetch updated tiers
  const { data: updatedTiers } = await query.graph({
    entity: "volume_pricing_tier",
    fields: ["*"],
    filters: { volume_pricing_id: id },
  })
  
  res.json({ rule: { ...rule, tiers: updatedTiers } })
}

// DELETE /admin/volume-pricing/:id
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const volumePricingModule = req.scope.resolve("volumePricing")
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = req.params
  
  // Delete tiers first
  const { data: tiers } = await query.graph({
    entity: "volume_pricing_tier",
    fields: ["id"],
    filters: { volume_pricing_id: id },
  })
  
  for (const tier of tiers) {
    await volumePricingModule.deleteVolumePricingTiers(tier.id)
  }
  
  // Delete rule
  await volumePricingModule.deleteVolumePricings(id)
  
  res.json({ success: true })
}
