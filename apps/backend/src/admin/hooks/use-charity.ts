import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type Charity = {
  id: string
  tenant_id: string
  name: string
  description?: string
  registration_number?: string
  category: "education" | "health" | "environment" | "poverty" | "disaster" | "animal" | "arts" | "community" | "other"
  website?: string
  email?: string
  phone?: string
  address?: Record<string, unknown>
  logo_url?: string
  is_verified?: boolean
  verified_at?: string
  tax_deductible?: boolean
  total_raised?: number
  currency_code?: string
  is_active?: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useCharities() {
  return useQuery({
    queryKey: ["charities"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/charities", { method: "GET" })
      return response as { items: Charity[]; count: number }
    },
  })
}

export function useCreateCharity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Charity>) => {
      const response = await sdk.client.fetch("/admin/charities", { method: "POST", body: data })
      return response as { item: Charity }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["charities"] }),
  })
}
