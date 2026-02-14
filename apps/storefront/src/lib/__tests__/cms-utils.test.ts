import { describe, it, expect } from 'vitest'
import { getVerticalSlug, isValidVertical, getVerticalConfig, getEnabledVerticals, getVerticalLabel } from '../cms-utils'

describe("CMS Utils", () => {
  describe("getVerticalSlug", () => {
    it("returns slug for valid vertical key", () => {
      expect(getVerticalSlug("marketplace")).toBe("marketplace")
    })

    it("returns hyphenated slug for real_estate", () => {
      expect(getVerticalSlug("real_estate")).toBe("real-estate")
    })

    it("returns null for unknown vertical key", () => {
      expect(getVerticalSlug("nonexistent")).toBeNull()
    })

    it("returns null for empty string", () => {
      expect(getVerticalSlug("")).toBeNull()
    })
  })

  describe("isValidVertical", () => {
    it("returns true for valid vertical keys", () => {
      expect(isValidVertical("marketplace")).toBe(true)
      expect(isValidVertical("grocery")).toBe(true)
      expect(isValidVertical("healthcare")).toBe(true)
    })

    it("returns false for invalid vertical keys", () => {
      expect(isValidVertical("unknown")).toBe(false)
      expect(isValidVertical("")).toBe(false)
    })
  })

  describe("getVerticalConfig", () => {
    it("returns full config for valid vertical", () => {
      const config = getVerticalConfig("grocery")
      expect(config).toEqual({
        slug: "grocery",
        label: "Grocery",
        icon: "shopping_cart",
        enabled: true,
      })
    })

    it("returns null for invalid vertical", () => {
      expect(getVerticalConfig("invalid")).toBeNull()
    })

    it("returns disabled config for events vertical", () => {
      const config = getVerticalConfig("events")
      expect(config).not.toBeNull()
      expect(config!.enabled).toBe(false)
    })
  })

  describe("getEnabledVerticals", () => {
    it("returns only enabled vertical keys", () => {
      const enabled = getEnabledVerticals()
      expect(enabled).toContain("marketplace")
      expect(enabled).not.toContain("events")
    })
  })

  describe("getVerticalLabel", () => {
    it("returns human-readable label for valid vertical", () => {
      expect(getVerticalLabel("real_estate")).toBe("Real Estate")
    })

    it("returns key as fallback for unknown vertical", () => {
      expect(getVerticalLabel("unknown_key")).toBe("unknown_key")
    })
  })
})
