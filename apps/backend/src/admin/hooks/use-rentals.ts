import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type Rental = {
  id: string
  tenant_id: string
  product_id: string
  rental_type: "daily" | "weekly" | "monthly" | "hourly" | "custom"
  base_price: number
  currency_code: string
  deposit_amount?: number
  late_fee_per_day?: number
  min_duration?: number
  max_duration?: number
  is_available?: boolean
  condition_on_listing?: "new" | "like_new" | "good" | "fair"
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useRentals() {
  return useQuery({
    queryKey: ["rentals"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/rentals", { method: "GET" })
      return response as { items: Rental[]; count: number }
    },
  })
}

export function useCreateRental() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Rental>) => {
      const response = await sdk.client.fetch("/admin/rentals", { method: "POST", body: data })
      return response as { item: Rental }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rentals"] }),
  })
}
