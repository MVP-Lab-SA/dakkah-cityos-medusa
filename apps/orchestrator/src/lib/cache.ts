import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  }
})

redis.on('error', (err) => {
  console.error('Redis Cache Error:', err)
})

redis.on('connect', () => {
  console.log('✅ Redis cache connected')
})

/**
 * Cache interface for typed get/set operations
 */
export class Cache {
  /**
   * Get cached value
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key)
      if (!value) return null
      return JSON.parse(value) as T
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error)
      return null
    }
  }

  /**
   * Set cache value with optional TTL (seconds)
   */
  static async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value)
      if (ttl) {
        await redis.setex(key, ttl, serialized)
      } else {
        await redis.set(key, serialized)
      }
      return true
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Delete cache key
   */
  static async del(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.error(`Cache del error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Delete keys matching pattern
   */
  static async delPattern(pattern: string): Promise<number> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length === 0) return 0
      const result = await redis.del(...keys)
      return result
    } catch (error) {
      console.error(`Cache delPattern error for pattern ${pattern}:`, error)
      return 0
    }
  }

  /**
   * Check if key exists
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key)
      return result === 1
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Get TTL of a key (seconds)
   */
  static async ttl(key: string): Promise<number> {
    try {
      return await redis.ttl(key)
    } catch (error) {
      console.error(`Cache ttl error for key ${key}:`, error)
      return -1
    }
  }

  /**
   * Increment counter
   */
  static async incr(key: string): Promise<number> {
    try {
      return await redis.incr(key)
    } catch (error) {
      console.error(`Cache incr error for key ${key}:`, error)
      return 0
    }
  }

  /**
   * Get or set pattern - get from cache or fetch and cache
   */
  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T | null> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key)
      if (cached !== null) {
        return cached
      }

      // Fetch fresh data
      const fresh = await fetchFn()
      
      // Cache it
      await this.set(key, fresh, ttl)
      
      return fresh
    } catch (error) {
      console.error(`Cache getOrSet error for key ${key}:`, error)
      return null
    }
  }

  /**
   * Clear all cache
   */
  static async clear(): Promise<boolean> {
    try {
      await redis.flushdb()
      return true
    } catch (error) {
      console.error('Cache clear error:', error)
      return false
    }
  }
}

// Cache key builders
export const CacheKeys = {
  // Stores
  store: (id: string) => `store:${id}`,
  stores: () => 'stores:all',
  storeByHandle: (handle: string) => `store:handle:${handle}`,
  
  // Products
  product: (id: string) => `product:${id}`,
  products: (filters?: string) => `products:${filters || 'all'}`,
  productContent: (productId: string) => `product:content:${productId}`,
  
  // Pages
  page: (slug: string) => `page:${slug}`,
  pages: () => 'pages:all',
  
  // Sync jobs
  syncJob: (id: string) => `sync:job:${id}`,
  syncStats: () => 'sync:stats',
  
  // Vendors
  vendor: (id: string) => `vendor:${id}`,
  vendors: () => 'vendors:all',
  
  // Tenants
  tenant: (id: string) => `tenant:${id}`,
  tenants: () => 'tenants:all'
}

// Cache TTLs (in seconds)
export const CacheTTL = {
  SHORT: 60,           // 1 minute
  MEDIUM: 300,         // 5 minutes
  LONG: 3600,          // 1 hour
  DAY: 86400,          // 24 hours
  WEEK: 604800         // 7 days
}

export default redis
