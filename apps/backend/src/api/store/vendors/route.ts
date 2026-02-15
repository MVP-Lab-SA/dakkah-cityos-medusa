import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

/**
 * GET /store/vendors
 * List all public vendors
 * Supports filtering by tenant_id or marketplace_id via TenantRelationship
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorModule = req.scope.resolve("vendor") as any
  const tenantModule = req.scope.resolve("tenant") as any
  
  const { 
    offset = 0, 
    limit = 50,
    category,
    is_verified,
    sort_by = "business_name",
    order = "ASC",
    tenant_id,
    marketplace_id,
  } = req.query

  const headerTenantId = req.headers["x-tenant-id"] as string | undefined
  
  try {
    const filters: Record<string, unknown> = {
      status: "active",
    }
    
    if (is_verified === "true") filters.is_verified = true

    const effectiveMarketplaceId = marketplace_id || headerTenantId
    if (effectiveMarketplaceId) {
      try {
        const marketplace = await tenantModule.retrieveTenant(effectiveMarketplaceId)
        
        if (!marketplace) {
          return res.status(404).json({
            message: "Marketplace not found",
            error: `Marketplace with ID ${effectiveMarketplaceId} does not exist`,
          })
        }
        
        const canHostVendors = marketplace.can_host_vendors === true || 
                               marketplace.tenant_type === "marketplace" || 
                               marketplace.tenant_type === "platform"
        
        if (!canHostVendors) {
          return res.status(400).json({
            message: "Invalid marketplace configuration",
            error: "Specified tenant is not configured to host vendors",
          })
        }
        
        const relationships = await tenantModule.listTenantRelationships({
          host_tenant_id: effectiveMarketplaceId,
          status: "active",
        })
        const relList = Array.isArray(relationships) ? relationships : [relationships].filter(Boolean)
        const vendorTenantIds = relList.map((r: any) => r.vendor_tenant_id)
        
        if (vendorTenantIds.length === 0) {
          return res.json({ vendors: [], count: 0, offset: Number(offset), limit: Number(limit) })
        }
        
        filters.tenant_id = vendorTenantIds
      } catch (error: any) {
        return handleApiError(res, error, "STORE-VENDORS")
      }
    } else if (tenant_id) {
      filters.tenant_id = tenant_id
    }
    
    const vendors = await vendorModule.listVendors(filters, {
      skip: Number(offset),
      take: Number(limit),
      order: { [sort_by as string]: order },
    })
    
    const vendorList = Array.isArray(vendors) ? vendors : [vendors].filter(Boolean)
    
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
      verticals: vendor.verticals || [],
      created_at: vendor.created_at,
    }))
    
    res.json({
      vendors: publicVendors,
      count: publicVendors.length,
      offset: Number(offset),
      limit: Number(limit),
    })
  } catch (error: any) {
    handleApiError(res, error, "STORE-VENDORS")}
}

