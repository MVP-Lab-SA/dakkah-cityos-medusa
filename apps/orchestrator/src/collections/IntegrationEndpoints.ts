import type { CollectionConfig } from 'payload'
import { resolveCityOSContext } from '../lib/cityosContext'

export const IntegrationEndpoints: CollectionConfig = {
  slug: 'integration-endpoints',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'systemType', 'tenant', 'store', 'enabled'],
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
          tenant: { equals: context.tenantId }
        }
      }
      
      return false
    },
    create: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      return context.auth.roles.includes('super_admin') || 
             context.auth.roles.includes('tenant_admin')
    },
    update: async ({ req }) => {
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
    delete: async ({ req }) => {
      const context = await resolveCityOSContext(req)
      return context.auth.roles.includes('super_admin')
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Descriptive name for this integration',
      },
    },
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
      admin: {
        description: 'Optional: scope to specific store',
      },
    },
    {
      name: 'systemType',
      type: 'select',
      required: true,
      options: [
        { label: 'Medusa Commerce', value: 'medusa' },
        { label: 'Fleetbase Logistics', value: 'fleetbase' },
        { label: 'ERPNext', value: 'erpnext' },
        { label: 'Notifications Service', value: 'notifications' },
        { label: 'Custom', value: 'custom' },
      ],
      index: true,
    },
    {
      name: 'baseUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'Base URL for this system (e.g., https://api.medusa.com)',
      },
    },
    {
      name: 'authType',
      type: 'select',
      required: true,
      options: [
        { label: 'API Key', value: 'api_key' },
        { label: 'Bearer Token', value: 'bearer' },
        { label: 'Basic Auth', value: 'basic' },
        { label: 'None', value: 'none' },
      ],
    },
    {
      name: 'secretRef',
      type: 'text',
      admin: {
        description: 'Environment variable name for auth secret (e.g., MEDUSA_API_KEY)',
      },
    },
    {
      name: 'webhookSecret',
      type: 'text',
      admin: {
        description: 'Secret for verifying incoming webhooks from this system',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable/disable this integration',
      },
    },
    {
      name: 'config',
      type: 'json',
      admin: {
        description: 'Additional configuration (JSON)',
      },
    },
    {
      name: 'healthCheck',
      type: 'group',
      fields: [
        {
          name: 'lastCheckAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Healthy', value: 'healthy' },
            { label: 'Degraded', value: 'degraded' },
            { label: 'Unhealthy', value: 'unhealthy' },
            { label: 'Unknown', value: 'unknown' },
          ],
          defaultValue: 'unknown',
        },
        {
          name: 'lastError',
          type: 'textarea',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
    },
  ],
}
