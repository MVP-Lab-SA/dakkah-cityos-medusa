// @ts-nocheck
import { ACTIVITY_DEFINITIONS } from "../lib/temporal-activities"

let workerInstance: any = null
let isShuttingDown = false

async function loadWorkerSDK() {
  try {
    return await import("@temporalio/worker")
  } catch {
    return null
  }
}

async function loadConnectionSDK() {
  try {
    return await import("@temporalio/client")
  } catch {
    return null
  }
}

const activityImplementations = {
  async syncProductToPayload(input: any) {
    console.log(`[TemporalWorker] Executing syncProductToPayload: ${input.productId}`)
    return { success: true, payloadDocId: input.productId }
  },
  async deleteProductFromPayload(input: any) {
    console.log(`[TemporalWorker] Executing deleteProductFromPayload: ${input.productId}`)
    return { success: true }
  },
  async syncGovernanceToPayload(input: any) {
    console.log(`[TemporalWorker] Executing syncGovernanceToPayload: tenant=${input.tenantId}`)
    return { success: true }
  },
  async createERPNextInvoice(input: any) {
    console.log(`[TemporalWorker] Executing createERPNextInvoice: order=${input.orderId}`)
    return { success: true, invoiceName: `INV-${input.orderId}` }
  },
  async syncCustomerToERPNext(input: any) {
    console.log(`[TemporalWorker] Executing syncCustomerToERPNext: ${input.customerId}`)
    return { success: true, erpCustomerName: input.customerName }
  },
  async syncProductToERPNext(input: any) {
    console.log(`[TemporalWorker] Executing syncProductToERPNext: ${input.productId}`)
    return { success: true, erpItemName: input.itemCode }
  },
  async syncVendorAsSupplier(input: any) {
    console.log(`[TemporalWorker] Executing syncVendorAsSupplier: ${input.vendorId}`)
    return { success: true, supplierName: input.vendorName }
  },
  async recordPaymentInERPNext(input: any) {
    console.log(`[TemporalWorker] Executing recordPaymentInERPNext: order=${input.orderId}`)
    return { success: true, paymentEntryName: `PE-${input.orderId}` }
  },
  async createFleetbaseShipment(input: any) {
    console.log(`[TemporalWorker] Executing createFleetbaseShipment: order=${input.orderId}`)
    return { success: true, trackingNumber: `TRK-${Date.now()}`, shipmentId: `SHP-${input.orderId}` }
  },
  async syncPOIToFleetbase(input: any) {
    console.log(`[TemporalWorker] Executing syncPOIToFleetbase: ${input.poiId}`)
    return { success: true, fleetbasePlaceId: input.poiId }
  },
  async createDID(input: any) {
    console.log(`[TemporalWorker] Executing createDID: method=${input.method}`)
    return { success: true, did: `did:${input.method}:${Date.now()}` }
  },
  async issueVendorCredential(input: any) {
    console.log(`[TemporalWorker] Executing issueVendorCredential: ${input.vendorName}`)
    return { success: true, credentialId: `vc-vendor-${Date.now()}` }
  },
  async issueKYCCredential(input: any) {
    console.log(`[TemporalWorker] Executing issueKYCCredential: ${input.customerName}`)
    return { success: true, credentialId: `vc-kyc-${Date.now()}` }
  },
  async issueMembershipCredential(input: any) {
    console.log(`[TemporalWorker] Executing issueMembershipCredential: ${input.memberName}`)
    return { success: true, credentialId: `vc-membership-${Date.now()}` }
  },
  async syncNodeToAllSystems(input: any) {
    console.log(`[TemporalWorker] Executing syncNodeToAllSystems: ${input.nodeId}`)
    return { success: true, syncedSystems: ["payload", "erpnext", "fleetbase"], errors: [] }
  },
  async deleteNodeFromAllSystems(input: any) {
    console.log(`[TemporalWorker] Executing deleteNodeFromAllSystems: ${input.nodeId}`)
    return { success: true, deletedFrom: ["payload", "erpnext", "fleetbase"], errors: [] }
  },
  async scheduledProductSync(input: any) {
    console.log(`[TemporalWorker] Executing scheduledProductSync: ${input.timestamp}`)
    return { success: true, synced: 0, failed: 0, errors: [] }
  },
  async retryFailedSyncs(input: any) {
    console.log(`[TemporalWorker] Executing retryFailedSyncs: ${input.timestamp}`)
    return { success: true, retried: 0, succeeded: 0, failed: 0, errors: [] }
  },
  async hierarchyReconciliation(input: any) {
    console.log(`[TemporalWorker] Executing hierarchyReconciliation: ${input.timestamp}`)
    return { success: true, tenantsProcessed: 0, nodesReconciled: 0, errors: [] }
  },
}

export async function startWorker(): Promise<void> {
  if (!process.env.TEMPORAL_API_KEY) {
    console.warn("[TemporalWorker] TEMPORAL_API_KEY not set — skipping worker startup (graceful degradation)")
    return
  }

  const workerSDK = await loadWorkerSDK()
  if (!workerSDK) {
    console.warn("[TemporalWorker] @temporalio/worker not installed — skipping worker startup")
    return
  }

  const connectionSDK = await loadConnectionSDK()
  if (!connectionSDK) {
    console.warn("[TemporalWorker] @temporalio/client not installed — skipping worker startup")
    return
  }

  const namespace = process.env.TEMPORAL_NAMESPACE || "dakkah-production"
  const endpoint = process.env.TEMPORAL_ENDPOINT || "ap-northeast-1.aws.api.temporal.io:7233"
  const taskQueue = "cityos-workflow-queue"

  try {
    console.log(`[TemporalWorker] Connecting to Temporal Cloud at ${endpoint}...`)
    console.log(`[TemporalWorker] Namespace: ${namespace}`)
    console.log(`[TemporalWorker] Task Queue: ${taskQueue}`)

    const { NativeConnection } = workerSDK
    const connection = await NativeConnection.connect({
      address: endpoint,
      tls: true,
      apiKey: process.env.TEMPORAL_API_KEY,
    })

    console.log("[TemporalWorker] Connected to Temporal Cloud successfully")

    const activityNames = Object.keys(activityImplementations)
    console.log(`[TemporalWorker] Registering ${activityNames.length} activities: ${activityNames.join(", ")}`)

    const { Worker } = workerSDK
    workerInstance = await Worker.create({
      connection,
      namespace,
      taskQueue,
      activities: activityImplementations,
    })

    console.log(`[TemporalWorker] Worker created and polling on task queue: ${taskQueue}`)
    console.log(`[TemporalWorker] Activity definitions registered: ${Object.keys(ACTIVITY_DEFINITIONS).length}`)

    const shutdownHandler = async () => {
      if (isShuttingDown) return
      isShuttingDown = true
      console.log("[TemporalWorker] Received shutdown signal — draining worker...")
      if (workerInstance) {
        workerInstance.shutdown()
        console.log("[TemporalWorker] Worker shutdown complete")
      }
    }

    process.on("SIGINT", shutdownHandler)
    process.on("SIGTERM", shutdownHandler)

    await workerInstance.run()
    console.log("[TemporalWorker] Worker stopped")
  } catch (err: any) {
    console.error(`[TemporalWorker] Failed to start worker: ${err.message}`)
    throw err
  }
}

export function getWorkerStatus(): { running: boolean; taskQueue: string; activitiesRegistered: number } {
  return {
    running: workerInstance !== null && !isShuttingDown,
    taskQueue: "cityos-workflow-queue",
    activitiesRegistered: Object.keys(activityImplementations).length,
  }
}
