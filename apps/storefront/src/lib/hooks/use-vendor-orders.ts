import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import type { VendorOrder } from "@/lib/types/vendors"

export function useVendorOrders() {
  return useQuery({
    queryKey: queryKeys.vendorOrders.all,
    queryFn: async () => {
      const response = await sdk.client.fetch<{ orders: VendorOrder[] }>("/vendor/orders", {
        credentials: "include",
      })
      return response.orders || []
    },
  })
}

export function useVendorOrder(orderId: string) {
  return useQuery({
    queryKey: queryKeys.vendorOrders.detail(orderId),
    queryFn: async () => {
      const response = await sdk.client.fetch<{ order: VendorOrder }>(
        `/vendor/orders/${orderId}`,
        { credentials: "include" }
      )
      return response.order
    },
    enabled: !!orderId,
  })
}

export function useFulfillVendorOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: string) => {
      return sdk.client.fetch(`/vendor/orders/${orderId}/fulfill`, {
        method: "POST",
        credentials: "include",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendorOrders.all })
    },
  })
}

export function useUpdateVendorOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return sdk.client.fetch(`/vendor/orders/${orderId}/status`, {
        method: "POST",
        credentials: "include",
        body: { status },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendorOrders.all })
    },
  })
}
