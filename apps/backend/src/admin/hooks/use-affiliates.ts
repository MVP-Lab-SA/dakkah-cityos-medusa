import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type Affiliate = {
  id: string
  tenant_id: string
  customer_id?: string
  name: string
  email: string
  affiliate_type: "standard" | "influencer" | "partner" | "ambassador"
  status: "pending" | "approved" | "active" | "suspended" | "terminated"
  commission_rate: number
  commission_type?: "percentage" | "flat"
  payout_method?: "bank_transfer" | "paypal" | "store_credit"
  payout_minimum?: number
  bio?: string
  social_links?: any
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useAffiliates() {
  return useQuery({
    queryKey: ["affiliates"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/affiliates", { method: "GET" })
      return response as { items: Affiliate[]; count: number }
    },
  })
}

export function useCreateAffiliate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Affiliate>) => {
      const response = await sdk.client.fetch("/admin/affiliates", { method: "POST", body: data })
      return response as { item: Affiliate }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["affiliates"] }),
  })
}
