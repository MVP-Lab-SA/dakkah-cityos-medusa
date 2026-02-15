import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("advertising") as any
    const { limit = "20", offset = "0", tenant_id, placement_type, status } = req.query as Record<string, string | undefined>
    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (placement_type) filters.placement_type = placement_type
    if (status) filters.status = status
    const items = await mod.listAdPlacements(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })
  } catch (error: any) {
    handleApiError(res, error, "STORE-ADVERTISING")
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("advertising") as any
    const item = await mod.createAdPlacements(req.body)
    res.status(201).json({ item })
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Failed to create ad placement" })
  }
}
