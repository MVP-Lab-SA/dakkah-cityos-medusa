import type { CollectionConfig } from 'payload'
import { checkCerbosPermission } from '../lib/cerbos'
import { resolveCityOSContext } from '../lib/cityosContext'
import crypto from 'crypto'

// Helper to hash API keys
function hashApiKey(key: string): string {
  const salt = process.env.API_KEY_HASH_SALT || 'default-salt-change-me'
  return crypto.createHmac('sha256', salt).update(key).digest('hex')
}

// Helper to generate API key
function generateApiKey(prefix: string): { key: string; hash: string } {
  const randomPart = crypto.randomBytes(32).toString('hex')
  const key = `${prefix}_${randomPart}`
  const hash = hashApiKey(key)
  return { key, hash }
}

export const ApiKeys: CollectionConfig = {
  slug: 'api-keys',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'prefix', 'ownerType', 'tenant', 'status', 'expiresAt'],
    group: 'Access Control',
  },
  access: {
    read: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      if (context.auth.roles.includes('super_admin')) {
        return true
      }
      
      // Tenant admins can read their tenant's API keys
      if (context.auth.roles.includes('tenant_admin') && context.tenantId) {
        return {
          tenant: { equals: context.tenantId }
        }
      }
      
      // Users can read their own API keys
      if (context.auth.userId) {
        return {
          ownerType: { equals: 'user' },
          ownerRef: { equals: context.auth.userId }
        }
      }
      
      return false
    },
    create: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      const allowed = await checkCerbosPermission({
        principal: {
          id: context.auth.userId,
          roles: context.auth.roles,
          attr: {
            tenantId: context.tenantId,
          }
        },
        resource: {
          kind: 'api_key',
          id: 'new',
          attr: {}
        },
        action: 'create'
      })
      
      return allowed
    },
    update: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      // Only super admins and tenant admins can update API keys
      return context.auth.roles.includes('super_admin') || context.auth.roles.includes('tenant_admin')
    },
    delete: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      // Super admins, tenant admins, or key owners can delete
      if (context.auth.roles.includes('super_admin') || context.auth.roles.includes('tenant_admin')) {
        return true
      }
      
      if (context.auth.userId) {
        return {
          ownerType: { equals: 'user' },
          ownerRef: { equals: context.auth.userId }
        }
      }
      
      return false
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Generate API key on creation
        if (operation === 'create') {
          const prefix = data.prefix || 'dck' // Dakkah CityOS Key
          const { key, hash } = generateApiKey(prefix)
          
          // Store hash in DB
          data.keyHash = hash
          data.prefix = prefix
          
          // Return the actual key to the user (ONLY on creation)
          // This will be in the response but NOT stored in DB
          // @ts-ignore - we'll add this to response
          data._rawKey = key
        }
        
        return data
      }
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Log to audit
        await req.payload.create({
          collection: 'audit-logs',
          data: {
            actorUserId: req.user?.id,
            actorRoles: req.user?.roles || [],
            action: operation,
            collection: 'api-keys',
            docId: doc.id,
            tenantId: doc.tenant,
            timestamp: new Date().toISOString(),
            ip: req.ip,
            userAgent: req.headers.get('user-agent'),
          }
        })
      }
    ]
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Descriptive name for this API key',
      },
    },
    {
      name: 'keyHash',
      type: 'text',
      required: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Hashed API key (never store raw keys)',
      },
    },
    {
      name: 'prefix',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        description: 'Key prefix for identification',
      },
    },
    {
      name: 'ownerType',
      type: 'select',
      required: true,
      options: [
        { label: 'User', value: 'user' },
        { label: 'Service', value: 'service' },
        { label: 'Integration', value: 'integration' },
      ],
      admin: {
        description: 'Type of entity that owns this key',
      },
    },
    {
      name: 'ownerRef',
      type: 'text',
      required: true,
      admin: {
        description: 'Reference ID of the owner (user ID, service name, etc.)',
      },
    },
    {
      name: 'scopes',
      type: 'array',
      required: true,
      admin: {
        description: 'Permissions granted to this API key',
      },
      fields: [
        {
          name: 'scope',
          type: 'text',
          required: true,
          admin: {
            description: 'Examples: read:*, write:products, integrations:medusa',
          },
        },
      ],
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      index: true,
      admin: {
        description: 'Tenant this key is scoped to (if applicable)',
      },
    },
    {
      name: 'store',
      type: 'relationship',
      relationTo: 'stores',
      admin: {
        description: 'Store this key is scoped to (if applicable)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Revoked', value: 'revoked' },
        { label: 'Expired', value: 'expired' },
      ],
      index: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'Expiration date (optional, leave empty for no expiration)',
      },
    },
    {
      name: 'lastUsedAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Last time this key was used',
      },
    },
    {
      name: 'usageCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of times this key has been used',
      },
    },
    {
      name: 'rateLimit',
      type: 'group',
      fields: [
        {
          name: 'requestsPerHour',
          type: 'number',
          admin: {
            description: 'Max requests per hour (0 = unlimited)',
          },
        },
        {
          name: 'requestsPerDay',
          type: 'number',
          admin: {
            description: 'Max requests per day (0 = unlimited)',
          },
        },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata',
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ value, operation }) => {
            if (operation === 'create' && !value) {
              return new Date().toISOString()
            }
            return value
          }
        ]
      }
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          () => new Date().toISOString()
        ]
      }
    },
  ],
}
