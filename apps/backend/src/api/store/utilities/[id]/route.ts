import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("utilities") as any
    const { id } = req.params
    const [item] = await mod.listUtilityAccounts({ id }, { take: 1 })
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Failed to fetch utility account"
    return handleApiError(res, error, "STORE-UTILITIES-ID")}
}

