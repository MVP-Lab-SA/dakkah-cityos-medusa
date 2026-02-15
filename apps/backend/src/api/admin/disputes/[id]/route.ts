import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("dispute") as any
    const dispute = await service.retrieveDispute(req.params.id)
    res.json({ dispute })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-DISPUTES-ID")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("dispute") as any
    const dispute = await service.updateDisputes(req.params.id, req.body)
    res.json({ dispute })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-DISPUTES-ID")}
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("dispute") as any
    await service.deleteDisputes(req.params.id)
    res.status(200).json({ id: req.params.id, deleted: true })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-DISPUTES-ID")}
}

