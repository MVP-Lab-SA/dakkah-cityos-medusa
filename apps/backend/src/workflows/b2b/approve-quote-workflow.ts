import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk";

interface ApproveQuoteInput {
  quote_id: string;
  approved_by: string;
  custom_discount_percentage?: number;
  custom_discount_amount?: string;
  discount_reason?: string;
  valid_days?: number;
}

// Step 1: Validate quote status
const validateQuoteStep = createStep(
  "validate-quote",
  async (input: ApproveQuoteInput, { container }) => {
    const quoteService = container.resolve("quote") as any;
    const quote = await quoteService.retrieveQuote(input.quote_id);

    if (!["submitted", "under_review"].includes(quote.status)) {
      throw new Error(`Cannot approve quote with status: ${quote.status}`);
    }

    return new StepResponse({ quote, input });
  }
);

// Step 2: Apply custom discount if provided
const applyDiscountStep = createStep(
  "apply-discount",
  async ({ input, quote }: { input: ApproveQuoteInput; quote: Record<string, unknown> }, { container }) => {
    if (input.custom_discount_percentage || input.custom_discount_amount) {
      const quoteService = container.resolve("quote") as any;
      
      await quoteService.applyCustomDiscount(
        input.quote_id,
        input.custom_discount_percentage,
        input.custom_discount_amount ? BigInt(input.custom_discount_amount) : undefined,
        input.discount_reason
      );
    }
    return new StepResponse({ discountApplied: true });
  }
);

// Step 3: Update quote status
const updateQuoteStatusStep = createStep(
  "update-quote-status",
  async ({ input, quote }: { input: ApproveQuoteInput; quote: Record<string, unknown> }, { container }) => {
    const quoteService = container.resolve("quote") as any;
    
    const validUntil = input.valid_days
      ? new Date(Date.now() + input.valid_days * 24 * 60 * 60 * 1000)
      : null;

    const approvedQuote = await quoteService.updateQuotes({
      id: input.quote_id,
      status: "approved",
      reviewed_by: input.approved_by,
      reviewed_at: new Date(),
      valid_from: new Date(),
      valid_until: validUntil,
    });

    return new StepResponse({ approvedQuote });
  }
);

// Step 4: Send notification
const sendNotificationStep = createStep(
  "send-notification",
  async ({ approvedQuote }: { approvedQuote: Record<string, unknown> }, { container }) => {
    // TODO: Integrate with notification service
    console.log(`Quote ${approvedQuote.quote_number} approved and ready for customer acceptance`);
    return new StepResponse({ notificationSent: true });
  }
);

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
    const { quote } = validateQuoteStep(input);

    // 2. Apply custom discount if provided
    applyDiscountStep({ input, quote });

    // 3. Update quote status
    const { approvedQuote } = updateQuoteStatusStep({ input, quote });

    // 4. Send notification
    sendNotificationStep({ approvedQuote });

    return new WorkflowResponse({ quote: approvedQuote });
  }
);
