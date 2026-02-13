import { describe, it, expect } from 'vitest'

function isVerticalAllowed(effectivePolicies: any, vertical: string): boolean {
  if (!effectivePolicies) return true
  const prohibited = effectivePolicies.content_moderation?.prohibited_categories
  if (prohibited && Array.isArray(prohibited)) {
    return !prohibited.includes(vertical.toLowerCase())
  }
  return true
}

function isFeatureAllowed(effectivePolicies: any, feature: string): boolean {
  if (!effectivePolicies) return true
  const commerce = effectivePolicies.commerce as Record<string, unknown> | undefined
  if (commerce && feature in commerce) {
    return commerce[feature] !== false
  }
  return true
}

function getCommercePolicy(effectivePolicies: any) {
  return effectivePolicies?.commerce
}

describe('Governance Context Logic', () => {
  describe('isVerticalAllowed', () => {
    it('returns true when no policies', () => {
      expect(isVerticalAllowed(null, 'Store')).toBe(true)
    })

    it('returns true when no content_moderation', () => {
      expect(isVerticalAllowed({}, 'Store')).toBe(true)
    })

    it('returns true when no prohibited_categories', () => {
      expect(isVerticalAllowed({ content_moderation: {} }, 'Store')).toBe(true)
    })

    it('returns true when vertical not prohibited', () => {
      const policies = { content_moderation: { prohibited_categories: ['gambling'] } }
      expect(isVerticalAllowed(policies, 'Store')).toBe(true)
    })

    it('returns false when vertical is prohibited (case insensitive)', () => {
      const policies = { content_moderation: { prohibited_categories: ['gambling'] } }
      expect(isVerticalAllowed(policies, 'Gambling')).toBe(false)
    })

    it('handles multiple prohibited categories', () => {
      const policies = { content_moderation: { prohibited_categories: ['gambling', 'adult', 'weapons'] } }
      expect(isVerticalAllowed(policies, 'Gambling')).toBe(false)
      expect(isVerticalAllowed(policies, 'Adult')).toBe(false)
      expect(isVerticalAllowed(policies, 'Store')).toBe(true)
    })

    it('returns true when prohibited_categories is not an array', () => {
      const policies = { content_moderation: { prohibited_categories: 'gambling' } }
      expect(isVerticalAllowed(policies, 'Gambling')).toBe(true)
    })

    it('returns true with undefined policies', () => {
      expect(isVerticalAllowed(undefined, 'Store')).toBe(true)
    })

    it('handles empty prohibited_categories array', () => {
      const policies = { content_moderation: { prohibited_categories: [] } }
      expect(isVerticalAllowed(policies, 'Store')).toBe(true)
    })

    it('handles empty string vertical', () => {
      const policies = { content_moderation: { prohibited_categories: [''] } }
      expect(isVerticalAllowed(policies, '')).toBe(false)
    })

    it('is case-sensitive on the prohibited list side', () => {
      const policies = { content_moderation: { prohibited_categories: ['Gambling'] } }
      expect(isVerticalAllowed(policies, 'GAMBLING')).toBe(true)
      expect(isVerticalAllowed(policies, 'gambling')).toBe(true)
    })
  })

  describe('isFeatureAllowed', () => {
    it('returns true when no policies', () => {
      expect(isFeatureAllowed(null, 'require_kyc')).toBe(true)
    })

    it('returns true when no commerce policy', () => {
      expect(isFeatureAllowed({}, 'require_kyc')).toBe(true)
    })

    it('returns true when feature not in commerce', () => {
      const policies = { commerce: { max_transaction_amount: 5000 } }
      expect(isFeatureAllowed(policies, 'require_kyc')).toBe(true)
    })

    it('returns false when feature is explicitly false', () => {
      const policies = { commerce: { require_kyc: false } }
      expect(isFeatureAllowed(policies, 'require_kyc')).toBe(false)
    })

    it('returns true when feature is explicitly true', () => {
      const policies = { commerce: { require_kyc: true } }
      expect(isFeatureAllowed(policies, 'require_kyc')).toBe(true)
    })

    it('returns true when feature has non-boolean value', () => {
      const policies = { commerce: { max_transaction_amount: 5000 } }
      expect(isFeatureAllowed(policies, 'max_transaction_amount')).toBe(true)
    })

    it('returns true with undefined policies', () => {
      expect(isFeatureAllowed(undefined, 'require_kyc')).toBe(true)
    })

    it('returns true when feature value is zero', () => {
      const policies = { commerce: { max_items: 0 } }
      expect(isFeatureAllowed(policies, 'max_items')).toBe(true)
    })

    it('returns true when feature value is null', () => {
      const policies = { commerce: { feature_x: null } }
      expect(isFeatureAllowed(policies, 'feature_x')).toBe(true)
    })

    it('returns true when feature value is empty string', () => {
      const policies = { commerce: { label: '' } }
      expect(isFeatureAllowed(policies, 'label')).toBe(true)
    })

    it('handles multiple features in commerce', () => {
      const policies = { commerce: { require_kyc: false, allow_crypto: true, max_items: 100 } }
      expect(isFeatureAllowed(policies, 'require_kyc')).toBe(false)
      expect(isFeatureAllowed(policies, 'allow_crypto')).toBe(true)
      expect(isFeatureAllowed(policies, 'max_items')).toBe(true)
    })
  })

  describe('getCommercePolicy', () => {
    it('returns undefined when no policies', () => {
      expect(getCommercePolicy(null)).toBeUndefined()
    })

    it('returns undefined when no commerce key', () => {
      expect(getCommercePolicy({})).toBeUndefined()
    })

    it('returns commerce policy when present', () => {
      const commerce = { require_kyc: true, max_transaction_amount: 5000 }
      expect(getCommercePolicy({ commerce })).toEqual(commerce)
    })

    it('returns undefined with undefined policies', () => {
      expect(getCommercePolicy(undefined)).toBeUndefined()
    })

    it('returns empty object when commerce is empty', () => {
      expect(getCommercePolicy({ commerce: {} })).toEqual({})
    })

    it('returns commerce with nested objects', () => {
      const commerce = { limits: { daily: 1000, monthly: 10000 } }
      expect(getCommercePolicy({ commerce })).toEqual(commerce)
    })
  })
})
