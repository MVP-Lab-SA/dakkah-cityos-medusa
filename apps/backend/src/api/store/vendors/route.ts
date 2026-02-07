import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /store/vendors
 * List all public vendors
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorModule = req.scope.resolve("vendor") as any
  
  const { 
    offset = 0, 
    limit = 50,
    category,
    is_verified,
    sort_by = "name",
    order = "ASC",
  } = req.query
  
  try {
    // Only show active, approved vendors publicly
    const filters: Record<string, unknown> = {
      status: "active",
    }
    
    if (is_verified === "true") filters.is_verified = true
    
    const vendors = await vendorModule.listVendors(filters, {
      skip: Number(offset),
      take: Number(limit),
      order: { [sort_by as string]: order },
    })
    
    const vendorList = Array.isArray(vendors) ? vendors : [vendors].filter(Boolean)
    
    // Map to public-safe data
    const publicVendors = vendorList.map((vendor: any) => ({
      id: vendor.id,
      handle: vendor.handle,
      business_name: vendor.business_name,
      description: vendor.description,
      logo_url: vendor.logo_url,
      banner_url: vendor.banner_url,
      is_verified: vendor.is_verified,
      total_products: vendor.total_products,
      total_orders: vendor.total_orders,
      rating: vendor.rating || 0,
      review_count: vendor.review_count || 0,
      categories: vendor.categories || [],
      created_at: vendor.created_at,
    }))
    
    res.json({
      vendors: publicVendors,
      count: publicVendors.length,
      offset: Number(offset),
      limit: Number(limit),
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch vendors",
      error: error.message,
    })
  }
}
