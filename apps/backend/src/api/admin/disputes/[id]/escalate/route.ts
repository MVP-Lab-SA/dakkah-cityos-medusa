import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../../lib/api-error-handler"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("dispute") as any
    const dispute = await service.escalate(req.params.id, req.body?.reason)
    res.json({ dispute })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-DISPUTES-ID-ESCALATE")}
}

