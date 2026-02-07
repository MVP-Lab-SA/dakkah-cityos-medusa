/**
 * Centralized environment configuration
 * All environment-dependent values should be accessed through these functions
 */

/**
 * Get the backend URL for API requests
 * Uses VITE_BACKEND_URL environment variable with fallback
 */
export function getBackendUrl(): string {
  return import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000"
}

/**
 * Get the storefront URL
 * Uses VITE_STOREFRONT_URL environment variable with fallback
 */
export function getStorefrontUrl(): string {
  return import.meta.env.VITE_STOREFRONT_URL || "http://localhost:3000"
}

/**
 * Get Stripe publishable key
 */
export function getStripePublishableKey(): string | undefined {
  return import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  return !!getStripePublishableKey()
}

/**
 * Get the default country code
 */
export function getDefaultCountryCode(): string {
  return import.meta.env.VITE_DEFAULT_COUNTRY || "us"
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return import.meta.env.PROD
}
