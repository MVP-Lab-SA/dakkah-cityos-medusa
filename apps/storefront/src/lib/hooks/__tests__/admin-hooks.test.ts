import { describe, it, expect } from 'vitest'
import { queryKeys } from '@/lib/utils/query-keys'

describe('Admin Hook Query Key Patterns', () => {
  describe('governance query keys', () => {
    it('generates policies key with tenant ID', () => {
      const key = queryKeys.governance.policies('tenant_abc')
      expect(key).toEqual(['governance', 'policies', 'tenant_abc'])
    })

    it('all key is stable', () => {
      expect(queryKeys.governance.all).toEqual(['governance'])
    })
  })

  describe('vendors query keys', () => {
    it('generates vendor detail by handle', () => {
      const key = queryKeys.vendors.byHandle('my-vendor')
      expect(key).toEqual(['vendors', 'byHandle', 'my-vendor'])
    })

    it('list key includes domain', () => {
      const key = queryKeys.vendors.list()
      expect(key[0]).toBe('vendors')
      expect(key[1]).toBe('list')
    })
  })

  describe('commissions query keys', () => {
    it('generates summary key', () => {
      expect(queryKeys.commissions.summary()).toEqual(['commissions', 'summary'])
    })

    it('generates transactions key with params', () => {
      expect(queryKeys.commissions.transactions('vendor_1')).toEqual([
        'commissions', 'transactions', 'vendor_1'
      ])
    })
  })

  describe('payouts query keys', () => {
    it('generates all key', () => {
      expect(queryKeys.payouts.all).toEqual(['payouts'])
    })

    it('generates summary key', () => {
      expect(queryKeys.payouts.summary()).toEqual(['payouts', 'summary'])
    })
  })

  describe('invoices query keys', () => {
    it('generates all key', () => {
      expect(queryKeys.invoices.all).toEqual(['invoices'])
    })

    it('generates list key', () => {
      expect(queryKeys.invoices.list()).toEqual(['invoices', 'list'])
    })

    it('generates detail key', () => {
      expect(queryKeys.invoices.detail('inv_1')).toEqual(['invoices', 'detail', 'inv_1'])
    })
  })

  describe('digitalProducts query keys', () => {
    it('generates all key', () => {
      expect(queryKeys.digitalProducts.all).toEqual(['digital-products'])
    })

    it('generates downloads key', () => {
      expect(queryKeys.digitalProducts.downloads()).toEqual(['digital-products', 'downloads'])
    })
  })

  describe('vendorAnalytics query keys', () => {
    it('generates performance key', () => {
      expect(queryKeys.vendorAnalytics.performance()).toEqual(['vendor-analytics', 'performance'])
    })

    it('generates snapshots key', () => {
      expect(queryKeys.vendorAnalytics.snapshots('daily')).toEqual([
        'vendor-analytics', 'snapshots', 'daily'
      ])
    })
  })

  describe('approvals query keys', () => {
    it('generates workflows key', () => {
      expect(queryKeys.approvals.workflows()).toEqual(['approvals', 'workflows'])
    })

    it('generates requests key', () => {
      expect(queryKeys.approvals.requests('pending')).toEqual([
        'approvals', 'requests', 'pending'
      ])
    })
  })

  describe('wishlist query keys', () => {
    it('generates all key', () => {
      expect(queryKeys.wishlist.all).toEqual(['wishlist'])
    })
  })

  describe('regionZones query keys', () => {
    it('generates all key', () => {
      expect(queryKeys.regionZones.all).toEqual(['region-zones'])
    })
  })

  describe('vendorTeam query keys', () => {
    it('generates all key', () => {
      expect(queryKeys.vendorTeam.all).toEqual(['vendor-team'])
    })
  })
})
