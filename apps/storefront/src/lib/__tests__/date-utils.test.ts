import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatDate, formatRelativeTime, formatDateRange, parseISODate } from '@/lib/utils/date-utils'

describe('Date Utilities', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('formatDate', () => {
    it('formats dates in locale format', () => {
      const result = formatDate(new Date('2025-06-15'), 'en-US')
      expect(result).toContain('June')
      expect(result).toContain('15')
      expect(result).toContain('2025')
    })

    it('handles ISO date strings', () => {
      const result = formatDate('2025-03-20T10:30:00Z', 'en-US')
      expect(result).toContain('March')
      expect(result).toContain('2025')
    })

    it('formats with French locale', () => {
      const result = formatDate('2025-01-15T00:00:00Z', 'fr-FR')
      expect(result).toContain('janvier')
      expect(result).toContain('2025')
    })

    it('handles null dates gracefully', () => {
      expect(formatDate(null)).toBe('')
    })

    it('handles undefined dates gracefully', () => {
      expect(formatDate(undefined)).toBe('')
    })

    it('handles invalid date string', () => {
      expect(formatDate('not-a-date')).toBe('')
    })

    it('handles timezone offsets', () => {
      const result = formatDate('2025-07-04T23:00:00+05:00', 'en-US')
      expect(result).toContain('2025')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('formatRelativeTime', () => {
    it('formats relative time for recent events', () => {
      vi.useFakeTimers()
      const now = new Date('2025-06-15T12:00:00Z')
      vi.setSystemTime(now)

      const twoHoursAgo = new Date('2025-06-15T10:00:00Z')
      expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago')
    })

    it('shows "just now" for very recent times', () => {
      vi.useFakeTimers()
      const now = new Date('2025-06-15T12:00:00Z')
      vi.setSystemTime(now)

      const secondsAgo = new Date('2025-06-15T11:59:30Z')
      expect(formatRelativeTime(secondsAgo)).toBe('just now')
    })

    it('shows minutes ago', () => {
      vi.useFakeTimers()
      const now = new Date('2025-06-15T12:00:00Z')
      vi.setSystemTime(now)

      const fiveMinutesAgo = new Date('2025-06-15T11:55:00Z')
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago')
    })

    it('shows days ago', () => {
      vi.useFakeTimers()
      const now = new Date('2025-06-15T12:00:00Z')
      vi.setSystemTime(now)

      const threeDaysAgo = new Date('2025-06-12T12:00:00Z')
      expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago')
    })

    it('handles null gracefully', () => {
      expect(formatRelativeTime(null)).toBe('')
    })

    it('handles undefined gracefully', () => {
      expect(formatRelativeTime(undefined)).toBe('')
    })
  })

  describe('formatDateRange', () => {
    it('formats date ranges', () => {
      const result = formatDateRange('2025-01-01T00:00:00Z', '2025-12-31T00:00:00Z', 'en-US')
      expect(result).toContain('January')
      expect(result).toContain('December')
      expect(result).toContain('–')
    })

    it('handles null start date', () => {
      const result = formatDateRange(null, '2025-12-31T00:00:00Z', 'en-US')
      expect(result).toContain('December')
    })

    it('handles null end date', () => {
      const result = formatDateRange('2025-01-01T00:00:00Z', null, 'en-US')
      expect(result).toContain('January')
    })

    it('returns empty string for both null', () => {
      expect(formatDateRange(null, null)).toBe('')
    })
  })

  describe('parseISODate', () => {
    it('parses valid ISO strings', () => {
      const result = parseISODate('2025-06-15T12:00:00Z')
      expect(result).toBeInstanceOf(Date)
      expect(result?.getFullYear()).toBe(2025)
    })

    it('returns null for invalid strings', () => {
      expect(parseISODate('invalid')).toBeNull()
    })

    it('returns null for empty string', () => {
      expect(parseISODate('')).toBeNull()
    })
  })
})
