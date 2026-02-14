import { describe, it, expect } from 'vitest'
import { buildSearchQuery, serializeFilters, parseSearchParams, buildFilterHash } from '../search-utils'

describe("Search Utils", () => {
  describe("buildSearchQuery", () => {
    it("builds query string with search term", () => {
      const result = buildSearchQuery("shoes")
      expect(result).toBe("?q=shoes")
    })

    it("includes filters in query string", () => {
      const result = buildSearchQuery("shoes", { category: "footwear", minPrice: 50 })
      expect(result).toContain("q=shoes")
      expect(result).toContain("category=footwear")
      expect(result).toContain("min_price=50")
    })

    it("includes pagination options", () => {
      const result = buildSearchQuery("shoes", {}, { page: 2, limit: 10 })
      expect(result).toContain("page=2")
      expect(result).toContain("limit=10")
    })

    it("returns empty string when no term or filters", () => {
      const result = buildSearchQuery("")
      expect(result).toBe("")
    })

    it("trims whitespace from search term", () => {
      const result = buildSearchQuery("  shoes  ")
      expect(result).toBe("?q=shoes")
    })
  })

  describe("serializeFilters", () => {
    it("serializes filters to sorted query string", () => {
      const result = serializeFilters({ brand: "nike", category: "shoes" })
      expect(result).toBe("brand=nike&category=shoes")
    })

    it("excludes undefined and empty values", () => {
      const result = serializeFilters({ brand: "nike", category: undefined, rating: undefined })
      expect(result).toBe("brand=nike")
    })

    it("returns empty string for empty filters", () => {
      const result = serializeFilters({})
      expect(result).toBe("")
    })
  })

  describe("parseSearchParams", () => {
    it("parses query string into structured search params", () => {
      const result = parseSearchParams("?q=shoes&category=footwear&min_price=50&page=2")
      expect(result.term).toBe("shoes")
      expect(result.filters.category).toBe("footwear")
      expect(result.filters.minPrice).toBe(50)
      expect(result.page).toBe(2)
    })

    it("defaults to page 1 and limit 20", () => {
      const result = parseSearchParams("?q=test")
      expect(result.page).toBe(1)
      expect(result.limit).toBe(20)
    })

    it("parses boolean in_stock filter", () => {
      const result = parseSearchParams("?in_stock=true")
      expect(result.filters.inStock).toBe(true)
    })

    it("handles empty query string", () => {
      const result = parseSearchParams("")
      expect(result.term).toBe("")
      expect(result.page).toBe(1)
    })
  })

  describe("buildFilterHash", () => {
    it("returns consistent hash for same filters", () => {
      const hash1 = buildFilterHash({ brand: "nike", category: "shoes" })
      const hash2 = buildFilterHash({ brand: "nike", category: "shoes" })
      expect(hash1).toBe(hash2)
    })

    it("returns different hashes for different filters", () => {
      const hash1 = buildFilterHash({ brand: "nike" })
      const hash2 = buildFilterHash({ brand: "adidas" })
      expect(hash1).not.toBe(hash2)
    })
  })
})
