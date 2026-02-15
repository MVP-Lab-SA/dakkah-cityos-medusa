import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

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
      return res.status(404).json({ message: "Auction listing not found" })
    }
    res.status(500).json({ message: "Failed to fetch auction listing", error: error.message })
  }
}
