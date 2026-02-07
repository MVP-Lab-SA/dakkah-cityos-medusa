export const isObject = (input: unknown) => input instanceof Object

export const isArray = (input: unknown) => Array.isArray(input)

export const isEmpty = (input: unknown) => {
  return (
    input === null ||
    input === undefined ||
    (isObject(input) && Object.keys(input as object).length === 0) ||
    (isArray(input) && (input as unknown[]).length === 0) ||
    (typeof input === "string" && input.trim().length === 0)
  )
}

// Form validation utilities
export const validators = {
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) return "Email is required"
    if (!emailRegex.test(value)) return "Invalid email address"
    return null
  },
  
  phone: (value: string) => {
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/
    if (!value) return null // Optional
    if (!phoneRegex.test(value)) return "Invalid phone number"
    return null
  },
  
  taxId: (value: string, country: string) => {
    if (!value) return "Tax ID is required"
    
    // US EIN format: XX-XXXXXXX
    if (country === "us") {
      const einRegex = /^\d{2}-\d{7}$/
      if (!einRegex.test(value)) return "Invalid EIN format (XX-XXXXXXX)"
    }
    
    return null
  },
  
  postalCode: (value: string, country: string) => {
    if (!value) return "Postal code is required"
    
    const formats: Record<string, RegExp> = {
      us: /^\d{5}(-\d{4})?$/,
      ca: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
      uk: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
      de: /^\d{5}$/,
    }
    
    const regex = formats[country.toLowerCase()]
    if (regex && !regex.test(value)) {
      return `Invalid postal code for ${country.toUpperCase()}`
    }
    
    return null
  },
  
  required: (value: unknown, fieldName: string) => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return `${fieldName} is required`
    }
    return null
  },
  
  minLength: (value: string, min: number, fieldName: string) => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters`
    }
    return null
  },
  
  maxLength: (value: string, max: number, fieldName: string) => {
    if (value && value.length > max) {
      return `${fieldName} must be no more than ${max} characters`
    }
    return null
  },
  
  positiveNumber: (value: number, fieldName: string) => {
    if (value === undefined || value === null) return `${fieldName} is required`
    if (isNaN(value) || value < 0) return `${fieldName} must be a positive number`
    return null
  },
  
  minValue: (value: number, min: number, fieldName: string) => {
    if (value < min) return `${fieldName} must be at least ${min}`
    return null
  }
}

export function validateForm<T extends Record<string, unknown>>(
  data: T,
  rules: Partial<Record<keyof T, (value: unknown) => string | null>>
): Record<string, string> {
  const errors: Record<string, string> = {}
  
  for (const [field, validator] of Object.entries(rules)) {
    if (validator) {
      const error = validator(data[field])
      if (error) {
        errors[field] = error
      }
    }
  }
  
  return errors
}

export function hasErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0
}
