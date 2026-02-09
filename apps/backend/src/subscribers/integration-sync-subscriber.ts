import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { MedusaToPayloadSync } from "../integrations/payload-sync"
import { createIntegrationOrchestrator } from "../integrations/orchestrator"

export default async function integrationSyncHandler({ event, container }: SubscriberArgs<any>) {
  const eventName = event.name
  const data = event.data

  console.log(`[IntegrationSync] Received event: ${eventName}`)

  try {
    switch (eventName) {
      case "product.created":
      case "product.updated": {
        const productId = data?.id
        if (!productId) break

        const payloadUrl = process.env.PAYLOAD_API_URL
        const payloadKey = process.env.PAYLOAD_API_KEY
        if (payloadUrl && payloadKey) {
          try {
            const payloadSync = new MedusaToPayloadSync(container, {
              payloadUrl,
              payloadApiKey: payloadKey,
            })
            await payloadSync.syncProduct(productId)
            console.log(`[IntegrationSync] Product ${productId} synced to Payload CMS`)
          } catch (err: any) {
            console.log(`[IntegrationSync] Failed to sync product ${productId} to Payload: ${err.message}`)
          }
        }

        const erpnextUrl = process.env.ERPNEXT_SITE_URL
        const erpnextKey = process.env.ERPNEXT_API_KEY
        const erpnextSecret = process.env.ERPNEXT_API_SECRET
        if (erpnextUrl && erpnextKey && erpnextSecret) {
          try {
            const orchestrator = createIntegrationOrchestrator(container)
            await orchestrator.syncToSystem("erpnext", "product", productId, data, {
              direction: "outbound",
            })
            console.log(`[IntegrationSync] Product ${productId} synced to ERPNext`)
          } catch (err: any) {
            console.log(`[IntegrationSync] Failed to sync product ${productId} to ERPNext: ${err.message}`)
          }
        }
        break
      }

      case "customer.created": {
        const customerId = data?.id
        if (!customerId) break

        const erpnextUrl = process.env.ERPNEXT_SITE_URL
        const erpnextKey = process.env.ERPNEXT_API_KEY
        const erpnextSecret = process.env.ERPNEXT_API_SECRET
        if (erpnextUrl && erpnextKey && erpnextSecret) {
          try {
            const orchestrator = createIntegrationOrchestrator(container)
            await orchestrator.syncToSystem("erpnext", "customer", customerId, data, {
              direction: "outbound",
            })
            console.log(`[IntegrationSync] Customer ${customerId} synced to ERPNext`)
          } catch (err: any) {
            console.log(`[IntegrationSync] Failed to sync customer ${customerId} to ERPNext: ${err.message}`)
          }
        }
        break
      }

      case "order.placed": {
        const orderId = data?.id
        if (!orderId) break

        const erpnextUrl = process.env.ERPNEXT_SITE_URL
        const erpnextKey = process.env.ERPNEXT_API_KEY
        const erpnextSecret = process.env.ERPNEXT_API_SECRET
        if (erpnextUrl && erpnextKey && erpnextSecret) {
          try {
            const orchestrator = createIntegrationOrchestrator(container)
            await orchestrator.syncToSystem("erpnext", "order", orderId, data, {
              direction: "outbound",
            })
            console.log(`[IntegrationSync] Order ${orderId} synced to ERPNext for invoice creation`)
          } catch (err: any) {
            console.log(`[IntegrationSync] Failed to sync order ${orderId} to ERPNext: ${err.message}`)
          }
        }

        const fleetbaseUrl = process.env.FLEETBASE_API_URL
        const fleetbaseKey = process.env.FLEETBASE_API_KEY
        if (fleetbaseUrl && fleetbaseKey) {
          try {
            const orchestrator = createIntegrationOrchestrator(container)
            await orchestrator.syncToSystem("fleetbase", "order", orderId, data, {
              direction: "outbound",
            })
            console.log(`[IntegrationSync] Order ${orderId} synced to Fleetbase for shipment creation`)
          } catch (err: any) {
            console.log(`[IntegrationSync] Failed to sync order ${orderId} to Fleetbase: ${err.message}`)
          }
        }
        break
      }

      case "product.deleted": {
        const productId = data?.id
        if (!productId) break

        const payloadUrl = process.env.PAYLOAD_API_URL
        const payloadKey = process.env.PAYLOAD_API_KEY
        if (payloadUrl && payloadKey) {
          try {
            const axios = (await import("axios")).default
            const client = axios.create({
              baseURL: payloadUrl,
              headers: {
                Authorization: `Bearer ${payloadKey}`,
                "Content-Type": "application/json",
              },
            })
            const existing = await client.get("/api/product-content", {
              params: { where: { medusaProductId: { equals: productId } }, limit: 1 },
            })
            if (existing.data.docs?.[0]) {
              await client.delete(`/api/product-content/${existing.data.docs[0].id}`)
              console.log(`[IntegrationSync] Product ${productId} removed from Payload CMS`)
            }
          } catch (err: any) {
            console.log(`[IntegrationSync] Failed to remove product ${productId} from Payload: ${err.message}`)
          }
        }
        break
      }

      case "governance.policy.changed": {
        const tenantId = data?.tenant_id
        if (!tenantId) break

        const payloadUrl = process.env.PAYLOAD_API_URL
        const payloadKey = process.env.PAYLOAD_API_KEY
        if (payloadUrl && payloadKey) {
          try {
            const payloadSync = new MedusaToPayloadSync(container, {
              payloadUrl,
              payloadApiKey: payloadKey,
            })
            await payloadSync.syncGovernancePolicies(tenantId)
            console.log(`[IntegrationSync] Governance policies synced to Payload for tenant ${tenantId}`)
          } catch (err: any) {
            console.log(`[IntegrationSync] Failed to sync governance policies to Payload: ${err.message}`)
          }
        }
        break
      }

      default:
        console.log(`[IntegrationSync] Unhandled event: ${eventName}`)
    }
  } catch (error: any) {
    console.log(`[IntegrationSync] Error handling event ${eventName}: ${error.message}`)
  }
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated", "customer.created", "order.placed", "product.deleted", "governance.policy.changed"],
}
