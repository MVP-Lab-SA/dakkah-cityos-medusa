import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type CrowdfundCampaign = {
  id: string
  tenant_id: string
  creator_id: string
  title: string
  description: string
  short_description?: string
  campaign_type: "reward" | "equity" | "donation" | "debt"
  status: "draft" | "pending_review" | "active" | "funded" | "failed" | "cancelled"
  goal_amount: number
  currency_code: string
  current_amount?: number
  backers_count?: number
  starts_at?: string
  ends_at: string
  is_flexible_funding?: boolean
  category?: string
  images?: any
  video_url?: string
  risks_and_challenges?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useCrowdfunding() {
  return useQuery({
    queryKey: ["crowdfunding"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/crowdfunding", { method: "GET" })
      return response as { items: CrowdfundCampaign[]; count: number }
    },
  })
}

export function useCreateCrowdfundCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<CrowdfundCampaign>) => {
      const response = await sdk.client.fetch("/admin/crowdfunding", { method: "POST", body: data })
      return response as { item: CrowdfundCampaign }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["crowdfunding"] }),
  })
}
