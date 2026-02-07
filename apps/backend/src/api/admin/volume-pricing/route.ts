import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    const { product_id, variant_id, limit = "50", offset = "0" } = req.query as Record<string, string>
    
    const filters: Record<string, any> = {}
    if (product_id) filters.product_id = product_id
    if (variant_id) filters.variant_id = variant_id
    
    const { data: tiers, metadata } = await query.graph({
      entity: "volume_pricing_tier",
      fields: ["*"],
      filters,
      pagination: {
        skip: Number(offset),
        take: Number(limit),
        order: { min_quantity: "ASC" }
      }
    })
    
    res.json({
      volume_pricing_tiers: tiers,
      count: metadata?.count || tiers.length,
      limit: Number(limit),
      offset: Number(offset)
    })
  } catch (error: any) {
    console.error("[Admin Volume Pricing GET] Error:", error)
    res.status(500).json({ message: error.message || "Failed to fetch volume pricing" })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const volumePricingService = req.scope.resolve("volumePricing")
  
  try {
    const {
      product_id,
      variant_id,
      min_quantity,
      max_quantity,
      price,
      discount_percentage,
      is_active = true
    } = req.body
    
    if (!product_id && !variant_id) {
      return res.status(400).json({ message: "product_id or variant_id is required" })
    }
    
    if (min_quantity === undefined) {
      return res.status(400).json({ message: "min_quantity is required" })
    }
    
    if (price === undefined && discount_percentage === undefined) {
      return res.status(400).json({ message: "price or discount_percentage is required" })
    }
    
    if (max_quantity !== undefined && max_quantity <= min_quantity) {
      return res.status(400).json({ message: "max_quantity must be greater than min_quantity" })
    }
    
    const tier = await volumePricingService.createVolumePricingTiers({
      product_id,
      variant_id,
      min_quantity,
      max_quantity,
      price,
      discount_percentage,
      is_active
    })
    
    res.status(201).json({ volume_pricing_tier: tier })
  } catch (error: any) {
    console.error("[Admin Volume Pricing POST] Error:", error)
    res.status(500).json({ message: error.message || "Failed to create volume pricing tier" })
  }
}
