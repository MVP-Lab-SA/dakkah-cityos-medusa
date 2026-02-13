import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const educationService = req.scope.resolve("education") as any
    const {
      limit = "20",
      offset = "0",
      tenant_id,
      category,
      level,
      status,
      instructor_id,
      search,
    } = req.query as Record<string, string | undefined>

    const filters: Record<string, any> = {}
    if (tenant_id) filters.tenant_id = tenant_id
    if (category) filters.category = category
    if (level) filters.level = level
    if (status) {
      filters.status = status
    } else {
      filters.status = "published"
    }
    if (instructor_id) filters.instructor_id = instructor_id
    if (search) filters.title = { $like: `%${search}%` }

    const items = await educationService.listCourses(filters, {
      skip: Number(offset),
      take: Number(limit),
      order: { created_at: "DESC" },
    })

    const itemList = Array.isArray(items) ? items : []

    return res.json({
      items: itemList,
      count: itemList.length,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch courses",
      error: error.message,
    })
  }
}
