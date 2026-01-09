import { MedusaService } from "@medusajs/framework/utils"
import Payout from "./models/payout"
import PayoutTransactionLink from "./models/payout-transaction-link"

class PayoutModuleService extends MedusaService({
  Payout,
  PayoutTransactionLink,
}) {
  // Generate payout number
  private generatePayoutNumber(): string {
    const date = new Date()
    const year = date.getFullYear()
    const timestamp = Date.now().toString().slice(-6)
    return `PO-${year}-${timestamp}`
  }

  // Create payout for vendor
  async createVendorPayout({
    vendorId,
    tenantId,
    storeId,
    periodStart,
    periodEnd,
    transactionIds,
    grossAmount,
    commissionAmount,
    platformFeeAmount = 0,
    adjustmentAmount = 0,
    paymentMethod,
    scheduledFor,
  }: {
    vendorId: string
    tenantId: string
    storeId?: string | null
    periodStart: Date
    periodEnd: Date
    transactionIds: string[]
    grossAmount: number
    commissionAmount: number
    platformFeeAmount?: number
    adjustmentAmount?: number
    paymentMethod: string
    scheduledFor?: Date | null
  }) {
    const netAmount = grossAmount - commissionAmount - platformFeeAmount + adjustmentAmount

    // Create payout
    const payout = await this.createPayouts({
      payout_number: this.generatePayoutNumber(),
      tenant_id: tenantId,
      store_id: storeId,
      vendor_id: vendorId,
      gross_amount: grossAmount,
      commission_amount: commissionAmount,
      platform_fee_amount: platformFeeAmount,
      adjustment_amount: adjustmentAmount,
      net_amount: netAmount,
      period_start: periodStart,
      period_end: periodEnd,
      transaction_count: transactionIds.length,
      payment_method: paymentMethod,
      status: scheduledFor ? "pending" : "processing",
      scheduled_for: scheduledFor,
    })

    // Link transactions
    const links = transactionIds.map(txId => ({
      payout_id: payout.id,
      commission_transaction_id: txId,
      amount: netAmount, // Simplified - in real scenario would be per-transaction
    }))

    await this.createPayoutTransactionLinks(links)

    return payout
  }

  // Process Stripe Connect payout
  async processStripeConnectPayout(payoutId: string) {
    const payout = await this.retrievePayout(payoutId)
    
    if (!payout) {
      throw new Error(`Payout ${payoutId} not found`)
    }

    // Here we would integrate with Stripe Connect
    // For now, mark as processing
    return await this.updatePayouts({
      id: payoutId,
      status: "processing",
      processing_started_at: new Date(),
    })
  }
}

export default PayoutModuleService
