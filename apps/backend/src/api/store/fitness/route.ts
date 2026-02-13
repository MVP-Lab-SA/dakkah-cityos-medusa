import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("fitness") as any
    const { limit = "20", offset = "0", tenant_id, type } = req.query as Record<string, string | undefined>
    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    const classes = await mod.listClassSchedules(filters, { skip: Number(offset), take: Number(limit) })
    const trainers = await mod.listTrainerProfiles(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({ classes, trainers, limit: Number(limit), offset: Number(offset) })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch fitness data", error: error.message })
  }
}
