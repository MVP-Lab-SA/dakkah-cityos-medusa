import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../../lib/api-error-handler"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("dispute") as any
    const dispute = await service.resolve({
      disputeId: req.params.id,
      resolution: (req.body as any)?.resolution,
      resolutionAmount: (req.body as any)?.resolution_amount,
      resolvedBy: (req.body as any)?.resolved_by || "admin",
      notes: (req.body as any)?.notes,
    })
    res.json({ dispute })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-DISPUTES-ID-RESOLVE")}
}

