import { describe, it, expect } from 'vitest'

function buildApiUrl(base: string, path: string): string {
  const normalizedBase = base.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}

function buildQueryParams(params: Record<string, string | number | boolean | undefined | null>): string {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.set(key, String(value))
    }
  })
  return query.toString()
}

function parseApiError(response: { status: number; statusText?: string; body?: any }): string {
  if (response.body?.message) return response.body.message
  if (response.body?.error) return response.body.error
  if (response.statusText) return response.statusText
  if (response.status === 404) return 'Not found'
  if (response.status === 401) return 'Unauthorized'
  if (response.status === 403) return 'Forbidden'
  if (response.status === 500) return 'Internal server error'
  return `Request failed with status ${response.status}`
}

function extractPaginationMeta(response: { count?: number; limit?: number; offset?: number }): {
  total: number
  page: number
  pageSize: number
  totalPages: number
} {
  const total = response.count || 0
  const pageSize = response.limit || 20
  const offset = response.offset || 0
  const page = Math.floor(offset / pageSize) + 1
  const totalPages = Math.ceil(total / pageSize)
  return { total, page, pageSize, totalPages }
}

function isSuccessStatus(status: number): boolean {
  return status >= 200 && status < 300
}

describe('API Helpers', () => {
  describe('buildApiUrl', () => {
    it('joins base URL and path', () => {
      expect(buildApiUrl('https://api.example.com', '/store/products')).toBe('https://api.example.com/store/products')
    })

    it('handles trailing slash on base', () => {
      expect(buildApiUrl('https://api.example.com/', '/store/products')).toBe('https://api.example.com/store/products')
    })

    it('adds leading slash to path if missing', () => {
      expect(buildApiUrl('https://api.example.com', 'store/products')).toBe('https://api.example.com/store/products')
    })
  })

  describe('buildQueryParams', () => {
    it('builds query string from params', () => {
      const result = buildQueryParams({ limit: 10, offset: 0, q: 'shirt' })
      expect(result).toContain('limit=10')
      expect(result).toContain('offset=0')
      expect(result).toContain('q=shirt')
    })

    it('skips undefined and null values', () => {
      const result = buildQueryParams({ limit: 10, offset: undefined, q: null })
      expect(result).toBe('limit=10')
    })

    it('converts boolean values to string', () => {
      const result = buildQueryParams({ is_active: true })
      expect(result).toBe('is_active=true')
    })

    it('returns empty string for empty params', () => {
      expect(buildQueryParams({})).toBe('')
    })
  })

  describe('parseApiError', () => {
    it('extracts message from body', () => {
      expect(parseApiError({ status: 400, body: { message: 'Bad input' } })).toBe('Bad input')
    })

    it('extracts error string from body', () => {
      expect(parseApiError({ status: 400, body: { error: 'Validation failed' } })).toBe('Validation failed')
    })

    it('falls back to statusText', () => {
      expect(parseApiError({ status: 400, statusText: 'Bad Request' })).toBe('Bad Request')
    })

    it('returns default message for known status codes', () => {
      expect(parseApiError({ status: 404 })).toBe('Not found')
      expect(parseApiError({ status: 401 })).toBe('Unauthorized')
      expect(parseApiError({ status: 403 })).toBe('Forbidden')
      expect(parseApiError({ status: 500 })).toBe('Internal server error')
    })

    it('returns generic message for unknown status', () => {
      expect(parseApiError({ status: 503 })).toBe('Request failed with status 503')
    })
  })

  describe('extractPaginationMeta', () => {
    it('calculates pagination from response', () => {
      const meta = extractPaginationMeta({ count: 100, limit: 20, offset: 40 })
      expect(meta.total).toBe(100)
      expect(meta.page).toBe(3)
      expect(meta.pageSize).toBe(20)
      expect(meta.totalPages).toBe(5)
    })

    it('defaults to page 1 with no offset', () => {
      const meta = extractPaginationMeta({ count: 50, limit: 10 })
      expect(meta.page).toBe(1)
      expect(meta.totalPages).toBe(5)
    })

    it('handles zero count', () => {
      const meta = extractPaginationMeta({ count: 0, limit: 10, offset: 0 })
      expect(meta.totalPages).toBe(0)
    })
  })

  describe('isSuccessStatus', () => {
    it('returns true for 2xx status codes', () => {
      expect(isSuccessStatus(200)).toBe(true)
      expect(isSuccessStatus(201)).toBe(true)
      expect(isSuccessStatus(204)).toBe(true)
    })

    it('returns false for non-2xx status codes', () => {
      expect(isSuccessStatus(301)).toBe(false)
      expect(isSuccessStatus(400)).toBe(false)
      expect(isSuccessStatus(500)).toBe(false)
    })
  })
})
