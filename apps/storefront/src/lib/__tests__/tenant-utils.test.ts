import { describe, it, expect } from 'vitest'
import { extractTenantId, buildTenantRoute, isValidTenant, normalizeTenantId, extractTenantFromHostname } from '../tenant-utils'

describe("Tenant Utils", () => {
  describe("extractTenantId", () => {
    it("extracts tenant ID from URL path", () => {
      expect(extractTenantId("https://example.com/acme/products")).toBe("acme")
    })

    it("extracts tenant ID from path without protocol", () => {
      expect(extractTenantId("example.com/tenant-1/shop")).toBe("tenant-1")
    })

    it("returns null for empty string", () => {
      expect(extractTenantId("")).toBeNull()
    })

    it("returns null for null-ish input", () => {
      expect(extractTenantId("")).toBeNull()
    })
  })

  describe("buildTenantRoute", () => {
    it("builds route with tenant prefix", () => {
      expect(buildTenantRoute("acme", "/products")).toBe("/acme/products")
    })

    it("normalizes path without leading slash", () => {
      expect(buildTenantRoute("acme", "products")).toBe("/acme/products")
    })

    it("returns path only when tenant is empty", () => {
      expect(buildTenantRoute("", "/products")).toBe("/products")
    })

    it("defaults to root path", () => {
      expect(buildTenantRoute("acme")).toBe("/acme/")
    })
  })

  describe("isValidTenant", () => {
    it("returns true for valid tenant IDs", () => {
      expect(isValidTenant("acme")).toBe(true)
      expect(isValidTenant("my-store-123")).toBe(true)
    })

    it("returns false for empty string", () => {
      expect(isValidTenant("")).toBe(false)
    })

    it("returns false for IDs with invalid characters", () => {
      expect(isValidTenant("ACME")).toBe(false)
      expect(isValidTenant("my store")).toBe(false)
      expect(isValidTenant("my_store")).toBe(false)
    })

    it("returns false for IDs that are too short or too long", () => {
      expect(isValidTenant("a")).toBe(false)
      expect(isValidTenant("a".repeat(64))).toBe(false)
    })
  })

  describe("extractTenantFromHostname", () => {
    it("extracts subdomain from hostname", () => {
      expect(extractTenantFromHostname("acme.platform.com")).toBe("acme")
    })

    it("returns null for top-level domain", () => {
      expect(extractTenantFromHostname("platform.com")).toBeNull()
    })
  })
})
