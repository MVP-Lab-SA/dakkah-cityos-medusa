import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

/**
 * GET /store/vendors/:handle
 * Get vendor public profile
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorModule = req.scope.resolve("vendor") as any
  const { handle } = req.params
  
  try {
    // Find vendor by handle
    const vendors = await vendorModule.listVendors({ handle })
    const vendorList = Array.isArray(vendors) ? vendors : [vendors].filter(Boolean)
    
    if (vendorList.length === 0) {
      return res.status(404).json({ message: "Vendor not found" })
    }
    
    const vendor = vendorList[0]
    
    // Only show active vendors
    if (vendor.status !== "active") {
      return res.status(404).json({ message: "Vendor not found" })
    }
    
    // Return public profile
    const publicProfile = {
      id: vendor.id,
      handle: vendor.handle,
      business_name: vendor.business_name,
      description: vendor.description,
      logo_url: vendor.logo_url,
      banner_url: vendor.banner_url,
      website_url: vendor.website_url,
      is_verified: vendor.is_verified,
      total_products: vendor.total_products,
      total_orders: vendor.total_orders,
      rating: vendor.rating || 0,
      review_count: vendor.review_count || 0,
      categories: vendor.categories || [],
      // Public policies
      return_policy: vendor.settings?.return_policy,
      shipping_policy: vendor.settings?.shipping_policy,
      // Social links
      social_links: vendor.social_links || {},
      created_at: vendor.created_at,
    }
    
    res.json({ vendor: publicProfile })
  } catch (error: any) {
    handleApiError(res, error, "STORE-VENDORS-HANDLE")}
}

