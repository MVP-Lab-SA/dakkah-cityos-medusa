import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("auction") as any
    const { limit = "20", offset = "0", tenant_id, auction_type } = req.query as Record<string, string | undefined>
    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (auction_type) filters.auction_type = auction_type
    filters.status = "active"
    const items = await mod.listAuctionListings(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })
  } catch (error: any) {
    handleApiError(res, error, "STORE-AUCTIONS")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("auction") as any
    const item = await mod.createAuctionListings(req.body)
    res.status(201).json({ item })
  } catch (error: any) {
    return handleApiError(res, error, "STORE-AUCTIONS")}
}

