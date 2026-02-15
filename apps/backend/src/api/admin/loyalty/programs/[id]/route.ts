import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("loyalty") as any
    const program = await service.retrieveLoyaltyProgram(req.params.id)
    res.json({ program })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-LOYALTY-PROGRAMS-ID")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("loyalty") as any
    const program = await service.updateLoyaltyPrograms(req.params.id, req.body)
    res.json({ program })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-LOYALTY-PROGRAMS-ID")}
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("loyalty") as any
    await service.deleteLoyaltyPrograms(req.params.id)
    res.status(200).json({ id: req.params.id, deleted: true })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-LOYALTY-PROGRAMS-ID")}
}

