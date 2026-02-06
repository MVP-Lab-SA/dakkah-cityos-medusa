import type { StoreConfig } from './store-context'

const MAIN_DOMAIN = 'dakkah.com' // Will be configured via env

export interface StoreDetectionResult {
  store: StoreConfig | null
  subdomain: string | null
  isCustomDomain: boolean
}

/**
 * Detects store from hostname
 * 
 * Patterns:
 * - subdomain.dakkah.com -> subdomain store
 * - custom.com -> custom domain store
 * - dakkah.com -> default/main store
 */
export function detectStoreFromHostname(hostname: string): {
  subdomain: string | null
  isCustomDomain: boolean
} {
  // Remove port if present
  const cleanHostname = hostname.split(':')[0]
  
  // Check if it's the main domain
  if (cleanHostname === MAIN_DOMAIN || cleanHostname === `www.${MAIN_DOMAIN}`) {
    return { subdomain: null, isCustomDomain: false }
  }
  
  // Check if it's a subdomain of main domain
  if (cleanHostname.endsWith(`.${MAIN_DOMAIN}`)) {
    const subdomain = cleanHostname.replace(`.${MAIN_DOMAIN}`, '')
    return { subdomain, isCustomDomain: false }
  }
  
  // Otherwise it's a custom domain
  return { subdomain: null, isCustomDomain: true }
}

/**
 * Fetches store configuration from backend
 */
export async function fetchStoreBySubdomain(
  subdomain: string,
  backendUrl: string
): Promise<StoreConfig | null> {
  try {
    const response = await fetch(
      `${backendUrl}/store/stores/by-subdomain/${subdomain}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch store: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.store
  } catch (error) {
    console.error('Error fetching store by subdomain:', error)
    return null
  }
}

/**
 * Fetches store configuration by custom domain
 */
export async function fetchStoreByDomain(
  domain: string,
  backendUrl: string
): Promise<StoreConfig | null> {
  try {
    const response = await fetch(
      `${backendUrl}/store/stores/by-domain/${domain}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch store: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.store
  } catch (error) {
    console.error('Error fetching store by domain:', error)
    return null
  }
}

/**
 * Gets default store (fallback when no subdomain/domain matched)
 */
export async function fetchDefaultStore(
  backendUrl: string
): Promise<StoreConfig | null> {
  try {
    const response = await fetch(`${backendUrl}/store/stores/default`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch default store: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.store
  } catch (error) {
    console.error('Error fetching default store:', error)
    return null
  }
}

/**
 * Main store detection logic
 */
export async function detectAndFetchStore(
  hostname: string,
  backendUrl: string
): Promise<StoreDetectionResult> {
  const { subdomain, isCustomDomain } = detectStoreFromHostname(hostname)
  
  let store: StoreConfig | null = null
  
  if (subdomain) {
    // Fetch by subdomain
    store = await fetchStoreBySubdomain(subdomain, backendUrl)
  } else if (isCustomDomain) {
    // Fetch by custom domain
    store = await fetchStoreByDomain(hostname, backendUrl)
  } else {
    // Fetch default store
    store = await fetchDefaultStore(backendUrl)
  }
  
  return {
    store,
    subdomain,
    isCustomDomain,
  }
}
