// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import Payout from "./models/payout.js"
import PayoutTransactionLink from "./models/payout-transaction-link.js"

class PayoutModuleService extends MedusaService({
  Payout,
  PayoutTransactionLink,
}) {
  private stripe: any = null
  
  private getStripe() {
    if (!this.stripe) {
      const Stripe = require("stripe")
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
        apiVersion: "2023-10-16"
      })
    }
    return this.stripe
  }
  
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
    const payout = await (this as any).createPayouts({
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
      payment_method: paymentMethod as any,
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

  // Process Stripe Connect payout - FULL IMPLEMENTATION
  async processStripeConnectPayout(payoutId: string, stripeAccountId: string) {
    const stripe = this.getStripe()
    const payout = await this.retrievePayouts(payoutId)
    
    if (!payout) {
      throw new Error(`Payout ${payoutId} not found`)
    }
    
    if (!stripeAccountId) {
      throw new Error(`No Stripe account ID provided for payout ${payoutId}`)
    }

    try {
      // Update status to processing
      await (this as any).updatePayouts({
        id: payoutId,
        status: "processing",
        processing_started_at: new Date(),
      })

      // Create transfer to connected account
      const transfer = await stripe.transfers.create({
        amount: Math.round(Number(payout.net_amount) * 100), // Convert to cents
        currency: "usd",
        destination: stripeAccountId,
        transfer_group: payout.payout_number,
        metadata: {
          payout_id: payoutId,
          payout_number: payout.payout_number,
          vendor_id: payout.vendor_id,
          period_start: payout.period_start?.toISOString(),
          period_end: payout.period_end?.toISOString(),
        }
      })

      // Update payout with Stripe details
      const updatedPayout = await (this as any).updatePayouts({
        id: payoutId,
        status: "completed",
        stripe_transfer_id: transfer.id,
        processing_completed_at: new Date(),
      })

      console.log(`[Payout] Completed transfer ${transfer.id} for payout ${payoutId}`)
      
      return updatedPayout
    } catch (error: any) {
      console.error(`[Payout] Failed for ${payoutId}:`, error)
      
      // Update payout with failure details
      await (this as any).updatePayouts({
        id: payoutId,
        status: "failed",
        stripe_failure_code: error.code || "unknown",
        stripe_failure_message: error.message,
        processing_failed_at: new Date(),
        failure_reason: error.message,
        retry_count: (payout.retry_count || 0) + 1,
        last_retry_at: new Date(),
      })

      throw error
    }
  }

  // Create Stripe Connect account for vendor
  async createStripeConnectAccount(vendorId: string, email: string, country: string = "US") {
    const stripe = this.getStripe()
    
    try {
      const account = await stripe.accounts.create({
        type: "express",
        country,
        email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        metadata: {
          vendor_id: vendorId
        }
      })

      console.log(`[Stripe Connect] Created account ${account.id} for vendor ${vendorId}`)
      
      return account
    } catch (error: any) {
      console.error(`[Stripe Connect] Failed to create account for vendor ${vendorId}:`, error)
      throw error
    }
  }

  // Get Stripe Connect onboarding link
  async getStripeConnectOnboardingLink(stripeAccountId: string, returnUrl: string, refreshUrl: string) {
    const stripe = this.getStripe()
    
    try {
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: "account_onboarding",
      })

      return accountLink.url
    } catch (error: any) {
      console.error(`[Stripe Connect] Failed to create onboarding link:`, error)
      throw error
    }
  }

  // Get Stripe Connect dashboard link
  async getStripeConnectDashboardLink(stripeAccountId: string) {
    const stripe = this.getStripe()
    
    try {
      const loginLink = await stripe.accounts.createLoginLink(stripeAccountId)
      return loginLink.url
    } catch (error: any) {
      console.error(`[Stripe Connect] Failed to create dashboard link:`, error)
      throw error
    }
  }

  // Check Stripe account status
  async checkStripeAccountStatus(stripeAccountId: string) {
    const stripe = this.getStripe()
    
    try {
      const account = await stripe.accounts.retrieve(stripeAccountId)
      
      return {
        id: account.id,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
        requirements: account.requirements,
        capabilities: account.capabilities,
      }
    } catch (error: any) {
      console.error(`[Stripe Connect] Failed to check account status:`, error)
      throw error
    }
  }

  // Get vendor balance
  async getVendorBalance(vendorId: string) {
    // Get all completed payouts for vendor
    const { data: payouts } = await (this as any).listPayouts({
      filters: {
        vendor_id: vendorId,
        status: "completed"
      }
    })

    const totalPaidOut = payouts.reduce((sum: number, p: any) => sum + Number(p.net_amount), 0)

    // Get pending payouts
    const { data: pendingPayouts } = await (this as any).listPayouts({
      filters: {
        vendor_id: vendorId,
        status: { $in: ["pending", "processing"] }
      }
    })

    const pendingAmount = pendingPayouts.reduce((sum: number, p: any) => sum + Number(p.net_amount), 0)

    return {
      total_paid_out: totalPaidOut,
      pending_amount: pendingAmount,
      last_payout: payouts[0] || null,
    }
  }

  // Retry failed payout
  async retryFailedPayout(payoutId: string, stripeAccountId: string) {
    const payout = await this.retrievePayouts(payoutId)
    
    if (!payout) {
      throw new Error(`Payout ${payoutId} not found`)
    }

    if (payout.status !== "failed") {
      throw new Error(`Payout ${payoutId} is not in failed status`)
    }

    if ((payout.retry_count || 0) >= 3) {
      throw new Error(`Payout ${payoutId} has exceeded maximum retry attempts`)
    }

    // Reset status and retry
    await (this as any).updatePayouts({
      id: payoutId,
      status: "pending",
      stripe_failure_code: null,
      stripe_failure_message: null,
      failure_reason: null,
    })

    return this.processStripeConnectPayout(payoutId, stripeAccountId)
  }

  // Cancel pending payout
  async cancelPayout(payoutId: string, reason: string) {
    const payout = await this.retrievePayouts(payoutId)
    
    if (!payout) {
      throw new Error(`Payout ${payoutId} not found`)
    }

    if (!["pending", "on_hold"].includes(payout.status)) {
      throw new Error(`Cannot cancel payout in ${payout.status} status`)
    }

    return (this as any).updatePayouts({
      id: payoutId,
      status: "cancelled",
      failure_reason: reason,
      notes: `Cancelled: ${reason}`,
    })
  }

  // Put payout on hold
  async holdPayout(payoutId: string, reason: string) {
    const payout = await this.retrievePayouts(payoutId)
    
    if (!payout) {
      throw new Error(`Payout ${payoutId} not found`)
    }

    if (payout.status !== "pending") {
      throw new Error(`Can only hold pending payouts`)
    }

    return (this as any).updatePayouts({
      id: payoutId,
      status: "on_hold",
      notes: `On hold: ${reason}`,
    })
  }
}

export default PayoutModuleService
