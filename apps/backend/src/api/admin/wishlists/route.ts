import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("wishlist") as any
    const limit = parseInt(req.query.limit as string) || 20
    const offset = parseInt(req.query.offset as string) || 0
    const [items, count] = await service.listAndCountWishlists({}, { take: limit, skip: offset })
    res.json({ items, count, limit, offset })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-WISHLISTS")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("wishlist") as any
    const item = await service.createWishlists(req.body)
    res.status(201).json({ item })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-WISHLISTS")}
}

