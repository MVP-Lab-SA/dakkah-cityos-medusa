import type { CollectionConfig } from 'payload'
import { resolveCityOSContext } from '../lib/cityosContext'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'tenant', 'store', 'status', 'publishAt'],
    group: 'Content',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      if (context.auth.roles.includes('super_admin')) {
        return true
      }
      
      // Content editors and tenant admins can read drafts
      const canReadDrafts = context.auth.roles.includes('tenant_admin') || 
                           context.auth.roles.includes('content_editor')
      
      if (context.tenantId) {
        const filter: any = {
          tenant: { equals: context.tenantId }
        }
        
        // Non-editors only see published
        if (!canReadDrafts) {
          filter.status = { equals: 'published' }
        }
        
        return filter
      }
      
      // Public access - only published
      return {
        status: { equals: 'published' }
      }
    },
    create: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      return context.auth.roles.includes('tenant_admin') || 
             context.auth.roles.includes('content_editor')
    },
    update: async ({ req }) => {
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
    delete: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      return context.auth.roles.includes('super_admin') || 
             context.auth.roles.includes('tenant_admin')
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
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
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Trigger sync job if published
        if (doc.status === 'published') {
          await req.payload.create({
            collection: 'sync-jobs',
            data: {
              jobType: 'payload_to_medusa',
              status: 'queued',
              tenantId: doc.tenant,
              storeId: doc.store,
              sourceCollection: 'pages',
              sourceDocId: doc.id,
              metadata: {
                operation,
                slug: doc.slug,
              },
            }
          })
        }
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
    },
    {
      name: 'store',
      type: 'relationship',
      relationTo: 'stores',
      index: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'URL slug (must be unique within store)',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        {
          slug: 'hero',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'subtitle', type: 'textarea' },
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'cta', type: 'text' },
            { name: 'ctaLink', type: 'text' },
          ],
        },
        {
          slug: 'richText',
          fields: [
            { name: 'content', type: 'richText', required: true },
          ],
        },
        {
          slug: 'media',
          fields: [
            { name: 'media', type: 'upload', relationTo: 'media', required: true },
            { name: 'caption', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      index: true,
    },
    {
      name: 'publishAt',
      type: 'date',
      admin: {
        description: 'Schedule publish date',
      },
    },
    {
      name: 'unpublishAt',
      type: 'date',
      admin: {
        description: 'Schedule unpublish date',
      },
    },
  ],
}
