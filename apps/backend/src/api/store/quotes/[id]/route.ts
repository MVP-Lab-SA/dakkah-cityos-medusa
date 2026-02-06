import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import type { QuoteModuleService, ExtendedRequest } from "../../../types";

/**
 * GET /store/quotes/:id
 * Get single quote details
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const quoteModuleService = req.scope.resolve("quoteModuleService") as QuoteModuleService;
  const { id } = req.params;

  const extReq = req as ExtendedRequest;
  if (!extReq.auth_context?.actor_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const quote = await quoteModuleService.retrieveQuote(id, {
    relations: ["items"],
  });

  // Verify ownership
  if (quote.customer_id !== extReq.auth_context.actor_id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json({ quote });
}

/**
 * POST /store/quotes/:id/submit
 * Submit quote for review
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const quoteModuleService = req.scope.resolve("quoteModuleService") as QuoteModuleService;
  const { id } = req.params;

  const extReq = req as ExtendedRequest;
  if (!extReq.auth_context?.actor_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const quote = await quoteModuleService.retrieveQuote(id);

  // Verify ownership
  if (quote.customer_id !== extReq.auth_context.actor_id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Update status to submitted
  const [updatedQuote] = await quoteModuleService.updateQuotes(id, {
    status: "submitted",
  });

  res.json({ quote: updatedQuote });
}
