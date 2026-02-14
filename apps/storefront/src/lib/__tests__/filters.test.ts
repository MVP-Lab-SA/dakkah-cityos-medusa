import { describe, it, expect } from 'vitest'
import {
  filterBySearch,
  filterByStatus,
  filterByDateRange,
  applyFilters,
  sortItems,
  paginate,
} from '@/lib/utils/filters'

const sampleItems = [
  { id: '1', name: 'Red Widget', status: 'active', created_at: '2025-01-15T00:00:00Z', price: 100 },
  { id: '2', name: 'Blue Gadget', status: 'inactive', created_at: '2025-02-20T00:00:00Z', price: 200 },
  { id: '3', name: 'Green Widget', status: 'active', created_at: '2025-03-10T00:00:00Z', price: 150 },
  { id: '4', name: 'Yellow Device', status: 'draft', created_at: '2025-04-05T00:00:00Z', price: 50 },
  { id: '5', name: 'Purple Gadget', status: 'active', created_at: '2025-05-01T00:00:00Z', price: 300 },
]

describe('Filter Utilities', () => {
  describe('filterBySearch', () => {
    it('filters items by text search', () => {
      const result = filterBySearch(sampleItems, 'widget', ['name'])
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Red Widget')
      expect(result[1].name).toBe('Green Widget')
    })

    it('is case-insensitive', () => {
      const result = filterBySearch(sampleItems, 'GADGET', ['name'])
      expect(result).toHaveLength(2)
    })

    it('searches across multiple fields', () => {
      const result = filterBySearch(sampleItems, 'red', ['name', 'status'])
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Red Widget')
    })

    it('handles empty search string', () => {
      const result = filterBySearch(sampleItems, '', ['name'])
      expect(result).toHaveLength(5)
    })

    it('handles whitespace-only search', () => {
      const result = filterBySearch(sampleItems, '   ', ['name'])
      expect(result).toHaveLength(5)
    })
  })

  describe('filterByStatus', () => {
    it('filters by status', () => {
      const result = filterByStatus(sampleItems, 'active')
      expect(result).toHaveLength(3)
      result.forEach((item) => expect(item.status).toBe('active'))
    })

    it('returns all items when status is null', () => {
      const result = filterByStatus(sampleItems, null)
      expect(result).toHaveLength(5)
    })

    it('returns all items when status is undefined', () => {
      const result = filterByStatus(sampleItems, undefined)
      expect(result).toHaveLength(5)
    })

    it('returns empty when no matching status', () => {
      const result = filterByStatus(sampleItems, 'archived')
      expect(result).toHaveLength(0)
    })
  })

  describe('filterByDateRange', () => {
    it('filters by date range', () => {
      const result = filterByDateRange(
        sampleItems,
        '2025-02-01T00:00:00Z',
        '2025-04-01T00:00:00Z'
      )
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('2')
      expect(result[1].id).toBe('3')
    })

    it('filters with only from date', () => {
      const result = filterByDateRange(sampleItems, '2025-04-01T00:00:00Z', null)
      expect(result).toHaveLength(2)
    })

    it('filters with only to date', () => {
      const result = filterByDateRange(sampleItems, null, '2025-02-01T00:00:00Z')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('returns all when no dates provided', () => {
      const result = filterByDateRange(sampleItems, null, null)
      expect(result).toHaveLength(5)
    })
  })

  describe('applyFilters', () => {
    it('combines multiple filters', () => {
      const result = applyFilters(sampleItems, {
        search: 'widget',
        status: 'active',
      }, ['name'])
      expect(result).toHaveLength(2)
    })

    it('handles empty filter values', () => {
      const result = applyFilters(sampleItems, {}, ['name'])
      expect(result).toHaveLength(5)
    })

    it('combines search and date range', () => {
      const result = applyFilters(sampleItems, {
        search: 'gadget',
        dateFrom: '2025-03-01T00:00:00Z',
      }, ['name'])
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Purple Gadget')
    })
  })

  describe('sortItems', () => {
    it('sorts results by field ascending', () => {
      const result = sortItems(sampleItems, { field: 'price', direction: 'asc' })
      expect(result[0].price).toBe(50)
      expect(result[4].price).toBe(300)
    })

    it('sorts results by field descending', () => {
      const result = sortItems(sampleItems, { field: 'price', direction: 'desc' })
      expect(result[0].price).toBe(300)
      expect(result[4].price).toBe(50)
    })

    it('sorts by string field', () => {
      const result = sortItems(sampleItems, { field: 'name', direction: 'asc' })
      expect(result[0].name).toBe('Blue Gadget')
    })

    it('handles null values in sort field', () => {
      const itemsWithNull = [
        { id: '1', value: 10 },
        { id: '2', value: null as any },
        { id: '3', value: 5 },
      ]
      const result = sortItems(itemsWithNull, { field: 'value', direction: 'asc' })
      expect(result[result.length - 1].value).toBeNull()
    })
  })

  describe('paginate', () => {
    it('paginates results correctly', () => {
      const result = paginate(sampleItems, { page: 1, limit: 2 })
      expect(result.data).toHaveLength(2)
      expect(result.total).toBe(5)
      expect(result.totalPages).toBe(3)
      expect(result.page).toBe(1)
    })

    it('returns correct second page', () => {
      const result = paginate(sampleItems, { page: 2, limit: 2 })
      expect(result.data).toHaveLength(2)
      expect(result.data[0].id).toBe('3')
    })

    it('returns partial last page', () => {
      const result = paginate(sampleItems, { page: 3, limit: 2 })
      expect(result.data).toHaveLength(1)
    })

    it('handles edge cases - empty array', () => {
      const result = paginate([], { page: 1, limit: 10 })
      expect(result.data).toHaveLength(0)
      expect(result.total).toBe(0)
      expect(result.totalPages).toBe(0)
    })

    it('handles page beyond total', () => {
      const result = paginate(sampleItems, { page: 100, limit: 10 })
      expect(result.data).toHaveLength(0)
    })
  })
})
