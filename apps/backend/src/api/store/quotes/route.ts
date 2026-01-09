import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { z } from "zod";

const createQuoteSchema = z.object({
  items: z.array(z.object({
    product_id: z.string(),
    variant_id: z.string(),
    quantity: z.number().positive(),
  })),
  customer_notes: z.string().optional(),
});

/**
 * POST /store/quotes
 * Create a new quote request (B2B customer)
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context?.actor_id;
  const tenantId = req.scope.resolve("tenantId");
  const storeId = req.scope.resolve("storeId");

  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const parsed = createQuoteSchema.parse(req.body);

  // Get customer's company
  const companyService = req.scope.resolve("companyModuleService");
  const [companyUsers] = await companyService.listCompanyUsers({
    customer_id: customerId,
    status: "active",
  });

  if (companyUsers.length === 0) {
    return res.status(403).json({ error: "Not associated with a company" });
  }

  const companyUser = companyUsers[0];

  const { createQuoteWorkflow } = await import(
    "../../../workflows/b2b/create-quote-workflow"
  );

  const { result } = await createQuoteWorkflow(req.scope).run({
    input: {
      company_id: companyUser.company_id,
      customer_id: customerId,
      tenant_id: tenantId,
      store_id: storeId,
      items: parsed.items,
      customer_notes: parsed.customer_notes,
      valid_days: 30,
    },
  });

  res.status(201).json({ quote: result });
}

/**
 * GET /store/quotes
 * List customer's quotes
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context?.actor_id;
  const quoteService = req.scope.resolve("quoteModuleService");

  if (!customerId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const [quotes] = await quoteService.listQuotes({
    customer_id: customerId,
  }, {
    order: { created_at: "DESC" },
  });

  res.json({ quotes });
}
