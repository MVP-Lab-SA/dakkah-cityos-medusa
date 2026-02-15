import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("auction") as any
    const { id } = req.params
    const item = await mod.retrieveAuctionListing(id)
    if (!item) return res.status(404).json({ message: "Not found" })
    const bids = await mod.listBids({ auction_id: id }, { take: 100 })
    return res.json({ item: { ...item, bids } })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return handleApiError(res, error, "STORE-AUCTIONS-ID")}
    handleApiError(res, error, "STORE-AUCTIONS-ID")
  }
}

