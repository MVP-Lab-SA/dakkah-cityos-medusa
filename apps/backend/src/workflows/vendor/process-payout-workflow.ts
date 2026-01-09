import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { createStep } from "@medusajs/framework/workflows-sdk"

// Step: Get unpaid transactions for vendor
const getUnpaidTransactionsStep = createStep(
  "get-unpaid-transactions-step",
  async (
    input: {
      vendorId: string
      tenantId: string
      storeId?: string | null
      periodStart: Date
      periodEnd: Date
    },
    { container }
  ) => {
    const commissionModule = container.resolve("commission")

    const transactions = await commissionModule.listCommissionTransactions({
      filters: {
        vendor_id: input.vendorId,
        tenant_id: input.tenantId,
        payout_status: "unpaid",
        status: "approved",
        transaction_date: {
          $gte: input.periodStart,
          $lte: input.periodEnd,
        }
      },
    })

    // Calculate totals
    const grossAmount = transactions.reduce((sum, tx) => sum + Number(tx.order_total), 0)
    const commissionAmount = transactions.reduce((sum, tx) => sum + Number(tx.commission_amount), 0)
    const platformFeeAmount = transactions.reduce((sum, tx) => sum + Number(tx.platform_fee_amount || 0), 0)

    return {
      transactions,
      grossAmount,
      commissionAmount,
      platformFeeAmount,
    }
  }
)

// Step: Create payout
const createPayoutStep = createStep(
  "create-payout-step",
  async (
    input: {
      vendorId: string
      tenantId: string
      storeId?: string | null
      periodStart: Date
      periodEnd: Date
      transactionIds: string[]
      grossAmount: number
      commissionAmount: number
      platformFeeAmount: number
      paymentMethod: string
    },
    { container }
  ) => {
    const payoutModule = container.resolve("payout")

    const payout = await payoutModule.createVendorPayout(input)

    return { payout }
  },
  async ({ payout }, { container }) => {
    const payoutModule = container.resolve("payout")
    await payoutModule.deletePayouts(payout.id)
  }
)

// Step: Mark transactions as paid
const markTransactionsPaidStep = createStep(
  "mark-transactions-paid-step",
  async (
    input: {
      transactionIds: string[]
      payoutId: string
    },
    { container }
  ) => {
    const commissionModule = container.resolve("commission")

    await commissionModule.updateCommissionTransactions(
      input.transactionIds.map(id => ({
        id,
        payout_id: input.payoutId,
        payout_status: "pending_payout",
        paid_at: new Date(),
      }))
    )

    return { updated: true }
  },
  async (input: { transactionIds: string[] }, { container }) => {
    const commissionModule = container.resolve("commission")
    
    await commissionModule.updateCommissionTransactions(
      input.transactionIds.map(id => ({
        id,
        payout_id: null,
        payout_status: "unpaid",
        paid_at: null,
      }))
    )
  }
)

// Workflow
export const processPayoutWorkflow = createWorkflow(
  "process-payout-workflow",
  (
    input: {
      vendorId: string
      tenantId: string
      storeId?: string | null
      periodStart: Date
      periodEnd: Date
      paymentMethod?: string
    }
  ) => {
    // Get unpaid transactions
    const { transactions, grossAmount, commissionAmount, platformFeeAmount } =
      getUnpaidTransactionsStep(input)

    // Transform data for payout creation
    const payoutData = transform(
      { transactions, grossAmount, commissionAmount, platformFeeAmount, input },
      ({ transactions, grossAmount, commissionAmount, platformFeeAmount, input }) => ({
        vendorId: input.vendorId,
        tenantId: input.tenantId,
        storeId: input.storeId,
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        transactionIds: transactions.map((t: any) => t.id),
        grossAmount,
        commissionAmount,
        platformFeeAmount,
        paymentMethod: input.paymentMethod || "stripe_connect",
      })
    )

    // Create payout
    const { payout } = createPayoutStep(payoutData)

    // Mark transactions as paid
    const markData = transform(
      { transactions, payout },
      ({ transactions, payout }) => ({
        transactionIds: transactions.map((t: any) => t.id),
        payoutId: payout.id,
      })
    )
    
    markTransactionsPaidStep(markData)

    return new WorkflowResponse({ payout, transactionCount: transactions.length })
  }
)
