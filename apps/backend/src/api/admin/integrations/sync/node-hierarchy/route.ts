import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { NodeHierarchySyncService } from "../../../../../integrations/node-hierarchy-sync/index.js"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { tenant_id, mode } = req.body as { tenant_id: string; mode?: "temporal" | "direct" }

    if (!tenant_id) {
      return res.status(400).json({ error: "tenant_id is required" })
    }

    const syncMode = mode || (process.env.TEMPORAL_API_KEY ? "temporal" : "direct")

    if (syncMode === "temporal" && process.env.TEMPORAL_API_KEY) {
      console.log(`[NodeHierarchySync] Dispatching hierarchy sync to Temporal for tenant: ${tenant_id}`)

      const { startWorkflow } = require("../../../../../lib/temporal-client")
      const result = await startWorkflow("xsystem.scheduled-hierarchy-reconciliation", {
        tenant_id,
        triggered_by: "admin",
        timestamp: new Date().toISOString(),
      }, {
        tenantId: tenant_id,
        source: "admin-hierarchy-sync",
      })

      return res.json({
        triggered: true,
        mode: "temporal",
        tenant_id,
        workflow_run_id: result.runId,
      })
    }

    console.log(`[NodeHierarchySync] Running direct hierarchy sync for tenant: ${tenant_id}`)
    const syncService = new NodeHierarchySyncService(req.scope)
    const result = await syncService.syncFullHierarchy(tenant_id)

    return res.json({
      triggered: true,
      mode: "direct",
      tenant_id,
      result,
    })
  } catch (error: any) {
    console.log(`[NodeHierarchySync] Error in hierarchy sync: ${error.message}`)
    return res.status(500).json({ error: error.message })
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const tenant_id = req.query.tenant_id as string

    if (!tenant_id) {
      return res.status(400).json({ error: "tenant_id query parameter is required" })
    }

    const nodeHierarchyService = new NodeHierarchySyncService(req.scope)
    const hierarchy = await nodeHierarchyService.getHierarchyTree(tenant_id)

    return res.json({
      tenant_id,
      hierarchy,
    })
  } catch (error: any) {
    console.log(`[NodeHierarchySync] Error fetching hierarchy: ${error.message}`)
    return res.status(500).json({ error: error.message })
  }
}
