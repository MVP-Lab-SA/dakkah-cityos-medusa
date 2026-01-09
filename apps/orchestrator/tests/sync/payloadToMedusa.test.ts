import { describe, it, expect, vi, beforeEach } from 'vitest'
import { syncContentToMedusa, syncPageToMedusa, syncBrandingToMedusa } from '../../src/lib/sync/payloadToMedusa'

// Mock Medusa SDK
const mockMedusaSdk = {
  admin: {
    product: {
      update: vi.fn()
    },
    store: {
      update: vi.fn()
    }
  }
}

describe('Payload to Medusa Sync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('syncContentToMedusa', () => {
    it('should update product metadata with content', async () => {
      const mockContent = {
        id: '1',
        medusaProductId: 'prod_123',
        seoTitle: 'SEO Title',
        seoDescription: 'SEO Description',
        features: ['Feature 1', 'Feature 2'],
        specifications: {
          material: 'Cotton',
          weight: '500g'
        }
      }

      mockMedusaSdk.admin.product.update.mockResolvedValue({
        product: {
          id: 'prod_123',
          metadata: {
            seoTitle: 'SEO Title',
            seoDescription: 'SEO Description'
          }
        }
      })

      const result = await syncContentToMedusa(mockContent, mockMedusaSdk as any)

      expect(mockMedusaSdk.admin.product.update).toHaveBeenCalledWith(
        'prod_123',
        expect.objectContaining({
          metadata: expect.objectContaining({
            seoTitle: 'SEO Title',
            seoDescription: 'SEO Description',
            features: expect.arrayContaining(['Feature 1', 'Feature 2']),
            specifications: expect.objectContaining({
              material: 'Cotton',
              weight: '500g'
            })
          })
        })
      )

      expect(result.success).toBe(true)
    })

    it('should handle missing product gracefully', async () => {
      const mockContent = {
        id: '1',
        medusaProductId: 'prod_invalid',
        seoTitle: 'SEO Title'
      }

      mockMedusaSdk.admin.product.update.mockRejectedValue(
        new Error('Product not found')
      )

      const result = await syncContentToMedusa(mockContent, mockMedusaSdk as any)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Product not found')
    })
  })

  describe('syncPageToMedusa', () => {
    it('should create page metadata in Medusa', async () => {
      const mockPage = {
        id: '1',
        slug: 'about-us',
        title: 'About Us',
        metaTitle: 'About Our Company',
        metaDescription: 'Learn more about us',
        blocks: [
          { blockType: 'hero', title: 'Welcome' }
        ]
      }

      const result = await syncPageToMedusa(mockPage, mockMedusaSdk as any)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(expect.objectContaining({
        slug: 'about-us',
        title: 'About Us'
      }))
    })
  })

  describe('syncBrandingToMedusa', () => {
    it('should update store metadata with branding', async () => {
      const mockStore = {
        id: '1',
        medusaTenantId: 'tenant_123',
        branding: {
          logo: 'https://example.com/logo.jpg',
          primaryColor: '#ff0000',
          secondaryColor: '#00ff00',
          fontFamily: 'Inter'
        }
      }

      mockMedusaSdk.admin.store.update.mockResolvedValue({
        store: {
          id: 'store_123',
          metadata: {
            branding: mockStore.branding
          }
        }
      })

      const result = await syncBrandingToMedusa(mockStore, mockMedusaSdk as any)

      expect(mockMedusaSdk.admin.store.update).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({
            branding: expect.objectContaining({
              logo: 'https://example.com/logo.jpg',
              primaryColor: '#ff0000'
            })
          })
        })
      )

      expect(result.success).toBe(true)
    })

    it('should handle missing tenant ID', async () => {
      const mockStore = {
        id: '1',
        branding: {
          logo: 'https://example.com/logo.jpg'
        }
      }

      const result = await syncBrandingToMedusa(mockStore, mockMedusaSdk as any)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Missing tenant ID')
    })
  })
})
