/**
 * CityOS Canonical Context Resolver
 * 
 * Resolves tenant/store context from multiple sources with priority:
 * 1. Signed headers from gateway/BFF
 * 2. Hostname custom domain match
 * 3. Subdomain mapping
 * 4. Slug fallback from path
 * 5. Cookie-based selection (super_admin only)
 */

import { createHmac } from 'crypto'
import type { NextRequest } from 'next/server'

export interface CityOSContext {
  countryId?: string
  scopeType?: 'theme' | 'city'
  scopeId?: string
  categoryId?: string
  subcategoryId?: string
  tenantId?: string
  storeId?: string
  portalType?: 'public' | 'tenant_admin' | 'vendor' | 'b2b' | 'city_partner' | 'operator'
  auth?: {
    userId?: string
    roles?: string[]
    externalUserId?: string
  }
  resolvedBy?: 'signed_headers' | 'custom_domain' | 'subdomain' | 'slug' | 'cookie' | 'none'
}

interface DomainMapping {
  domain: string
  tenantId: string
  storeId?: string
  portalType?: string
}

export class CityOSContextResolver {
  private signatureSecret: string
  
  constructor() {
    this.signatureSecret = process.env.CITYOS_SIGNATURE_SECRET || 'dev-secret-change-in-production'
  }

  /**
   * Verify HMAC signature from gateway/BFF
   */
  private verifySignature(payload: string, signature: string): boolean {
    const expectedSignature = createHmac('sha256', this.signatureSecret)
      .update(payload)
      .digest('hex')
    return signature === expectedSignature
  }

  /**
   * Resolve context from signed headers (highest priority)
   */
  private async resolveFromSignedHeaders(req: NextRequest): Promise<CityOSContext | null> {
    const tenantId = req.headers.get('x-cityos-tenant-id')
    const storeId = req.headers.get('x-cityos-store-id')
    const portalType = req.headers.get('x-cityos-portal-type')
    const signature = req.headers.get('x-cityos-sig')
    const timestamp = req.headers.get('x-cityos-timestamp')

    if (!tenantId || !signature || !timestamp) {
      return null
    }

    // Verify timestamp is recent (within 5 minutes)
    const timestampMs = parseInt(timestamp, 10)
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000
    if (Math.abs(now - timestampMs) > fiveMinutes) {
      console.warn('[CityOS] Signed header timestamp too old or future')
      return null
    }

    // Verify signature
    const payload = `${tenantId}:${storeId || ''}:${portalType || ''}:${timestamp}`
    if (!this.verifySignature(payload, signature)) {
      console.warn('[CityOS] Signed header signature invalid')
      return null
    }

    return {
      tenantId,
      storeId: storeId || undefined,
      portalType: (portalType as any) || undefined,
      resolvedBy: 'signed_headers',
    }
  }

  /**
   * Resolve context from hostname (custom domain or subdomain)
   */
  private async resolveFromHostname(req: NextRequest, payload: any): Promise<CityOSContext | null> {
    const hostname = req.headers.get('host') || ''
    const domain = hostname.split(':')[0] // Remove port

    // Query database for domain mapping
    // For now, using Payload's API
    try {
      // Check custom domains first
      const tenants = await payload.find({
        collection: 'tenants',
        where: {
          customDomains: {
            contains: domain,
          },
          status: { equals: 'active' },
        },
        limit: 1,
      })

      if (tenants.docs.length > 0) {
        const tenant = tenants.docs[0]
        return {
          tenantId: tenant.id as string,
          countryId: tenant.country as string,
          scopeType: tenant.scope?.scopeType,
          scopeId: tenant.scope as string,
          categoryId: tenant.category as string,
          subcategoryId: tenant.subcategory as string,
          resolvedBy: 'custom_domain',
        }
      }

      // Check subdomains
      const subdomain = domain.split('.')[0]
      if (subdomain && subdomain !== domain) {
        const tenantsWithSubdomain = await payload.find({
          collection: 'tenants',
          where: {
            subdomains: {
              contains: subdomain,
            },
            status: { equals: 'active' },
          },
          limit: 1,
        })

        if (tenantsWithSubdomain.docs.length > 0) {
          const tenant = tenantsWithSubdomain.docs[0]
          return {
            tenantId: tenant.id as string,
            countryId: tenant.country as string,
            scopeType: tenant.scope?.scopeType,
            scopeId: tenant.scope as string,
            categoryId: tenant.category as string,
            subcategoryId: tenant.subcategory as string,
            resolvedBy: 'subdomain',
          }
        }
      }
    } catch (error) {
      console.error('[CityOS] Error resolving from hostname:', error)
    }

    return null
  }

  /**
   * Resolve context from cookie (super_admin only)
   */
  private async resolveFromCookie(req: NextRequest, userRoles?: string[]): Promise<CityOSContext | null> {
    // Only allow cookie-based selection for super_admin
    if (!userRoles?.includes('super_admin')) {
      return null
    }

    const tenantCookie = req.cookies.get('cityos-selected-tenant')
    const storeCookie = req.cookies.get('cityos-selected-store')

    if (tenantCookie?.value) {
      return {
        tenantId: tenantCookie.value,
        storeId: storeCookie?.value || undefined,
        resolvedBy: 'cookie',
      }
    }

    return null
  }

  /**
   * Main resolution method
   */
  async resolveCityOSContext(
    req: NextRequest,
    payload: any,
    auth?: { userId?: string; roles?: string[]; externalUserId?: string }
  ): Promise<CityOSContext> {
    // Try signed headers first (highest trust)
    const signedContext = await this.resolveFromSignedHeaders(req)
    if (signedContext) {
      return { ...signedContext, auth }
    }

    // Try hostname resolution
    const hostnameContext = await this.resolveFromHostname(req, payload)
    if (hostnameContext) {
      return { ...hostnameContext, auth }
    }

    // Try cookie (super_admin only)
    const cookieContext = await this.resolveFromCookie(req, auth?.roles)
    if (cookieContext) {
      return { ...cookieContext, auth }
    }

    // No context resolved
    return {
      resolvedBy: 'none',
      auth,
    }
  }
}

// Singleton instance
let resolver: CityOSContextResolver | null = null

export function getCityOSContextResolver(): CityOSContextResolver {
  if (!resolver) {
    resolver = new CityOSContextResolver()
  }
  return resolver
}

export async function resolveCityOSContext(
  req: NextRequest,
  payload: any,
  auth?: { userId?: string; roles?: string[]; externalUserId?: string }
): Promise<CityOSContext> {
  const resolver = getCityOSContextResolver()
  return resolver.resolveCityOSContext(req, payload, auth)
}
