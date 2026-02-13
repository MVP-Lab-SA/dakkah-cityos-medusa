import {
  CMS_PAGE_REGISTRY,
  VERTICAL_TEMPLATES,
  NAVIGATION_REGISTRY,
  resolveLocalCMSPage,
  queryPages,
  getLocalCMSNavigation,
} from "../../../src/lib/platform/cms-registry"
import { DEFAULT_TENANT_ID } from "../../../src/lib/platform/registry"

describe("cms-registry", () => {
  describe("VERTICAL_TEMPLATES", () => {
    it("is a non-empty array of vertical definitions", () => {
      expect(VERTICAL_TEMPLATES.length).toBeGreaterThan(0)
    })

    it("each vertical has required fields", () => {
      for (const v of VERTICAL_TEMPLATES) {
        expect(v).toHaveProperty("slug")
        expect(v).toHaveProperty("title")
        expect(v).toHaveProperty("endpoint")
        expect(v).toHaveProperty("filterFields")
        expect(v).toHaveProperty("sortFields")
        expect(v).toHaveProperty("cardLayout")
        expect(v).toHaveProperty("category")
      }
    })

    it("has valid categories", () => {
      const validCategories = ["commerce", "services", "lifestyle", "community"]
      for (const v of VERTICAL_TEMPLATES) {
        expect(validCategories).toContain(v.category)
      }
    })

    it("contains restaurants vertical", () => {
      const restaurant = VERTICAL_TEMPLATES.find((v) => v.slug === "restaurants")
      expect(restaurant).toBeDefined()
      expect(restaurant!.endpoint).toBe("/store/restaurants")
    })
  })

  describe("CMS_PAGE_REGISTRY", () => {
    it("contains home page", () => {
      const home = CMS_PAGE_REGISTRY.find((p) => p.id === "local-cms-home")
      expect(home).toBeDefined()
      expect(home!.template).toBe("landing")
      expect(home!.path).toBe("")
    })

    it("contains list and detail pages for each vertical", () => {
      for (const v of VERTICAL_TEMPLATES) {
        const list = CMS_PAGE_REGISTRY.find((p) => p.id === `local-cms-${v.slug}-list`)
        const detail = CMS_PAGE_REGISTRY.find((p) => p.id === `local-cms-${v.slug}-detail`)
        expect(list).toBeDefined()
        expect(detail).toBeDefined()
        expect(list!.template).toBe("vertical-list")
        expect(detail!.template).toBe("vertical-detail")
      }
    })

    it("all pages have published status", () => {
      for (const page of CMS_PAGE_REGISTRY) {
        expect(page._status).toBe("published")
      }
    })
  })

  describe("resolveLocalCMSPage", () => {
    it("resolves home page for empty path", () => {
      const page = resolveLocalCMSPage("", DEFAULT_TENANT_ID, "en")
      expect(page).not.toBeNull()
      expect(page!.id).toBe("local-cms-home")
    })

    it("resolves home page for root slash", () => {
      const page = resolveLocalCMSPage("/", DEFAULT_TENANT_ID, "en")
      expect(page).not.toBeNull()
      expect(page!.id).toBe("local-cms-home")
    })

    it("resolves vertical list page", () => {
      const page = resolveLocalCMSPage("restaurants", DEFAULT_TENANT_ID, "en")
      expect(page).not.toBeNull()
      expect(page!.template).toBe("vertical-list")
    })

    it("resolves vertical detail page for nested path", () => {
      const page = resolveLocalCMSPage("restaurants/best-pizza", DEFAULT_TENANT_ID, "en")
      expect(page).not.toBeNull()
      expect(page!.template).toBe("vertical-detail")
      expect(page!.title).toContain("Best Pizza")
    })

    it("returns null for unknown path", () => {
      const page = resolveLocalCMSPage("nonexistent-page", DEFAULT_TENANT_ID, "en")
      expect(page).toBeNull()
    })

    it("returns null for wrong tenant", () => {
      const page = resolveLocalCMSPage("restaurants", "wrong-tenant-id", "en")
      expect(page).toBeNull()
    })

    it("resolves store page", () => {
      const page = resolveLocalCMSPage("store", DEFAULT_TENANT_ID, "en")
      expect(page).not.toBeNull()
      expect(page!.id).toBe("local-cms-store")
    })

    it("strips leading and trailing slashes", () => {
      const page = resolveLocalCMSPage("///store///", DEFAULT_TENANT_ID, "en")
      expect(page).not.toBeNull()
      expect(page!.id).toBe("local-cms-store")
    })
  })

  describe("queryPages", () => {
    it("returns paginated results with defaults", () => {
      const result = queryPages({})
      expect(result.page).toBe(1)
      expect(result.limit).toBe(10)
      expect(result.docs.length).toBeLessThanOrEqual(10)
      expect(result.totalDocs).toBe(CMS_PAGE_REGISTRY.length)
      expect(result.totalPages).toBeGreaterThan(0)
    })

    it("filters by template using where clause", () => {
      const result = queryPages({ where: { template: "landing" } })
      expect(result.docs.length).toBeGreaterThan(0)
      for (const doc of result.docs) {
        expect(doc.template).toBe("landing")
      }
    })

    it("supports equals operator in where", () => {
      const result = queryPages({ where: { _status: { equals: "published" } } })
      expect(result.totalDocs).toBe(CMS_PAGE_REGISTRY.length)
    })

    it("supports not_equals operator", () => {
      const result = queryPages({ where: { template: { not_equals: "landing" } } })
      for (const doc of result.docs) {
        expect(doc.template).not.toBe("landing")
      }
    })

    it("supports sort ascending", () => {
      const result = queryPages({ sort: "title", limit: 100 })
      for (let i = 1; i < result.docs.length; i++) {
        expect(result.docs[i].title >= result.docs[i - 1].title).toBe(true)
      }
    })

    it("supports sort descending", () => {
      const result = queryPages({ sort: "-title", limit: 100 })
      for (let i = 1; i < result.docs.length; i++) {
        expect(result.docs[i].title <= result.docs[i - 1].title).toBe(true)
      }
    })

    it("paginates correctly", () => {
      const page1 = queryPages({ limit: 2, page: 1 })
      const page2 = queryPages({ limit: 2, page: 2 })
      expect(page1.docs).toHaveLength(2)
      expect(page2.docs).toHaveLength(2)
      expect(page1.docs[0].id).not.toBe(page2.docs[0].id)
      expect(page1.hasNextPage).toBe(true)
      expect(page1.hasPrevPage).toBe(false)
      expect(page2.hasPrevPage).toBe(true)
    })

    it("supports contains operator", () => {
      const result = queryPages({ where: { title: { contains: "restaurant" } } })
      expect(result.docs.length).toBeGreaterThan(0)
      for (const doc of result.docs) {
        expect(doc.title.toLowerCase()).toContain("restaurant")
      }
    })

    it("supports in operator", () => {
      const result = queryPages({
        where: { template: { in: ["landing", "category"] } },
        limit: 100,
      })
      for (const doc of result.docs) {
        expect(["landing", "category"]).toContain(doc.template)
      }
    })
  })

  describe("NAVIGATION_REGISTRY", () => {
    it("contains header and footer navigations", () => {
      expect(NAVIGATION_REGISTRY).toHaveLength(2)
      const locations = NAVIGATION_REGISTRY.map((n) => n.location)
      expect(locations).toContain("header")
      expect(locations).toContain("footer")
    })

    it("header navigation has category groups", () => {
      const header = NAVIGATION_REGISTRY.find((n) => n.location === "header")!
      const labels = header.items.map((i) => i.label)
      expect(labels).toContain("Commerce")
      expect(labels).toContain("Services")
      expect(labels).toContain("Lifestyle")
      expect(labels).toContain("Community")
    })

    it("header navigation items have children", () => {
      const header = NAVIGATION_REGISTRY.find((n) => n.location === "header")!
      for (const item of header.items) {
        expect(item.children!.length).toBeGreaterThan(0)
      }
    })
  })

  describe("getLocalCMSNavigation", () => {
    it("returns header navigation for valid tenant", () => {
      const nav = getLocalCMSNavigation(DEFAULT_TENANT_ID, "header")
      expect(nav).not.toBeNull()
      expect(nav!.location).toBe("header")
    })

    it("returns footer navigation for valid tenant", () => {
      const nav = getLocalCMSNavigation(DEFAULT_TENANT_ID, "footer")
      expect(nav).not.toBeNull()
      expect(nav!.location).toBe("footer")
    })

    it("returns null for unknown location", () => {
      const nav = getLocalCMSNavigation(DEFAULT_TENANT_ID, "sidebar")
      expect(nav).toBeNull()
    })

    it("returns null for wrong tenant", () => {
      const nav = getLocalCMSNavigation("wrong-tenant", "header")
      expect(nav).toBeNull()
    })
  })
})
