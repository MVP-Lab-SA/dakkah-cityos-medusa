import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("digitalProduct") as any
    const { limit = "20", offset = "0", tenant_id, file_type } = req.query as Record<string, string | undefined>
    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (file_type) filters.file_type = file_type
    filters.is_active = true
    const items = await mod.listDigitalAssets(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })
  } catch (error: any) {
    handleApiError(res, error, "STORE-DIGITAL-PRODUCTS")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("digitalProduct") as any
    const item = await mod.createDigitalAssets(req.body)
    res.status(201).json({ item })
  } catch (error: any) {
    return handleApiError(res, error, "STORE-DIGITAL-PRODUCTS")}
}

