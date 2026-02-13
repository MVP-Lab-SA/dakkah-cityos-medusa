import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type FlashSale = {
  id: string
  title: string
  description?: string
  discount_percentage: number
  start_date: string
  end_date: string
  product_ids: string[]
  max_uses?: number
  current_uses: number
  is_active: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type ProductBundle = {
  id: string
  title: string
  description?: string
  product_ids: string[]
  bundle_price: number
  original_price: number
  discount_percentage: number
  is_active: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useFlashSales(params?: { is_active?: boolean }) {
  return useQuery({
    queryKey: ["flash-sales", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.is_active !== undefined) searchParams.set("is_active", String(params.is_active))

      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/promotions-ext/flash-sales${query ? `?${query}` : ""}`)
      return response as { flash_sales: FlashSale[] }
    },
  })
}

export function useProductBundles(params?: { is_active?: boolean }) {
  return useQuery({
    queryKey: ["product-bundles", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.is_active !== undefined) searchParams.set("is_active", String(params.is_active))

      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/promotions-ext/bundles${query ? `?${query}` : ""}`)
      return response as { bundles: ProductBundle[] }
    },
  })
}

export function useCreateFlashSale() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<FlashSale>) => {
      const response = await sdk.client.fetch(`/admin/promotions-ext/flash-sales`, {
        method: "POST",
        body: data,
      })
      return response as { flash_sale: FlashSale }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] })
    },
  })
}

export function useCreateBundle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<ProductBundle>) => {
      const response = await sdk.client.fetch(`/admin/promotions-ext/bundles`, {
        method: "POST",
        body: data,
      })
      return response as { bundle: ProductBundle }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-bundles"] })
    },
  })
}
