import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"

export interface Vendor {
  id: string
  handle: string
  name: string
  description?: string
  logo?: string
  banner?: string
  rating?: number
  review_count?: number
  product_count?: number
  established_year?: number
  location?: string
  verified?: boolean
  metadata?: Record<string, unknown>
}

export function useVendors() {
  return useQuery({
    queryKey: queryKeys.vendors.all,
    queryFn: async () => {
      const response = await sdk.client.fetch<{ vendors: Vendor[] }>(
        "/store/vendors",
        {
          method: "GET",
          credentials: "include",
        },
      )
      return response.vendors || []
    },
  })
}

export function useVendor(handle: string) {
  return useQuery({
    queryKey: queryKeys.vendors.byHandle(handle),
    queryFn: async () => {
      const response = await sdk.client.fetch<{ vendor: Vendor }>(
        `/store/vendors/${handle}`,
        {
          method: "GET",
          credentials: "include",
        },
      )
      return response.vendor
    },
    enabled: !!handle,
  })
}

export function useVendorProducts(
  vendorId: string,
  options?: { limit?: number; offset?: number },
) {
  return useQuery({
    queryKey: [...queryKeys.vendors.byHandle(vendorId), "products", options],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (options?.limit) params.set("limit", options.limit.toString())
      if (options?.offset) params.set("offset", options.offset.toString())

      const response = await sdk.client.fetch<{
        products: Record<string, unknown>[]
        count: number
      }>(`/store/vendors/${vendorId}/products?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      })
      return response
    },
    enabled: !!vendorId,
  })
}
