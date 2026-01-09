import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk";

interface CreateCompanyInput {
  name: string;
  legal_name?: string;
  email: string;
  phone?: string;
  tax_id?: string;
  industry?: string;
  tenant_id: string;
  store_id?: string;
  customer_id: string; // Primary contact
  credit_limit?: string;
  payment_terms_days?: number;
  tier?: string;
}

/**
 * Create Company Workflow
 * 
 * Registers a new B2B company and assigns the first admin user.
 * Company starts in pending status awaiting approval.
 */
export const createCompanyWorkflow = createWorkflow(
  "create-company",
  (input: CreateCompanyInput) => {
    // 1. Create company
    const company = transform({ input }, async ({ input }, { container }) => {
      const companyService = container.resolve("companyModuleService");

      return await companyService.createCompanies({
        name: input.name,
        legal_name: input.legal_name,
        email: input.email,
        phone: input.phone,
        tax_id: input.tax_id,
        industry: input.industry,
        tenant_id: input.tenant_id,
        store_id: input.store_id,
        status: "pending",
        tier: input.tier || "bronze",
        credit_limit: input.credit_limit || "0",
        credit_used: "0",
        payment_terms_days: input.payment_terms_days || 30,
        requires_approval: true,
      });
    });

    // 2. Add primary contact as admin
    const companyUser = transform(
      { input, company },
      async ({ input, company }, { container }) => {
        const companyService = container.resolve("companyModuleService");

        return await companyService.createCompanyUsers({
          company_id: company.id,
          customer_id: input.customer_id,
          role: "admin",
          status: "active",
          joined_at: new Date(),
        });
      }
    );

    // 3. Log company creation
    transform({ company }, async ({ company }, { container }) => {
      console.log(`Company created: ${company.name} (${company.id}) - Status: pending approval`);
    });

    return new WorkflowResponse({ company, companyUser });
  }
);
