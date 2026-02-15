import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const fitnessService = req.scope.resolve("fitness") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      type,
      level,
      class_type,
      is_active,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (type) filters.type = type
    if (level) filters.level = level
    if (class_type) filters.class_type = class_type
    if (is_active !== undefined) filters.is_active = is_active === "true"
    if (search) filters.name = { $like: `%${search}%` }

    const paginationOpts = {
      skip: Number(offset),
      take: Number(limit),
      order: { created_at: "DESC" },
    }

    const [classes, trainers] = await Promise.all([
      fitnessService.listClassSchedules(filters, paginationOpts),
      fitnessService.listTrainerProfiles(filters, paginationOpts),
    ])

    const classList = Array.isArray(classes) ? classes : []
    const trainerList = Array.isArray(trainers) ? trainers : []

    return res.json({
      classes: classList,
      trainers: trainerList,
      count: classList.length + trainerList.length,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    return handleApiError(res, error, "STORE-FITNESS")
  }
}
