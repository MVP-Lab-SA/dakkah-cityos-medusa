# Dakkah CityOS - Workflow Discovery & Integration Guide

**Version**: 1.0  
**Date**: February 2026  
**Audience**: All CityOS system teams (Medusa Commerce, Payload CMS, ERPNext, Fleetbase, Walt.id, MinIO AIStor, ZES Engine, AI Services)  
**Temporal Namespace**: `quickstart-dakkah-cityos.djvai` (ap-northeast-1)

---

## 1. Overview

The CityOS Workflow Orchestration System provides a centralized discovery layer for all Temporal-powered workflows running across the platform. Each system can query the API to discover workflows that belong to them, understand cross-system dependencies, and monitor execution status.

**Key concepts:**

- **Queue-System Mapping** - Every Temporal task queue is mapped to a primary CityOS system and domain. This is how the platform knows which workflows belong to which system.
- **Auto-Inferred Tags** - Workflows are automatically tagged with `system:*`, `domain:*`, `queue:*`, and semantic labels (e.g., `verification`, `fulfillment`, `sync`) based on their task queues and workflow names.
- **Workflow Registry** - A unified catalog of all discovered workflow types, continuously synced from Temporal Cloud. Each entry includes ownership, tags, execution stats, and task queue mappings.

---

## 2. Registered CityOS Systems

The platform recognizes the following 10 systems:

| System ID | Description |
|---|---|
| `payload-cms` | Payload CMS - Content management and headless CMS |
| `medusa` | Medusa Commerce - E-commerce and order management |
| `erpnext` | ERPNext - Enterprise resource planning |
| `fleetbase` | Fleetbase - Logistics and fleet management |
| `walt-id` | Walt.id - Identity and credential verification |
| `minio` | MinIO AIStor - S3-compatible object storage |
| `temporal` | Temporal Cloud - Workflow orchestration engine |
| `cityos-core` | CityOS Core - Platform-wide operations |
| `zes-engine` | ZES Engine - Zone Experience System |
| `ai-services` | AI Services - Machine learning and AI pipelines |

---

## 3. Queue-to-System Mapping

Every Temporal task queue is mapped to exactly one primary system and one domain. When a workflow runs on a given queue, it inherits that queue's system and domain tags.

| Task Queue | Primary System | Domain | Description |
|---|---|---|---|
| `cityos-workflow-queue` | cityos-core | core | Default CityOS workflow queue |
| `cityos-main` | cityos-core | core | Main CityOS task queue |
| `commerce-queue` | medusa | commerce | Commerce order processing |
| `commerce-booking-queue` | medusa | commerce | Commerce booking workflows |
| `payload-queue` | payload-cms | payload | Payload CMS content sync |
| `payload-moderation-queue` | payload-cms | moderation | Payload content moderation |
| `payload-notifications-queue` | payload-cms | notifications | Payload notification dispatch |
| `xsystem-platform-queue` | erpnext | xsystem | Cross-system platform operations |
| `xsystem-content-queue` | payload-cms | xsystem | Cross-system content sync |
| `xsystem-logistics-queue` | fleetbase | logistics | Cross-system logistics coordination |
| `xsystem-vertical-queue` | erpnext | xsystem | Cross-system vertical integration |
| `core-queue` | cityos-core | core | Core platform operations |
| `core-maintenance-queue` | cityos-core | core | Scheduled maintenance tasks |
| `zes-queue` | zes-engine | zes | Zone Experience System processing |
| `zes-analytics-queue` | zes-engine | zes | ZES analytics aggregation |
| `storage-queue` | minio | storage | Object storage operations |
| `notifications-queue` | cityos-core | notifications | Notification delivery |
| `moderation-queue` | cityos-core | moderation | Content moderation pipeline |
| `poi-realtime-queue` | cityos-core | poi | Real-time POI updates |
| `poi-views-queue` | cityos-core | poi | POI view tracking |

**New queues**: If your system introduces a new task queue, contact the CityOS platform team to register it in the `QUEUE_SYSTEM_MAP`. Until registered, the system uses prefix-based inference (e.g., a queue named `commerce-returns-queue` would automatically be inferred as belonging to `medusa`).

---

## 4. Tag System

Every workflow type in the registry is automatically tagged. Tags enable rich filtering and cross-system workflow discovery.

### Tag Categories

| Prefix | Example | Meaning |
|---|---|---|
| `system:` | `system:medusa` | This workflow runs on a queue owned by the Medusa system |
| `domain:` | `domain:commerce` | This workflow operates in the commerce domain |
| `queue:` | `queue:commerce-queue` | This workflow runs on the `commerce-queue` task queue |
| *(no prefix)* | `multi-queue` | Semantic tag - this workflow spans multiple task queues |

### Semantic Tags

These are automatically inferred from the workflow type name:

| Tag | Triggered by | Example workflow |
|---|---|---|
| `scheduled` | Name contains "scheduled" or "cron" | `scheduled-inventory-sync` |
| `sync` | Name contains "sync" or "reconcil" | `commerce-catalog-sync` |
| `retry` | Name contains "retry" or "failed" | `retry-failed-orders` |
| `onboarding` | Name contains "onboard" | `user-onboarding` |
| `moderation` | Name contains "moderat" | `content-moderation` |
| `verification` | Name contains "verif" | `poi-verification` |
| `analytics` | Name contains "analytic" | `zone-analytics-aggregation` |
| `notifications` | Name contains "notif" or "dispatch" | `notification-dispatch` |
| `fulfillment` | Name contains "order" or "fulfil" | `order-fulfillment` |
| `booking` | Name contains "booking" or "reserv" | `booking-confirmation` |
| `multi-queue` | Workflow runs on 2+ task queues | `cityOSWorkflow` |

### Multi-System Workflows

A single workflow can span multiple systems. For example, `cityOSWorkflow` runs on 13 task queues across 7 systems, resulting in tags like `system:medusa`, `system:erpnext`, `system:fleetbase`, `system:payload-cms`, `system:minio`, `system:zes-engine`, and `system:cityos-core`. When any of those systems queries for their workflows, `cityOSWorkflow` will appear in the results.

---

## 5. API Reference

**Base URL**: `https://<your-cityos-dashboard-host>`

All endpoints return JSON. No authentication is required for read operations on the discovery APIs.

---

### 5.1 Discover Your Workflows

```
GET /api/workflow-registry
```

Returns all registered workflow types. Use query parameters to filter results.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `system` | string | Filter by CityOS system (e.g., `medusa`, `erpnext`). Returns workflows where either the primary system matches OR the workflow has a `system:*` tag for that system. |
| `domainPack` | string | Filter by domain pack (e.g., `commerce`, `logistics`, `core`) |
| `source` | string | Filter by source: `discovered` (from Temporal Cloud), `seeded` (from local catalog), or `registered` (manually registered) |
| `tags` | string | Comma-separated list of tags to match (e.g., `verification,system:medusa`). All specified tags must be present. |
| `search` | string | Free-text search across workflow type, display name, description, and tags |
| `queue` | string | Filter by specific task queue name |
| `isActive` | boolean | Filter by active status (`true` or `false`) |

**Response**: Array of workflow registry entries.

**Examples for each system:**

```bash
# Medusa: Find all workflows related to your commerce system
curl "https://dashboard.cityos.example/api/workflow-registry?system=medusa"

# Payload CMS: Find all content-related workflows
curl "https://dashboard.cityos.example/api/workflow-registry?system=payload-cms"

# ERPNext: Find all ERP workflows
curl "https://dashboard.cityos.example/api/workflow-registry?system=erpnext"

# Fleetbase: Find all logistics workflows
curl "https://dashboard.cityos.example/api/workflow-registry?system=fleetbase"

# ZES Engine: Find all zone experience workflows
curl "https://dashboard.cityos.example/api/workflow-registry?system=zes-engine"

# MinIO: Find all storage-related workflows
curl "https://dashboard.cityos.example/api/workflow-registry?system=minio"

# Find all verification workflows across all systems
curl "https://dashboard.cityos.example/api/workflow-registry?tags=verification"

# Find workflows that span multiple systems
curl "https://dashboard.cityos.example/api/workflow-registry?tags=multi-queue"

# Combine filters: Medusa workflows in the commerce domain
curl "https://dashboard.cityos.example/api/workflow-registry?system=medusa&domainPack=commerce"

# Search by name
curl "https://dashboard.cityos.example/api/workflow-registry?search=onboarding"

# Filter by specific task queue
curl "https://dashboard.cityos.example/api/workflow-registry?queue=commerce-queue"
```

**Response Schema:**

```json
[
  {
    "id": 1,
    "workflowType": "cityOSWorkflow",
    "displayName": "CityOSWorkflow",
    "description": "Discovered from Temporal Cloud. Domain: core. 917 execution(s)",
    "domainPack": "core",
    "source": "discovered",
    "sourceSystem": "cityos-core",
    "isActive": true,
    "executionCount": 917,
    "taskQueues": [
      "cityos-workflow-queue",
      "commerce-queue",
      "commerce-booking-queue",
      "payload-queue",
      "payload-moderation-queue",
      "xsystem-platform-queue",
      "xsystem-content-queue",
      "xsystem-logistics-queue",
      "xsystem-vertical-queue",
      "core-queue",
      "zes-queue",
      "zes-analytics-queue",
      "storage-queue"
    ],
    "tags": [
      "domain:commerce",
      "domain:core",
      "domain:logistics",
      "domain:moderation",
      "domain:payload",
      "domain:storage",
      "domain:xsystem",
      "domain:zes",
      "multi-queue",
      "queue:cityos-workflow-queue",
      "queue:commerce-queue",
      "queue:payload-queue",
      "system:cityos-core",
      "system:erpnext",
      "system:fleetbase",
      "system:medusa",
      "system:minio",
      "system:payload-cms",
      "system:zes-engine"
    ],
    "statusCounts": { "COMPLETED": 915, "RUNNING": 2 },
    "firstSeenAt": "2026-02-10T10:00:00.000Z",
    "lastSeenAt": "2026-02-10T14:30:00.000Z",
    "inputSchema": null,
    "outputSchema": null,
    "retryPolicy": null
  }
]
```

---

### 5.2 Get Queue-System Map

```
GET /api/queue-system-map
```

Returns the complete mapping of task queues to systems and domains, plus the list of all registered systems and domain packs.

**Response Schema:**

```json
{
  "queues": {
    "commerce-queue": {
      "system": "medusa",
      "domain": "commerce",
      "description": "Commerce order processing"
    },
    "payload-queue": {
      "system": "payload-cms",
      "domain": "payload",
      "description": "Payload CMS content sync"
    }
  },
  "systems": [
    "payload-cms", "medusa", "erpnext", "fleetbase", "walt-id",
    "minio", "temporal", "cityos-core", "zes-engine", "ai-services"
  ],
  "domains": [
    "core", "commerce", "logistics", "fleet", "identity",
    "moderation", "notifications", "xsystem", "payload", "poi",
    "zes", "storage", "finance", "governance"
  ]
}
```

---

### 5.3 Get Workflow Definitions (Catalog)

```
GET /api/workflow-definitions
```

Returns locally registered workflow definitions (blueprints with schemas, retry policies, etc.). These are contract-driven specifications that may or may not have been executed on Temporal yet.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `system` | string | Filter by owner system |
| `search` | string | Free-text search |
| `tags` | string | Comma-separated tag filter |
| `domainPack` | string | Filter by domain pack |

---

### 5.4 Register a Workflow

```
POST /api/workflow-registry
```

Manually register a workflow type in the registry. This is useful for pre-registering workflow types before they start executing on Temporal.

**Request Body:**

```json
{
  "workflowType": "order-fulfillment",
  "displayName": "Order Fulfillment",
  "description": "Handles end-to-end order fulfillment process",
  "domainPack": "commerce",
  "sourceSystem": "medusa",
  "taskQueues": ["commerce-queue"],
  "tags": ["fulfillment", "system:medusa", "domain:commerce"]
}
```

---

## 6. Integration Patterns

### 6.1 System Startup Discovery

When your system starts up, query the registry to discover all workflows relevant to you:

```javascript
async function discoverMyWorkflows(systemId) {
  const response = await fetch(
    `${CITYOS_DASHBOARD_URL}/api/workflow-registry?system=${systemId}`
  );
  const workflows = await response.json();

  console.log(`Found ${workflows.length} workflows for ${systemId}:`);
  for (const wf of workflows) {
    console.log(`  - ${wf.workflowType} (${wf.executionCount} executions)`);
    console.log(`    Queues: ${wf.taskQueues.join(', ')}`);
    console.log(`    Tags: ${wf.tags.join(', ')}`);
  }

  return workflows;
}

await discoverMyWorkflows('medusa');
```

### 6.2 Identifying Cross-System Dependencies

Check which other systems are involved in your workflows:

```javascript
async function findCrossSystemWorkflows(systemId) {
  const response = await fetch(
    `${CITYOS_DASHBOARD_URL}/api/workflow-registry?system=${systemId}`
  );
  const workflows = await response.json();

  for (const wf of workflows) {
    const connectedSystems = wf.tags
      .filter(tag => tag.startsWith('system:'))
      .map(tag => tag.replace('system:', ''));

    if (connectedSystems.length > 1) {
      console.log(`${wf.workflowType} spans ${connectedSystems.length} systems:`);
      console.log(`  Systems: ${connectedSystems.join(', ')}`);
    }
  }
}
```

### 6.3 Monitoring Your Queue Health

```javascript
async function getMyQueueStatus(systemId) {
  const mapResponse = await fetch(`${CITYOS_DASHBOARD_URL}/api/queue-system-map`);
  const { queues } = await mapResponse.json();

  const myQueues = Object.entries(queues)
    .filter(([_, info]) => info.system === systemId);

  for (const [queueName, info] of myQueues) {
    const wfResponse = await fetch(
      `${CITYOS_DASHBOARD_URL}/api/workflow-registry?queue=${queueName}`
    );
    const workflows = await wfResponse.json();
    console.log(`Queue: ${queueName} (${info.domain}) - ${workflows.length} workflow type(s)`);
  }
}
```

### 6.4 Webhook-Based Discovery Updates

```javascript
const eventSource = new EventSource(`${CITYOS_DASHBOARD_URL}/api/sse`);
eventSource.addEventListener('workflow-registry-update', (event) => {
  const data = JSON.parse(event.data);
  console.log('Registry updated:', data);
});
```

---

## 7. Per-System Quick Reference

### Medusa Commerce
- **System ID**: `medusa`
- **Owned Queues**: `commerce-queue`, `commerce-booking-queue`
- **Domains**: `commerce`
- **Discovery**: `GET /api/workflow-registry?system=medusa`
- **Expected tags**: `system:medusa`, `domain:commerce`, `fulfillment`, `booking`

### Payload CMS
- **System ID**: `payload-cms`
- **Owned Queues**: `payload-queue`, `payload-moderation-queue`, `payload-notifications-queue`, `xsystem-content-queue`
- **Domains**: `payload`, `moderation`, `notifications`, `xsystem`
- **Discovery**: `GET /api/workflow-registry?system=payload-cms`
- **Expected tags**: `system:payload-cms`, `domain:payload`, `moderation`, `sync`

### ERPNext
- **System ID**: `erpnext`
- **Owned Queues**: `xsystem-platform-queue`, `xsystem-vertical-queue`
- **Domains**: `xsystem`
- **Discovery**: `GET /api/workflow-registry?system=erpnext`
- **Expected tags**: `system:erpnext`, `domain:xsystem`, `sync`

### Fleetbase
- **System ID**: `fleetbase`
- **Owned Queues**: `xsystem-logistics-queue`
- **Domains**: `logistics`
- **Discovery**: `GET /api/workflow-registry?system=fleetbase`
- **Expected tags**: `system:fleetbase`, `domain:logistics`, `fulfillment`

### Walt.id
- **System ID**: `walt-id`
- **Owned Queues**: *(none currently mapped)*
- **Domains**: `identity`
- **Discovery**: `GET /api/workflow-registry?system=walt-id`
- **Expected tags**: `system:walt-id`, `domain:identity`, `verification`

### MinIO AIStor
- **System ID**: `minio`
- **Owned Queues**: `storage-queue`
- **Domains**: `storage`
- **Discovery**: `GET /api/workflow-registry?system=minio`
- **Expected tags**: `system:minio`, `domain:storage`

### ZES Engine
- **System ID**: `zes-engine`
- **Owned Queues**: `zes-queue`, `zes-analytics-queue`
- **Domains**: `zes`
- **Discovery**: `GET /api/workflow-registry?system=zes-engine`
- **Expected tags**: `system:zes-engine`, `domain:zes`, `analytics`

### AI Services
- **System ID**: `ai-services`
- **Owned Queues**: *(none currently mapped)*
- **Discovery**: `GET /api/workflow-registry?system=ai-services`

### CityOS Core
- **System ID**: `cityos-core`
- **Owned Queues**: `cityos-workflow-queue`, `cityos-main`, `core-queue`, `core-maintenance-queue`, `notifications-queue`, `moderation-queue`, `poi-realtime-queue`, `poi-views-queue`
- **Domains**: `core`, `notifications`, `moderation`, `poi`
- **Discovery**: `GET /api/workflow-registry?system=cityos-core`
- **Expected tags**: `system:cityos-core`, `domain:core`, `scheduled`, `moderation`, `verification`

---

## 8. Registering New Queues

If your system needs a new task queue that isn't in the mapping:

1. **Choose a queue name** following the convention: `{system-prefix}-{purpose}-queue` (e.g., `commerce-returns-queue`, `fleet-dispatch-queue`)
2. **Contact the CityOS platform team** to add the queue to `QUEUE_SYSTEM_MAP`
3. **Until registered**, the inference engine will attempt to match your queue by prefix

**Queue naming prefixes and their auto-inferred systems:**

| Prefix | Inferred System |
|---|---|
| `commerce` | medusa |
| `payload` | payload-cms |
| `xsystem` | erpnext |
| `zes` | zes-engine |
| `storage` | minio |
| `core` | cityos-core |
| `poi` | cityos-core |
| `moderation` | cityos-core |
| `notifications` | cityos-core |
| `fleet` or `logistics` | fleetbase |
| `walt` | walt-id |
| `ai` | ai-services |

---

## 9. Domain Packs Reference

| Domain Pack | Description | Primary Systems |
|---|---|---|
| `core` | Platform-wide operations | cityos-core |
| `commerce` | E-commerce, orders, payments | medusa |
| `logistics` | Fleet management, delivery | fleetbase |
| `fleet` | Vehicle and asset tracking | fleetbase |
| `identity` | Credentials, verification | walt-id |
| `moderation` | Content moderation | cityos-core, payload-cms |
| `notifications` | Alert and notification delivery | cityos-core, payload-cms |
| `xsystem` | Cross-system integration | erpnext, payload-cms |
| `payload` | CMS content operations | payload-cms |
| `poi` | Points of interest | cityos-core |
| `zes` | Zone Experience System | zes-engine |
| `storage` | Object storage operations | minio |
| `finance` | Financial operations | erpnext |
| `governance` | Policy and compliance | cityos-core |

---

## 10. FAQ

**Q: How often is the registry updated?**  
A: The Temporal Sync Engine runs continuously, discovering new workflow types and updating execution counts in real-time.

**Q: A workflow shows up under my system but I didn't create it. Why?**  
A: The workflow runs on at least one task queue mapped to your system. Check the `taskQueues` array.

**Q: How do I find workflows that involve both my system and another?**  
A: Use the `tags` filter: `GET /api/workflow-registry?tags=system:medusa,system:erpnext`

**Q: Can I register a workflow type before it starts executing?**  
A: Yes. Use `POST /api/workflow-registry` to pre-register. They merge with discovered data once execution begins.

**Q: What happens if my workflow uses a queue not in the mapping?**  
A: The system uses prefix-based inference as a fallback.

**Q: How do I see execution statistics for my workflows?**  
A: Each registry entry includes `executionCount` and `statusCounts`. For detailed analytics, use `GET /api/analytics/executions?system={systemId}`.
