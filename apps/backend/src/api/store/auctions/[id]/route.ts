import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("auction") as any
  const { id } = req.params
  const [item] = await mod.listAuctionListings({ id }, { take: 1 })
  if (!item) return res.status(404).json({ message: "Not found" })
  const bids = await mod.listBids({ auction_listing_id: id }, { take: 100 })
  return res.json({ item: { ...item, bids } })
}
