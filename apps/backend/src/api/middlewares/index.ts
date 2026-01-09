import { defineMiddlewares } from "@medusajs/framework/http"
import {
  detectTenantMiddleware,
  requireTenantMiddleware,
  injectTenantContextMiddleware,
} from "./tenant-context"
import {
  scopeToTenantMiddleware,
  scopeToVendorMiddleware,
  scopeToCompanyMiddleware,
} from "./scope-guards"

/**
 * Dakkah CityOS Middleware Configuration
 * Implements tenant detection, scoping, and authorization
 */
export default defineMiddlewares({
  routes: [
    // Storefront APIs: Detect tenant + require it
    {
      matcher: "/store/*",
      middlewares: [
        detectTenantMiddleware,
        requireTenantMiddleware,
        injectTenantContextMiddleware,
      ],
    },
    
    // Admin APIs: Detect tenant + scope by role
    {
      matcher: "/admin/*",
      middlewares: [
        detectTenantMiddleware,
        injectTenantContextMiddleware,
        scopeToTenantMiddleware,
      ],
      method: ["POST", "PUT", "PATCH", "DELETE"],
    },
    
    // Vendor APIs: Require vendor scope
    {
      matcher: "/vendor/*",
      middlewares: [
        detectTenantMiddleware,
        injectTenantContextMiddleware,
        scopeToVendorMiddleware,
      ],
    },
    
    // B2B APIs: Require company scope
    {
      matcher: "/store/b2b/*",
      middlewares: [
        detectTenantMiddleware,
        requireTenantMiddleware,
        injectTenantContextMiddleware,
        scopeToCompanyMiddleware,
      ],
    },
  ],
})

export * from "./tenant-context"
export * from "./scope-guards"
