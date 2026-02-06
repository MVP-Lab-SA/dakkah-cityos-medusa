import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
  transform,
} from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createCartWorkflow } from "@medusajs/medusa/core-flows";

interface ProcessBillingCycleInput {
  billing_cycle_id: string;
}

// Step 1: Load billing cycle and subscription
const loadBillingCycleStep = createStep(
  "load-billing-cycle",
  async (input: ProcessBillingCycleInput, { container }) => {
    const subscriptionModule = container.resolve("subscription") as any;
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    
    const [cycles] = await subscriptionModule.listBillingCycles(
      { id: input.billing_cycle_id },
      { relations: ["subscription"] }
    );
    
    const cycle = cycles?.[0] as any;
    
    if (!cycle) {
      throw new Error(`Billing cycle ${input.billing_cycle_id} not found`);
    }
    
    if (cycle.status !== "upcoming") {
      throw new Error(`Billing cycle ${input.billing_cycle_id} is not in upcoming status`);
    }
    
    // Load subscription items
    const { data: items } = await query.graph({
      entity: "subscription_item",
      fields: ["*"],
      filters: { subscription_id: cycle.subscription_id as string },
    });
    
    return new StepResponse({ cycle, subscription: cycle.subscription, items });
  }
);

// Step 2: Update billing cycle to processing
const markCycleProcessingStep = createStep(
  "mark-cycle-processing",
  async ({ cycle }: { cycle: any }, { container }) => {
    const subscriptionModule = container.resolve("subscription") as any;
    
    const updated = await subscriptionModule.updateBillingCycles({
      id: cycle.id,
      status: "processing",
      attempt_count: ((cycle.attempt_count as number) || 0) + 1,
      last_attempt_at: new Date(),
    });
    
    return new StepResponse({ updatedCycle: updated });
  }
);

// Step 3: Create order from subscription
const createOrderFromSubscriptionStep = createStep(
  "create-order-from-subscription",
  async ({ cycle, subscription, items }: { cycle: any; subscription: any; items: any[] }, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    
    // Get region for customer
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email"],
      filters: { id: subscription.customer_id as string },
    });
    
    const customer = customers[0] as any;
    if (!customer) {
      throw new Error(`Customer ${subscription.customer_id} not found`);
    }
    
    // Get default region
    const { data: regions } = await query.graph({
      entity: "region",
      fields: ["id"],
      pagination: { take: 1 },
    });
    
    const region = regions[0] as any;
    
    // Create cart
    const { result: cart } = await createCartWorkflow(container).run({
      input: {
        region_id: region?.id as string,
        customer_id: subscription.customer_id as string,
        email: customer.email as string,
        currency_code: subscription.currency_code as string,
        items: items.map((item: any) => ({
          variant_id: item.variant_id as string,
          quantity: item.quantity as number,
        })),
      },
    });
    
    return new StepResponse({ cart });
  },
  async ({ cart }: { cart: any }, { container }) => {
    // Compensation: delete cart on failure
    const cartModule = container.resolve("cart") as any;
    if (cart?.id) {
      await cartModule.deleteCarts(cart.id);
    }
  }
);

// Step 4: Process payment
const processSubscriptionPaymentStep = createStep(
  "process-subscription-payment",
  async ({ cart, subscription }: { cart: any; subscription: any }, { container }) => {
    // In real implementation, would process payment using saved payment method
    // For now, mark as paid
    const paymentStatus = "paid";
    
    console.log(`Processing payment for subscription ${subscription.id}, cart ${cart.id}`);
    
    return new StepResponse({ payment_status: paymentStatus });
  }
);

// Step 5: Complete billing cycle
const completeBillingCycleStep = createStep(
  "complete-billing-cycle",
  async ({ cycle, cart, payment_status, subscription }: { cycle: any; cart: any; payment_status: string; subscription: any }, { container }) => {
    const subscriptionModule = container.resolve("subscription") as any;
    
    const isPaid = payment_status === "paid";
    
    // Update billing cycle
    const updatedCycle = await subscriptionModule.updateBillingCycles({
      id: cycle.id,
      status: isPaid ? "completed" : "failed",
      paid_at: isPaid ? new Date() : null,
      order_id: cart.id,
    });
    
    // If successful, create next billing cycle
    if (isPaid) {
      const nextBillingDate = new Date(cycle.billing_date);
      
      // Determine billing interval
      const interval = subscription.billing_interval || "month";
      if (interval === "month") {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else if (interval === "week") {
        nextBillingDate.setDate(nextBillingDate.getDate() + 7);
      } else if (interval === "year") {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }
      
      // Create next cycle
      await subscriptionModule.createBillingCycles({
        subscription_id: subscription.id,
        billing_date: nextBillingDate,
        status: "upcoming",
        attempt_count: 0,
      });
      
      // Update subscription next billing date
      await subscriptionModule.updateSubscriptions({
        id: subscription.id,
        next_billing_date: nextBillingDate,
      });
    }
    
    return new StepResponse({ 
      success: true,
      cycle: updatedCycle,
      payment_status 
    });
  }
);

export const processBillingCycleWorkflow = createWorkflow(
  "process-billing-cycle",
  (input: ProcessBillingCycleInput) => {
    // Load data
    const loadResult = loadBillingCycleStep(input);
    
    // Transform to get cycle for marking
    const cycleForMark = transform({ loadResult }, ({ loadResult }) => ({
      cycle: loadResult.cycle
    }));
    
    // Mark as processing
    const markResult = markCycleProcessingStep(cycleForMark);
    
    // Transform for order creation
    const orderInput = transform({ loadResult, markResult }, ({ loadResult, markResult }) => ({
      cycle: markResult.updatedCycle,
      subscription: loadResult.subscription,
      items: loadResult.items,
    }));
    
    // Create order
    const orderResult = createOrderFromSubscriptionStep(orderInput);
    
    // Transform for payment processing
    const paymentInput = transform({ orderResult, loadResult }, ({ orderResult, loadResult }) => ({
      cart: orderResult.cart,
      subscription: loadResult.subscription,
    }));
    
    // Process payment
    const paymentResult = processSubscriptionPaymentStep(paymentInput);
    
    // Transform for completion
    const completeInput = transform({ markResult, orderResult, paymentResult, loadResult }, ({ markResult, orderResult, paymentResult, loadResult }) => ({
      cycle: markResult.updatedCycle,
      cart: orderResult.cart,
      payment_status: paymentResult.payment_status,
      subscription: loadResult.subscription,
    }));
    
    // Complete cycle
    const result = completeBillingCycleStep(completeInput);
    
    return new WorkflowResponse(result);
  }
);
