import { describe, it, expect } from 'vitest'
import { validators, validateForm, hasErrors, isEmpty, isObject, isArray } from '@/lib/utils/validation'

describe('Validation Helpers', () => {
  describe('email validation', () => {
    it('accepts valid email addresses', () => {
      expect(validators.email('user@example.com')).toBeNull()
      expect(validators.email('name+tag@domain.co')).toBeNull()
    })

    it('rejects empty email', () => {
      expect(validators.email('')).toBe('Email is required')
    })

    it('rejects invalid email format', () => {
      expect(validators.email('not-an-email')).toBe('Invalid email address')
      expect(validators.email('missing@')).toBe('Invalid email address')
      expect(validators.email('@domain.com')).toBe('Invalid email address')
    })
  })

  describe('phone validation', () => {
    it('accepts valid phone numbers', () => {
      expect(validators.phone('+1 234 567 8900')).toBeNull()
      expect(validators.phone('(555) 123-4567')).toBeNull()
    })

    it('allows empty phone (optional)', () => {
      expect(validators.phone('')).toBeNull()
    })

    it('rejects too-short phone numbers', () => {
      expect(validators.phone('123')).toBe('Invalid phone number')
    })
  })

  describe('required fields', () => {
    it('passes for non-empty values', () => {
      expect(validators.required('hello', 'Name')).toBeNull()
      expect(validators.required(42, 'Age')).toBeNull()
    })

    it('fails for empty string', () => {
      expect(validators.required('', 'Name')).toBe('Name is required')
    })

    it('fails for null/undefined', () => {
      expect(validators.required(null, 'Field')).toBe('Field is required')
      expect(validators.required(undefined, 'Field')).toBe('Field is required')
    })

    it('fails for whitespace-only string', () => {
      expect(validators.required('   ', 'Name')).toBe('Name is required')
    })
  })

  describe('minLength / maxLength', () => {
    it('validates minimum length', () => {
      expect(validators.minLength('ab', 3, 'Password')).toBe('Password must be at least 3 characters')
      expect(validators.minLength('abc', 3, 'Password')).toBeNull()
    })

    it('validates maximum length', () => {
      expect(validators.maxLength('abcdef', 5, 'Code')).toBe('Code must be no more than 5 characters')
      expect(validators.maxLength('abc', 5, 'Code')).toBeNull()
    })
  })

  describe('positiveNumber', () => {
    it('accepts positive numbers', () => {
      expect(validators.positiveNumber(1, 'Price')).toBeNull()
      expect(validators.positiveNumber(0, 'Price')).toBeNull()
    })

    it('rejects negative numbers', () => {
      expect(validators.positiveNumber(-5, 'Price')).toBe('Price must be a positive number')
    })

    it('rejects undefined', () => {
      expect(validators.positiveNumber(undefined as any, 'Price')).toBe('Price is required')
    })
  })

  describe('validateForm', () => {
    it('returns empty object when all fields valid', () => {
      const errors = validateForm(
        { email: 'a@b.com', name: 'John' },
        {
          email: (v) => validators.email(v as string),
          name: (v) => validators.required(v, 'Name'),
        }
      )
      expect(errors).toEqual({})
    })

    it('returns errors for invalid fields', () => {
      const errors = validateForm(
        { email: 'bad', name: '' },
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
    it('returns false for no errors', () => {
      expect(hasErrors({})).toBe(false)
    })

    it('returns true when errors present', () => {
      expect(hasErrors({ email: 'Required' })).toBe(true)
    })
  })
})
