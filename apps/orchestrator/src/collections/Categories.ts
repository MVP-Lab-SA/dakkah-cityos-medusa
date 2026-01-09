import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'scope', 'status'],
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
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Category name (e.g., "Retail", "Services", "Healthcare")',
      },
    },
    {
      name: 'nameAr',
      type: 'text',
      admin: {
        description: 'Category name in Arabic',
      },
    },
    {
      name: 'scope',
      type: 'relationship',
      relationTo: 'scopes',
      hasMany: false,
      admin: {
        description: 'Optional: link category to specific scope',
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
        description: 'Additional category metadata',
      },
    },
  ],
}
