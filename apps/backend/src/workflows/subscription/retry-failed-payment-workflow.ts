import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk";
import { createStep } from "@medusajs/framework/workflows-sdk";

interface RetryFailedPaymentInput {
  subscription_id: string;
}

// Step 1: Check subscription and retry eligibility
const checkRetryEligibilityStep = createStep(
  "check-retry-eligibility",
  async (input: RetryFailedPaymentInput, { container }) => {
    const subscriptionModule = container.resolve("subscription");
    
    const subscription = await subscriptionModule.retrieveSubscription(input.subscription_id);
    
    if (!subscription) {
      throw new Error(`Subscription ${input.subscription_id} not found`);
    }
    
    if (subscription.status !== "past_due") {
      throw new Error(`Subscription ${input.subscription_id} is not in past_due status`);
    }
    
    if (subscription.retry_count >= subscription.max_retry_attempts) {
      throw new Error(`Subscription ${input.subscription_id} has exceeded max retry attempts`);
    }
    
    return { subscription };
  }
);

// Step 2: Attempt payment retry
const retryPaymentStep = createStep(
  "retry-payment",
  async ({ subscription }: any, { container }) => {
    const subscriptionModule = container.resolve("subscription");
    
    // Find the most recent failed billing cycle
    const { data: failedCycles } = await container.resolve("query").graph({
      entity: "billing_cycle",
      fields: ["*"],
      filters: {
        subscription_id: subscription.id,
        status: "failed",
      },
      pagination: {
        order: { created_at: "DESC" },
        take: 1,
      },
    });
    
    if (!failedCycles?.[0]) {
      throw new Error(`No failed billing cycle found for subscription ${subscription.id}`);
    }
    
    const cycle = failedCycles[0];
    
    // Attempt to process the billing cycle again
    // This would call the payment provider
    try {
      // Simulate payment retry
      // const paymentModule = container.resolve("payment");
      // const result = await paymentModule.retryPayment({
      //   payment_method_id: subscription.payment_method_id,
      //   amount: cycle.total,
      //   currency: subscription.currency_code,
      // });
      
      const success = Math.random() > 0.3; // 70% success rate simulation
      
      if (!success) {
        throw new Error("Payment failed");
      }
      
      return { success: true, cycle };
    } catch (error) {
      return { success: false, error: error.message, cycle };
    }
  }
);

// Step 3: Update subscription based on retry result
const updateSubscriptionStatusStep = createStep(
  "update-subscription-status",
  async ({ subscription, retryResult }: any, { container }) => {
    const subscriptionModule = container.resolve("subscription");
    
    if (retryResult.success) {
      // Payment succeeded - reactivate subscription
      await subscriptionModule.updateBillingCycles(retryResult.cycle.id, {
        status: "completed",
        completed_at: new Date(),
      });
      
      await subscriptionModule.updateSubscriptions(subscription.id, {
        status: "active",
        retry_count: 0,
        last_retry_at: new Date(),
        next_retry_at: null,
      });
      
      return { status: "active", message: "Payment retry successful" };
    } else {
      // Payment failed - update retry count
      const newRetryCount = subscription.retry_count + 1;
      const maxReached = newRetryCount >= subscription.max_retry_attempts;
      
      // Calculate next retry (exponential backoff)
      const retryDelays = [1, 3, 7]; // days
      const nextRetryDelay = retryDelays[newRetryCount - 1] || 7;
      const nextRetryDate = new Date();
      nextRetryDate.setDate(nextRetryDate.getDate() + nextRetryDelay);
      
      await subscriptionModule.updateSubscriptions(subscription.id, {
        status: maxReached ? "canceled" : "past_due",
        retry_count: newRetryCount,
        last_retry_at: new Date(),
        next_retry_at: maxReached ? null : nextRetryDate,
        canceled_at: maxReached ? new Date() : null,
      });
      
      return {
        status: maxReached ? "canceled" : "past_due",
        message: maxReached
          ? "Max retry attempts reached, subscription canceled"
          : `Payment retry failed, will retry on ${nextRetryDate.toISOString()}`,
      };
    }
  }
);

// Step 4: Send dunning notification
const sendDunningNotificationStep = createStep(
  "send-dunning-notification",
  async ({ subscription, result }: any, { container }) => {
    // Send email notification to customer
    // const notificationService = container.resolve("notification");
    
    const message =
      result.status === "canceled"
        ? "Your subscription has been canceled due to payment failure"
        : result.status === "active"
        ? "Your payment was successful and subscription is now active"
        : "Your payment failed, we will retry soon";
    
    // await notificationService.send({
    //   to: subscription.customer_email,
    //   template: "subscription-dunning",
    //   data: {
    //     subscription_id: subscription.id,
    //     status: result.status,
    //     message,
    //   },
    // });
    
    return { notificationSent: true };
  }
);

export const retryFailedPaymentWorkflow = createWorkflow(
  "retry-failed-payment",
  (input: RetryFailedPaymentInput) => {
    // Check eligibility
    const { subscription } = checkRetryEligibilityStep(input);
    
    // Retry payment
    const retryResult = retryPaymentStep({ subscription });
    
    // Update status
    const result = updateSubscriptionStatusStep({ subscription, retryResult });
    
    // Send notification
    sendDunningNotificationStep({ subscription, result });
    
    return new WorkflowResponse(result);
  }
);
