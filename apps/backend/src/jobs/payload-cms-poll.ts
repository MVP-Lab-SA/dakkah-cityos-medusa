// @ts-nocheck
import { MedusaContainer } from "@medusajs/framework/types"
import axios from "axios"

const POLL_STATE: Record<string, string> = {}

async function fetchPayloadCollection(client: any, collection: string, since?: string): Promise<any[]> {
  try {
    const params: Record<string, any> = { limit: 100, sort: "-updatedAt" }
    if (since) {
      params.where = { updatedAt: { greater_than: since } }
    }
    const response = await client.get(`/api/${collection}`, { params })
    return response.data?.docs || []
  } catch (err: any) {
    console.log(`[PayloadCMSPoll] Failed to fetch ${collection}: ${err.message}`)
    return []
  }
}

async function syncTenantFromPayload(container: MedusaContainer, doc: any): Promise<void> {
  const tenantModuleService = container.resolve("tenant") as any
  if (!doc.medusaTenantId) return

  try {
    const tenant = await tenantModuleService.retrieveTenant(doc.medusaTenantId)
    if (tenant) {
      await tenantModuleService.updateTenants({
        id: tenant.id,
        metadata: {
          ...tenant.metadata,
          payload_synced_at: new Date().toISOString(),
          payload_id: doc.id,
        },
      })
      console.log(`[PayloadCMSPoll] Updated tenant ${tenant.handle} from Payload`)
    }
  } catch (err: any) {
    console.log(`[PayloadCMSPoll] Tenant sync error for ${doc.medusaTenantId}: ${err.message}`)
  }
}

async function syncNodeFromPayload(container: MedusaContainer, doc: any): Promise<void> {
  const nodeModuleService = container.resolve("node") as any
  if (!doc.medusaNodeId) return

  try {
    const node = await nodeModuleService.retrieveNode(doc.medusaNodeId)
    if (node) {
      const updates: Record<string, any> = { id: node.id }
      if (doc.name && doc.name !== node.name) updates.name = doc.name
      if (doc.status && doc.status !== node.status) updates.status = doc.status
      if (doc.location) updates.location = doc.location
      if (doc.metadata) {
        updates.metadata = {
          ...node.metadata,
          ...doc.metadata,
          payload_synced_at: new Date().toISOString(),
        }
      }

      if (Object.keys(updates).length > 1) {
        await nodeModuleService.updateNodes(updates)
        console.log(`[PayloadCMSPoll] Updated node ${node.name} from Payload`)
      }
    }
  } catch (err: any) {
    console.log(`[PayloadCMSPoll] Node sync error for ${doc.medusaNodeId}: ${err.message}`)
  }
}

async function syncProductContentFromPayload(container: MedusaContainer, doc: any): Promise<void> {
  if (!doc.medusaProductId) return

  try {
    const query = container.resolve("query")
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "metadata"],
      filters: { id: doc.medusaProductId },
    })

    if (products?.[0]) {
      const productModuleService = container.resolve("productModuleService") as any
      await productModuleService.updateProducts({
        id: doc.medusaProductId,
        metadata: {
          ...products[0].metadata,
          payload_content_id: doc.id,
          enhanced_description: doc.enhancedDescription || null,
          seo_title: doc.seoTitle || null,
          seo_description: doc.seoDescription || null,
          last_payload_sync: new Date().toISOString(),
        },
      })
      console.log(`[PayloadCMSPoll] Updated product ${doc.medusaProductId} content from Payload`)
    }
  } catch (err: any) {
    console.log(`[PayloadCMSPoll] Product content sync error: ${err.message}`)
  }
}

export default async function payloadCmsPollJob(container: MedusaContainer) {
  const payloadUrl = process.env.PAYLOAD_CMS_URL_DEV
  const payloadApiKey = process.env.PAYLOAD_API_KEY

  if (!payloadUrl || !payloadApiKey) {
    console.log("[PayloadCMSPoll] Payload CMS not configured (PAYLOAD_CMS_URL_DEV / PAYLOAD_API_KEY), skipping poll")
    return
  }

  console.log("[PayloadCMSPoll] Starting periodic Payload CMS data poll...")

  const client = axios.create({
    baseURL: payloadUrl,
    headers: {
      Authorization: `Bearer ${payloadApiKey}`,
      "Content-Type": "application/json",
    },
    timeout: 15000,
  })

  const collections = [
    { name: "tenants", handler: syncTenantFromPayload },
    { name: "nodes", handler: syncNodeFromPayload },
    { name: "product-content", handler: syncProductContentFromPayload },
  ]

  let totalSynced = 0
  let totalErrors = 0

  for (const { name, handler } of collections) {
    const lastPolled = POLL_STATE[name] || undefined
    const docs = await fetchPayloadCollection(client, name, lastPolled)

    if (docs.length > 0) {
      console.log(`[PayloadCMSPoll] Found ${docs.length} updated ${name} since last poll`)

      for (const doc of docs) {
        try {
          await handler(container, doc)
          totalSynced++
        } catch (err: any) {
          totalErrors++
          console.log(`[PayloadCMSPoll] Error syncing ${name} doc ${doc.id}: ${err.message}`)
        }
      }

      POLL_STATE[name] = new Date().toISOString()
    }
  }

  console.log(`[PayloadCMSPoll] Poll complete: ${totalSynced} synced, ${totalErrors} errors`)
}

export const config = {
  name: "payload-cms-poll",
  schedule: "*/15 * * * *",
}
