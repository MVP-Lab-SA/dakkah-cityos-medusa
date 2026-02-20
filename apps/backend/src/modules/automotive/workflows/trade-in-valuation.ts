import {
  createWorkflow,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk";

/**
 * Trade-In Valuation Workflow
 * Submit → evaluate (depreciation model) → present offer → accept or decline.
 */
const submitTradeInStep = createStep(
  "submit-trade-in",
  async (
    {
      vehicleId,
      customerId,
      description,
    }: { vehicleId: string; customerId: string; description?: string },
    { container },
  ) => {
    const automotiveService = container.resolve("automotive") as any;
    const tradeIn = await automotiveService.submitTradeIn(
      vehicleId,
      customerId,
      description,
    );
    return new StepResponse({ tradeIn }, { tradeInId: tradeIn.id });
  },
  async ({ tradeInId }: { tradeInId: string }, { container }) => {
    const automotiveService = container.resolve("automotive") as any;
    await (automotiveService as any).updateTradeIns?.({
      id: tradeInId,
      status: "withdrawn",
    });
  },
);

const evaluateTradeInStep = createStep(
  "evaluate-trade-in",
  async (
    { tradeInId, overrideValue }: { tradeInId: string; overrideValue?: number },
    { container },
  ) => {
    const automotiveService = container.resolve("automotive") as any;
    const evaluated = await automotiveService.evaluateVehicle(
      tradeInId,
      overrideValue,
    );
    return new StepResponse({ evaluated });
  },
);

const presentOfferStep = createStep(
  "present-trade-in-offer",
  async (
    { tradeInId, accepted }: { tradeInId: string; accepted?: boolean },
    { container },
  ) => {
    const automotiveService = container.resolve("automotive") as any;
    const finalStatus = accepted === false ? "declined" : "offer_presented";
    const updated = await (automotiveService as any).updateTradeIns?.({
      id: tradeInId,
      status: finalStatus,
      offer_presented_at: new Date(),
    });
    return new StepResponse({
      tradeIn: updated,
      offer_accepted: accepted !== false,
    });
  },
);

export const tradeInValuationWorkflow = createWorkflow(
  "trade-in-valuation",
  (input: {
    vehicleId: string;
    customerId: string;
    description?: string;
    overrideValue?: number;
    accepted?: boolean;
  }) => {
    const submitted = submitTradeInStep({
      vehicleId: input.vehicleId,
      customerId: input.customerId,
      description: input.description,
    });
    const evaluated = evaluateTradeInStep({
      tradeInId: submitted.tradeIn.id as any,
      overrideValue: input.overrideValue,
    });
    const offer = presentOfferStep({
      tradeInId: submitted.tradeIn.id as any,
      accepted: input.accepted,
    });
    return { submitted, evaluated, offer };
  },
);
