import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const payoutModule = req.scope.resolve("payout") as any
  const context = (req as any).cityosContext

  if (!context?.vendorId) {
    return res.status(403).json({ message: "Vendor context required" })
  }

  const { limit = 20, offset = 0, status } = req.query

  const filters: any = {
    vendor_id: context.vendorId,
  }

  if (status) filters.status = status

  const payouts = await payoutModule.listPayouts(
    filters,
    {
      skip: Number(offset),
      take: Number(limit),
    }
  )

  return res.json({
    payouts,
    count: Array.isArray(payouts) ? payouts.length : 0,
    limit: Number(limit),
    offset: Number(offset),
  })
}
