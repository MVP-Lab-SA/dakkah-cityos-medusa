import { describe, it, expect } from 'vitest'
import {
  buildTenantUrl,
  buildProductUrl,
  buildVendorDashboardUrl,
  buildManageUrl,
  appendQueryParams,
} from '@/lib/utils/url-utils'

describe('URL Utilities', () => {
  describe('buildTenantUrl', () => {
    it('builds tenant-scoped URLs correctly', () => {
      expect(buildTenantUrl('dakkah', 'en')).toBe('/dakkah/en')
    })

    it('includes locale in URL path', () => {
      expect(buildTenantUrl('mystore', 'fr')).toBe('/mystore/fr')
      expect(buildTenantUrl('mystore', 'ar')).toBe('/mystore/ar')
    })

    it('appends path after tenant and locale', () => {
      expect(buildTenantUrl('dakkah', 'en', '/products')).toBe('/dakkah/en/products')
    })

    it('handles path without leading slash', () => {
      expect(buildTenantUrl('dakkah', 'en', 'products')).toBe('/dakkah/en/products')
    })

    it('handles special characters in slugs', () => {
      const result = buildTenantUrl('my store', 'en', '/products')
      expect(result).toContain('my%20store')
    })

    it('handles missing tenant gracefully', () => {
      const result = buildTenantUrl(null, 'en', '/products')
      expect(result).toBe('/en/products')
    })

    it('handles missing locale gracefully', () => {
      const result = buildTenantUrl('dakkah', null, '/products')
      expect(result).toBe('/dakkah/products')
    })

    it('handles both missing tenant and locale', () => {
      const result = buildTenantUrl(null, null, '/products')
      expect(result).toBe('/products')
    })

    it('returns root when everything is empty', () => {
      expect(buildTenantUrl(null, null)).toBe('/')
    })
  })

  describe('buildProductUrl', () => {
    it('builds product URLs with tenant and locale', () => {
      expect(buildProductUrl('dakkah', 'en', 'blue-widget')).toBe(
        '/dakkah/en/products/blue-widget'
      )
    })

    it('encodes special characters in slug', () => {
      const result = buildProductUrl('dakkah', 'en', 'my product & more')
      expect(result).toContain('my%20product')
    })
  })

  describe('buildVendorDashboardUrl', () => {
    it('builds vendor dashboard URLs', () => {
      expect(buildVendorDashboardUrl('dakkah', 'en')).toBe('/dakkah/en/vendor')
    })

    it('builds vendor dashboard section URLs', () => {
      expect(buildVendorDashboardUrl('dakkah', 'en', 'products')).toBe(
        '/dakkah/en/vendor/products'
      )
    })

    it('builds vendor orders URL', () => {
      expect(buildVendorDashboardUrl('dakkah', 'en', 'orders')).toBe(
        '/dakkah/en/vendor/orders'
      )
    })
  })

  describe('buildManageUrl', () => {
    it('builds manage page URLs', () => {
      expect(buildManageUrl('dakkah', 'en')).toBe('/dakkah/en/manage')
    })

    it('builds manage section URLs', () => {
      expect(buildManageUrl('dakkah', 'en', 'settings')).toBe(
        '/dakkah/en/manage/settings'
      )
    })
  })

  describe('appendQueryParams', () => {
    it('handles query parameters', () => {
      const result = appendQueryParams('/products', { page: 1, sort: 'price' })
      expect(result).toContain('page=1')
      expect(result).toContain('sort=price')
      expect(result).toMatch(/^\/products\?/)
    })

    it('skips null and undefined params', () => {
      const result = appendQueryParams('/products', { page: 1, filter: null, q: undefined })
      expect(result).toContain('page=1')
      expect(result).not.toContain('filter')
      expect(result).not.toContain('q=')
    })

    it('skips empty string params', () => {
      const result = appendQueryParams('/products', { page: 1, q: '' })
      expect(result).toContain('page=1')
      expect(result).not.toContain('q=')
    })

    it('returns original URL when no valid params', () => {
      const result = appendQueryParams('/products', { q: null, filter: undefined })
      expect(result).toBe('/products')
    })

    it('appends to existing query string', () => {
      const result = appendQueryParams('/products?existing=true', { page: 2 })
      expect(result).toContain('existing=true')
      expect(result).toContain('page=2')
    })
  })
})
