import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { handleApiError } from "../../../../lib/api-error-handler"

/**
 * GET /store/quotes/:id
 * Get single quote details
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const quoteModuleService = req.scope.resolve("quoteModuleService") as any;
    const { id } = req.params;

    if (!req.auth_context?.actor_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const quote = await quoteModuleService.retrieveQuote(id);

    // Verify ownership
    if (quote.customer_id !== req.auth_context.actor_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ quote });

  } catch (error) {
    handleApiError(res, error, "GET store quotes id")
  }
}

/**
 * POST /store/quotes/:id/submit
 * Submit quote for review
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const quoteModuleService = req.scope.resolve("quoteModuleService") as any;
    const { id } = req.params;

    if (!req.auth_context?.actor_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const quote = await quoteModuleService.retrieveQuote(id);

    // Verify ownership
    if (quote.customer_id !== req.auth_context.actor_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Update status to submitted
    const updatedQuote = await quoteModuleService.updateQuotes({
      id,
      status: "submitted",
    });

    res.json({ quote: updatedQuote });

  } catch (error) {
    handleApiError(res, error, "POST store quotes id")
  }
}
