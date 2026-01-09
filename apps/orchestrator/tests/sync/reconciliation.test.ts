import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reconcileProducts, reconcileVendors, detectConflicts } from '../../src/lib/sync/reconciliation'

const mockPayload = {
  find: vi.fn()
}

const mockMedusaSdk = {
  admin: {
    product: {
      list: vi.fn()
    }
  }
}

describe('Data Reconciliation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('reconcileProducts', () => {
    it('should detect missing products in Payload', async () => {
      mockMedusaSdk.admin.product.list.mockResolvedValue({
        products: [
          { id: 'prod_1', handle: 'product-1' },
          { id: 'prod_2', handle: 'product-2' },
          { id: 'prod_3', handle: 'product-3' }
        ]
      })

      mockPayload.find.mockResolvedValue({
        docs: [
          { medusaProductId: 'prod_1' },
          { medusaProductId: 'prod_2' }
        ]
      })

      const result = await reconcileProducts(mockPayload as any, mockMedusaSdk as any)

      expect(result.missingInPayload).toHaveLength(1)
      expect(result.missingInPayload[0]).toBe('prod_3')
      expect(result.summary.totalMedusa).toBe(3)
      expect(result.summary.totalPayload).toBe(2)
      expect(result.summary.missingInPayload).toBe(1)
    })

    it('should detect orphaned products in Payload', async () => {
      mockMedusaSdk.admin.product.list.mockResolvedValue({
        products: [
          { id: 'prod_1', handle: 'product-1' },
          { id: 'prod_2', handle: 'product-2' }
        ]
      })

      mockPayload.find.mockResolvedValue({
        docs: [
          { medusaProductId: 'prod_1' },
          { medusaProductId: 'prod_2' },
          { medusaProductId: 'prod_3' },
          { medusaProductId: 'prod_4' }
        ]
      })

      const result = await reconcileProducts(mockPayload as any, mockMedusaSdk as any)

      expect(result.orphanedInPayload).toHaveLength(2)
      expect(result.orphanedInPayload).toContain('prod_3')
      expect(result.orphanedInPayload).toContain('prod_4')
      expect(result.summary.orphanedInPayload).toBe(2)
    })

    it('should return healthy status when in sync', async () => {
      mockMedusaSdk.admin.product.list.mockResolvedValue({
        products: [
          { id: 'prod_1', handle: 'product-1' },
          { id: 'prod_2', handle: 'product-2' }
        ]
      })

      mockPayload.find.mockResolvedValue({
        docs: [
          { medusaProductId: 'prod_1' },
          { medusaProductId: 'prod_2' }
        ]
      })

      const result = await reconcileProducts(mockPayload as any, mockMedusaSdk as any)

      expect(result.missingInPayload).toHaveLength(0)
      expect(result.orphanedInPayload).toHaveLength(0)
      expect(result.summary.inSync).toBe(true)
    })
  })

  describe('reconcileVendors', () => {
    it('should reconcile vendor data between systems', async () => {
      const mockMedusaVendors = [
        { id: 'vendor_1', handle: 'vendor-1' },
        { id: 'vendor_2', handle: 'vendor-2' }
      ]

      mockPayload.find.mockResolvedValue({
        docs: [
          { medusaVendorId: 'vendor_1' }
        ]
      })

      const result = await reconcileVendors(mockPayload as any, mockMedusaVendors)

      expect(result.missingInPayload).toHaveLength(1)
      expect(result.missingInPayload[0]).toBe('vendor_2')
    })
  })

  describe('detectConflicts', () => {
    it('should detect timestamp conflicts', () => {
      const medusaData = {
        id: 'prod_1',
        updated_at: '2024-01-02T00:00:00Z'
      }

      const payloadData = {
        medusaProductId: 'prod_1',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      const conflicts = detectConflicts(medusaData, payloadData)

      expect(conflicts.hasConflict).toBe(true)
      expect(conflicts.newerSource).toBe('medusa')
    })

    it('should detect no conflict when data is in sync', () => {
      const medusaData = {
        id: 'prod_1',
        updated_at: '2024-01-01T00:00:00Z'
      }

      const payloadData = {
        medusaProductId: 'prod_1',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      const conflicts = detectConflicts(medusaData, payloadData)

      expect(conflicts.hasConflict).toBe(false)
    })
  })
})
