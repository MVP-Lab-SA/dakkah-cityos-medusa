import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

/**
 * GET /admin/quotes
 * List all quotes
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const quoteService = req.scope.resolve("quoteModuleService");
  const tenantId = req.scope.resolve("tenantId");

  const { status, company_id, limit = 20, offset = 0 } = req.query;

  const filters: any = { tenant_id: tenantId };
  
  if (status) filters.status = status;
  if (company_id) filters.company_id = company_id;

  const [quotes, count] = await quoteService.listAndCountQuotes(filters, {
    skip: Number(offset),
    take: Number(limit),
    order: { created_at: "DESC" },
  });

  res.json({
    quotes,
    count,
    limit: Number(limit),
    offset: Number(offset),
  });
}
