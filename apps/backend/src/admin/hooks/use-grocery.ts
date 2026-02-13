import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type GroceryProduct = {
  id: string
  tenant_id: string
  product_id: string
  storage_type: "ambient" | "chilled" | "frozen" | "live"
  shelf_life_days: number
  optimal_temp_min?: number
  optimal_temp_max?: number
  origin_country?: string
  organic?: boolean
  unit_type: "piece" | "kg" | "gram" | "liter" | "bunch" | "pack"
  min_order_quantity?: number
  is_seasonal?: boolean
  season_start?: string
  season_end?: string
  nutrition_info?: any
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useGroceryProducts() {
  return useQuery({
    queryKey: ["grocery"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/grocery", { method: "GET" })
      return response as { items: GroceryProduct[]; count: number }
    },
  })
}

export function useCreateGroceryProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<GroceryProduct>) => {
      const response = await sdk.client.fetch("/admin/grocery", { method: "POST", body: data })
      return response as { item: GroceryProduct }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["grocery"] }),
  })
}
