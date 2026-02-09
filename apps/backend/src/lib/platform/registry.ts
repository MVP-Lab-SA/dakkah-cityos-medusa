export const PLATFORM_SYSTEMS_REGISTRY = [
  { id: "cms-payload", name: "Payload CMS", type: "internal", category: "cms", status: "active", capabilities: ["content-management", "media", "users", "localization"], hasBaseUrl: true },
  { id: "cms-bff", name: "CMS BFF Layer", type: "internal", category: "cms", status: "active", capabilities: ["content-aggregation", "navigation", "catalog", "tenant-resolution"], hasBaseUrl: true },
  { id: "commerce-medusa", name: "Medusa Commerce", type: "external", category: "commerce", status: "active", capabilities: ["product-catalog", "cart", "checkout", "orders", "inventory"], hasBaseUrl: true },
  { id: "identity-auth", name: "CityOS Identity", type: "internal", category: "identity", status: "active", capabilities: ["authentication", "authorization", "rbac", "api-keys", "sessions"], hasBaseUrl: false },
  { id: "payments-stripe", name: "Stripe Payments", type: "stub", category: "payments", status: "planned", capabilities: ["payment-processing", "subscriptions", "invoicing", "refunds"], hasBaseUrl: false },
  { id: "analytics-internal", name: "CityOS Analytics", type: "internal", category: "analytics", status: "planned", capabilities: ["event-tracking", "dashboards", "reporting", "real-time-metrics"], hasBaseUrl: false },
  { id: "communication-email", name: "Email Service", type: "stub", category: "communication", status: "active", capabilities: ["transactional-email", "templates", "bulk-email"], hasBaseUrl: false },
  { id: "communication-sms", name: "SMS Gateway", type: "stub", category: "communication", status: "active", capabilities: ["sms-delivery", "otp", "notifications"], hasBaseUrl: false },
  { id: "infra-database", name: "PostgreSQL", type: "internal", category: "infrastructure", status: "active", capabilities: ["data-persistence", "transactions", "full-text-search", "json"], hasBaseUrl: false },
  { id: "infra-cache", name: "Redis Cache", type: "stub", category: "infrastructure", status: "planned", capabilities: ["key-value-cache", "session-store", "rate-limiting", "pub-sub"], hasBaseUrl: false },
  { id: "infra-storage", name: "Object Storage", type: "internal", category: "infrastructure", status: "active", capabilities: ["file-upload", "media-storage", "cdn-origin", "presigned-urls", "s3"], hasBaseUrl: true },
  { id: "observability-health", name: "Health Monitor", type: "internal", category: "infrastructure", status: "active", capabilities: ["health-checks", "readiness-probes", "liveness-probes"], hasBaseUrl: false },
  { id: "observability-metrics", name: "Metrics Collector", type: "internal", category: "analytics", status: "active", capabilities: ["prometheus-metrics", "custom-counters", "latency-tracking"], hasBaseUrl: false },
  { id: "search-elasticsearch", name: "Elasticsearch", type: "stub", category: "infrastructure", status: "planned", capabilities: ["full-text-search", "faceted-search", "autocomplete", "geo-search"], hasBaseUrl: false },
  { id: "geo-mapping", name: "Mapping Service", type: "stub", category: "logistics", status: "planned", capabilities: ["geocoding", "directions", "poi-mapping", "geofencing"], hasBaseUrl: false },
  { id: "ai-recommendations", name: "AI Engine", type: "stub", category: "analytics", status: "planned", capabilities: ["recommendations", "personalization", "embeddings", "similarity"], hasBaseUrl: false },
  { id: "logistics-delivery", name: "Delivery Service", type: "stub", category: "logistics", status: "planned", capabilities: ["delivery-tracking", "route-optimization", "scheduling"], hasBaseUrl: false },
  { id: "iot-platform", name: "IoT Devices", type: "stub", category: "infrastructure", status: "planned", capabilities: ["device-registration", "telemetry", "firmware-updates"], hasBaseUrl: false },
  { id: "social-platform", name: "Social Media", type: "stub", category: "communication", status: "planned", capabilities: ["post-publishing", "audience-insights", "engagement"], hasBaseUrl: false },
  { id: "workflow-temporal", name: "Temporal Workflows", type: "external", category: "workflow", status: "active", capabilities: ["workflow-orchestration", "activities", "signals", "queries", "task-queues"], hasBaseUrl: true },
  { id: "erp-erpnext", name: "ERPNext", type: "external", category: "erp", status: "planned", capabilities: ["accounting", "invoicing", "payouts", "purchase-orders", "tax"], hasBaseUrl: false },
  { id: "logistics-fleetbase", name: "Fleetbase Logistics", type: "external", category: "logistics", status: "planned", capabilities: ["delivery-tracking", "fleet-management", "proof-of-delivery"], hasBaseUrl: false },
]

export const PLATFORM_CAPABILITIES = {
  plugins: {
    official: ["multi-tenant", "search", "seo", "richtext-lexical", "form-builder", "nested-docs", "redirects", "mcp", "import-export", "cloud-storage"],
    community: ["docs-reorder", "fields-select", "translator", "better-fields", "totp-2fa"],
    custom: ["openapi-generator", "rbac-utils", "author-fields", "localized-slug", "event-tracking", "tree-list-view", "visual-editor", "video-processing"],
  },
  features: {
    twoFactorAuth: true,
    rbac: true,
    multiTenancy: true,
    localization: { locales: ["en", "fr", "ar"], defaultLocale: "en" },
    objectStorage: true,
    videoProcessing: true,
    openApiDocs: true,
    aiContent: false,
    analytics: false,
    payments: false,
    errorTracking: false,
    workflowOrchestration: false,
  },
  endpoints: {
    "/store/platform/context": { method: "GET", auth: "none", purpose: "Full context resolution" },
    "/store/platform/tenants/default": { method: "GET", auth: "none", purpose: "Default tenant bootstrap" },
    "/store/platform/capabilities": { method: "GET", auth: "none", purpose: "Plugin/feature/endpoint discovery" },
    "/store/cityos/tenant": { method: "GET", auth: "none", purpose: "Tenant resolution" },
    "/store/cityos/governance": { method: "GET", auth: "none", purpose: "Governance policies" },
    "/store/cityos/nodes": { method: "GET", auth: "none", purpose: "Node hierarchy" },
    "/store/cityos/persona": { method: "GET", auth: "none", purpose: "Persona resolution" },
  },
}

export const CONTEXT_HEADERS = [
  "X-CityOS-Correlation-Id",
  "X-CityOS-Tenant-Id",
  "X-CityOS-Node-Id",
  "X-CityOS-Node-Type",
  "X-CityOS-Locale",
  "X-CityOS-User-Id",
  "X-CityOS-Channel",
  "X-Idempotency-Key",
] as const

export const HIERARCHY_LEVELS = ["CITY", "DISTRICT", "ZONE", "FACILITY", "ASSET"] as const

export const DEFAULT_TENANT_SLUG = "dakkah"
export const DEFAULT_TENANT_ID = "01KGZ2JRYX607FWMMYQNQRKVWS"
