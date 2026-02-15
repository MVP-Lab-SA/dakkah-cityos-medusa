import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../../lib/api-error-handler"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("dispute") as any
    const dispute = await service.resolve({
      disputeId: req.params.id,
      resolution: req.body?.resolution,
      resolutionAmount: req.body?.resolution_amount,
      resolvedBy: req.body?.resolved_by || "admin",
      notes: req.body?.notes,
    })
    res.json({ dispute })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-DISPUTES-ID-RESOLVE")}
}

