import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { handleApiError } from "../../../../../lib/api-error-handler"

/**
 * POST /store/quotes/:id/decline
 * Decline an approved quote
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const quoteModuleService = req.scope.resolve("quoteModuleService") as any;
    const { id } = req.params;
    const { reason } = req.body as { reason?: string };

    if (!req.auth_context?.actor_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const quote = await quoteModuleService.retrieveQuote(id);

    // Verify ownership
    if (quote.customer_id !== req.auth_context.actor_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Update status to declined
    const updatedQuote = await quoteModuleService.updateQuotes({
      id,
      status: "declined",
      declined_at: new Date(),
      declined_reason: reason,
    });

    res.json({ quote: updatedQuote });

  } catch (error: any) {
    handleApiError(res, error, "POST store quotes id decline")}
}

