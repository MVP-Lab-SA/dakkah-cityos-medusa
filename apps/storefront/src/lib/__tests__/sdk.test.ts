import { describe, it, expect, vi } from 'vitest'
import { detectStoreFromHostname } from '@/lib/store-detector'

vi.mock('@medusajs/js-sdk', () => {
  return {
    default: class MockMedusa {
      baseUrl: string
      debug: boolean
      publishableKey: string | undefined
      auth: { type: string }
      constructor(config: any) {
        this.baseUrl = config.baseUrl
        this.debug = config.debug
        this.publishableKey = config.publishableKey
        this.auth = config.auth
      }
    }
  }
})

describe('SDK Configuration', () => {
  it('exports sdk instance', async () => {
    const { sdk } = await import('@/lib/utils/sdk')
    expect(sdk).toBeDefined()
  })

  it('sdk has auth configured as jwt', async () => {
    const { sdk } = await import('@/lib/utils/sdk')
    expect((sdk as any).auth).toEqual({ type: 'jwt' })
  })

  it('sdk has debug set to false', async () => {
    const { sdk } = await import('@/lib/utils/sdk')
    expect((sdk as any).debug).toBe(false)
  })

  it('sdk sets baseUrl to empty string in browser environment', async () => {
    const { sdk } = await import('@/lib/utils/sdk')
    expect((sdk as any).baseUrl).toBe('')
  })
})

describe('Store Detector', () => {
  it('detects main domain', () => {
    const result = detectStoreFromHostname('dakkah.com')
    expect(result.subdomain).toBeNull()
    expect(result.isCustomDomain).toBe(false)
  })

  it('detects www main domain', () => {
    const result = detectStoreFromHostname('www.dakkah.com')
    expect(result.subdomain).toBeNull()
    expect(result.isCustomDomain).toBe(false)
  })

  it('detects subdomain', () => {
    const result = detectStoreFromHostname('mystore.dakkah.com')
    expect(result.subdomain).toBe('mystore')
    expect(result.isCustomDomain).toBe(false)
  })

  it('detects custom domain', () => {
    const result = detectStoreFromHostname('customstore.com')
    expect(result.subdomain).toBeNull()
    expect(result.isCustomDomain).toBe(true)
  })

  it('strips port from hostname', () => {
    const result = detectStoreFromHostname('mystore.dakkah.com:3000')
    expect(result.subdomain).toBe('mystore')
    expect(result.isCustomDomain).toBe(false)
  })

  it('handles localhost as custom domain', () => {
    const result = detectStoreFromHostname('localhost')
    expect(result.subdomain).toBeNull()
    expect(result.isCustomDomain).toBe(true)
  })
})
