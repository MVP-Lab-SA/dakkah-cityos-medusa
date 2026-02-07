import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /store/vendors/:handle/reviews
 * Get vendor reviews
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorModule = req.scope.resolve("vendor") as any
  const { handle } = req.params
  
  const { 
    offset = 0, 
    limit = 20,
    rating,
    sort_by = "created_at",
    order = "DESC",
  } = req.query
  
  try {
    // Find vendor by handle
    const vendors = await vendorModule.listVendors({ handle })
    const vendorList = Array.isArray(vendors) ? vendors : [vendors].filter(Boolean)
    
    if (vendorList.length === 0) {
      return res.status(404).json({ message: "Vendor not found" })
    }
    
    const vendor = vendorList[0]
    
    if (vendor.status !== "active") {
      return res.status(404).json({ message: "Vendor not found" })
    }
    
    // For now, return mock review structure
    // In a real implementation, this would fetch from a reviews module
    const reviews: any[] = []
    
    // Calculate rating breakdown
    const ratingBreakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    }
    
    res.json({
      reviews,
      vendor: {
        id: vendor.id,
        handle: vendor.handle,
        business_name: vendor.business_name,
        rating: vendor.rating || 0,
        review_count: vendor.review_count || 0,
      },
      rating_breakdown: ratingBreakdown,
      count: reviews.length,
      offset: Number(offset),
      limit: Number(limit),
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch vendor reviews",
      error: error.message,
    })
  }
}
