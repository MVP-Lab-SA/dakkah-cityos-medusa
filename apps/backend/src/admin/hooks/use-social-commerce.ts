import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type SocialCommerceItem = {
  id: string
  tenant_id: string
  host_id: string
  title: string
  description?: string
  status?: "scheduled" | "live" | "ended" | "cancelled"
  stream_url?: string
  platform?: "internal" | "instagram" | "tiktok" | "youtube" | "facebook"
  scheduled_at?: string
  thumbnail_url?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useSocialCommerce() {
  return useQuery({
    queryKey: ["social-commerce"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/social-commerce", { method: "GET" })
      return response as { items: SocialCommerceItem[]; count: number }
    },
  })
}

export function useCreateSocialCommerce() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<SocialCommerceItem>) => {
      const response = await sdk.client.fetch("/admin/social-commerce", { method: "POST", body: data })
      return response as { item: SocialCommerceItem }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["social-commerce"] }),
  })
}
