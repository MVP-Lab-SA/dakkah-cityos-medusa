/**
 * =============================================================================
 * TEMPORAL CLOUD INTEGRATION SPECIFICATION
 * =============================================================================
 *
 * Contract document for the Temporal Cloud integration with Dakkah CityOS Commerce.
 *
 * Temporal Cloud provides all workflow orchestration for the platform: long-running
 * business processes (order sagas, vendor onboarding, subscription lifecycle),
 * cross-system coordination (ERPNext sync, CMS sync, identity issuance),
 * dynamic AI agent workflows, and reliable event processing via the outbox pattern.
 *
 * Medusa is the source of truth for all commerce and platform data. Temporal is
 * the orchestration engine — it does not own data, but coordinates state transitions
 * across Medusa modules and external integrations (ERPNext, Payload CMS, Fleetbase,
 * Walt.id, Stripe).
 *
 * Every workflow receives a NodeContext (tenantId, nodeId, channel, locale) to
 * ensure multi-tenant isolation and governance compliance.
 *
 * @module TemporalSpec
 * @version 1.0.0
 * @lastUpdated 2026-02-09
 */

// All system workflows are dispatched via the generic "cityOSWorkflow" workflow type
// on the "cityos-workflow-queue" task queue. The workflow ID from EVENT_WORKFLOW_MAP
// is passed as an argument, not as the Temporal workflow type.
// Dynamic agent workflows use "cityOSDynamicAgentWorkflow" on "cityos-dynamic-queue".

// ---------------------------------------------------------------------------
// Shared Types
// ---------------------------------------------------------------------------

/** Scope tiers matching Medusa tenant.scope_tier */
export type ScopeTier = "nano" | "micro" | "small" | "medium" | "large" | "mega" | "global"

/** Temporal workflow execution status */
export type WorkflowExecutionStatus =
  | "Running"
  | "Completed"
  | "Failed"
  | "Cancelled"
  | "Terminated"
  | "ContinuedAsNew"
  | "TimedOut"

/** Task queue names used by the platform */
export type TaskQueueName =
  | "cityos-workflow-queue"
  | "cityos-dynamic-queue"
  | string

/** Workflow category for organizational grouping */
export type WorkflowCategory =
  | "commerce"
  | "vendor"
  | "platform"
  | "commerce-lifecycle"
  | "sync"
  | "fulfillment"
  | "finance"
  | "identity"
  | "governance"
  | "dynamic"

/** Node context passed to every workflow for multi-tenant isolation */
export interface NodeContext {
  tenantId?: string
  nodeId?: string
  channel?: string
  locale?: string
}

/** Correlation and causation tracking for event chains */
export interface EventCorrelation {
  correlationId: string
  causationId?: string
  traceId?: string
}

/** Standard workflow input envelope */
export interface WorkflowEnvelope {
  workflowId: string
  input: Record<string, any>
  nodeContext: NodeContext
  correlationId: string
  causationId?: string
  metadata?: Record<string, any>
}

/** Dynamic agent workflow input */
export interface DynamicWorkflowInput {
  goal: string
  context: Record<string, any>
  availableTools: string[]
  maxIterations?: number
  nodeContext?: NodeContext
  metadata?: Record<string, any>
}

/** Dynamic agent workflow result handle */
export interface DynamicWorkflowResult {
  workflowRunId: string
  workflowId: string
  taskQueue: string
}

/** Event outbox entry — persisted in Medusa DB before dispatch */
export interface OutboxEvent {
  id: string
  event_type: string
  payload: Record<string, any>
  tenant_id?: string
  node_id?: string
  channel?: string
  correlation_id: string
  causation_id?: string
  status: "pending" | "published" | "failed"
  retry_count: number
  max_retries: number
  created_at: string
  published_at?: string
  failed_at?: string
  error_message?: string
}

/** Outbox envelope format sent to Temporal */
export interface OutboxEnvelope {
  eventId: string
  eventType: string
  payload: Record<string, any>
  nodeContext: NodeContext
  correlation: EventCorrelation
  timestamp: string
  source: "medusa"
}

/** Workflow health check result */
export interface TemporalHealthCheck {
  connected: boolean
  endpoint: string
  namespace: string
  error?: string
}

/** Workflow description returned from Temporal */
export interface WorkflowDescription {
  workflowId: string
  runId: string
  status: WorkflowExecutionStatus
  type: string
  startTime: string
  closeTime?: string
  taskQueue: string
  queryResult?: any
}

/** Activity retry policy */
export interface RetryPolicy {
  initialInterval: string
  backoffCoefficient: number
  maximumInterval: string
  maximumAttempts: number
  nonRetryableErrorTypes?: string[]
}

/** Activity timeout configuration */
export interface ActivityTimeouts {
  scheduleToCloseTimeout: string
  startToCloseTimeout: string
  heartbeatTimeout?: string
}

// ---------------------------------------------------------------------------
// 1. TEMPORAL_CONNECTION
// ---------------------------------------------------------------------------

/**
 * Temporal Cloud connection configuration and lifecycle management.
 * Uses lazy initialization — the client is created on first use and reused.
 * Supports Temporal Cloud with mTLS or API key authentication.
 */
export const TEMPORAL_CONNECTION = {

  description: "Temporal Cloud connection with lazy initialization, health checks, and namespace configuration",

  initialization: {
    description: "The Temporal client is created lazily on first workflow dispatch. Connection uses TLS to Temporal Cloud.",
    strategy: "lazy",
    steps: {
      step_1: "Check if client singleton already exists → return if so",
      step_2: "Verify TEMPORAL_API_KEY environment variable is set",
      step_3: "Dynamically import @temporalio/client SDK",
      step_4: "Create Connection with TLS to TEMPORAL_ENDPOINT",
      step_5: "Create Client with connection and TEMPORAL_NAMESPACE",
      step_6: "Cache client singleton for subsequent calls",
    },
    error_handling: {
      sdk_not_installed: "Set temporalUnavailable flag to avoid repeated import attempts. Throw descriptive error.",
      missing_api_key: "Throw error with clear message about missing TEMPORAL_API_KEY.",
      connection_failure: "Throw with connection details for debugging. Do not cache failed connections.",
    },
  },

  healthCheck: {
    description: "Verify Temporal Cloud connectivity. Called by /admin/integrations/health endpoint.",
    method: "checkTemporalHealth()",
    returns: "TemporalHealthCheck — { connected: boolean, endpoint: string, namespace: string, error?: string }",
    implementation: "Attempt to get or create the Temporal client. If successful, connected=true. If any error, connected=false with error message.",
  },

  connection_params: {
    address: "TEMPORAL_ENDPOINT — Temporal Cloud gRPC endpoint (e.g., 'ap-northeast-1.aws.api.temporal.io:7233')",
    tls: "true — Always use TLS for Temporal Cloud",
    apiKey: "TEMPORAL_API_KEY — Temporal Cloud API key for authentication",
    namespace: "TEMPORAL_NAMESPACE — Temporal namespace (e.g., 'quickstart-dakkah-cityos.djvai')",
  },

  optional_tls_config: {
    description: "For Temporal Cloud with mTLS certificate authentication (alternative to API key)",
    client_cert_path: "TEMPORAL_TLS_CERT_PATH — Path to client TLS certificate (.pem)",
    client_key_path: "TEMPORAL_TLS_KEY_PATH — Path to client TLS private key (.pem)",
    ca_cert_path: "TEMPORAL_TLS_CA_PATH — Path to CA certificate (.pem) — optional",
  },
} as const

// ---------------------------------------------------------------------------
// 2. TEMPORAL_TASK_QUEUES
// ---------------------------------------------------------------------------

/**
 * Task queues define logical groupings of workflow and activity processing.
 * Workers poll specific task queues to execute workflows and activities.
 * Each queue can be independently scaled based on load.
 */
export const TEMPORAL_TASK_QUEUES = {

  "cityos-workflow-queue": {
    name: "cityos-workflow-queue" as const,
    description: "Primary task queue for all system workflows (order orchestration, vendor management, sync, fulfillment, finance, identity, governance). Handles the majority of platform orchestration.",
    workflow_type: "cityOSWorkflow",
    workflows: "All EVENT_WORKFLOW_MAP workflows except dynamic agent workflows",
    worker_requirements: {
      activities: "Must implement all activities referenced by system workflows: Medusa API calls, ERPNext API calls, Payload CMS sync, Fleetbase dispatch, Walt.id credential operations, Stripe operations, email/notification sending",
      concurrency: "Recommended: 50-200 concurrent activity executions per worker",
      scaling: "Scale workers based on event volume. See scaling_recommendations_per_tier.",
    },
    scaling_recommendations_per_tier: {
      nano: { workers: 1, max_concurrent_activities: 10, description: "Single worker, low concurrency" },
      micro: { workers: 1, max_concurrent_activities: 25, description: "Single worker, moderate concurrency" },
      small: { workers: 2, max_concurrent_activities: 50, description: "Two workers for redundancy" },
      medium: { workers: 3, max_concurrent_activities: 100, description: "Three workers for throughput" },
      large: { workers: 5, max_concurrent_activities: 200, description: "Five workers for high throughput" },
      mega: { workers: 10, max_concurrent_activities: 500, description: "Ten workers for enterprise load" },
      global: { workers: -1, max_concurrent_activities: -1, description: "Auto-scale based on queue depth. -1 means auto" },
    } as Record<ScopeTier, { workers: number; max_concurrent_activities: number; description: string }>,
  },

  "cityos-dynamic-queue": {
    name: "cityos-dynamic-queue" as const,
    description: "Task queue for dynamic AI agent workflows. These are goal-based workflows that use LLM reasoning to decide which activities to execute. Isolated from system workflows to prevent resource contention.",
    workflow_type: "cityOSDynamicAgentWorkflow",
    workflows: "Dynamic agent workflows only (started via workflow.dynamic.start event or API)",
    worker_requirements: {
      activities: "Must implement: LLM inference (OpenAI/Anthropic), tool execution activities (Medusa queries, API calls, data processing), result aggregation",
      concurrency: "Recommended: 10-50 concurrent activity executions per worker (LLM calls are high-latency)",
      scaling: "Scale based on active dynamic workflows. Each dynamic workflow may run 1-20 iterations.",
    },
    scaling_recommendations_per_tier: {
      nano: { workers: 0, max_concurrent_activities: 0, description: "Dynamic workflows not available at nano tier" },
      micro: { workers: 0, max_concurrent_activities: 0, description: "Dynamic workflows not available at micro tier" },
      small: { workers: 1, max_concurrent_activities: 5, description: "Single worker, limited concurrency" },
      medium: { workers: 1, max_concurrent_activities: 10, description: "Single worker, moderate concurrency" },
      large: { workers: 2, max_concurrent_activities: 25, description: "Two workers for throughput" },
      mega: { workers: 3, max_concurrent_activities: 50, description: "Three workers for enterprise" },
      global: { workers: -1, max_concurrent_activities: -1, description: "Auto-scale. -1 means auto" },
    } as Record<ScopeTier, { workers: number; max_concurrent_activities: number; description: string }>,
  },
} as const

// ---------------------------------------------------------------------------
// 3. SYSTEM_WORKFLOWS — EVENT_WORKFLOW_MAP
// ---------------------------------------------------------------------------

/**
 * Explicit EVENT_WORKFLOW_MAP — canonical event-to-workflow mapping.
 * This is the complete set of Medusa events that trigger Temporal workflows.
 *
 * "order.placed"              → "xsystem.unified-order-orchestrator"
 * "order.cancelled"           → "xsystem.order-cancellation-saga"
 * "payment.initiated"         → "xsystem.multi-gateway-payment"
 * "refund.requested"          → "xsystem.refund-compensation-saga"
 * "vendor.registered"         → "xsystem.vendor-onboarding-verification"
 * "vendor.created"            → "commerce.vendor-onboarding"
 * "dispute.opened"            → "xsystem.vendor-dispute-resolution"
 * "return.initiated"          → "xsystem.returns-processing"
 * "kyc.requested"             → "xsystem.kyc-verification"
 * "subscription.created"      → "xsystem.subscription-lifecycle"
 * "booking.created"           → "xsystem.service-booking-orchestrator"
 * "auction.started"           → "xsystem.auction-lifecycle"
 * "restaurant-order.placed"   → "xsystem.restaurant-order-orchestrator"
 * "product.updated"           → "commerce.sync-product-to-cms"
 * "workflow.dynamic.start"    → "dynamic-agent-orchestrator"
 * "governance.policy.changed" → "xsystem.governance-policy-propagation"
 * "node.created"              → "xsystem.node-provisioning"
 * "tenant.provisioned"        → "xsystem.tenant-setup-saga"
 * "node.updated"              → "xsystem.node-update-propagation"
 * "node.deleted"              → "xsystem.node-decommission"
 * "tenant.updated"            → "xsystem.tenant-config-sync"
 * "store.created"             → "commerce.store-setup"
 * "store.updated"             → "commerce.store-config-sync"
 * "product.created"           → "commerce.product-catalog-sync"
 * "customer.created"          → "xsystem.customer-onboarding"
 * "customer.updated"          → "xsystem.customer-profile-sync"
 * "vendor.approved"           → "xsystem.vendor-ecosystem-setup"
 * "vendor.suspended"          → "xsystem.vendor-suspension-cascade"
 * "inventory.updated"         → "xsystem.inventory-reconciliation"
 * "fulfillment.created"       → "xsystem.fulfillment-dispatch"
 * "fulfillment.shipped"       → "xsystem.shipment-tracking-start"
 * "fulfillment.delivered"     → "xsystem.delivery-confirmation"
 * "invoice.created"           → "xsystem.invoice-processing"
 * "payment.completed"         → "xsystem.payment-reconciliation"
 * "kyc.completed"             → "xsystem.kyc-credential-issuance"
 * "membership.created"        → "xsystem.membership-credential-issuance"
 */

/**
 * All system workflows mapped from Medusa events. Each event type maps to
 * exactly one workflow ID. The workflow is started on the `cityos-workflow-queue`
 * task queue with the event payload and NodeContext.
 *
 * Workflow ID format: `{category}.{workflow-name}`
 * Runtime workflow ID: `{workflow-id}-{timestamp}` for uniqueness
 */
export const SYSTEM_WORKFLOWS = {

  /**
   * =========================================================================
   * COMMERCE WORKFLOWS
   * =========================================================================
   * Core order lifecycle, payment processing, refunds, and returns.
   */
  commerce: {

    "unified-order-orchestrator": {
      workflowId: "xsystem.unified-order-orchestrator" as const,
      triggeredBy: "order.placed",
      taskQueue: "cityos-workflow-queue",
      description: "End-to-end order orchestration saga. Validates inventory, processes payment, creates fulfillment, syncs to ERPNext (invoice), notifies customer, and handles compensation on failure.",
      input: {
        order_id: "string — Medusa order ID",
        customer_id: "string — Customer ID",
        items: "Array<{ variant_id: string, quantity: number, unit_price: number }>",
        payment_info: "{ provider_id: string, amount: number, currency: string }",
        shipping_info: "{ address: object, method_id: string }",
        tenant_id: "string — Tenant context",
      },
      activities: [
        "validateInventory",
        "reserveInventory",
        "processPayment",
        "createERPNextInvoice",
        "createFulfillment",
        "notifyCustomer",
        "syncToPayloadCMS",
      ],
      compensation: "On failure: release inventory reservation, refund payment, cancel invoice, notify customer of failure",
      timeout: "30 minutes",
      retry_policy: { initialInterval: "1s", backoffCoefficient: 2, maximumInterval: "60s", maximumAttempts: 3 },
    },

    "order-cancellation-saga": {
      workflowId: "xsystem.order-cancellation-saga" as const,
      triggeredBy: "order.cancelled",
      taskQueue: "cityos-workflow-queue",
      description: "Handles order cancellation. Reverses inventory, processes refund, cancels ERPNext invoice, cancels delivery task in Fleetbase, notifies all parties.",
      input: {
        order_id: "string — Medusa order ID",
        cancellation_reason: "string — Reason for cancellation",
        cancelled_by: "string — Who cancelled (customer, vendor, admin, system)",
        refund_amount: "number | undefined — Custom refund amount (if partial)",
      },
      activities: [
        "releaseInventoryReservation",
        "cancelERPNextInvoice",
        "processRefund",
        "cancelFleetbaseDelivery",
        "notifyCustomer",
        "notifyVendor",
        "updateAnalytics",
      ],
      timeout: "15 minutes",
      retry_policy: { initialInterval: "1s", backoffCoefficient: 2, maximumInterval: "30s", maximumAttempts: 3 },
    },

    "multi-gateway-payment": {
      workflowId: "xsystem.multi-gateway-payment" as const,
      triggeredBy: "payment.initiated",
      taskQueue: "cityos-workflow-queue",
      description: "Orchestrates payment across multiple gateways (Stripe, bank transfer, cash). Handles split payments, currency conversion, and payment confirmation.",
      input: {
        order_id: "string — Medusa order ID",
        payment_sessions: "Array<{ provider_id: string, amount: number, currency: string, data: Record<string, any> }>",
      },
      activities: [
        "validatePaymentSessions",
        "capturePayments",
        "recordERPNextPaymentEntries",
        "reconcilePayments",
        "notifyPaymentComplete",
      ],
      timeout: "10 minutes",
      retry_policy: { initialInterval: "2s", backoffCoefficient: 2, maximumInterval: "60s", maximumAttempts: 5 },
    },

    "refund-compensation-saga": {
      workflowId: "xsystem.refund-compensation-saga" as const,
      triggeredBy: "refund.requested",
      taskQueue: "cityos-workflow-queue",
      description: "Processes refunds with compensation logic. Creates ERPNext Credit Note, processes gateway refund, adjusts commissions, updates vendor payout.",
      input: {
        order_id: "string — Original order ID",
        refund_id: "string — Refund request ID",
        amount: "number — Refund amount",
        reason: "string — Refund reason",
        items: "Array<{ variant_id: string, quantity: number }> | undefined",
      },
      activities: [
        "validateRefundEligibility",
        "createERPNextCreditNote",
        "processGatewayRefund",
        "adjustVendorCommission",
        "updatePayoutBalance",
        "notifyCustomer",
        "notifyVendor",
      ],
      timeout: "15 minutes",
      retry_policy: { initialInterval: "1s", backoffCoefficient: 2, maximumInterval: "30s", maximumAttempts: 3 },
    },

    "returns-processing": {
      workflowId: "xsystem.returns-processing" as const,
      triggeredBy: "return.initiated",
      taskQueue: "cityos-workflow-queue",
      description: "Handles product returns. Validates return eligibility, arranges return shipment via Fleetbase, receives inventory, processes refund.",
      input: {
        order_id: "string — Original order ID",
        return_id: "string — Return request ID",
        items: "Array<{ variant_id: string, quantity: number, reason: string }>",
        return_method: "'pickup' | 'drop_off' | 'mail'",
      },
      activities: [
        "validateReturnWindow",
        "createReturnAuthorization",
        "arrangeReturnShipment",
        "receiveReturnedItems",
        "inspectReturnedItems",
        "processReturnRefund",
        "restockItems",
        "notifyCustomer",
      ],
      timeout: "7 days",
      retry_policy: { initialInterval: "5s", backoffCoefficient: 2, maximumInterval: "5m", maximumAttempts: 5 },
    },
  },

  /**
   * =========================================================================
   * VENDOR WORKFLOWS
   * =========================================================================
   * Vendor onboarding, dispute resolution, ecosystem setup, and suspension.
   */
  vendor: {

    "vendor-onboarding-verification": {
      workflowId: "xsystem.vendor-onboarding-verification" as const,
      triggeredBy: "vendor.registered",
      taskQueue: "cityos-workflow-queue",
      description: "Multi-step vendor onboarding: verify documents, run KYC via Walt.id, create ERPNext Supplier, create Payload CMS vendor profile, set up Fleetbase places for POIs, issue VendorVerificationCredential.",
      input: {
        vendor_id: "string — Medusa vendor ID",
        tenant_id: "string — Parent marketplace tenant ID",
        business_name: "string",
        contact_email: "string",
        documents: "Array<{ type: string, url: string }>",
      },
      activities: [
        "validateBusinessDocuments",
        "runKYCVerification",
        "createERPNextSupplier",
        "createPayloadVendorProfile",
        "createFleetbasePlaces",
        "issueDID",
        "issueVendorCredential",
        "notifyVendorApproval",
        "notifyPlatformAdmin",
      ],
      timeout: "48 hours",
      retry_policy: { initialInterval: "5s", backoffCoefficient: 2, maximumInterval: "5m", maximumAttempts: 3 },
    },

    "vendor-dispute-resolution": {
      workflowId: "xsystem.vendor-dispute-resolution" as const,
      triggeredBy: "dispute.opened",
      taskQueue: "cityos-workflow-queue",
      description: "Handles disputes between customers and vendors. Escalation workflow with evidence collection, arbitration, and resolution.",
      input: {
        dispute_id: "string",
        order_id: "string",
        vendor_id: "string",
        customer_id: "string",
        reason: "string",
        evidence: "Array<{ type: string, url: string }>",
      },
      activities: [
        "notifyVendor",
        "collectVendorResponse",
        "reviewEvidence",
        "makeDecision",
        "executeResolution",
        "notifyParties",
        "updateVendorScore",
      ],
      timeout: "14 days",
      retry_policy: { initialInterval: "10s", backoffCoefficient: 2, maximumInterval: "10m", maximumAttempts: 3 },
    },

    "vendor-ecosystem-setup": {
      workflowId: "xsystem.vendor-ecosystem-setup" as const,
      triggeredBy: "vendor.approved",
      taskQueue: "cityos-workflow-queue",
      description: "After vendor approval, sets up the full vendor ecosystem: Stripe Connect account, default product catalog sync, notification channels, analytics dashboard.",
      input: {
        vendor_id: "string",
        tenant_id: "string",
        approved_verticals: "string[]",
      },
      activities: [
        "setupStripeConnect",
        "createDefaultCatalog",
        "configureNotifications",
        "setupAnalyticsDashboard",
        "issueMarketplaceSellerCredential",
        "sendWelcomePackage",
      ],
      timeout: "1 hour",
      retry_policy: { initialInterval: "2s", backoffCoefficient: 2, maximumInterval: "60s", maximumAttempts: 5 },
    },

    "vendor-suspension-cascade": {
      workflowId: "xsystem.vendor-suspension-cascade" as const,
      triggeredBy: "vendor.suspended",
      taskQueue: "cityos-workflow-queue",
      description: "Cascading suspension of a vendor: hide products, pause active orders, disable ERPNext Supplier, revoke credentials, notify affected customers.",
      input: {
        vendor_id: "string",
        tenant_id: "string",
        reason: "string",
        suspended_by: "string",
      },
      activities: [
        "hideVendorProducts",
        "pauseActiveOrders",
        "disableERPNextSupplier",
        "revokeVendorCredentials",
        "notifyAffectedCustomers",
        "notifyVendor",
        "logAuditEntry",
      ],
      timeout: "30 minutes",
      retry_policy: { initialInterval: "1s", backoffCoefficient: 2, maximumInterval: "30s", maximumAttempts: 3 },
    },
  },

  /**
   * =========================================================================
   * PLATFORM WORKFLOWS
   * =========================================================================
   * Node provisioning, tenant setup, configuration propagation.
   */
  platform: {

    "node-provisioning": {
      workflowId: "xsystem.node-provisioning" as const,
      triggeredBy: "node.created",
      taskQueue: "cityos-workflow-queue",
      description: "Provision a new node in the CityOS hierarchy. Creates associated records across all integrated systems.",
      input: {
        node_id: "string",
        tenant_id: "string",
        node_type: "string — CITY, DISTRICT, ZONE, FACILITY, ASSET",
        parent_node_id: "string | undefined",
        metadata: "Record<string, any>",
      },
      activities: [
        "createNodeRecord",
        "syncToPayloadCMS",
        "createFleetbaseZone",
        "setupGovernancePolicies",
        "notifyTenantAdmin",
      ],
      timeout: "15 minutes",
    },

    "node-update-propagation": {
      workflowId: "xsystem.node-update-propagation" as const,
      triggeredBy: "node.updated",
      taskQueue: "cityos-workflow-queue",
      description: "Propagate node configuration changes to all integrated systems and child nodes.",
      input: {
        node_id: "string",
        tenant_id: "string",
        changes: "Record<string, any>",
      },
      activities: [
        "updateNodeRecord",
        "syncToPayloadCMS",
        "updateFleetbaseZone",
        "propagateToChildNodes",
        "updateGovernancePolicies",
      ],
      timeout: "15 minutes",
    },

    "node-decommission": {
      workflowId: "xsystem.node-decommission" as const,
      triggeredBy: "node.deleted",
      taskQueue: "cityos-workflow-queue",
      description: "Safely decommission a node. Migrates or archives data, removes from integrated systems, notifies affected tenants.",
      input: {
        node_id: "string",
        tenant_id: "string",
        migration_target_node_id: "string | undefined",
      },
      activities: [
        "validateNoActiveOrders",
        "migrateNodeData",
        "removeFromPayloadCMS",
        "removeFleetbaseZone",
        "archiveNodeRecord",
        "notifyAffectedTenants",
      ],
      timeout: "1 hour",
    },

    "tenant-setup-saga": {
      workflowId: "xsystem.tenant-setup-saga" as const,
      triggeredBy: "tenant.provisioned",
      taskQueue: "cityos-workflow-queue",
      description: "Full tenant provisioning saga. Creates records across all systems: ERPNext Company, Payload CMS tenant, Fleetbase configuration, Walt.id tenant DID, default store setup.",
      input: {
        tenant_id: "string",
        tenant_name: "string",
        scope_tier: "ScopeTier",
        tenant_type: "string",
        owner_user_id: "string",
        configuration: "Record<string, any>",
      },
      activities: [
        "createERPNextCompany",
        "createPayloadTenant",
        "configureFleetbase",
        "createTenantDID",
        "issueTenantOperatorCredential",
        "createDefaultStore",
        "setupDefaultPaymentGateways",
        "setupGovernancePolicies",
        "notifyTenantOwner",
      ],
      compensation: "On failure: rollback created records in reverse order",
      timeout: "30 minutes",
    },

    "tenant-config-sync": {
      workflowId: "xsystem.tenant-config-sync" as const,
      triggeredBy: "tenant.updated",
      taskQueue: "cityos-workflow-queue",
      description: "Sync tenant configuration changes to all integrated systems when tenant settings are modified.",
      input: {
        tenant_id: "string",
        changes: "Record<string, any>",
        changed_fields: "string[]",
      },
      activities: [
        "updateERPNextCompany",
        "updatePayloadTenant",
        "updateFleetbaseConfig",
        "propagateToStores",
        "updateGovernancePolicies",
      ],
      timeout: "10 minutes",
    },
  },

  /**
   * =========================================================================
   * COMMERCE LIFECYCLE WORKFLOWS
   * =========================================================================
   * Specialized commerce verticals: subscriptions, bookings, auctions, restaurants.
   */
  commerceLifecycle: {

    "subscription-lifecycle": {
      workflowId: "xsystem.subscription-lifecycle" as const,
      triggeredBy: "subscription.created",
      taskQueue: "cityos-workflow-queue",
      description: "Manages the full subscription lifecycle: activation, billing cycles, renewals, dunning, pauses, cancellations.",
      input: {
        subscription_id: "string",
        customer_id: "string",
        plan_id: "string",
        billing_interval: "string",
        tenant_id: "string",
      },
      activities: [
        "activateSubscription",
        "scheduleNextBilling",
        "processRecurringPayment",
        "handlePaymentFailure",
        "sendRenewalReminder",
        "processRenewal",
        "handleCancellation",
      ],
      timeout: "indefinite (continues as new on each billing cycle)",
    },

    "service-booking-orchestrator": {
      workflowId: "xsystem.service-booking-orchestrator" as const,
      triggeredBy: "booking.created",
      taskQueue: "cityos-workflow-queue",
      description: "Orchestrates service bookings: validates availability, confirms booking, sends reminders, handles check-in, processes payment, collects review.",
      input: {
        booking_id: "string",
        service_id: "string",
        provider_id: "string",
        customer_id: "string",
        scheduled_time: "string",
        tenant_id: "string",
      },
      activities: [
        "validateAvailability",
        "confirmBooking",
        "sendConfirmationNotification",
        "scheduleReminders",
        "handleCheckIn",
        "processBookingPayment",
        "requestReview",
      ],
      timeout: "7 days",
    },

    "auction-lifecycle": {
      workflowId: "xsystem.auction-lifecycle" as const,
      triggeredBy: "auction.started",
      taskQueue: "cityos-workflow-queue",
      description: "Manages auction lifecycle: monitors bids, extends time on late bids, determines winner, processes winner payment, handles reserve not met.",
      input: {
        auction_id: "string",
        item_id: "string",
        start_time: "string",
        end_time: "string",
        reserve_price: "number | undefined",
        tenant_id: "string",
      },
      activities: [
        "activateAuction",
        "monitorBids",
        "extendOnLateBid",
        "determineWinner",
        "processWinnerPayment",
        "handleReserveNotMet",
        "notifyParticipants",
      ],
      timeout: "30 days",
    },

    "restaurant-order-orchestrator": {
      workflowId: "xsystem.restaurant-order-orchestrator" as const,
      triggeredBy: "restaurant-order.placed",
      taskQueue: "cityos-workflow-queue",
      description: "Restaurant-specific order flow: validates menu availability, notifies kitchen, tracks preparation, dispatches delivery, handles time-sensitive SLAs.",
      input: {
        order_id: "string",
        restaurant_id: "string",
        items: "Array<{ menu_item_id: string, quantity: number, customizations: string[] }>",
        delivery_type: "'delivery' | 'pickup' | 'dine_in'",
        tenant_id: "string",
      },
      activities: [
        "validateMenuAvailability",
        "notifyKitchen",
        "trackPreparation",
        "dispatchDelivery",
        "trackDelivery",
        "confirmDelivery",
        "processPayment",
      ],
      timeout: "2 hours",
    },
  },

  /**
   * =========================================================================
   * SYNC WORKFLOWS
   * =========================================================================
   * Data synchronization across systems: product catalog, CMS, stores, customers.
   */
  sync: {

    "product-catalog-sync": {
      workflowId: "commerce.product-catalog-sync" as const,
      triggeredBy: "product.created",
      taskQueue: "cityos-workflow-queue",
      description: "Sync new product to all integrated systems: ERPNext Items, Payload CMS product content, search index.",
      input: {
        product_id: "string",
        tenant_id: "string",
        variants: "Array<{ variant_id: string, sku: string, price: number }>",
      },
      activities: [
        "syncToERPNext",
        "syncToPayloadCMS",
        "updateSearchIndex",
        "notifySubscribedChannels",
      ],
      timeout: "10 minutes",
    },

    "sync-product-to-cms": {
      workflowId: "commerce.sync-product-to-cms" as const,
      triggeredBy: "product.updated",
      taskQueue: "cityos-workflow-queue",
      description: "Sync product updates to Payload CMS and ERPNext. Handles title, description, pricing, and media changes.",
      input: {
        product_id: "string",
        tenant_id: "string",
        changed_fields: "string[]",
      },
      activities: [
        "syncToPayloadCMS",
        "syncToERPNext",
        "updateSearchIndex",
        "invalidateCache",
      ],
      timeout: "5 minutes",
    },

    "store-setup": {
      workflowId: "commerce.store-setup" as const,
      triggeredBy: "store.created",
      taskQueue: "cityos-workflow-queue",
      description: "Set up a new Medusa store: configure default settings, create CMS storefront shell, set up payment gateways.",
      input: {
        store_id: "string",
        tenant_id: "string",
        store_config: "Record<string, any>",
      },
      activities: [
        "configureStoreDefaults",
        "createCMSStorefront",
        "setupPaymentGateways",
        "setupShippingOptions",
        "notifyTenantAdmin",
      ],
      timeout: "15 minutes",
    },

    "store-config-sync": {
      workflowId: "commerce.store-config-sync" as const,
      triggeredBy: "store.updated",
      taskQueue: "cityos-workflow-queue",
      description: "Propagate store configuration changes to CMS and other dependent systems.",
      input: {
        store_id: "string",
        tenant_id: "string",
        changes: "Record<string, any>",
      },
      activities: [
        "updateCMSStorefront",
        "updatePaymentConfig",
        "invalidateCache",
      ],
      timeout: "5 minutes",
    },

    "customer-onboarding": {
      workflowId: "xsystem.customer-onboarding" as const,
      triggeredBy: "customer.created",
      taskQueue: "cityos-workflow-queue",
      description: "New customer onboarding: create ERPNext Customer, send welcome email, set up loyalty program, issue membership credential if applicable.",
      input: {
        customer_id: "string",
        tenant_id: "string",
        email: "string",
        name: "string",
        is_b2b: "boolean",
      },
      activities: [
        "createERPNextCustomer",
        "sendWelcomeEmail",
        "enrollInLoyaltyProgram",
        "issueMembershipCredential",
      ],
      timeout: "10 minutes",
    },

    "customer-profile-sync": {
      workflowId: "xsystem.customer-profile-sync" as const,
      triggeredBy: "customer.updated",
      taskQueue: "cityos-workflow-queue",
      description: "Sync customer profile changes to ERPNext and other systems.",
      input: {
        customer_id: "string",
        tenant_id: "string",
        changed_fields: "string[]",
      },
      activities: [
        "syncToERPNext",
        "updateCMSProfile",
        "updateSearchIndex",
      ],
      timeout: "5 minutes",
    },

    "vendor-onboarding": {
      workflowId: "commerce.vendor-onboarding" as const,
      triggeredBy: "vendor.created",
      taskQueue: "cityos-workflow-queue",
      description: "Basic vendor record creation in commerce systems (distinct from full verification workflow).",
      input: {
        vendor_id: "string",
        tenant_id: "string",
        business_name: "string",
      },
      activities: [
        "createVendorRecord",
        "assignDefaultCommissionTier",
        "notifyPlatformAdmin",
      ],
      timeout: "5 minutes",
    },
  },

  /**
   * =========================================================================
   * FULFILLMENT WORKFLOWS
   * =========================================================================
   * Delivery dispatch, shipment tracking, and delivery confirmation.
   */
  fulfillment: {

    "fulfillment-dispatch": {
      workflowId: "xsystem.fulfillment-dispatch" as const,
      triggeredBy: "fulfillment.created",
      taskQueue: "cityos-workflow-queue",
      description: "Dispatch fulfillment to Fleetbase for delivery. Creates delivery task, assigns driver, starts tracking.",
      input: {
        fulfillment_id: "string",
        order_id: "string",
        tenant_id: "string",
        pickup_poi_id: "string",
        delivery_address: "object",
        items: "Array<{ variant_id: string, quantity: number }>",
      },
      activities: [
        "createFleetbaseDeliveryTask",
        "assignDriver",
        "notifyCustomerWithETA",
        "updateOrderFulfillmentStatus",
      ],
      timeout: "30 minutes",
    },

    "shipment-tracking-start": {
      workflowId: "xsystem.shipment-tracking-start" as const,
      triggeredBy: "fulfillment.shipped",
      taskQueue: "cityos-workflow-queue",
      description: "Start real-time shipment tracking. Monitors driver location, updates ETA, sends customer notifications at key milestones.",
      input: {
        fulfillment_id: "string",
        order_id: "string",
        driver_id: "string",
        tracking_id: "string",
      },
      activities: [
        "activateRealTimeTracking",
        "monitorDriverLocation",
        "updateCustomerETA",
        "sendMilestoneNotifications",
      ],
      timeout: "24 hours",
    },

    "delivery-confirmation": {
      workflowId: "xsystem.delivery-confirmation" as const,
      triggeredBy: "fulfillment.delivered",
      taskQueue: "cityos-workflow-queue",
      description: "Confirm delivery completion. Updates order status, triggers vendor payout calculation, sends review request.",
      input: {
        fulfillment_id: "string",
        order_id: "string",
        delivered_at: "string",
        proof_of_delivery: "string | undefined",
      },
      activities: [
        "confirmOrderDelivery",
        "calculateVendorPayout",
        "updateERPNextInvoice",
        "sendReviewRequest",
        "updateAnalytics",
      ],
      timeout: "10 minutes",
    },
  },

  /**
   * =========================================================================
   * FINANCE WORKFLOWS
   * =========================================================================
   * Invoice processing, payment reconciliation, inventory reconciliation.
   */
  finance: {

    "invoice-processing": {
      workflowId: "xsystem.invoice-processing" as const,
      triggeredBy: "invoice.created",
      taskQueue: "cityos-workflow-queue",
      description: "Process a new invoice: create in ERPNext, apply payment terms, schedule reminders, handle auto-pay for subscriptions.",
      input: {
        invoice_id: "string",
        order_id: "string",
        tenant_id: "string",
        amount: "number",
        due_date: "string",
      },
      activities: [
        "createERPNextInvoice",
        "applyPaymentTerms",
        "schedulePaymentReminders",
        "processAutoPayIfApplicable",
      ],
      timeout: "10 minutes",
    },

    "payment-reconciliation": {
      workflowId: "xsystem.payment-reconciliation" as const,
      triggeredBy: "payment.completed",
      taskQueue: "cityos-workflow-queue",
      description: "Reconcile a completed payment against ERPNext invoices. Creates Payment Entry, updates invoice status, triggers payout calculations.",
      input: {
        payment_id: "string",
        order_id: "string",
        tenant_id: "string",
        amount: "number",
        provider_id: "string",
        reference_id: "string | undefined",
      },
      activities: [
        "createERPNextPaymentEntry",
        "reconcileWithInvoice",
        "updateOrderPaymentStatus",
        "triggerPayoutCalculation",
        "updateFinancialReports",
      ],
      timeout: "10 minutes",
    },

    "inventory-reconciliation": {
      workflowId: "xsystem.inventory-reconciliation" as const,
      triggeredBy: "inventory.updated",
      taskQueue: "cityos-workflow-queue",
      description: "Reconcile inventory changes between Medusa and ERPNext. Creates Stock Entries or Stock Reconciliation as needed.",
      input: {
        tenant_id: "string",
        items: "Array<{ variant_id: string, sku: string, stock_location_id: string, quantity: number }>",
        source: "'medusa' | 'erpnext' — Which system originated the change",
      },
      activities: [
        "compareInventoryLevels",
        "createERPNextStockReconciliation",
        "updateMedusaInventory",
        "logReconciliationResult",
      ],
      timeout: "15 minutes",
    },
  },

  /**
   * =========================================================================
   * IDENTITY WORKFLOWS
   * =========================================================================
   * KYC verification and credential issuance via Walt.id.
   */
  identity: {

    "kyc-verification": {
      workflowId: "xsystem.kyc-verification" as const,
      triggeredBy: "kyc.requested",
      taskQueue: "cityos-workflow-queue",
      description: "Run KYC verification for a customer or vendor. Validates identity documents, runs checks, issues KYC credential on success.",
      input: {
        subject_id: "string — Customer or vendor ID",
        subject_type: "'customer' | 'vendor'",
        tenant_id: "string",
        documents: "Array<{ type: string, url: string }>",
        verification_level: "'basic' | 'enhanced' | 'full'",
      },
      activities: [
        "validateDocuments",
        "runIdentityChecks",
        "createDID",
        "issueKYCCredential",
        "updateSubjectVerificationStatus",
        "notifySubject",
      ],
      timeout: "72 hours",
    },

    "kyc-credential-issuance": {
      workflowId: "xsystem.kyc-credential-issuance" as const,
      triggeredBy: "kyc.completed",
      taskQueue: "cityos-workflow-queue",
      description: "Issue a KYCVerificationCredential via Walt.id after successful KYC verification.",
      input: {
        subject_did: "string — Subject's DID",
        customer_name: "string",
        customer_email: "string",
        verification_level: "string",
        tenant_id: "string",
        node_id: "string",
      },
      activities: [
        "issueKYCCredential",
        "storeCredentialReference",
        "notifySubject",
      ],
      timeout: "5 minutes",
    },

    "membership-credential-issuance": {
      workflowId: "xsystem.membership-credential-issuance" as const,
      triggeredBy: "membership.created",
      taskQueue: "cityos-workflow-queue",
      description: "Issue a CityOSMembershipCredential via Walt.id when a customer enrolls in a membership program.",
      input: {
        subject_did: "string — Member's DID",
        member_name: "string",
        membership_type: "string",
        tenant_id: "string",
        node_id: "string",
        valid_until: "string — ISO 8601 expiration date",
      },
      activities: [
        "issueMembershipCredential",
        "storeCredentialReference",
        "notifyMember",
      ],
      timeout: "5 minutes",
    },
  },

  /**
   * =========================================================================
   * GOVERNANCE WORKFLOWS
   * =========================================================================
   * Policy propagation across the node hierarchy.
   */
  governance: {

    "governance-policy-propagation": {
      workflowId: "xsystem.governance-policy-propagation" as const,
      triggeredBy: "governance.policy.changed",
      taskQueue: "cityos-workflow-queue",
      description: "Propagate governance policy changes across all affected nodes, tenants, and integrated systems. Ensures compliance cascade.",
      input: {
        policy_id: "string",
        policy_type: "string",
        changes: "Record<string, any>",
        affected_node_ids: "string[]",
        affected_tenant_ids: "string[]",
      },
      activities: [
        "validatePolicyChange",
        "propagateToNodes",
        "propagateToTenants",
        "updateIntegratedSystems",
        "auditPolicyChange",
        "notifyAffectedAdmins",
      ],
      timeout: "30 minutes",
    },
  },
} as const

// ---------------------------------------------------------------------------
// 4. DYNAMIC_AGENT_WORKFLOWS
// ---------------------------------------------------------------------------

/**
 * Dynamic agent workflows use LLM-driven reasoning to accomplish goals.
 * They run on a separate task queue (`cityos-dynamic-queue`) and support
 * interactive signals and queries for human-in-the-loop scenarios.
 */
export const DYNAMIC_AGENT_WORKFLOWS = {

  description: "Goal-based AI orchestration using LLM reasoning with tool execution",

  workflow_type: "cityOSDynamicAgentWorkflow" as const,
  task_queue: "cityos-dynamic-queue" as const,

  workflow_id_format: "dynamic-{timestamp}-{uuid_prefix_8}",

  input_schema: {
    goal: "string — Natural language description of what the workflow should accomplish",
    context: "Record<string, any> — Contextual data available to the agent (current state, user info, etc.)",
    availableTools: "string[] — List of tool names the agent can use (e.g., 'queryProducts', 'updateOrder', 'sendNotification')",
    maxIterations: "number — Maximum reasoning/action iterations before workflow completes (default: 10)",
    nodeContext: "NodeContext — Multi-tenant context (tenantId, nodeId, channel, locale)",
    metadata: "Record<string, any> — Additional metadata (user_id, request_id, etc.)",
  },

  signals: {
    description: "Signals allow external input to be sent to a running dynamic workflow",
    supported_signals: {
      "humanInput": {
        description: "Provide human input/approval to the agent when it requests it",
        data: "{ input: string, approved?: boolean, metadata?: Record<string, any> }",
      },
      "cancel": {
        description: "Request graceful cancellation of the workflow",
        data: "{ reason: string }",
      },
      "updateContext": {
        description: "Inject additional context into the running workflow",
        data: "Record<string, any>",
      },
    },
  },

  queries: {
    description: "Queries allow reading the current state of a running dynamic workflow without modifying it",
    supported_queries: {
      "status": {
        description: "Get the current status, iteration count, and last action taken",
        returns: "{ currentIteration: number, maxIterations: number, lastAction: string, status: string, pendingInput?: boolean }",
      },
      "history": {
        description: "Get the full history of reasoning steps and actions taken",
        returns: "Array<{ iteration: number, reasoning: string, action: string, result: any, timestamp: string }>",
      },
    },
  },

  api_operations: {
    start: {
      description: "Start a new dynamic agent workflow",
      method: "startDynamicWorkflow(input: DynamicWorkflowInput)",
      returns: "DynamicWorkflowResult — { workflowRunId, workflowId, taskQueue }",
      endpoint: "POST /admin/temporal/dynamic",
    },
    query: {
      description: "Query the status of a running dynamic workflow",
      method: "queryDynamicWorkflowStatus(workflowId: string)",
      returns: "WorkflowDescription with queryResult",
      endpoint: "GET /admin/temporal/dynamic/{workflowId}",
    },
    signal: {
      description: "Send a signal to a running dynamic workflow",
      method: "signalDynamicWorkflow(workflowId: string, signalName: string, data: any)",
      returns: "void",
      endpoint: "POST /admin/temporal/dynamic/{workflowId} with { action: 'signal', signal_name, data }",
    },
    cancel: {
      description: "Cancel a running dynamic workflow",
      method: "cancelDynamicWorkflow(workflowId: string)",
      returns: "void",
      endpoint: "POST /admin/temporal/dynamic/{workflowId} with { action: 'cancel' }",
    },
    list: {
      description: "List dynamic workflows with optional status filter",
      method: "listDynamicWorkflows(filters?: { status?: string, limit?: number })",
      returns: "WorkflowDescription[]",
      endpoint: "GET /admin/temporal/dynamic with query params",
    },
  },
} as const

// ---------------------------------------------------------------------------
// 5. EVENT_OUTBOX_INTEGRATION
// ---------------------------------------------------------------------------

/**
 * The Event Outbox pattern ensures reliable event delivery from Medusa to
 * Temporal. Events are first persisted to the Medusa database outbox table,
 * then processed by a background job that dispatches them to Temporal.
 *
 * This prevents event loss due to Temporal unavailability and provides
 * exactly-once processing semantics.
 */
export const EVENT_OUTBOX_INTEGRATION = {

  description: "Outbox pattern for reliable event delivery from Medusa to Temporal workflows",

  outbox_table: {
    description: "Events are persisted to an outbox table in Medusa's database before dispatch",
    columns: {
      id: "string — Unique event ID (UUID)",
      event_type: "string — Event type (e.g., 'order.placed')",
      payload: "jsonb — Event payload",
      tenant_id: "string | null — Medusa tenant ID",
      node_id: "string | null — Node ID for scoping",
      channel: "string | null — Service channel",
      correlation_id: "string — Correlation ID for tracing event chains",
      causation_id: "string | null — ID of the event that caused this event",
      status: "'pending' | 'published' | 'failed'",
      retry_count: "number — Number of dispatch attempts",
      max_retries: "number — Maximum retry attempts (default: 5)",
      created_at: "timestamp — When the event was created",
      published_at: "timestamp | null — When successfully dispatched",
      failed_at: "timestamp | null — When last failure occurred",
      error_message: "string | null — Last error message",
    },
  },

  envelope_format: {
    description: "Events are wrapped in an envelope before dispatch to Temporal",
    format: {
      eventId: "string — From outbox event ID",
      eventType: "string — Event type",
      payload: "Record<string, any> — Event payload",
      nodeContext: "NodeContext — { tenantId, nodeId, channel, locale }",
      correlation: "EventCorrelation — { correlationId, causationId, traceId }",
      timestamp: "string — ISO 8601 timestamp",
      source: "'medusa'",
    },
  },

  processing: {
    description: "Background job processes pending outbox events",
    method: "processOutboxEvents(container: MedusaContainer)",
    batch_size: 50,
    polling_interval_ms: 5000,
    steps: {
      step_1: "Query pending events from outbox table (limit: batch_size)",
      step_2: "For each event, look up workflow ID from EVENT_WORKFLOW_MAP",
      step_3: "Build envelope with correlation/causation IDs and NodeContext",
      step_4: "Start Temporal workflow with envelope as input",
      step_5: "On success: mark event as 'published' with published_at timestamp",
      step_6: "On failure: increment retry_count, mark as 'failed' if max_retries exceeded",
    },
    returns: "{ processed: number, failed: number, errors: string[] }",
  },

  cross_system_dispatch: {
    description: "A single Medusa event can trigger both a Temporal workflow AND direct integration calls. The event dispatcher handles fan-out.",
    dispatch_targets: {
      temporal: "Primary target — workflow orchestration via EVENT_WORKFLOW_MAP",
      erpnext: "Direct API call for immediate sync (e.g., customer.created → ERPNext Customer)",
      payload_cms: "Webhook for content sync (e.g., product.updated → CMS content update)",
      fleetbase: "API call for geo operations (e.g., poi.created → Fleetbase Place)",
      waltid: "API call for identity operations (e.g., kyc.completed → credential issuance)",
    },
    fan_out_strategy: "Temporal workflow is the primary orchestrator. Direct calls are used for low-latency sync that doesn't need saga compensation. Both can be triggered from the same event.",
  },
} as const

// ---------------------------------------------------------------------------
// 6. WORKER_REQUIREMENTS
// ---------------------------------------------------------------------------

/**
 * Requirements for Temporal workers that execute workflows and activities.
 * Workers must be deployed as separate processes (not inside Medusa).
 */
export const WORKER_REQUIREMENTS = {

  "cityos-workflow-queue": {
    description: "Worker requirements for the primary system workflow queue",
    workflow_bundle: {
      description: "Workers must register the 'cityOSWorkflow' workflow type",
      workflow_type: "cityOSWorkflow",
      implementation: "A generic dispatcher workflow that receives { workflowId, input, nodeContext, correlationId } and routes to the appropriate activity chain based on workflowId",
    },
    required_activities: {
      medusa_api: "Activities that call Medusa Admin API: createOrder, updateOrder, getProduct, updateInventory, etc.",
      erpnext_api: "Activities that call ERPNext API: createInvoice, createPaymentEntry, syncCustomer, syncItem, etc.",
      payload_cms: "Activities that call Payload CMS: createDocument, updateDocument, syncContent, etc.",
      fleetbase_api: "Activities that call Fleetbase API: createPlace, createDeliveryTask, assignDriver, etc.",
      waltid_api: "Activities that call Walt.id API: createDID, issueCredential, verifyCredential, etc.",
      stripe_api: "Activities that call Stripe API: createPaymentIntent, capturePayment, processRefund, createConnectAccount, etc.",
      notifications: "Activities for sending notifications: email, SMS, push, in-app, etc.",
      analytics: "Activities for updating analytics and metrics",
    },
    activity_retry_defaults: {
      initialInterval: "1s",
      backoffCoefficient: 2,
      maximumInterval: "60s",
      maximumAttempts: 3,
      nonRetryableErrorTypes: ["VALIDATION_ERROR", "NOT_FOUND", "UNAUTHORIZED"],
    },
    activity_timeout_defaults: {
      startToCloseTimeout: "30s",
      scheduleToCloseTimeout: "5m",
      heartbeatTimeout: "10s",
    },
  },

  "cityos-dynamic-queue": {
    description: "Worker requirements for the dynamic AI agent workflow queue",
    workflow_bundle: {
      description: "Workers must register the 'cityOSDynamicAgentWorkflow' workflow type",
      workflow_type: "cityOSDynamicAgentWorkflow",
      implementation: "An iterative workflow that: (1) calls LLM with goal + context + history, (2) executes the chosen tool/activity, (3) adds result to history, (4) repeats until goal is achieved or maxIterations reached",
    },
    required_activities: {
      llm_inference: "Activity that calls LLM API (OpenAI/Anthropic) with system prompt, context, and available tools",
      tool_execution: "Generic activity that executes a named tool with parameters and returns results",
      result_aggregation: "Activity that synthesizes results from multiple tool executions into a final answer",
    },
    activity_timeout_defaults: {
      startToCloseTimeout: "120s",
      scheduleToCloseTimeout: "10m",
      heartbeatTimeout: "30s",
    },
  },
} as const

// ---------------------------------------------------------------------------
// 7. TEMPORAL_CONFIG
// ---------------------------------------------------------------------------

/**
 * Configuration requirements for the Temporal Cloud integration.
 * These values must be set as environment variables or secrets.
 */
export const TEMPORAL_CONFIG = {

  required_env_vars: {
    TEMPORAL_ENDPOINT: "string — Temporal Cloud gRPC endpoint (e.g., 'ap-northeast-1.aws.api.temporal.io:7233'). Store as config.",
    TEMPORAL_API_KEY: "string — Temporal Cloud API key for authentication. Store as secret.",
    TEMPORAL_NAMESPACE: "string — Temporal Cloud namespace (e.g., 'quickstart-dakkah-cityos.djvai'). Store as config.",
  },

  optional_env_vars: {
    TEMPORAL_TLS_CERT_PATH: "string — Path to mTLS client certificate (.pem). Alternative to API key auth.",
    TEMPORAL_TLS_KEY_PATH: "string — Path to mTLS client private key (.pem). Required if cert_path is set.",
    TEMPORAL_TLS_CA_PATH: "string — Path to CA certificate (.pem). Optional for custom CAs.",
    TEMPORAL_OUTBOX_BATCH_SIZE: "number — Number of outbox events to process per batch. Default: 50",
    TEMPORAL_OUTBOX_POLL_INTERVAL_MS: "number — Outbox polling interval in milliseconds. Default: 5000",
    TEMPORAL_WORKFLOW_EXECUTION_TIMEOUT: "string — Default workflow execution timeout. Default: '24h'",
    TEMPORAL_DEFAULT_RETRY_MAX_ATTEMPTS: "number — Default maximum retry attempts for activities. Default: 3",
  },

  event_workflow_map: {
    description: "Complete mapping of Medusa events to Temporal workflow IDs. Defined in EVENT_WORKFLOW_MAP constant in event-dispatcher.ts.",
    total_mapped_events: 35,
    categories: {
      commerce: 5,
      vendor: 5,
      platform: 5,
      commerce_lifecycle: 4,
      sync: 7,
      fulfillment: 3,
      finance: 3,
      identity: 3,
      governance: 1,
    },
    unmapped_events: "Events without a workflow mapping are silently skipped by the dispatcher. They may still trigger direct integration calls.",
  },

  workflow_id_conventions: {
    system_workflows: "{workflowId}-{timestamp} — e.g., 'xsystem.unified-order-orchestrator-1707500000000'",
    dynamic_workflows: "dynamic-{timestamp}-{uuid_8} — e.g., 'dynamic-1707500000000-a1b2c3d4'",
    tenant_isolation: "Workflow IDs do not embed tenant info directly. Tenant isolation is enforced via NodeContext passed as workflow input. Search attributes can be used for tenant-scoped workflow queries.",
  },

  monitoring: {
    description: "Temporal Cloud provides built-in monitoring via Temporal Web UI and metrics export",
    health_endpoint: "/admin/integrations/health — includes Temporal connection status",
    workflow_listing: "/admin/temporal/workflows — list and filter active/completed workflows",
    metrics: "Temporal Cloud exports Prometheus-compatible metrics for workflow execution latency, failure rates, queue depth",
  },
} as const
