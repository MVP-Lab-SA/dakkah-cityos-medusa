import type { CollectionConfig } from 'payload'

export const Subcategories: CollectionConfig = {
  slug: 'subcategories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'status'],
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
        description: 'Subcategory name (e.g., "Fashion", "Electronics", "Food & Beverage")',
      },
    },
    {
      name: 'nameAr',
      type: 'text',
      admin: {
        description: 'Subcategory name in Arabic',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
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
        description: 'Additional subcategory metadata',
      },
    },
  ],
}
