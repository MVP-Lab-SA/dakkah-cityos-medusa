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
import { nodeContextMiddleware } from "./node-context"
import { platformContextMiddleware } from "./platform-context"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/platform/*",
      middlewares: [platformContextMiddleware],
    },

    {
      matcher: "/store/cityos/*",
      middlewares: [nodeContextMiddleware],
    },

    {
      matcher: "/store/*",
      middlewares: [
        detectTenantMiddleware,
        requireTenantMiddleware,
        injectTenantContextMiddleware,
      ],
    },

    {
      matcher: "/admin/*",
      middlewares: [
        detectTenantMiddleware,
        injectTenantContextMiddleware,
        scopeToTenantMiddleware,
      ],
      method: ["POST", "PUT", "PATCH", "DELETE"],
    },

    {
      matcher: "/vendor/*",
      middlewares: [
        detectTenantMiddleware,
        injectTenantContextMiddleware,
        scopeToVendorMiddleware,
      ],
    },

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
export * from "./node-context"
export * from "./platform-context"
