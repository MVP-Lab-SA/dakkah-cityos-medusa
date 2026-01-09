import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const commissionModule = req.scope.resolve("commission")
  const context = (req as any).cityosContext

  if (!context?.vendorId) {
    return res.status(403).json({ message: "Vendor context required" })
  }

  const { limit = 20, offset = 0, status, payout_status } = req.query

  const filters: any = {
    vendor_id: context.vendorId,
  }

  if (status) filters.status = status
  if (payout_status) filters.payout_status = payout_status

  const [transactions, count] = await commissionModule.listAndCountCommissionTransactions(
    filters,
    {
      skip: Number(offset),
      take: Number(limit),
      relations: [],
    }
  )

  return res.json({
    transactions,
    count,
    limit: Number(limit),
    offset: Number(offset),
  })
}
