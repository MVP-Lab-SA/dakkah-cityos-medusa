import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// POST /vendor/payouts/request - Request a payout
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const payoutModule = req.scope.resolve("payout")
  
  const vendorId = (req as any).vendor_id
  if (!vendorId) {
    return res.status(401).json({ message: "Vendor authentication required" })
  }

  // Get unpaid approved commissions
  const { data: unpaidCommissions } = await query.graph({
    entity: "commission_transaction",
    fields: ["id", "net_amount"],
    filters: {
      vendor_id: vendorId,
      payout_status: "unpaid",
      status: "approved",
    },
  })

  if (unpaidCommissions.length === 0) {
    return res.status(400).json({ message: "No funds available for payout" })
  }

  const totalAmount = unpaidCommissions.reduce(
    (sum: number, c: any) => sum + (Number(c.net_amount) || 0),
    0
  )

  // Check minimum payout threshold (e.g., $10)
  const MIN_PAYOUT = 10
  if (totalAmount < MIN_PAYOUT) {
    return res.status(400).json({ 
      message: `Minimum payout amount is $${MIN_PAYOUT}. Current balance: $${totalAmount.toFixed(2)}` 
    })
  }

  try {
    // Create payout
    const payout = await payoutModule.createPayouts({
      vendor_id: vendorId,
      amount: totalAmount,
      status: "pending",
      currency_code: "usd",
    })

    // Link commission transactions to payout
    const commissionModule = req.scope.resolve("commission")
    for (const commission of unpaidCommissions) {
      await commissionModule.updateCommissionTransactions(commission.id, {
        payout_status: "pending_payout",
      })
    }

    // Create payout-transaction links
    await payoutModule.createPayoutTransactionLinks(
      unpaidCommissions.map((c: any) => ({
        payout_id: payout.id,
        commission_transaction_id: c.id,
      }))
    )

    res.status(201).json({
      success: true,
      payout: {
        id: payout.id,
        amount: payout.amount,
        status: payout.status,
      },
      message: "Payout request submitted successfully",
    })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
