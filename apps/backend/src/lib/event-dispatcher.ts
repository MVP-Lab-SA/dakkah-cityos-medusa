import { startWorkflow } from "./temporal-client"

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
