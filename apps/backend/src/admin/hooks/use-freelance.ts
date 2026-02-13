import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type FreelanceGig = {
  id: string
  tenant_id: string
  freelancer_id: string
  title: string
  description: string
  category?: string
  subcategory?: string
  listing_type: "fixed_price" | "hourly" | "milestone"
  price?: number
  hourly_rate?: number
  currency_code: string
  delivery_time_days?: number
  revisions_included?: number
  status?: "draft" | "active" | "paused" | "completed" | "suspended"
  skill_tags?: string[]
  portfolio_urls?: string[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useFreelanceGigs() {
  return useQuery({
    queryKey: ["freelance"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/freelance", { method: "GET" })
      return response as { items: FreelanceGig[]; count: number }
    },
  })
}

export function useCreateFreelanceGig() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<FreelanceGig>) => {
      const response = await sdk.client.fetch("/admin/freelance", { method: "POST", body: data })
      return response as { item: FreelanceGig }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["freelance"] }),
  })
}
