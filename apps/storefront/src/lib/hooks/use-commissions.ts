import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import type { CommissionRule, CommissionTransaction, CommissionSummary } from "@/lib/types/vendors"

export function useCommissions(options?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: queryKeys.commissions.transactions(options),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (options?.limit) params.set("limit", options.limit.toString())
      if (options?.offset) params.set("offset", options.offset.toString())

      const response = await sdk.client.fetch<{
        commissions: CommissionTransaction[]
        summary: CommissionSummary
        count: number
      }>(`/vendor/commissions?${params}`, {
        credentials: "include",
      })
      return response
    },
  })
}

export function useCommissionRules() {
  return useQuery({
    queryKey: [...queryKeys.commissions.all, "rules"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ rules: CommissionRule[] }>(
        "/vendor/commissions/rules",
        { credentials: "include" }
      )
      return response.rules || []
    },
  })
}

export function useCommissionSummary() {
  return useQuery({
    queryKey: queryKeys.commissions.summary(),
    queryFn: async () => {
      const response = await sdk.client.fetch<{ summary: CommissionSummary }>(
        "/vendor/commissions/summary",
        { credentials: "include" }
      )
      return response.summary
    },
  })
}
