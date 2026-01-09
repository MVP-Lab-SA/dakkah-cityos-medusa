import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk";
import { createStep } from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createCartWorkflow } from "@medusajs/medusa/core-flows";

interface ProcessBillingCycleInput {
  billing_cycle_id: string;
}

// Step 1: Load billing cycle and subscription
const loadBillingCycleStep = createStep(
  "load-billing-cycle",
  async (input: ProcessBillingCycleInput, { container }) => {
    const subscriptionModule = container.resolve("subscription");
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    
    const cycle = await subscriptionModule.retrieveBillingCycle(input.billing_cycle_id, {
      relations: ["subscription"],
    });
    
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
    
    return { cycle, subscription: cycle.subscription, items };
  }
);

// Step 2: Update billing cycle to processing
const markCycleProcessingStep = createStep(
  "mark-cycle-processing",
  async ({ cycle }: any, { container }) => {
    const subscriptionModule = container.resolve("subscription");
    
    return await subscriptionModule.updateBillingCycles(cycle.id, {
      status: "processing",
      attempt_count: cycle.attempt_count + 1,
      last_attempt_at: new Date(),
    });
  }
);

// Step 3: Create order from subscription
const createOrderFromSubscriptionStep = createStep(
  "create-order-from-subscription",
  async ({ cycle, subscription, items }: any, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    
    // Get region for customer
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "region_id", "email"],
      filters: { id: subscription.customer_id },
    });
    
    const customer = customers[0];
    if (!customer) {
      throw new Error(`Customer ${subscription.customer_id} not found`);
    }
    
    // Create cart
    const { result: cart } = await createCartWorkflow(container).run({
      input: {
        region_id: customer.region_id,
        customer_id: subscription.customer_id,
        email: customer.email,
        currency_code: subscription.currency_code,
        items: items.map((item: any) => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
        metadata: {
          subscription_id: subscription.id,
          billing_cycle_id: cycle.id,
          is_subscription_order: true,
        },
      },
    });
    
    return { cart };
  },
  async ({ cart }, { container }) => {
    // Rollback: delete cart
    if (cart?.id) {
      const cartModule = container.resolve("cart");
      await cartModule.deleteCarts(cart.id);
    }
  }
);

// Step 4: Process payment
const processSubscriptionPaymentStep = createStep(
  "process-subscription-payment",
  async ({ cart, subscription }: any, { container }) => {
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
    
    return { payment_status: "captured" };
  }
);

// Step 5: Complete order and billing cycle
const completeBillingCycleStep = createStep(
  "complete-billing-cycle",
  async (
    { cycle, cart, subscription }: any,
    { container }
  ) => {
    const subscriptionModule = container.resolve("subscription");
    
    // Update billing cycle
    await subscriptionModule.updateBillingCycles(cycle.id, {
      status: "completed",
      order_id: cart.id,
      completed_at: new Date(),
    });
    
    // Update subscription period
    const nextPeriodStart = new Date(cycle.period_end);
    let nextPeriodEnd = new Date(nextPeriodStart);
    
    switch (subscription.billing_interval) {
      case "daily":
        nextPeriodEnd.setDate(nextPeriodEnd.getDate() + subscription.billing_interval_count);
        break;
      case "weekly":
        nextPeriodEnd.setDate(nextPeriodEnd.getDate() + 7 * subscription.billing_interval_count);
        break;
      case "monthly":
        nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + subscription.billing_interval_count);
        break;
      case "quarterly":
        nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 3 * subscription.billing_interval_count);
        break;
      case "yearly":
        nextPeriodEnd.setFullYear(
          nextPeriodEnd.getFullYear() + subscription.billing_interval_count
        );
        break;
    }
    
    await subscriptionModule.updateSubscriptions(subscription.id, {
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
    
    return { success: true };
  }
);

// Step 6: Handle failure
const handleBillingFailureStep = createStep(
  "handle-billing-failure",
  async ({ cycle, error }: any, { container }) => {
    const subscriptionModule = container.resolve("subscription");
    
    // Calculate next retry time (exponential backoff)
    const retryDelays = [1, 3, 7]; // days
    const nextRetryDelay = retryDelays[cycle.attempt_count] || 7;
    const nextAttempt = new Date();
    nextAttempt.setDate(nextAttempt.getDate() + nextRetryDelay);
    
    await subscriptionModule.updateBillingCycles(cycle.id, {
      status: "failed",
      failed_at: new Date(),
      failure_reason: error.message,
      next_attempt_at: nextAttempt,
    });
    
    return { retryScheduled: true, nextAttempt };
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
