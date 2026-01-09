/**
 * Keycloak JWT Authentication Helper
 * 
 * Verifies JWTs from Keycloak OIDC provider
 * Maps JWT roles to internal CityOS roles
 */

import { jwtVerify, createRemoteJWKSet, type JWTPayload } from 'jose'

export interface KeycloakUser {
  sub: string // external user ID
  email?: string
  preferred_username?: string
  name?: string
  given_name?: string
  family_name?: string
  realm_access?: {
    roles: string[]
  }
  resource_access?: Record<string, { roles: string[] }>
}

export interface CityOSAuthContext {
  userId?: string // internal Payload user ID (resolved separately)
  externalUserId: string // Keycloak sub
  email?: string
  name?: string
  roles: string[]
}

export class KeycloakAuthHelper {
  private jwksUrl: string
  private issuer: string
  private audience?: string
  private clockTolerance: number
  private jwks: ReturnType<typeof createRemoteJWKSet>

  constructor() {
    this.issuer = process.env.KEYCLOAK_ISSUER_URL || ''
    this.jwksUrl = process.env.KEYCLOAK_JWKS_URL || `${this.issuer}/protocol/openid-connect/certs`
    this.audience = process.env.KEYCLOAK_AUDIENCE
    this.clockTolerance = parseInt(process.env.AUTH_JWT_CLOCK_TOLERANCE_SECONDS || '30', 10)
    
    if (!this.issuer) {
      throw new Error('KEYCLOAK_ISSUER_URL environment variable is required')
    }

    this.jwks = createRemoteJWKSet(new URL(this.jwksUrl))
  }

  /**
   * Verify JWT token from Authorization header
   */
  async verifyToken(token: string): Promise<KeycloakUser> {
    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
        audience: this.audience,
        clockTolerance: this.clockTolerance,
      })

      return payload as unknown as KeycloakUser
    } catch (error) {
      throw new Error(`JWT verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Extract and verify JWT from Authorization header
   */
  async extractAndVerifyToken(authHeader?: string | null): Promise<KeycloakUser | null> {
    if (!authHeader) return null

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null
    }

    try {
      return await this.verifyToken(parts[1])
    } catch (error) {
      console.error('[Keycloak] Token verification failed:', error)
      return null
    }
  }

  /**
   * Map Keycloak roles to CityOS internal roles
   */
  mapRolesToCityOS(keycloakUser: KeycloakUser): string[] {
    const roles: string[] = []

    // Extract realm roles
    if (keycloakUser.realm_access?.roles) {
      roles.push(...keycloakUser.realm_access.roles)
    }

    // Extract client roles (if using specific client)
    const clientId = process.env.KEYCLOAK_CLIENT_ID || 'dakkah-cityos'
    if (keycloakUser.resource_access?.[clientId]?.roles) {
      roles.push(...keycloakUser.resource_access[clientId].roles)
    }

    // Map to CityOS roles
    const cityosRoles = new Set<string>()

    // Direct role mappings
    const roleMap: Record<string, string> = {
      'super-admin': 'super_admin',
      'tenant-admin': 'tenant_admin',
      'store-manager': 'store_manager',
      'vendor-owner': 'vendor_owner',
      'vendor-staff': 'vendor_staff',
      'b2b-company-admin': 'b2b_company_admin',
      'b2b-buyer': 'b2b_buyer',
      'b2b-approver': 'b2b_approver',
      'city-partner-admin': 'city_partner_admin',
    }

    for (const role of roles) {
      const mapped = roleMap[role] || role
      cityosRoles.add(mapped)
    }

    return Array.from(cityosRoles)
  }

  /**
   * Build CityOS auth context from Keycloak JWT
   */
  async buildAuthContext(keycloakUser: KeycloakUser, payload: any): Promise<CityOSAuthContext> {
    const roles = this.mapRolesToCityOS(keycloakUser)

    // Try to find matching Payload user by externalUserId
    let userId: string | undefined
    try {
      const users = await payload.find({
        collection: 'users',
        where: {
          externalUserId: {
            equals: keycloakUser.sub,
          },
        },
        limit: 1,
      })

      if (users.docs.length > 0) {
        userId = users.docs[0].id as string
      }
    } catch (error) {
      console.error('[Keycloak] Error finding user:', error)
    }

    return {
      userId,
      externalUserId: keycloakUser.sub,
      email: keycloakUser.email,
      name: keycloakUser.name || keycloakUser.preferred_username,
      roles,
    }
  }
}

// Singleton instance
let authHelper: KeycloakAuthHelper | null = null

export function getKeycloakAuthHelper(): KeycloakAuthHelper {
  if (!authHelper) {
    authHelper = new KeycloakAuthHelper()
  }
  return authHelper
}
