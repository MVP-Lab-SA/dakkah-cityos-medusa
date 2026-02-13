import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("eventModuleService") as any
    const { limit = "20", offset = "0", tenant_id } = req.query as Record<string, string | undefined>
    const filters: Record<string, any> = { status: "published" }
    if (tenant_id) filters.tenant_id = tenant_id
    const items = await service.listEventOutboxes(filters, { skip: Number(offset), take: Number(limit) })
    res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
