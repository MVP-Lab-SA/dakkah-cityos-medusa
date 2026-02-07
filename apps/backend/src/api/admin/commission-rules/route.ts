import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    const { limit = "20", offset = "0", vendor_id, is_active } = req.query as Record<string, string>
    
    const filters: Record<string, any> = {}
    if (vendor_id) filters.vendor_id = vendor_id
    if (is_active !== undefined) filters.is_active = is_active === "true"
    
    const { data: rules, metadata } = await query.graph({
      entity: "commission_rule",
      fields: ["*", "vendor.*"],
      filters,
      pagination: {
        skip: Number(offset),
        take: Number(limit)
      }
    })
    
    res.json({
      commission_rules: rules,
      count: metadata?.count || rules.length,
      limit: Number(limit),
      offset: Number(offset)
    })
  } catch (error: any) {
    console.error("[Admin Commission Rules GET] Error:", error)
    res.status(500).json({ message: error.message || "Failed to fetch commission rules" })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const commissionService = req.scope.resolve("commission")
  
  try {
    const {
      name,
      type = "percentage",
      value,
      vendor_id,
      category_id,
      product_id,
      min_order_value,
      max_order_value,
      is_active = true,
      priority = 0
    } = req.body
    
    if (!name || value === undefined) {
      return res.status(400).json({ message: "name and value are required" })
    }
    
    if (!["percentage", "flat"].includes(type)) {
      return res.status(400).json({ message: "type must be 'percentage' or 'flat'" })
    }
    
    if (type === "percentage" && (value < 0 || value > 100)) {
      return res.status(400).json({ message: "percentage value must be between 0 and 100" })
    }
    
    const rule = await commissionService.createCommissionRules({
      name,
      type,
      value,
      vendor_id,
      category_id,
      product_id,
      min_order_value,
      max_order_value,
      is_active,
      priority
    })
    
    res.status(201).json({ commission_rule: rule })
  } catch (error: any) {
    console.error("[Admin Commission Rules POST] Error:", error)
    res.status(500).json({ message: error.message || "Failed to create commission rule" })
  }
}
