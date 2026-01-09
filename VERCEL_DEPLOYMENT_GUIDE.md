# Vercel Deployment Guide

## Overview

This guide covers deploying the CityOS multi-tenant marketplace to Vercel and compatible platforms.

---

## Important: Platform Compatibility

### ✅ Vercel-Compatible
- **Storefront** (TanStack Start) - RECOMMENDED for Vercel
- **Orchestrator** (Payload CMS) - POSSIBLE but with limitations

### ❌ NOT Vercel-Compatible
- **Backend** (Medusa 2.0) - Requires traditional hosting

---

## Why Medusa Cannot Deploy to Vercel

Medusa requires features incompatible with Vercel's serverless architecture:

1. **Long-Running Processes**
   - Order processing workflows
   - Batch operations
   - Database migrations (can take minutes)

2. **Persistent Connections**
   - Redis connections
   - PostgreSQL connection pooling
   - Event bus subscriptions

3. **Background Jobs**
   - Scheduled tasks (cron jobs)
   - Queue processing
   - Async workflows

4. **File System Access**
   - Module loading
   - Dynamic imports
   - Cache management

5. **10-Second Timeout Limit**
   - Vercel functions timeout at 10s (Pro: 60s)
   - Many Medusa operations exceed this

---

## Recommended Hosting Strategy

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     DEPLOYMENT                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐      ┌─────────────┐   ┌──────────┐  │
│  │  Storefront │      │ Orchestrator│   │  Backend │  │
│  │  (Vercel)   │      │  (Vercel or │   │ (Railway)│  │
│  │             │      │   Railway)  │   │          │  │
│  │ Port: N/A   │      │ Port: 3001  │   │Port: 9001│  │
│  └──────┬──────┘      └──────┬──────┘   └────┬─────┘  │
│         │                    │                │         │
│         │                    │                │         │
│         └────────────────────┴────────────────┘         │
│                              │                          │
│                              ▼                          │
│                     ┌─────────────────┐                │
│                     │   External DBs   │                │
│                     │                  │                │
│                     │ • Supabase       │                │
│                     │ • Railway        │                │
│                     │ • Neon           │                │
│                     │ • Redis Cloud    │                │
│                     └─────────────────┘                │
└─────────────────────────────────────────────────────────┘
```

### Deployment Matrix

| Application   | Primary Option | Alternative | Database | File Storage |
|---------------|----------------|-------------|----------|--------------|
| **Storefront** | Vercel ✅ | Netlify | External API | N/A |
| **Orchestrator** | Railway ✅ | Vercel (limited) | Supabase/Neon | S3/R2 |
| **Backend** | Railway ✅ | Render, DO | Supabase/Neon | S3/R2 |

---

## Option 1: Storefront Only on Vercel (RECOMMENDED)

Deploy the storefront to Vercel while hosting backend services elsewhere.

### Step 1: Deploy Backend to Railway

#### 1.1 Create Railway Account
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login
```

#### 1.2 Create Railway Project
```bash
# From project root
cd apps/backend

# Initialize Railway project
railway init

# Select "Empty Project"
# Name it: cityos-backend
```

#### 1.3 Configure Railway Services

Create `railway.json` in `/workspace/apps/backend/`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm build"
  },
  "deploy": {
    "startCommand": "pnpm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 1.4 Add Environment Variables

In Railway dashboard, add:

```bash
# Core
NODE_ENV=production
PORT=9001

# Database (Railway Postgres plugin)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (Railway Redis plugin)
REDIS_URL=${{Redis.REDIS_URL}}

# JWT
JWT_SECRET=your-production-jwt-secret-here

# Admin
MEDUSA_ADMIN_ONBOARDING_TYPE=default
MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=

# CORS - Add your domains
ADMIN_CORS=https://cityos-backend.railway.app,https://admin.yourdomain.com
STORE_CORS=https://yourdomain.com,https://www.yourdomain.com

# URLs
MEDUSA_BACKEND_URL=https://cityos-backend.railway.app
MEDUSA_ADMIN_URL=https://cityos-backend.railway.app/app

# Integrations (to be configured)
KEYCLOAK_URL=
KEYCLOAK_REALM=
KEYCLOAK_CLIENT_ID=
KEYCLOAK_CLIENT_SECRET=

CERBOS_URL=

STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=

# File Storage (S3 or Cloudflare R2)
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_ENDPOINT=  # For R2
```

#### 1.5 Add Postgres & Redis

In Railway dashboard:
1. Click "New" → "Database" → "Add PostgreSQL"
2. Click "New" → "Database" → "Add Redis"
3. Railway auto-connects via `${{Postgres.DATABASE_URL}}`

#### 1.6 Deploy

```bash
railway up
```

Backend will be available at: `https://cityos-backend.railway.app`

---

### Step 2: Deploy Orchestrator to Railway

#### 2.1 Create Second Railway Service

```bash
cd ../orchestrator

# Link to same Railway project
railway link

# Create new service
railway service create cityos-orchestrator
```

#### 2.2 Configure Railway

Create `railway.json` in `/workspace/apps/orchestrator/`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm build"
  },
  "deploy": {
    "startCommand": "pnpm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 2.3 Add Environment Variables

```bash
# Core
NODE_ENV=production
PORT=3001
PAYLOAD_SECRET=your-payload-secret-here

# Database (Create separate Postgres for Payload)
DATABASE_URI=${{PayloadPostgres.DATABASE_URL}}

# URLs
NEXT_PUBLIC_SERVER_URL=https://cityos-orchestrator.railway.app
PAYLOAD_PUBLIC_SERVER_URL=https://cityos-orchestrator.railway.app

# S3/R2 for media
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_ENDPOINT=

# Integration with Medusa
MEDUSA_BACKEND_URL=https://cityos-backend.railway.app
MEDUSA_ADMIN_TOKEN=your-admin-token
```

#### 2.4 Deploy

```bash
railway up
```

Orchestrator will be available at: `https://cityos-orchestrator.railway.app`

---

### Step 3: Deploy Storefront to Vercel

#### 3.1 Install Vercel CLI

```bash
npm i -g vercel
```

#### 3.2 Configure Vercel

Create `vercel.json` in `/workspace/apps/storefront/`:

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": null,
  "outputDirectory": ".output/public",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### 3.3 Add Environment Variables

Create `.env.production` in `/workspace/apps/storefront/`:

```bash
# Backend URLs
VITE_MEDUSA_BACKEND_URL=https://cityos-backend.railway.app
VITE_MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key

# Payload CMS
VITE_PAYLOAD_URL=https://cityos-orchestrator.railway.app

# Auth
VITE_KEYCLOAK_URL=https://your-keycloak.com
VITE_KEYCLOAK_REALM=cityos
VITE_KEYCLOAK_CLIENT_ID=storefront

# Analytics (optional)
VITE_GA_TRACKING_ID=
VITE_STRIPE_PUBLIC_KEY=
```

#### 3.4 Deploy to Vercel

```bash
cd apps/storefront

# First deployment
vercel

# Production deployment
vercel --prod
```

#### 3.5 Configure Vercel Dashboard

1. Go to Vercel Dashboard → Project Settings
2. Add environment variables from `.env.production`
3. Set Root Directory: `apps/storefront`
4. Build Command: `pnpm build`
5. Output Directory: `.output/public`
6. Install Command: `pnpm install --filter=storefront...`

#### 3.6 Configure Custom Domain

In Vercel Dashboard:
1. Go to Domains
2. Add your domain: `yourdomain.com`
3. Configure DNS records as instructed

---

## Option 2: Monorepo Deployment (Advanced)

Deploy multiple apps from a single Vercel project using the monorepo structure.

### Limitations
- Still cannot deploy Medusa backend
- Only storefront and potentially orchestrator

### Configuration

Create `vercel.json` in `/workspace/` (root):

```json
{
  "version": 2,
  "projects": [
    {
      "name": "cityos-storefront",
      "directory": "apps/storefront",
      "buildCommand": "cd ../.. && pnpm build --filter=storefront",
      "outputDirectory": "apps/storefront/.output/public",
      "env": {
        "VITE_MEDUSA_BACKEND_URL": "https://cityos-backend.railway.app"
      }
    }
  ]
}
```

### Deploy

```bash
# From root
vercel

# Link to existing project or create new
# Select monorepo configuration
```

---

## Option 3: All Services on Railway (RECOMMENDED FOR SIMPLICITY)

Deploy everything to Railway for unified management.

### Advantages
- Single platform
- Easy service communication
- Shared networking
- Simpler environment management
- Built-in CI/CD

### Setup

#### 3.1 Create Railway Project

```bash
railway init cityos-platform
```

#### 3.2 Create Three Services

```bash
# Backend
railway service create cityos-backend

# Orchestrator  
railway service create cityos-orchestrator

# Storefront
railway service create cityos-storefront
```

#### 3.3 Configure Each Service

For each service, create `railway.json`:

**Backend:**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install --filter=backend... && pnpm --filter=backend build"
  },
  "deploy": {
    "startCommand": "cd apps/backend && pnpm start"
  }
}
```

**Orchestrator:**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install --filter=orchestrator... && pnpm --filter=orchestrator build"
  },
  "deploy": {
    "startCommand": "cd apps/orchestrator && pnpm start"
  }
}
```

**Storefront:**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install --filter=storefront... && pnpm --filter=storefront build"
  },
  "deploy": {
    "startCommand": "cd apps/storefront && pnpm start"
  }
}
```

#### 3.4 Add Shared Services

```bash
# Add Postgres (for Medusa)
railway add postgresql

# Add another Postgres (for Payload)
railway add postgresql

# Add Redis
railway add redis
```

#### 3.5 Link Services

Railway allows internal networking:

```bash
# Backend can access Postgres via:
${{Postgres.POSTGRES_URL}}

# Storefront can access Backend via:
${{cityos-backend.RAILWAY_STATIC_URL}}
```

#### 3.6 Deploy All Services

```bash
railway up --service cityos-backend
railway up --service cityos-orchestrator
railway up --service cityos-storefront
```

---

## Database Configuration

### Option 1: Supabase (PostgreSQL)

#### Setup
1. Create Supabase account: https://supabase.com
2. Create two projects:
   - `cityos-medusa` (for backend)
   - `cityos-payload` (for orchestrator)

#### Connection Strings

```bash
# Medusa Backend
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Payload Orchestrator
DATABASE_URI=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

#### Enable Connection Pooling

In Supabase Dashboard:
1. Settings → Database → Connection Pooling
2. Enable "Transaction Mode"
3. Use pooled connection string for production

```bash
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:6543/postgres?pgbouncer=true
```

### Option 2: Neon (PostgreSQL)

#### Setup
1. Create Neon account: https://neon.tech
2. Create two databases in one project

#### Connection Strings

```bash
DATABASE_URL=postgresql://[user]:[password]@[endpoint].neon.tech/cityos_medusa?sslmode=require
DATABASE_URI=postgresql://[user]:[password]@[endpoint].neon.tech/cityos_payload?sslmode=require
```

### Option 3: Railway Postgres

#### Setup
- Included with Railway deployment
- Auto-configured via environment variables

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

---

## Redis Configuration

### Option 1: Upstash (Recommended for Vercel)

```bash
# Create account: https://upstash.com
# Create Redis database

REDIS_URL=rediss://default:[password]@[endpoint].upstash.io:6379
```

### Option 2: Redis Cloud

```bash
# Create account: https://redis.com/cloud
# Create subscription

REDIS_URL=redis://default:[password]@[endpoint]:16379
```

### Option 3: Railway Redis

```bash
# Included with Railway
REDIS_URL=${{Redis.REDIS_URL}}
```

---

## File Storage Configuration

Both Medusa and Payload need external storage for production.

### Option 1: Cloudflare R2 (Recommended - S3-Compatible, Cheaper)

#### Setup
1. Create Cloudflare account
2. Go to R2 → Create Bucket
3. Create two buckets:
   - `cityos-medusa-uploads`
   - `cityos-payload-media`

#### Configuration

```bash
# For Medusa
S3_BUCKET=cityos-medusa-uploads
S3_REGION=auto
S3_ACCESS_KEY_ID=your-r2-access-key
S3_SECRET_ACCESS_KEY=your-r2-secret-key
S3_ENDPOINT=https://[account-id].r2.cloudflarestorage.com

# For Payload
PAYLOAD_CLOUD_STORAGE_ADAPTER=s3
PAYLOAD_CLOUD_BUCKET=cityos-payload-media
PAYLOAD_CLOUD_REGION=auto
PAYLOAD_CLOUD_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
```

#### Install S3 Plugin for Medusa

```bash
cd apps/backend
pnpm add @medusajs/file-s3
```

Update `medusa-config.ts`:

```typescript
import { FileModuleOptions } from "@medusajs/file"

const modules = {
  file: {
    resolve: "@medusajs/file-s3",
    options: {
      file_url: process.env.S3_FILE_URL,
      access_key_id: process.env.S3_ACCESS_KEY_ID,
      secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
      region: process.env.S3_REGION,
      bucket: process.env.S3_BUCKET,
      endpoint: process.env.S3_ENDPOINT,
    } as FileModuleOptions,
  },
}
```

### Option 2: AWS S3

#### Setup
1. Create S3 buckets
2. Configure IAM user with appropriate permissions

```bash
S3_BUCKET=cityos-uploads
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
```

### Option 3: DigitalOcean Spaces

S3-compatible, similar configuration to R2.

---

## Environment Variables Checklist

### Backend (Medusa) - Required

```bash
✅ NODE_ENV=production
✅ DATABASE_URL=postgresql://...
✅ REDIS_URL=redis://...
✅ JWT_SECRET=
✅ COOKIE_SECRET=
✅ MEDUSA_BACKEND_URL=
✅ ADMIN_CORS=
✅ STORE_CORS=
✅ S3_BUCKET=
✅ S3_REGION=
✅ S3_ACCESS_KEY_ID=
✅ S3_SECRET_ACCESS_KEY=
```

### Orchestrator (Payload) - Required

```bash
✅ NODE_ENV=production
✅ DATABASE_URI=postgresql://...
✅ PAYLOAD_SECRET=
✅ PAYLOAD_PUBLIC_SERVER_URL=
✅ S3_BUCKET=
✅ S3_REGION=
✅ S3_ACCESS_KEY_ID=
✅ S3_SECRET_ACCESS_KEY=
```

### Storefront - Required

```bash
✅ VITE_MEDUSA_BACKEND_URL=
✅ VITE_MEDUSA_PUBLISHABLE_KEY=
✅ VITE_PAYLOAD_URL=
```

---

## CI/CD Setup

### GitHub Actions for Vercel

Create `.github/workflows/deploy-storefront.yml`:

```yaml
name: Deploy Storefront to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'apps/storefront/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --filter=storefront...
      
      - name: Build
        run: pnpm --filter=storefront build
        env:
          VITE_MEDUSA_BACKEND_URL: ${{ secrets.VITE_MEDUSA_BACKEND_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./apps/storefront
```

### Railway Auto-Deploy

Railway automatically deploys on git push:

1. Connect GitHub repo in Railway dashboard
2. Select branch (e.g., `main`)
3. Configure build settings
4. Push to trigger deployment

---

## Post-Deployment Steps

### 1. Run Migrations

#### Medusa Backend
```bash
# SSH into Railway or use CLI
railway run --service cityos-backend pnpm medusa migrations run
```

#### Payload Orchestrator
Migrations run automatically on startup.

### 2. Create Admin User

#### Medusa
```bash
railway run --service cityos-backend pnpm medusa user -e admin@example.com -p supersecret
```

#### Payload
Visit: `https://cityos-orchestrator.railway.app/admin`
First user creation happens via UI.

### 3. Seed Data (Optional)

```bash
railway run --service cityos-backend pnpm medusa seed -f ./data/seed.json
```

### 4. Configure Webhooks

#### Stripe Webhooks
- Endpoint: `https://cityos-backend.railway.app/webhooks/stripe`
- Events: `payment_intent.succeeded`, `charge.refunded`, etc.

#### Payload Webhooks
- Configure in Payload dashboard
- Point to Medusa: `https://cityos-backend.railway.app/webhooks/payload`

### 5. Test End-to-End

1. Visit storefront: `https://yourdomain.com`
2. Browse products
3. Add to cart
4. Checkout with test card
5. Verify order in Medusa admin
6. Check content in Payload admin

---

## Monitoring & Debugging

### Railway Logs

```bash
# View logs
railway logs --service cityos-backend

# Follow logs
railway logs --service cityos-backend --follow
```

### Vercel Logs

```bash
# View logs
vercel logs cityos-storefront

# Real-time logs
vercel logs cityos-storefront --follow
```

### Health Checks

#### Backend
```bash
curl https://cityos-backend.railway.app/health
```

#### Orchestrator
```bash
curl https://cityos-orchestrator.railway.app/api/access
```

### Performance Monitoring

Add Sentry for error tracking:

```bash
pnpm add @sentry/node @sentry/nextjs

# Configure in each app
```

---

## Cost Estimation

### Railway (All Services)

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Backend | Hobby | $5 + usage |
| Orchestrator | Hobby | $5 + usage |
| Storefront | Hobby | $5 + usage |
| Postgres x2 | Included | $0 |
| Redis | Included | $0 |
| **Total** | | **~$15-30/mo** |

### Vercel (Storefront Only) + Railway (Backend + Orchestrator)

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Vercel Storefront | Hobby | Free (or $20 Pro) |
| Railway Backend | Hobby | $5 + usage |
| Railway Orchestrator | Hobby | $5 + usage |
| Supabase x2 | Free tier | $0 (or $25 Pro) |
| Upstash Redis | Free tier | $0 |
| Cloudflare R2 | Pay-as-you-go | ~$1-5 |
| **Total** | | **~$11-60/mo** |

### Production (Scalable)

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Vercel | Pro | $20 |
| Railway | Pro | $20 x 3 = $60 |
| Supabase | Pro | $25 x 2 = $50 |
| Redis Cloud | Standard | $7 |
| Cloudflare R2 | Usage | $5-15 |
| **Total** | | **~$162-172/mo** |

---

## Troubleshooting

### Build Failures

#### Error: "Cannot find module"
```bash
# Solution: Ensure pnpm workspace is configured
pnpm install --filter=<app-name>...
```

#### Error: "Out of memory"
```bash
# Solution: Increase Node memory in Railway
NODE_OPTIONS=--max-old-space-size=4096
```

### Database Connection Issues

#### Error: "Connection timeout"
```bash
# Solution: Enable connection pooling
DATABASE_URL=...?pgbouncer=true&connection_limit=10
```

#### Error: "Too many connections"
```bash
# Solution: Use connection pooler like PgBouncer
# Or reduce connection pool size in config
```

### CORS Errors

```bash
# Solution: Add your domains to CORS config
STORE_CORS=https://yourdomain.com,https://www.yourdomain.com
ADMIN_CORS=https://admin.yourdomain.com
```

### Slow Performance

1. Enable Redis caching
2. Use CDN for static assets (Cloudflare)
3. Optimize database queries
4. Enable HTTP/2
5. Use connection pooling

---

## Security Checklist

### Pre-Deployment

- [ ] Change all default secrets
- [ ] Use strong JWT_SECRET (32+ chars)
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Disable debug modes
- [ ] Remove test accounts
- [ ] Audit dependencies (`pnpm audit`)

### Post-Deployment

- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Configure DDoS protection (Cloudflare)
- [ ] Enable security headers
- [ ] Set up monitoring/alerts
- [ ] Regular security updates
- [ ] Backup databases regularly

---

## Rollback Strategy

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Railway
```bash
# View deployments
railway status

# Rollback via dashboard
# Railway Dashboard → Service → Deployments → Rollback
```

---

## Next Steps

After successful deployment:

1. **Configure Custom Domains**
   - Storefront: `www.yourdomain.com`
   - Backend API: `api.yourdomain.com`
   - Payload CMS: `cms.yourdomain.com`
   - Admin Panel: `admin.yourdomain.com`

2. **Set Up SSL Certificates**
   - Automatic with Vercel/Railway
   - Or use Let's Encrypt

3. **Configure CDN**
   - Cloudflare (recommended)
   - Enable caching rules
   - Set up Page Rules

4. **Enable Monitoring**
   - Uptime monitoring (UptimeRobot)
   - Error tracking (Sentry)
   - Performance monitoring (New Relic)

5. **Set Up Backups**
   - Database backups (daily)
   - File storage backups
   - Configuration backups

6. **Performance Optimization**
   - Enable caching
   - Optimize images
   - Lazy loading
   - Code splitting

---

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Medusa Docs**: https://docs.medusajs.com/deployment
- **Payload Docs**: https://payloadcms.com/docs/production/deployment
- **TanStack Start**: https://tanstack.com/start/latest/docs/deployment

---

## Summary

### Recommended Deployment Strategy:

1. **Backend (Medusa)** → Railway
2. **Orchestrator (Payload)** → Railway
3. **Storefront** → Vercel

### Why This Setup?

✅ **Cost-effective**: Free tiers available  
✅ **Scalable**: Easy to upgrade as you grow  
✅ **Reliable**: 99.9% uptime SLAs  
✅ **Fast**: Global CDN with Vercel  
✅ **Simple**: Minimal DevOps overhead  
✅ **Integrated**: Services can communicate easily  

This setup provides the best balance of performance, cost, and developer experience for your multi-tenant marketplace platform.
