// @ts-nocheck
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST - Assign companies to pricing tier
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const { company_ids } = req.body as { company_ids: string[] }

  const companyService = req.scope.resolve("companyModuleService")

  // Update companies to use this tier
  for (const companyId of company_ids) {
    await companyService.updateCompanies({
      selector: { id: companyId },
      data: { pricing_tier_id: id }
    })
  }

  res.json({
    message: `Assigned ${company_ids.length} companies to tier`,
    tier_id: id,
    company_ids
  })
}

// DELETE - Remove companies from pricing tier
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const { company_ids } = req.body as { company_ids: string[] }

  const companyService = req.scope.resolve("companyModuleService")

  // Remove tier from companies
  for (const companyId of company_ids) {
    await companyService.updateCompanies({
      selector: { id: companyId },
      data: { pricing_tier_id: null }
    })
  }

  res.json({
    message: `Removed ${company_ids.length} companies from tier`,
    tier_id: id,
    company_ids
  })
}
