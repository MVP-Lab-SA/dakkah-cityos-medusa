import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createIntegrationOrchestrator } from "../../../../integrations/orchestrator"
import { NodeHierarchySyncService } from "../../../../integrations/node-hierarchy-sync"
import { MedusaToPayloadSync } from "../../../../integrations/payload-sync"

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

    if (entity_type === "node") {
      const nodeHierarchyService = new NodeHierarchySyncService(req.scope)
      if (entity_id) {
        await nodeHierarchyService.syncSingleNode(entity_id)
      } else {
        console.log("[IntegrationSync] Node batch sync requires tenant_id, use node-hierarchy endpoint")
      }
      return res.json({ triggered: true, system, entity_type, entity_id: entity_id || "all" })
    }

    if (entity_type === "product" && system === "payload") {
      const payloadUrl = process.env.PAYLOAD_API_URL
      const payloadKey = process.env.PAYLOAD_API_KEY
      if (payloadUrl && payloadKey) {
        const payloadSync = new MedusaToPayloadSync(req.scope, {
          payloadUrl,
          payloadApiKey: payloadKey,
        })
        if (entity_id) {
          await payloadSync.syncProduct(entity_id)
        } else {
          payloadSync.syncAllProducts().catch((err) => {
            console.log(`[IntegrationSync] Batch product sync error: ${err.message}`)
          })
        }
      }
      return res.json({ triggered: true, system, entity_type, entity_id: entity_id || "all" })
    }

    const orchestrator = createIntegrationOrchestrator(req.scope)

    if (entity_id) {
      const query = req.scope.resolve("query") as any
      let data = {}
      try {
        const { data: entities } = await query.graph({
          entity: entity_type,
          fields: ["*"],
          filters: { id: entity_id },
        })
        if (entities && entities.length > 0) {
          data = entities[0]
        }
      } catch {
        data = { id: entity_id }
      }

      await orchestrator.syncToSystem(system as any, entity_type, entity_id, data, {
        direction: direction || "outbound",
      })
    } else {
      const query = req.scope.resolve("query") as any
      try {
        const { data: entities } = await query.graph({
          entity: entity_type,
          fields: ["id"],
          pagination: { take: 100 },
        })
        for (const entity of entities || []) {
          await orchestrator.syncToSystem(system as any, entity_type, entity.id, entity, {
            direction: direction || "outbound",
          })
        }
      } catch (err: any) {
        console.log(`[IntegrationSync] Batch sync query error: ${err.message}`)
      }
    }

    return res.json({ triggered: true, system, entity_type, entity_id: entity_id || "all" })
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
