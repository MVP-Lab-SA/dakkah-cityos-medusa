import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

/**
 * POST /store/companies
 * Register a new B2B company account
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const companyService = req.scope.resolve("companyModuleService");
  const {
    name,
    legal_name,
    tax_id,
    email,
    phone,
    industry,
    employee_count,
    annual_revenue,
    billing_address,
    tenant_id,
    store_id,
  } = req.body;

  // Validate authenticated customer
  if (!req.auth_context?.actor_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const customerId = req.auth_context.actor_id;

  // Create company
  const company = await companyService.createCompanies({
    name,
    legal_name,
    tax_id,
    email,
    phone,
    industry,
    employee_count,
    annual_revenue,
    billing_address,
    tenant_id,
    store_id,
    status: "pending", // Requires approval
    tier: "bronze",
    credit_limit: "0",
    payment_terms_days: 30,
  });

  // Create company user (admin role for creator)
  await companyService.createCompanyUsers({
    company_id: company.id,
    customer_id: customerId,
    role: "admin",
    is_active: true,
  });

  res.json({ company });
}

/**
 * GET /store/companies
 * Get customer's companies
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const companyService = req.scope.resolve("companyModuleService");

  if (!req.auth_context?.actor_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const customerId = req.auth_context.actor_id;

  // Find company users for this customer
  const [companyUsers] = await companyService.listCompanyUsers({
    customer_id: customerId,
  });

  // Get companies
  const companyIds = companyUsers.map((cu: any) => cu.company_id);
  const [companies] = await companyService.listCompanies({
    id: companyIds,
  });

  res.json({ companies });
}
