import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

/**
 * POST /store/quotes/:id/decline
 * Decline an approved quote
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const quoteModuleService = req.scope.resolve("quoteModuleService");
  const { id } = req.params;
  const { reason } = req.body;

  if (!req.auth_context?.actor_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const quote = await quoteModuleService.retrieveQuote(id);

  // Verify ownership
  if (quote.customer_id !== req.auth_context.actor_id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Update status to declined
  const updatedQuote = await quoteModuleService.updateQuotes(id, {
    status: "declined",
    declined_at: new Date(),
    declined_reason: reason,
  });

  res.json({ quote: updatedQuote });
}
