// @ts-nocheck
import { MedusaContainer } from "@medusajs/framework/types"

// NOTE: In-memory singleton flag. This works fine for single-process dev servers,
// but would NOT be safe for multi-process/distributed deployments (PM2 clusters, K8s, etc).
// In such environments, use a distributed lock or database flag instead.
let schedulerStarted = false

export default async function syncSchedulerInitJob(container: MedusaContainer) {
  if (schedulerStarted) return

  try {
    const { createSyncScheduler } = require("./integration-sync-scheduler")
    const scheduler = createSyncScheduler(container)
    
    try {
      scheduler.start()
      schedulerStarted = true
      console.log("[SyncSchedulerInit] Integration sync scheduler started successfully")
      console.log("[SyncSchedulerInit] Schedules: product sync (hourly), retry failed (30min), hierarchy reconciliation (6hr), cleanup (daily)")
    } catch (startError: any) {
      console.warn(`[SyncSchedulerInit] Failed to start scheduler instance: ${startError.message}`)
      throw startError
    }
  } catch (error: any) {
    console.warn(`[SyncSchedulerInit] Failed to initialize sync scheduler: ${error.message}`)
  }
}

export const config = {
  name: "sync-scheduler-init",
  schedule: "* * * * *",
}
