import type { CollectionConfig } from 'payload'
import { checkCerbosPermission } from '../lib/cerbos'
import { resolveCityOSContext } from '../lib/cityosContext'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'handle', 'status', 'country', 'subscriptionTier'],
    group: 'Tenancy',
  },
  access: {
    read: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      // Super admins can read all
      if (context.auth.roles.includes('super_admin')) {
        return true
      }
      
      // Tenant admins can only read their own tenant
      if (context.auth.roles.includes('tenant_admin') && context.tenantId) {
        return {
          id: { equals: context.tenantId }
        }
      }
      
      return false
    },
    create: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      // Check Cerbos permission
      const allowed = await checkCerbosPermission({
        principal: {
          id: context.auth.userId,
          roles: context.auth.roles,
          attr: {
            countryId: context.countryId,
            scopeType: context.scopeType,
            scopeId: context.scopeId,
          }
        },
        resource: {
          kind: 'tenant',
          id: 'new',
          attr: {}
        },
        action: 'create'
      })
      
      return allowed && context.auth.roles.includes('super_admin')
    },
    update: async ({ req, id }) => {
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
          kind: 'tenant',
          id: id as string,
          attr: {}
        },
        action: 'update'
      })
      
      // Super admins can update any tenant
      if (allowed && context.auth.roles.includes('super_admin')) {
        return true
      }
      
      // Tenant admins can only update their own
      if (allowed && context.auth.roles.includes('tenant_admin') && context.tenantId) {
        return {
          id: { equals: context.tenantId }
        }
      }
      
      return false
    },
    delete: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      // Only super admins can delete tenants
      return context.auth.roles.includes('super_admin')
    },
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Log to audit
        await req.payload.create({
          collection: 'audit-logs',
          data: {
            actorUserId: req.user?.id,
            actorRoles: req.user?.roles || [],
            action: operation,
            collection: 'tenants',
            docId: doc.id,
            tenantId: doc.id,
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
      name: 'handle',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Unique URL-friendly identifier for this tenant',
      },
      validate: (val) => {
        if (!/^[a-z0-9-]+$/.test(val)) {
          return 'Handle must contain only lowercase letters, numbers, and hyphens'
        }
        return true
      }
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name for this tenant',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'trial',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Trial', value: 'trial' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Inactive', value: 'inactive' },
      ],
      index: true,
    },
    {
      name: 'subscriptionTier',
      type: 'select',
      required: true,
      defaultValue: 'basic',
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'Pro', value: 'pro' },
        { label: 'Enterprise', value: 'enterprise' },
        { label: 'Custom', value: 'custom' },
      ],
      admin: {
        description: 'Subscription tier for billing and feature access',
      },
    },
    {
      name: 'billingEmail',
      type: 'email',
      required: true,
      admin: {
        description: 'Primary billing contact email',
      },
    },
    // CityOS Hierarchy
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      index: true,
      admin: {
        description: 'Country this tenant operates in',
      },
    },
    {
      name: 'scope',
      type: 'relationship',
      relationTo: 'scopes',
      index: true,
      admin: {
        description: 'Scope (theme or city) this tenant belongs to',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      index: true,
      admin: {
        description: 'Business category',
      },
    },
    {
      name: 'subcategory',
      type: 'relationship',
      relationTo: 'subcategories',
      index: true,
      admin: {
        description: 'Business subcategory',
      },
    },
    // Domain Configuration
    {
      name: 'subdomains',
      type: 'array',
      admin: {
        description: 'Subdomain mappings (e.g., acme.dakkah.com)',
      },
      fields: [
        {
          name: 'subdomain',
          type: 'text',
          required: true,
          validate: (val) => {
            if (!/^[a-z0-9-]+$/.test(val)) {
              return 'Subdomain must contain only lowercase letters, numbers, and hyphens'
            }
            return true
          }
        },
        {
          name: 'isPrimary',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'customDomains',
      type: 'array',
      admin: {
        description: 'Custom domain mappings (e.g., shop.acmecorp.com)',
      },
      fields: [
        {
          name: 'domain',
          type: 'text',
          required: true,
          validate: (val) => {
            // Basic domain validation
            if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(val)) {
              return 'Invalid domain format'
            }
            return true
          }
        },
        {
          name: 'verified',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Domain ownership verified via DNS',
          },
        },
        {
          name: 'isPrimary',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    // Integration References
    {
      name: 'medusaTenantId',
      type: 'text',
      index: true,
      admin: {
        description: 'Reference to tenant ID in Medusa commerce engine',
      },
    },
    {
      name: 'keycloakRealmId',
      type: 'text',
      admin: {
        description: 'Keycloak realm ID for this tenant (if using per-tenant realms)',
      },
    },
    // Trial Management
    {
      name: 'trialEndsAt',
      type: 'date',
      admin: {
        description: 'Trial expiration date',
        condition: (data) => data.status === 'trial',
      },
    },
    // Metadata
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional tenant metadata (JSON)',
      },
    },
    // Timestamps
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
