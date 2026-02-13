import { describe, it, expect } from 'vitest'
import { queryKeys } from '@/lib/utils/query-keys'

describe('Query Keys', () => {
  describe('cart keys', () => {
    it('has "cart" as base key', () => {
      expect(queryKeys.cart.all).toEqual(['cart'])
    })

    it('generates list keys', () => {
      expect(queryKeys.cart.list()).toEqual(['cart', 'list'])
    })

    it('generates detail keys', () => {
      expect(queryKeys.cart.detail('cart_123')).toEqual(['cart', 'detail', 'cart_123'])
    })

    it('generates current cart key', () => {
      expect(queryKeys.cart.current()).toEqual(['cart', undefined])
    })

    it('generates current cart key with fields', () => {
      expect(queryKeys.cart.current('*items')).toEqual(['cart', '*items'])
    })
  })

  describe('customer keys', () => {
    it('has "customer" as base key', () => {
      expect(queryKeys.customer.all).toEqual(['customer'])
    })

    it('generates orders key', () => {
      expect(queryKeys.customer.orders()).toEqual(['customer', 'orders'])
    })
  })

  describe('products keys', () => {
    it('generates related products key', () => {
      expect(queryKeys.products.related('prod_1', 'reg_1')).toEqual([
        'products', 'related', 'prod_1', 'reg_1'
      ])
    })

    it('generates latest products key', () => {
      expect(queryKeys.products.latest(10, 'reg_1')).toEqual([
        'products', 'latest', 10, 'reg_1'
      ])
    })
  })

  describe('payments keys', () => {
    it('generates forCart key', () => {
      expect(queryKeys.payments.forCart('cart_1')).toEqual(['payments', 'forCart', 'cart_1'])
    })

    it('generates sessions key', () => {
      expect(queryKeys.payments.sessions('reg_1')).toEqual(['payments', 'sessions', 'reg_1'])
    })

    it('generates session key', () => {
      expect(queryKeys.payments.session('sess_1')).toEqual(['payments', 'session', 'sess_1'])
    })
  })

  describe('shipping keys', () => {
    it('generates forCart key', () => {
      expect(queryKeys.shipping.forCart('cart_1')).toEqual(['shipping', 'forCart', 'cart_1'])
    })

    it('generates options key', () => {
      expect(queryKeys.shipping.options('cart_1', 'reg_1')).toEqual([
        'shipping', 'options', 'cart_1', 'reg_1'
      ])
    })
  })

  describe('pages keys', () => {
    it('generates bySlug key', () => {
      expect(queryKeys.pages.bySlug('about-us')).toEqual(['pages', 'bySlug', 'about-us'])
    })
  })

  describe('tenants keys', () => {
    it('generates byHandle key', () => {
      expect(queryKeys.tenants.byHandle('dakkah')).toEqual(['tenants', 'byHandle', 'dakkah'])
    })
  })

  describe('vendors keys', () => {
    it('generates byHandle key', () => {
      expect(queryKeys.vendors.byHandle('vendor-1')).toEqual(['vendors', 'byHandle', 'vendor-1'])
    })
  })

  describe('governance keys', () => {
    it('generates policies key', () => {
      expect(queryKeys.governance.policies('tenant_1')).toEqual([
        'governance', 'policies', 'tenant_1'
      ])
    })
  })

  describe('nodes keys', () => {
    it('generates tree key', () => {
      expect(queryKeys.nodes.tree('t_1')).toEqual(['nodes', 'tree', 't_1'])
    })

    it('generates children key', () => {
      expect(queryKeys.nodes.children('t_1', 'n_1')).toEqual(['nodes', 'children', 't_1', 'n_1'])
    })

    it('generates root key', () => {
      expect(queryKeys.nodes.root('t_1')).toEqual(['nodes', 'root', 't_1'])
    })
  })

  describe('subscriptions keys', () => {
    it('generates plans key', () => {
      expect(queryKeys.subscriptions.plans()).toEqual(['subscriptions', 'plans'])
    })

    it('generates billingHistory key', () => {
      expect(queryKeys.subscriptions.billingHistory('sub_1')).toEqual([
        'subscriptions', 'billing', 'sub_1'
      ])
    })
  })

  describe('bookings keys', () => {
    it('generates services key', () => {
      expect(queryKeys.bookings.services()).toEqual(['bookings', 'services'])
    })

    it('generates availability key', () => {
      expect(queryKeys.bookings.availability('svc_1', '2025-01-01')).toEqual([
        'bookings', 'availability', 'svc_1', '2025-01-01'
      ])
    })
  })

  describe('cms keys', () => {
    it('generates pageByPath key', () => {
      expect(queryKeys.cms.pageByPath('t_1', '/about', 'en')).toEqual([
        'cms', 'pageByPath', 't_1', '/about', 'en'
      ])
    })

    it('generates navigation key', () => {
      expect(queryKeys.cms.navigation('t_1', 'header', 'en')).toEqual([
        'cms', 'navigation', 't_1', 'header', 'en'
      ])
    })

    it('generates verticals key', () => {
      expect(queryKeys.cms.verticals('t_1')).toEqual(['cms', 'verticals', 't_1'])
    })
  })

  describe('translations keys', () => {
    it('generates byLocale key', () => {
      expect(queryKeys.translations.byLocale('en')).toEqual(['translations', 'locale', 'en'])
    })

    it('generates byKey key', () => {
      expect(queryKeys.translations.byKey('en', 'common')).toEqual([
        'translations', 'key', 'en', 'common'
      ])
    })
  })

  describe('platform keys', () => {
    it('generates context key', () => {
      expect(queryKeys.platform.context('dakkah')).toEqual(['platform', 'context', 'dakkah'])
    })

    it('generates defaultTenant key', () => {
      expect(queryKeys.platform.defaultTenant()).toEqual(['platform', 'defaultTenant'])
    })

    it('generates capabilities key', () => {
      expect(queryKeys.platform.capabilities()).toEqual(['platform', 'capabilities'])
    })
  })

  describe('tenantAdmin keys', () => {
    it('generates users key', () => {
      expect(queryKeys.tenantAdmin.users()).toEqual(['tenant-admin', 'users'])
    })

    it('generates settings key', () => {
      expect(queryKeys.tenantAdmin.settings()).toEqual(['tenant-admin', 'settings'])
    })

    it('generates billing key', () => {
      expect(queryKeys.tenantAdmin.billing()).toEqual(['tenant-admin', 'billing'])
    })
  })

  describe('volumePricing keys', () => {
    it('generates forProduct key', () => {
      expect(queryKeys.volumePricing.forProduct('prod_1')).toEqual([
        'volume-pricing', 'product', 'prod_1'
      ])
    })
  })

  describe('predicate function', () => {
    it('returns true when queryKey includes domain', () => {
      const mockQuery = { queryKey: ['cart', 'list'] } as any
      expect(queryKeys.cart.predicate(mockQuery)).toBe(true)
    })

    it('returns false when queryKey does not include domain', () => {
      const mockQuery = { queryKey: ['products', 'list'] } as any
      expect(queryKeys.cart.predicate(mockQuery)).toBe(false)
    })

    it('returns false when excluded key is present', () => {
      const mockQuery = { queryKey: ['cart', 'list', 'archived'] } as any
      expect(queryKeys.cart.predicate(mockQuery, ['archived'])).toBe(false)
    })
  })
})
