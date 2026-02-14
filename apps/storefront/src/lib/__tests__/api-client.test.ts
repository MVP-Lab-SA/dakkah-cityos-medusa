import { describe, it, expect, vi, beforeEach } from "vitest"
import { fetchWithRetry, handleApiError, buildApiUrl, parseApiResponse, ApiError } from "@/lib/api-client"

describe("API Client Utilities", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe("handleApiError", () => {
    it("returns same ApiError if already an ApiError", () => {
      const original = new ApiError("Test", 400, "TEST_ERROR")
      const result = handleApiError(original)
      expect(result).toBe(original)
    })

    it("wraps network errors with NETWORK_ERROR code", () => {
      const error = new Error("fetch failed: network issue")
      const result = handleApiError(error)
      expect(result.code).toBe("NETWORK_ERROR")
      expect(result.status).toBe(0)
    })

    it("wraps generic errors with INTERNAL_ERROR code", () => {
      const error = new Error("Something broke")
      const result = handleApiError(error)
      expect(result.code).toBe("INTERNAL_ERROR")
      expect(result.status).toBe(500)
    })

    it("handles non-Error objects", () => {
      const result = handleApiError("string error")
      expect(result.code).toBe("UNKNOWN_ERROR")
    })
  })

  describe("buildApiUrl", () => {
    it("builds URL with base and path", () => {
      const result = buildApiUrl("https://api.example.com", "/v1/products")
      expect(result).toBe("https://api.example.com/v1/products")
    })

    it("appends query parameters", () => {
      const result = buildApiUrl("https://api.example.com", "/v1/products", {
        limit: 10,
        status: "active",
      })
      expect(result).toContain("limit=10")
      expect(result).toContain("status=active")
    })

    it("skips undefined parameters", () => {
      const result = buildApiUrl("https://api.example.com", "/v1/products", {
        limit: 10,
        status: undefined,
      })
      expect(result).toContain("limit=10")
      expect(result).not.toContain("status")
    })
  })

  describe("parseApiResponse", () => {
    it("returns data field when present", () => {
      const result = parseApiResponse({ data: { id: 1, name: "Test" } })
      expect(result).toEqual({ id: 1, name: "Test" })
    })

    it("returns items field when data is absent", () => {
      const result = parseApiResponse({ items: [{ id: 1 }] })
      expect(result).toEqual([{ id: 1 }])
    })

    it("throws ApiError when error field is present", () => {
      expect(() => parseApiResponse({ error: "Not found" })).toThrow(ApiError)
    })

    it("throws ApiError when message field indicates error", () => {
      expect(() => parseApiResponse({ message: "Unauthorized" })).toThrow("Unauthorized")
    })
  })
})
