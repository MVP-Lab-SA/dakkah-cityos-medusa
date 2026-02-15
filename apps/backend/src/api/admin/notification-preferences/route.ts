import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { handleApiError } from "../../../lib/api-error-handler"

const createSchema = z.object({
  tenant_id: z.string().min(1),
  customer_id: z.string().min(1),
  channel: z.enum(["email", "sms", "push", "in_app"]),
  category: z.enum(["marketing", "transactional", "security", "updates"]),
  enabled: z.boolean(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const moduleService = req.scope.resolve("notificationPreferencesModuleService") as any
    const { limit = "20", offset = "0", customer_id, channel, tenant_id } = req.query as Record<string, string | undefined>
    const filters: Record<string, any> = {}
    if (customer_id) filters.customer_id = customer_id
    if (channel) filters.channel = channel
    if (tenant_id) filters.tenant_id = tenant_id
    const items = await moduleService.listNotificationPreferences(filters, { skip: Number(offset), take: Number(limit) })
    return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })

  } catch (error: any) {
    handleApiError(res, error, "GET admin notification-preferences")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const moduleService = req.scope.resolve("notificationPreferencesModuleService") as any
    const validation = createSchema.safeParse(req.body)
    if (!validation.success) return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
    const item = await moduleService.createNotificationPreferences(validation.data)
    return res.status(201).json({ item })

  } catch (error: any) {
    handleApiError(res, error, "POST admin notification-preferences")}
}

