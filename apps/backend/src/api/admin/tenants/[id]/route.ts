import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve("query")
    const { id } = req.params
  
    const { data: [tenant] } = await query.graph({
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
        "settings",
        "features",
        "trial_ends_at",
        "created_at",
        "updated_at",
        "billing.*",
        "users.*",
      ],
      filters: { id },
    })
  
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" })
    }
  
    res.json({ tenant })

  } catch (error) {
    handleApiError(res, error, "GET admin tenants id")
  }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  try {
    const tenantModuleService = req.scope.resolve("tenantModuleService") as any
    const { id } = req.params
    const body = req.body as Record<string, unknown>
  
    const tenant = await tenantModuleService.updateTenants({ id, ...body })
  
    res.json({ tenant })

  } catch (error) {
    handleApiError(res, error, "PUT admin tenants id")
  }
}
