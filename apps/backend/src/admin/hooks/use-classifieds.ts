import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type ClassifiedListing = {
  id: string
  tenant_id: string
  seller_id: string
  title: string
  description: string
  category_id?: string
  subcategory_id?: string
  listing_type: "sell" | "buy" | "trade" | "free" | "wanted"
  condition?: "new" | "like_new" | "good" | "fair" | "poor"
  price?: number
  currency_code: string
  is_negotiable?: boolean
  location_city?: string
  location_state?: string
  location_country?: string
  latitude?: number
  longitude?: number
  status: "draft" | "active" | "sold" | "expired" | "flagged" | "removed"
  expires_at?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useClassifieds() {
  return useQuery({
    queryKey: ["classifieds"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/classifieds", { method: "GET" })
      return response as { items: ClassifiedListing[]; count: number }
    },
  })
}

export function useCreateClassifiedListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<ClassifiedListing>) => {
      const response = await sdk.client.fetch("/admin/classifieds", { method: "POST", body: data })
      return response as { item: ClassifiedListing }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["classifieds"] }),
  })
}
