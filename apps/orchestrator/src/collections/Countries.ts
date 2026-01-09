import type { CollectionConfig } from 'payload'

export const Countries: CollectionConfig = {
  slug: 'countries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['code', 'name', 'status'],
    group: 'Geo & Hierarchy',
  },
  access: {
    read: () => true, // Countries are public data
    create: ({ req }) => req.user?.globalRoles?.includes('super_admin') || false,
    update: ({ req }) => req.user?.globalRoles?.includes('super_admin') || false,
    delete: ({ req }) => req.user?.globalRoles?.includes('super_admin') || false,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'ISO 3166-1 alpha-2 country code (e.g., SA, AE, EG)',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Country name',
      },
    },
    {
      name: 'nameAr',
      type: 'text',
      admin: {
        description: 'Country name in Arabic',
      },
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
        description: 'Additional country metadata (currency, timezone, etc.)',
      },
    },
  ],
}
