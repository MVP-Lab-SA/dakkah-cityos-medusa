import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type MetricsSummary = {
  uptime: number
  requests: Record<string, unknown>
  errors: Record<string, unknown>
  [key: string]: unknown
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/metrics", {
        method: "GET",
        headers: { accept: "application/json" },
      })
      return response as MetricsSummary
    },
  })
}
