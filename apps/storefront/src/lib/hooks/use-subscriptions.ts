import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../utils/sdk"
import type {
  SubscriptionPlan,
  Subscription,
  SubscriptionCheckoutData,
} from "../types/subscriptions"

// Query Keys
export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  plans: () => [...subscriptionKeys.all, "plans"] as const,
  plan: (id: string) => [...subscriptionKeys.plans(), id] as const,
  list: () => [...subscriptionKeys.all, "list"] as const,
  detail: (id: string) => [...subscriptionKeys.all, "detail", id] as const,
  invoices: (id: string) => [...subscriptionKeys.all, "invoices", id] as const,
}

// Mock data for development (replace with real API calls)
const mockPlans: SubscriptionPlan[] = [
  {
    id: "plan_starter",
    name: "Starter",
    handle: "starter",
    description: "Perfect for individuals and small projects",
    billing_interval: "monthly",
    price: 29,
    currency_code: "usd",
    trial_days: 14,
    features: [
      "Up to 100 orders/month",
      "Basic analytics",
      "Email support",
      "1 team member",
      "Standard integrations",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "plan_professional",
    name: "Professional",
    handle: "professional",
    description: "For growing businesses with advanced needs",
    billing_interval: "monthly",
    price: 99,
    currency_code: "usd",
    trial_days: 14,
    is_popular: true,
    features: [
      "Up to 1,000 orders/month",
      "Advanced analytics & reports",
      "Priority email & chat support",
      "5 team members",
      "All integrations",
      "Custom domain",
      "API access",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    handle: "enterprise",
    description: "For large organizations with custom requirements",
    billing_interval: "monthly",
    price: 299,
    currency_code: "usd",
    features: [
      "Unlimited orders",
      "Real-time analytics",
      "24/7 dedicated support",
      "Unlimited team members",
      "All integrations + custom",
      "White-label solution",
      "Full API access",
      "SLA guarantee",
      "Dedicated account manager",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockSubscriptions: Subscription[] = []

// Hooks
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: async () => {
      // In production, this would be:
      // const response = await sdk.client.fetch("/store/subscription-plans")
      // return response.plans

      // For now, return mock data
      return mockPlans
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useSubscriptionPlan(planId: string) {
  return useQuery({
    queryKey: subscriptionKeys.plan(planId),
    queryFn: async () => {
      // In production:
      // const response = await sdk.client.fetch(`/store/subscription-plans/${planId}`)
      // return response.plan

      return mockPlans.find((p) => p.id === planId || p.handle === planId)
    },
    enabled: !!planId,
  })
}

export function useCustomerSubscriptions() {
  return useQuery({
    queryKey: subscriptionKeys.list(),
    queryFn: async () => {
      // In production:
      // const response = await sdk.client.fetch("/store/customers/me/subscriptions")
      // return response.subscriptions

      return mockSubscriptions
    },
  })
}

export function useSubscription(subscriptionId: string) {
  return useQuery({
    queryKey: subscriptionKeys.detail(subscriptionId),
    queryFn: async () => {
      // In production:
      // const response = await sdk.client.fetch(`/store/subscriptions/${subscriptionId}`)
      // return response.subscription

      return mockSubscriptions.find((s) => s.id === subscriptionId)
    },
    enabled: !!subscriptionId,
  })
}

export function useCreateSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SubscriptionCheckoutData) => {
      // In production:
      // const response = await sdk.client.fetch("/store/subscriptions", {
      //   method: "POST",
      //   body: data,
      // })
      // return response.subscription

      // Mock implementation
      const plan = mockPlans.find((p) => p.id === data.plan_id)
      if (!plan) throw new Error("Plan not found")

      const newSubscription: Subscription = {
        id: `sub_${Date.now()}`,
        customer_id: "customer_123",
        plan_id: data.plan_id,
        plan,
        billing_interval: plan.billing_interval,
        status: plan.trial_days ? "trialing" : "active",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        trial_start: plan.trial_days ? new Date().toISOString() : undefined,
        trial_end: plan.trial_days
          ? new Date(
              Date.now() + plan.trial_days * 24 * 60 * 60 * 1000
            ).toISOString()
          : undefined,
        next_billing_date: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        items: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockSubscriptions.push(newSubscription)
      return newSubscription
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.list() })
    },
  })
}

export function usePauseSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      subscriptionId,
      resumeDate,
    }: {
      subscriptionId: string
      resumeDate?: string
    }) => {
      // In production:
      // const response = await sdk.client.fetch(`/store/subscriptions/${subscriptionId}/pause`, {
      //   method: "POST",
      //   body: { resume_date: resumeDate },
      // })
      // return response.subscription

      const subscription = mockSubscriptions.find(
        (s) => s.id === subscriptionId
      )
      if (subscription) {
        subscription.status = "paused"
        subscription.pause_start = new Date().toISOString()
        subscription.pause_end = resumeDate
      }
      return subscription
    },
    onSuccess: (_, { subscriptionId }) => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.detail(subscriptionId),
      })
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.list() })
    },
  })
}

export function useResumeSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      // In production:
      // const response = await sdk.client.fetch(`/store/subscriptions/${subscriptionId}/resume`, {
      //   method: "POST",
      // })
      // return response.subscription

      const subscription = mockSubscriptions.find(
        (s) => s.id === subscriptionId
      )
      if (subscription) {
        subscription.status = "active"
        subscription.pause_start = undefined
        subscription.pause_end = undefined
      }
      return subscription
    },
    onSuccess: (_, subscriptionId) => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.detail(subscriptionId),
      })
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.list() })
    },
  })
}

export function useCancelSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      subscriptionId,
      immediately,
    }: {
      subscriptionId: string
      immediately?: boolean
    }) => {
      // In production:
      // const response = await sdk.client.fetch(`/store/subscriptions/${subscriptionId}/cancel`, {
      //   method: "POST",
      //   body: { immediately },
      // })
      // return response.subscription

      const subscription = mockSubscriptions.find(
        (s) => s.id === subscriptionId
      )
      if (subscription) {
        subscription.status = "canceled"
        subscription.canceled_at = new Date().toISOString()
      }
      return subscription
    },
    onSuccess: (_, { subscriptionId }) => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.detail(subscriptionId),
      })
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.list() })
    },
  })
}

export function useChangePlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      subscriptionId,
      newPlanId,
    }: {
      subscriptionId: string
      newPlanId: string
    }) => {
      // In production:
      // const response = await sdk.client.fetch(`/store/subscriptions/${subscriptionId}/change-plan`, {
      //   method: "POST",
      //   body: { plan_id: newPlanId },
      // })
      // return response.subscription

      const subscription = mockSubscriptions.find(
        (s) => s.id === subscriptionId
      )
      const newPlan = mockPlans.find((p) => p.id === newPlanId)
      if (subscription && newPlan) {
        subscription.plan_id = newPlanId
        subscription.plan = newPlan
      }
      return subscription
    },
    onSuccess: (_, { subscriptionId }) => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.detail(subscriptionId),
      })
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.list() })
    },
  })
}
