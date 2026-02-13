import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type LoyaltyProgram = {
  id: string
  name: string
  description?: string
  points_per_currency: number
  currency_per_point: number
  min_redemption_points: number
  is_active: boolean
  tiers?: {
    name: string
    min_points: number
    multiplier: number
    benefits: string[]
  }[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type LoyaltyAccount = {
  id: string
  customer_id: string
  program_id: string
  points_balance: number
  lifetime_points: number
  tier?: string
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

export type PointTransaction = {
  id: string
  account_id: string
  type: "earn" | "redeem" | "expire" | "adjust"
  points: number
  description?: string
  order_id?: string
  created_at: string
}

export function useLoyaltyPrograms() {
  return useQuery({
    queryKey: ["loyalty-programs"],
    queryFn: async () => {
      const response = await sdk.client.fetch(`/admin/loyalty/programs`)
      return response as { programs: LoyaltyProgram[] }
    },
  })
}

export function useLoyaltyAccounts(params?: { program_id?: string; customer_id?: string }) {
  return useQuery({
    queryKey: ["loyalty-accounts", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.program_id) searchParams.set("program_id", params.program_id)
      if (params?.customer_id) searchParams.set("customer_id", params.customer_id)

      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/loyalty/accounts${query ? `?${query}` : ""}`)
      return response as { accounts: LoyaltyAccount[] }
    },
  })
}

export function useCreateLoyaltyProgram() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<LoyaltyProgram>) => {
      const response = await sdk.client.fetch(`/admin/loyalty/programs`, {
        method: "POST",
        body: data,
      })
      return response as { program: LoyaltyProgram }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-programs"] })
    },
  })
}

export function useUpdateLoyaltyProgram() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<LoyaltyProgram> & { id: string }) => {
      const response = await sdk.client.fetch(`/admin/loyalty/programs/${id}`, {
        method: "PUT",
        body: data,
      })
      return response as { program: LoyaltyProgram }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-programs"] })
    },
  })
}
