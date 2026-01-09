import { MeiliSearch } from "meilisearch"

type InjectedDependencies = {
  logger: any
}

type ModuleOptions = {
  host: string
  apiKey: string
  productIndexName: string
}

class MeilisearchModuleService {
  private client_: MeiliSearch
  private options_: ModuleOptions
  private logger_: any

  constructor({ logger }: InjectedDependencies, options: ModuleOptions) {
    this.options_ = options
    this.logger_ = logger
    
    this.client_ = new MeiliSearch({
      host: options.host,
      apiKey: options.apiKey,
    })
  }

  async indexData(data: any[], type: string) {
    try {
      const indexName = type === "product" ? this.options_.productIndexName : type
      const index = this.client_.index(indexName)
      
      const formattedData = data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        handle: item.handle,
        ...item,
      }))

      await index.addDocuments(formattedData, { primaryKey: "id" })
      
      this.logger_.info(`Indexed ${formattedData.length} ${type}s to Meilisearch`)
    } catch (error) {
      this.logger_.error(`Failed to index ${type}s:`, error)
      throw error
    }
  }

  async deleteData(ids: string[], type: string) {
    try {
      const indexName = type === "product" ? this.options_.productIndexName : type
      const index = this.client_.index(indexName)
      await index.deleteDocuments(ids)
      
      this.logger_.info(`Deleted ${ids.length} ${type}s from Meilisearch`)
    } catch (error) {
      this.logger_.error(`Failed to delete ${type}s:`, error)
      throw error
    }
  }

  async search(query: string, type: string, options: any = {}) {
    try {
      const indexName = type === "product" ? this.options_.productIndexName : type
      const index = this.client_.index(indexName)
      const result = await index.search(query, options)
      return result
    } catch (error) {
      this.logger_.error(`Failed to search ${type}s:`, error)
      throw error
    }
  }
}

export default MeilisearchModuleService
