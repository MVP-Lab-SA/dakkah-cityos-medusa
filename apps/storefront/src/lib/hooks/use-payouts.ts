import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import type { Payout, PayoutSummary } from "@/lib/types/vendors"

export function usePayouts(options?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: queryKeys.payouts.list(options),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (options?.limit) params.set("limit", options.limit.toString())
      if (options?.offset) params.set("offset", options.offset.toString())

      const response = await sdk.client.fetch<{
        payouts: Payout[]
        summary: PayoutSummary
        count: number
      }>(`/vendor/payouts?${params}`, {
        credentials: "include",
      })
      return response
    },
  })
}

export function usePayoutSummary() {
  return useQuery({
    queryKey: queryKeys.payouts.summary(),
    queryFn: async () => {
      const response = await sdk.client.fetch<{ summary: PayoutSummary }>(
        "/vendor/payouts/summary",
        { credentials: "include" }
      )
      return response.summary
    },
  })
}

export function useRequestPayout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data?: { amount?: number }) => {
      return sdk.client.fetch("/vendor/payouts/request", {
        method: "POST",
        credentials: "include",
        body: data || {},
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payouts.all })
    },
  })
}
