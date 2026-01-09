import type { CollectionConfig } from 'payload'
import { checkCerbosPermission } from '../lib/cerbos'
import { resolveCityOSContext } from '../lib/cityosContext'

export const Portals: CollectionConfig = {
  slug: 'portals',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'portalType', 'tenant', 'store', 'basePath'],
    group: 'Tenancy',
  },
  access: {
    read: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
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
    create: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      return context.auth.roles.includes('super_admin') || context.auth.roles.includes('tenant_admin')
    },
    update: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      return context.auth.roles.includes('super_admin') || context.auth.roles.includes('tenant_admin')
    },
    delete: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      return context.auth.roles.includes('super_admin') || context.auth.roles.includes('tenant_admin')
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name for this portal',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
      admin: {
        description: 'Tenant this portal belongs to',
      },
    },
    {
      name: 'store',
      type: 'relationship',
      relationTo: 'stores',
      index: true,
      admin: {
        description: 'Store this portal is for (optional, some portals are tenant-wide)',
      },
    },
    {
      name: 'portalType',
      type: 'select',
      required: true,
      options: [
        { label: 'Public Storefront', value: 'public' },
        { label: 'Tenant Admin', value: 'tenant_admin' },
        { label: 'Vendor Portal', value: 'vendor' },
        { label: 'B2B Portal', value: 'b2b' },
        { label: 'City Partner Portal', value: 'city_partner' },
        { label: 'Operator Dashboard', value: 'operator' },
      ],
      index: true,
      admin: {
        description: 'Type of portal (determines access rules and features)',
      },
    },
    {
      name: 'basePath',
      type: 'text',
      required: true,
      defaultValue: '/',
      admin: {
        description: 'Base URL path for this portal (e.g., /, /vendor, /b2b)',
      },
      validate: (val) => {
        if (!val.startsWith('/')) {
          return 'Base path must start with /'
        }
        return true
      }
    },
    {
      name: 'allowedRoles',
      type: 'array',
      required: true,
      admin: {
        description: 'Roles that can access this portal',
      },
      fields: [
        {
          name: 'role',
          type: 'select',
          required: true,
          options: [
            { label: 'Public (Anyone)', value: 'public' },
            { label: 'Super Admin', value: 'super_admin' },
            { label: 'Tenant Admin', value: 'tenant_admin' },
            { label: 'Store Manager', value: 'store_manager' },
            { label: 'Vendor Owner', value: 'vendor_owner' },
            { label: 'Vendor Staff', value: 'vendor_staff' },
            { label: 'B2B Company Admin', value: 'b2b_company_admin' },
            { label: 'B2B Buyer', value: 'b2b_buyer' },
            { label: 'B2B Approver', value: 'b2b_approver' },
            { label: 'City Partner Admin', value: 'city_partner_admin' },
          ],
        },
      ],
    },
    {
      name: 'config',
      type: 'group',
      fields: [
        {
          name: 'enabledFeatures',
          type: 'array',
          admin: {
            description: 'Features enabled for this portal',
          },
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'theme',
          type: 'json',
          admin: {
            description: 'Portal-specific theme overrides',
          },
        },
        {
          name: 'customization',
          type: 'json',
          admin: {
            description: 'Portal customization settings',
          },
        },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional portal metadata',
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
