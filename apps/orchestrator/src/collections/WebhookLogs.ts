import type { CollectionConfig } from 'payload'
import { resolveCityOSContext } from '../lib/cityosContext'

export const WebhookLogs: CollectionConfig = {
  slug: 'webhook-logs',
  admin: {
    useAsTitle: 'requestId',
    defaultColumns: ['requestId', 'systemType', 'direction', 'status', 'createdAt'],
    group: 'Orchestrator',
  },
  access: {
    read: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      
      if (context.auth.roles.includes('super_admin')) {
        return true
      }
      
      if (context.auth.roles.includes('tenant_admin') && context.tenantId) {
        return {
          tenantId: { equals: context.tenantId }
        }
      }
      
      return false
    },
    create: () => true, // Webhooks need to create logs
    update: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      return context.auth.roles.includes('super_admin')
    },
    delete: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      return context.auth.roles.includes('super_admin')
    },
  },
  fields: [
    {
      name: 'requestId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Unique request ID for tracing',
      },
    },
    {
      name: 'systemType',
      type: 'select',
      required: true,
      options: [
        { label: 'Medusa', value: 'medusa' },
        { label: 'Fleetbase', value: 'fleetbase' },
        { label: 'ERPNext', value: 'erpnext' },
        { label: 'Notifications', value: 'notifications' },
        { label: 'Custom', value: 'custom' },
      ],
      index: true,
    },
    {
      name: 'direction',
      type: 'select',
      required: true,
      options: [
        { label: 'Inbound', value: 'inbound' },
        { label: 'Outbound', value: 'outbound' },
      ],
      index: true,
    },
    {
      name: 'tenantId',
      type: 'text',
      index: true,
    },
    {
      name: 'storeId',
      type: 'text',
      index: true,
    },
    {
      name: 'eventType',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Event type (e.g., order.placed, product.updated)',
      },
    },
    {
      name: 'signatureValid',
      type: 'checkbox',
      admin: {
        description: 'Whether webhook signature was valid',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'success',
      options: [
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Retrying', value: 'retrying' },
      ],
      index: true,
    },
    {
      name: 'attempts',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Number of delivery attempts',
      },
    },
    {
      name: 'nextRetryAt',
      type: 'date',
      admin: {
        description: 'Next retry timestamp',
      },
    },
    {
      name: 'payloadHash',
      type: 'text',
      admin: {
        description: 'Hash of webhook payload for deduplication',
      },
    },
    {
      name: 'responseCode',
      type: 'number',
      admin: {
        description: 'HTTP response code',
      },
    },
    {
      name: 'responseBodySnippet',
      type: 'textarea',
      admin: {
        description: 'First 1000 chars of response',
      },
    },
    {
      name: 'errorMessage',
      type: 'textarea',
      admin: {
        description: 'Error message if failed',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional webhook metadata',
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
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
  ],
}
