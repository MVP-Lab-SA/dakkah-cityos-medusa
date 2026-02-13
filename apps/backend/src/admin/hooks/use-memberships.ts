import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type MembershipPlan = {
  id: string
  name: string
  description?: string
  price: number
  currency_code: string
  duration_days: number
  benefits: string[]
  max_members?: number
  is_active: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type MembershipEnrollment = {
  id: string
  plan_id: string
  customer_id: string
  status: "active" | "expired" | "canceled" | "suspended"
  start_date: string
  end_date: string
  auto_renew: boolean
  plan?: MembershipPlan
  customer?: {
    id: string
    email: string
    first_name?: string
    last_name?: string
  }
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useMembershipPlans(params?: { is_active?: boolean }) {
  return useQuery({
    queryKey: ["membership-plans", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.is_active !== undefined) searchParams.set("is_active", String(params.is_active))

      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/memberships/plans${query ? `?${query}` : ""}`)
      return response as { plans: MembershipPlan[] }
    },
  })
}

export function useMembershipEnrollments(params?: { plan_id?: string; status?: string; customer_id?: string }) {
  return useQuery({
    queryKey: ["membership-enrollments", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.plan_id) searchParams.set("plan_id", params.plan_id)
      if (params?.status) searchParams.set("status", params.status)
      if (params?.customer_id) searchParams.set("customer_id", params.customer_id)

      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/memberships/enrollments${query ? `?${query}` : ""}`)
      return response as { enrollments: MembershipEnrollment[] }
    },
  })
}

export function useCreatePlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<MembershipPlan>) => {
      const response = await sdk.client.fetch(`/admin/memberships/plans`, {
        method: "POST",
        body: data,
      })
      return response as { plan: MembershipPlan }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] })
    },
  })
}

export function useUpdatePlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<MembershipPlan> & { id: string }) => {
      const response = await sdk.client.fetch(`/admin/memberships/plans/${id}`, {
        method: "PUT",
        body: data,
      })
      return response as { plan: MembershipPlan }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] })
    },
  })
}
