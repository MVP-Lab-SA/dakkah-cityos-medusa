/**
 * Cerbos Policy Decision Point (PDP) Client
 * 
 * Handles authorization decisions using Cerbos ABAC/PBAC
 */

export interface CerbosPrincipal {
  id: string
  roles: string[]
  attr: Record<string, any>
}

export interface CerbosResource {
  kind: string
  id: string
  attr: Record<string, any>
}

export interface CerbosCheckRequest {
  principal: CerbosPrincipal
  resource: CerbosResource
  actions: string[]
}

export interface CerbosCheckResponse {
  requestId: string
  results: Array<{
    resource: CerbosResource
    actions: Record<string, 'EFFECT_ALLOW' | 'EFFECT_DENY'>
  }>
}

export class CerbosClient {
  private pdpUrl: string
  private apiKey?: string
  private timeout: number
  private fallbackMode: 'deny' | 'allow_super_admin_read'

  constructor() {
    this.pdpUrl = process.env.CERBOS_PDP_URL || 'http://localhost:3592'
    this.apiKey = process.env.CERBOS_PDP_API_KEY
    this.timeout = parseInt(process.env.CERBOS_REQUEST_TIMEOUT_MS || '5000', 10)
    this.fallbackMode = 'allow_super_admin_read'
  }

  /**
   * Check if action is allowed
   */
  async checkAction(
    principal: CerbosPrincipal,
    resource: CerbosResource,
    action: string
  ): Promise<boolean> {
    try {
      const response = await this.checkActions(principal, resource, [action])
      return response[action] === 'EFFECT_ALLOW'
    } catch (error) {
      console.error('[Cerbos] Check action error:', error)
      return this.fallbackDecision(principal, action)
    }
  }

  /**
   * Check multiple actions
   */
  async checkActions(
    principal: CerbosPrincipal,
    resource: CerbosResource,
    actions: string[]
  ): Promise<Record<string, 'EFFECT_ALLOW' | 'EFFECT_DENY'>> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(`${this.pdpUrl}/api/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({
          requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          principal,
          resource,
          actions,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Cerbos PDP returned ${response.status}`)
      }

      const data: CerbosCheckResponse = await response.json()
      
      if (!data.results || data.results.length === 0) {
        throw new Error('No results from Cerbos PDP')
      }

      return data.results[0].actions
    } catch (error) {
      console.error('[Cerbos] Check actions error:', error)
      
      // Fallback decisions
      const result: Record<string, 'EFFECT_ALLOW' | 'EFFECT_DENY'> = {}
      for (const action of actions) {
        result[action] = this.fallbackDecision(principal, action) ? 'EFFECT_ALLOW' : 'EFFECT_DENY'
      }
      return result
    }
  }

  /**
   * Fallback decision when Cerbos is unavailable
   */
  private fallbackDecision(principal: CerbosPrincipal, action: string): boolean {
    if (this.fallbackMode === 'deny') {
      return false
    }

    // Allow super_admin read-only operations
    if (principal.roles.includes('super_admin')) {
      const readActions = ['read', 'view', 'list', 'get']
      return readActions.some(a => action.includes(a))
    }

    return false
  }

  /**
   * Build principal from CityOS context
   */
  buildPrincipal(
    userId: string,
    roles: string[],
    context: {
      countryId?: string
      scopeType?: string
      scopeId?: string
      categoryId?: string
      subcategoryId?: string
      tenantId?: string
      storeId?: string
      portalType?: string
    }
  ): CerbosPrincipal {
    return {
      id: userId,
      roles,
      attr: {
        country_id: context.countryId,
        scope_type: context.scopeType,
        scope_id: context.scopeId,
        category_id: context.categoryId,
        subcategory_id: context.subcategoryId,
        tenant_id: context.tenantId,
        store_id: context.storeId,
        portal_type: context.portalType,
      },
    }
  }

  /**
   * Build resource from document
   */
  buildResource(
    collection: string,
    docId: string,
    doc: any
  ): CerbosResource {
    return {
      kind: collection,
      id: docId,
      attr: {
        tenant_id: doc.tenant?.id || doc.tenant,
        store_id: doc.store?.id || doc.store,
        created_by: doc.createdBy?.id || doc.createdBy,
        status: doc.status,
        ...doc.metadata,
      },
    }
  }
}

// Singleton instance
let cerbosClient: CerbosClient | null = null

export function getCerbosClient(): CerbosClient {
  if (!cerbosClient) {
    cerbosClient = new CerbosClient()
  }
  return cerbosClient
}
