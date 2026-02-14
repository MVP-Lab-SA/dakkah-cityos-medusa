import { describe, it, expect } from "vitest"
import {
  buildBreadcrumbs,
  getActiveRoute,
  isRouteActive,
  getParentRoute,
} from "@/lib/navigation-utils"
import type { RouteConfig } from "@/lib/navigation-utils"

const routes: RouteConfig[] = [
  { path: "/", label: "Home" },
  { path: "/products", label: "Products", parent: "/" },
  { path: "/products/electronics", label: "Electronics", parent: "/products" },
  { path: "/products/electronics/phones", label: "Phones", parent: "/products/electronics" },
  { path: "/account", label: "Account", parent: "/" },
  { path: "/account/orders", label: "Orders", parent: "/account" },
]

describe("Navigation Utilities", () => {
  describe("buildBreadcrumbs", () => {
    it("builds breadcrumb trail from current path to root", () => {
      const crumbs = buildBreadcrumbs("/products/electronics", routes)
      expect(crumbs).toHaveLength(3)
      expect(crumbs[0].label).toBe("Home")
      expect(crumbs[1].label).toBe("Products")
      expect(crumbs[2].label).toBe("Electronics")
      expect(crumbs[2].isActive).toBe(true)
    })

    it("returns single breadcrumb for root path", () => {
      const crumbs = buildBreadcrumbs("/", routes)
      expect(crumbs).toHaveLength(1)
      expect(crumbs[0].label).toBe("Home")
      expect(crumbs[0].isActive).toBe(true)
    })

    it("returns empty array for unknown path", () => {
      const crumbs = buildBreadcrumbs("/unknown", routes)
      expect(crumbs).toHaveLength(0)
    })
  })

  describe("getActiveRoute", () => {
    it("returns exact match route", () => {
      const route = getActiveRoute("/products", routes)
      expect(route?.label).toBe("Products")
    })

    it("returns closest matching parent for nested paths", () => {
      const route = getActiveRoute("/products/electronics/phones/iphone", routes)
      expect(route?.label).toBe("Phones")
    })

    it("returns root route as fallback for unmatched paths", () => {
      const route = getActiveRoute("/nonexistent", routes)
      expect(route?.path).toBe("/")
    })
  })

  describe("isRouteActive", () => {
    it("returns true for exact match", () => {
      expect(isRouteActive("/products", "/products")).toBe(true)
    })

    it("returns true when current path is nested under route", () => {
      expect(isRouteActive("/products", "/products/electronics")).toBe(true)
    })

    it("returns false when exact=true and paths differ", () => {
      expect(isRouteActive("/products", "/products/electronics", true)).toBe(false)
    })

    it("returns false for unrelated paths", () => {
      expect(isRouteActive("/products", "/account")).toBe(false)
    })
  })

  describe("getParentRoute", () => {
    it("returns parent route from config", () => {
      const parent = getParentRoute("/products/electronics", routes)
      expect(parent?.label).toBe("Products")
    })

    it("falls back to path-based parent when no config parent", () => {
      const customRoutes: RouteConfig[] = [
        { path: "/a", label: "A" },
        { path: "/a/b", label: "B" },
      ]
      const parent = getParentRoute("/a/b", customRoutes)
      expect(parent?.label).toBe("A")
    })

    it("returns null for root path", () => {
      const parent = getParentRoute("/", routes)
      expect(parent).toBeNull()
    })
  })
})
