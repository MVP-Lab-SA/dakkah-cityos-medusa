// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import CmsPage from "./models/cms-page"
import CmsNavigation from "./models/cms-navigation"

class CMSContentModuleService extends MedusaService({
  CmsPage,
  CmsNavigation,
}) {
  async resolve(data: {
    slug: string
    tenantId: string
    locale?: string
    countryCode?: string
    regionZone?: string
  }) {
    const filters: Record<string, any> = {
      slug: data.slug,
      tenant_id: data.tenantId,
      status: "published",
    }

    if (data.locale) {
      filters.locale = data.locale
    }

    const pages = await this.listCmsPages(filters)
    const pageList = Array.isArray(pages) ? pages : [pages].filter(Boolean)

    if (pageList.length === 0) {
      return null
    }

    if (data.countryCode || data.regionZone) {
      const specific = pageList.find((p: any) => {
        if (data.countryCode && p.country_code && p.country_code !== data.countryCode) return false
        if (data.regionZone && p.region_zone && p.region_zone !== data.regionZone) return false
        return true
      })

      if (specific) return specific
    }

    const generic = pageList.find((p: any) => !p.country_code && !p.region_zone)
    return generic || pageList[0]
  }

  async publish(pageId: string) {
    const page = await this.retrieveCmsPage(pageId)

    if (page.status === "published") {
      throw new Error("Page is already published")
    }

    return await (this as any).updateCmsPages({
      id: pageId,
      status: "published",
      published_at: new Date(),
    })
  }

  async archive(pageId: string) {
    const page = await this.retrieveCmsPage(pageId)

    if (page.status === "archived") {
      throw new Error("Page is already archived")
    }

    return await (this as any).updateCmsPages({
      id: pageId,
      status: "archived",
    })
  }

  async getNavigation(data: {
    tenantId: string
    location: string
    locale?: string
  }) {
    const filters: Record<string, any> = {
      tenant_id: data.tenantId,
      location: data.location,
      status: "active",
    }

    if (data.locale) {
      filters.locale = data.locale
    }

    const navigations = await this.listCmsNavigations(filters)
    const navList = Array.isArray(navigations) ? navigations : [navigations].filter(Boolean)

    if (navList.length === 0) {
      return null
    }

    if (data.locale) {
      const localized = navList.find((n: any) => n.locale === data.locale)
      if (localized) return localized
    }

    const defaultNav = navList.find((n: any) => n.locale === "en")
    return defaultNav || navList[0]
  }

  async updateNavigation(data: {
    tenantId: string
    location: string
    locale?: string
    items: any[]
    metadata?: Record<string, unknown>
  }) {
    const existing = await this.getNavigation({
      tenantId: data.tenantId,
      location: data.location,
      locale: data.locale,
    })

    if (existing) {
      return await (this as any).updateCmsNavigations({
        id: existing.id,
        items: data.items,
        metadata: data.metadata || existing.metadata,
      })
    }

    return await (this as any).createCmsNavigations({
      tenant_id: data.tenantId,
      location: data.location,
      locale: data.locale || "en",
      items: data.items,
      status: "active",
      metadata: data.metadata || null,
    })
  }

  async listPublishedPages(
    tenantId: string,
    options?: { locale?: string; limit?: number; offset?: number }
  ) {
    const filters: Record<string, any> = {
      tenant_id: tenantId,
      status: "published",
    }

    if (options?.locale) {
      filters.locale = options.locale
    }

    const pages = await this.listCmsPages(filters, {
      take: options?.limit || 20,
      skip: options?.offset || 0,
      order: { published_at: "DESC" },
    })

    return Array.isArray(pages) ? pages : [pages].filter(Boolean)
  }

  async duplicatePage(pageId: string, newSlug?: string) {
    const original = await this.retrieveCmsPage(pageId)

    return await (this as any).createCmsPages({
      tenant_id: original.tenant_id,
      title: `${original.title} (Copy)`,
      slug: newSlug || `${original.slug}-copy-${Date.now()}`,
      locale: original.locale,
      status: "draft",
      template: original.template,
      layout: original.layout,
      seo_title: original.seo_title,
      seo_description: original.seo_description,
      seo_image: original.seo_image,
      country_code: original.country_code,
      region_zone: original.region_zone,
      node_id: original.node_id,
      metadata: original.metadata,
    })
  }
}

export default CMSContentModuleService
