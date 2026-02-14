import { describe, it, expect } from 'vitest'
import { formatCurrency, convertFromCents, formatCurrencyFromDecimal } from '@/lib/utils/currency'

describe('Currency Utilities', () => {
  describe('formatCurrency', () => {
    it('formats USD correctly', () => {
      const result = formatCurrency(1000, 'usd')
      expect(result).toBe('$10.00')
    })

    it('formats EUR correctly', () => {
      const result = formatCurrency(2500, 'eur')
      expect(result).toContain('25')
      expect(result).toMatch(/€/)
    })

    it('handles zero amounts', () => {
      const result = formatCurrency(0, 'usd')
      expect(result).toBe('$0.00')
    })

    it('handles negative amounts', () => {
      const result = formatCurrency(-1500, 'usd')
      expect(result).toContain('15.00')
    })

    it('formats with different locales', () => {
      const resultUS = formatCurrency(1000, 'usd', 'en-US')
      expect(resultUS).toBe('$10.00')

      const resultDE = formatCurrency(1000, 'eur', 'de-DE')
      expect(resultDE).toContain('10')
      expect(resultDE).toMatch(/€/)
    })

    it('handles missing currency code gracefully', () => {
      const result = formatCurrency(1000)
      expect(result).toBe('1000')
    })

    it('handles empty string currency code', () => {
      const result = formatCurrency(500, '')
      expect(result).toBe('500')
    })
  })

  describe('convertFromCents', () => {
    it('divides by 100 for cent-based amounts', () => {
      expect(convertFromCents(1000, 'usd')).toBe(10)
      expect(convertFromCents(2550, 'eur')).toBe(25.5)
      expect(convertFromCents(99, 'gbp')).toBe(0.99)
    })

    it('does not divide for zero-decimal currencies', () => {
      expect(convertFromCents(1000, 'jpy')).toBe(1000)
      expect(convertFromCents(500, 'krw')).toBe(500)
    })

    it('handles zero amount', () => {
      expect(convertFromCents(0, 'usd')).toBe(0)
    })
  })

  describe('formatCurrencyFromDecimal', () => {
    it('formats decimal amount without cent conversion', () => {
      const result = formatCurrencyFromDecimal(10.5, 'usd')
      expect(result).toBe('$10.50')
    })

    it('returns plain number when no currency code', () => {
      const result = formatCurrencyFromDecimal(25)
      expect(result).toBe('25')
    })
  })
})
