// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import Dispute from "./models/dispute"
import DisputeMessage from "./models/dispute-message"

class DisputeModuleService extends MedusaService({
  Dispute,
  DisputeMessage,
}) {
  async openDispute(data: {
    orderId: string
    customerId: string
    vendorId?: string
    tenantId: string
    type: string
    priority?: string
    description: string
    attachments?: any[]
    metadata?: Record<string, unknown>
  }) {
    const existingDisputes = await this.listDisputes({
      order_id: data.orderId,
      customer_id: data.customerId,
      status: ["open", "under_review", "awaiting_customer", "awaiting_vendor", "escalated"],
    })

    const list = Array.isArray(existingDisputes) ? existingDisputes : [existingDisputes].filter(Boolean)
    if (list.length > 0) {
      throw new Error("An active dispute already exists for this order")
    }

    const dispute = await (this as any).createDisputes({
      order_id: data.orderId,
      customer_id: data.customerId,
      vendor_id: data.vendorId || null,
      tenant_id: data.tenantId,
      type: data.type,
      status: "open",
      priority: data.priority || "medium",
      metadata: data.metadata || null,
    })

    await (this as any).createDisputeMessages({
      dispute_id: dispute.id,
      sender_type: "customer",
      sender_id: data.customerId,
      content: data.description,
      attachments: data.attachments || null,
      is_internal: false,
    })

    return dispute
  }

  async addMessage(data: {
    disputeId: string
    senderType: string
    senderId: string
    content: string
    attachments?: any[]
    isInternal?: boolean
    metadata?: Record<string, unknown>
  }) {
    const dispute = await this.retrieveDispute(data.disputeId)

    if (["resolved", "closed"].includes(dispute.status)) {
      throw new Error("Cannot add messages to a resolved or closed dispute")
    }

    const message = await (this as any).createDisputeMessages({
      dispute_id: data.disputeId,
      sender_type: data.senderType,
      sender_id: data.senderId,
      content: data.content,
      attachments: data.attachments || null,
      is_internal: data.isInternal || false,
      metadata: data.metadata || null,
    })

    if (data.senderType === "admin" || data.senderType === "system") {
      if (dispute.status === "open") {
        await (this as any).updateDisputes({
          id: data.disputeId,
          status: "under_review",
        })
      }
    } else if (data.senderType === "customer" && dispute.status === "awaiting_customer") {
      await (this as any).updateDisputes({
        id: data.disputeId,
        status: "under_review",
      })
    } else if (data.senderType === "vendor" && dispute.status === "awaiting_vendor") {
      await (this as any).updateDisputes({
        id: data.disputeId,
        status: "under_review",
      })
    }

    return message
  }

  async escalate(disputeId: string, reason?: string) {
    const dispute = await this.retrieveDispute(disputeId)

    if (["resolved", "closed", "escalated"].includes(dispute.status)) {
      throw new Error("Dispute cannot be escalated from current status")
    }

    await (this as any).updateDisputes({
      id: disputeId,
      status: "escalated",
      priority: "urgent",
      escalated_at: new Date(),
    })

    if (reason) {
      await (this as any).createDisputeMessages({
        dispute_id: disputeId,
        sender_type: "system",
        sender_id: "system",
        content: `Dispute escalated: ${reason}`,
        is_internal: true,
      })
    }

    return await this.retrieveDispute(disputeId)
  }

  async resolve(data: {
    disputeId: string
    resolution: string
    resolutionAmount?: number
    resolvedBy: string
    notes?: string
  }) {
    const dispute = await this.retrieveDispute(data.disputeId)

    if (["resolved", "closed"].includes(dispute.status)) {
      throw new Error("Dispute is already resolved or closed")
    }

    await (this as any).updateDisputes({
      id: data.disputeId,
      status: "resolved",
      resolution: data.resolution,
      resolution_amount: data.resolutionAmount || null,
      resolved_by: data.resolvedBy,
      resolved_at: new Date(),
    })

    if (data.notes) {
      await (this as any).createDisputeMessages({
        dispute_id: data.disputeId,
        sender_type: "admin",
        sender_id: data.resolvedBy,
        content: `Resolution: ${data.resolution}. ${data.notes}`,
        is_internal: false,
      })
    }

    return await this.retrieveDispute(data.disputeId)
  }

  async getByOrder(orderId: string) {
    const disputes = await this.listDisputes({ order_id: orderId })
    return Array.isArray(disputes) ? disputes : [disputes].filter(Boolean)
  }

  async getByCustomer(customerId: string, options?: { status?: string; limit?: number; offset?: number }) {
    const filters: Record<string, any> = { customer_id: customerId }
    if (options?.status) {
      filters.status = options.status
    }

    const disputes = await this.listDisputes(filters, {
      take: options?.limit || 20,
      skip: options?.offset || 0,
      order: { created_at: "DESC" },
    })

    return Array.isArray(disputes) ? disputes : [disputes].filter(Boolean)
  }

  async getMessages(disputeId: string, includeInternal: boolean = false) {
    const filters: Record<string, any> = { dispute_id: disputeId }
    if (!includeInternal) {
      filters.is_internal = false
    }

    const messages = await this.listDisputeMessages(filters, {
      order: { created_at: "ASC" },
    })

    return Array.isArray(messages) ? messages : [messages].filter(Boolean)
  }
  async escalateDispute(disputeId: string, escalationType: string, notes: string): Promise<any> {
    if (!escalationType) {
      throw new Error("Escalation type is required")
    }
    const validTypes = ["manager", "legal", "executive", "external"]
    if (!validTypes.includes(escalationType)) {
      throw new Error(`Escalation type must be one of: ${validTypes.join(", ")}`)
    }

    const dispute = await this.retrieveDispute(disputeId)
    if (["resolved", "closed"].includes(dispute.status)) {
      throw new Error("Cannot escalate a resolved or closed dispute")
    }

    await (this as any).updateDisputes({
      id: disputeId,
      status: "escalated",
      priority: "urgent",
      escalated_at: new Date(),
      escalation_type: escalationType,
    })

    if (notes) {
      await (this as any).createDisputeMessages({
        dispute_id: disputeId,
        sender_type: "system",
        sender_id: "system",
        content: `Escalated to ${escalationType}: ${notes}`,
        is_internal: true,
      })
    }

    return await this.retrieveDispute(disputeId)
  }

  async resolveDispute(disputeId: string, resolution: string, refundAmount?: number): Promise<any> {
    if (!resolution || !resolution.trim()) {
      throw new Error("Resolution description is required")
    }

    const dispute = await this.retrieveDispute(disputeId)
    if (["resolved", "closed"].includes(dispute.status)) {
      throw new Error("Dispute is already resolved or closed")
    }

    if (refundAmount !== undefined && refundAmount < 0) {
      throw new Error("Refund amount cannot be negative")
    }

    await (this as any).updateDisputes({
      id: disputeId,
      status: "resolved",
      resolution: resolution.trim(),
      resolution_amount: refundAmount || null,
      resolved_by: "admin",
      resolved_at: new Date(),
    })

    await (this as any).createDisputeMessages({
      dispute_id: disputeId,
      sender_type: "admin",
      sender_id: "admin",
      content: `Dispute resolved: ${resolution}${refundAmount ? `. Refund: $${(refundAmount / 100).toFixed(2)}` : ""}`,
      is_internal: false,
    })

    return await this.retrieveDispute(disputeId)
  }

  /** Get full dispute timeline including status changes and messages */
  async getDisputeTimeline(disputeId: string): Promise<{
    dispute: any
    messages: any[]
    events: Array<{ type: string; timestamp: Date; detail: string }>
  }> {
    const dispute = await this.retrieveDispute(disputeId)
    const messages = await this.getMessages(disputeId, true)

    const events: Array<{ type: string; timestamp: Date; detail: string }> = []

    events.push({ type: "opened", timestamp: new Date(dispute.created_at), detail: `Dispute opened with priority ${dispute.priority}` })

    if (dispute.escalated_at) {
      events.push({ type: "escalated", timestamp: new Date(dispute.escalated_at), detail: "Dispute escalated to urgent priority" })
    }
    if (dispute.resolved_at) {
      events.push({ type: "resolved", timestamp: new Date(dispute.resolved_at), detail: `Resolved: ${dispute.resolution || "N/A"}` })
    }

    for (const msg of messages) {
      events.push({ type: "message", timestamp: new Date(msg.created_at), detail: `${msg.sender_type}: ${msg.content?.substring(0, 100)}` })
    }

    events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    return { dispute, messages, events }
  }
}

export default DisputeModuleService
