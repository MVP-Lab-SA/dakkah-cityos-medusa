import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type Restaurant = {
  id: string
  name: string
  description?: string
  cuisine_types?: string[]
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  postal_code: string
  country_code: string
  phone?: string
  email?: string
  tenant_id: string
  handle: string
  operating_hours?: Record<string, unknown>
  is_active?: boolean
  is_accepting_orders?: boolean
  avg_prep_time_minutes?: number
  delivery_radius_km?: number
  min_order_amount?: number
  delivery_fee?: number
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useRestaurants() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/restaurants", { method: "GET" })
      return response as { items: Restaurant[]; count: number }
    },
  })
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Restaurant>) => {
      const response = await sdk.client.fetch("/admin/restaurants", { method: "POST", body: data })
      return response as { item: Restaurant }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurants"] }),
  })
}
