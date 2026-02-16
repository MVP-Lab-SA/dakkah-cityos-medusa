// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import TradeInRequest from "./models/trade-in-request"
import TradeInOffer from "./models/trade-in-offer"

class TradeInModuleService extends MedusaService({
  TradeInRequest,
  TradeInOffer,
}) {
  async submitTradeIn(data: {
    customerId: string
    productId: string
    condition: string
    description: string
    photos?: string[]
    metadata?: Record<string, unknown>
  }): Promise<any> {
    const validConditions = ["excellent", "good", "fair", "poor"]
    if (!validConditions.includes(data.condition)) {
      throw new Error(`Condition must be one of: ${validConditions.join(", ")}`)
    }

    if (!data.description || !data.description.trim()) {
      throw new Error("Description is required")
    }

    const tradeIn = await (this as any).createTradeInRequests({
      customer_id: data.customerId,
      product_id: data.productId,
      condition: data.condition,
      description: data.description.trim(),
      photos: data.photos || [],
      status: "submitted",
      submitted_at: new Date(),
      trade_in_number: `TI-${Date.now().toString(36).toUpperCase()}`,
      metadata: data.metadata || null,
    })

    return tradeIn
  }

  async evaluateTradeIn(tradeInId: string, estimatedValue: number, notes?: string): Promise<any> {
    if (estimatedValue < 0) {
      throw new Error("Estimated value cannot be negative")
    }

    const tradeIn = await this.retrieveTradeInRequest(tradeInId)

    if (tradeIn.status !== "submitted") {
      throw new Error("Trade-in is not in submitted status")
    }

    const updated = await (this as any).updateTradeInRequests({
      id: tradeInId,
      status: "evaluated",
      estimated_value: estimatedValue,
      evaluation_notes: notes || null,
      evaluated_at: new Date(),
    })

    return updated
  }

  async approveTradeIn(tradeInId: string, finalValue: number): Promise<any> {
    if (finalValue < 0) {
      throw new Error("Final value cannot be negative")
    }

    const tradeIn = await this.retrieveTradeInRequest(tradeInId)

    if (tradeIn.status !== "evaluated") {
      throw new Error("Trade-in must be evaluated before approval")
    }

    const updated = await (this as any).updateTradeInRequests({
      id: tradeInId,
      status: "approved",
      final_value: finalValue,
      approved_at: new Date(),
    })

    return updated
  }

  async rejectTradeIn(tradeInId: string, reason: string): Promise<any> {
    const tradeIn = await this.retrieveTradeInRequest(tradeInId)

    if (!["submitted", "evaluated"].includes(tradeIn.status)) {
      throw new Error("Trade-in cannot be rejected from current status")
    }

    const updated = await (this as any).updateTradeInRequests({
      id: tradeInId,
      status: "rejected",
      rejection_reason: reason,
      rejected_at: new Date(),
    })

    return updated
  }

  async completeTradeIn(tradeInId: string, creditAmount: number): Promise<any> {
    const tradeIn = await this.retrieveTradeInRequest(tradeInId)

    if (tradeIn.status !== "approved") {
      throw new Error("Trade-in must be approved before completion")
    }

    const updated = await (this as any).updateTradeInRequests({
      id: tradeInId,
      status: "completed",
      credit_amount: creditAmount,
      completed_at: new Date(),
    })

    return updated
  }

  async getCustomerTradeIns(customerId: string): Promise<any[]> {
    const tradeIns = await this.listTradeInRequests({ customer_id: customerId })
    return Array.isArray(tradeIns) ? tradeIns : [tradeIns].filter(Boolean)
  }
}

export default TradeInModuleService
