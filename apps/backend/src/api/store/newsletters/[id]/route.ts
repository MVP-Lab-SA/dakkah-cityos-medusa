import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { handleApiError } from "../../../../lib/api-error-handler";

// GET /store/newsletters/:id — retrieve a specific newsletter subscription/preference
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const notifService = req.scope.resolve("notificationPreferences") as any;
    const { id } = req.params;
    const item = await notifService.retrieveNotificationPreference(id);
    if (!item) return res.status(404).json({ message: "Not found" });
    return res.json({ item });
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return handleApiError(res, error, "STORE-NEWSLETTERS-ID");
    }
    handleApiError(res, error, "STORE-NEWSLETTERS-ID");
  }
}

// DELETE /store/newsletters/:id — unsubscribe
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const notifService = req.scope.resolve("notificationPreferences") as any;
    const { id } = req.params;
    await notifService.updatePreference({
      id,
      enabled: false,
    });
    return res.json({ success: true, message: "Unsubscribed successfully" });
  } catch (error: any) {
    handleApiError(res, error, "DELETE store newsletters id");
  }
}
