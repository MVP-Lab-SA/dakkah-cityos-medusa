/**
 * Unified API Client - Fetches data from both Medusa and Payload
 * 
 * This client provides a single interface to access:
 * - Commerce data from Medusa (products, cart, orders)
 * - Content data from Payload (pages, SEO, rich content)
 * - Combined product data (Medusa product + Payload content)
 */

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PAYLOAD_CMS_URL = process.env.PAYLOAD_CMS_URL || 'http://localhost:3001'
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

export interface UnifiedProduct {
  // Medusa fields
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  images: Array<{ url: string }>
  variants: Array<any>
  options: Array<any>
  tags: Array<any>
  collection: any
  categories: Array<any>
  // Payload content fields
  content?: {
    richDescription?: any
    features?: string[]
    specifications?: Array<{ label: string; value: string }>
    contentBlocks?: any[]
    seo?: {
      title?: string
      description?: string
      keywords?: string
    }
    tags?: string[]
  }
}

export interface PayloadPage {
  id: string
  title: string
  slug: string
  layout: any[]
  seo?: {
    title?: string
    description?: string
    ogImage?: any
  }
  status: 'draft' | 'published'
  publishAt?: string
  tenant: string
  store?: string
}

export interface StoreBranding {
  id: string
  name: string
  handle: string
  logo?: { url: string }
  favicon?: { url: string }
  themeConfig?: any
  seo?: {
    title?: string
    description?: string
    ogImage?: any
  }
}

class UnifiedAPIClient {
  private medusaUrl: string
  private payloadUrl: string
  private publishableKey: string
  
  constructor() {
    this.medusaUrl = MEDUSA_BACKEND_URL
    this.payloadUrl = PAYLOAD_CMS_URL
    this.publishableKey = MEDUSA_PUBLISHABLE_KEY
  }
  
  // ===== Medusa API Methods =====
  
  async getMedusaProducts(params: {
    limit?: number
    offset?: number
    category_id?: string[]
    collection_id?: string[]
    tags?: string[]
    region_id?: string
    q?: string
  } = {}) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => query.append(key, v))
        } else {
          query.set(key, String(value))
        }
      }
    })
    
    const response = await fetch(`${this.medusaUrl}/store/products?${query}`, {
      headers: {
        'x-publishable-api-key': this.publishableKey,
      },

    })
    
    if (!response.ok) {
      throw new Error(`Medusa API error: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.products || []
  }
  
  async getMedusaProduct(id: string) {
    const response = await fetch(`${this.medusaUrl}/store/products/${id}`, {
      headers: {
        'x-publishable-api-key': this.publishableKey,
      },

    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.product
  }
  
  async getMedusaProductByHandle(handle: string) {
    const products = await this.getMedusaProducts({ limit: 1 })
    // Note: Medusa doesn't have a handle endpoint, need to query and filter
    // In production, you'd want to add a custom endpoint in Medusa backend
    const response = await fetch(`${this.medusaUrl}/store/products?handle=${handle}`, {
      headers: {
        'x-publishable-api-key': this.publishableKey,
      },

    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.products?.[0] || null
  }
  
  async getMedusaRegions() {
    const response = await fetch(`${this.medusaUrl}/store/regions`, {
      headers: {
        'x-publishable-api-key': this.publishableKey,
      },

    })
    
    if (!response.ok) {
      throw new Error(`Medusa API error: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.regions || []
  }
  
  async getMedusaCollections() {
    const response = await fetch(`${this.medusaUrl}/store/collections`, {
      headers: {
        'x-publishable-api-key': this.publishableKey,
      },

    })
    
    if (!response.ok) {
      throw new Error(`Medusa API error: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.collections || []
  }
  
  async getMedusaCategories() {
    const response = await fetch(`${this.medusaUrl}/store/product-categories`, {
      headers: {
        'x-publishable-api-key': this.publishableKey,
      },

    })
    
    if (!response.ok) {
      throw new Error(`Medusa API error: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.product_categories || []
  }
  
  // ===== Payload CMS API Methods =====
  
  async getPayloadContent(productId: string, tenantId?: string, storeId?: string) {
    const query = new URLSearchParams({
      where: JSON.stringify({
        medusaProductId: { equals: productId },
        ...(tenantId && { tenant: { equals: tenantId } }),
        ...(storeId && { store: { equals: storeId } }),
      }),
      limit: '1',
    })
    
    const response = await fetch(`${this.payloadUrl}/api/product-content?${query}`, {

    })
    
    if (!response.ok) {
      console.warn(`Payload content not found for product ${productId}`)
      return null
    }
    
    const data = await response.json()
    return data.docs?.[0] || null
  }
  
  async getPayloadPage(slug: string, tenantId?: string, storeId?: string): Promise<PayloadPage | null> {
    const query = new URLSearchParams({
      where: JSON.stringify({
        slug: { equals: slug },
        status: { equals: 'published' },
        ...(tenantId && { tenant: { equals: tenantId } }),
        ...(storeId && { store: { equals: storeId } }),
      }),
      limit: '1',
    })
    
    const response = await fetch(`${this.payloadUrl}/api/pages?${query}`, {

    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.docs?.[0] || null
  }
  
  async getPayloadPages(tenantId?: string, storeId?: string): Promise<PayloadPage[]> {
    const query = new URLSearchParams({
      where: JSON.stringify({
        status: { equals: 'published' },
        ...(tenantId && { tenant: { equals: tenantId } }),
        ...(storeId && { store: { equals: storeId } }),
      }),
      limit: '100',
    })
    
    const response = await fetch(`${this.payloadUrl}/api/pages?${query}`, {

    })
    
    if (!response.ok) {
      return []
    }
    
    const data = await response.json()
    return data.docs || []
  }
  
  async getStoreBranding(storeHandle: string, tenantId?: string): Promise<StoreBranding | null> {
    const query = new URLSearchParams({
      where: JSON.stringify({
        handle: { equals: storeHandle },
        status: { equals: 'active' },
        ...(tenantId && { tenant: { equals: tenantId } }),
      }),
      limit: '1',
    })
    
    const response = await fetch(`${this.payloadUrl}/api/stores?${query}`, {

    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.docs?.[0] || null
  }
  
  async getStores(tenantId?: string): Promise<StoreBranding[]> {
    // Try Medusa backend first
    try {
      console.log('Fetching stores from:', `${this.medusaUrl}/store/stores`)
      const response = await fetch(`${this.medusaUrl}/store/stores`, {
        headers: {
          'x-publishable-api-key': this.publishableKey,
        },
      })
      
      console.log('Stores API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Stores data:', data)
        return data.stores || []
      } else {
        const errorText = await response.text()
        console.error('Stores API error:', response.status, errorText)
      }
    } catch (error) {
      console.error('Failed to fetch from Medusa:', error)
    }
    
    // Fallback to Payload CMS
    const query = new URLSearchParams({
      where: JSON.stringify({
        status: { equals: 'active' },
        ...(tenantId && { tenant: { equals: tenantId } }),
      }),
      limit: '100',
    })
    
    const response = await fetch(`${this.payloadUrl}/api/stores?${query}`)
    
    if (!response.ok) {
      return []
    }
    
    const data = await response.json()
    return data.docs || []
  }
  
  // ===== Unified Methods (Medusa + Payload) =====
  
  async getUnifiedProduct(handle: string, tenantId?: string, storeId?: string): Promise<UnifiedProduct | null> {
    const medusaProduct = await this.getMedusaProductByHandle(handle)
    
    if (!medusaProduct) {
      return null
    }
    
    // Fetch Payload content for this product
    const payloadContent = await this.getPayloadContent(medusaProduct.id, tenantId, storeId)
    
    return {
      ...medusaProduct,
      content: payloadContent ? {
        richDescription: payloadContent.description,
        features: payloadContent.features?.map((f: any) => f.feature) || [],
        specifications: payloadContent.specifications || [],
        contentBlocks: payloadContent.contentBlocks || [],
        seo: payloadContent.seo,
        tags: payloadContent.tags?.map((t: any) => t.tag) || [],
      } : undefined,
    }
  }
  
  async getUnifiedProducts(params: {
    limit?: number
    offset?: number
    category_id?: string[]
    collection_id?: string[]
    tags?: string[]
    region_id?: string
    q?: string
    tenantId?: string
    storeId?: string
  } = {}): Promise<UnifiedProduct[]> {
    const { tenantId, storeId, ...medusaParams } = params
    
    const medusaProducts = await this.getMedusaProducts(medusaParams)
    
    // Fetch Payload content for all products in parallel
    const productsWithContent = await Promise.all(
      medusaProducts.map(async (product: any) => {
        const payloadContent = await this.getPayloadContent(product.id, tenantId, storeId)
        
        return {
          ...product,
          content: payloadContent ? {
            richDescription: payloadContent.description,
            features: payloadContent.features?.map((f: any) => f.feature) || [],
            specifications: payloadContent.specifications || [],
            contentBlocks: payloadContent.contentBlocks || [],
            seo: payloadContent.seo,
            tags: payloadContent.tags?.map((t: any) => t.tag) || [],
          } : undefined,
        }
      })
    )
    
    return productsWithContent
  }
}

// Singleton instance
let clientInstance: UnifiedAPIClient | null = null

export function getUnifiedClient(): UnifiedAPIClient {
  if (!clientInstance) {
    clientInstance = new UnifiedAPIClient()
  }
  return clientInstance
}

export default getUnifiedClient
