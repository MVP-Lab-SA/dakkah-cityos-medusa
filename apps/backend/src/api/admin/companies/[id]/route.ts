import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { id } = req.params
  
  const { data: [company] } = await query.graph({
    entity: "company",
    fields: [
      "id",
      "name",
      "email",
      "phone",
      "tax_id",
      "status",
      "tier",
      "credit_limit",
      "available_credit",
      "payment_terms_days",
      "requires_po",
      "auto_approve_under",
      "billing_address",
      "shipping_address",
      "metadata",
      "created_at",
      "updated_at",
      "users.*",
      "payment_terms.*",
      "tax_exemptions.*",
    ],
    filters: { id },
  })
  
  if (!company) {
    return res.status(404).json({ message: "Company not found" })
  }
  
  res.json({ company })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const companyModuleService = req.scope.resolve("companyModuleService") as any
  const { id } = req.params
  const body = req.body as Record<string, unknown>
  
  const company = await companyModuleService.updateCompanies({ id, ...body })
  
  res.json({ company })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const companyModuleService = req.scope.resolve("companyModuleService") as any
  const { id } = req.params
  
  await companyModuleService.deleteCompanies(id)
  
  res.status(200).json({ id, deleted: true })
}
