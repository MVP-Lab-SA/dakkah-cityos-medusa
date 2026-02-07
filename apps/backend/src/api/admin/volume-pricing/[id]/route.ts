import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    const { data: tiers } = await query.graph({
      entity: "volume_pricing_tier",
      fields: ["*"],
      filters: { id }
    })
    
    if (!tiers?.[0]) {
      return res.status(404).json({ message: "Volume pricing tier not found" })
    }
    
    res.json({ volume_pricing_tier: tiers[0] })
  } catch (error: any) {
    console.error("[Admin Volume Pricing GET] Error:", error)
    res.status(500).json({ message: error.message || "Failed to fetch volume pricing tier" })
  }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const volumePricingService = req.scope.resolve("volumePricing")
  
  try {
    const {
      min_quantity,
      max_quantity,
      price,
      discount_percentage,
      is_active
    } = req.body
    
    const updateData: Record<string, any> = { id }
    if (min_quantity !== undefined) updateData.min_quantity = min_quantity
    if (max_quantity !== undefined) updateData.max_quantity = max_quantity
    if (price !== undefined) updateData.price = price
    if (discount_percentage !== undefined) updateData.discount_percentage = discount_percentage
    if (is_active !== undefined) updateData.is_active = is_active
    
    const tier = await volumePricingService.updateVolumePricingTiers(updateData)
    
    res.json({ volume_pricing_tier: tier })
  } catch (error: any) {
    console.error("[Admin Volume Pricing PUT] Error:", error)
    res.status(500).json({ message: error.message || "Failed to update volume pricing tier" })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const volumePricingService = req.scope.resolve("volumePricing")
  
  try {
    await volumePricingService.deleteVolumePricingTiers(id)
    res.status(200).json({ id, deleted: true })
  } catch (error: any) {
    console.error("[Admin Volume Pricing DELETE] Error:", error)
    res.status(500).json({ message: error.message || "Failed to delete volume pricing tier" })
  }
}
