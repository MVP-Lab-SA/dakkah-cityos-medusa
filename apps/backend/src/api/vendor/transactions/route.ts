import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const commissionModule = req.scope.resolve("commission") as any
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

    const transactions = await commissionModule.listCommissions(
      filters,
      {
        skip: Number(offset),
        take: Number(limit),
      }
    )

    return res.json({
      transactions,
      count: Array.isArray(transactions) ? transactions.length : 0,
      limit: Number(limit),
      offset: Number(offset),
    })

  } catch (error) {
    handleApiError(res, error, "GET vendor transactions")
  }
}
