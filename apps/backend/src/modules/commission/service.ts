import { MedusaService } from "@medusajs/framework/utils"
import CommissionRule from "./models/commission-rule"
import CommissionTransaction from "./models/commission-transaction"

class CommissionModuleService extends MedusaService({
  CommissionRule,
  CommissionTransaction,
}) {
  // Calculate commission for a line item
  async calculateCommission({
    vendorId,
    orderId,
    lineItemId,
    orderSubtotal,
    orderTotal,
    tenantId,
    storeId,
  }: {
    vendorId: string
    orderId: string
    lineItemId: string
    orderSubtotal: number
    orderTotal: number
    tenantId: string
    storeId?: string | null
  }) {
    // Find applicable commission rule (highest priority)
    const rules = await this.listCommissionRules({
      filters: {
        $or: [
          { vendor_id: vendorId },
          { vendor_id: null }
        ],
        tenant_id: tenantId,
        status: "active",
      },
      config: {
        relations: [],
        select: ["id", "commission_type", "commission_percentage", "commission_flat_amount", "priority", "tiers"],
        take: 1,
        order: { priority: "DESC" }
      }
    })

    const rule = rules[0]
    
    if (!rule) {
      throw new Error(`No commission rule found for vendor ${vendorId}`)
    }

    let commissionAmount = 0
    let commissionRate = 0
    let commissionFlat = null

    // Calculate based on commission type
    switch (rule.commission_type) {
      case "percentage":
        commissionRate = rule.commission_percentage || 0
        commissionAmount = Math.round((orderTotal * commissionRate) / 100)
        break
        
      case "flat":
        commissionFlat = rule.commission_flat_amount || 0
        commissionAmount = commissionFlat
        break
        
      case "tiered_percentage":
        // Find applicable tier
        const tiers = rule.tiers as Array<{ min_amount: number; max_amount: number; rate: number }> || []
        const tier = tiers.find(t => orderTotal >= t.min_amount && orderTotal <= t.max_amount)
        if (tier) {
          commissionRate = tier.rate
          commissionAmount = Math.round((orderTotal * commissionRate) / 100)
        }
        break
        
      default:
        commissionRate = rule.commission_percentage || 0
        commissionAmount = Math.round((orderTotal * commissionRate) / 100)
    }

    const netAmount = orderTotal - commissionAmount

    return {
      commissionAmount,
      commissionRate,
      commissionFlat,
      netAmount,
      ruleId: rule.id,
    }
  }

  // Create commission transaction
  async createCommissionTransaction(data: {
    vendorId: string
    orderId: string
    lineItemId?: string
    orderSubtotal: number
    orderTotal: number
    tenantId: string
    storeId?: string | null
  }) {
    const calculation = await this.calculateCommission(data)

    return await this.createCommissionTransactions({
      tenant_id: data.tenantId,
      store_id: data.storeId,
      vendor_id: data.vendorId,
      order_id: data.orderId,
      line_item_id: data.lineItemId,
      commission_rule_id: calculation.ruleId,
      order_subtotal: data.orderSubtotal,
      order_total: data.orderTotal,
      commission_rate: calculation.commissionRate,
      commission_flat: calculation.commissionFlat,
      commission_amount: calculation.commissionAmount,
      net_amount: calculation.netAmount,
      transaction_date: new Date(),
      transaction_type: "sale",
      status: "pending",
      payout_status: "unpaid",
    })
  }
}

export default CommissionModuleService
