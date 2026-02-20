import { MedusaService } from "@medusajs/framework/utils";
import TradeInRequest from "./models/trade-in-request";
import TradeInOffer from "./models/trade-in-offer";

type TradeInRequestRecord = {
  id: string;
  customer_id: string;
  product_id: string;
  condition: string;
  description: string;
  photos: string[];
  status: string;
  submitted_at: Date;
  trade_in_number: string;
  estimated_value?: number | null;
  evaluation_notes?: string | null;
  evaluated_at?: Date | null;
  final_value?: number | null;
  approved_at?: Date | null;
  rejection_reason?: string | null;
  rejected_at?: Date | null;
  credit_amount?: number | null;
  completed_at?: Date | null;
  metadata: Record<string, unknown> | null;
};

interface TradeInServiceBase {
  createTradeInRequests(
    data: Record<string, unknown>,
  ): Promise<TradeInRequestRecord>;
  updateTradeInRequests(
    data: { id: string } & Record<string, unknown>,
  ): Promise<TradeInRequestRecord>;
  retrieveTradeInRequest(id: string): Promise<TradeInRequestRecord>;
  listTradeInRequests(
    filters: Record<string, unknown>,
  ): Promise<TradeInRequestRecord[]>;
}

class TradeInModuleService extends MedusaService({
  TradeInRequest,
  TradeInOffer,
}) {
  async submitTradeIn(data: {
    customerId: string;
    productId: string;
    condition: string;
    description: string;
    photos?: string[];
    metadata?: Record<string, unknown>;
  }): Promise<TradeInRequestRecord> {
    const validConditions = ["excellent", "good", "fair", "poor"];
    if (!validConditions.includes(data.condition)) {
      throw new Error(
        `Condition must be one of: ${validConditions.join(", ")}`,
      );
    }

    if (!data.description || !data.description.trim()) {
      throw new Error("Description is required");
    }

    return (this as unknown as TradeInServiceBase).createTradeInRequests({
      customer_id: data.customerId,
      product_id: data.productId,
      condition: data.condition,
      description: data.description.trim(),
      photos: data.photos ?? [],
      status: "submitted",
      submitted_at: new Date(),
      trade_in_number: `TI-${Date.now().toString(36).toUpperCase()}`,
      metadata: data.metadata ?? null,
    });
  }

  async evaluateTradeIn(
    tradeInId: string,
    estimatedValue: number,
    notes?: string,
  ): Promise<TradeInRequestRecord> {
    if (estimatedValue < 0)
      throw new Error("Estimated value cannot be negative");

    const svc = this as unknown as TradeInServiceBase;
    const tradeIn = await svc.retrieveTradeInRequest(tradeInId);

    if (tradeIn.status !== "submitted") {
      throw new Error("Trade-in is not in submitted status");
    }

    return svc.updateTradeInRequests({
      id: tradeInId,
      status: "evaluated",
      estimated_value: estimatedValue,
      evaluation_notes: notes ?? null,
      evaluated_at: new Date(),
    });
  }

  async approveTradeIn(
    tradeInId: string,
    finalValue: number,
  ): Promise<TradeInRequestRecord> {
    if (finalValue < 0) throw new Error("Final value cannot be negative");

    const svc = this as unknown as TradeInServiceBase;
    const tradeIn = await svc.retrieveTradeInRequest(tradeInId);

    if (tradeIn.status !== "evaluated") {
      throw new Error("Trade-in must be evaluated before approval");
    }

    return svc.updateTradeInRequests({
      id: tradeInId,
      status: "approved",
      final_value: finalValue,
      approved_at: new Date(),
    });
  }

  async rejectTradeIn(
    tradeInId: string,
    reason: string,
  ): Promise<TradeInRequestRecord> {
    const svc = this as unknown as TradeInServiceBase;
    const tradeIn = await svc.retrieveTradeInRequest(tradeInId);

    if (!["submitted", "evaluated"].includes(tradeIn.status)) {
      throw new Error("Trade-in cannot be rejected from current status");
    }

    return svc.updateTradeInRequests({
      id: tradeInId,
      status: "rejected",
      rejection_reason: reason,
      rejected_at: new Date(),
    });
  }

  async completeTradeIn(
    tradeInId: string,
    creditAmount: number,
  ): Promise<TradeInRequestRecord> {
    const svc = this as unknown as TradeInServiceBase;
    const tradeIn = await svc.retrieveTradeInRequest(tradeInId);

    if (tradeIn.status !== "approved") {
      throw new Error("Trade-in must be approved before completion");
    }

    return svc.updateTradeInRequests({
      id: tradeInId,
      status: "completed",
      credit_amount: creditAmount,
      completed_at: new Date(),
    });
  }

  async getCustomerTradeIns(
    customerId: string,
  ): Promise<TradeInRequestRecord[]> {
    return (this as unknown as TradeInServiceBase).listTradeInRequests({
      customer_id: customerId,
    });
  }
}

export default TradeInModuleService;
