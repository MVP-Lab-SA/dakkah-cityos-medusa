import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
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
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const bookingModuleService = req.scope.resolve("bookingModuleService") as any
  
  const provider = await bookingModuleService.createServiceProviders(req.body)
  
  res.status(201).json({ provider })
}
