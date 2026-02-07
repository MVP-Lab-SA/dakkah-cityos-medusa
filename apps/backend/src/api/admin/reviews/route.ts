import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    const { 
      limit = "20", 
      offset = "0", 
      status,
      product_id,
      vendor_id,
      rating,
      sort = "created_at",
      order = "DESC"
    } = req.query as Record<string, string>
    
    const filters: Record<string, any> = {}
    
    if (status === "pending") filters.is_approved = false
    if (status === "approved") filters.is_approved = true
    if (product_id) filters.product_id = product_id
    if (vendor_id) filters.vendor_id = vendor_id
    if (rating) filters.rating = Number(rating)
    
    const { data: reviews, metadata } = await query.graph({
      entity: "review",
      fields: ["*", "customer.*", "product.*", "vendor.*"],
      filters,
      pagination: {
        skip: Number(offset),
        take: Number(limit),
        order: { [sort]: order.toUpperCase() as "ASC" | "DESC" }
      }
    })
    
    res.json({
      reviews,
      count: metadata?.count || reviews.length,
      limit: Number(limit),
      offset: Number(offset)
    })
  } catch (error: any) {
    console.error("[Admin Reviews GET] Error:", error)
    res.status(500).json({ message: error.message || "Failed to fetch reviews" })
  }
}
