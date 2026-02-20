import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { handleApiError } from "../../../../../../lib/api-error-handler";

/**
 * POST /store/fitness/classes/:id/check-in
 * Check in a member to an attended class. Marks booking as attended.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const fitnessService = req.scope.resolve("fitness") as any;
    const classId = req.params.id;
    const { member_id } = req.body as { member_id: string };

    if (!member_id) {
      return res.status(400).json({ error: "member_id is required" });
    }

    const result = await fitnessService.trackAttendance(classId, member_id);
    return res.json({ booking: result, checked_in: true });
  } catch (error: any) {
    return handleApiError(res, error, "STORE-FITNESS-CHECKIN");
  }
}

/**
 * GET /store/fitness/classes/:id/check-in
 * Get class availability (capacity, booked, available).
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const fitnessService = req.scope.resolve("fitness") as any;
    const classId = req.params.id;
    const availability = await fitnessService.getClassAvailability(classId);
    return res.json({ availability });
  } catch (error: any) {
    return handleApiError(res, error, "STORE-FITNESS-AVAILABILITY");
  }
}
