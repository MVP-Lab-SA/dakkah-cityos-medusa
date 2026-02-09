import { startWorkflow } from "./temporal-client"
import { NodeHierarchySyncService } from "../integrations/node-hierarchy-sync"

const EVENT_WORKFLOW_MAP: Record<string, string> = {
  "order.placed": "xsystem.unified-order-orchestrator",
  "order.cancelled": "xsystem.order-cancellation-saga",
  "payment.initiated": "xsystem.multi-gateway-payment",
  "refund.requested": "xsystem.refund-compensation-saga",
  "vendor.registered": "xsystem.vendor-onboarding-verification",
  "vendor.created": "commerce.vendor-onboarding",
  "dispute.opened": "xsystem.vendor-dispute-resolution",
  "return.initiated": "xsystem.returns-processing",
  "kyc.requested": "xsystem.kyc-verification",
  "subscription.created": "xsystem.subscription-lifecycle",
  "booking.created": "xsystem.service-booking-orchestrator",
  "auction.started": "xsystem.auction-lifecycle",
  "restaurant-order.placed": "xsystem.restaurant-order-orchestrator",
  "product.updated": "commerce.sync-product-to-cms",
  "workflow.dynamic.start": "dynamic-agent-orchestrator",
  "governance.policy.changed": "xsystem.governance-policy-propagation",
  "node.created": "xsystem.node-provisioning",
  "tenant.provisioned": "xsystem.tenant-setup-saga",
  "node.updated": "xsystem.node-update-propagation",
  "node.deleted": "xsystem.node-decommission",
  "tenant.updated": "xsystem.tenant-config-sync",
  "store.created": "commerce.store-setup",
  "store.updated": "commerce.store-config-sync",
  "product.created": "commerce.product-catalog-sync",
  "customer.created": "xsystem.customer-onboarding",
  "customer.updated": "xsystem.customer-profile-sync",
  "vendor.approved": "xsystem.vendor-ecosystem-setup",
  "vendor.suspended": "xsystem.vendor-suspension-cascade",
  "inventory.updated": "xsystem.inventory-reconciliation",
  "fulfillment.created": "xsystem.fulfillment-dispatch",
  "fulfillment.shipped": "xsystem.shipment-tracking-start",
  "fulfillment.delivered": "xsystem.delivery-confirmation",
  "invoice.created": "xsystem.invoice-processing",
  "payment.completed": "xsystem.payment-reconciliation",
  "kyc.completed": "xsystem.kyc-credential-issuance",
  "membership.created": "xsystem.membership-credential-issuance",
}

export function getWorkflowForEvent(eventType: string): string | null {
  return EVENT_WORKFLOW_MAP[eventType] || null
}

export function getAllMappedEvents(): string[] {
  return Object.keys(EVENT_WORKFLOW_MAP)
}

export async function dispatchEventToTemporal(
  eventType: string,
  payload: any,
  nodeContext?: any
): Promise<{ dispatched: boolean; runId?: string; error?: string }> {
  const workflowId = getWorkflowForEvent(eventType)

  if (!workflowId) {
    return { dispatched: false, error: `No workflow mapped for event: ${eventType}` }
  }

  try {
    const result = await startWorkflow(workflowId, payload, nodeContext || {})
    return { dispatched: true, runId: result.runId }
  } catch (err: any) {
    console.warn(`[EventDispatcher] Failed to dispatch ${eventType} to Temporal:`, err.message)
    return { dispatched: false, error: err.message }
  }
}

export async function processOutboxEvents(container: any): Promise<{
  processed: number
  failed: number
  errors: string[]
}> {
  let processed = 0
  let failed = 0
  const errors: string[] = []

  try {
    const eventOutboxService = container.resolve("eventOutbox") as any
    const pendingEvents = await eventOutboxService.listPendingEvents(undefined, 50)

    for (const event of pendingEvents) {
      const workflowId = getWorkflowForEvent(event.event_type)
      if (!workflowId) {
        continue
      }

      try {
        const envelope = eventOutboxService.buildEnvelope(event)
        await startWorkflow(workflowId, envelope.payload, {
          tenantId: event.tenant_id,
          nodeId: event.node_id,
          correlationId: event.correlation_id,
          channel: event.channel,
        })
        await eventOutboxService.markPublished(event.id)
        processed++
      } catch (err: any) {
        await eventOutboxService.markFailed(event.id, err.message)
        failed++
        errors.push(`Event ${event.id} (${event.event_type}): ${err.message}`)
      }
    }
  } catch (err: any) {
    errors.push(`Outbox processing error: ${err.message}`)
  }

  return { processed, failed, errors }
}

export async function dispatchCrossSystemEvent(
  eventType: string,
  payload: any,
  container: any,
  nodeContext?: any
): Promise<{ temporal: boolean; integrations: string[] }> {
  const integrations: string[] = []

  const temporalResult = await dispatchEventToTemporal(eventType, payload, nodeContext)
  const temporal = temporalResult.dispatched

  const eventPrefix = eventType.split(".")[0]

  try {
    switch (eventPrefix) {
      case "product": {
        const payloadUrl = process.env.PAYLOAD_API_URL
        const payloadKey = process.env.PAYLOAD_API_KEY
        if (payloadUrl && payloadKey) {
          try {
            const { MedusaToPayloadSync } = await import("../integrations/payload-sync/medusa-to-payload")
            const payloadSync = new MedusaToPayloadSync(container, { payloadUrl, payloadApiKey: payloadKey })
            if (payload.id) {
              await payloadSync.syncProduct(payload.id)
              integrations.push("payload")
            }
          } catch (err: any) {
            console.warn(`[EventDispatcher] Payload sync failed for ${eventType}: ${err.message}`)
          }
        }

        const erpSiteUrl = process.env.ERPNEXT_SITE_URL
        const erpApiKey = process.env.ERPNEXT_API_KEY
        const erpApiSecret = process.env.ERPNEXT_API_SECRET
        if (erpSiteUrl && erpApiKey && erpApiSecret) {
          try {
            const { ERPNextService } = await import("../integrations/erpnext/service")
            const erpService = new ERPNextService({ siteUrl: erpSiteUrl, apiKey: erpApiKey, apiSecret: erpApiSecret })
            if (payload.id) {
              await erpService.syncProduct({
                item_code: payload.handle || payload.id,
                item_name: payload.title || payload.name || payload.id,
                item_group: "Products",
                stock_uom: "Nos",
                standard_rate: 0,
                description: payload.description,
                medusa_product_id: payload.id,
              })
              integrations.push("erpnext")
            }
          } catch (err: any) {
            console.warn(`[EventDispatcher] ERPNext sync failed for ${eventType}: ${err.message}`)
          }
        }
        break
      }

      case "customer": {
        const erpSiteUrl = process.env.ERPNEXT_SITE_URL
        const erpApiKey = process.env.ERPNEXT_API_KEY
        const erpApiSecret = process.env.ERPNEXT_API_SECRET
        if (erpSiteUrl && erpApiKey && erpApiSecret) {
          try {
            const { ERPNextService } = await import("../integrations/erpnext/service")
            const erpService = new ERPNextService({ siteUrl: erpSiteUrl, apiKey: erpApiKey, apiSecret: erpApiSecret })
            if (payload.email) {
              await erpService.syncCustomer({
                customer_name: payload.first_name
                  ? `${payload.first_name} ${payload.last_name || ""}`.trim()
                  : payload.email,
                customer_email: payload.email,
                customer_phone: payload.phone,
                customer_type: "Individual",
                medusa_customer_id: payload.id,
              })
              integrations.push("erpnext")
            }
          } catch (err: any) {
            console.warn(`[EventDispatcher] ERPNext sync failed for ${eventType}: ${err.message}`)
          }
        }
        break
      }

      case "order": {
        const erpSiteUrl = process.env.ERPNEXT_SITE_URL
        const erpApiKey = process.env.ERPNEXT_API_KEY
        const erpApiSecret = process.env.ERPNEXT_API_SECRET
        if (erpSiteUrl && erpApiKey && erpApiSecret) {
          try {
            const { ERPNextService } = await import("../integrations/erpnext/service")
            const erpService = new ERPNextService({ siteUrl: erpSiteUrl, apiKey: erpApiKey, apiSecret: erpApiSecret })
            const customerName = payload.customer?.first_name
              ? `${payload.customer.first_name} ${payload.customer.last_name || ""}`.trim()
              : payload.customer_email || "Guest"
            const invoiceResult = await erpService.createInvoice({
              customer_name: customerName,
              customer_email: payload.customer?.email || payload.customer_email || "",
              posting_date: new Date(),
              due_date: new Date(),
              items: (payload.items || []).map((item: any) => ({
                item_code: item.variant_sku || item.product_id || "ITEM",
                item_name: item.title || "Item",
                quantity: item.quantity || 1,
                rate: (item.unit_price || 0) / 100,
                amount: ((item.unit_price || 0) * (item.quantity || 1)) / 100,
              })),
              total: (payload.total || 0) / 100,
              grand_total: (payload.total || 0) / 100,
              currency: payload.currency_code?.toUpperCase() || "USD",
              medusa_order_id: payload.id,
            })
            console.log(`[CrossSystemSync] ERPNext invoice created: ${invoiceResult.name} for order ${payload.id}`)
            integrations.push("erpnext")
          } catch (err: any) {
            console.log(`[CrossSystemSync] ERPNext invoice creation failed for ${eventType}: ${err.message}`)
          }
        }

        const fbApiUrl = process.env.FLEETBASE_API_URL
        const fbApiKey = process.env.FLEETBASE_API_KEY
        const fbOrgId = process.env.FLEETBASE_ORG_ID
        if (fbApiUrl && fbApiKey && fbOrgId) {
          try {
            const { FleetbaseService } = await import("../integrations/fleetbase/service")
            const fleetbaseService = new FleetbaseService({ apiUrl: fbApiUrl, apiKey: fbApiKey, organizationId: fbOrgId })
            const shipmentResult = await fleetbaseService.createShipment({
              order_id: payload.id || "",
              pickup: {
                name: "Warehouse",
                address: payload.warehouse_address || "Default Warehouse",
                city: payload.warehouse_city || "",
                postal_code: payload.warehouse_postal_code || "",
                country: payload.warehouse_country || "",
              },
              dropoff: {
                name: payload.shipping_address?.first_name
                  ? `${payload.shipping_address.first_name} ${payload.shipping_address.last_name || ""}`.trim()
                  : "Customer",
                address: payload.shipping_address?.address_1 || "",
                city: payload.shipping_address?.city || "",
                postal_code: payload.shipping_address?.postal_code || "",
                country: payload.shipping_address?.country_code || "",
                phone: payload.shipping_address?.phone || "",
              },
              items: (payload.items || []).map((item: any) => ({
                name: item.title || "Item",
                quantity: item.quantity || 1,
              })),
            })
            console.log(`[CrossSystemSync] Fleetbase shipment created: ${shipmentResult.tracking_number} for order ${payload.id}`)
            integrations.push("fleetbase")
          } catch (err: any) {
            console.log(`[CrossSystemSync] Fleetbase shipment creation failed for ${eventType}: ${err.message}`)
          }
        }
        break
      }

      case "node": {
        try {
          const nodeHierarchySync = new NodeHierarchySyncService(container)
          if (eventType === "node.deleted" && payload.id) {
            await nodeHierarchySync.deleteNodeFromSystems(payload.id, payload.tenant_id || nodeContext?.tenantId)
            integrations.push("payload", "erpnext", "fleetbase", "waltid")
          } else if (payload.id) {
            await nodeHierarchySync.syncSingleNode(payload.id)
            integrations.push("payload", "erpnext", "fleetbase", "waltid")
          }
        } catch (err: any) {
          console.warn(`[EventDispatcher] Node hierarchy sync failed for ${eventType}: ${err.message}`)
        }
        break
      }

      case "vendor": {
        const erpSiteUrl = process.env.ERPNEXT_SITE_URL
        const erpApiKey = process.env.ERPNEXT_API_KEY
        const erpApiSecret = process.env.ERPNEXT_API_SECRET
        if (erpSiteUrl && erpApiKey && erpApiSecret) {
          try {
            const { ERPNextService } = await import("../integrations/erpnext/service")
            const erpService = new ERPNextService({ siteUrl: erpSiteUrl, apiKey: erpApiKey, apiSecret: erpApiSecret })
            const vendorName = payload.name || payload.company_name || payload.email || "Vendor"
            const syncResult = await erpService.syncCustomer({
              customer_name: vendorName,
              customer_email: payload.email || "",
              customer_phone: payload.phone,
              customer_type: payload.company_name ? "Company" : "Individual",
              medusa_customer_id: payload.id,
            })
            console.log(`[CrossSystemSync] ERPNext vendor synced: ${syncResult.name} for vendor ${payload.id}`)
            integrations.push("erpnext")
          } catch (err: any) {
            console.log(`[CrossSystemSync] ERPNext vendor sync failed for ${eventType}: ${err.message}`)
          }
        }

        const waltIdUrl = process.env.WALTID_API_URL
        const waltIdKey = process.env.WALTID_API_KEY
        if (waltIdUrl && waltIdKey) {
          try {
            const { WaltIdService } = await import("../integrations/waltid/service")
            const waltIdService = new WaltIdService({ apiUrl: waltIdUrl, apiKey: waltIdKey })
            if (payload.did || payload.subject_did) {
              const credResult = await waltIdService.issueVendorCredential({
                subjectDid: payload.did || payload.subject_did,
                vendorName: payload.name || payload.company_name || "Vendor",
                businessLicense: payload.business_license || payload.metadata?.business_license || "",
                tenantId: payload.tenant_id || nodeContext?.tenantId || "",
              })
              console.log(`[CrossSystemSync] WaltId vendor credential issued: ${credResult.credentialId} for vendor ${payload.id}`)
            } else {
              console.log(`[CrossSystemSync] WaltId skipped for vendor ${payload.id}: no DID available`)
            }
            integrations.push("waltid")
          } catch (err: any) {
            console.log(`[CrossSystemSync] WaltId vendor credential failed for ${eventType}: ${err.message}`)
          }
        }
        break
      }

      case "fulfillment": {
        const fbApiUrl = process.env.FLEETBASE_API_URL
        const fbApiKey = process.env.FLEETBASE_API_KEY
        const fbOrgId = process.env.FLEETBASE_ORG_ID
        if (fbApiUrl && fbApiKey && fbOrgId) {
          try {
            const { FleetbaseService } = await import("../integrations/fleetbase/service")
            const fleetbaseService = new FleetbaseService({ apiUrl: fbApiUrl, apiKey: fbApiKey, organizationId: fbOrgId })
            const shipmentResult = await fleetbaseService.createShipment({
              order_id: payload.order_id || payload.id || "",
              pickup: {
                name: "Warehouse",
                address: payload.warehouse_address || "Default Warehouse",
                city: payload.warehouse_city || "",
                postal_code: payload.warehouse_postal_code || "",
                country: payload.warehouse_country || "",
              },
              dropoff: {
                name: payload.shipping_address?.first_name
                  ? `${payload.shipping_address.first_name} ${payload.shipping_address.last_name || ""}`.trim()
                  : "Customer",
                address: payload.shipping_address?.address_1 || "",
                city: payload.shipping_address?.city || "",
                postal_code: payload.shipping_address?.postal_code || "",
                country: payload.shipping_address?.country_code || "",
                phone: payload.shipping_address?.phone || "",
              },
              items: (payload.items || []).map((item: any) => ({
                name: item.title || "Item",
                quantity: item.quantity || 1,
              })),
            })
            console.log(`[CrossSystemSync] Fleetbase shipment created: ${shipmentResult.tracking_number} for fulfillment ${payload.id}`)
            integrations.push("fleetbase")
          } catch (err: any) {
            console.log(`[CrossSystemSync] Fleetbase shipment creation failed for ${eventType}: ${err.message}`)
          }
        }
        break
      }
    }
  } catch (err: any) {
    console.warn(`[EventDispatcher] Cross-system dispatch error for ${eventType}: ${err.message}`)
  }

  console.log(`[EventDispatcher] Cross-system dispatch for ${eventType}: temporal=${temporal}, integrations=[${integrations.join(", ")}]`)

  return { temporal, integrations }
}
