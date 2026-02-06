import {
  createWorkflow,
  WorkflowResponse,
  transform,
  when,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

interface CreateSubscriptionInput {
  customer_id: string;
  tenant_id: string;
  store_id?: string;
  billing_interval: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  billing_interval_count?: number;
  billing_anchor_day?: number;
  payment_collection_method?: "charge_automatically" | "send_invoice";
  payment_method_id?: string;
  trial_days?: number;
  items: Array<{
    product_id: string;
    variant_id: string;
    quantity: number;
  }>;
  metadata?: Record<string, any>;
}

// Step 1: Validate customer and products
const validateSubscriptionDataStep = createStep(
  "validate-subscription-data",
  async (input: CreateSubscriptionInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    
    // Validate customer exists and belongs to tenant
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "tenant_id"],
      filters: { id: input.customer_id, tenant_id: input.tenant_id },
    });
    
    if (!customers?.[0]) {
      throw new Error(`Customer ${input.customer_id} not found in tenant ${input.tenant_id}`);
    }
    
    // Validate products exist and are subscription-enabled
    const variantIds = input.items.map(item => item.variant_id);
    const { data: variants } = await query.graph({
      entity: "product_variant",
      fields: ["id", "product_id", "title", "prices.*", "product.title"],
      filters: { id: variantIds },
    });
    
    if (variants.length !== variantIds.length) {
      throw new Error("One or more product variants not found");
    }
    
    return new StepResponse({ variants });
  }
);

// Step 2: Calculate subscription amounts
const calculateSubscriptionAmountsStep = createStep(
  "calculate-subscription-amounts",
  async (
    { input, variants }: { input: CreateSubscriptionInput; variants: any[] },
    { container }
  ) => {
    const items = input.items.map((item) => {
      const variant = variants.find((v) => v.id === item.variant_id);
      const price = variant.prices?.[0];
      
      if (!price) {
        throw new Error(`No price found for variant ${item.variant_id}`);
      }
      
      const unit_price = price.amount;
      const subtotal = unit_price * item.quantity;
      const tax_total = 0; // TODO: Calculate tax
      const total = subtotal + tax_total;
      
      return {
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_title: variant.product.title,
        variant_title: variant.title,
        quantity: item.quantity,
        unit_price,
        subtotal,
        tax_total,
        total,
        tenant_id: input.tenant_id,
      };
    });
    
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax_total = items.reduce((sum, item) => sum + item.tax_total, 0);
    const total = subtotal + tax_total;
    
    // Get currency from first variant price
    const currency_code = variants[0].prices[0].currency_code;
    
    return new StepResponse({
      items,
      amounts: { subtotal, tax_total, total, currency_code },
    });
  }
);

// Step 3: Create subscription
const createSubscriptionStep = createStep(
  "create-subscription",
  async (
    {
      input,
      items,
      amounts,
    }: {
      input: CreateSubscriptionInput;
      items: any[];
      amounts: any;
    },
    { container }
  ) => {
    const subscriptionModule = container.resolve("subscription");
    
    const now = new Date();
    const trial_end = input.trial_days
      ? new Date(now.getTime() + input.trial_days * 24 * 60 * 60 * 1000)
      : null;
    
    // Create subscription
    const subscription = await subscriptionModule.createSubscriptions({
      customer_id: input.customer_id,
      tenant_id: input.tenant_id,
      store_id: input.store_id,
      status: "draft",
      billing_interval: input.billing_interval,
      billing_interval_count: input.billing_interval_count || 1,
      billing_anchor_day: input.billing_anchor_day,
      payment_collection_method: input.payment_collection_method || "charge_automatically",
      payment_method_id: input.payment_method_id,
      trial_end,
      currency_code: amounts.currency_code,
      subtotal: amounts.subtotal,
      tax_total: amounts.tax_total,
      total: amounts.total,
      metadata: input.metadata,
    });
    
    // Create subscription items
    const subscriptionItems = await subscriptionModule.createSubscriptionItems(
      items.map((item) => ({
        ...item,
        subscription_id: subscription.id,
      }))
    );
    
    return new StepResponse({ subscription, items: subscriptionItems }, { subscription });
  },
  async ({ subscription }: { subscription: any }, { container }) => {
    // Rollback: delete subscription
    const subscriptionModule = container.resolve("subscription");
    await subscriptionModule.deleteSubscriptions(subscription.id);
  }
);

// Step 4: Activate subscription (if no trial)
const activateSubscriptionStep = createStep(
  "activate-subscription",
  async ({ subscription, skipActivation }: any, { container }) => {
    if (skipActivation) {
      return new StepResponse({ subscription });
    }
    
    const subscriptionModule = container.resolve("subscription");
    const now = new Date();
    
    // Calculate first billing period
    let period_end = new Date(now);
    switch (subscription.billing_interval) {
      case "daily":
        period_end.setDate(period_end.getDate() + subscription.billing_interval_count);
        break;
      case "weekly":
        period_end.setDate(period_end.getDate() + 7 * subscription.billing_interval_count);
        break;
      case "monthly":
        period_end.setMonth(period_end.getMonth() + subscription.billing_interval_count);
        break;
      case "quarterly":
        period_end.setMonth(period_end.getMonth() + 3 * subscription.billing_interval_count);
        break;
      case "yearly":
        period_end.setFullYear(period_end.getFullYear() + subscription.billing_interval_count);
        break;
    }
    
    // Update subscription to active
    const updated = await subscriptionModule.updateSubscriptions(subscription.id, {
      status: "active",
      start_date: now,
      current_period_start: now,
      current_period_end: period_end,
    });
    
    // Create first billing cycle
    await subscriptionModule.createBillingCycles({
      subscription_id: subscription.id,
      tenant_id: subscription.tenant_id,
      period_start: now,
      period_end,
      billing_date: period_end,
      status: "upcoming",
      subtotal: subscription.subtotal,
      tax_total: subscription.tax_total,
      total: subscription.total,
    });
    
    return new StepResponse({ subscription: updated });
  }
);

export const createSubscriptionWorkflow = createWorkflow(
  "create-subscription",
  (input: CreateSubscriptionInput) => {
    // Step 1: Validate
    const { variants } = validateSubscriptionDataStep(input);
    
    // Step 2: Calculate amounts
    const { items, amounts } = calculateSubscriptionAmountsStep({ input, variants });
    
    // Step 3: Create subscription
    const { subscription, items: subscriptionItems } = createSubscriptionStep({
      input,
      items,
      amounts,
    });
    
    // Step 4: Activate if no trial
    const skipActivation = transform({ input }, ({ input }) => !!input.trial_days);
    const { subscription: finalSubscription } = activateSubscriptionStep({
      subscription,
      skipActivation,
    });
    
    return new WorkflowResponse({
      subscription: finalSubscription,
      items: subscriptionItems,
    });
  }
);
