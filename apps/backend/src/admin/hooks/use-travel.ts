import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type TravelProperty = {
  id: string
  tenant_id: string
  vendor_id?: string
  name: string
  description?: string
  property_type: "hotel" | "resort" | "hostel" | "apartment" | "villa" | "guesthouse" | "motel" | "boutique"
  star_rating?: number
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  country_code: string
  postal_code?: string
  latitude?: number
  longitude?: number
  check_in_time?: string
  check_out_time?: string
  phone?: string
  email?: string
  website?: string
  amenities?: Record<string, unknown>
  policies?: Record<string, unknown>
  images?: string[]
  is_active?: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useTravel() {
  return useQuery({
    queryKey: ["travel"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/travel", { method: "GET" })
      return response as { items: TravelProperty[]; count: number }
    },
  })
}

export function useCreateTravel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<TravelProperty>) => {
      const response = await sdk.client.fetch("/admin/travel", { method: "POST", body: data })
      return response as { item: TravelProperty }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["travel"] }),
  })
}
