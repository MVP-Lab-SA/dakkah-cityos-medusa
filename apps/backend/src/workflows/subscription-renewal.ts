import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"

type SubscriptionRenewalInput = {
  subscriptionId: string
  customerId: string
  planId: string
  amount: number
  currency: string
}

const checkSubscriptionStep = createStep(
  "check-subscription-status-step",
  async (input: SubscriptionRenewalInput, { container }) => {
    const subscriptionModule = container.resolve("subscription") as any
    const subscription = await subscriptionModule.retrieveSubscription(input.subscriptionId)
    if (subscription.status !== "active") throw new Error("Subscription is not active")
    return new StepResponse({ subscription })
  }
)

const chargeRenewalStep = createStep(
  "charge-renewal-step",
  async (input: SubscriptionRenewalInput, { container }) => {
    const paymentModule = container.resolve("payment") as any
    const payment = await paymentModule.capturePayment({
      customer_id: input.customerId,
      amount: input.amount,
      currency: input.currency,
    })
    return new StepResponse({ payment }, { payment })
  }
)

const updateSubscriptionStep = createStep(
  "update-subscription-period-step",
  async (input: { subscriptionId: string }, { container }) => {
    const subscriptionModule = container.resolve("subscription") as any
    const updated = await subscriptionModule.updateSubscriptions({
      id: input.subscriptionId,
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      last_billed_at: new Date(),
    })
    return new StepResponse({ subscription: updated })
  }
)

export const subscriptionRenewalWorkflow = createWorkflow(
  "subscription-renewal-workflow",
  (input: SubscriptionRenewalInput) => {
    const { subscription } = checkSubscriptionStep(input)
    const { payment } = chargeRenewalStep(input)
    const updated = updateSubscriptionStep({ subscriptionId: input.subscriptionId })
    return new WorkflowResponse({ subscription: updated.subscription, payment })
  }
)
