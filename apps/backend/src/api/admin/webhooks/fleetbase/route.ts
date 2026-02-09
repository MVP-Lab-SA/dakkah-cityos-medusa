import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createHmac } from "crypto"

function verifyFleetbaseSignature(payload: string, signature: string, secret: string): boolean {
  const computed = createHmac("sha256", secret).update(payload).digest("hex")
  return computed === signature
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const secret = process.env.FLEETBASE_WEBHOOK_SECRET
    if (secret) {
      const signature = req.headers["x-fleetbase-signature"] as string
      if (!signature) {
        console.log("[Webhook:Fleetbase] Missing signature header")
        return res.status(401).json({ error: "Missing signature" })
      }
      const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body)
      if (!verifyFleetbaseSignature(rawBody, signature, secret)) {
        console.log("[Webhook:Fleetbase] Invalid signature")
        return res.status(401).json({ error: "Invalid signature" })
      }
    }

    const body = req.body as Record<string, any>
    const event = body.event || "unknown"
    const data = body.data || {}

    console.log(`[Webhook:Fleetbase] Received event: ${event}`)

    let processed = false

    switch (event) {
      case "order.status_changed": {
        const orderId = data.meta?.order_id || data.order_id
        const newStatus = data.status
        console.log(`[Webhook:Fleetbase] Order status changed: ${orderId || "unknown"} -> ${newStatus}`)
        processed = true
        break
      }

      case "order.completed": {
        const orderId = data.meta?.order_id || data.order_id
        if (orderId) {
          try {
            const query = req.scope.resolve("query")
            const { data: orders } = await query.graph({
              entity: "order",
              fields: ["id", "metadata"],
              filters: { id: orderId },
            })

            if (orders && orders.length > 0) {
              const orderModuleService = req.scope.resolve("orderModuleService") as any
              await orderModuleService.updateOrders({
                id: orderId,
                metadata: {
                  ...orders[0].metadata,
                  fleetbase_status: "completed",
                  fleetbase_completed_at: new Date().toISOString(),
                  fleetbase_shipment_id: data.id,
                },
              })
              console.log(`[Webhook:Fleetbase] Order ${orderId} marked as delivered`)
            }
          } catch (err) {
            console.log(`[Webhook:Fleetbase] Error updating order fulfillment: ${err instanceof Error ? err.message : err}`)
          }
        }
        processed = true
        break
      }

      case "order.driver_assigned": {
        const orderId = data.meta?.order_id || data.order_id
        const driverName = data.driver_assigned?.name || data.driver_name
        console.log(`[Webhook:Fleetbase] Driver assigned to order ${orderId || "unknown"}: ${driverName || "unknown"}`)
        if (orderId) {
          try {
            const query = req.scope.resolve("query")
            const { data: orders } = await query.graph({
              entity: "order",
              fields: ["id", "metadata"],
              filters: { id: orderId },
            })

            if (orders && orders.length > 0) {
              const orderModuleService = req.scope.resolve("orderModuleService") as any
              await orderModuleService.updateOrders({
                id: orderId,
                metadata: {
                  ...orders[0].metadata,
                  fleetbase_driver_name: driverName,
                  fleetbase_driver_id: data.driver_assigned?.id || data.driver_id,
                  fleetbase_driver_assigned_at: new Date().toISOString(),
                },
              })
            }
          } catch (err) {
            console.log(`[Webhook:Fleetbase] Error updating driver assignment: ${err instanceof Error ? err.message : err}`)
          }
        }
        processed = true
        break
      }

      case "tracking.updated": {
        const orderId = data.meta?.order_id || data.order_id
        if (orderId) {
          try {
            const query = req.scope.resolve("query")
            const { data: orders } = await query.graph({
              entity: "order",
              fields: ["id", "metadata"],
              filters: { id: orderId },
            })

            if (orders && orders.length > 0) {
              const orderModuleService = req.scope.resolve("orderModuleService") as any
              await orderModuleService.updateOrders({
                id: orderId,
                metadata: {
                  ...orders[0].metadata,
                  fleetbase_tracking: {
                    status: data.status,
                    location: data.location || null,
                    updated_at: new Date().toISOString(),
                    tracking_number: data.tracking_number || data.public_id,
                  },
                },
              })
              console.log(`[Webhook:Fleetbase] Tracking updated for order ${orderId}`)
            }
          } catch (err) {
            console.log(`[Webhook:Fleetbase] Error updating tracking: ${err instanceof Error ? err.message : err}`)
          }
        }
        processed = true
        break
      }

      default:
        console.log(`[Webhook:Fleetbase] Unhandled event: ${event}`)
        break
    }

    return res.status(200).json({ received: true, event, processed })
  } catch (error) {
    console.log(`[Webhook:Fleetbase] Error: ${error instanceof Error ? error.message : error}`)
    return res.status(500).json({ error: "Internal server error" })
  }
}
