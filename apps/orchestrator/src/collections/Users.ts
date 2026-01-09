import type { CollectionConfig } from 'payload'
import { checkCerbosPermission } from '../lib/cerbos'
import { resolveCityOSContext } from '../lib/cityosContext'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Disable Payload's built-in auth since we're using Keycloak
    disableLocalStrategy: true,
    // Custom JWT verification
    verify: async ({ payload, token }) => {
      // This will be called to verify JWT from Keycloak
      // Implemented in lib/keycloak.ts
      return null // Handled by middleware
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'globalRoles', 'lastLoginAt'],
    group: 'Access Control',
  },
  access: {
    read: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      // Super admins can read all users
      if (context.auth.roles.includes('super_admin')) {
        return true
      }
      
      // Tenant admins can read users in their tenant
      if (context.auth.roles.includes('tenant_admin') && context.tenantId) {
        return {
          'tenantMemberships.tenant': { equals: context.tenantId }
        }
      }
      
      // Users can read their own profile
      if (context.auth.userId) {
        return {
          id: { equals: context.auth.userId }
        }
      }
      
      return false
    },
    create: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      // Only super admins and tenant admins can create users
      return context.auth.roles.includes('super_admin') || context.auth.roles.includes('tenant_admin')
    },
    update: async ({ req, id }) => {
      const context = await resolveCityOSContext(req)
      
      // Super admins can update anyone
      if (context.auth.roles.includes('super_admin')) {
        return true
      }
      
      // Users can update their own profile (limited fields)
      if (context.auth.userId === id) {
        return true
      }
      
      // Tenant admins can update users in their tenant
      if (context.auth.roles.includes('tenant_admin') && context.tenantId) {
        return {
          'tenantMemberships.tenant': { equals: context.tenantId }
        }
      }
      
      return false
    },
    delete: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      // Only super admins can delete users
      return context.auth.roles.includes('super_admin')
    },
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Log to audit
        if (operation !== 'read') {
          await req.payload.create({
            collection: 'audit-logs',
            data: {
              actorUserId: req.user?.id,
              actorRoles: req.user?.roles || [],
              action: operation,
              collection: 'users',
              docId: doc.id,
              timestamp: new Date().toISOString(),
              ip: req.ip,
              userAgent: req.headers.get('user-agent'),
            }
          })
        }
      }
    ]
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'User email address (primary identifier)',
      },
    },
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Full name',
      },
    },
    {
      name: 'externalAuthProvider',
      type: 'select',
      required: true,
      defaultValue: 'keycloak',
      options: [
        { label: 'Keycloak', value: 'keycloak' },
        { label: 'Other OIDC', value: 'oidc' },
      ],
      admin: {
        description: 'External authentication provider',
      },
    },
    {
      name: 'externalUserId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'User ID from external auth provider (Keycloak sub claim)',
      },
    },
    {
      name: 'globalRoles',
      type: 'array',
      admin: {
        description: 'Platform-wide roles (not tenant-specific)',
      },
      fields: [
        {
          name: 'role',
          type: 'select',
          required: true,
          options: [
            { label: 'Super Admin', value: 'super_admin' },
            { label: 'Platform Operator', value: 'platform_operator' },
            { label: 'Support Agent', value: 'support_agent' },
          ],
        },
      ],
    },
    {
      name: 'tenantMemberships',
      type: 'array',
      admin: {
        description: 'Tenant/store memberships with roles',
      },
      fields: [
        {
          name: 'tenant',
          type: 'relationship',
          relationTo: 'tenants',
          required: true,
        },
        {
          name: 'store',
          type: 'relationship',
          relationTo: 'stores',
          admin: {
            description: 'Optional: specific store within tenant',
          },
        },
        {
          name: 'roles',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'role',
              type: 'select',
              required: true,
              options: [
                { label: 'Tenant Admin', value: 'tenant_admin' },
                { label: 'Store Manager', value: 'store_manager' },
                { label: 'Vendor Owner', value: 'vendor_owner' },
                { label: 'Vendor Staff', value: 'vendor_staff' },
                { label: 'B2B Company Admin', value: 'b2b_company_admin' },
                { label: 'B2B Buyer', value: 'b2b_buyer' },
                { label: 'B2B Approver', value: 'b2b_approver' },
                { label: 'City Partner Admin', value: 'city_partner_admin' },
                { label: 'Content Editor', value: 'content_editor' },
              ],
            },
          ],
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'active',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Suspended', value: 'suspended' },
            { label: 'Pending', value: 'pending' },
          ],
        },
        {
          name: 'joinedAt',
          type: 'date',
          admin: {
            description: 'When user joined this tenant',
          },
        },
      ],
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Last login timestamp',
      },
    },
    {
      name: 'preferences',
      type: 'json',
      admin: {
        description: 'User preferences and settings',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional user metadata',
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
