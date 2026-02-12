// @ts-nocheck
import { MedusaContainer } from "@medusajs/framework/types"

export default async function payloadCmsPollJob(container: MedusaContainer) {
  const payloadUrl = process.env.PAYLOAD_CMS_URL_DEV || process.env.PAYLOAD_CMS_URL
  const payloadApiKey = process.env.PAYLOAD_API_KEY
  const erpnextUrl = process.env.ERPNEXT_URL_DEV
  const erpnextApiKey = process.env.ERPNEXT_API_KEY
  const erpnextApiSecret = process.env.ERPNEXT_API_SECRET

  if (!payloadUrl || !payloadApiKey) {
    console.log("[PayloadCMSPoll] Payload CMS not configured, skipping poll")
    return
  }

  if (!erpnextUrl || !erpnextApiKey || !erpnextApiSecret) {
    console.log("[PayloadCMSPoll] ERPNext not configured, skipping hierarchy sync to ERPNext")
    return
  }

  try {
    console.log("[PayloadCMSPoll] Starting CMS hierarchy sync poll...")

    const { createHierarchySyncEngine } = require("../integrations/cms-hierarchy-sync/engine")
    const engine = createHierarchySyncEngine({
      payloadUrl,
      payloadApiKey,
      erpnextUrl,
      erpnextApiKey,
      erpnextApiSecret,
    })

    const results = await engine.syncAll()

    let totalSynced = 0
    let totalCreated = 0
    let totalUpdated = 0
    let totalFailed = 0

    for (const result of results) {
      totalSynced += result.total
      totalCreated += result.created
      totalUpdated += result.updated
      totalFailed += result.failed

      if (result.total > 0 || result.failed > 0) {
        console.log(
          `[PayloadCMSPoll] ${result.collection}: ${result.total} synced, ${result.created} created, ${result.updated} updated, ${result.failed} failed`
        )
      }
    }

    console.log(
      `[PayloadCMSPoll] Poll complete: ${totalSynced} total, ${totalCreated} created, ${totalUpdated} updated, ${totalFailed} failed`
    )
  } catch (error: any) {
    console.error(`[PayloadCMSPoll] Error during hierarchy sync: ${error.message}`)
  }
}

export const config = {
  name: "payload-cms-poll",
  schedule: "*/15 * * * *",
}
