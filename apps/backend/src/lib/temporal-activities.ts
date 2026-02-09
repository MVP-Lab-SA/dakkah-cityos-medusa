/**
 * =============================================================================
 * TEMPORAL ACTIVITY DEFINITIONS
 * =============================================================================
 * 
 * Activity contracts for Temporal workers in the CityOS Commerce platform.
 * 
 * These activities wrap existing integration services (ERPNext, Payload CMS,
 * Fleetbase, Walt.id) and are executed within Temporal workflows instead of
 * being called directly from Medusa subscribers/dispatchers.
 * 
 * Workers implementing these activities should import the corresponding
 * integration services and execute them with proper error handling.
 * 
 * All activities receive a context object with tenantId, nodeId, and
 * correlationId for multi-tenant isolation and audit trailing.
 * 
 * @module TemporalActivities
 * @version 1.0.0
 * @lastUpdated 2026-02-09
 */

export interface ActivityContext {
  tenantId?: string
  nodeId?: string
  correlationId: string
  channel?: string
  locale?: string
}

// ---------------------------------------------------------------------------
// Payload CMS Activities
// ---------------------------------------------------------------------------

export interface SyncProductToPayloadInput {
  productId: string
  productData: Record<string, any>
  context: ActivityContext
}

export interface SyncProductToPayloadOutput {
  success: boolean
  payloadDocId?: string
  error?: string
}

export interface SyncGovernanceToPayloadInput {
  tenantId: string
  policies: Record<string, any>
  context: ActivityContext
}

export interface SyncGovernanceToPayloadOutput {
  success: boolean
  error?: string
}

export interface DeleteProductFromPayloadInput {
  productId: string
  context: ActivityContext
}

export interface DeleteProductFromPayloadOutput {
  success: boolean
  error?: string
}

// ---------------------------------------------------------------------------
// ERPNext Activities
// ---------------------------------------------------------------------------

export interface CreateERPNextInvoiceInput {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    item_code: string
    item_name: string
    quantity: number
    rate: number
    amount: number
  }>
  total: number
  grandTotal: number
  currency: string
  context: ActivityContext
}

export interface CreateERPNextInvoiceOutput {
  success: boolean
  invoiceName?: string
  error?: string
}

export interface SyncCustomerToERPNextInput {
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerType: "Individual" | "Company"
  context: ActivityContext
}

export interface SyncCustomerToERPNextOutput {
  success: boolean
  erpCustomerName?: string
  error?: string
}

export interface SyncProductToERPNextInput {
  productId: string
  itemCode: string
  itemName: string
  itemGroup: string
  stockUom: string
  standardRate: number
  description?: string
  context: ActivityContext
}

export interface SyncProductToERPNextOutput {
  success: boolean
  erpItemName?: string
  error?: string
}

export interface SyncVendorAsSupplierInput {
  vendorId: string
  vendorName: string
  vendorEmail: string
  vendorPhone?: string
  companyName?: string
  context: ActivityContext
}

export interface SyncVendorAsSupplierOutput {
  success: boolean
  supplierName?: string
  error?: string
}

export interface RecordPaymentInERPNextInput {
  orderId: string
  customerName: string
  amount: number
  currency: string
  paymentMethod?: string
  referenceNo?: string
  context: ActivityContext
}

export interface RecordPaymentInERPNextOutput {
  success: boolean
  paymentEntryName?: string
  error?: string
}

// ---------------------------------------------------------------------------
// Fleetbase Activities
// ---------------------------------------------------------------------------

export interface CreateFleetbaseShipmentInput {
  orderId: string
  pickup: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  dropoff: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
    phone?: string
  }
  items: Array<{
    name: string
    quantity: number
  }>
  context: ActivityContext
}

export interface CreateFleetbaseShipmentOutput {
  success: boolean
  trackingNumber?: string
  shipmentId?: string
  error?: string
}

export interface SyncPOIToFleetbaseInput {
  poiId: string
  poiData: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
    latitude?: number
    longitude?: number
  }
  context: ActivityContext
}

export interface SyncPOIToFleetbaseOutput {
  success: boolean
  fleetbasePlaceId?: string
  error?: string
}

// ---------------------------------------------------------------------------
// Walt.id Activities
// ---------------------------------------------------------------------------

export interface CreateDIDInput {
  method: string
  context: ActivityContext
}

export interface CreateDIDOutput {
  success: boolean
  did?: string
  error?: string
}

export interface IssueVendorCredentialInput {
  subjectDid: string
  vendorName: string
  businessLicense: string
  tenantId: string
  context: ActivityContext
}

export interface IssueVendorCredentialOutput {
  success: boolean
  credentialId?: string
  error?: string
}

export interface IssueKYCCredentialInput {
  subjectDid: string
  customerName: string
  customerEmail: string
  verificationLevel: string
  tenantId: string
  nodeId: string
  context: ActivityContext
}

export interface IssueKYCCredentialOutput {
  success: boolean
  credentialId?: string
  error?: string
}

export interface IssueMembershipCredentialInput {
  subjectDid: string
  memberName: string
  membershipType: string
  tenantId: string
  nodeId: string
  validUntil: string
  context: ActivityContext
}

export interface IssueMembershipCredentialOutput {
  success: boolean
  credentialId?: string
  error?: string
}

// ---------------------------------------------------------------------------
// Node Hierarchy Sync Activities
// ---------------------------------------------------------------------------

export interface SyncNodeToAllSystemsInput {
  nodeId: string
  tenantId: string
  context: ActivityContext
}

export interface SyncNodeToAllSystemsOutput {
  success: boolean
  syncedSystems: string[]
  errors: string[]
}

export interface DeleteNodeFromAllSystemsInput {
  nodeId: string
  tenantId: string
  context: ActivityContext
}

export interface DeleteNodeFromAllSystemsOutput {
  success: boolean
  deletedFrom: string[]
  errors: string[]
}

// ---------------------------------------------------------------------------
// Scheduled Sync Activities
// ---------------------------------------------------------------------------

export interface ScheduledProductSyncInput {
  timestamp: string
  context: ActivityContext
}

export interface ScheduledProductSyncOutput {
  success: boolean
  synced: number
  failed: number
  errors: string[]
}

export interface RetryFailedSyncsInput {
  timestamp: string
  context: ActivityContext
}

export interface RetryFailedSyncsOutput {
  success: boolean
  retried: number
  succeeded: number
  failed: number
  errors: string[]
}

export interface HierarchyReconciliationInput {
  tenantId?: string
  timestamp: string
  context: ActivityContext
}

export interface HierarchyReconciliationOutput {
  success: boolean
  tenantsProcessed: number
  nodesReconciled: number
  errors: string[]
}

// ---------------------------------------------------------------------------
// Activity Registry
// ---------------------------------------------------------------------------

export const ACTIVITY_DEFINITIONS = {
  "payload.syncProduct": { queue: "cityos-workflow-queue", timeout: "30s", retries: 3 },
  "payload.deleteProduct": { queue: "cityos-workflow-queue", timeout: "15s", retries: 3 },
  "payload.syncGovernance": { queue: "cityos-workflow-queue", timeout: "30s", retries: 3 },

  "erpnext.createInvoice": { queue: "cityos-workflow-queue", timeout: "30s", retries: 3 },
  "erpnext.syncCustomer": { queue: "cityos-workflow-queue", timeout: "20s", retries: 3 },
  "erpnext.syncProduct": { queue: "cityos-workflow-queue", timeout: "20s", retries: 3 },
  "erpnext.syncVendorAsSupplier": { queue: "cityos-workflow-queue", timeout: "20s", retries: 3 },
  "erpnext.recordPayment": { queue: "cityos-workflow-queue", timeout: "20s", retries: 3 },

  "fleetbase.createShipment": { queue: "cityos-workflow-queue", timeout: "30s", retries: 3 },
  "fleetbase.syncPOI": { queue: "cityos-workflow-queue", timeout: "20s", retries: 3 },

  "waltid.createDID": { queue: "cityos-workflow-queue", timeout: "15s", retries: 3 },
  "waltid.issueVendorCredential": { queue: "cityos-workflow-queue", timeout: "20s", retries: 3 },
  "waltid.issueKYCCredential": { queue: "cityos-workflow-queue", timeout: "20s", retries: 3 },
  "waltid.issueMembershipCredential": { queue: "cityos-workflow-queue", timeout: "20s", retries: 3 },

  "hierarchy.syncNode": { queue: "cityos-workflow-queue", timeout: "60s", retries: 2 },
  "hierarchy.deleteNode": { queue: "cityos-workflow-queue", timeout: "30s", retries: 2 },

  "scheduled.syncProducts": { queue: "cityos-workflow-queue", timeout: "300s", retries: 1 },
  "scheduled.retryFailed": { queue: "cityos-workflow-queue", timeout: "300s", retries: 1 },
  "scheduled.reconcileHierarchy": { queue: "cityos-workflow-queue", timeout: "600s", retries: 1 },
} as const
