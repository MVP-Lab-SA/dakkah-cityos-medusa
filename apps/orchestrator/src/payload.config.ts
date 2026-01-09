import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Countries } from './collections/Countries'
import { Scopes } from './collections/Scopes'
import { Categories } from './collections/Categories'
import { Subcategories } from './collections/Subcategories'
import { Tenants } from './collections/Tenants'
import { Stores } from './collections/Stores'
import { Portals } from './collections/Portals'
import { Users } from './collections/Users'
import { ApiKeys } from './collections/ApiKeys'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { ProductContent } from './collections/ProductContent'
import { IntegrationEndpoints } from './collections/IntegrationEndpoints'
import { WebhookLogs } from './collections/WebhookLogs'
import { SyncJobs } from './collections/SyncJobs'
import { AuditLogs } from './collections/AuditLogs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Dakkah CityOS Orchestrator',
      favicon: '/favicon.ico',
      ogImage: '/og-image.png',
    },
    components: {
      // Custom tenant switcher can be added here
      // beforeDashboard: ['@/components/TenantSwitcher'],
    },
  },
  collections: [
    // Geo & Hierarchy
    Countries,
    Scopes,
    Categories,
    Subcategories,
    
    // Tenancy
    Tenants,
    Stores,
    Portals,
    
    // Users & Access Control
    Users,
    ApiKeys,
    
    // Content
    Media,
    Pages,
    ProductContent,
    
    // Orchestrator Control Plane
    IntegrationEndpoints,
    WebhookLogs,
    SyncJobs,
    AuditLogs,
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
    // Enable PostGIS and pgvector extensions
    push: process.env.NODE_ENV !== 'production',
  }),
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ].filter(Boolean),
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ].filter(Boolean),
  graphQL: {
    disable: false,
  },
  upload: {
    limits: {
      fileSize: 10000000, // 10MB
    },
  },
  localization: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [
    // Multi-tenant plugin can be added here if desired
    // Note: We're implementing our own multi-tenancy logic for security
  ],
  telemetry: false,
  sharp: {}, // Enable sharp for image processing
})
