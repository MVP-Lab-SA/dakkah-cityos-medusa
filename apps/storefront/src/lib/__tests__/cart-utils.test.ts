import { describe, it, expect, beforeEach } from 'vitest'
import {
  getStoredCart,
  setStoredCart,
  removeStoredCart,
  sortCartItems,
  createOptimisticCartItem,
  createOptimisticCart,
} from '@/lib/utils/cart'

describe('Cart Utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('stored cart', () => {
    it('returns undefined when no cart stored', () => {
      expect(getStoredCart()).toBeUndefined()
    })

    it('stores and retrieves cart id', () => {
      setStoredCart('cart_abc123')
      expect(getStoredCart()).toBe('cart_abc123')
    })

    it('removes stored cart', () => {
      setStoredCart('cart_abc123')
      removeStoredCart()
      expect(getStoredCart()).toBeUndefined()
    })
  })

  describe('sortCartItems', () => {
    it('sorts items by created_at ascending', () => {
      const items = [
        { id: 'item_2', created_at: '2025-02-01T00:00:00Z' },
        { id: 'item_1', created_at: '2025-01-01T00:00:00Z' },
        { id: 'item_3', created_at: '2025-03-01T00:00:00Z' },
      ] as any[]
      const sorted = sortCartItems(items)
      expect(sorted[0].id).toBe('item_1')
      expect(sorted[1].id).toBe('item_2')
      expect(sorted[2].id).toBe('item_3')
    })

    it('handles items without created_at', () => {
      const items = [
        { id: 'item_1' },
        { id: 'item_2', created_at: '2025-01-01T00:00:00Z' },
      ] as any[]
      const sorted = sortCartItems(items)
      expect(sorted).toHaveLength(2)
    })
  })

  describe('createOptimisticCartItem', () => {
    it('creates an optimistic item with correct fields', () => {
      const variant = { id: 'var_1', title: 'Size M', calculated_price: { calculated_amount: 2500 } } as any
      const product = { id: 'prod_1', title: 'T-Shirt', thumbnail: '/img.jpg' } as any
      const item = createOptimisticCartItem(variant, product, 2)
      expect(item.variant_id).toBe('var_1')
      expect(item.quantity).toBe(2)
      expect(item.unit_price).toBe(2500)
      expect(item.total).toBe(5000)
      expect(item.isOptimistic).toBe(true)
      expect(item.product_title).toBe('T-Shirt')
    })

    it('defaults quantity to 1', () => {
      const variant = { id: 'var_1', title: 'Default', calculated_price: { calculated_amount: 1000 } } as any
      const product = { id: 'prod_1', title: 'Item', thumbnail: null } as any
      const item = createOptimisticCartItem(variant, product)
      expect(item.quantity).toBe(1)
      expect(item.total).toBe(1000)
    })

    it('handles zero price variant', () => {
      const variant = { id: 'var_1', title: 'Free', calculated_price: { calculated_amount: 0 } } as any
      const product = { id: 'prod_1', title: 'Free Item', thumbnail: null } as any
      const item = createOptimisticCartItem(variant, product, 3)
      expect(item.unit_price).toBe(0)
      expect(item.total).toBe(0)
    })
  })

  describe('createOptimisticCart', () => {
    it('creates an optimistic cart with region info', () => {
      const region = { id: 'reg_us', currency_code: 'usd' } as any
      const cart = createOptimisticCart(region)
      expect(cart.region_id).toBe('reg_us')
      expect(cart.currency_code).toBe('usd')
      expect(cart.items).toEqual([])
      expect(cart.total).toBe(0)
      expect(cart.isOptimistic).toBe(true)
      expect(cart.id).toContain('optimistic-cart-')
    })
  })
})
