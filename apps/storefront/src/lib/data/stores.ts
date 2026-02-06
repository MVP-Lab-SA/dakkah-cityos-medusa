import { sdk } from "../config"
import type { StoreConfig } from "../store-context"

/**
 * Fetch store by subdomain
 */
export async function getStoreBySubdomain(subdomain: string): Promise<StoreConfig | null> {
  try {
    const response = await sdk.client.fetch<{ store: StoreConfig }>(
      `/store/stores/by-subdomain/${subdomain}`,
      {
        method: 'GET',
      }
    )
    return response.store
  } catch (error) {
    console.error('Error fetching store by subdomain:', error)
    return null
  }
}

/**
 * Fetch store by custom domain
 */
export async function getStoreByDomain(domain: string): Promise<StoreConfig | null> {
  try {
    const response = await sdk.client.fetch<{ store: StoreConfig }>(
      `/store/stores/by-domain/${domain}`,
      {
        method: 'GET',
      }
    )
    return response.store
  } catch (error) {
    console.error('Error fetching store by domain:', error)
    return null
  }
}

/**
 * Fetch default store
 */
export async function getDefaultStore(): Promise<StoreConfig | null> {
  try {
    const response = await sdk.client.fetch<{ store: StoreConfig }>(
      `/store/stores/default`,
      {
        method: 'GET',
      }
    )
    return response.store
  } catch (error) {
    console.error('Error fetching default store:', error)
    return null
  }
}

/**
 * List all active stores (for store selector UI)
 */
export async function listActiveStores(): Promise<StoreConfig[]> {
  try {
    const response = await sdk.client.fetch<{ stores: StoreConfig[] }>(
      `/store/stores`,
      {
        method: 'GET',
      }
    )
    return response.stores
  } catch (error) {
    console.error('Error listing stores:', error)
    return []
  }
}
