import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import type { QuoteModuleService } from "../../types";

/**
 * GET /admin/quotes
 * List all quotes
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const quoteService = req.scope.resolve("quoteModuleService") as QuoteModuleService;
  
  // Get tenant context - may be undefined in some environments
  let tenantId: string | undefined;
  try {
    tenantId = req.scope.resolve("tenantId") as string | undefined;
  } catch {
    // tenantId not available
  }

  const { status, company_id, limit = 20, offset = 0 } = req.query as Record<string, string>;

  const filters: Record<string, unknown> = {};
  if (tenantId) filters.tenant_id = tenantId;
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
