import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("loyalty") as any
    const programs = await service.listLoyaltyPrograms({})
    res.json({ programs: Array.isArray(programs) ? programs : [programs].filter(Boolean) })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-LOYALTY-PROGRAMS")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("loyalty") as any
    const program = await service.createLoyaltyPrograms(req.body)
    res.status(201).json({ program })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-LOYALTY-PROGRAMS")}
}

