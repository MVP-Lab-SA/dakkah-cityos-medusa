import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type AdCampaign = {
  id: string
  tenant_id: string
  advertiser_id: string
  name: string
  description?: string
  campaign_type: "sponsored_listing" | "banner" | "search" | "social" | "email"
  status: "draft" | "pending_review" | "active" | "paused" | "completed" | "rejected"
  budget: number
  spent?: number
  currency_code: string
  daily_budget?: number
  bid_type?: "cpc" | "cpm" | "cpa" | "flat"
  bid_amount?: number
  targeting?: any
  starts_at?: string
  ends_at?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useAdvertising() {
  return useQuery({
    queryKey: ["advertising"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/advertising", { method: "GET" })
      return response as { items: AdCampaign[]; count: number }
    },
  })
}

export function useCreateAdCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<AdCampaign>) => {
      const response = await sdk.client.fetch("/admin/advertising", { method: "POST", body: data })
      return response as { item: AdCampaign }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["advertising"] }),
  })
}
