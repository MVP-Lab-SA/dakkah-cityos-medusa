import type { CollectionConfig } from 'payload'

export const Scopes: CollectionConfig = {
  slug: 'scopes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'scopeType', 'country', 'status'],
    group: 'Geo & Hierarchy',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.globalRoles?.includes('super_admin') || false,
    update: ({ req }) => req.user?.globalRoles?.includes('super_admin') || false,
    delete: ({ req }) => req.user?.globalRoles?.includes('super_admin') || false,
  },
  fields: [
    {
      name: 'scopeType',
      type: 'select',
      required: true,
      options: [
        { label: 'Theme Scope (National)', value: 'theme' },
        { label: 'City Scope', value: 'city' },
      ],
      admin: {
        description: 'Whether this is a thematic scope (national) or city-based scope',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Scope name (e.g., "Fashion & Lifestyle" or "Riyadh")',
      },
    },
    {
      name: 'nameAr',
      type: 'text',
      admin: {
        description: 'Scope name in Arabic',
      },
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      hasMany: false,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional scope metadata',
      },
    },
  ],
}
