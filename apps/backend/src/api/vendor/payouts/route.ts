import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const payoutModule = req.scope.resolve("payout")
  const context = (req as any).cityosContext

  if (!context?.vendorId) {
    return res.status(403).json({ message: "Vendor context required" })
  }

  const { limit = 20, offset = 0, status } = req.query

  const filters: any = {
    vendor_id: context.vendorId,
  }

  if (status) filters.status = status

  const [payouts, count] = await payoutModule.listAndCountPayouts(
    filters,
    {
      skip: Number(offset),
      take: Number(limit),
      relations: [],
    }
  )

  return res.json({
    payouts,
    count,
    limit: Number(limit),
    offset: Number(offset),
  })
}
