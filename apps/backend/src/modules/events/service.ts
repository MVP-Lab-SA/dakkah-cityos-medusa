import { MedusaService } from "@medusajs/framework/utils"
import EventOutbox from "./models/event-outbox"

class EventModuleService extends MedusaService({
  EventOutbox,
}) {
  async publishEvent(data: {
    tenantId: string
    eventType: string
    aggregateType: string
    aggregateId: string
    payload: Record<string, any>
    actorId?: string
    actorRole?: string
    nodeId?: string
    channel?: string
    correlationId?: string
    causationId?: string
  }) {
    return await (this as any).createEventOutboxs({
      tenant_id: data.tenantId,
      event_type: data.eventType,
      aggregate_type: data.aggregateType,
      aggregate_id: data.aggregateId,
      payload: data.payload,
      actor_id: data.actorId || null,
      actor_role: data.actorRole || null,
      node_id: data.nodeId || null,
      channel: data.channel || null,
      correlation_id: data.correlationId || null,
      causation_id: data.causationId || null,
      status: "pending",
      retry_count: 0,
    })
  }

  async listPendingEvents(tenantId?: string, limit?: number) {
    const filters: Record<string, any> = { status: "pending" }
    if (tenantId) {
      filters.tenant_id = tenantId
    }

    const events = await this.listEventOutboxes(
      filters,
      { take: limit || 100 }
    ) as any

    return Array.isArray(events) ? events : [events].filter(Boolean)
  }

  async markPublished(eventId: string) {
    return await (this as any).updateEventOutboxs({
      id: eventId,
      status: "published",
      published_at: new Date(),
    })
  }

  async markFailed(eventId: string, error: string) {
    const event = await this.retrieveEventOutbox(eventId) as any
    const retryCount = (event?.retry_count || 0) + 1

    return await (this as any).updateEventOutboxs({
      id: eventId,
      status: "failed",
      error,
      retry_count: retryCount,
    })
  }

  buildEnvelope(event: any) {
    return {
      headers: {
        id: event.id,
        type: event.event_type,
        source: event.source || "commerce",
        tenant_id: event.tenant_id,
        aggregate_type: event.aggregate_type,
        aggregate_id: event.aggregate_id,
        correlation_id: event.correlation_id,
        causation_id: event.causation_id,
        timestamp: event.created_at || new Date().toISOString(),
        actor: {
          id: event.actor_id,
          role: event.actor_role,
        },
        node_id: event.node_id,
        channel: event.channel,
      },
      payload: event.payload,
      metadata: event.metadata,
    }
  }
}

export default EventModuleService
