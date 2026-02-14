# Environment Setup Guide

## Quick Start Checklist

Use this as a step-by-step guide to get the platform running.

---

## ✅ Phase 1: Local Development Setup (Day 1)

### Prerequisites
```bash
# Required tools
node --version    # v20+
pnpm --version    # v8+
docker --version  # 20+
psql --version    # 14+
```

### Install Dependencies
```bash
# Root
pnpm install

# Backend
cd apps/backend
pnpm install

# Storefront
cd apps/storefront
pnpm install

# Payload
cd apps/payload
pnpm install
```

### Start Databases (Docker)
```bash
# PostgreSQL for Medusa
docker run -d \
  --name medusa-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=medusa_db \
  -p 5432:5432 \
  postgres:14

# PostgreSQL for Payload
docker run -d \
  --name payload-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=payload_db \
  -p 5433:5432 \
  postgres:14

# Redis
docker run -d \
  --name medusa-redis \
  -p 6379:6379 \
  redis:6
```

### Configure Environment
```bash
# Backend
cp apps/backend/.env.example apps/backend/.env

# Edit apps/backend/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medusa_db
REDIS_URL=redis://localhost:6379
STRIPE_API_KEY=sk_test_... # Get from Stripe dashboard
# ... fill in remaining values
```

### Run Migrations
```bash
cd apps/backend
npx medusa migrations:run
```

### Seed Data
```bash
npx medusa seed

# Or custom seed
npm run seed
```

### Start Dev Servers
```bash
# Terminal 1 - Backend
cd apps/backend
pnpm dev

# Terminal 2 - Storefront
cd apps/storefront
pnpm dev

# Terminal 3 - Payload
cd apps/payload
pnpm dev
```

### Verify Setup
```bash
# Backend health
curl http://localhost:9000/health

# Storefront
open http://localhost:5173

# Admin
open http://localhost:9000/app

# Payload
open http://localhost:3000/admin
```

---

## ✅ Phase 2: External Services Setup (Day 2-3)

### 1. Stripe Setup

**Steps:**
1. Go to https://dashboard.stripe.com
2. Create account (or sign in)
3. Get API keys:
   - Developers → API keys
   - Copy "Secret key" (sk_test_...)
   - Copy "Publishable key" (pk_test_...)
4. Enable Stripe Connect:
   - Connect → Get started
   - Fill in business details
   - Set redirect URI: `http://localhost:9000/admin/integrations/stripe/callback`
5. Create webhook:
   - Developers → Webhooks → Add endpoint
   - URL: `http://localhost:9000/api/admin/integrations/stripe/webhook`
   - Events: Select all `account.*`, `transfer.*`, `payout.*`
   - Copy webhook secret (whsec_...)

**Update .env:**
```bash
STRIPE_API_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT_ID=ca_... # From Connect settings
```

---

### 2. Keycloak Setup

**Quick Start (Docker):**
```bash
docker run -d \
  --name keycloak \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest \
  start-dev
```

**Configuration:**
1. Open http://localhost:8080
2. Login: admin / admin
3. Create realm: `cityos`
4. Create client: `medusa-backend`
   - Client type: OpenID Connect
   - Client authentication: ON
   - Save and copy client secret
5. Create roles:
   - Realm roles → Create role
   - Names: `super_admin`, `tenant_admin`, `store_admin`, `vendor_admin`

**Update .env:**
```bash
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=cityos
KEYCLOAK_CLIENT_ID=medusa-backend
KEYCLOAK_CLIENT_SECRET=... # From client credentials
```

---

### 3. Cerbos Setup

**Quick Start (Docker):**
```bash
# Create policy directory
mkdir -p cerbos-policies

# Run Cerbos
docker run -d \
  --name cerbos \
  -p 3592:3592 \
  -v $(pwd)/cerbos-policies:/policies \
  ghcr.io/cerbos/cerbos:latest \
  server --config=/policies/config.yaml
```

**Create config:**
```yaml
# cerbos-policies/config.yaml
server:
  httpListenAddr: ":3592"

storage:
  driver: "disk"
  disk:
    directory: /policies
```

**Update .env:**
```bash
CERBOS_URL=http://localhost:3592
```

---

### 4. Optional: Fleetbase Setup

**Steps:**
1. Sign up at https://fleetbase.io
2. Create organization
3. Get API key from Settings → API Keys

**Update .env:**
```bash
FLEETBASE_URL=https://api.fleetbase.io
FLEETBASE_API_KEY=...
```

---

### 5. Optional: ERPNext Setup

**Quick Start (Docker):**
```bash
# Use Frappe Docker
git clone https://github.com/frappe/frappe_docker
cd frappe_docker
cp example.env .env

# Start ERPNext
docker-compose up -d
```

Wait 5-10 minutes for initialization, then:
1. Open http://localhost:8000
2. Complete setup wizard
3. Create API key: User → API Access → Generate Keys

**Update .env:**
```bash
ERPNEXT_URL=http://localhost:8000
ERPNEXT_API_KEY=...
ERPNEXT_API_SECRET=...
```

---

## ✅ Phase 3: Test Data Setup (Day 3)

### Create Test Tenant
```typescript
// Use MedusaExec or API
POST /admin/tenants
{
  "name": "Test Tenant",
  "slug": "test-tenant",
  "cityos_hierarchy": {
    "country": "US",
    "state": "CA",
    "city": "San Francisco",
    "district": "SOMA",
    "block": "Block A"
  }
}
```

### Create Test Store
```typescript
POST /admin/stores
{
  "tenant_id": "...",
  "name": "Test Store",
  "domain_type": "subdomain",
  "subdomain": "test-store"
}
```

### Add Test Products
```typescript
POST /admin/products
{
  "title": "Test Product",
  "handle": "test-product",
  "description": "A test product",
  "variants": [{
    "title": "Default",
    "prices": [{ amount: 1999, currency_code: "usd" }],
    "manage_inventory": false
  }]
}
```

---

## ✅ Phase 4: Integration Testing (Day 4)

### Test Stripe Connect
```bash
# 1. Create vendor
POST /admin/vendors
{
  "name": "Test Vendor",
  "email": "vendor@test.com"
}

# 2. Start OAuth flow
GET /admin/integrations/stripe/connect?vendor_id=...

# 3. Complete Stripe onboarding in browser
# 4. Verify stripe_account_id saved
```

### Test Commission Calculation
```bash
# 1. Create order with vendor product
POST /store/carts/:id/complete

# 2. Check commission created
GET /admin/vendors/:id/transactions
```

### Test Subscription Billing
```bash
# 1. Create subscription
POST /admin/subscriptions
{
  "customer_id": "...",
  "plan": "monthly",
  "items": [{ product_id: "...", quantity: 1 }],
  "trial_days": 0
}

# 2. Manually trigger billing cycle (or wait)
POST /admin/subscriptions/:id/bill

# 3. Verify order created
GET /admin/orders
```

---

## ✅ Phase 5: Performance Testing (Day 5)

### Install k6
```bash
brew install k6  # macOS
# or
wget https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-linux-amd64.tar.gz
```

### Run Load Test
```bash
# Create test script
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 50 },
    { duration: '1m', target: 0 },
  ],
};

export default function () {
  let res = http.get('http://localhost:9000/store/products');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
EOF

# Run test
k6 run load-test.js
```

**Analyze Results:**
- Target: p95 < 200ms
- Error rate < 0.1%
- All checks passing

---

## 🚀 Ready for Staging Deployment

Once all tests pass, you're ready to deploy to staging following the deployment plan.

## 📚 Additional Resources

- [Medusa Documentation](https://docs.medusajs.com)
- [Stripe Connect Guide](https://stripe.com/docs/connect)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Cerbos Documentation](https://docs.cerbos.dev)

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check connection
psql postgresql://postgres:postgres@localhost:5432/medusa_db

# View logs
docker logs medusa-postgres
```

### Redis Connection Issues
```bash
# Check if Redis is running
docker ps | grep redis

# Test connection
redis-cli ping

# View logs
docker logs medusa-redis
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install

# Clear build cache
rm -rf dist
pnpm build
```

### Migration Errors
```bash
# Check migration status
npx medusa migrations:show

# Rollback last migration
npx medusa migrations:revert

# Re-run migrations
npx medusa migrations:run
```

---

**Need help? Check the main DEPLOYMENT_PLAN.md for detailed guidance on each phase.**
