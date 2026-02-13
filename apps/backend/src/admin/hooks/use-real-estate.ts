import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type PropertyListing = {
  id: string
  title: string
  description?: string | null
  property_type: "apartment" | "house" | "villa" | "land" | "commercial" | "office" | "warehouse" | "studio"
  listing_type: "sale" | "rent" | "lease" | "auction"
  price: number
  currency_code: string
  price_period?: "total" | "monthly" | "yearly" | "weekly" | null
  address_line1: string
  address_line2?: string | null
  city: string
  state?: string | null
  postal_code: string
  country_code: string
  latitude?: number | null
  longitude?: number | null
  bedrooms?: number | null
  bathrooms?: number | null
  area_sqm?: number | null
  year_built?: number | null
  tenant_id: string
  agent_id?: string | null
  features?: any
  images?: any
  virtual_tour_url?: string | null
  floor_plan_url?: string | null
  status?: "draft" | "active" | "under_offer" | "sold" | "rented" | "expired" | "withdrawn"
  metadata?: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export function usePropertyListings() {
  return useQuery({
    queryKey: ["real-estate"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/real-estate", { method: "GET" })
      return response as { items: PropertyListing[]; count: number }
    },
  })
}

export function useCreatePropertyListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<PropertyListing>) => {
      const response = await sdk.client.fetch("/admin/real-estate", { method: "POST", body: data })
      return response as { item: PropertyListing }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["real-estate"] }),
  })
}
