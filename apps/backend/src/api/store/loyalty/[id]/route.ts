import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const loyaltyService = req.scope.resolve("loyalty") as any
    const { id } = req.params

    try {
      const program = await loyaltyService.retrieveLoyaltyProgram(id)
      if (program) return res.json({ item: program })
    } catch {}

    try {
      const account = await loyaltyService.retrieveLoyaltyAccount(id)
      if (account) {
        const balance = await loyaltyService.getBalance(account.id)
        return res.json({ item: { ...account, ...balance } })
      }
    } catch {}

    return res.status(404).json({ message: "Loyalty item not found" })
  } catch (error: any) {
    handleApiError(res, error, "STORE-LOYALTY-ID")
  }
}
