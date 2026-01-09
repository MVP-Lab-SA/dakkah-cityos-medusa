import { describe, it, expect, vi, beforeEach } from 'vitest'
import { syncProductToPayload, syncVendorToPayload, syncTenantToPayload } from '../../src/lib/sync/medusaToPayload'

// Mock Payload
const mockPayload = {
  find: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
}

// Mock Medusa client
const mockMedusaClient = {
  admin: {
    product: {
      retrieve: vi.fn()
    }
  }
}

describe('Medusa to Payload Sync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('syncProductToPayload', () => {
    it('should create new product content if not exists', async () => {
      const mockProduct = {
        id: 'prod_123',
        title: 'Test Product',
        handle: 'test-product',
        description: 'Test description',
        thumbnail: 'https://example.com/image.jpg',
        metadata: {
          vendorId: 'vendor_123',
          tenantId: 'tenant_123'
        }
      }

      mockMedusaClient.admin.product.retrieve.mockResolvedValue({
        product: mockProduct
      })

      mockPayload.find.mockResolvedValue({
        docs: []
      })

      mockPayload.create.mockResolvedValue({
        id: '1',
        medusaProductId: 'prod_123'
      })

      const result = await syncProductToPayload('prod_123', mockPayload as any)

      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: 'product-content',
        where: {
          medusaProductId: { equals: 'prod_123' }
        }
      })

      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'product-content',
        data: expect.objectContaining({
          medusaProductId: 'prod_123',
          title: 'Test Product',
          handle: 'test-product'
        })
      })

      expect(result.success).toBe(true)
      expect(result.action).toBe('created')
    })

    it('should update existing product content', async () => {
      const mockProduct = {
        id: 'prod_123',
        title: 'Updated Product',
        handle: 'test-product',
        description: 'Updated description',
        thumbnail: 'https://example.com/image.jpg',
        metadata: {
          vendorId: 'vendor_123',
          tenantId: 'tenant_123'
        }
      }

      mockMedusaClient.admin.product.retrieve.mockResolvedValue({
        product: mockProduct
      })

      mockPayload.find.mockResolvedValue({
        docs: [{
          id: '1',
          medusaProductId: 'prod_123',
          title: 'Old Title'
        }]
      })

      mockPayload.update.mockResolvedValue({
        id: '1',
        medusaProductId: 'prod_123',
        title: 'Updated Product'
      })

      const result = await syncProductToPayload('prod_123', mockPayload as any)

      expect(mockPayload.update).toHaveBeenCalledWith({
        collection: 'product-content',
        id: '1',
        data: expect.objectContaining({
          title: 'Updated Product',
          description: 'Updated description'
        })
      })

      expect(result.success).toBe(true)
      expect(result.action).toBe('updated')
    })

    it('should handle errors gracefully', async () => {
      mockMedusaClient.admin.product.retrieve.mockRejectedValue(
        new Error('Product not found')
      )

      const result = await syncProductToPayload('prod_invalid', mockPayload as any)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Product not found')
    })
  })

  describe('syncVendorToPayload', () => {
    it('should create new store for vendor', async () => {
      const mockVendor = {
        id: 'vendor_123',
        handle: 'test-vendor',
        metadata: {
          name: 'Test Vendor',
          description: 'Vendor description',
          logo: 'https://example.com/logo.jpg'
        }
      }

      mockPayload.find.mockResolvedValue({
        docs: []
      })

      mockPayload.create.mockResolvedValue({
        id: '1',
        medusaVendorId: 'vendor_123'
      })

      const result = await syncVendorToPayload(mockVendor, mockPayload as any)

      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'stores',
        data: expect.objectContaining({
          medusaVendorId: 'vendor_123',
          handle: 'test-vendor',
          name: 'Test Vendor'
        })
      })

      expect(result.success).toBe(true)
    })

    it('should skip if vendor already synced', async () => {
      const mockVendor = {
        id: 'vendor_123',
        handle: 'test-vendor'
      }

      mockPayload.find.mockResolvedValue({
        docs: [{
          id: '1',
          medusaVendorId: 'vendor_123'
        }]
      })

      const result = await syncVendorToPayload(mockVendor, mockPayload as any)

      expect(mockPayload.create).not.toHaveBeenCalled()
      expect(result.action).toBe('skipped')
    })
  })

  describe('syncTenantToPayload', () => {
    it('should create new store for tenant', async () => {
      const mockTenant = {
        id: 'tenant_123',
        handle: 'test-tenant',
        metadata: {
          name: 'Test Tenant',
          logo: 'https://example.com/logo.jpg',
          primaryColor: '#ff0000',
          secondaryColor: '#00ff00'
        }
      }

      mockPayload.find.mockResolvedValue({
        docs: []
      })

      mockPayload.create.mockResolvedValue({
        id: '1',
        medusaTenantId: 'tenant_123'
      })

      const result = await syncTenantToPayload(mockTenant, mockPayload as any)

      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'stores',
        data: expect.objectContaining({
          medusaTenantId: 'tenant_123',
          handle: 'test-tenant',
          name: 'Test Tenant',
          branding: expect.objectContaining({
            primaryColor: '#ff0000',
            secondaryColor: '#00ff00'
          })
        })
      })

      expect(result.success).toBe(true)
    })

    it('should update tenant branding', async () => {
      const mockTenant = {
        id: 'tenant_123',
        handle: 'test-tenant',
        metadata: {
          name: 'Updated Tenant',
          primaryColor: '#0000ff'
        }
      }

      mockPayload.find.mockResolvedValue({
        docs: [{
          id: '1',
          medusaTenantId: 'tenant_123',
          name: 'Old Name'
        }]
      })

      mockPayload.update.mockResolvedValue({
        id: '1',
        medusaTenantId: 'tenant_123',
        name: 'Updated Tenant'
      })

      const result = await syncTenantToPayload(mockTenant, mockPayload as any)

      expect(mockPayload.update).toHaveBeenCalledWith({
        collection: 'stores',
        id: '1',
        data: expect.objectContaining({
          name: 'Updated Tenant',
          branding: expect.objectContaining({
            primaryColor: '#0000ff'
          })
        })
      })

      expect(result.success).toBe(true)
      expect(result.action).toBe('updated')
    })
  })
})
