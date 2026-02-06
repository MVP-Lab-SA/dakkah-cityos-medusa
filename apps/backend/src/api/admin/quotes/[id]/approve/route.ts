import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { z } from "zod";

const approveQuoteSchema = z.object({
  custom_discount_percentage: z.number().optional(),
  custom_discount_amount: z.string().optional(),
  discount_reason: z.string().optional(),
  valid_days: z.number().default(30),
});

/**
 * POST /admin/quotes/:id/approve
 * Approve a quote with optional custom pricing
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params;
  const adminUserId = req.auth_context?.actor_id;
  const parsed = approveQuoteSchema.parse(req.body);

  // @ts-ignore - Dynamic import
  const { approveQuoteWorkflow } = await import(
    "../../../../workflows/b2b/approve-quote-workflow"
  );

  const { result } = await approveQuoteWorkflow(req.scope).run({
    input: {
      quote_id: id,
      approved_by: adminUserId,
      ...parsed,
    },
  });

  res.json({ quote: result });
}
