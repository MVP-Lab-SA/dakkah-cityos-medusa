import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type DigitalAsset = {
  id: string
  product_id: string
  title: string
  description?: string
  file_url: string
  file_name: string
  file_size: number
  file_type: string
  version?: string
  max_downloads?: number
  download_count: number
  is_active: boolean
  product?: {
    id: string
    title: string
    thumbnail?: string
  }
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useDigitalAssets(params?: { product_id?: string; is_active?: boolean }) {
  return useQuery({
    queryKey: ["digital-assets", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.product_id) searchParams.set("product_id", params.product_id)
      if (params?.is_active !== undefined) searchParams.set("is_active", String(params.is_active))

      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/digital-products${query ? `?${query}` : ""}`)
      return response as { assets: DigitalAsset[] }
    },
  })
}

export function useCreateDigitalAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<DigitalAsset>) => {
      const response = await sdk.client.fetch(`/admin/digital-products`, {
        method: "POST",
        body: data,
      })
      return response as { asset: DigitalAsset }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-assets"] })
    },
  })
}

export function useUpdateDigitalAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<DigitalAsset> & { id: string }) => {
      const response = await sdk.client.fetch(`/admin/digital-products/${id}`, {
        method: "PUT",
        body: data,
      })
      return response as { asset: DigitalAsset }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-assets"] })
    },
  })
}
