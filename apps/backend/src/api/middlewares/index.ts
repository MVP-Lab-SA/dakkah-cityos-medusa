import { defineMiddlewares } from "@medusajs/framework/http"
import {
  detectTenantMiddleware,
  requireTenantMiddleware,
  injectTenantContextMiddleware,
} from "./tenant-context.js"
import {
  scopeToTenantMiddleware,
  scopeToVendorMiddleware,
  scopeToCompanyMiddleware,
} from "./scope-guards.js"
import { nodeContextMiddleware } from "./node-context.js"
import { platformContextMiddleware } from "./platform-context.js"

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

export * from "./tenant-context.js"
export * from "./scope-guards.js"
export * from "./node-context.js"
export * from "./platform-context.js"
