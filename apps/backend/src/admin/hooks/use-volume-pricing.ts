import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client"

export type VolumePricingTier = {
  id: string
  volume_pricing_id: string
  min_quantity: number
  max_quantity?: number
  discount_percentage?: number
  discount_amount?: number
  fixed_price?: number
  currency_code: string
}

export type VolumePricingRule = {
  id: string
  name: string
  description?: string
  applies_to: "product" | "variant" | "collection" | "category" | "all"
  target_id?: string
  pricing_type: "percentage" | "fixed" | "fixed_price"
  company_id?: string
  company_tier?: string
  priority: number
  status: "active" | "inactive" | "scheduled"
  starts_at?: string
  ends_at?: string
  tiers: VolumePricingTier[]
  target?: {
    id: string
    title?: string
    name?: string
    thumbnail?: string
  }
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useVolumePricingRules(params?: {
  status?: string
  applies_to?: string
  company_id?: string
}) {
  return useQuery({
    queryKey: ["volume-pricing", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set("status", params.status)
      if (params?.applies_to) searchParams.set("applies_to", params.applies_to)
      if (params?.company_id) searchParams.set("company_id", params.company_id)
      
      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/volume-pricing${query ? `?${query}` : ""}`)
      return response as { rules: VolumePricingRule[] }
    },
  })
}

export function useVolumePricingRule(id: string) {
  return useQuery({
    queryKey: ["volume-pricing", id],
    queryFn: async () => {
      const response = await sdk.client.fetch(`/admin/volume-pricing/${id}`)
      return response as { rule: VolumePricingRule }
    },
    enabled: !!id,
  })
}

export function useCreateVolumePricing() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: {
      name: string
      description?: string
      applies_to: string
      target_id?: string
      pricing_type: string
      company_id?: string
      company_tier?: string
      priority?: number
      status?: string
      starts_at?: string
      ends_at?: string
      tiers: Array<{
        min_quantity: number
        max_quantity?: number
        discount_percentage?: number
        discount_amount?: number
        fixed_price?: number
        currency_code?: string
      }>
    }) => {
      const response = await sdk.client.fetch(`/admin/volume-pricing`, {
        method: "POST",
        body: data,
      })
      return response as { rule: VolumePricingRule }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volume-pricing"] })
    },
  })
}

export function useUpdateVolumePricing() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: {
      id: string
      name?: string
      description?: string
      applies_to?: string
      target_id?: string
      pricing_type?: string
      company_id?: string
      company_tier?: string
      priority?: number
      status?: string
      starts_at?: string
      ends_at?: string
      tiers?: Array<{
        min_quantity: number
        max_quantity?: number
        discount_percentage?: number
        discount_amount?: number
        fixed_price?: number
        currency_code?: string
      }>
    }) => {
      const response = await sdk.client.fetch(`/admin/volume-pricing/${id}`, {
        method: "PUT",
        body: data,
      })
      return response as { rule: VolumePricingRule }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["volume-pricing"] })
      queryClient.invalidateQueries({ queryKey: ["volume-pricing", variables.id] })
    },
  })
}

export function useDeleteVolumePricing() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/volume-pricing/${id}`, {
        method: "DELETE",
      })
      return response as { success: boolean }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volume-pricing"] })
    },
  })
}
