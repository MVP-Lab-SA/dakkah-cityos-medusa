import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const secret = process.env.ERPNEXT_WEBHOOK_SECRET
    if (secret) {
      const headerSecret = req.headers["x-erpnext-secret"] as string
      const expectedSig = crypto.createHmac("sha256", secret).update(JSON.stringify(req.body)).digest("hex")
      if (headerSecret !== expectedSig) {
        console.log("[Webhook:ERPNext] Invalid secret")
        return res.status(401).json({ error: "Invalid secret" })
      }
    }

    const body = req.body as Record<string, any>
    const doctype = body.doctype || "unknown"
    const event = body.event || "unknown"
    const data = body.data || {}

    console.log(`[Webhook:ERPNext] Received: ${doctype} - ${event}`)

    let processed = false

    switch (doctype) {
      case "Sales Invoice": {
        if (event === "on_submit" || event === "submitted") {
          const medusaOrderId = data.custom_medusa_order_id || data.medusa_order_id
          if (medusaOrderId) {
            try {
              const query = req.scope.resolve("query")
              const { data: orders } = await query.graph({
                entity: "order",
                fields: ["id", "metadata"],
                filters: { id: medusaOrderId },
              })

              if (orders && orders.length > 0) {
                const orderModuleService = req.scope.resolve("orderModuleService") as any
                await orderModuleService.updateOrders({
                  id: medusaOrderId,
                  metadata: {
                    ...orders[0].metadata,
                    erpnext_invoice_name: data.name,
                    erpnext_invoice_status: "submitted",
                    erpnext_invoice_synced_at: new Date().toISOString(),
                  },
                })
                processed = true
                console.log(`[Webhook:ERPNext] Invoice ${data.name} linked to order ${medusaOrderId}`)
              }
            } catch (err) {
              console.log(`[Webhook:ERPNext] Error updating order metadata: ${err instanceof Error ? err.message : err}`)
            }
          }
        } else if (event === "on_cancel" || event === "cancelled") {
          const medusaOrderId = data.custom_medusa_order_id || data.medusa_order_id
          if (medusaOrderId) {
            try {
              const query = req.scope.resolve("query")
              const { data: orders } = await query.graph({
                entity: "order",
                fields: ["id", "metadata"],
                filters: { id: medusaOrderId },
              })

              if (orders && orders.length > 0) {
                const orderModuleService = req.scope.resolve("orderModuleService") as any
                await orderModuleService.updateOrders({
                  id: medusaOrderId,
                  metadata: {
                    ...orders[0].metadata,
                    erpnext_invoice_status: "cancelled",
                    erpnext_invoice_cancelled_at: new Date().toISOString(),
                  },
                })
                processed = true
                console.log(`[Webhook:ERPNext] Invoice ${data.name} cancelled for order ${medusaOrderId}`)
              }
            } catch (err) {
              console.log(`[Webhook:ERPNext] Error updating cancelled invoice: ${err instanceof Error ? err.message : err}`)
            }
          }
        }
        break
      }

      case "Payment Entry": {
        if (event === "on_submit" || event === "submitted") {
          const medusaOrderId = data.custom_medusa_order_id || data.medusa_order_id
          console.log(`[Webhook:ERPNext] Payment Entry submitted: ${data.name}, order: ${medusaOrderId || "N/A"}`)
          processed = true
        }
        break
      }

      case "Stock Entry": {
        if (event === "on_submit" || event === "posted") {
          console.log(`[Webhook:ERPNext] Stock Entry posted: ${data.name}, type: ${data.stock_entry_type || "unknown"}`)
          if (data.items && Array.isArray(data.items)) {
            for (const item of data.items) {
              console.log(`[Webhook:ERPNext] Inventory change: ${item.item_code} qty: ${item.qty} warehouse: ${item.t_warehouse || item.s_warehouse}`)
            }
          }
          processed = true
        }
        break
      }

      case "Customer": {
        if (event === "on_update" || event === "updated") {
          console.log(`[Webhook:ERPNext] Customer updated: ${data.name}, medusa_id: ${data.custom_medusa_customer_id || "N/A"}`)
          processed = true
        }
        break
      }

      default:
        console.log(`[Webhook:ERPNext] Unhandled doctype: ${doctype}, event: ${event}`)
        break
    }

    return res.status(200).json({ received: true, doctype, event, processed })
  } catch (error) {
    console.log(`[Webhook:ERPNext] Error: ${error instanceof Error ? error.message : error}`)
    return res.status(500).json({ error: "Internal server error" })
  }
}
