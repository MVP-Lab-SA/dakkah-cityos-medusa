import { describe, it, expect } from 'vitest'
import { parseLocale, isRTL, getLanguageFallback, getSupportedLocales, isLocaleSupported, formatLocaleDisplay } from '../locale-utils'

describe("Locale Utils", () => {
  describe("parseLocale", () => {
    it("parses full locale with language and region", () => {
      const result = parseLocale("en-US")
      expect(result.language).toBe("en")
      expect(result.region).toBe("US")
    })

    it("parses locale with underscore separator", () => {
      const result = parseLocale("pt_BR")
      expect(result.language).toBe("pt")
      expect(result.region).toBe("BR")
    })

    it("parses language-only locale", () => {
      const result = parseLocale("fr")
      expect(result.language).toBe("fr")
      expect(result.region).toBeNull()
    })

    it("returns default for empty locale", () => {
      const result = parseLocale("")
      expect(result.language).toBe("en")
      expect(result.region).toBeNull()
    })
  })

  describe("isRTL", () => {
    it("returns true for Arabic", () => {
      expect(isRTL("ar-SA")).toBe(true)
      expect(isRTL("ar")).toBe(true)
    })

    it("returns true for Hebrew", () => {
      expect(isRTL("he-IL")).toBe(true)
    })

    it("returns true for Farsi", () => {
      expect(isRTL("fa")).toBe(true)
    })

    it("returns false for English", () => {
      expect(isRTL("en-US")).toBe(false)
    })

    it("returns false for Japanese", () => {
      expect(isRTL("ja-JP")).toBe(false)
    })
  })

  describe("getLanguageFallback", () => {
    it("returns mapped fallback for known locale", () => {
      expect(getLanguageFallback("en-GB")).toBe("en-US")
      expect(getLanguageFallback("es-MX")).toBe("es-ES")
      expect(getLanguageFallback("pt-PT")).toBe("pt-BR")
    })

    it("falls back to first supported locale for unknown region", () => {
      expect(getLanguageFallback("de-CH")).toBe("de-DE")
    })

    it("falls back to en-US for completely unknown locale", () => {
      expect(getLanguageFallback("xx-YY")).toBe("en-US")
    })
  })

  describe("getSupportedLocales", () => {
    it("returns an array of supported locale codes", () => {
      const locales = getSupportedLocales()
      expect(locales).toContain("en-US")
      expect(locales).toContain("ar-SA")
      expect(locales.length).toBeGreaterThan(10)
    })
  })

  describe("isLocaleSupported", () => {
    it("returns true for supported locale", () => {
      expect(isLocaleSupported("en-US")).toBe(true)
    })

    it("returns false for unsupported locale", () => {
      expect(isLocaleSupported("xx-YY")).toBe(false)
    })
  })

  describe("formatLocaleDisplay", () => {
    it("formats locale with region", () => {
      expect(formatLocaleDisplay("en-US")).toBe("English (US)")
    })

    it("formats locale without region", () => {
      expect(formatLocaleDisplay("fr")).toBe("French")
    })
  })
})
