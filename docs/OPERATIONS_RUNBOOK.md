# Dakkah CityOS Commerce — Operations Runbook

> **Version:** 1.0.0 | **Date:** 2026-02-14
> **Platform:** Medusa.js v2 + TanStack Start + PostgreSQL
> **Modules:** 58 custom modules | **Verticals:** 27+

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Health Checks](#2-health-checks)
3. [Service Management](#3-service-management)
4. [Database Operations](#4-database-operations)
5. [Integration Monitoring](#5-integration-monitoring)
6. [Incident Response](#6-incident-response)
7. [Common Issues & Solutions](#7-common-issues--solutions)
8. [Maintenance Procedures](#8-maintenance-procedures)
9. [Scaling Guidance](#9-scaling-guidance)
10. [Backup & Recovery](#10-backup--recovery)

---

## 1. System Overview

### Architecture

```
                     ┌──────────────────┐
                     │   CDN / Edge     │
                     │  (Static Assets) │
                     └────────┬─────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
       ┌────────┴────────┐        ┌────────┴────────┐
       │   Storefront    │        │   Backend API   │
       │  (TanStack SSR) │        │  (Medusa.js v2) │
       │   Port 5000     │        │  Port 9000      │
       └────────┬────────┘        └────────┬────────┘
                │                           │
                │              ┌────────────┴────────────┐
                │              │                         │
                │     ┌────────┴────────┐       ┌────────┴────────┐
                │     │  PostgreSQL     │       │  Redis Cache    │
                │     │  (Primary DB)   │       │                 │
                │     └─────────────────┘       └─────────────────┘
                │
       ┌────────┴──────────────────────────────────┐
       │              External Services             │
       ├─────────┬─────────┬──────────┬────────────┤
       │ Stripe  │Temporal │Payload   │ ERPNext    │
       │         │ Cloud   │CMS       │            │
       └─────────┴─────────┴──────────┴────────────┘
```

### Key Ports

| Service | Port | Purpose |
|---------|------|---------|
| Storefront | 5000 | Customer-facing web application |
| Backend API | 9000 | Medusa.js REST API |
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Cache and sessions |

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection | Yes |
| `STRIPE_API_KEY` | Payment processing | Yes (for payments) |
| `STRIPE_WEBHOOK_SECRET` | Webhook verification | Yes (for payments) |
| `TEMPORAL_ENDPOINT` | Workflow orchestration | Yes (for workflows) |
| `TEMPORAL_API_KEY` | Temporal auth | Yes (for workflows) |
| `TEMPORAL_NAMESPACE` | Temporal namespace | Yes (for workflows) |
| `JWT_SECRET` | Token signing | Yes |
| `COOKIE_SECRET` | Session cookies | Yes |
| `REDIS_URL` | Cache/session store | Recommended |

---

## 2. Health Checks

### Public Health Endpoint

```bash
curl https://<domain>/store/health
```

**Expected Response (healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-14T12:00:00Z",
  "version": "1.0.0",
  "uptime_seconds": 3600,
  "checks": {
    "database": { "status": "healthy" },
    "integrations": {
      "stripe": { "status": "configured", "configured": true },
      "temporal": { "status": "configured", "configured": true }
    }
  },
  "response_time_ms": 15
}
```

### Admin Health Endpoint (authenticated)

```bash
curl https://<domain>/admin/health \
  -H "Authorization: Bearer <admin-token>"
```

Returns additional system metrics: memory usage, node version, cache stats, and full metrics summary.

### Automated Monitoring

Set up uptime monitoring to check `/store/health` every 60 seconds. Alert if:
- Response status is not 200
- Response time exceeds 2000ms
- `status` field is not "healthy"

---

## 3. Service Management

### Starting the Platform

```bash
# Start both backend and storefront
bash /home/runner/workspace/start.sh
```

This script:
1. Kills any stale processes on ports 9000 and 5000
2. Starts Medusa backend (port 9000) in background
3. Waits up to 60 seconds for backend readiness
4. Starts storefront (port 5000) in foreground

### Restarting Services

```bash
# Kill and restart everything
fuser -k 9000/tcp 5000/tcp
bash /home/runner/workspace/start.sh
```

### Checking Service Status

```bash
# Check if services are running
curl -s http://localhost:9000/health | jq .status
curl -s http://localhost:5000 | head -1

# Check process status
ps aux | grep -E "medusa|vite" | grep -v grep
```

---

## 4. Database Operations

### Check Database Status

```sql
-- Check connection count
SELECT count(*) FROM pg_stat_activity;

-- Check table sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS total_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC
LIMIT 20;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC
LIMIT 20;
```

### Run Migrations

```bash
cd apps/backend
npx medusa db:migrate
```

### Seed Data

```bash
cd apps/backend
npx medusa exec src/scripts/seed.ts
```

### Database Backup

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Database Restore

```bash
# WARNING: This will overwrite existing data
psql $DATABASE_URL < backup_file.sql
```

---

## 5. Integration Monitoring

### Stripe

| Check | Command | Expected |
|-------|---------|----------|
| API connectivity | Check health endpoint `integrations.stripe` | `configured: true` |
| Webhook delivery | Stripe Dashboard → Webhooks → Events | Delivery rate > 99% |
| Payment success rate | Stripe Dashboard → Payments | > 95% success |

**Troubleshooting Stripe:**
1. Verify `STRIPE_API_KEY` is set correctly
2. Check webhook endpoint URL matches production domain
3. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard value
4. Check Stripe Dashboard for failed webhook deliveries

### Temporal Cloud

| Check | Command | Expected |
|-------|---------|----------|
| Connection | Check health endpoint `integrations.temporal` | `configured: true` |
| Queue depth | Temporal Cloud UI → Task Queues | < 1000 pending per queue |
| Failure rate | Temporal Cloud UI → Workflow Executions | < 1% failure rate |

**Troubleshooting Temporal:**
1. Verify `TEMPORAL_ENDPOINT`, `TEMPORAL_API_KEY`, `TEMPORAL_NAMESPACE` are set
2. Check Temporal Cloud UI for failed workflows
3. Review workflow execution history for error details
4. Check worker connectivity and task queue registration

### Payload CMS / ERPNext / Fleetbase

Monitor via admin health endpoint. Each integration shows:
- `configured`: Whether environment variables are set
- Circuit breaker state (when connected)
- Sync tracker completion rate

---

## 6. Incident Response

### Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| **P0** | Service down, payments failing | 15 minutes | Database down, Stripe errors, 500 errors > 5% |
| **P1** | Degraded performance, partial outage | 1 hour | Slow responses, one integration down, high error rate |
| **P2** | Non-critical issue, workaround exists | 4 hours | UI bug, minor data inconsistency, single vertical affected |
| **P3** | Low impact, cosmetic | Next business day | Typo, minor styling, non-critical log errors |

### P0 Incident Playbook

1. **Assess:** Check health endpoints and logs
2. **Communicate:** Notify stakeholders
3. **Diagnose:** Check database, external services, recent deployments
4. **Mitigate:** Rollback if recent deployment caused issue
5. **Resolve:** Fix root cause
6. **Review:** Post-incident review within 24 hours

### Common P0 Scenarios

#### Database Connection Failure
```bash
# Check database status
psql $DATABASE_URL -c "SELECT 1"

# Check connection pool
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity"

# Restart if needed
fuser -k 9000/tcp && cd apps/backend && NODE_OPTIONS="--max-old-space-size=512" npx medusa develop &
```

#### Payment Processing Failure
```bash
# Check Stripe status
curl -s https://status.stripe.com/api/v2/status.json | jq .status

# Check webhook delivery
# Go to Stripe Dashboard → Developers → Webhooks → Recent deliveries

# Verify API key
curl https://api.stripe.com/v1/balance \
  -u $STRIPE_API_KEY:
```

#### High Memory Usage
```bash
# Check memory
curl -s http://localhost:9000/admin/health | jq .system.memory

# If heap_used_mb > 400 (of 512 limit), consider restart
fuser -k 9000/tcp && cd apps/backend && NODE_OPTIONS="--max-old-space-size=512" npx medusa develop &
```

---

## 7. Common Issues & Solutions

### Issue: "Too many authentication attempts"
**Cause:** Rate limiter triggered (20 requests per 15 minutes per IP)
**Solution:** Wait 15 minutes, or check if a bot is hammering the auth endpoint
**Prevention:** Implement CAPTCHA on login form for repeated failures

### Issue: Slow API responses (> 2s)
**Cause:** Database query optimization needed
**Solution:**
1. Check slow query log
2. Verify indexes exist on queried columns
3. Check if N+1 query pattern exists
4. Enable Redis caching for frequently accessed data

### Issue: 503 Service Unavailable from health check
**Cause:** Database or critical service unreachable
**Solution:**
1. Check database connectivity: `psql $DATABASE_URL -c "SELECT 1"`
2. Check Redis connectivity if cache is required
3. Review recent deployments for configuration changes
4. Check system resources (memory, CPU, disk)

### Issue: Webhook signature verification failure
**Cause:** Webhook secret mismatch or request tampering
**Solution:**
1. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
2. Check that the webhook endpoint URL is correct (no proxy/CDN stripping headers)
3. Review raw webhook payload for debugging

### Issue: CORS errors in browser
**Cause:** Origin not in CORS allowlist
**Solution:** Update `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS` environment variables to include the requesting domain

### Issue: Rate limit hit on store API (120/min)
**Cause:** Client making too many requests
**Solution:**
1. Check if a specific IP is flooding requests
2. Implement client-side request batching/caching
3. Increase rate limit if traffic is legitimate

---

## 8. Maintenance Procedures

### Regular Maintenance Schedule

| Task | Frequency | Duration | Impact |
|------|-----------|----------|--------|
| Dependency updates | Weekly | 30 min | None (staged) |
| Database vacuum | Weekly | 5 min | Minimal |
| Log rotation | Daily (auto) | None | None |
| Security audit | Monthly | 2 hours | None |
| Performance review | Monthly | 1 hour | None |
| Backup verification | Weekly | 15 min | None |

### Database Maintenance

```sql
-- Vacuum and analyze all tables
VACUUM ANALYZE;

-- Check for bloated tables
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC
LIMIT 10;

-- Check for unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC
LIMIT 20;
```

### Dependency Updates

```bash
cd apps/backend
pnpm audit
pnpm update --latest

cd apps/storefront
pnpm audit
pnpm update --latest
```

---

## 9. Scaling Guidance

### Vertical Scaling (Single Instance)

| Resource | Current | Recommended Production |
|----------|---------|----------------------|
| Backend memory | 512 MB | 1024–2048 MB |
| Storefront memory | 1024 MB | 2048 MB |
| Database connections | Default | 50–100 pooled |
| CPU | Shared | 2+ dedicated cores |

### Horizontal Scaling (Multiple Instances)

When single instance is insufficient:

1. **Backend API:** Stateless — can run multiple instances behind load balancer
2. **Storefront:** Stateless with SSR — can run multiple instances
3. **Database:** Use connection pooling (PgBouncer) + read replicas
4. **Redis:** Single instance sufficient for most loads; cluster for > 10K req/s
5. **Temporal Workers:** Scale independently per task queue based on queue depth

### Scaling Triggers

| Metric | Threshold | Action |
|--------|-----------|--------|
| API response time p95 | > 1s | Scale backend instances or optimize queries |
| CPU utilization | > 80% sustained | Add CPU/instances |
| Memory utilization | > 85% | Increase memory limit |
| Database connections | > 80% pool | Increase pool size or add replicas |
| Temporal queue depth | > 500 pending | Add worker instances |

---

## 10. Backup & Recovery

### Backup Strategy

| Data | Method | Frequency | Retention |
|------|--------|-----------|-----------|
| PostgreSQL | pg_dump | Daily | 30 days |
| Environment secrets | Replit secrets management | On change | Versioned |
| Application code | Git | On commit | Indefinite |
| Uploaded assets | Object storage replication | Real-time | 90 days |

### Recovery Procedures

#### Full Database Recovery
1. Stop backend service
2. Restore from latest backup: `psql $DATABASE_URL < backup.sql`
3. Run any pending migrations: `npx medusa db:migrate`
4. Restart backend service
5. Verify via health endpoint

#### Partial Data Recovery
1. Identify affected tables/records
2. Restore to a temporary database
3. Export specific records: `pg_dump -t table_name > partial.sql`
4. Import to production: `psql $DATABASE_URL < partial.sql`

#### Configuration Recovery
1. Check Replit secrets/env vars are intact
2. Verify `.replit` configuration file
3. Verify `medusa-config.ts` settings
4. Restart services

### Recovery Time Objectives

| Scenario | RTO | RPO |
|----------|-----|-----|
| Full outage (infrastructure) | 1 hour | 24 hours (last backup) |
| Database corruption | 30 minutes | 24 hours (last backup) |
| Application bug (rollback) | 15 minutes | 0 (code versioned) |
| Configuration error | 5 minutes | 0 (env vars versioned) |

---

## Appendix: Quick Reference Commands

```bash
# Health checks
curl -s http://localhost:9000/admin/health | jq .
curl -s http://localhost:5000/store/health | jq .

# Restart services
bash /home/runner/workspace/start.sh

# Database status
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity"

# Check logs (recent errors)
grep -i "error" logs/error.log | tail -20

# Run tests
cd apps/backend && TEST_TYPE=unit npx jest
cd apps/storefront && npx vitest run

# Run seed scripts
cd apps/backend && npx medusa exec src/scripts/seed.ts

# Run migrations
cd apps/backend && npx medusa db:migrate
```

---

*Document generated: 2026-02-14 | Dakkah CityOS Commerce Platform v1.0*
