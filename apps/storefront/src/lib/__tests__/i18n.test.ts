import { describe, it, expect } from 'vitest'
import { t, isRTL, getDirection, isValidLocale, formatNumber, formatDate, formatCurrency, SUPPORTED_LOCALES, LOCALE_CONFIG } from '@/lib/i18n'
import en from '@/lib/i18n/locales/en.json'
import fr from '@/lib/i18n/locales/fr.json'
import ar from '@/lib/i18n/locales/ar.json'

describe('i18n', () => {
  describe('locale loading', () => {
    it('loads en.json as a valid object', () => {
      expect(typeof en).toBe('object')
      expect(en).not.toBeNull()
      expect(Object.keys(en).length).toBeGreaterThan(0)
    })

    it('loads fr.json as a valid object', () => {
      expect(typeof fr).toBe('object')
      expect(fr).not.toBeNull()
      expect(Object.keys(fr).length).toBeGreaterThan(0)
    })

    it('loads ar.json as a valid object', () => {
      expect(typeof ar).toBe('object')
      expect(ar).not.toBeNull()
      expect(Object.keys(ar).length).toBeGreaterThan(0)
    })
  })

  describe('matching key sets', () => {
    it('en and fr have the same top-level keys', () => {
      const enKeys = Object.keys(en).sort()
      const frKeys = Object.keys(fr).sort()
      expect(enKeys).toEqual(frKeys)
    })

    it('en and ar have the same top-level keys', () => {
      const enKeys = Object.keys(en).sort()
      const arKeys = Object.keys(ar).sort()
      expect(enKeys).toEqual(arKeys)
    })
  })

  describe('translation key resolution', () => {
    it('resolves a known top-level key', () => {
      const result = t('en', 'common.home')
      expect(typeof result).toBe('string')
      expect(result).not.toBe('')
    })

    it('returns the key itself for unknown translations', () => {
      expect(t('en', 'nonexistent.deeply.nested.key')).toBe('nonexistent.deeply.nested.key')
    })

    it('falls back to English for unsupported locale', () => {
      const enResult = t('en', 'common.home')
      const xxResult = t('xx', 'common.home')
      expect(xxResult).toBe(enResult)
    })
  })

  describe('isValidLocale', () => {
    it('returns true for all supported locales', () => {
      SUPPORTED_LOCALES.forEach((loc) => {
        expect(isValidLocale(loc)).toBe(true)
      })
    })

    it('returns false for unsupported locales', () => {
      expect(isValidLocale('de')).toBe(false)
      expect(isValidLocale('zh')).toBe(false)
      expect(isValidLocale('')).toBe(false)
    })
  })

  describe('LOCALE_CONFIG', () => {
    it('has config entries for every supported locale', () => {
      SUPPORTED_LOCALES.forEach((loc) => {
        expect(LOCALE_CONFIG[loc]).toBeDefined()
        expect(LOCALE_CONFIG[loc].name).toBeTruthy()
        expect(LOCALE_CONFIG[loc].nativeName).toBeTruthy()
        expect(LOCALE_CONFIG[loc].direction).toMatch(/^(ltr|rtl)$/)
      })
    })
  })
})
