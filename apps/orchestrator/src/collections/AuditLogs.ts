import type { CollectionConfig } from 'payload'
import { resolveCityOSContext } from '../lib/cityosContext'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['action', 'collection', 'actorUserId', 'tenantId', 'timestamp'],
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
    create: () => true, // System can create audit logs
    update: () => false, // Audit logs are immutable
    delete: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      // Only super admins can delete audit logs (for GDPR compliance etc.)
      return context.auth.roles.includes('super_admin')
    },
  },
  fields: [
    {
      name: 'actorUserId',
      type: 'text',
      index: true,
      admin: {
        description: 'User who performed the action',
      },
    },
    {
      name: 'actorRoles',
      type: 'array',
      fields: [
        {
          name: 'role',
          type: 'text',
        },
      ],
    },
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'Read', value: 'read' },
        { label: 'Login', value: 'login' },
        { label: 'Logout', value: 'logout' },
      ],
      index: true,
    },
    {
      name: 'collection',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Collection affected',
      },
    },
    {
      name: 'docId',
      type: 'text',
      index: true,
      admin: {
        description: 'Document ID affected',
      },
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
      name: 'timestamp',
      type: 'date',
      required: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'ip',
      type: 'text',
      admin: {
        description: 'IP address',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'User agent string',
      },
    },
    {
      name: 'diffSummary',
      type: 'json',
      admin: {
        description: 'Summary of changes (before/after)',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional context',
      },
    },
  ],
}
