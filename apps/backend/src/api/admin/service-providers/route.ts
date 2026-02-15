import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve("query")
  
    const { data: providers } = await query.graph({
      entity: "service_provider",
      fields: [
        "id",
        "name",
        "email",
        "phone",
        "bio",
        "avatar_url",
        "is_active",
        "color",
        "timezone",
        "metadata",
        "created_at",
        "availabilities.*",
      ],
    })
  
    res.json({ providers })

  } catch (error: any) {
    handleApiError(res, error, "GET admin service-providers")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const bookingModuleService = req.scope.resolve("bookingModuleService") as any
  
    const provider = await bookingModuleService.createServiceProviders(req.body)
  
    res.status(201).json({ provider })

  } catch (error: any) {
    handleApiError(res, error, "POST admin service-providers")}
}

