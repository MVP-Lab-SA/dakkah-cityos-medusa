import { describe, it, expect } from 'vitest'
import { formatPrice, getPricePercentageDiff, getProductPrice } from '@/lib/utils/price'
import { isObject, isArray, isEmpty, validators, validateForm, hasErrors } from '@/lib/utils/validation'
import { formatOrderId } from '@/lib/utils/order'
import { isStripe, isManual, getActivePaymentSession, isPaidWithGiftCard } from '@/lib/utils/checkout'
import { getCountryCodeFromPath, getTenantLocalePrefix, COUNTRY_CODE_KEY } from '@/lib/utils/region'
import { isVariantInStock } from '@/lib/utils/product'
import { t, isRTL, getDirection, isValidLocale, formatNumber, SUPPORTED_LOCALES, LOCALE_CONFIG } from '@/lib/i18n'

describe('Price Utilities', () => {
  describe('formatPrice', () => {
    it('formats USD price from smallest unit', () => {
      const result = formatPrice(1000, 'usd')
      expect(result).toBe('$10.00')
    })

    it('formats zero-decimal currency (JPY)', () => {
      const result = formatPrice(1000, 'jpy')
      expect(result).toBe('¥1,000')
    })

    it('formats with params object', () => {
      const result = formatPrice({ amount: 2500, currency_code: 'usd' })
      expect(result).toBe('$25.00')
    })

    it('returns string when no currency provided', () => {
      const result = formatPrice({ amount: 1000, currency_code: '' })
      expect(result).toBe('10')
    })

    it('defaults to usd when no currency_code for number overload', () => {
      const result = formatPrice(500)
      expect(result).toBe('$5.00')
    })
  })

  describe('getPricePercentageDiff', () => {
    it('calculates percentage difference', () => {
      expect(getPricePercentageDiff(100, 80)).toBe('20')
    })

    it('returns 0 for same prices', () => {
      expect(getPricePercentageDiff(100, 100)).toBe('0')
    })

    it('handles negative diff (price increase)', () => {
      expect(getPricePercentageDiff(80, 100)).toBe('-25')
    })
  })

  describe('getProductPrice', () => {
    it('throws when no product provided', () => {
      expect(() => getProductPrice({ product: null as any })).toThrow('No product provided')
    })

    it('throws when product has no id', () => {
      expect(() => getProductPrice({ product: {} as any })).toThrow('No product provided')
    })

    it('returns null cheapestPrice when no variants', () => {
      const result = getProductPrice({ product: { id: 'prod_1', variants: [] } as any })
      expect(result.cheapestPrice).toBeNull()
    })

    it('returns null variantPrice when no variant_id', () => {
      const result = getProductPrice({ product: { id: 'prod_1', variants: [] } as any })
      expect(result.variantPrice).toBeNull()
    })
  })
})

describe('Validation Utilities', () => {
  describe('isObject', () => {
    it('returns true for objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject([])).toBe(true)
    })

    it('returns false for primitives', () => {
      expect(isObject(null)).toBe(false)
      expect(isObject('str')).toBe(false)
      expect(isObject(42)).toBe(false)
    })
  })

  describe('isArray', () => {
    it('returns true for arrays', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2])).toBe(true)
    })

    it('returns false for non-arrays', () => {
      expect(isArray({})).toBe(false)
      expect(isArray('hello')).toBe(false)
    })
  })

  describe('isEmpty', () => {
    it('returns true for null/undefined', () => {
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
    })

    it('returns true for empty string', () => {
      expect(isEmpty('')).toBe(true)
      expect(isEmpty('   ')).toBe(true)
    })

    it('returns true for empty object/array', () => {
      expect(isEmpty({})).toBe(true)
      expect(isEmpty([])).toBe(true)
    })

    it('returns false for non-empty values', () => {
      expect(isEmpty('hello')).toBe(false)
      expect(isEmpty({ a: 1 })).toBe(false)
      expect(isEmpty([1])).toBe(false)
    })
  })

  describe('validators', () => {
    it('email: validates correctly', () => {
      expect(validators.email('test@example.com')).toBeNull()
      expect(validators.email('')).toBe('Email is required')
      expect(validators.email('invalid')).toBe('Invalid email address')
    })

    it('phone: validates correctly', () => {
      expect(validators.phone('+1 234 567 8900')).toBeNull()
      expect(validators.phone('')).toBeNull()
      expect(validators.phone('123')).toBe('Invalid phone number')
    })

    it('taxId: validates US EIN format', () => {
      expect(validators.taxId('12-3456789', 'us')).toBeNull()
      expect(validators.taxId('invalid', 'us')).toBe('Invalid EIN format (XX-XXXXXXX)')
      expect(validators.taxId('', 'us')).toBe('Tax ID is required')
    })

    it('postalCode: validates US format', () => {
      expect(validators.postalCode('12345', 'us')).toBeNull()
      expect(validators.postalCode('12345-6789', 'us')).toBeNull()
      expect(validators.postalCode('1234', 'us')).toBe('Invalid postal code for US')
    })

    it('postalCode: validates Canadian format', () => {
      expect(validators.postalCode('A1B 2C3', 'ca')).toBeNull()
    })

    it('required: validates presence', () => {
      expect(validators.required('hello', 'Name')).toBeNull()
      expect(validators.required('', 'Name')).toBe('Name is required')
      expect(validators.required(null, 'Name')).toBe('Name is required')
    })

    it('minLength: validates minimum length', () => {
      expect(validators.minLength('hello', 3, 'Name')).toBeNull()
      expect(validators.minLength('hi', 3, 'Name')).toBe('Name must be at least 3 characters')
    })

    it('maxLength: validates maximum length', () => {
      expect(validators.maxLength('hi', 5, 'Name')).toBeNull()
      expect(validators.maxLength('hello world', 5, 'Name')).toBe('Name must be no more than 5 characters')
    })

    it('positiveNumber: validates positive numbers', () => {
      expect(validators.positiveNumber(5, 'Price')).toBeNull()
      expect(validators.positiveNumber(-1, 'Price')).toBe('Price must be a positive number')
      expect(validators.positiveNumber(undefined as any, 'Price')).toBe('Price is required')
    })

    it('minValue: validates minimum value', () => {
      expect(validators.minValue(10, 5, 'Qty')).toBeNull()
      expect(validators.minValue(3, 5, 'Qty')).toBe('Qty must be at least 5')
    })
  })

  describe('validateForm', () => {
    it('returns empty object when all valid', () => {
      const errors = validateForm(
        { email: 'test@test.com' },
        { email: (v) => validators.email(v as string) }
      )
      expect(errors).toEqual({})
    })

    it('returns errors for invalid fields', () => {
      const errors = validateForm(
        { email: 'invalid', name: '' },
        {
          email: (v) => validators.email(v as string),
          name: (v) => validators.required(v, 'Name'),
        }
      )
      expect(errors.email).toBe('Invalid email address')
      expect(errors.name).toBe('Name is required')
    })
  })

  describe('hasErrors', () => {
    it('returns false for empty errors', () => {
      expect(hasErrors({})).toBe(false)
    })

    it('returns true when errors exist', () => {
      expect(hasErrors({ email: 'Required' })).toBe(true)
    })
  })
})

describe('Order Utilities', () => {
  it('formats order ID with leading zeros', () => {
    expect(formatOrderId('1')).toBe('#000001')
    expect(formatOrderId('123456')).toBe('#123456')
    expect(formatOrderId('42')).toBe('#000042')
  })
})

describe('Checkout Utilities', () => {
  describe('isStripe', () => {
    it('detects Stripe provider', () => {
      expect(isStripe('pp_stripe_card')).toBe(true)
      expect(isStripe('stripe')).toBe(true)
      expect(isStripe('pp_manual')).toBe(false)
      expect(isStripe(undefined)).toBeFalsy()
    })
  })

  describe('isManual', () => {
    it('detects manual provider', () => {
      expect(isManual('pp_system_default')).toBe(true)
      expect(isManual('manual')).toBe(true)
      expect(isManual('pp_stripe_card')).toBe(false)
      expect(isManual(undefined)).toBeFalsy()
    })
  })

  describe('getActivePaymentSession', () => {
    it('returns pending payment session', () => {
      const cart = {
        payment_collection: {
          payment_sessions: [
            { id: 'ps_1', status: 'authorized' },
            { id: 'ps_2', status: 'pending' },
          ],
        },
      } as any
      expect(getActivePaymentSession(cart)?.id).toBe('ps_2')
    })

    it('returns undefined when no pending session', () => {
      const cart = {
        payment_collection: {
          payment_sessions: [{ id: 'ps_1', status: 'authorized' }],
        },
      } as any
      expect(getActivePaymentSession(cart)).toBeUndefined()
    })

    it('returns undefined when no payment collection', () => {
      expect(getActivePaymentSession({} as any)).toBeUndefined()
    })
  })

  describe('isPaidWithGiftCard', () => {
    it('returns true when paid with gift card and total is 0', () => {
      const cart = { gift_cards: [{ id: 'gc_1' }], total: 0 } as any
      expect(isPaidWithGiftCard(cart)).toBe(true)
    })

    it('returns false when total is not 0', () => {
      const cart = { gift_cards: [{ id: 'gc_1' }], total: 500 } as any
      expect(isPaidWithGiftCard(cart)).toBe(false)
    })

    it('returns false when no gift cards', () => {
      const cart = { gift_cards: [], total: 0 } as any
      expect(isPaidWithGiftCard(cart)).toBe(false)
    })
  })
})

describe('Region Utilities', () => {
  describe('getCountryCodeFromPath', () => {
    it('extracts 2-letter country code from path', () => {
      expect(getCountryCodeFromPath('/us/products')).toBe('us')
      expect(getCountryCodeFromPath('/FR/products')).toBe('fr')
    })

    it('returns undefined for non-country path segments', () => {
      expect(getCountryCodeFromPath('/products')).toBeUndefined()
      expect(getCountryCodeFromPath('/')).toBeUndefined()
    })
  })

  describe('getTenantLocalePrefix', () => {
    it('returns tenant/locale prefix', () => {
      expect(getTenantLocalePrefix('/dakkah/en/products')).toBe('/dakkah/en')
    })

    it('returns single segment', () => {
      expect(getTenantLocalePrefix('/dakkah')).toBe('/dakkah')
    })

    it('returns empty for root', () => {
      expect(getTenantLocalePrefix('/')).toBe('')
    })
  })

  it('exports COUNTRY_CODE_KEY constant', () => {
    expect(COUNTRY_CODE_KEY).toBe('medusa_country_code')
  })
})

describe('Product Utilities', () => {
  describe('isVariantInStock', () => {
    it('returns true when inventory not managed', () => {
      expect(isVariantInStock({ manage_inventory: false } as any)).toBe(true)
    })

    it('returns true when backorder allowed', () => {
      expect(isVariantInStock({ manage_inventory: true, allow_backorder: true, inventory_quantity: 0 } as any)).toBe(true)
    })

    it('returns true when in stock', () => {
      expect(isVariantInStock({ manage_inventory: true, allow_backorder: false, inventory_quantity: 5 } as any)).toBe(true)
    })

    it('returns false when out of stock', () => {
      expect(isVariantInStock({ manage_inventory: true, allow_backorder: false, inventory_quantity: 0 } as any)).toBe(false)
    })
  })
})

describe('i18n Utilities', () => {
  it('SUPPORTED_LOCALES contains en, fr, ar', () => {
    expect(SUPPORTED_LOCALES).toEqual(['en', 'fr', 'ar'])
  })

  describe('t (translation)', () => {
    it('returns key when translation not found', () => {
      expect(t('en', 'nonexistent.key')).toBe('nonexistent.key')
    })

    it('falls back to English for unknown locale', () => {
      const enResult = t('en', 'nonexistent.key')
      const unknownResult = t('xx', 'nonexistent.key')
      expect(unknownResult).toBe(enResult)
    })
  })

  describe('isRTL', () => {
    it('returns true for Arabic', () => {
      expect(isRTL('ar')).toBe(true)
    })

    it('returns false for English and French', () => {
      expect(isRTL('en')).toBe(false)
      expect(isRTL('fr')).toBe(false)
    })
  })

  describe('getDirection', () => {
    it('returns rtl for Arabic', () => {
      expect(getDirection('ar')).toBe('rtl')
    })

    it('returns ltr for non-Arabic', () => {
      expect(getDirection('en')).toBe('ltr')
      expect(getDirection('fr')).toBe('ltr')
    })
  })

  describe('isValidLocale', () => {
    it('returns true for supported locales', () => {
      expect(isValidLocale('en')).toBe(true)
      expect(isValidLocale('fr')).toBe(true)
      expect(isValidLocale('ar')).toBe(true)
    })

    it('returns false for unsupported locales', () => {
      expect(isValidLocale('de')).toBe(false)
      expect(isValidLocale('xx')).toBe(false)
    })
  })

  describe('formatNumber', () => {
    it('formats numbers for English locale', () => {
      expect(formatNumber(1234.56, 'en')).toBe('1,234.56')
    })
  })

  describe('LOCALE_CONFIG', () => {
    it('has correct direction for Arabic', () => {
      expect(LOCALE_CONFIG.ar.direction).toBe('rtl')
    })

    it('has correct direction for English', () => {
      expect(LOCALE_CONFIG.en.direction).toBe('ltr')
    })

    it('has native names', () => {
      expect(LOCALE_CONFIG.ar.nativeName).toBe('العربية')
      expect(LOCALE_CONFIG.fr.nativeName).toBe('Français')
    })
  })
})
