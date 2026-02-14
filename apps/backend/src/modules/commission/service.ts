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
    let commissionFlat: number | null = null

    // Calculate based on commission type
    switch (rule.commission_type) {
      case "percentage":
        commissionRate = rule.commission_percentage || 0
        commissionAmount = Math.round((orderTotal * commissionRate) / 100)
        break
        
      case "flat":
        commissionFlat = Number(rule.commission_flat_amount || 0)
        commissionAmount = commissionFlat
        break
        
      case "tiered_percentage":
        // Find applicable tier
        const tiers = (rule.tiers as unknown as Array<{ min_amount: number; max_amount: number; rate: number }>) || []
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
    const calculation = await this.calculateCommission({
      ...data,
      lineItemId: data.lineItemId || "",
    })

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

  // Get vendor commission summary with aggregated amounts by status
  async getVendorCommissionSummary({
    vendorId,
    tenantId,
    startDate,
    endDate,
  }: {
    vendorId: string
    tenantId: string
    startDate?: Date
    endDate?: Date
  }) {
    const filters: any = {
      vendor_id: vendorId,
      tenant_id: tenantId,
      transaction_type: "sale",
    }

    if (startDate || endDate) {
      filters.transaction_date = {}
      if (startDate) {
        filters.transaction_date.$gte = startDate
      }
      if (endDate) {
        filters.transaction_date.$lte = endDate
      }
    }

    const transactions = await this.listCommissionTransactions({
      filters,
      config: {
        select: ["id", "commission_amount", "status", "payout_status", "transaction_date"],
      }
    })

    let totalEarned = 0
    let totalPending = 0
    let totalPaid = 0

    transactions.forEach((transaction) => {
      const amount = Number(transaction.commission_amount || 0)
      totalEarned += amount

      if (transaction.payout_status === "paid") {
        totalPaid += amount
      } else if (transaction.status === "pending") {
        totalPending += amount
      }
    })

    return {
      total_earned: totalEarned,
      total_pending: totalPending,
      total_paid: totalPaid,
      transaction_count: transactions.length,
    }
  }

  // Process commission payout for given transaction IDs
  async processCommissionPayout(transactionIds: string[]) {
    const now = new Date()

    const transactions = await this.listCommissionTransactions({
      filters: {
        id: { $in: transactionIds }
      },
      config: {
        select: ["id"],
      }
    })

    if (transactions.length === 0) {
      return { processed_count: 0 }
    }

    await this.updateCommissionTransactions(
      transactionIds,
      {
        payout_status: "paid",
        payout_date: now,
      }
    )

    return { processed_count: transactions.length }
  }

  // Get all commission rules for a tenant sorted by priority
  async getCommissionRulesByTenant({
    tenantId,
    status,
  }: {
    tenantId: string
    status?: "active" | "inactive"
  }) {
    const filters: any = {
      tenant_id: tenantId,
    }

    if (status) {
      filters.status = status
    }

    return await this.listCommissionRules({
      filters,
      config: {
        order: { priority: "DESC" }
      }
    })
  }

  // Adjust commission for a transaction
  async adjustCommission({
    transactionId,
    adjustmentAmount,
    reason,
  }: {
    transactionId: string
    adjustmentAmount: number
    reason: string
  }) {
    // Find the original transaction
    const transactions = await this.listCommissionTransactions({
      filters: {
        id: transactionId,
      },
      config: {
        select: ["id", "vendor_id", "tenant_id", "order_id", "line_item_id", "commission_amount", "net_amount", "order_total"],
      }
    })

    const originalTransaction = transactions[0]
    if (!originalTransaction) {
      throw new Error(`Commission transaction ${transactionId} not found`)
    }

    // Update original transaction with adjusted amounts
    const newCommissionAmount = Number(originalTransaction.commission_amount || 0) + adjustmentAmount
    const newNetAmount = Number(originalTransaction.order_total || 0) - newCommissionAmount

    await this.updateCommissionTransactions(
      [transactionId],
      {
        commission_amount: newCommissionAmount,
        net_amount: newNetAmount,
      }
    )

    // Create adjustment transaction
    const adjustmentTransaction = await this.createCommissionTransactions({
      vendor_id: originalTransaction.vendor_id,
      tenant_id: originalTransaction.tenant_id,
      order_id: originalTransaction.order_id,
      line_item_id: originalTransaction.line_item_id,
      commission_amount: adjustmentAmount,
      net_amount: -adjustmentAmount,
      transaction_type: "adjustment",
      status: "completed",
      payout_status: "unpaid",
      transaction_date: new Date(),
      order_subtotal: 0,
      order_total: 0,
      commission_rate: 0,
      commission_flat: null,
    } as any)

    return {
      original_transaction: originalTransaction,
      adjustment_transaction: adjustmentTransaction,
    }
  }

  // Get top earning vendors for a tenant
  async getTopEarningVendors({
    tenantId,
    limit = 10,
    startDate,
    endDate,
  }: {
    tenantId: string
    limit?: number
    startDate?: Date
    endDate?: Date
  }) {
    const filters: any = {
      tenant_id: tenantId,
      transaction_type: "sale",
    }

    if (startDate || endDate) {
      filters.transaction_date = {}
      if (startDate) {
        filters.transaction_date.$gte = startDate
      }
      if (endDate) {
        filters.transaction_date.$lte = endDate
      }
    }

    const transactions = await this.listCommissionTransactions({
      filters,
      config: {
        select: ["vendor_id", "commission_amount"],
      }
    })

    // Group by vendor_id and aggregate
    const vendorMap = new Map<string, { total_commission: number; transaction_count: number }>()

    transactions.forEach((transaction) => {
      const vendorId = transaction.vendor_id
      const amount = Number(transaction.commission_amount || 0)

      if (!vendorMap.has(vendorId)) {
        vendorMap.set(vendorId, { total_commission: 0, transaction_count: 0 })
      }

      const vendorData = vendorMap.get(vendorId)!
      vendorData.total_commission += amount
      vendorData.transaction_count += 1
    })

    // Convert to array and sort by total_commission DESC
    const vendors = Array.from(vendorMap.entries())
      .map(([vendor_id, data]) => ({
        vendor_id,
        ...data,
      }))
      .sort((a, b) => b.total_commission - a.total_commission)
      .slice(0, limit)

    return vendors
  }
}

export default CommissionModuleService
