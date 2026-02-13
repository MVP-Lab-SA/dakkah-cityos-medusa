import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorId = (req as any).vendor_id
  if (!vendorId) {
    return res.status(401).json({ message: "Vendor authentication required" })
  }

  const mod = req.scope.resolve("loyalty") as any
  const { limit = "20", offset = "0" } = req.query as Record<string, string | undefined>

  const filters: Record<string, any> = { vendor_id: vendorId }

  const items = await mod.listLoyaltyAccounts(filters, {
    skip: Number(offset),
    take: Number(limit),
    order: { created_at: "DESC" },
  })

  const accounts = Array.isArray(items) ? items : [items].filter(Boolean)

  const totalBalance = accounts.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0)

  return res.json({
    balance: totalBalance,
    accounts,
    count: accounts.length,
    limit: Number(limit),
    offset: Number(offset),
  })
}
