import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createLogger } from "../../lib/logger"
const logger = createLogger("middlewares-tenant-context")

/**
 * Tenant Context Interface
 * Attached to req.context for all tenant-scoped operations
 */
export interface TenantContext {
  tenant_id: string
  tenant_handle: string
  store_id?: string
  store_handle?: string
  sales_channel_id?: string
  country_id: string
  scope_type: "theme" | "city"
  scope_id: string
  category_id: string
  subcategory_id?: string
  vendor_id?: string
  vendor_handle?: string
}

declare module "@medusajs/framework/http" {
  interface MedusaRequest {
    tenantContext?: TenantContext
  }
}

/**
 * Detect Tenant Middleware
 * Resolves tenant context from:
 * 1. Custom domain (highest priority)
 * 2. Subdomain
 * 3. Publishable API key (fallback)
 * 
 * Attaches TenantContext to req.tenantContext
 */
export async function detectTenantMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  try {
    const tenantModuleService: any = req.scope.resolve("tenantModuleService")
    const cityosStoreService: any = req.scope.resolve("cityosStoreService")

    // Get hostname from request
    const hostname = req.get("host") || ""
    const parts = hostname.split(".")
    
    let tenant: any = null
    let store: any = null
    /** Sales channel from publishable API key (when CityOS store row is missing) */
    let publishableSalesChannelId: string | undefined

    // Strategy 1: Try custom domain first (exact match)
    if (hostname && !hostname.includes("localhost")) {
      tenant = await tenantModuleService.retrieveTenantByDomain(hostname)
      if (tenant) {
        store = await cityosStoreService.retrieveStoreByDomain(hostname)
      }
    }

    // Strategy 2: Try subdomain (format: {subdomain}.{domain}.{tld})
    if (!tenant && parts.length >= 3) {
      const subdomain = parts[0]
      
      // First check if it's a store subdomain
      store = await cityosStoreService.retrieveStoreBySubdomain(subdomain)
      if (store) {
        tenant = await tenantModuleService.retrieveTenants(store.tenant_id)
      } else {
        // Otherwise check tenant subdomain
        tenant = await tenantModuleService.retrieveTenantBySubdomain(subdomain)
      }
    }

    // Strategy 3: Publishable API key → linked sales channel → CityOS store → tenant
    if (!tenant) {
      const publishableKey = req.get("x-publishable-api-key")?.trim()
      if (publishableKey) {
        try {
          const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
          const { data: keyRows } = await query.graph({
            entity: "api_key",
            fields: ["id", "sales_channels.id"],
            filters: { token: publishableKey, type: "publishable" },
          })
          const keyRow = keyRows?.[0] as { sales_channels?: { id: string }[] } | undefined
          const salesChannelId = keyRow?.sales_channels?.[0]?.id
          publishableSalesChannelId = salesChannelId

          if (salesChannelId) {
            store = await cityosStoreService.retrieveStoreBySalesChannel(salesChannelId)
            if (store?.tenant_id) {
              tenant = await tenantModuleService.retrieveTenants(store.tenant_id)
            }
          }

          if (!tenant) {
            tenant =
              (await tenantModuleService.retrieveTenantByHandle("dakkah")) ||
              (await tenantModuleService.retrieveTenantBySlug?.("dakkah"))
          }
        } catch (error) {
          logger.error("Error resolving tenant from publishable key:", error)
        }
      }
    }

    // If no tenant found, continue without tenant context
    // (Some routes like health checks don't need tenant context)
    if (!tenant) {
      return next()
    }

    // Verify tenant is active
    if (tenant.status === "suspended") {
      return res.status(403).json({
        error: "Tenant Suspended",
        message: "This tenant account is currently suspended.",
      })
    }

    if (tenant.status === "inactive") {
      return res.status(403).json({
        error: "Tenant Inactive",
        message: "This tenant account is not active.",
      })
    }

    const countryId = tenant.country_id || "sa"
    // Build tenant context (tenant model may omit hierarchy fields used in older drafts)
    const tenantContext: TenantContext = {
      tenant_id: tenant.id,
      tenant_handle: tenant.handle || tenant.slug,
      country_id: countryId,
      scope_type: (tenant.scope_type as TenantContext["scope_type"]) || "city",
      scope_id: tenant.scope_id || countryId,
      category_id: tenant.category_id || countryId,
      subcategory_id: tenant.subcategory_id,
    }

    // Add store context if available
    if (store) {
      tenantContext.store_id = store.id
      tenantContext.store_handle = store.handle
      tenantContext.sales_channel_id = store.sales_channel_id
    } else if (publishableSalesChannelId) {
      tenantContext.sales_channel_id = publishableSalesChannelId
    }

    // Check for vendor context (from user session or JWT)
    const authUser = (req as any).auth?.user
    if (authUser?.vendor_id) {
      tenantContext.vendor_id = authUser.vendor_id
      tenantContext.vendor_handle = authUser.vendor_handle
    }

    // Attach to request
    req.tenantContext = tenantContext

    next()
  } catch (error) {
    logger.error("Tenant detection middleware error:", error)
    res.status(500).json({
      error: "Tenant Resolution Error",
      message: "Failed to resolve tenant context",
    })
  }
}

/**
 * Require Tenant Middleware
 * Enforces that tenant context must be present
 * Use on routes that absolutely require tenant context
 */
export function requireTenantMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  if (!req.tenantContext) {
    return res.status(400).json({
      error: "Tenant Required",
      message: "This endpoint requires tenant context. Provide a valid domain, subdomain, or publishable API key.",
    })
  }
  next()
}

/**
 * Inject Tenant Context to Container
 * Makes tenant context available to services and workflows
 */
export function injectTenantContextMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  if (req.tenantContext) {
    // Add to container for use in services
    req.scope.register({
      tenantContext: {
        resolve: () => req.tenantContext,
      },
    })
  }
  next()
}
