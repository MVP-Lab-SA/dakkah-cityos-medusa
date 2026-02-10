import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { NodeHierarchySyncService } from "../../../../../integrations/node-hierarchy-sync"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { tenant_id } = req.body as { tenant_id: string }

    if (!tenant_id) {
      return res.status(400).json({ error: "tenant_id is required" })
    }

    const { startWorkflow } = await import("../../../../../lib/temporal-client.js")

    if (!process.env.TEMPORAL_API_KEY) {
      return res.status(503).json({ error: "Temporal not configured. Hierarchy sync requires Temporal." })
    }

    console.log(`[NodeHierarchySync] Dispatching hierarchy sync to Temporal for tenant: ${tenant_id}`)

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
      tenant_id,
      workflow_run_id: result.runId,
    })
  } catch (error: any) {
    console.log(`[NodeHierarchySync] Error dispatching hierarchy sync: ${error.message}`)
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
