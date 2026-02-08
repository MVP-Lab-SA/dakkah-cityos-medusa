import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import type { VendorAnalyticsSnapshot, VendorPerformanceMetric } from "@/lib/types/vendors"

export function useVendorAnalytics(options?: { period?: "daily" | "weekly" | "monthly"; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.vendorAnalytics.snapshots(options),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (options?.period) params.set("period", options.period)
      if (options?.limit) params.set("limit", options.limit.toString())

      const response = await sdk.client.fetch<{
        snapshots: VendorAnalyticsSnapshot[]
        count: number
      }>(`/vendor/analytics?${params}`, {
        credentials: "include",
      })
      return response
    },
  })
}

export function useVendorPerformance() {
  return useQuery({
    queryKey: queryKeys.vendorAnalytics.performance(),
    queryFn: async () => {
      const response = await sdk.client.fetch<{
        metrics: VendorPerformanceMetric[]
      }>("/vendor/analytics/performance", {
        credentials: "include",
      })
      return response.metrics || []
    },
  })
}
