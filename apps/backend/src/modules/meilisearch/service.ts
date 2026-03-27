import { MedusaService } from "@medusajs/framework/utils"

// meilisearch is published as ESM; load CJS build to match Medusa's CJS pipeline.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { MeiliSearch: MeiliSearchCtor } = require("meilisearch") as {
  MeiliSearch: new (config: { host: string; apiKey?: string }) => {
    index: (name: string) => unknown
    health: () => Promise<{ status: string }>
    getVersion: () => Promise<{ pkgVersion: string }>
  }
}

export type MeilisearchModuleOptions = {
  host: string
  apiKey?: string
  productIndexName?: string
}

type MeiliClient = InstanceType<typeof MeiliSearchCtor>

/**
 * Lightweight Meilisearch client holder for CityOS. Indexing workflows can
 * resolve this module and call getProductIndex() / getClient().
 */
class MeilisearchModuleService extends MedusaService({}) {
  protected client_: MeiliClient
  protected productIndexName_: string

  constructor(
    container: Record<string, unknown>,
    options: MeilisearchModuleOptions,
  ) {
    super(container, options)
    const host = options?.host?.trim()
    if (!host) {
      throw new Error("Meilisearch module: host is required")
    }
    this.client_ = new MeiliSearchCtor({
      host,
      apiKey: options.apiKey || "",
    })
    this.productIndexName_ = options.productIndexName || "products"
  }

  getClient(): MeiliClient {
    return this.client_
  }

  getProductIndex(): ReturnType<MeiliClient["index"]> {
    return this.client_.index(this.productIndexName_)
  }

  get productIndexName(): string {
    return this.productIndexName_
  }

  async health(): Promise<{ ok: boolean; version?: string; error?: string }> {
    try {
      const health = await this.client_.health()
      const version = await this.client_.getVersion()
      return {
        ok: health.status === "available",
        version: version.pkgVersion,
      }
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : String(e),
      }
    }
  }
}

export default MeilisearchModuleService
