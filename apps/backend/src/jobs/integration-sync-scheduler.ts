import { MedusaContainer } from "@medusajs/framework/types"
import cron from "node-cron"
import { MedusaToPayloadSync } from "../integrations/payload-sync"
import { PayloadToMedusaSync } from "../integrations/payload-sync"
import { NodeHierarchySyncService } from "../integrations/node-hierarchy-sync"
import { createIntegrationOrchestrator } from "../integrations/orchestrator"

export class IntegrationSyncScheduler {
  private container: MedusaContainer
  private tasks: ReturnType<typeof cron.schedule>[] = []

  constructor(container: MedusaContainer) {
    this.container = container
  }

  start() {
    console.log("[SyncScheduler] Starting integration sync scheduler")

    const productSyncTask = cron.schedule("0 * * * *", async () => {
      const payloadUrl = process.env.PAYLOAD_API_URL
      const payloadKey = process.env.PAYLOAD_API_KEY
      if (!payloadUrl || !payloadKey) {
        console.log("[SyncScheduler] Payload CMS not configured, skipping product sync")
        return
      }
      try {
        console.log("[SyncScheduler] Syncing products to Payload CMS")
        const sync = new MedusaToPayloadSync(this.container, {
          payloadUrl,
          payloadApiKey: payloadKey,
        })
        const result = await sync.syncAllProducts()
        console.log(`[SyncScheduler] Product sync complete: ${result.success} success, ${result.failed} failed`)
      } catch (error: any) {
        console.log(`[SyncScheduler] Product sync to Payload failed: ${error.message}`)
      }
    })
    this.tasks.push(productSyncTask)

    const contentSyncTask = cron.schedule("0 * * * *", async () => {
      const payloadUrl = process.env.PAYLOAD_API_URL
      const payloadKey = process.env.PAYLOAD_API_KEY
      if (!payloadUrl || !payloadKey) {
        console.log("[SyncScheduler] Payload CMS not configured, skipping content sync")
        return
      }
      try {
        console.log("[SyncScheduler] Processing pending Payload content updates")
        const reverseSync = new PayloadToMedusaSync(this.container, {
          payloadUrl,
          payloadApiKey: payloadKey,
        })
        const result = await reverseSync.syncPendingProductContent()
        console.log(`[SyncScheduler] Pending content sync complete: ${result.success} success, ${result.failed} failed`)
      } catch (error: any) {
        console.log(`[SyncScheduler] Pending content sync failed: ${error.message}`)
      }
    })
    this.tasks.push(contentSyncTask)

    const retryTask = cron.schedule("*/30 * * * *", async () => {
      try {
        console.log("[SyncScheduler] Retrying failed syncs")
        const orchestrator = createIntegrationOrchestrator(this.container)
        const result = await orchestrator.retryFailedSyncs()
        console.log(`[SyncScheduler] Retry complete: ${result.succeeded} succeeded, ${result.failed} failed out of ${result.retried} retried`)
      } catch (error: any) {
        console.log(`[SyncScheduler] Failed sync retry error: ${error.message}`)
      }
    })
    this.tasks.push(retryTask)

    const hierarchyTask = cron.schedule("0 */6 * * *", async () => {
      const hasAnySyncTarget =
        process.env.PAYLOAD_API_URL ||
        process.env.ERPNEXT_SITE_URL ||
        process.env.FLEETBASE_API_URL ||
        process.env.WALTID_API_URL
      if (!hasAnySyncTarget) {
        console.log("[SyncScheduler] No sync targets configured, skipping hierarchy reconciliation")
        return
      }
      try {
        console.log("[SyncScheduler] Starting node hierarchy reconciliation")
        const nodeHierarchyService = new NodeHierarchySyncService(this.container)
        const query = this.container.resolve("query") as any
        const { data: tenants } = await query.graph({
          entity: "tenant",
          fields: ["id"],
          pagination: { take: 100 },
        })

        for (const tenant of tenants || []) {
          try {
            const result = await nodeHierarchyService.syncFullHierarchy(tenant.id)
            console.log(`[SyncScheduler] Node hierarchy sync for tenant ${tenant.id}: payload=${result.payload.synced}, erpnext=${result.erpnext.synced}, fleetbase=${result.fleetbase.synced}, waltid=${result.waltid.synced}`)
          } catch (err: any) {
            console.log(`[SyncScheduler] Node hierarchy sync failed for tenant ${tenant.id}: ${err.message}`)
          }
        }
      } catch (error: any) {
        console.log(`[SyncScheduler] Node hierarchy reconciliation error: ${error.message}`)
      }
    })
    this.tasks.push(hierarchyTask)

    const cleanupTask = cron.schedule("0 0 * * *", async () => {
      try {
        console.log("[SyncScheduler] Cleaning up old sync logs")
        const orchestrator = createIntegrationOrchestrator(this.container)
        const dashboard = await orchestrator.getSyncDashboard()
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const oldEntries = dashboard.recentSyncs.filter(
          (entry) => new Date(entry.created_at) < thirtyDaysAgo
        )
        console.log(`[SyncScheduler] Cleanup complete: ${oldEntries.length} old log entries identified`)
      } catch (error: any) {
        console.log(`[SyncScheduler] Log cleanup error: ${error.message}`)
      }
    })
    this.tasks.push(cleanupTask)

    console.log("[SyncScheduler] All sync jobs scheduled")
  }

  stop() {
    console.log("[SyncScheduler] Stopping integration sync scheduler")
    for (const task of this.tasks) {
      task.stop()
    }
    this.tasks = []
    console.log("[SyncScheduler] All sync jobs stopped")
  }
}

export function createSyncScheduler(container: MedusaContainer): IntegrationSyncScheduler {
  return new IntegrationSyncScheduler(container)
}

export default async function integrationSyncSchedulerJob(container: MedusaContainer) {
  console.log("[SyncScheduler] Running scheduled integration sync reconciliation")

  try {
    const payloadUrl = process.env.PAYLOAD_API_URL
    const payloadKey = process.env.PAYLOAD_API_KEY
    if (payloadUrl && payloadKey) {
      try {
        console.log("[SyncScheduler] Syncing products to Payload CMS")
        const sync = new MedusaToPayloadSync(container, {
          payloadUrl,
          payloadApiKey: payloadKey,
        })
        const result = await sync.syncAllProducts()
        console.log(`[SyncScheduler] Product sync complete: ${result.success} success, ${result.failed} failed`)
      } catch (error: any) {
        console.log(`[SyncScheduler] Product sync to Payload failed: ${error.message}`)
      }

      try {
        console.log("[SyncScheduler] Processing pending Payload content updates")
        const reverseSync = new PayloadToMedusaSync(container, {
          payloadUrl,
          payloadApiKey: payloadKey,
        })
        const result = await reverseSync.syncPendingProductContent()
        console.log(`[SyncScheduler] Pending content sync complete: ${result.success} success, ${result.failed} failed`)
      } catch (error: any) {
        console.log(`[SyncScheduler] Pending content sync failed: ${error.message}`)
      }
    } else {
      console.log("[SyncScheduler] Payload CMS not configured, skipping product sync")
    }

    try {
      console.log("[SyncScheduler] Retrying failed syncs")
      const orchestrator = createIntegrationOrchestrator(container)
      const result = await orchestrator.retryFailedSyncs()
      console.log(`[SyncScheduler] Retry complete: ${result.succeeded} succeeded, ${result.failed} failed out of ${result.retried} retried`)
    } catch (error: any) {
      console.log(`[SyncScheduler] Failed sync retry error: ${error.message}`)
    }

    const hasAnySyncTarget =
      process.env.PAYLOAD_API_URL ||
      process.env.ERPNEXT_SITE_URL ||
      process.env.FLEETBASE_API_URL ||
      process.env.WALTID_API_URL
    if (hasAnySyncTarget) {
      try {
        console.log("[SyncScheduler] Starting node hierarchy reconciliation")
        const nodeHierarchyService = new NodeHierarchySyncService(container)
        const query = container.resolve("query") as any
        const { data: tenants } = await query.graph({
          entity: "tenant",
          fields: ["id"],
          pagination: { take: 100 },
        })

        for (const tenant of tenants || []) {
          try {
            const result = await nodeHierarchyService.syncFullHierarchy(tenant.id)
            console.log(`[SyncScheduler] Node hierarchy sync for tenant ${tenant.id}: payload=${result.payload.synced}, erpnext=${result.erpnext.synced}, fleetbase=${result.fleetbase.synced}, waltid=${result.waltid.synced}`)
          } catch (err: any) {
            console.log(`[SyncScheduler] Node hierarchy sync failed for tenant ${tenant.id}: ${err.message}`)
          }
        }
      } catch (error: any) {
        console.log(`[SyncScheduler] Node hierarchy reconciliation error: ${error.message}`)
      }
    }

    try {
      console.log("[SyncScheduler] Cleaning up old sync logs")
      const orchestrator = createIntegrationOrchestrator(container)
      const dashboard = await orchestrator.getSyncDashboard()
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const oldEntries = dashboard.recentSyncs.filter(
        (entry) => new Date(entry.created_at) < thirtyDaysAgo
      )
      console.log(`[SyncScheduler] Cleanup complete: ${oldEntries.length} old log entries identified`)
    } catch (error: any) {
      console.log(`[SyncScheduler] Log cleanup error: ${error.message}`)
    }
  } catch (error: any) {
    console.log(`[SyncScheduler] Integration sync scheduler error: ${error.message}`)
  }
}

export const config = {
  name: "integration-sync-scheduler",
  schedule: "0 * * * *",
}
