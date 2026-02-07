import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /store/vendors/featured
 * Get featured vendors for homepage
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorModule = req.scope.resolve("vendor") as any
  
  const { limit = 6 } = req.query
  
  try {
    // Get verified, active vendors with most orders (featured logic)
    const vendors = await vendorModule.listVendors(
      { 
        status: "active",
        is_verified: true,
      },
      {
        take: Number(limit),
        order: { total_orders: "DESC" },
      }
    )
    
    const vendorList = Array.isArray(vendors) ? vendors : [vendors].filter(Boolean)
    
    // Map to public-safe data
    const featuredVendors = vendorList.map((vendor: any) => ({
      id: vendor.id,
      handle: vendor.handle,
      business_name: vendor.business_name,
      description: vendor.description,
      logo_url: vendor.logo_url,
      banner_url: vendor.banner_url,
      is_verified: vendor.is_verified,
      total_products: vendor.total_products,
      rating: vendor.rating || 0,
      review_count: vendor.review_count || 0,
    }))
    
    res.json({
      vendors: featuredVendors,
      count: featuredVendors.length,
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch featured vendors",
      error: error.message,
    })
  }
}
