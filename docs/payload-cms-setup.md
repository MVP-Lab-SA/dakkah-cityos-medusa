# Payload CMS Setup Guide — Dakkah CityOS Storefront

> **Payload v3 · PostgreSQL · Lexical Editor · Multi-Tenant · 3 Locales (en/fr/ar)**

This document is the canonical reference for configuring a Payload CMS instance that powers the Dakkah CityOS storefront. It covers every collection, block type, access-control rule, webhook, and API contract the storefront depends on.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Environment Variables](#2-environment-variables)
3. [Payload Config (`payload.config.ts`)](#3-payload-config)
4. [Localization Setup](#4-localization-setup)
5. [Collections](#5-collections)
   - 5.1 [Tenants](#51-tenants)
   - 5.2 [Pages (Core Collection)](#52-pages)
   - 5.3 [Navigations](#53-navigations)
   - 5.4 [Verticals](#54-verticals)
   - 5.5 [Nodes](#55-nodes)
   - 5.6 [Media](#56-media)
6. [Block Types (Page Layout)](#6-block-types)
7. [Globals](#7-globals)
8. [Access Control](#8-access-control)
9. [Webhooks Configuration](#9-webhooks-configuration)
10. [REST API Contract](#10-rest-api-contract)
11. [Data Migration Guide](#11-data-migration-guide)
12. [Seed Data Script](#12-seed-data-script)
13. [RTL & Locale Rendering Notes](#13-rtl--locale-rendering-notes)

---

## 1. Architecture Overview

```
┌─────────────────────┐     REST / GraphQL      ┌─────────────────────┐
│  Payload CMS        │◄────────────────────────►│  Storefront         │
│  (apps/orchestrator) │                          │  (apps/storefront)  │
│  Port 3001           │                          │  TanStack Start     │
│                      │   Webhooks (POST)        │  Port 5000          │
│                      │─────────────────────────►│                     │
└────────┬─────────────┘                          └──────────┬──────────┘
         │                                                   │
         │  Webhooks (POST)                                  │  HTTP
         ▼                                                   ▼
┌─────────────────────┐                          ┌─────────────────────┐
│  Medusa.js Backend  │◄─────────────────────────│  Medusa Store API   │
│  (apps/backend)     │                          │  /store/*           │
│  Port 9000          │                          │                     │
└─────────────────────┘                          └─────────────────────┘
```

| Component | Location | Port | Purpose |
|-----------|----------|------|---------|
| Payload CMS | `apps/orchestrator/` | 3001 | Content management, page builder, navigation, verticals |
| Medusa Backend | `apps/backend/` | 9000 | Commerce engine, products, orders, verticals data |
| Storefront | `apps/storefront/` | 5000 | SSR React frontend (TanStack Start) |

**Default Tenant:** Dakkah (ID: `01KGZ2JRYX607FWMMYQNQRKVWS`)
**Node Hierarchy:** CITY → DISTRICT → ZONE → FACILITY → ASSET
**Locales:** `en` (default), `fr`, `ar` (RTL)
**Commerce Verticals:** 25+ (restaurants, healthcare, education, real-estate, travel, grocery, automotive, events, digital-products, classifieds, rentals, auctions, crowdfunding, financial-products, pet-services, utilities, parking, government, charity, legal, fitness, freelance, social-commerce, memberships, warranties, advertising, affiliates)

---

## 2. Environment Variables

Add these to your `.env` file in `apps/orchestrator/`:

```env
# ── Core Payload ──
PAYLOAD_SECRET=your-jwt-secret-min-32-chars-here
DATABASE_URL=postgresql://user:password@localhost:5432/payload_cityos

# ── Server URL ──
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3001

# ── S3 Media Storage (production) ──
PAYLOAD_S3_BUCKET=dakkah-media
PAYLOAD_S3_REGION=me-south-1
PAYLOAD_S3_ACCESS_KEY=AKIA...
PAYLOAD_S3_SECRET_KEY=secret...
PAYLOAD_S3_ENDPOINT=https://s3.me-south-1.amazonaws.com

# ── Medusa Integration ──
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_API_KEY=sk_medusa_admin_api_key

# ── Webhook Signing ──
PAYLOAD_WEBHOOK_SECRET=whsec_your_shared_hmac_secret

# ── Optional: Cerbos Policy Engine ──
CERBOS_URL=http://localhost:3593
API_KEY_HASH_SALT=change-this-salt
```

> **Production note:** Never commit secrets. Use your deployment platform's secret management. For S3, install `@payloadcms/storage-s3` and configure it as a plugin.

---

## 3. Payload Config

File: `apps/orchestrator/src/payload.config.ts`

```ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Tenants } from './collections/Tenants'
import { Pages } from './collections/Pages'
import { Navigations } from './collections/Navigations'
import { Verticals } from './collections/Verticals'
import { Nodes } from './collections/Nodes'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { ApiKeys } from './collections/ApiKeys'

// Globals
import { SiteSettings } from './globals/SiteSettings'
import { ThemeConfig } from './globals/ThemeConfig'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Dakkah CityOS Orchestrator',
    },
  },

  collections: [
    Tenants,
    Pages,
    Navigations,
    Verticals,
    Nodes,
    Media,
    Users,
    ApiKeys,
  ],

  globals: [
    SiteSettings,
    ThemeConfig,
  ],

  editor: lexicalEditor({}),

  secret: process.env.PAYLOAD_SECRET || 'YOUR-SECRET-HERE',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    push: process.env.NODE_ENV !== 'production',
  }),

  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Français', code: 'fr' },
      { label: 'العربية', code: 'ar', rtl: true },
    ],
    defaultLocale: 'en',
    fallback: true,
  },

  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
    'http://localhost:5000', // storefront
    'http://localhost:9000', // medusa
  ].filter(Boolean),

  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
    'http://localhost:5000',
  ].filter(Boolean),

  graphQL: { disable: false },

  upload: {
    limits: { fileSize: 10_000_000 }, // 10 MB
  },

  plugins: [
    // Enable S3 storage in production
    ...(process.env.PAYLOAD_S3_BUCKET
      ? [
          s3Storage({
            collections: { media: true },
            bucket: process.env.PAYLOAD_S3_BUCKET,
            config: {
              region: process.env.PAYLOAD_S3_REGION || 'me-south-1',
              credentials: {
                accessKeyId: process.env.PAYLOAD_S3_ACCESS_KEY || '',
                secretAccessKey: process.env.PAYLOAD_S3_SECRET_KEY || '',
              },
              ...(process.env.PAYLOAD_S3_ENDPOINT && {
                endpoint: process.env.PAYLOAD_S3_ENDPOINT,
              }),
            },
          }),
        ]
      : []),
  ],

  telemetry: false,
  sharp: {},
})
```

---

## 4. Localization Setup

The `localization` key in `payload.config.ts` (shown above) enables three locales:

| Code | Label | Direction | Fallback |
|------|-------|-----------|----------|
| `en` | English | LTR | — (default) |
| `fr` | Français | LTR | `en` |
| `ar` | العربية | RTL | `en` |

**Fields that must be localized** (set `localized: true`):

- `Pages.title`
- `Pages.layout` block rich-text content fields
- `Media.alt`
- `Media.caption`
- `Navigations.items[].label`
- `Verticals.name`
- `Verticals.description`

When the storefront requests a page it passes `?locale=ar`. Payload returns Arabic content and falls back to English for any untranslated field.

---

## 5. Collections

### 5.1 Tenants

File: `apps/orchestrator/src/collections/Tenants.ts`

```ts
import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'residencyZone', 'status'],
    group: 'Tenancy',
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.tenant) return { id: { equals: req.user.tenant } }
      return false
    },
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.tenant) return { id: { equals: req.user.tenant } }
      return false
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: (val: string) => {
        if (!/^[a-z0-9-]+$/.test(val)) {
          return 'Slug must contain only lowercase letters, numbers, and hyphens'
        }
        return true
      },
    },
    {
      name: 'domain',
      type: 'text',
      admin: { description: 'Custom domain (e.g., dakkah.com)' },
    },
    {
      name: 'residencyZone',
      type: 'select',
      required: true,
      defaultValue: 'GCC',
      options: [
        { label: 'GCC', value: 'GCC' },
        { label: 'EU', value: 'EU' },
        { label: 'MENA', value: 'MENA' },
        { label: 'APAC', value: 'APAC' },
        { label: 'Americas', value: 'AMERICAS' },
        { label: 'Global', value: 'GLOBAL' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Trial', value: 'trial' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Deactivated', value: 'deactivated' },
      ],
      index: true,
    },
    {
      name: 'defaultLocale',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Français', value: 'fr' },
        { label: 'العربية', value: 'ar' },
      ],
    },
    {
      name: 'supportedLocales',
      type: 'array',
      fields: [
        {
          name: 'locale',
          type: 'select',
          required: true,
          options: [
            { label: 'English', value: 'en' },
            { label: 'Français', value: 'fr' },
            { label: 'العربية', value: 'ar' },
          ],
        },
      ],
    },
    {
      name: 'timezone',
      type: 'text',
      defaultValue: 'Asia/Riyadh',
      admin: { description: 'IANA timezone (e.g., Asia/Riyadh, Europe/Paris)' },
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'SAR',
      admin: { description: 'ISO 4217 currency code' },
    },
    {
      name: 'primaryColor',
      type: 'text',
      defaultValue: '#1a1a2e',
      admin: { description: 'Hex color (e.g., #1a1a2e)' },
    },
    {
      name: 'accentColor',
      type: 'text',
      defaultValue: '#e94560',
      admin: { description: 'Hex color for accent/CTA' },
    },
    {
      name: 'logoUrl',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'faviconUrl',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'settings',
      type: 'json',
      admin: { description: 'Tenant-level JSON settings (feature flags, etc.)' },
    },
  ],
}
```

---

### 5.2 Pages

This is the **core collection**. Every CMS-driven page in the storefront — verticals, landing pages, static content — is a document here.

File: `apps/orchestrator/src/collections/Pages.ts`

```ts
import type { CollectionConfig } from 'payload'
import { heroBlock } from '../blocks/hero'
import { contentBlock } from '../blocks/content'
import { productsBlock } from '../blocks/products'
import { featuresBlock } from '../blocks/features'
import { ctaBlock } from '../blocks/cta'
import { verticalGridBlock } from '../blocks/vertical-grid'
import { verticalDetailBlock } from '../blocks/vertical-detail'
import { imageGalleryBlock } from '../blocks/image-gallery'
import { testimonialsBlock } from '../blocks/testimonials'
import { statsBlock } from '../blocks/stats'
import { mapBlock } from '../blocks/map'
import { nodeHierarchyBlock } from '../blocks/node-hierarchy'
import { faqBlock } from '../blocks/faq'
import { pricingBlock } from '../blocks/pricing'
import { videoBlock } from '../blocks/video'
import { formBlock } from '../blocks/form'
import { embedBlock } from '../blocks/embed'
import { navigationCardsBlock } from '../blocks/navigation-cards'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', 'template', 'tenant', 'status', 'locale'],
    group: 'Content',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.role === 'editor' && req.user?.tenant) {
        return { tenant: { equals: req.user.tenant } }
      }
      if (req.user?.role === 'viewer' && req.user?.tenant) {
        return {
          and: [
            { tenant: { equals: req.user.tenant } },
            { status: { equals: 'published' } },
          ],
        }
      }
      // Public / API key access — published only
      return { status: { equals: 'published' } }
    },
    create: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.role === 'editor' && req.user?.tenant) {
        return { tenant: { equals: req.user.tenant } }
      }
      return false
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        // Auto-assign tenant from logged-in user
        if (operation === 'create' && !data.tenant && req.user?.tenant) {
          data.tenant = req.user.tenant
        }
        // Auto-set publishedAt on status change
        if (data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req, previousDoc }) => {
        // Fire webhook to Medusa on publish/update/delete
        const medusaUrl = process.env.MEDUSA_BACKEND_URL
        const secret = process.env.PAYLOAD_WEBHOOK_SECRET
        if (!medusaUrl || !secret) return

        const event = doc.status === 'published'
          ? `page.${operation === 'create' ? 'create' : 'update'}`
          : operation === 'delete'
            ? 'page.delete'
            : `page.${operation}`

        const payload = {
          event,
          collection: 'pages',
          operation,
          data: doc,
          previousDoc: previousDoc || null,
        }

        const crypto = await import('crypto')
        const signature = crypto
          .createHmac('sha256', secret)
          .update(JSON.stringify(payload))
          .digest('hex')

        try {
          await fetch(`${medusaUrl}/admin/webhooks/payload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Payload-Signature': signature,
            },
            body: JSON.stringify(payload),
          })
        } catch (err) {
          console.error('[Webhook] Failed to notify Medusa:', err)
        }
      },
    ],
  },
  fields: [
    // ── Identity ──
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'URL segment (e.g., "restaurants")' },
    },
    {
      name: 'path',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description:
          'Full URL path relative to /$tenant/$locale/ (e.g., "restaurants/pizza-palace")',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        description: 'Parent page for hierarchy / nesting / breadcrumbs',
      },
    },

    // ── Tenant & Locale ──
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
    },
    {
      name: 'locale',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Français', value: 'fr' },
        { label: 'العربية', value: 'ar' },
      ],
      index: true,
    },

    // ── Template ──
    {
      name: 'template',
      type: 'select',
      required: true,
      defaultValue: 'static',
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Landing Page', value: 'landing' },
        { label: 'Static Page', value: 'static' },
        { label: 'Vertical List', value: 'vertical-list' },
        { label: 'Vertical Detail', value: 'vertical-detail' },
        { label: 'Category', value: 'category' },
        { label: 'Node Browser', value: 'node-browser' },
        { label: 'Custom', value: 'custom' },
      ],
      index: true,
    },

    // ── Status & Scheduling ──
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      index: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { description: 'Date when the page was published' },
    },

    // ── Layout Blocks ──
    {
      name: 'layout',
      type: 'blocks',
      localized: true,
      blocks: [
        heroBlock,
        contentBlock,
        productsBlock,
        featuresBlock,
        ctaBlock,
        verticalGridBlock,
        verticalDetailBlock,
        imageGalleryBlock,
        testimonialsBlock,
        statsBlock,
        mapBlock,
        nodeHierarchyBlock,
        faqBlock,
        pricingBlock,
        videoBlock,
        formBlock,
        embedBlock,
        navigationCardsBlock,
      ],
    },

    // ── Vertical Config (conditional) ──
    {
      name: 'verticalConfig',
      type: 'group',
      admin: {
        description: 'Only applies to vertical-list and vertical-detail templates',
        condition: (data) =>
          data.template === 'vertical-list' ||
          data.template === 'vertical-detail',
      },
      fields: [
        {
          name: 'verticalSlug',
          type: 'text',
          required: true,
          admin: {
            description: 'Vertical identifier (e.g., "restaurants", "healthcare")',
          },
        },
        {
          name: 'medusaEndpoint',
          type: 'text',
          required: true,
          admin: {
            description: 'Medusa store API path (e.g., "/store/restaurants")',
          },
        },
        {
          name: 'itemsPerPage',
          type: 'number',
          defaultValue: 12,
          min: 1,
          max: 100,
        },
        {
          name: 'cardLayout',
          type: 'select',
          defaultValue: 'grid',
          options: [
            { label: 'Grid', value: 'grid' },
            { label: 'List', value: 'list' },
            { label: 'Map', value: 'map' },
          ],
        },
        {
          name: 'filterFields',
          type: 'array',
          admin: { description: 'Filterable fields shown in sidebar/toolbar' },
          fields: [
            { name: 'fieldName', type: 'text', required: true },
            {
              name: 'fieldType',
              type: 'select',
              required: true,
              options: [
                { label: 'Text', value: 'text' },
                { label: 'Select', value: 'select' },
                { label: 'Range', value: 'range' },
                { label: 'Boolean', value: 'boolean' },
                { label: 'Date', value: 'date' },
              ],
            },
            { name: 'label', type: 'text', required: true },
          ],
        },
        {
          name: 'sortFields',
          type: 'array',
          admin: { description: 'Available sort options' },
          fields: [
            { name: 'fieldName', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
            {
              name: 'defaultDirection',
              type: 'select',
              defaultValue: 'asc',
              options: [
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' },
              ],
            },
          ],
        },
        {
          name: 'detailFields',
          type: 'array',
          admin: {
            description: 'Fields shown on detail page (vertical-detail template)',
            condition: (data) => data.template === 'vertical-detail',
          },
          fields: [
            { name: 'fieldName', type: 'text', required: true },
            {
              name: 'fieldType',
              type: 'select',
              required: true,
              options: [
                { label: 'Text', value: 'text' },
                { label: 'Rich Text', value: 'richtext' },
                { label: 'Image', value: 'image' },
                { label: 'Price', value: 'price' },
                { label: 'Rating', value: 'rating' },
                { label: 'Date', value: 'date' },
                { label: 'JSON', value: 'json' },
              ],
            },
            { name: 'label', type: 'text', required: true },
            {
              name: 'section',
              type: 'text',
              admin: {
                description: 'Group fields into sections (e.g., "overview", "details")',
              },
            },
          ],
        },
      ],
    },

    // ── Node Scope ──
    {
      name: 'nodeScope',
      type: 'relationship',
      relationTo: 'nodes',
      admin: {
        description:
          'Optional: restrict this page to a specific node in the hierarchy',
      },
    },

    // ── Governance Tags ──
    {
      name: 'governanceTags',
      type: 'array',
      admin: { description: 'Tags for governance policy filtering' },
      fields: [
        { name: 'tag', type: 'text', required: true },
      ],
    },

    // ── SEO ──
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
        {
          name: 'keywords',
          type: 'array',
          fields: [{ name: 'keyword', type: 'text', required: true }],
        },
        { name: 'canonicalUrl', type: 'text' },
        { name: 'noIndex', type: 'checkbox', defaultValue: false },
      ],
    },

    // ── Sort Order ──
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Sort priority (lower = first)' },
    },

    // ── Breadcrumbs (virtual) ──
    {
      name: 'breadcrumbs',
      type: 'array',
      admin: { readOnly: true, description: 'Auto-generated from parent chain' },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'path', type: 'text' },
      ],
      hooks: {
        beforeChange: [
          async ({ siblingData, req }) => {
            // Auto-populate breadcrumbs from parent chain
            const crumbs: Array<{ id: string; title: string; slug: string; path: string }> = []
            let currentParent = siblingData.parent

            while (currentParent) {
              const parent = await req.payload.findByID({
                collection: 'pages',
                id: typeof currentParent === 'string' ? currentParent : currentParent.id,
                depth: 0,
              })
              if (!parent) break
              crumbs.unshift({
                id: parent.id,
                title: parent.title,
                slug: parent.slug,
                path: parent.path,
              })
              currentParent = parent.parent
            }

            return crumbs
          },
        ],
      },
    },
  ],
}
```

---

### 5.3 Navigations

File: `apps/orchestrator/src/collections/Navigations.ts`

```ts
import type { CollectionConfig } from 'payload'

const navItemFields: any[] = [
  {
    name: 'label',
    type: 'text',
    required: true,
    localized: true,
  },
  {
    name: 'type',
    type: 'select',
    required: true,
    options: [
      { label: 'Page', value: 'page' },
      { label: 'URL', value: 'url' },
      { label: 'Vertical', value: 'vertical' },
      { label: 'Node', value: 'node' },
    ],
  },
  {
    name: 'page',
    type: 'relationship',
    relationTo: 'pages',
    admin: {
      condition: (data: any, siblingData: any) => siblingData?.type === 'page',
    },
  },
  {
    name: 'url',
    type: 'text',
    admin: {
      condition: (data: any, siblingData: any) => siblingData?.type === 'url',
    },
  },
  {
    name: 'icon',
    type: 'text',
    admin: { description: 'Icon name (e.g., "utensils", "heart", "home")' },
  },
]

export const Navigations: CollectionConfig = {
  slug: 'navigations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'tenant', 'locale', 'status'],
    group: 'Content',
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.tenant) return { tenant: { equals: req.user.tenant } }
      return { status: { equals: 'active' } }
    },
    create: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.tenant) return { tenant: { equals: req.user.tenant } }
      return false
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        const medusaUrl = process.env.MEDUSA_BACKEND_URL
        const secret = process.env.PAYLOAD_WEBHOOK_SECRET
        if (!medusaUrl || !secret) return

        const payload = {
          event: 'navigation.update',
          collection: 'navigations',
          operation: 'update',
          data: doc,
        }

        const crypto = await import('crypto')
        const signature = crypto
          .createHmac('sha256', secret)
          .update(JSON.stringify(payload))
          .digest('hex')

        try {
          await fetch(`${medusaUrl}/admin/webhooks/payload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Payload-Signature': signature,
            },
            body: JSON.stringify(payload),
          })
        } catch (err) {
          console.error('[Webhook] Failed to notify Medusa on nav update:', err)
        }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
    },
    {
      name: 'locale',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Français', value: 'fr' },
        { label: 'العربية', value: 'ar' },
      ],
    },
    {
      name: 'location',
      type: 'select',
      required: true,
      options: [
        { label: 'Header', value: 'header' },
        { label: 'Footer', value: 'footer' },
        { label: 'Sidebar', value: 'sidebar' },
        { label: 'Mobile', value: 'mobile' },
      ],
      index: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        ...navItemFields,
        {
          name: 'children',
          type: 'array',
          admin: { description: 'Nested child items (one level deep)' },
          fields: [
            ...navItemFields,
            {
              name: 'children',
              type: 'array',
              admin: { description: 'Third-level items' },
              fields: navItemFields,
            },
          ],
        },
      ],
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
      index: true,
    },
  ],
}
```

---

### 5.4 Verticals

File: `apps/orchestrator/src/collections/Verticals.ts`

```ts
import type { CollectionConfig } from 'payload'

export const Verticals: CollectionConfig = {
  slug: 'verticals',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'tenant', 'isEnabled', 'sortOrder', 'status'],
    group: 'Content',
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.tenant) return { tenant: { equals: req.user.tenant } }
      return { status: { equals: 'active' } }
    },
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.tenant) return { tenant: { equals: req.user.tenant } }
      return false
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        const medusaUrl = process.env.MEDUSA_BACKEND_URL
        const secret = process.env.PAYLOAD_WEBHOOK_SECRET
        if (!medusaUrl || !secret) return

        const payload = {
          event: 'vertical.update',
          collection: 'verticals',
          operation: 'update',
          data: doc,
        }

        const crypto = await import('crypto')
        const signature = crypto
          .createHmac('sha256', secret)
          .update(JSON.stringify(payload))
          .digest('hex')

        try {
          await fetch(`${medusaUrl}/admin/webhooks/payload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Payload-Signature': signature,
            },
            body: JSON.stringify(payload),
          })
        } catch (err) {
          console.error('[Webhook] vertical.update failed:', err)
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL-friendly identifier (e.g., "restaurants")' },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'icon',
      type: 'text',
      admin: { description: 'Icon name or emoji (e.g., "🍕", "utensils")' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'medusaEndpoint',
      type: 'text',
      required: true,
      admin: {
        description: 'Backend API path (e.g., "/store/restaurants")',
      },
    },
    {
      name: 'isEnabled',
      type: 'checkbox',
      defaultValue: true,
      index: true,
    },
    {
      name: 'governanceRequired',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'If true, governance policies must allow this vertical',
      },
    },
    {
      name: 'cardSchema',
      type: 'json',
      admin: {
        description:
          'JSON defining which fields appear on list cards. Example: { "fields": ["title", "price", "rating", "thumbnail"] }',
      },
    },
    {
      name: 'detailSchema',
      type: 'json',
      admin: {
        description:
          'JSON defining which fields appear on detail pages. Example: { "sections": [{ "title": "Overview", "fields": ["description", "gallery"] }] }',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
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
      index: true,
    },
  ],
}
```

---

### 5.5 Nodes

File: `apps/orchestrator/src/collections/Nodes.ts`

```ts
import type { CollectionConfig } from 'payload'

export const Nodes: CollectionConfig = {
  slug: 'nodes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'code', 'tenant', 'depth', 'status'],
    group: 'Hierarchy',
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.tenant) return { tenant: { equals: req.user.tenant } }
      return { status: { equals: 'active' } }
    },
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.tenant) return { tenant: { equals: req.user.tenant } }
      return false
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'code',
      type: 'text',
      index: true,
      admin: { description: 'Short code (e.g., "RYD", "DXB-D1")' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'City', value: 'CITY' },
        { label: 'District', value: 'DISTRICT' },
        { label: 'Zone', value: 'ZONE' },
        { label: 'Facility', value: 'FACILITY' },
        { label: 'Asset', value: 'ASSET' },
      ],
      index: true,
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'nodes',
      admin: { description: 'Parent node in the hierarchy' },
    },
    {
      name: 'coordinates',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
    { name: 'address', type: 'text' },
    { name: 'city', type: 'text' },
    { name: 'country', type: 'text' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Archived', value: 'archived' },
      ],
      index: true,
    },
    {
      name: 'depth',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Depth in hierarchy (0=CITY, 1=DISTRICT, 2=ZONE, 3=FACILITY, 4=ASSET)',
      },
    },
    {
      name: 'metadata',
      type: 'json',
    },
  ],
}
```

---

### 5.6 Media

File: `apps/orchestrator/src/collections/Media.ts`

```ts
import type { CollectionConfig } from 'payload'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: path.resolve(__dirname, '../../media'),
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 150,
        height: 150,
        position: 'centre',
      },
      {
        name: 'card',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 600,
        position: 'centre',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'tenant', 'filename', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.tenant) {
        return {
          or: [
            { tenant: { exists: false } },
            { tenant: { equals: req.user.tenant } },
          ],
        }
      }
      return { tenant: { exists: false } }
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.tenant) return { tenant: { equals: req.user.tenant } }
      return false
    },
    delete: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.tenant) return { tenant: { equals: req.user.tenant } }
      return false
    },
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create' && !data.tenant && req.user?.tenant) {
          data.tenant = req.user.tenant
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Alt text for accessibility' },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      index: true,
      admin: { description: 'Tenant this media belongs to (empty = public)' },
    },
    {
      name: 'caption',
      type: 'textarea',
      localized: true,
    },
  ],
}
```

> **Production note:** When S3 is configured via the `@payloadcms/storage-s3` plugin, set `staticDir` to a temporary path. The plugin overrides the upload destination automatically.

---

## 6. Block Types

Each block is defined in its own file under `apps/orchestrator/src/blocks/`. Below is the complete specification for all 18 block types.

### 6.1 Hero Block

```ts
// apps/orchestrator/src/blocks/hero.ts
import type { Block } from 'payload'

export const heroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'heading', type: 'text', required: true, localized: true },
    { name: 'subheading', type: 'textarea', localized: true },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
    { name: 'ctaText', type: 'text', localized: true },
    { name: 'ctaLink', type: 'text' },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'overlay',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
}
```

### 6.2 Content Block

```ts
// apps/orchestrator/src/blocks/content.ts
import type { Block } from 'payload'

export const contentBlock: Block = {
  slug: 'content',
  labels: { singular: 'Content', plural: 'Content Blocks' },
  fields: [
    { name: 'richText', type: 'richText', required: true, localized: true },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
}
```

### 6.3 Products Block

```ts
// apps/orchestrator/src/blocks/products.ts
import type { Block } from 'payload'

export const productsBlock: Block = {
  slug: 'products',
  labels: { singular: 'Products', plural: 'Products Blocks' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'medusaQuery',
      type: 'json',
      required: true,
      admin: {
        description:
          'Medusa product query filter. Example: { "category_id": ["cat_123"], "limit": 8 }',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'List', value: 'list' },
      ],
    },
    { name: 'limit', type: 'number', defaultValue: 8 },
    {
      name: 'regionId',
      type: 'text',
      admin: { description: 'Medusa region ID for price resolution' },
    },
  ],
}
```

### 6.4 Features Block

```ts
// apps/orchestrator/src/blocks/features.ts
import type { Block } from 'payload'

export const featuresBlock: Block = {
  slug: 'features',
  labels: { singular: 'Features', plural: 'Features Blocks' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'icon', type: 'text' },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'link', type: 'text' },
      ],
    },
  ],
}
```

### 6.5 CTA Block

```ts
// apps/orchestrator/src/blocks/cta.ts
import type { Block } from 'payload'

export const ctaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to Action', plural: 'CTAs' },
  fields: [
    { name: 'heading', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'buttonText', type: 'text', required: true, localized: true },
    { name: 'buttonLink', type: 'text', required: true },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
      ],
    },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
  ],
}
```

### 6.6 Vertical Grid Block

```ts
// apps/orchestrator/src/blocks/vertical-grid.ts
import type { Block } from 'payload'

export const verticalGridBlock: Block = {
  slug: 'vertical-grid',
  labels: { singular: 'Vertical Grid', plural: 'Vertical Grids' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'verticalSlug', type: 'text', required: true },
    { name: 'medusaEndpoint', type: 'text', required: true },
    { name: 'limit', type: 'number', defaultValue: 12 },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    {
      name: 'cardLayout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' },
        { label: 'Map', value: 'map' },
      ],
    },
    {
      name: 'filters',
      type: 'json',
      admin: {
        description: 'JSON filter config. Example: { "cuisine": ["italian", "japanese"] }',
      },
    },
  ],
}
```

### 6.7 Vertical Detail Block

```ts
// apps/orchestrator/src/blocks/vertical-detail.ts
import type { Block } from 'payload'

export const verticalDetailBlock: Block = {
  slug: 'vertical-detail',
  labels: { singular: 'Vertical Detail', plural: 'Vertical Details' },
  fields: [
    { name: 'verticalSlug', type: 'text', required: true },
    { name: 'medusaEndpoint', type: 'text', required: true },
    {
      name: 'sections',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        {
          name: 'fields',
          type: 'array',
          fields: [
            { name: 'fieldName', type: 'text', required: true },
            {
              name: 'fieldType',
              type: 'select',
              options: [
                { label: 'Text', value: 'text' },
                { label: 'Rich Text', value: 'richtext' },
                { label: 'Image', value: 'image' },
                { label: 'Price', value: 'price' },
                { label: 'Rating', value: 'rating' },
                { label: 'Date', value: 'date' },
              ],
            },
            { name: 'label', type: 'text', localized: true },
          ],
        },
      ],
    },
    { name: 'relatedItemsLimit', type: 'number', defaultValue: 4 },
  ],
}
```

### 6.8 Image Gallery Block

```ts
// apps/orchestrator/src/blocks/image-gallery.ts
import type { Block } from 'payload'

export const imageGalleryBlock: Block = {
  slug: 'image-gallery',
  labels: { singular: 'Image Gallery', plural: 'Image Galleries' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'images',
      type: 'array',
      required: true,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text', localized: true },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Masonry', value: 'masonry' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
  ],
}
```

### 6.9 Testimonials Block

```ts
// apps/orchestrator/src/blocks/testimonials.ts
import type { Block } from 'payload'

export const testimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonials', plural: 'Testimonials Blocks' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'quote', type: 'textarea', required: true, localized: true },
        { name: 'author', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'avatar', type: 'upload', relationTo: 'media' },
        { name: 'rating', type: 'number', min: 1, max: 5 },
      ],
    },
  ],
}
```

### 6.10 Stats Block

```ts
// apps/orchestrator/src/blocks/stats.ts
import type { Block } from 'payload'

export const statsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Stats', plural: 'Stats Blocks' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'icon', type: 'text' },
        { name: 'suffix', type: 'text' },
      ],
    },
  ],
}
```

### 6.11 Map Block

```ts
// apps/orchestrator/src/blocks/map.ts
import type { Block } from 'payload'

export const mapBlock: Block = {
  slug: 'map',
  labels: { singular: 'Map', plural: 'Maps' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'center',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number', required: true },
        { name: 'lng', type: 'number', required: true },
      ],
    },
    { name: 'zoom', type: 'number', defaultValue: 12, min: 1, max: 20 },
    {
      name: 'markers',
      type: 'array',
      fields: [
        { name: 'lat', type: 'number', required: true },
        { name: 'lng', type: 'number', required: true },
        { name: 'label', type: 'text', localized: true },
        { name: 'link', type: 'text' },
      ],
    },
  ],
}
```

### 6.12 Node Hierarchy Block

```ts
// apps/orchestrator/src/blocks/node-hierarchy.ts
import type { Block } from 'payload'

export const nodeHierarchyBlock: Block = {
  slug: 'node-hierarchy',
  labels: { singular: 'Node Hierarchy', plural: 'Node Hierarchies' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'rootNodeId',
      type: 'relationship',
      relationTo: 'nodes',
      admin: { description: 'Starting node for hierarchy display' },
    },
    { name: 'maxDepth', type: 'number', defaultValue: 3, min: 1, max: 5 },
    {
      name: 'displayMode',
      type: 'select',
      defaultValue: 'tree',
      options: [
        { label: 'Tree', value: 'tree' },
        { label: 'Cards', value: 'cards' },
        { label: 'Breadcrumb', value: 'breadcrumb' },
      ],
    },
  ],
}
```

### 6.13 FAQ Block

```ts
// apps/orchestrator/src/blocks/faq.ts
import type { Block } from 'payload'

export const faqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'question', type: 'text', required: true, localized: true },
        { name: 'answer', type: 'richText', required: true, localized: true },
      ],
    },
  ],
}
```

### 6.14 Pricing Block

```ts
// apps/orchestrator/src/blocks/pricing.ts
import type { Block } from 'payload'

export const pricingBlock: Block = {
  slug: 'pricing',
  labels: { singular: 'Pricing', plural: 'Pricing Blocks' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'plans',
      type: 'array',
      required: true,
      fields: [
        { name: 'name', type: 'text', required: true, localized: true },
        { name: 'price', type: 'number', required: true },
        { name: 'currency', type: 'text', defaultValue: 'SAR' },
        {
          name: 'interval',
          type: 'select',
          options: [
            { label: 'Monthly', value: 'month' },
            { label: 'Yearly', value: 'year' },
            { label: 'One-time', value: 'one-time' },
          ],
        },
        {
          name: 'features',
          type: 'array',
          fields: [{ name: 'feature', type: 'text', required: true, localized: true }],
        },
        { name: 'ctaText', type: 'text', localized: true },
        { name: 'ctaLink', type: 'text' },
        { name: 'highlighted', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
```

### 6.15 Video Block

```ts
// apps/orchestrator/src/blocks/video.ts
import type { Block } from 'payload'

export const videoBlock: Block = {
  slug: 'video',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { description: 'YouTube, Vimeo, or direct video URL' },
    },
    { name: 'autoplay', type: 'checkbox', defaultValue: false },
    { name: 'muted', type: 'checkbox', defaultValue: true },
    { name: 'poster', type: 'upload', relationTo: 'media' },
  ],
}
```

### 6.16 Form Block

```ts
// apps/orchestrator/src/blocks/form.ts
import type { Block } from 'payload'

export const formBlock: Block = {
  slug: 'form',
  labels: { singular: 'Form', plural: 'Forms' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'formId',
      type: 'text',
      required: true,
      admin: {
        description:
          'Form builder ID. If using @payloadcms/plugin-form-builder, use a relationship field instead.',
      },
    },
  ],
}
```

### 6.17 Embed Block

```ts
// apps/orchestrator/src/blocks/embed.ts
import type { Block } from 'payload'

export const embedBlock: Block = {
  slug: 'embed',
  labels: { singular: 'Embed', plural: 'Embeds' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'html',
      type: 'code',
      required: true,
      admin: {
        language: 'html',
        description: 'Raw HTML embed code (iframes, widgets, etc.)',
      },
    },
    {
      name: 'maxWidth',
      type: 'text',
      defaultValue: '100%',
      admin: { description: 'CSS max-width (e.g., "800px", "100%")' },
    },
  ],
}
```

### 6.18 Navigation Cards Block

```ts
// apps/orchestrator/src/blocks/navigation-cards.ts
import type { Block } from 'payload'

export const navigationCardsBlock: Block = {
  slug: 'navigation-cards',
  labels: { singular: 'Navigation Cards', plural: 'Navigation Cards Blocks' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'cards',
      type: 'array',
      required: true,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'icon', type: 'text' },
        { name: 'link', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
```

---

## 7. Globals

### 7.1 SiteSettings

File: `apps/orchestrator/src/globals/SiteSettings.ts`

```ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'defaultTenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: { description: 'The default tenant used when none is specified' },
    },
    {
      name: 'maintenanceMode',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'analyticsId',
      type: 'text',
      admin: { description: 'Google Analytics / GTM ID' },
    },
    {
      name: 'supportedLocales',
      type: 'array',
      fields: [
        {
          name: 'code',
          type: 'select',
          required: true,
          options: [
            { label: 'English', value: 'en' },
            { label: 'Français', value: 'fr' },
            { label: 'العربية', value: 'ar' },
          ],
        },
        { name: 'label', type: 'text', required: true },
        { name: 'isDefault', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
```

### 7.2 ThemeConfig

File: `apps/orchestrator/src/globals/ThemeConfig.ts`

```ts
import type { GlobalConfig } from 'payload'

export const ThemeConfig: GlobalConfig = {
  slug: 'theme-config',
  label: 'Theme Configuration',
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'colors',
      type: 'group',
      fields: [
        { name: 'primary', type: 'text', defaultValue: '#1a1a2e' },
        { name: 'secondary', type: 'text', defaultValue: '#16213e' },
        { name: 'accent', type: 'text', defaultValue: '#e94560' },
        { name: 'background', type: 'text', defaultValue: '#ffffff' },
        { name: 'text', type: 'text', defaultValue: '#1a1a2e' },
        { name: 'muted', type: 'text', defaultValue: '#6b7280' },
      ],
    },
    {
      name: 'fonts',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Inter' },
        { name: 'body', type: 'text', defaultValue: 'Inter' },
        { name: 'mono', type: 'text', defaultValue: 'JetBrains Mono' },
        {
          name: 'arabicFont',
          type: 'text',
          defaultValue: 'Noto Sans Arabic',
          admin: { description: 'Font for Arabic locale' },
        },
      ],
    },
    {
      name: 'spacing',
      type: 'group',
      fields: [
        { name: 'containerMaxWidth', type: 'text', defaultValue: '1280px' },
        { name: 'sectionPadding', type: 'text', defaultValue: '4rem' },
      ],
    },
    {
      name: 'breakpoints',
      type: 'group',
      fields: [
        { name: 'sm', type: 'text', defaultValue: '640px' },
        { name: 'md', type: 'text', defaultValue: '768px' },
        { name: 'lg', type: 'text', defaultValue: '1024px' },
        { name: 'xl', type: 'text', defaultValue: '1280px' },
      ],
    },
    {
      name: 'tenantOverrides',
      type: 'array',
      admin: { description: 'Per-tenant theme overrides' },
      fields: [
        {
          name: 'tenant',
          type: 'relationship',
          relationTo: 'tenants',
          required: true,
        },
        { name: 'primaryColor', type: 'text' },
        { name: 'accentColor', type: 'text' },
        { name: 'headingFont', type: 'text' },
        { name: 'bodyFont', type: 'text' },
        { name: 'logoOverride', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
```

---

## 8. Access Control

### Role Matrix

| Action | `admin` | `editor` | `viewer` | API Key / Public |
|--------|---------|----------|----------|-----------------|
| Read all tenants | ✅ | ❌ | ❌ | ❌ |
| Read own tenant | ✅ | ✅ | ✅ | ✅ |
| Create pages | ✅ | ✅ | ❌ | ❌ |
| Edit own tenant pages | ✅ | ✅ | ❌ | ❌ |
| Delete pages | ✅ | ❌ | ❌ | ❌ |
| Read published pages | ✅ | ✅ | ✅ | ✅ |
| Read draft pages | ✅ | ✅ | ❌ | ❌ |
| Manage navigations | ✅ | ✅ | ❌ | ❌ |
| Manage verticals | ✅ | ❌ | ❌ | ❌ |
| Upload media | ✅ | ✅ | ❌ | ❌ |
| Read media | ✅ | ✅ | ✅ | ✅ (public only) |
| Manage globals | ✅ | ❌ | ❌ | ❌ |

### API Key Access for Medusa Sync

Create an API key in the Payload admin panel for the Medusa backend to use when querying CMS content:

1. Go to **API Keys** collection in Payload admin
2. Create a key with scopes: `pages:read`, `navigations:read`, `verticals:read`, `media:read`
3. Assign it to the Dakkah tenant
4. Use the generated key in the storefront as the `PAYLOAD_API_KEY` header:

```ts
// Storefront API call example
const response = await fetch(
  `${PAYLOAD_CMS_URL}/api/pages?where[tenant][equals]=${TENANT_ID}&where[status][equals]=published`,
  {
    headers: {
      Authorization: `Api-Key ${PAYLOAD_API_KEY}`,
    },
  }
)
```

---

## 9. Webhooks Configuration

### Events

The following events trigger a webhook `POST` to `{MEDUSA_BACKEND_URL}/admin/webhooks/payload`:

| Event | Trigger |
|-------|---------|
| `page.create` | New page is created with `status: published` |
| `page.update` | Published page is updated |
| `page.publish` | Page transitions from `draft` to `published` |
| `page.delete` | Page is deleted |
| `navigation.update` | Any navigation document is saved |
| `vertical.update` | Any vertical document is saved |
| `tenant.update` | Any tenant document is saved |

### Signature Verification

Every webhook includes an `X-Payload-Signature` header containing an HMAC-SHA256 signature:

```
X-Payload-Signature: <HMAC-SHA256(JSON.stringify(body), PAYLOAD_WEBHOOK_SECRET)>
```

**Verification on the Medusa side** (already implemented at `apps/backend/src/api/admin/webhooks/payload/route.ts`):

```ts
import crypto from 'crypto'

const secret = process.env.PAYLOAD_WEBHOOK_SECRET
const signature = req.headers['x-payload-signature'] as string
const expectedSig = crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify(req.body))
  .digest('hex')

if (signature !== expectedSig) {
  return res.status(401).json({ error: 'Invalid signature' })
}
```

### Webhook Body Format

```json
{
  "event": "page.update",
  "collection": "pages",
  "operation": "update",
  "data": {
    "id": "abc123",
    "title": "Restaurants",
    "slug": "restaurants",
    "path": "restaurants",
    "template": "vertical-list",
    "status": "published",
    "tenant": "01KGZ2JRYX607FWMMYQNQRKVWS",
    "verticalConfig": { ... },
    "layout": [ ... ],
    "seo": { ... }
  },
  "previousDoc": {
    "id": "abc123",
    "title": "Restaurants",
    "status": "draft"
  }
}
```

---

## 10. REST API Contract

The storefront (`apps/storefront/`) expects the following Payload REST endpoints. All responses follow the standard Payload pagination envelope.

### 10.1 Fetch a Page by Path

```http
GET /api/pages?where[path][equals]=restaurants&where[tenant][equals]=01KGZ2JRYX607FWMMYQNQRKVWS&where[status][equals]=published&where[locale][equals]=en&limit=1
```

**Response:**

```json
{
  "docs": [
    {
      "id": "page_abc123",
      "title": "Restaurants",
      "slug": "restaurants",
      "path": "restaurants",
      "template": "vertical-list",
      "locale": "en",
      "status": "published",
      "publishedAt": "2025-01-15T10:00:00.000Z",
      "tenant": "01KGZ2JRYX607FWMMYQNQRKVWS",
      "layout": [
        {
          "blockType": "hero",
          "heading": "Discover Restaurants",
          "subheading": "Find the best dining in your city",
          "backgroundImage": { "url": "/media/hero-restaurants.jpg" }
        },
        {
          "blockType": "vertical-grid",
          "verticalSlug": "restaurants",
          "medusaEndpoint": "/store/restaurants",
          "limit": 12,
          "columns": "3",
          "cardLayout": "grid"
        }
      ],
      "verticalConfig": {
        "verticalSlug": "restaurants",
        "medusaEndpoint": "/store/restaurants",
        "itemsPerPage": 12,
        "cardLayout": "grid",
        "filterFields": [
          { "fieldName": "cuisine", "fieldType": "select", "label": "Cuisine" },
          { "fieldName": "price_range", "fieldType": "range", "label": "Price Range" }
        ],
        "sortFields": [
          { "fieldName": "rating", "label": "Rating", "defaultDirection": "desc" },
          { "fieldName": "name", "label": "Name", "defaultDirection": "asc" }
        ]
      },
      "seo": {
        "title": "Restaurants - Dakkah",
        "description": "Browse and order from the best restaurants in your city",
        "ogImage": { "url": "/media/og-restaurants.jpg" },
        "keywords": [{ "keyword": "restaurants" }, { "keyword": "food delivery" }]
      },
      "sortOrder": 1,
      "breadcrumbs": []
    }
  ],
  "totalDocs": 1,
  "limit": 1,
  "totalPages": 1,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": false
}
```

### 10.2 Fetch Child Pages

```http
GET /api/pages?where[parent][equals]=PARENT_ID&where[tenant][equals]=01KGZ2JRYX607FWMMYQNQRKVWS&where[status][equals]=published&sort=sortOrder&limit=100
```

**Response:**

```json
{
  "docs": [
    { "id": "...", "title": "Pizza Palace", "path": "restaurants/pizza-palace", "template": "vertical-detail", ... },
    { "id": "...", "title": "Sushi Haven", "path": "restaurants/sushi-haven", "template": "vertical-detail", ... }
  ],
  "totalDocs": 2,
  "limit": 100,
  "totalPages": 1,
  "page": 1
}
```

### 10.3 Fetch Navigation

```http
GET /api/navigations?where[tenant][equals]=01KGZ2JRYX607FWMMYQNQRKVWS&where[locale][equals]=en&where[location][equals]=header
```

**Response:**

```json
{
  "docs": [
    {
      "id": "nav_header_en",
      "name": "Header Navigation",
      "slug": "header-en",
      "location": "header",
      "locale": "en",
      "status": "active",
      "items": [
        { "label": "Home", "type": "page", "page": { "id": "...", "path": "" }, "icon": "home", "children": [] },
        { "label": "Restaurants", "type": "vertical", "url": "/restaurants", "icon": "utensils", "children": [] },
        { "label": "Healthcare", "type": "vertical", "url": "/healthcare", "icon": "heart", "children": [] },
        {
          "label": "More Services",
          "type": "url",
          "url": "#",
          "icon": "grid",
          "children": [
            { "label": "Education", "type": "vertical", "url": "/education", "icon": "book" },
            { "label": "Travel", "type": "vertical", "url": "/travel", "icon": "plane" }
          ]
        }
      ]
    }
  ],
  "totalDocs": 1
}
```

### 10.4 Fetch Enabled Verticals

```http
GET /api/verticals?where[tenant][equals]=01KGZ2JRYX607FWMMYQNQRKVWS&where[isEnabled][equals]=true&sort=sortOrder
```

**Response:**

```json
{
  "docs": [
    { "id": "v_1", "name": "Restaurants", "slug": "restaurants", "medusaEndpoint": "/store/restaurants", "icon": "🍕", "sortOrder": 1, "status": "active" },
    { "id": "v_2", "name": "Healthcare", "slug": "healthcare", "medusaEndpoint": "/store/healthcare", "icon": "🏥", "sortOrder": 2, "status": "active" },
    { "id": "v_3", "name": "Education", "slug": "education", "medusaEndpoint": "/store/education", "icon": "📚", "sortOrder": 3, "status": "active" }
  ],
  "totalDocs": 27
}
```

---

## 11. Data Migration Guide

For each of the 25+ hardcoded vertical routes currently at `apps/storefront/src/routes/$tenant/$locale/`, create corresponding CMS pages.

### Vertical → CMS Page Mapping

Each vertical needs **two** CMS pages:

| Vertical Slug | Index Page (vertical-list) | Detail Page (vertical-detail) |
|---------------|---------------------------|-------------------------------|
| `restaurants` | path: `restaurants`, medusaEndpoint: `/store/restaurants` | path: `restaurants/:id`, medusaEndpoint: `/store/restaurants` |
| `healthcare` | path: `healthcare`, medusaEndpoint: `/store/healthcare` | path: `healthcare/:id`, medusaEndpoint: `/store/healthcare` |
| `education` | path: `education`, medusaEndpoint: `/store/education` | path: `education/:id`, medusaEndpoint: `/store/education` |
| `real-estate` | path: `real-estate`, medusaEndpoint: `/store/real-estate` | path: `real-estate/:id`, medusaEndpoint: `/store/real-estate` |
| `travel` | path: `travel`, medusaEndpoint: `/store/travel` | path: `travel/:id`, medusaEndpoint: `/store/travel` |
| `grocery` | path: `grocery`, medusaEndpoint: `/store/grocery` | path: `grocery/:id`, medusaEndpoint: `/store/grocery` |
| `automotive` | path: `automotive`, medusaEndpoint: `/store/automotive` | path: `automotive/:id`, medusaEndpoint: `/store/automotive` |
| `events` | path: `events`, medusaEndpoint: `/store/event-ticketing` | path: `events/:id`, medusaEndpoint: `/store/event-ticketing` |
| `digital-products` | path: `digital-products`, medusaEndpoint: `/store/digital-products` | path: `digital-products/:id`, medusaEndpoint: `/store/digital-products` |
| `classifieds` | path: `classifieds`, medusaEndpoint: `/store/classifieds` | path: `classifieds/:id`, medusaEndpoint: `/store/classifieds` |
| `rentals` | path: `rentals`, medusaEndpoint: `/store/rentals` | path: `rentals/:id`, medusaEndpoint: `/store/rentals` |
| `auctions` | path: `auctions`, medusaEndpoint: `/store/auctions` | path: `auctions/:id`, medusaEndpoint: `/store/auctions` |
| `crowdfunding` | path: `crowdfunding`, medusaEndpoint: `/store/crowdfunding` | path: `crowdfunding/:id`, medusaEndpoint: `/store/crowdfunding` |
| `financial-products` | path: `financial-products`, medusaEndpoint: `/store/financial-products` | path: `financial-products/:id`, medusaEndpoint: `/store/financial-products` |
| `pet-services` | path: `pet-services`, medusaEndpoint: `/store/pet-services` | path: `pet-services/:id`, medusaEndpoint: `/store/pet-services` |
| `utilities` | path: `utilities`, medusaEndpoint: `/store/utilities` | path: `utilities/:id`, medusaEndpoint: `/store/utilities` |
| `parking` | path: `parking`, medusaEndpoint: `/store/parking` | path: `parking/:id`, medusaEndpoint: `/store/parking` |
| `government` | path: `government`, medusaEndpoint: `/store/government` | path: `government/:id`, medusaEndpoint: `/store/government` |
| `charity` | path: `charity`, medusaEndpoint: `/store/charity` | path: `charity/:id`, medusaEndpoint: `/store/charity` |
| `legal` | path: `legal`, medusaEndpoint: `/store/legal` | path: `legal/:id`, medusaEndpoint: `/store/legal` |
| `fitness` | path: `fitness`, medusaEndpoint: `/store/fitness` | path: `fitness/:id`, medusaEndpoint: `/store/fitness` |
| `freelance` | path: `freelance`, medusaEndpoint: `/store/freelance` | path: `freelance/:id`, medusaEndpoint: `/store/freelance` |
| `social-commerce` | path: `social-commerce`, medusaEndpoint: `/store/social-commerce` | path: `social-commerce/:id`, medusaEndpoint: `/store/social-commerce` |
| `memberships` | path: `memberships`, medusaEndpoint: `/store/memberships` | path: `memberships/:id`, medusaEndpoint: `/store/memberships` |
| `warranties` | path: `warranties`, medusaEndpoint: `/store/warranties` | path: `warranties/:id`, medusaEndpoint: `/store/warranties` |
| `advertising` | path: `advertising`, medusaEndpoint: `/store/advertising` | path: `advertising/:id`, medusaEndpoint: `/store/advertising` |
| `affiliates` | path: `affiliates`, medusaEndpoint: `/store/affiliates` | path: `affiliates/:id`, medusaEndpoint: `/store/affiliates` |

---

## 12. Seed Data Script

Create a seed script at `apps/orchestrator/src/seed.ts` to populate the Dakkah tenant with initial data.

```ts
import type { Payload } from 'payload'

const DAKKAH_TENANT_ID = '01KGZ2JRYX607FWMMYQNQRKVWS'

interface VerticalDef {
  name: string
  slug: string
  medusaEndpoint: string
  icon: string
  sortOrder: number
}

const VERTICALS: VerticalDef[] = [
  { name: 'Restaurants', slug: 'restaurants', medusaEndpoint: '/store/restaurants', icon: '🍕', sortOrder: 1 },
  { name: 'Healthcare', slug: 'healthcare', medusaEndpoint: '/store/healthcare', icon: '🏥', sortOrder: 2 },
  { name: 'Education', slug: 'education', medusaEndpoint: '/store/education', icon: '📚', sortOrder: 3 },
  { name: 'Real Estate', slug: 'real-estate', medusaEndpoint: '/store/real-estate', icon: '🏠', sortOrder: 4 },
  { name: 'Travel', slug: 'travel', medusaEndpoint: '/store/travel', icon: '✈️', sortOrder: 5 },
  { name: 'Grocery', slug: 'grocery', medusaEndpoint: '/store/grocery', icon: '🛒', sortOrder: 6 },
  { name: 'Automotive', slug: 'automotive', medusaEndpoint: '/store/automotive', icon: '🚗', sortOrder: 7 },
  { name: 'Events', slug: 'events', medusaEndpoint: '/store/event-ticketing', icon: '🎫', sortOrder: 8 },
  { name: 'Digital Products', slug: 'digital-products', medusaEndpoint: '/store/digital-products', icon: '💾', sortOrder: 9 },
  { name: 'Classifieds', slug: 'classifieds', medusaEndpoint: '/store/classifieds', icon: '📋', sortOrder: 10 },
  { name: 'Rentals', slug: 'rentals', medusaEndpoint: '/store/rentals', icon: '🏡', sortOrder: 11 },
  { name: 'Auctions', slug: 'auctions', medusaEndpoint: '/store/auctions', icon: '🔨', sortOrder: 12 },
  { name: 'Crowdfunding', slug: 'crowdfunding', medusaEndpoint: '/store/crowdfunding', icon: '🤝', sortOrder: 13 },
  { name: 'Financial Products', slug: 'financial-products', medusaEndpoint: '/store/financial-products', icon: '💰', sortOrder: 14 },
  { name: 'Pet Services', slug: 'pet-services', medusaEndpoint: '/store/pet-services', icon: '🐾', sortOrder: 15 },
  { name: 'Utilities', slug: 'utilities', medusaEndpoint: '/store/utilities', icon: '⚡', sortOrder: 16 },
  { name: 'Parking', slug: 'parking', medusaEndpoint: '/store/parking', icon: '🅿️', sortOrder: 17 },
  { name: 'Government', slug: 'government', medusaEndpoint: '/store/government', icon: '🏛️', sortOrder: 18 },
  { name: 'Charity', slug: 'charity', medusaEndpoint: '/store/charity', icon: '❤️', sortOrder: 19 },
  { name: 'Legal', slug: 'legal', medusaEndpoint: '/store/legal', icon: '⚖️', sortOrder: 20 },
  { name: 'Fitness', slug: 'fitness', medusaEndpoint: '/store/fitness', icon: '💪', sortOrder: 21 },
  { name: 'Freelance', slug: 'freelance', medusaEndpoint: '/store/freelance', icon: '👩‍💻', sortOrder: 22 },
  { name: 'Social Commerce', slug: 'social-commerce', medusaEndpoint: '/store/social-commerce', icon: '📱', sortOrder: 23 },
  { name: 'Memberships', slug: 'memberships', medusaEndpoint: '/store/memberships', icon: '🎖️', sortOrder: 24 },
  { name: 'Warranties', slug: 'warranties', medusaEndpoint: '/store/warranties', icon: '🛡️', sortOrder: 25 },
  { name: 'Advertising', slug: 'advertising', medusaEndpoint: '/store/advertising', icon: '📣', sortOrder: 26 },
  { name: 'Affiliates', slug: 'affiliates', medusaEndpoint: '/store/affiliates', icon: '🔗', sortOrder: 27 },
]

export async function seed(payload: Payload): Promise<void> {
  console.log('🌱 Starting Dakkah CityOS seed...')

  // ── 1. Create or verify Dakkah tenant ──
  const existingTenants = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: 'dakkah' } },
    limit: 1,
  })

  let tenantId: string
  if (existingTenants.docs.length > 0) {
    tenantId = existingTenants.docs[0].id
    console.log(`  ✓ Tenant "Dakkah" already exists: ${tenantId}`)
  } else {
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        name: 'Dakkah',
        slug: 'dakkah',
        domain: 'dakkah.com',
        residencyZone: 'GCC',
        status: 'active',
        defaultLocale: 'en',
        supportedLocales: [
          { locale: 'en' },
          { locale: 'fr' },
          { locale: 'ar' },
        ],
        timezone: 'Asia/Riyadh',
        currency: 'SAR',
        primaryColor: '#1a1a2e',
        accentColor: '#e94560',
        settings: {},
      },
    })
    tenantId = tenant.id
    console.log(`  ✓ Created tenant "Dakkah": ${tenantId}`)
  }

  // ── 2. Create verticals ──
  for (const v of VERTICALS) {
    const existing = await payload.find({
      collection: 'verticals',
      where: {
        and: [
          { slug: { equals: v.slug } },
          { tenant: { equals: tenantId } },
        ],
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'verticals',
        data: {
          name: v.name,
          slug: v.slug,
          tenant: tenantId,
          medusaEndpoint: v.medusaEndpoint,
          icon: v.icon,
          isEnabled: true,
          governanceRequired: false,
          sortOrder: v.sortOrder,
          status: 'active',
        },
      })
      console.log(`  ✓ Created vertical: ${v.name}`)
    }
  }

  // ── 3. Create Home page ──
  const existingHome = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { path: { equals: '' } },
        { tenant: { equals: tenantId } },
        { template: { equals: 'home' } },
      ],
    },
    limit: 1,
  })

  if (existingHome.docs.length === 0) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Welcome to Dakkah',
        slug: 'home',
        path: '',
        tenant: tenantId,
        locale: 'en',
        template: 'home',
        status: 'published',
        publishedAt: new Date().toISOString(),
        sortOrder: 0,
        layout: [
          {
            blockType: 'hero',
            heading: 'Welcome to Dakkah',
            subheading: 'Your city, your services, one platform',
            ctaText: 'Explore Services',
            ctaLink: '/restaurants',
            alignment: 'center',
            overlay: 'dark',
          },
          {
            blockType: 'navigation-cards',
            title: 'Popular Services',
            cards: VERTICALS.slice(0, 8).map((v) => ({
              title: v.name,
              description: `Browse ${v.name.toLowerCase()} in your area`,
              icon: v.icon,
              link: `/${v.slug}`,
            })),
          },
          {
            blockType: 'stats',
            title: 'Dakkah in Numbers',
            items: [
              { value: '25+', label: 'Service Categories', icon: '📦' },
              { value: '1000+', label: 'Vendors', icon: '🏪' },
              { value: '50K+', label: 'Products', icon: '🛍️' },
              { value: '3', label: 'Languages', icon: '🌍' },
            ],
          },
        ],
        seo: {
          title: 'Dakkah - Your City Super App',
          description:
            'Dakkah is the super app for all city and lifestyle services. Shop, dine, book, and more.',
        },
      },
    })
    console.log('  ✓ Created Home page')
  }

  // ── 4. Create vertical index pages ──
  for (const v of VERTICALS) {
    const existing = await payload.find({
      collection: 'pages',
      where: {
        and: [
          { path: { equals: v.slug } },
          { tenant: { equals: tenantId } },
        ],
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'pages',
        data: {
          title: v.name,
          slug: v.slug,
          path: v.slug,
          tenant: tenantId,
          locale: 'en',
          template: 'vertical-list',
          status: 'published',
          publishedAt: new Date().toISOString(),
          sortOrder: v.sortOrder,
          verticalConfig: {
            verticalSlug: v.slug,
            medusaEndpoint: v.medusaEndpoint,
            itemsPerPage: 12,
            cardLayout: 'grid',
          },
          layout: [
            {
              blockType: 'hero',
              heading: v.name,
              subheading: `Discover the best ${v.name.toLowerCase()} services`,
              alignment: 'center',
              overlay: 'dark',
            },
            {
              blockType: 'vertical-grid',
              title: `All ${v.name}`,
              verticalSlug: v.slug,
              medusaEndpoint: v.medusaEndpoint,
              limit: 12,
              columns: '3',
              cardLayout: 'grid',
            },
          ],
          seo: {
            title: `${v.name} - Dakkah`,
            description: `Browse and discover ${v.name.toLowerCase()} on Dakkah`,
          },
        },
      })
      console.log(`  ✓ Created index page: ${v.slug}`)
    }

    // Detail page template
    const detailPath = `${v.slug}/:id`
    const existingDetail = await payload.find({
      collection: 'pages',
      where: {
        and: [
          { path: { equals: detailPath } },
          { tenant: { equals: tenantId } },
        ],
      },
      limit: 1,
    })

    if (existingDetail.docs.length === 0) {
      await payload.create({
        collection: 'pages',
        data: {
          title: `${v.name} Detail`,
          slug: `${v.slug}-detail`,
          path: detailPath,
          tenant: tenantId,
          locale: 'en',
          template: 'vertical-detail',
          status: 'published',
          publishedAt: new Date().toISOString(),
          sortOrder: v.sortOrder,
          verticalConfig: {
            verticalSlug: v.slug,
            medusaEndpoint: v.medusaEndpoint,
            itemsPerPage: 1,
            cardLayout: 'grid',
          },
          layout: [
            {
              blockType: 'vertical-detail',
              verticalSlug: v.slug,
              medusaEndpoint: v.medusaEndpoint,
              sections: [
                {
                  title: 'Overview',
                  fields: [
                    { fieldName: 'description', fieldType: 'richtext', label: 'Description' },
                    { fieldName: 'images', fieldType: 'image', label: 'Gallery' },
                  ],
                },
                {
                  title: 'Details',
                  fields: [
                    { fieldName: 'price', fieldType: 'price', label: 'Price' },
                    { fieldName: 'rating', fieldType: 'rating', label: 'Rating' },
                  ],
                },
              ],
              relatedItemsLimit: 4,
            },
          ],
          seo: {
            title: `${v.name} - Dakkah`,
            description: `View details for ${v.name.toLowerCase()} on Dakkah`,
          },
        },
      })
      console.log(`  ✓ Created detail page template: ${detailPath}`)
    }
  }

  // ── 5. Create static pages ──
  const staticPages = [
    {
      title: 'About Dakkah',
      slug: 'about',
      path: 'about',
      layout: [
        {
          blockType: 'hero',
          heading: 'About Dakkah',
          subheading: 'The city super app for all your services',
          alignment: 'center',
          overlay: 'dark',
        },
        {
          blockType: 'content',
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Dakkah is the comprehensive platform powering 25+ commerce verticals — from shopping and dining to healthcare, education, real estate, and beyond. Built for cities that want to offer residents a unified digital experience.',
                    },
                  ],
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          alignment: 'left',
        },
        {
          blockType: 'features',
          title: 'Why Dakkah?',
          items: [
            { icon: '🏙️', title: 'Multi-City', description: 'Operate across multiple cities with a single platform', link: '' },
            { icon: '🌍', title: 'Multilingual', description: 'Full support for English, French, and Arabic (RTL)', link: '' },
            { icon: '🏛️', title: 'Governance', description: 'Built-in compliance with local regulations', link: '' },
            { icon: '🛡️', title: 'Data Residency', description: 'Keep data where it belongs — GCC, EU, and beyond', link: '' },
          ],
        },
      ],
      seo: {
        title: 'About - Dakkah',
        description: 'Learn about Dakkah, the city super app for all your services',
      },
    },
    {
      title: 'Contact Us',
      slug: 'contact',
      path: 'contact',
      layout: [
        {
          blockType: 'hero',
          heading: 'Contact Us',
          subheading: 'We\'d love to hear from you',
          alignment: 'center',
          overlay: 'dark',
        },
        {
          blockType: 'content',
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Reach out to us at support@dakkah.com or visit our offices in Riyadh, Dubai, and Cairo.',
                    },
                  ],
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          alignment: 'center',
        },
      ],
      seo: {
        title: 'Contact - Dakkah',
        description: 'Get in touch with the Dakkah team',
      },
    },
  ]

  for (const page of staticPages) {
    const existing = await payload.find({
      collection: 'pages',
      where: {
        and: [
          { path: { equals: page.path } },
          { tenant: { equals: tenantId } },
        ],
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'pages',
        data: {
          ...page,
          tenant: tenantId,
          locale: 'en',
          template: 'static',
          status: 'published',
          publishedAt: new Date().toISOString(),
          sortOrder: 100,
        },
      })
      console.log(`  ✓ Created static page: ${page.slug}`)
    }
  }

  // ── 6. Create navigation menus ──
  const headerNav = await payload.find({
    collection: 'navigations',
    where: {
      and: [
        { slug: { equals: 'header-en' } },
        { tenant: { equals: tenantId } },
      ],
    },
    limit: 1,
  })

  if (headerNav.docs.length === 0) {
    await payload.create({
      collection: 'navigations',
      data: {
        name: 'Header Navigation',
        slug: 'header-en',
        tenant: tenantId,
        locale: 'en',
        location: 'header',
        status: 'active',
        items: [
          { label: 'Home', type: 'url', url: '/', icon: 'home', children: [] },
          { label: 'Restaurants', type: 'vertical', url: '/restaurants', icon: 'utensils', children: [] },
          { label: 'Healthcare', type: 'vertical', url: '/healthcare', icon: 'heart', children: [] },
          { label: 'Education', type: 'vertical', url: '/education', icon: 'book', children: [] },
          { label: 'Real Estate', type: 'vertical', url: '/real-estate', icon: 'building', children: [] },
          {
            label: 'More',
            type: 'url',
            url: '#',
            icon: 'grid',
            children: [
              { label: 'Travel', type: 'vertical', url: '/travel', icon: 'plane', children: [] },
              { label: 'Grocery', type: 'vertical', url: '/grocery', icon: 'cart', children: [] },
              { label: 'Automotive', type: 'vertical', url: '/automotive', icon: 'car', children: [] },
              { label: 'Events', type: 'vertical', url: '/events', icon: 'ticket', children: [] },
              { label: 'Fitness', type: 'vertical', url: '/fitness', icon: 'dumbbell', children: [] },
            ],
          },
        ],
      },
    })
    console.log('  ✓ Created header navigation (en)')
  }

  const footerNav = await payload.find({
    collection: 'navigations',
    where: {
      and: [
        { slug: { equals: 'footer-en' } },
        { tenant: { equals: tenantId } },
      ],
    },
    limit: 1,
  })

  if (footerNav.docs.length === 0) {
    await payload.create({
      collection: 'navigations',
      data: {
        name: 'Footer Navigation',
        slug: 'footer-en',
        tenant: tenantId,
        locale: 'en',
        location: 'footer',
        status: 'active',
        items: [
          {
            label: 'Company',
            type: 'url',
            url: '#',
            children: [
              { label: 'About', type: 'page', url: '/about', children: [] },
              { label: 'Contact', type: 'page', url: '/contact', children: [] },
            ],
          },
          {
            label: 'Services',
            type: 'url',
            url: '#',
            children: [
              { label: 'Restaurants', type: 'vertical', url: '/restaurants', children: [] },
              { label: 'Healthcare', type: 'vertical', url: '/healthcare', children: [] },
              { label: 'Education', type: 'vertical', url: '/education', children: [] },
              { label: 'Real Estate', type: 'vertical', url: '/real-estate', children: [] },
            ],
          },
          {
            label: 'Legal',
            type: 'url',
            url: '#',
            children: [
              { label: 'Privacy Policy', type: 'url', url: '/privacy', children: [] },
              { label: 'Terms of Service', type: 'url', url: '/terms', children: [] },
            ],
          },
        ],
      },
    })
    console.log('  ✓ Created footer navigation (en)')
  }

  console.log('🌱 Seed complete!')
}
```

### Running the Seed

```bash
# From the orchestrator directory
cd apps/orchestrator

# Run seed via Payload CLI
npx payload seed

# Or programmatically:
# In your server startup, call seed(payload) after Payload initializes
```

---

## 13. RTL & Locale Rendering Notes

### Storefront Integration

The storefront at `apps/storefront/` resolves locale from the URL pattern `/$tenant/$locale/...` and must:

1. **Set `dir` attribute** on `<html>` or layout wrapper:

```tsx
const dir = locale === 'ar' ? 'rtl' : 'ltr'
return <div dir={dir} lang={locale}>{children}</div>
```

2. **Pass locale to Payload API** calls:

```ts
const page = await fetch(
  `${PAYLOAD_CMS_URL}/api/pages?where[path][equals]=${slug}&where[tenant][equals]=${tenantId}&where[status][equals]=published&locale=${locale}&limit=1`
)
```

3. **Use CSS logical properties** for RTL-safe styling:

```css
/* Instead of margin-left, use: */
margin-inline-start: 1rem;

/* Instead of text-align: left, use: */
text-align: start;
```

4. **Arabic font loading** — include `Noto Sans Arabic` or tenant-configured Arabic font:

```css
[dir="rtl"] {
  font-family: 'Noto Sans Arabic', 'Inter', sans-serif;
}
```

### Payload Locale Parameter

When querying Payload with `?locale=ar`, the API returns:
- Localized fields (`title`, `seo.title`, `seo.description`, block content) in Arabic
- Non-localized fields (IDs, slugs, paths, relationships) unchanged
- If Arabic translation is missing, falls back to English (`fallback: true`)

---

## Checklist

Before going to production, verify:

- [ ] `PAYLOAD_SECRET` is a cryptographically random 32+ character string
- [ ] `DATABASE_URL` points to a production Postgres instance
- [ ] S3 storage is configured and `@payloadcms/storage-s3` plugin is active
- [ ] `PAYLOAD_WEBHOOK_SECRET` matches between Payload and Medusa
- [ ] All 27 vertical index pages and detail page templates are seeded
- [ ] Header and footer navigations exist for all 3 locales
- [ ] Arabic locale content has been reviewed for RTL rendering
- [ ] API key is created for storefront → Payload communication
- [ ] CORS includes the production storefront domain
- [ ] Webhook endpoint at Medusa (`/admin/webhooks/payload`) is accessible
- [ ] `sharp` is installed for image processing
- [ ] Media image sizes match storefront expectations (thumbnail, card, hero, og)
