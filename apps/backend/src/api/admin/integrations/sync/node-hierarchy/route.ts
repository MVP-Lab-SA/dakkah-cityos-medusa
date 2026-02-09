import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { NodeHierarchySyncService } from "../../../../../integrations/node-hierarchy-sync"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { tenant_id } = req.body as { tenant_id: string }

    if (!tenant_id) {
      return res.status(400).json({ error: "tenant_id is required" })
    }

    console.log(`[NodeHierarchySync] Full hierarchy sync triggered for tenant: ${tenant_id}`)

    const nodeHierarchyService = new NodeHierarchySyncService(req.scope)
    const results = await nodeHierarchyService.syncFullHierarchy(tenant_id)

    return res.json({
      triggered: true,
      tenant_id,
      results,
    })
  } catch (error: any) {
    console.log(`[NodeHierarchySync] Error triggering hierarchy sync: ${error.message}`)
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
