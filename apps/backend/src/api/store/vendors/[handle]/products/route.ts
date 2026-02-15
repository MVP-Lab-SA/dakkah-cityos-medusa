import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../../lib/api-error-handler"

/**
 * GET /store/vendors/:handle/products
 * Get vendor's products
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorModule = req.scope.resolve("vendor") as any
  const query = req.scope.resolve("query")
  const { handle } = req.params
  
  const { 
    offset = 0, 
    limit = 20,
    category,
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
    
    // Get vendor products
    const vendorProducts = await vendorModule.getVendorProducts(vendor.id, "approved")
    const productIds = (Array.isArray(vendorProducts) ? vendorProducts : [vendorProducts].filter(Boolean))
      .map((vp: any) => vp.product_id)
    
    if (productIds.length === 0) {
      return res.json({
        products: [],
        count: 0,
        offset: Number(offset),
        limit: Number(limit),
      })
    }
    
    // Fetch full product details via query
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "handle",
        "description",
        "thumbnail",
        "status",
        "variants.*",
        "variants.prices.*",
        "options.*",
        "images.*",
      ],
      filters: {
        id: productIds,
        status: "published",
      },
      pagination: {
        skip: Number(offset),
        take: Number(limit),
      },
    })
    
    res.json({
      products,
      vendor: {
        id: vendor.id,
        handle: vendor.handle,
        business_name: vendor.business_name,
      },
      count: products.length,
      offset: Number(offset),
      limit: Number(limit),
    })
  } catch (error: any) {
    handleApiError(res, error, "STORE-VENDORS-HANDLE-PRODUCTS")}
}

