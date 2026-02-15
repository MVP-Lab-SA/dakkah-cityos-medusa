// @ts-nocheck
import axios, { AxiosInstance } from "axios"
import { DurableSyncTracker, durableSyncTracker } from "../../lib/platform/sync-tracker"
import { createLogger } from "../../lib/logger"
const logger = createLogger("integration:cms-hierarchy-sync")

export interface CMSSyncConfig {
  payloadUrl: string
  payloadApiKey: string
  erpnextUrl: string
  erpnextApiKey: string
  erpnextApiSecret: string
  tenantId?: string
}

export interface SyncResult {
  collection: string
  total: number
  created: number
  updated: number
  failed: number
  errors: string[]
}

const COLLECTION_ORDER = [
  { collection: "countries", doctype: "Country", mapper: "mapCountry" },
  { collection: "governance-authorities", doctype: "CMS Governance Authority", mapper: "mapGovernanceAuthority" },
  { collection: "scopes", doctype: "CMS Scope", mapper: "mapScope" },
  { collection: "categories", doctype: "CMS Category", mapper: "mapCategory" },
  { collection: "subcategories", doctype: "CMS Subcategory", mapper: "mapSubcategory" },
  { collection: "tenants", doctype: "CMS Tenant", mapper: "mapTenant" },
  { collection: "stores", doctype: "CMS Store", mapper: "mapStore" },
  { collection: "portals", doctype: "CMS Portal", mapper: "mapPortal" },
] as const

export class CMSHierarchySyncEngine {
  private payloadClient: AxiosInstance
  private erpnextClient: AxiosInstance
  private syncTracker: DurableSyncTracker
  private config: CMSSyncConfig

  constructor(config: CMSSyncConfig) {
    this.config = config
    this.syncTracker = durableSyncTracker

    this.payloadClient = axios.create({
      baseURL: config.payloadUrl,
      headers: {
        Authorization: `Bearer ${config.payloadApiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    })

    this.erpnextClient = axios.create({
      baseURL: `${config.erpnextUrl}/api`,
      headers: {
        Authorization: `token ${config.erpnextApiKey}:${config.erpnextApiSecret}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    })
  }

  async syncAll(): Promise<SyncResult[]> {
    logger.info("[CMSHierarchySync] Starting full hierarchy sync...")
    const results: SyncResult[] = []

    for (const entry of COLLECTION_ORDER) {
      try {
        const result = await this.syncCollection(entry.collection)
        results.push(result)
        logger.info(`[CMSHierarchySync] ${entry.collection}: ${result.created} created, ${result.updated} updated, ${result.failed} failed`)
      } catch (err: any) {
        console.error(`[CMSHierarchySync] Fatal error syncing ${entry.collection}: ${err.message}`)
        results.push({
          collection: entry.collection,
          total: 0,
          created: 0,
          updated: 0,
          failed: 0,
          errors: [err.message],
        })
      }
    }

    logger.info("[CMSHierarchySync] Full hierarchy sync complete.")
    return results
  }

  async syncCollection(collection: string): Promise<SyncResult> {
    const entry = COLLECTION_ORDER.find((e) => e.collection === collection)
    if (!entry) {
      throw new Error(`[CMSHierarchySync] Unknown collection: ${collection}`)
    }

    logger.info(`[CMSHierarchySync] Syncing collection: ${collection} → ${entry.doctype}`)

    const docs = await this.fetchPayloadDocs(collection)
    const result: SyncResult = {
      collection,
      total: docs.length,
      created: 0,
      updated: 0,
      failed: 0,
      errors: [],
    }

    for (const doc of docs) {
      const syncEntry = await this.syncTracker.recordSync({
        system: "cms-hierarchy",
        entity_type: collection,
        entity_id: doc.id,
        direction: "outbound",
        tenant_id: this.config.tenantId || "system",
      })

      try {
        await this.syncTracker.updateStatus(syncEntry.id, "processing")

        const mapper = this[entry.mapper as keyof this] as (doc: any) => Record<string, any>
        const mappedData = mapper.call(this, doc)

        const { created, name } = await this.createOrUpdateERPNext(entry.doctype, doc.id, mappedData)

        if (created) {
          result.created++
        } else {
          result.updated++
        }

        await this.syncTracker.updateStatus(syncEntry.id, "completed")
        logger.info(`[CMSHierarchySync] ${created ? "Created" : "Updated"} ${entry.doctype} "${name}" (cms_ref: ${doc.id})`)
      } catch (err: any) {
        result.failed++
        result.errors.push(`${doc.id}: ${err.message}`)
        await this.syncTracker.updateStatus(syncEntry.id, "failed", err.message)
        console.error(`[CMSHierarchySync] Failed to sync ${collection} doc ${doc.id}: ${err.message}`)
      }
    }

    return result
  }

  private async fetchPayloadDocs(collection: string, since?: string): Promise<any[]> {
    const allDocs: any[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const params: Record<string, any> = {
        limit: 100,
        page,
        depth: 1,
      }

      if (since) {
        params.where = JSON.stringify({
          updatedAt: { greater_than: since },
        })
      }

      const response = await this.payloadClient.get(`/api/${collection}`, { params })
      const data = response.data

      if (data.docs && data.docs.length > 0) {
        allDocs.push(...data.docs)
      }

      hasMore = data.hasNextPage === true
      page++
    }

    logger.info(`[CMSHierarchySync] Fetched ${allDocs.length} docs from Payload collection "${collection}"`)
    return allDocs
  }

  private async findERPNextByCmsRef(doctype: string, cmsRefId: string): Promise<any | null> {
    try {
      const response = await this.erpnextClient.get(`/resource/${doctype}`, {
        params: {
          filters: JSON.stringify([["custom_cms_ref_id", "=", cmsRefId]]),
          fields: JSON.stringify(["name", "custom_cms_ref_id"]),
          limit_page_length: 1,
        },
      })

      const records = response.data?.data
      if (records && records.length > 0) {
        return records[0]
      }
      return null
    } catch (err: any) {
      console.error(`[CMSHierarchySync] Error finding ${doctype} by cms_ref ${cmsRefId}: ${err.message}`)
      return null
    }
  }

  private async createOrUpdateERPNext(
    doctype: string,
    cmsRefId: string,
    data: Record<string, any>
  ): Promise<{ created: boolean; name: string }> {
    const existing = await this.findERPNextByCmsRef(doctype, cmsRefId)

    if (existing) {
      const response = await this.erpnextClient.put(`/resource/${doctype}/${existing.name}`, data)
      return { created: false, name: response.data?.data?.name || existing.name }
    } else {
      const payload = {
        ...data,
        custom_cms_ref_id: cmsRefId,
      }
      const response = await this.erpnextClient.post(`/resource/${doctype}`, payload)
      return { created: true, name: response.data?.data?.name }
    }
  }

  private mapCountry(doc: any): Record<string, any> {
    return {
      country_name: doc.name,
      custom_code: doc.code || doc.iso2,
      custom_iso3: doc.iso3,
      custom_currency: doc.currency,
      custom_timezone: doc.timezone,
      custom_region: doc.region,
      custom_locale: doc.locale,
      custom_status: doc.status || "active",
    }
  }

  private mapGovernanceAuthority(doc: any): Record<string, any> {
    return {
      custom_name: doc.name,
      custom_type: doc.type,
      custom_jurisdiction_level: doc.jurisdiction_level || doc.jurisdictionLevel,
      custom_parent_authority: doc.parent_authority?.id || doc.parent_authority || null,
      custom_country: doc.country?.id || doc.country || null,
      custom_status: doc.status || "active",
      custom_domain: doc.domain,
    }
  }

  private mapScope(doc: any): Record<string, any> {
    const countries = Array.isArray(doc.countries)
      ? doc.countries.map((c: any) => (typeof c === "string" ? c : c.id)).join(",")
      : ""

    return {
      custom_name: doc.name,
      custom_scope_type: doc.scope_type || doc.scopeType,
      custom_governance_authority: doc.governance_authority?.id || doc.governance_authority || null,
      custom_countries: countries,
      custom_status: doc.status || "active",
    }
  }

  private mapCategory(doc: any): Record<string, any> {
    return {
      custom_name: doc.name,
      custom_slug: doc.slug,
      custom_description: doc.description,
      custom_parent_category: doc.parent_category?.id || doc.parent_category || null,
      custom_status: doc.status || "active",
      custom_sort_order: doc.sort_order || doc.sortOrder || 0,
    }
  }

  private mapSubcategory(doc: any): Record<string, any> {
    return {
      custom_name: doc.name,
      custom_slug: doc.slug,
      custom_description: doc.description,
      custom_category: doc.category?.id || doc.category || null,
      custom_status: doc.status || "active",
      custom_sort_order: doc.sort_order || doc.sortOrder || 0,
    }
  }

  private mapTenant(doc: any): Record<string, any> {
    return {
      custom_name: doc.name,
      custom_handle: doc.handle || doc.slug,
      custom_tier: doc.tier || "free",
      custom_parent_tenant: doc.parent_tenant?.id || doc.parent_tenant || null,
      custom_status: doc.status || "active",
      custom_domain: doc.domain,
      custom_country: doc.country?.id || doc.country || null,
      custom_timezone: doc.timezone,
      custom_locale: doc.locale,
      custom_default_currency: doc.default_currency || doc.defaultCurrency,
    }
  }

  private mapStore(doc: any): Record<string, any> {
    return {
      custom_name: doc.name,
      custom_tenant: doc.tenant?.id || doc.tenant || null,
      custom_store_type: doc.store_type || doc.storeType,
      custom_country: doc.country?.id || doc.country || null,
      custom_status: doc.status || "active",
      custom_domain: doc.domain,
      custom_default_currency: doc.default_currency || doc.defaultCurrency,
    }
  }

  private mapPortal(doc: any): Record<string, any> {
    return {
      custom_name: doc.name,
      custom_tenant: doc.tenant?.id || doc.tenant || null,
      custom_portal_type: doc.portal_type || doc.portalType,
      custom_status: doc.status || "active",
      custom_domain: doc.domain,
      custom_features: typeof doc.features === "object" ? JSON.stringify(doc.features) : doc.features || null,
    }
  }
}

export function createHierarchySyncEngine(config?: Partial<CMSSyncConfig>): CMSHierarchySyncEngine {
  const fullConfig: CMSSyncConfig = {
    payloadUrl: config?.payloadUrl || process.env.PAYLOAD_CMS_URL_DEV || "",
    payloadApiKey: config?.payloadApiKey || process.env.PAYLOAD_API_KEY || "",
    erpnextUrl: config?.erpnextUrl || process.env.ERPNEXT_URL_DEV || "",
    erpnextApiKey: config?.erpnextApiKey || process.env.ERPNEXT_API_KEY || "",
    erpnextApiSecret: config?.erpnextApiSecret || process.env.ERPNEXT_API_SECRET || "",
    tenantId: config?.tenantId || process.env.DEFAULT_TENANT_ID || "system",
  }

  return new CMSHierarchySyncEngine(fullConfig)
}
