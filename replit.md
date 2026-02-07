# Medusa.js E-Commerce Monorepo

## Overview
Medusa.js e-commerce monorepo with three applications: Medusa backend API, Vite/React storefront with TanStack Router SSR, and Payload CMS orchestrator. The backend handles e-commerce operations, the storefront serves the customer-facing website, and the CMS manages content.

## Project Architecture

### Structure
- `apps/backend/` - Medusa.js v2 backend API (port 9000)
- `apps/storefront/` - TanStack Start + React storefront (port 5000)
- `apps/orchestrator/` - Payload CMS (not yet configured)
- `turbo.json` - Turborepo config
- `package.json` - Root monorepo config using pnpm workspaces
- `start.sh` - Startup script that runs backend then storefront

### Key Design Decisions
- **Vite Proxy for API calls**: Browser-side SDK uses empty `baseUrl` (routes through Vite proxy on port 5000 to backend on 9000). Server-side SSR uses `http://localhost:9000` directly.
- **SDK Configuration** (`apps/storefront/src/lib/utils/sdk.ts`): Uses `typeof window === "undefined"` check to determine server vs client URL.
- **Country Code Routing**: Root `/` redirects to `/$countryCode` (e.g., `/gb`, `/us`). The Replit iframe proxy doesn't handle 307 redirects properly, so users should navigate to `/us` or `/gb` directly.
- **Workflow**: Single workflow using `start.sh` that starts backend first, waits for port 9000, then starts storefront on port 5000.

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection (auto-managed by Replit)
- `VITE_MEDUSA_BACKEND_URL` - Backend URL for SSR (`http://localhost:9000`)
- `VITE_MEDUSA_PUBLISHABLE_KEY` - Medusa publishable API key
- Backend `.env` has `JWT_SECRET`, `COOKIE_SECRET`, `STORE_CORS`, `AUTH_CORS`, `ADMIN_CORS`

### Admin Credentials
- Email: admin@medusa-test.com
- Password: supersecret

### Known Issues
- `@medusajs/icons` package resolution errors in Vite prebundling (non-fatal, admin dashboard components)
- Root `/` path shows 404 to `/undefined` through Replit proxy iframe (redirect works fine with direct access)
- Hydration mismatch warnings due to SSR/client URL difference
- `Booking` entity error in no-show check job (missing `customer` property)

## Recent Changes
- 2026-02-07: Initial setup - Node.js 20, pnpm, PostgreSQL database
- 2026-02-07: Medusa migrations, admin user creation, publishable API key
- 2026-02-07: Storefront Vite proxy configured for `/store`, `/admin`, `/auth` routes
- 2026-02-07: SDK configured for dual server/client URLs
- 2026-02-07: Created default region with US/GB/SA countries
- 2026-02-07: Fixed duplicate health route files

## User Preferences
- Follow existing project setup conventions
- Use port 5000 for frontend with 0.0.0.0 host
- Bypass host verification for Replit environment
