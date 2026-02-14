import { describe, it, expect } from "vitest"
import {
  getManagePageConfig,
  validateManageFields,
  formatManageTableData,
  getManageStatusOptions,
} from "@/lib/manage-utils"
import type { ManageField } from "@/lib/manage-utils"

describe("Manage Page Utilities", () => {
  describe("getManagePageConfig", () => {
    it("returns config for products entity", () => {
      const config = getManagePageConfig("products")
      expect(config).not.toBeNull()
      expect(config!.title).toBe("Manage Products")
      expect(config!.apiEndpoint).toBe("/api/admin/products")
      expect(config!.columns.length).toBeGreaterThan(0)
    })

    it("returns config for orders entity", () => {
      const config = getManagePageConfig("orders")
      expect(config).not.toBeNull()
      expect(config!.entityType).toBe("orders")
    })

    it("returns null for unknown entity type", () => {
      const config = getManagePageConfig("nonexistent")
      expect(config).toBeNull()
    })
  })

  describe("validateManageFields", () => {
    const fields: ManageField[] = [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "price", label: "Price", type: "number", required: true },
      { key: "status", label: "Status", type: "select", options: ["draft", "published"] },
    ]

    it("validates successfully with correct data", () => {
      const result = validateManageFields(fields, { title: "Test", price: 100, status: "draft" })
      expect(result.valid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it("returns errors for missing required fields", () => {
      const result = validateManageFields(fields, { status: "draft" })
      expect(result.valid).toBe(false)
      expect(result.errors.title).toBeDefined()
      expect(result.errors.price).toBeDefined()
    })

    it("validates number type", () => {
      const result = validateManageFields(fields, { title: "Test", price: "not_a_number" })
      expect(result.valid).toBe(false)
      expect(result.errors.price).toContain("must be a number")
    })

    it("validates select options", () => {
      const result = validateManageFields(fields, { title: "Test", price: 10, status: "invalid" })
      expect(result.valid).toBe(false)
      expect(result.errors.status).toContain("must be one of")
    })
  })

  describe("formatManageTableData", () => {
    it("formats items into headers and rows", () => {
      const columns = [
        { key: "title", label: "Title" },
        { key: "price", label: "Price" },
      ]
      const items = [
        { title: "Product A", price: 100 },
        { title: "Product B", price: 200 },
      ]

      const result = formatManageTableData(items, columns)

      expect(result.headers).toEqual(["Title", "Price"])
      expect(result.rows).toHaveLength(2)
      expect(result.rows[0]).toEqual(["Product A", 100])
    })

    it("handles missing values with empty string", () => {
      const columns = [{ key: "title", label: "Title" }, { key: "missing", label: "Missing" }]
      const items = [{ title: "Test" }]

      const result = formatManageTableData(items, columns)
      expect(result.rows[0][1]).toBe("")
    })
  })

  describe("getManageStatusOptions", () => {
    it("returns status options for known entity types", () => {
      expect(getManageStatusOptions("products")).toEqual(["draft", "published", "archived"])
      expect(getManageStatusOptions("orders")).toContain("pending")
    })

    it("returns default options for unknown entity type", () => {
      const result = getManageStatusOptions("unknown")
      expect(result).toEqual(["active", "inactive"])
    })
  })
})
