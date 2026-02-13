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
}

export default DisputeModuleService
