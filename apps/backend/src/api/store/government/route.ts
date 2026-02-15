import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("government") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      status,
      type,
      department,
      service_type,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (status) filters.status = status
    if (type) filters.type = type
    if (department) filters.department = department
    if (service_type) filters.service_type = service_type
    if (search) filters.search = search

    const items = await mod.listServiceRequests(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({
      items,
      count: Array.isArray(items) ? items.length : 0,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    handleApiError(res, error, "STORE-GOVERNMENT")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("government") as any
    const item = await mod.createServiceRequests(req.body)
    res.status(201).json({ item })
  } catch (error: any) {
    return handleApiError(res, error, "STORE-GOVERNMENT")}
}

