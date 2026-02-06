import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { VendorModuleService, CommissionModuleService, PayoutModuleService } from "../../types"

interface CityOSContext {
  vendorId?: string
  tenantId?: string
  storeId?: string
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorModule = req.scope.resolve("vendor") as VendorModuleService
  const commissionModule = req.scope.resolve("commission") as CommissionModuleService
  const payoutModule = req.scope.resolve("payout") as PayoutModuleService
  
  const context = (req as any).cityosContext as CityOSContext | undefined

  if (!context?.vendorId) {
    return res.status(403).json({ message: "Vendor context required" })
  }

  // Get vendor details
  const vendor = await vendorModule.retrieveVendor(context.vendorId)

  // Get commission stats
  const [transactions, transactionCount] = await commissionModule.listAndCountCommissions({
    vendor_id: context.vendorId,
    status: "approved",
  })

  const totalEarnings = transactions.reduce((sum: number, tx: any) => sum + Number(tx.net_amount || 0), 0)
  const totalCommission = transactions.reduce((sum: number, tx: any) => sum + Number(tx.commission_amount || 0), 0)

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
      pendingPayout: (vendor.total_sales || 0) - (vendor.total_commission_paid || 0),
    },
    recentPayouts: payouts,
  })
}
