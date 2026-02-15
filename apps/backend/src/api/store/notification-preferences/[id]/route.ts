import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("notificationPreferencesModuleService") as any
    const item = await service.retrieveNotificationPreference(req.params.id)
    res.json({ item })
  } catch (error: any) {
    return handleApiError(res, error, "STORE-NOTIFICATION-PREFERENCES-ID")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("notificationPreferencesModuleService") as any
    const item = await service.updateNotificationPreferences(req.params.id, req.body)
    res.json({ item })
  } catch (error: any) {
    return handleApiError(res, error, "STORE-NOTIFICATION-PREFERENCES-ID")}
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("notificationPreferencesModuleService") as any
    await service.deleteNotificationPreferences(req.params.id)
    res.status(200).json({ id: req.params.id, deleted: true })
  } catch (error: any) {
    return handleApiError(res, error, "STORE-NOTIFICATION-PREFERENCES-ID")}
}

