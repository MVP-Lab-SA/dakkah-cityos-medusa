import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { handleApiError } from "../../../lib/api-error-handler";

/**
 * GET  /store/gigs  — list available freelance gig listings with filters
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const freelanceService = req.scope.resolve("freelance") as any;
    const {
      limit = "20",
      offset = "0",
      category,
      budget_min,
      budget_max,
    } = req.query as Record<string, string | undefined>;

    const filters: Record<string, unknown> = { status: "active" };
    if (category) filters.category = category;

    const gigs = await (freelanceService as any).listGigListings(filters, {
      skip: Number(offset),
      take: Number(limit),
    });
    const list = Array.isArray(gigs) ? gigs : [gigs].filter(Boolean);

    // Client-side budget filter (service doesn't support range queries natively)
    const filtered = list.filter((g: any) => {
      if (budget_min && Number(g.budget) < Number(budget_min)) return false;
      if (budget_max && Number(g.budget) > Number(budget_max)) return false;
      return true;
    });

    return res.json({
      gigs: filtered,
      count: filtered.length,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error: any) {
    return handleApiError(res, error, "STORE-GIGS-LIST");
  }
}
