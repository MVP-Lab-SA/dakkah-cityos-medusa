import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  
  const { limit = 20, offset = 0, status } = req.query as {
    limit?: number
    offset?: number
    status?: string
  }
  
  const filters: Record<string, any> = {}
  if (status) filters.status = status
  
  const { data: tenants, metadata } = await query.graph({
    entity: "tenant",
    fields: [
      "id",
      "name",
      "slug",
      "domain",
      "status",
      "plan",
      "owner_email",
      "owner_name",
      "trial_ends_at",
      "created_at",
      "updated_at",
    ],
    filters,
    pagination: { skip: Number(offset), take: Number(limit) },
  })
  
  res.json({
    tenants,
    count: metadata?.count || tenants.length,
    offset: Number(offset),
    limit: Number(limit),
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const tenantModuleService = req.scope.resolve("tenantModuleService")
  
  const tenant = await tenantModuleService.createTenants(req.body)
  
  res.status(201).json({ tenant })
}
