import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type GymMembership = {
  id: string
  tenant_id: string
  customer_id: string
  facility_id?: string
  membership_type: "basic" | "premium" | "vip" | "student" | "corporate" | "family"
  status: "active" | "frozen" | "expired" | "cancelled"
  start_date: string
  end_date?: string
  monthly_fee: number
  currency_code: string
  auto_renew?: boolean
  freeze_count?: number
  max_freezes?: number
  access_hours?: any
  includes?: any
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useFitness() {
  return useQuery({
    queryKey: ["fitness"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/fitness", { method: "GET" })
      return response as { items: GymMembership[]; count: number }
    },
  })
}

export function useCreateGymMembership() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<GymMembership>) => {
      const response = await sdk.client.fetch("/admin/fitness", { method: "POST", body: data })
      return response as { item: GymMembership }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fitness"] }),
  })
}
