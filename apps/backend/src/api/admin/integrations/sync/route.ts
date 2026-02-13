import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createIntegrationOrchestrator } from "../../../../integrations/orchestrator/index"

const VALID_SYSTEMS = ["payload", "erpnext", "fleetbase", "waltid", "stripe"]
const VALID_ENTITY_TYPES = ["product", "tenant", "store", "customer", "order", "node", "vendor"]

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { system, entity_type, entity_id, direction } = req.body as {
      system: string
      entity_type: string
      entity_id?: string
      direction?: "outbound" | "inbound"
    }

    if (!system || !entity_type) {
      return res.status(400).json({ error: "system and entity_type are required" })
    }

    if (!VALID_SYSTEMS.includes(system)) {
      return res.status(400).json({
        error: `Invalid system. Must be one of: ${VALID_SYSTEMS.join(", ")}`,
      })
    }

    if (!VALID_ENTITY_TYPES.includes(entity_type)) {
      return res.status(400).json({
        error: `Invalid entity_type. Must be one of: ${VALID_ENTITY_TYPES.join(", ")}`,
      })
    }

    console.log(`[IntegrationSync] Manual sync triggered: ${system}/${entity_type}/${entity_id || "all"}`)

    const { startWorkflow } = await import("../../../../lib/temporal-client.js")

    if (!process.env.TEMPORAL_API_KEY) {
      return res.status(503).json({ error: "Temporal not configured. Manual sync requires Temporal." })
    }

    try {
      const workflowId = `manual-sync-${system}-${entity_type}-${Date.now()}`
      const result = await startWorkflow(workflowId, {
        system,
        entity_type,
        entity_id: entity_id || "all",
        direction: direction || "outbound",
        triggered_by: "admin",
      }, {
        tenantId: (req.body as any)?.tenant_id,
        source: "admin-manual-sync",
      })

      console.log(`[IntegrationSync] Manual sync dispatched to Temporal: ${result.runId}`)
      return res.json({ triggered: true, system, entity_type, entity_id: entity_id || "all", workflow_run_id: result.runId })
    } catch (err: any) {
      console.log(`[IntegrationSync] Error dispatching manual sync: ${err.message}`)
      return res.status(500).json({ error: `Failed to dispatch sync: ${err.message}` })
    }
  } catch (error: any) {
    console.log(`[IntegrationSync] Error triggering sync: ${error.message}`)
    return res.status(500).json({ error: error.message })
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const orchestrator = createIntegrationOrchestrator(req.scope)
    const limit = parseInt(req.query.limit as string) || 50
    const systemFilter = req.query.system as string | undefined
    const statusFilter = req.query.status as string | undefined

    const dashboard = await orchestrator.getSyncDashboard()
    let recentSyncs = dashboard.recentSyncs

    if (systemFilter) {
      recentSyncs = recentSyncs.filter((s) => s.system === systemFilter)
    }
    if (statusFilter) {
      recentSyncs = recentSyncs.filter((s) => s.status === statusFilter)
    }

    recentSyncs = recentSyncs.slice(0, limit)

    return res.json({
      syncs: recentSyncs,
      total: recentSyncs.length,
      stats: dashboard.stats,
    })
  } catch (error: any) {
    console.log(`[IntegrationSync] Error fetching sync operations: ${error.message}`)
    return res.status(500).json({ error: error.message })
  }
}
