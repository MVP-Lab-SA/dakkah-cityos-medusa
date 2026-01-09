import type { CollectionConfig } from 'payload'
import { resolveCityOSContext } from '../lib/cityosContext'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: path.resolve(__dirname, '../../media'),
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 640,
        height: 480,
        position: 'centre',
      },
      {
        name: 'feature',
        width: 1024,
        height: 576,
        position: 'centre',
      },
    ],
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'tenant', 'store', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      if (context.auth.roles.includes('super_admin')) {
        return true
      }
      
      // Public media can be read by anyone
      // Tenant-scoped media requires tenant match
      if (context.tenantId) {
        return {
          or: [
            { tenant: { equals: null } }, // Public media
            { tenant: { equals: context.tenantId } },
          ]
        }
      }
      
      // Unauthenticated users see only public media
      return {
        tenant: { equals: null }
      }
    },
    create: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      // Must be authenticated to upload
      return !!context.auth.userId
    },
    update: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      if (context.auth.roles.includes('super_admin')) {
        return true
      }
      
      // Tenant users can update their tenant's media
      if (context.tenantId) {
        return {
          tenant: { equals: context.tenantId }
        }
      }
      
      return false
    },
    delete: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      if (context.auth.roles.includes('super_admin')) {
        return true
      }
      
      if (context.tenantId) {
        return {
          tenant: { equals: context.tenantId }
        }
      }
      
      return false
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Auto-assign tenant/store from context
        if (operation === 'create') {
          const context = await resolveCityOSContext(req)
          if (!data.tenant && context.tenantId) {
            data.tenant = context.tenantId
          }
          if (!data.store && context.storeId) {
            data.store = context.storeId
          }
        }
        return data
      }
    ]
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt text for accessibility',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      index: true,
      admin: {
        description: 'Tenant this media belongs to (null = public)',
      },
    },
    {
      name: 'store',
      type: 'relationship',
      relationTo: 'stores',
      admin: {
        description: 'Store this media belongs to (optional)',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Caption or description',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
  ],
}
