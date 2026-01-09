import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorModule = req.scope.resolve("vendor")
  const commissionModule = req.scope.resolve("commission")
  const payoutModule = req.scope.resolve("payout")
  
  const context = (req as any).cityosContext

  if (!context?.vendorId) {
    return res.status(403).json({ message: "Vendor context required" })
  }

  // Get vendor details
  const vendor = await vendorModule.retrieveVendor(context.vendorId)

  // Get commission stats
  const [transactions, transactionCount] = await commissionModule.listAndCountCommissionTransactions({
    vendor_id: context.vendorId,
    status: "approved",
  })

  const totalEarnings = transactions.reduce((sum: number, tx: any) => sum + Number(tx.net_amount), 0)
  const totalCommission = transactions.reduce((sum: number, tx: any) => sum + Number(tx.commission_amount), 0)

  // Get recent payouts
  const [payouts] = await payoutModule.listAndCountPayouts(
    {
      vendor_id: context.vendorId,
    },
    {
      take: 5,
      relations: [],
    }
  )

  return res.json({
    vendor,
    stats: {
      totalOrders: transactionCount,
      totalEarnings,
      totalCommission,
      pendingPayout: vendor.total_sales - vendor.total_commission_paid,
    },
    recentPayouts: payouts,
  })
}
