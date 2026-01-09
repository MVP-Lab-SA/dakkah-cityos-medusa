import type { CollectionConfig } from 'payload'
import { checkCerbosPermission } from '../lib/cerbos'
import { resolveCityOSContext } from '../lib/cityosContext'

export const Stores: CollectionConfig = {
  slug: 'stores',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'handle', 'tenant', 'storefrontType', 'status'],
    group: 'Tenancy',
  },
  access: {
    read: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      // Super admins can read all
      if (context.auth.roles.includes('super_admin')) {
        return true
      }
      
      // Tenant admins can read their tenant's stores
      if (context.auth.roles.includes('tenant_admin') && context.tenantId) {
        return {
          tenant: { equals: context.tenantId }
        }
      }
      
      // Store managers can read their specific store
      if (context.auth.roles.includes('store_manager') && context.storeId) {
        return {
          id: { equals: context.storeId }
        }
      }
      
      return false
    },
    create: async ({ req, data }) => {
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
          kind: 'store',
          id: 'new',
          attr: {
            tenantId: data?.tenant,
          }
        },
        action: 'create'
      })
      
      return allowed
    },
    update: async ({ req, id }) => {
      const context = await resolveCityOSContext(req)
      
      const allowed = await checkCerbosPermission({
        principal: {
          id: context.auth.userId,
          roles: context.auth.roles,
          attr: {
            tenantId: context.tenantId,
            storeId: context.storeId,
          }
        },
        resource: {
          kind: 'store',
          id: id as string,
          attr: {}
        },
        action: 'update'
      })
      
      if (!allowed) return false
      
      // Super admins and tenant admins can update any store in their scope
      if (context.auth.roles.includes('super_admin')) {
        return true
      }
      
      if (context.auth.roles.includes('tenant_admin') && context.tenantId) {
        return {
          tenant: { equals: context.tenantId }
        }
      }
      
      // Store managers can only update their store
      if (context.auth.roles.includes('store_manager') && context.storeId) {
        return {
          id: { equals: context.storeId }
        }
      }
      
      return false
    },
    delete: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      // Only super admins and tenant admins can delete stores
      if (context.auth.roles.includes('super_admin')) {
        return true
      }
      
      if (context.auth.roles.includes('tenant_admin') && context.tenantId) {
        return {
          tenant: { equals: context.tenantId }
        }
      }
      
      return false
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req, originalDoc }) => {
        // Auto-set tenant from context if creating
        if (operation === 'create' && !data.tenant) {
          const context = await resolveCityOSContext(req)
          if (context.tenantId) {
            data.tenant = context.tenantId
          }
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
            collection: 'stores',
            docId: doc.id,
            tenantId: doc.tenant,
            storeId: doc.id,
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
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
      admin: {
        description: 'Parent tenant for this store',
      },
    },
    {
      name: 'handle',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Unique URL-friendly identifier (scoped to tenant)',
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
        description: 'Display name for this store/brand',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Maintenance', value: 'maintenance' },
      ],
      index: true,
    },
    {
      name: 'storefrontType',
      type: 'select',
      required: true,
      defaultValue: 'retail',
      options: [
        { label: 'Retail', value: 'retail' },
        { label: 'Services', value: 'services' },
        { label: 'Digital Goods', value: 'digital' },
        { label: 'Marketplace', value: 'marketplace' },
        { label: 'B2B', value: 'b2b' },
        { label: 'Subscription', value: 'subscription' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
      admin: {
        description: 'Type of storefront/business model',
      },
    },
    // Domain Configuration
    {
      name: 'subdomains',
      type: 'array',
      admin: {
        description: 'Subdomain mappings for this store',
      },
      fields: [
        {
          name: 'subdomain',
          type: 'text',
          required: true,
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
        description: 'Custom domain mappings for this store',
      },
      fields: [
        {
          name: 'domain',
          type: 'text',
          required: true,
        },
        {
          name: 'verified',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'isPrimary',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'storefrontUrl',
      type: 'text',
      admin: {
        description: 'Primary storefront URL',
      },
    },
    // Theme Configuration
    {
      name: 'themeConfig',
      type: 'json',
      admin: {
        description: 'Theme and branding configuration (JSON)',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Store logo',
      },
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Store favicon',
      },
    },
    // SEO
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Default SEO title',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Default SEO description',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Default Open Graph image',
          },
        },
      ],
    },
    // Integration References
    {
      name: 'medusaStoreId',
      type: 'text',
      index: true,
      admin: {
        description: 'Reference to store ID in Medusa',
      },
    },
    {
      name: 'medusaSalesChannelId',
      type: 'text',
      index: true,
      admin: {
        description: 'Medusa sales channel ID for this store',
      },
    },
    {
      name: 'medusaRegionIds',
      type: 'array',
      admin: {
        description: 'Medusa region IDs this store serves',
      },
      fields: [
        {
          name: 'regionId',
          type: 'text',
          required: true,
        },
      ],
    },
    // CMS Integration
    {
      name: 'cmsSiteId',
      type: 'text',
      admin: {
        description: 'External CMS site identifier (if using separate CMS)',
      },
    },
    // Metadata
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional store metadata (JSON)',
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
