import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
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
    const subscriptionModule = container.resolve("subscription") as Record<string, Function>;
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    
    const [cycles] = await subscriptionModule.listBillingCycles(
      { id: input.billing_cycle_id },
      { relations: ["subscription"] }
    );
    
    const cycle = cycles?.[0] as Record<string, unknown>;
    
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
      filters: { subscription_id: cycle.subscription_id },
    });
    
    return new StepResponse({ cycle, subscription: cycle.subscription, items });
  }
);

// Step 2: Update billing cycle to processing
const markCycleProcessingStep = createStep(
  "mark-cycle-processing",
  async ({ cycle }: { cycle: Record<string, unknown> }, { container }) => {
    const subscriptionModule = container.resolve("subscription") as Record<string, Function>;
    
    const updated = await subscriptionModule.updateBillingCycles({
      id: cycle.id,
      status: "processing",
      attempt_count: ((cycle.attempt_count as number) || 0) + 1,
      last_attempt_at: new Date(),
    });
    
    return new StepResponse(updated);
  }
);

// Step 3: Create order from subscription
const createOrderFromSubscriptionStep = createStep(
  "create-order-from-subscription",
  async ({ cycle, subscription, items }: { cycle: Record<string, unknown>; subscription: Record<string, unknown>; items: Record<string, unknown>[] }, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    
    // Get region for customer
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email"],
      filters: { id: subscription.customer_id },
    });
    
    const customer = customers[0] as Record<string, unknown>;
    if (!customer) {
      throw new Error(`Customer ${subscription.customer_id} not found`);
    }
    
    // Get default region
    const { data: regions } = await query.graph({
      entity: "region",
      fields: ["id"],
      pagination: { take: 1 },
    });
    
    const region = regions[0] as Record<string, unknown>;
    
    // Create cart
    const { result: cart } = await createCartWorkflow(container).run({
      input: {
        region_id: region?.id as string,
        customer_id: subscription.customer_id as string,
        email: customer.email as string,
        currency_code: subscription.currency_code as string,
        items: items.map((item: Record<string, unknown>) => ({
          variant_id: item.variant_id as string,
          quantity: item.quantity as number,
        })),
        metadata: {
          subscription_id: subscription.id,
          billing_cycle_id: cycle.id,
          is_subscription_order: true,
        },
      },
    });
    
    return new StepResponse({ cart }, { cart });
  },
  async ({ cart }: { cart: Record<string, unknown> }, { container }) => {
    // Rollback: delete cart
    if (cart?.id) {
      const cartModule = container.resolve("cart") as Record<string, Function>;
      await cartModule.deleteCarts(cart.id);
    }
  }
);

// Step 4: Process payment
const processSubscriptionPaymentStep = createStep(
  "process-subscription-payment",
  async ({ cart, subscription }: { cart: Record<string, unknown>; subscription: Record<string, unknown> }, { container }) => {
    // This would integrate with payment provider
    // For now, we'll simulate payment processing
    
    if (subscription.payment_collection_method === "charge_automatically") {
      // Charge payment method
      // const paymentModule = container.resolve("payment");
      // await paymentModule.capturePayment({
      //   payment_method_id: subscription.payment_method_id,
      //   amount: cart.total,
      //   currency: cart.currency_code,
      // });
    }
    
    return new StepResponse({ payment_status: "captured" });
  }
);

// Step 5: Complete order and billing cycle
const completeBillingCycleStep = createStep(
  "complete-billing-cycle",
  async (
    { cycle, cart, subscription }: { cycle: Record<string, unknown>; cart: Record<string, unknown>; subscription: Record<string, unknown> },
    { container }
  ) => {
    const subscriptionModule = container.resolve("subscription") as Record<string, Function>;
    
    // Update billing cycle
    await subscriptionModule.updateBillingCycles({
      id: cycle.id,
      status: "completed",
      order_id: cart.id,
      completed_at: new Date(),
    });
    
    // Update subscription period
    const nextPeriodStart = new Date(cycle.period_end as string);
    const nextPeriodEnd = new Date(nextPeriodStart);
    const intervalCount = subscription.billing_interval_count as number || 1;
    
    switch (subscription.billing_interval) {
      case "daily":
        nextPeriodEnd.setDate(nextPeriodEnd.getDate() + intervalCount);
        break;
      case "weekly":
        nextPeriodEnd.setDate(nextPeriodEnd.getDate() + 7 * intervalCount);
        break;
      case "monthly":
        nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + intervalCount);
        break;
      case "quarterly":
        nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 3 * intervalCount);
        break;
      case "yearly":
        nextPeriodEnd.setFullYear(nextPeriodEnd.getFullYear() + intervalCount);
        break;
    }
    
    await subscriptionModule.updateSubscriptions({
      id: subscription.id,
      current_period_start: nextPeriodStart,
      current_period_end: nextPeriodEnd,
      retry_count: 0, // Reset retry count on success
    });
    
    // Create next billing cycle
    await subscriptionModule.createBillingCycles({
      subscription_id: subscription.id,
      tenant_id: subscription.tenant_id,
      period_start: nextPeriodStart,
      period_end: nextPeriodEnd,
      billing_date: nextPeriodEnd,
      status: "upcoming",
      subtotal: subscription.subtotal,
      tax_total: subscription.tax_total,
      total: subscription.total,
    });
    
    return new StepResponse({ success: true });
  }
);

export const processBillingCycleWorkflow = createWorkflow(
  "process-billing-cycle",
  (input: ProcessBillingCycleInput) => {
    // Load data
    const { cycle, subscription, items } = loadBillingCycleStep(input);
    
    // Mark as processing
    const updatedCycle = markCycleProcessingStep({ cycle });
    
    // Create order
    const { cart } = createOrderFromSubscriptionStep({
      cycle: updatedCycle,
      subscription,
      items,
    });
    
    // Process payment
    const { payment_status } = processSubscriptionPaymentStep({
      cart,
      subscription,
    });
    
    // Complete cycle
    const result = completeBillingCycleStep({
      cycle: updatedCycle,
      cart,
      subscription,
    });
    
    return new WorkflowResponse(result);
  }
);
