import type { CollectionConfig } from 'payload'
import { resolveCityOSContext } from '../lib/cityosContext'

export const SyncJobs: CollectionConfig = {
  slug: 'sync-jobs',
  admin: {
    useAsTitle: 'jobType',
    defaultColumns: ['jobType', 'status', 'tenantId', 'sourceCollection', 'createdAt'],
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
    create: () => true, // System can create sync jobs
    update: () => true, // System can update job status
    delete: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      return context.auth.roles.includes('super_admin')
    },
  },
  fields: [
    {
      name: 'jobType',
      type: 'select',
      required: true,
      options: [
        { label: 'Payload → Medusa', value: 'payload_to_medusa' },
        { label: 'Medusa → Payload', value: 'medusa_to_payload' },
        { label: 'Reconcile', value: 'reconcile' },
      ],
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'queued',
      options: [
        { label: 'Queued', value: 'queued' },
        { label: 'Running', value: 'running' },
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
      ],
      index: true,
    },
    {
      name: 'tenantId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'storeId',
      type: 'text',
      index: true,
    },
    {
      name: 'sourceCollection',
      type: 'text',
      admin: {
        description: 'Source collection (e.g., pages, product-content)',
      },
    },
    {
      name: 'sourceDocId',
      type: 'text',
      admin: {
        description: 'Source document ID',
      },
    },
    {
      name: 'targetSystem',
      type: 'select',
      options: [
        { label: 'Medusa', value: 'medusa' },
        { label: 'Payload', value: 'payload' },
      ],
    },
    {
      name: 'targetId',
      type: 'text',
      admin: {
        description: 'Target resource ID in destination system',
      },
    },
    {
      name: 'startedAt',
      type: 'date',
    },
    {
      name: 'finishedAt',
      type: 'date',
    },
    {
      name: 'logs',
      type: 'array',
      fields: [
        {
          name: 'timestamp',
          type: 'date',
          required: true,
        },
        {
          name: 'level',
          type: 'select',
          required: true,
          options: [
            { label: 'Info', value: 'info' },
            { label: 'Warning', value: 'warning' },
            { label: 'Error', value: 'error' },
          ],
        },
        {
          name: 'message',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'errorMessage',
      type: 'textarea',
      admin: {
        description: 'Error details if failed',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional job metadata',
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
