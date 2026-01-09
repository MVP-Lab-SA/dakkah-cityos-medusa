import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk";

interface ApproveQuoteInput {
  quote_id: string;
  approved_by: string;
  custom_discount_percentage?: number;
  custom_discount_amount?: string;
  discount_reason?: string;
  valid_days?: number;
}

/**
 * Approve Quote Workflow
 * 
 * Sales team approves a quote request with optional custom pricing.
 * Sets validity period and notifies customer.
 */
export const approveQuoteWorkflow = createWorkflow(
  "approve-quote",
  (input: ApproveQuoteInput) => {
    // 1. Validate quote status
    const quote = transform({ input }, async ({ input }, { container }) => {
      const quoteService = container.resolve("quoteModuleService");
      const quote = await quoteService.retrieveQuote(input.quote_id);

      if (!["submitted", "under_review"].includes(quote.status)) {
        throw new Error(`Cannot approve quote with status: ${quote.status}`);
      }

      return quote;
    });

    // 2. Apply custom discount if provided
    transform({ input, quote }, async ({ input }, { container }) => {
      if (input.custom_discount_percentage || input.custom_discount_amount) {
        const quoteService = container.resolve("quoteModuleService");
        
        await quoteService.applyCustomDiscount(
          input.quote_id,
          input.custom_discount_percentage,
          input.custom_discount_amount ? BigInt(input.custom_discount_amount) : undefined,
          input.discount_reason
        );
      }
    });

    // 3. Update quote status
    const approvedQuote = transform(
      { input, quote },
      async ({ input, quote }, { container }) => {
        const quoteService = container.resolve("quoteModuleService");
        
        const validUntil = input.valid_days
          ? new Date(Date.now() + input.valid_days * 24 * 60 * 60 * 1000)
          : null;

        return await quoteService.updateQuotes(input.quote_id, {
          status: "approved",
          reviewed_by: input.approved_by,
          reviewed_at: new Date(),
          valid_from: new Date(),
          valid_until: validUntil,
        });
      }
    );

    // 4. Send notification (hook for email/notification service)
    transform({ approvedQuote }, async ({ approvedQuote }, { container }) => {
      // TODO: Integrate with notification service
      console.log(`Quote ${approvedQuote.quote_number} approved and ready for customer acceptance`);
    });

    return new WorkflowResponse(approvedQuote);
  }
);
