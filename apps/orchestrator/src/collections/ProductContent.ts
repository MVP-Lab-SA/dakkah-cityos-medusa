import type { CollectionConfig } from 'payload'
import { resolveCityOSContext } from '../lib/cityosContext'

export const ProductContent: CollectionConfig = {
  slug: 'product-content',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'medusaProductId', 'tenant', 'editorialStatus', 'lastSyncAt'],
    group: 'Content',
  },
  access: {
    read: async ({ req }) => {
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
    create: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      return context.auth.roles.includes('tenant_admin') || 
             context.auth.roles.includes('content_editor') ||
             context.auth.roles.includes('vendor_owner')
    },
    update: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      if (context.auth.roles.includes('super_admin') || 
          context.auth.roles.includes('tenant_admin') ||
          context.auth.roles.includes('content_editor')) {
        return true
      }
      
      // Vendors can update their own products
      if (context.auth.roles.includes('vendor_owner') && context.tenantId) {
        return {
          tenant: { equals: context.tenantId },
          // TODO: add vendor filter when vendor ID is in context
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
        // Trigger sync to Medusa when content is published
        if (doc.editorialStatus === 'published') {
          await req.payload.create({
            collection: 'sync-jobs',
            data: {
              jobType: 'payload_to_medusa',
              status: 'queued',
              tenantId: doc.tenant,
              storeId: doc.store,
              sourceCollection: 'product-content',
              sourceDocId: doc.id,
              targetSystem: 'medusa',
              targetId: doc.medusaProductId,
              metadata: {
                operation,
                syncFields: ['content', 'seo', 'tags'],
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
    // Medusa Sync Fields
    {
      name: 'medusaProductId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Medusa product ID (primary sync key)',
      },
    },
    {
      name: 'medusaVariantIds',
      type: 'array',
      admin: {
        description: 'Medusa variant IDs for this product',
      },
      fields: [
        {
          name: 'variantId',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'lastSyncAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Last successful sync with Medusa',
      },
    },
    {
      name: 'syncStatus',
      type: 'select',
      defaultValue: 'synced',
      options: [
        { label: 'Synced', value: 'synced' },
        { label: 'Pending', value: 'pending' },
        { label: 'Failed', value: 'failed' },
        { label: 'Conflict', value: 'conflict' },
      ],
      index: true,
    },
    // Content Fields
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Product title (for CMS, may differ from Medusa title)',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Rich product description',
      },
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'specifications',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'contentBlocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'textBlock',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'content', type: 'richText', required: true },
          ],
        },
        {
          slug: 'imageGallery',
          fields: [
            {
              name: 'images',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text' },
              ],
            },
          ],
        },
        {
          slug: 'videoEmbed',
          fields: [
            { name: 'url', type: 'text', required: true },
            { name: 'caption', type: 'text' },
          ],
        },
      ],
    },
    // SEO
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'keywords', type: 'text' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
    // Editorial
    {
      name: 'editorialStatus',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Review', value: 'review' },
        { label: 'Published', value: 'published' },
      ],
      index: true,
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
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata',
      },
    },
  ],
}
